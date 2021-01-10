import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isToday, differenceInDays, startOfDay } from 'date-fns'
import { useDebounce } from 'use-debounce'
import { useQuery, useMutation, queryCache } from 'react-query'
import { HabitOverviewASR } from 'trackbuddy-shared/responses/habits'
import { useSnackbar } from 'notistack'
import {
  Fab,
  Box,
  LinearProgress,
  LinearProgressProps,
} from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import {
  getHabitsDashboard,
  createNewHabit,
  toggleHabitCheck,
} from '../api/habits'
import { PageTitle } from '../styleguide/page-title'
import { NewHabitDialog } from '../components/new-habit-dialog'
import { ErrorResponse } from '../types/error-response'
import { HabitColor } from '../utils/funcs'
import { HabitItem } from '../components/habit-item'
import { HabitItemSkeleton } from '../styleguide/habit-item-skeleton'

const LinearProgressWithLabel: React.FC<LinearProgressProps> = ({
  value,
  ...rest
}) => {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" value={value} {...rest} />
      </Box>
      <Box minWidth={35}>
        <p className="text-sm">{`${Math.round(value as number)}%`}</p>
      </Box>
    </Box>
  )
}

const saveHabitsToStorage = (habits: HabitOverviewASR[]): void => {
  const habitsToDoToday = habits?.filter(habit => {
    const lastRepDate = startOfDay(new Date(habit.newestRep))
    const diffInDays = differenceInDays(new Date(), lastRepDate)

    return diffInDays >= habit.frequency
  })
  // console.log('saving to storage')

  localStorage.setItem(
    'trackbuddy-today',
    JSON.stringify({ day: Date.now(), todos: habitsToDoToday })
  )
}

// TODO: refactor the 3 useEffects for local storage stuff
// the logic has to be different
// probably another API endpoint for that

// 1. on first fetch during the day, save todos to local storage
// 2. adjust that array whenever a habit is created or deleted

export const HabitsPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [habitsForToday, setHabitsForToday] = useState<HabitOverviewASR[]>([])
  const [habitsToGo, setHabitsToGo] = useState<number>(0)
  const [minutesToGo, setMinutesToGo] = useState<number>(0)
  const [totalTodayLength, setTotalTodayLength] = useState<number>(0)
  const [storageSave, setStorageSave] = useState<boolean>(false)
  const [shouldStorageSave] = useDebounce(storageSave, 500)

  const { data: habits, status } = useQuery(
    'habitsDashboard',
    getHabitsDashboard
  )

  useEffect(() => {
    return () => {
      localStorage.removeItem('trackbuddy-today')
    }
  }, [])

  // manually triggering save/load LS todos (new habit / deleted habit etc.)
  useEffect(() => {
    setStorageSave(false)
    if (shouldStorageSave) {
      saveHabitsToStorage(habits!)

      const storageTodos = JSON.parse(
        localStorage.getItem('trackbuddy-today') as string
      )

      if (isToday(storageTodos.day)) setHabitsForToday(storageTodos.todos)
    }
    // eslint-disable-next-line
  }, [shouldStorageSave])

  // loading and displaying habits to do for today
  useEffect(() => {
    if (habits) {
      // check if there's item in local storage
      const storageTodos = JSON.parse(
        localStorage.getItem('trackbuddy-today') as string
      )

      // if there isn't or it isn't for today, set it again
      // it gets set only once because it checks the timestamp
      if (!storageTodos || !isToday(new Date(storageTodos.day))) {
        saveHabitsToStorage(habits)
      }

      if (storageTodos) {
        if (isToday(storageTodos.day)) setHabitsForToday(storageTodos.todos)
      }
    }
  }, [habits])

  // recalculating how many habits and minutes are left for today
  useEffect(() => {
    let habToGo = 0
    let minToGo = 0

    if (habits) {
      habitsForToday.forEach(habit => {
        const habitToCheck = habits.find(hab => hab._id === habit._id)

        if (habitToCheck) {
          const hasBeenDoneToday = isToday(new Date(habitToCheck.newestRep))
          if (!hasBeenDoneToday) {
            habToGo += 1
            minToGo += habitToCheck.duration
          }
        }
      })

      const totalLengthForToday = habitsForToday.reduce(
        (acc, { duration }) => acc + duration,
        0
      )

      setHabitsToGo(habToGo)
      setMinutesToGo(minToGo)
      setTotalTodayLength(totalLengthForToday)
    }
  }, [habitsForToday, habits])

  const [submitNewHabit, { status: newHabitStatus }] = useMutation(
    createNewHabit,
    {
      onSuccess: () => {
        setStorageSave(true)
        enqueueSnackbar('Habit created', { variant: 'success' })
      },
      onError: (err: ErrorResponse) => {
        enqueueSnackbar(err.response.data.message, { variant: 'error' })
      },
      onSettled: () => {
        setDialogOpen(false)
        queryCache.invalidateQueries('habitsDashboard')
      },
    }
  )

  const [toggleHabit] = useMutation(toggleHabitCheck, {
    onSuccess: (_data, { lastCheckToday }) => {
      enqueueSnackbar(lastCheckToday ? 'Habit unchecked' : 'Habit checked', {
        variant: 'success',
      })
    },
    onError: () => {
      enqueueSnackbar('Cannot update repetitions', { variant: 'error' })
    },
    onSettled: () => {
      queryCache.invalidateQueries('habitsDashboard')
    },
  })

  const colorsTaken = habits && habits.map(({ color }) => color)
  const progressValue =
    ((totalTodayLength - minutesToGo) / totalTodayLength) * 100

  return (
    <>
      {habits && habits?.length > 0 && (
        <div className="mt-4 mb-6">
          <PageTitle className="mb-2">
            {progressValue === 100
              ? 'You rock! Keep it up!'
              : progressValue > 80
              ? 'Almost there!'
              : progressValue > 60
              ? 'Getting there!'
              : progressValue >= 50
              ? 'Halfway there!'
              : 'Your progress'}
          </PageTitle>
          <p className="font-semibold">Today&apos;s agenda:</p>
          <div className="flex justify-between">
            <p className="text-sm">{habitsToGo} habits to go</p>
            <p className="text-sm">{minutesToGo} minutes to go</p>
          </div>
          <div className="mt-2">
            <LinearProgressWithLabel
              variant="determinate"
              value={progressValue}
            />
          </div>
        </div>
      )}

      <NewHabitDialog
        open={dialogOpen}
        loading={newHabitStatus === 'loading'}
        onClose={() => setDialogOpen(false)}
        onSubmit={values => submitNewHabit(values)}
        colorsTaken={(colorsTaken ?? []) as HabitColor[]}
      />

      <PageTitle className="mt-4 mb-6">My habits</PageTitle>

      {status === 'loading' ? (
        <HabitItemSkeleton />
      ) : status === 'success' ? (
        habits!.map(habit => {
          const lastCheckIsToday = isToday(new Date(habit.newestRep))

          return (
            <HabitItem
              key={habit._id}
              habit={habit}
              lastCheckIsToday={lastCheckIsToday}
              onCardClick={() => navigate(`/habits/${habit._id}`)}
              onToggleClick={() =>
                toggleHabit({
                  id: habit._id,
                  day: lastCheckIsToday ? habit.newestRep : Date.now(),
                  lastCheckToday: lastCheckIsToday,
                })
              }
            />
          )
        })
      ) : (
        <p>Something went wrong</p>
      )}

      <Fab
        disabled={habits ? habits.length >= 5 : false}
        color="secondary"
        className="fixed bottom-4 right-4"
        onClick={() => setDialogOpen(true)}
      >
        <Add className="text-white" />
      </Fab>
    </>
  )
}
