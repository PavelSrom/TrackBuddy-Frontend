/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useSnackbar } from 'notistack'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import {
  createNewHabit,
  deleteHabit,
  getHabitById,
  getHabitRepetitions,
  getHabitsDashboard,
  toggleHabitCheck,
} from '../../api/habits'
import { ErrorResponse } from '../../types/error-response'

export const useHabits = () => useQuery('habitsDashboard', getHabitsDashboard)

export const useHabitDetail = (id: string) =>
  useQuery(['habitDetail', id], () => getHabitById(id))

export const useCreateHabit = () => {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(createNewHabit, {
    onSuccess: () => {
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
    onSuccess: () => {
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
  range: { min: number; max: number }
) => {
  const queryClient = useQueryClient()

  return useQuery(
    ['habitReps', id, range],
    () => getHabitRepetitions(id, range),
    {
      onSuccess: data => {
        queryClient.setQueryData(['habitReps', id], data)
      },
    }
  )
}
