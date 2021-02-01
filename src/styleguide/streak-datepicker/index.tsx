import React, { useState } from 'react'
import { startOfDay, endOfDay, isToday } from 'date-fns'
import enLocale from 'date-fns/locale/en-GB'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { ConfirmDialog } from '../confirm-dialog'

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
  const [date, setDate] = useState<Date>(new Date())
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  return (
    <>
      <ConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => {}}
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
              if (allowPastEdits && !isToday(new Date(newDate as Date)))
                setDialogOpen(true)
              setDate(newDate as Date)
            }}
            onMonthChange={onMonthChange}
            renderDay={(
              day,
              _selectedDate,
              _isInCurrentMonth,
              dayComponent
            ) => {
              const dayCompleted = reps.find(
                rep =>
                  rep > startOfDay(new Date(day as Date)).getTime() &&
                  rep < endOfDay(new Date(day as Date)).getTime()
              )

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
