import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import Add from '@material-ui/icons/Add'
import { Fab } from '@material-ui/core'
import { getAllJournals } from '../api/journals'
import { JournalItem } from '../components/journal-item'

export const JournalsPage: React.FC = () => {
  const navigate = useNavigate()
  const { data } = useQuery('allJournals', getAllJournals)
  console.log(data)

  return (
    <div>
      <p>Journals page</p>

      {data &&
        data.map(journal => (
          // @ts-ignore
          <JournalItem key={journal._id} journal={journal} />
        ))}

      <Fab
        color="secondary"
        className="fixed bottom-4 right-4"
        onClick={() => navigate('/journals/new')}
      >
        <Add className="text-white" />
      </Fab>
    </div>
  )
}
