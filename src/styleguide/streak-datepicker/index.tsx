import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from 'react-query'
import { useSnackbar } from 'notistack'
import { startOfDay, endOfDay, isToday } from 'date-fns'
import enLocale from 'date-fns/locale/en-GB'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { toggleHabitCheck } from '../../api/habits'
import { ConfirmDialog } from '../confirm-dialog'
import { ErrorResponse } from '../../types/error-response'

const dayIsCompleted = (reps: number[], day: Date): boolean => {
  return !!reps.find(
    rep =>
      rep > startOfDay(new Date(day as Date)).getTime() &&
      rep < endOfDay(new Date(day as Date)).getTime()
  )
}

type Props = {
  reps: number[]
  onMonthChange: (newDate: unknown) => void
  allowPastEdits?: boolean
}

export const StreakDatepicker: React.FC<Props> = ({
  reps,
  onMonthChange,
  allowPastEdits,
}) => {
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const [date, setDate] = useState<Date>(new Date())
  const [dayIsChecked, setDayIsChecked] = useState<boolean>(false)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const [togglePastChecks, { status }] = useMutation(toggleHabitCheck, {
    onSuccess: (_data, { lastCheckToday }) => {
      enqueueSnackbar(`Habit ${lastCheckToday ? 'unchecked' : 'checked'}`, {
        variant: 'success',
      })
    },
    onError: (err: ErrorResponse) => {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
    },
    onSettled: () => {
      setDialogOpen(false)
    },
  })

  return (
    <>
      <ConfirmDialog
        open={dialogOpen}
        loading={status === 'loading'}
        onClose={() => setDialogOpen(false)}
        onConfirm={() =>
          togglePastChecks({
            id,
            day: date.getTime(),
            lastCheckToday: dayIsChecked,
          })
        }
        description={`Are you sure you want to ${
          dayIsChecked ? 'uncheck' : 'check'
        } this habit?`}
      />

      <div className="mx-auto">
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={enLocale}>
          <DatePicker
            disableToolbar
            orientation="landscape"
            openTo="date"
            variant="static"
            value={date}
            onChange={newDate => {
              // allow to retrospectively check/uncheck for non-today dates
              if (allowPastEdits && !isToday(new Date(newDate as Date))) {
                setDialogOpen(true)
                setDayIsChecked(dayIsCompleted(reps, newDate as Date))
                setDate(newDate as Date)
              }
            }}
            onMonthChange={onMonthChange}
            renderDay={(
              day,
              _selectedDate,
              _isInCurrentMonth,
              dayComponent
            ) => {
              const dayCompleted = dayIsCompleted(reps, day as Date)

              return dayCompleted ? (
                <div className="bg-green-400 rounded-full w-9 h-9 flex justify-center items-center">
                  {dayComponent}
                </div>
              ) : (
                dayComponent
              )
            }}
            disableFuture
          />
        </MuiPickersUtilsProvider>
      </div>
    </>
  )
}
