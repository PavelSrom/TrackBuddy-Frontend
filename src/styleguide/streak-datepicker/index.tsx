import React, { useState } from 'react'
import { startOfDay, endOfDay } from 'date-fns'
import enLocale from 'date-fns/locale/en-GB'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

type Props = {
  reps: number[]
  onMonthChange: (newDate: unknown) => void
}

export const StreakDatepicker: React.FC<Props> = ({ reps, onMonthChange }) => {
  const [date, setDate] = useState<Date>(new Date())

  return (
    <div className="mx-auto">
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={enLocale}>
        <DatePicker
          disableToolbar
          orientation="landscape"
          openTo="date"
          variant="static"
          value={date}
          onChange={newDate => setDate(newDate as Date)}
          onMonthChange={onMonthChange}
          renderDay={(day, _selectedDate, _isInCurrentMonth, dayComponent) => {
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
  )
}
