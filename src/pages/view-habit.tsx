import React, { useState } from 'react'
import { startOfMonth, endOfMonth } from 'date-fns'
import { useParams } from 'react-router-dom'
import { useQuery, queryCache } from 'react-query'
import { getHabitRepetitions } from '../api/habits'
import { StreakDatepicker } from '../styleguide/streak-datepicker'

type Range = {
  min: number
  max: number
}

export const ViewHabit: React.FC = () => {
  const { id } = useParams()
  const [range, setRange] = useState<Range>({
    min: startOfMonth(new Date()).getTime(),
    max: endOfMonth(new Date()).getTime(),
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
  // console.log(reps)

  return (
    <div>
      <p>View habit by id</p>

      <p className="mb-8">{JSON.stringify(reps)}</p>

      <StreakDatepicker
        reps={reps ?? []}
        onMonthChange={newDate => {
          setRange({
            min: startOfMonth(new Date(newDate as Date)).getTime(),
            max: endOfMonth(new Date(newDate as Date)).getTime(),
          })
        }}
      />
    </div>
  )
}
