import React, { useState } from 'react'
import { formatDistanceToNow, isToday } from 'date-fns'
import { useQuery, useMutation, queryCache } from 'react-query'
import { useSnackbar } from 'notistack'
import { Fab, Paper, Radio } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import { getHabitsDashboard, createNewHabit } from '../api/habits'
import { PageTitle } from '../styleguide/page-title'
import { NewHabitDialog } from '../components/new-habit-dialog'
import { ErrorResponse } from '../types/error-response'

export const HabitsPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const { data } = useQuery('habitsDashboard', getHabitsDashboard)
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

  return (
    <>
      <NewHabitDialog
        open={dialogOpen}
        loading={newHabitStatus === 'loading'}
        onClose={() => setDialogOpen(false)}
        onSubmit={values => submitNewHabit(values)}
      />

      <PageTitle className="mt-4 mb-6">My habits</PageTitle>

      {data &&
        data.map(({ _id, color, duration, frequency, name, newestRep }) => (
          <Paper key={_id} className="p-4">
            <div className="h-full flex items-center">
              <Radio checked={isToday(new Date(newestRep))} className="mr-4" />
              <div>
                <p className="text-xl font-semibold">{name}</p>
                <p className="text-sm">
                  {duration} minutes, every {frequency} days
                </p>
              </div>
            </div>
          </Paper>
        ))}

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
