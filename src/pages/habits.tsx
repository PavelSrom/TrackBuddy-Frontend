import React, { useState } from 'react'
import { isToday } from 'date-fns'
import { useQuery, useMutation, queryCache } from 'react-query'
import { useSnackbar } from 'notistack'
import { Fab } from '@material-ui/core'
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

export const HabitsPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const { data, status } = useQuery('habitsDashboard', getHabitsDashboard)
  console.log(data)

  const [submitNewHabit, { status: newHabitStatus }] = useMutation(
    createNewHabit,
    {
      onSuccess: () => {
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

  const colorsTaken = data && data.map(({ color }) => color)

  return (
    <>
      <NewHabitDialog
        open={dialogOpen}
        loading={newHabitStatus === 'loading'}
        onClose={() => setDialogOpen(false)}
        onSubmit={values => submitNewHabit(values)}
        colorsTaken={(colorsTaken ?? []) as HabitColor[]}
      />

      <p>Progress bar coming soon</p>
      <PageTitle className="mt-4 mb-6">My habits</PageTitle>

      {status === 'loading' ? (
        <HabitItemSkeleton />
      ) : status === 'success' ? (
        data!.map(habit => {
          const lastCheckIsToday = isToday(new Date(habit.newestRep))

          return (
            <HabitItem
              key={habit._id}
              habit={habit}
              lastCheckIsToday={lastCheckIsToday}
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
        disabled={data ? data.length > 5 : false}
        color="secondary"
        className="fixed bottom-4 right-4"
        onClick={() => setDialogOpen(true)}
      >
        <Add className="text-white" />
      </Fab>
    </>
  )
}
