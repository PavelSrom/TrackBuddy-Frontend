/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useSnackbar } from 'notistack'
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from 'react-query'
import { useNavigate } from 'react-router-dom'
import {
  HabitFullASR,
  HabitOverviewASR,
} from 'trackbuddy-shared/responses/habits'
import {
  createNewHabit,
  deleteHabit,
  getHabitById,
  getHabitRepetitions,
  getHabitsDashboard,
  toggleHabitCheck,
} from '../../api/habits'
import { ErrorResponse } from '../../types/error-response'
import { saveHabitsToStorage } from '../../utils/habit-utils'

export const useHabits = (options?: UseQueryOptions<HabitOverviewASR[]>) =>
  useQuery('habitsDashboard', getHabitsDashboard, options)

export const useHabitDetail = (
  id: string,
  options?: UseQueryOptions<HabitFullASR & { description: string }>
) => useQuery(['habitDetail', id], () => getHabitById(id), options)

export const useCreateHabit = (habitsForToday: HabitOverviewASR[]) => {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(createNewHabit, {
    onSuccess: data => {
      // // manually re-update todos in local storage
      saveHabitsToStorage([...habitsForToday, { ...data, newestRep: 0 }])
      enqueueSnackbar('Habit created', { variant: 'success' })
    },
    onError: (err: ErrorResponse) => {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
    },
    onSettled: () => {
      queryClient.invalidateQueries('habitsDashboard')
    },
  })
}

export const useDeleteHabit = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(deleteHabit, {
    onSuccess: (_data, id) => {
      const habitsForToday = JSON.parse(
        localStorage.getItem('trackbuddy-today') as string
      )
      saveHabitsToStorage(
        // @ts-ignore
        habitsForToday.todos.filter(todo => todo._id !== id)
      )

      navigate('/habits')
      enqueueSnackbar('Habit deleted', { variant: 'success' })
    },
    onError: (err: ErrorResponse) => {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
    },
  })
}

export const useToggleHabit = () => {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(toggleHabitCheck, {
    onSuccess: (_data, { lastCheckToday }) => {
      enqueueSnackbar(lastCheckToday ? 'Habit unchecked' : 'Habit checked', {
        variant: 'success',
      })
    },
    onError: () => {
      enqueueSnackbar('Cannot update repetitions', { variant: 'error' })
    },
    onSettled: () => {
      queryClient.invalidateQueries('habitsDashboard')
    },
  })
}

export const useHabitReps = (
  id: string,
  range: { min: number; max: number },
  options?: Omit<UseQueryOptions<number[]>, 'onSuccess'>
) => {
  const queryClient = useQueryClient()

  return useQuery(
    ['habitReps', id, range],
    () => getHabitRepetitions(id, range),
    {
      ...options,
      onSuccess: data => {
        queryClient.setQueryData(['habitReps', id], data)
      },
    }
  )
}
