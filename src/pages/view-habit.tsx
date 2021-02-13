import React, { useState } from 'react'
import { IconButton, Chip } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import { startOfMonth, endOfMonth } from 'date-fns'
import { useParams } from 'react-router-dom'
import { StreakDatepicker } from '../styleguide/streak-datepicker'
import { ConfirmDialog } from '../styleguide/confirm-dialog'
import { PageTitle } from '../styleguide/page-title'
import { habitFrequency } from '../utils/habit-utils'
import {
  useDeleteHabit,
  useHabitDetail,
  useHabitReps,
} from '../hooks/api/habits'

type Range = {
  min: number
  max: number
}

// TODO: custom spinner
export const ViewHabit: React.FC = () => {
  const { id } = useParams()
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [range, setRange] = useState<Range>({
    min: startOfMonth(new Date()).getTime(),
    max: endOfMonth(new Date()).getTime(),
  })

  const { data: habitDetail, ...habitDetailQuery } = useHabitDetail(id)
  const { data: reps, ...habitRepsQuery } = useHabitReps(id, range)

  const {
    mutate: deleteThisHabit,
    isLoading: isDeletingHabit,
  } = useDeleteHabit()

  if (habitDetailQuery.isLoading) return <p>Loading...</p>

  return (
    <>
      <ConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() =>
          deleteThisHabit(id, {
            onSettled: () => {
              setDialogOpen(false)
            },
          })
        }
        loading={isDeletingHabit}
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
        refetchReps={() => habitRepsQuery.refetch()}
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
