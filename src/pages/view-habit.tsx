import React, { useState } from 'react'
import { useSnackbar } from 'notistack'
import { IconButton, Chip } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import { startOfMonth, endOfMonth } from 'date-fns'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, queryCache } from 'react-query'
import { getHabitRepetitions, getHabitById, deleteHabit } from '../api/habits'
import { StreakDatepicker } from '../styleguide/streak-datepicker'
import { ErrorResponse } from '../types/error-response'
import { ConfirmDialog } from '../styleguide/confirm-dialog'
import { PageTitle } from '../styleguide/page-title'
import { habitFrequency, saveHabitsToStorage } from '../utils/habit-utils'

type Range = {
  min: number
  max: number
}

// TODO: custom spinner

export const ViewHabit: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [range, setRange] = useState<Range>({
    min: startOfMonth(new Date()).getTime(),
    max: endOfMonth(new Date()).getTime(),
  })

  const { data: habitDetail, status: detailStatus } = useQuery(
    ['habitDetail', id],
    getHabitById
  )

  const [deleteThisHabit, { status }] = useMutation(deleteHabit, {
    onSuccess: () => {
      const habitsForToday = JSON.parse(
        localStorage.getItem('trackbuddy-today') as string
      )
      // @ts-ignore
      saveHabitsToStorage(habitsForToday.todos.filter(todo => todo._id !== id))
      navigate('/habits')
      enqueueSnackbar('Habit deleted', { variant: 'success' })
    },
    onError: (err: ErrorResponse) => {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
    },
    onSettled: () => setDialogOpen(false),
  })

  const { data: reps, refetch: refetchReps } = useQuery(
    ['habitReps', id, range],
    getHabitRepetitions,
    {
      onSuccess: data => {
        queryCache.setQueryData(['habitReps', id], data)
      },
    }
  )

  if (detailStatus === 'loading') return <p>Loading...</p>

  return (
    <>
      <ConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => deleteThisHabit(id)}
        loading={status === 'loading'}
      />

      <PageTitle className="mt-4 mb-6">{habitDetail!.name}</PageTitle>
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Chip
            size="small"
            variant="outlined"
            color="primary"
            label={`${habitDetail!.duration} minutes`}
            className="bg-white"
          />
          <Chip
            size="small"
            variant="outlined"
            color="primary"
            label={habitFrequency[habitDetail!.frequency]}
            className="bg-white"
          />
        </div>

        <div>
          <IconButton size="small" className="mr-2">
            <Edit />
          </IconButton>
          <IconButton size="small" onClick={() => setDialogOpen(true)}>
            <Delete />
          </IconButton>
        </div>
      </div>

      <p className="my-6">
        {habitDetail!.description ?? '(No description provided)'}
      </p>

      <p className="text-lg font-semibold mb-2">Your streak</p>
      <StreakDatepicker
        reps={reps ?? []}
        allowPastEdits
        refetchReps={() => refetchReps()}
        onMonthChange={newDate => {
          setRange({
            min: startOfMonth(new Date(newDate as Date)).getTime(),
            max: endOfMonth(new Date(newDate as Date)).getTime(),
          })
        }}
      />
    </>
  )
}
