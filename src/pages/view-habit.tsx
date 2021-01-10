import React, { useState } from 'react'
import { startOfMonth, endOfDay } from 'date-fns'
import { useParams } from 'react-router-dom'
import { useQuery, queryCache } from 'react-query'
import { getHabitRepetitions } from '../api/habits'

type Range = {
  min: number
  max: number
}

export const ViewHabit: React.FC = () => {
  const { id } = useParams()
  const [range, setRange] = useState<Range>({
    min: startOfMonth(new Date()).getTime(),
    max: endOfDay(new Date()).getTime(),
  })

  const { data: reps, refetch: getReps } = useQuery(
    ['habitReps', id, range],
    getHabitRepetitions,
    {
      onSuccess: data => {
        queryCache.setQueryData(['habitReps', id], data)
      },
    }
  )
  // useEffect(() => {
  //   // @ts-ignore
  //   getReps({ force: true })
  //   // eslint-disable-next-line
  // }, [range])

  // const reps = queryCache.getQueryData(['habitReps', id])
  console.log(reps)

  return (
    <div>
      <p>View habit by id</p>
      {/* @ts-ignore */}
      <button type="button" onClick={() => getReps({ force: true })}>
        Get reps
      </button>
      <button type="button" onClick={() => setRange({ ...range, min: 0 })}>
        From 1.1.1970
      </button>

      <p>{JSON.stringify(reps)}</p>
    </div>
  )
}
