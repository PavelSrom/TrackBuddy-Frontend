import React, { useState } from 'react'
import { useSnackbar } from 'notistack'
import { IconButton } from '@material-ui/core'
import Delete from '@material-ui/icons/Delete'
import { startOfMonth, endOfMonth } from 'date-fns'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, queryCache } from 'react-query'
import { getHabitRepetitions, deleteHabit } from '../api/habits'
import { StreakDatepicker } from '../styleguide/streak-datepicker'
import { ErrorResponse } from '../types/error-response'
import { ConfirmDialog } from '../styleguide/confirm-dialog'

type Range = {
  min: number
  max: number
}

export const ViewHabit: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [range, setRange] = useState<Range>({
    min: startOfMonth(new Date()).getTime(),
    max: endOfMonth(new Date()).getTime(),
  })

  const [deleteThisHabit, { status }] = useMutation(deleteHabit, {
    onSuccess: () => {
      navigate('/habits')
      enqueueSnackbar('Habit deleted', { variant: 'success' })
    },
    onError: (err: ErrorResponse) => {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
    },
    onSettled: () => setDialogOpen(false),
  })

  const { data: reps } = useQuery(
    ['habitReps', id, range],
    getHabitRepetitions,
    {
      onSuccess: data => {
        queryCache.setQueryData(['habitReps', id], data)
      },
    }
  )

  return (
    <>
      <ConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => deleteThisHabit(id)}
        loading={status === 'loading'}
      />
      <IconButton onClick={() => setDialogOpen(true)}>
        <Delete />
      </IconButton>

      <StreakDatepicker
        reps={reps ?? []}
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
