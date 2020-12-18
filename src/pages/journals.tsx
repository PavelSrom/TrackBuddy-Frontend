import React from 'react'
import { useQuery } from 'react-query'
import { getAllJournals } from '../api/journals'

export const JournalsPage: React.FC = () => {
  const { data } = useQuery('allJournals', getAllJournals)
  console.log(data)

  return (
    <div>
      <p>Journals page</p>
    </div>
  )
}
