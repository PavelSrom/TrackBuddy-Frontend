import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { startOfDay, endOfDay, isToday } from 'date-fns'
import enLocale from 'date-fns/locale/en-GB'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { ConfirmDialog } from '../confirm-dialog'
import { useToggleHabit } from '../../hooks/api/habits'

const dayIsCompleted = (reps: number[], day: Date): number | undefined => {
  return reps.find(
    rep =>
      rep > startOfDay(new Date(day as Date)).getTime() &&
      rep < endOfDay(new Date(day as Date)).getTime()
  )
}

type Props = {
  reps: number[]
  onMonthChange: (newDate: unknown) => void
  allowPastEdits?: boolean
  refetchReps?: () => void
}

export const StreakDatepicker: React.FC<Props> = ({
  reps,
  onMonthChange,
  allowPastEdits,
  refetchReps,
}) => {
  const { id } = useParams()
  const [date, setDate] = useState<Date>(new Date())
  const [dayIsChecked, setDayIsChecked] = useState<boolean>(false)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const { mutate: togglePastChecks, isLoading: isToggling } = useToggleHabit()

  return (
    <>
      <ConfirmDialog
        open={dialogOpen}
        loading={isToggling}
        onClose={() => setDialogOpen(false)}
        onConfirm={() =>
          togglePastChecks(
            {
              id,
              day: date.getTime(),
              lastCheckToday: dayIsChecked,
            },
            {
              onSettled: () => {
                setDialogOpen(false)
                refetchReps?.()
              },
            }
          )
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
                const dayCompleted = dayIsCompleted(reps, newDate as Date)

                setDialogOpen(true)
                setDayIsChecked(!!dayCompleted)
                setDate(
                  dayCompleted ? new Date(dayCompleted!) : (newDate as Date)
                )
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
                <div className="bg-green-400 rounded-full">{dayComponent}</div>
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
