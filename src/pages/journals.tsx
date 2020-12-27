import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import Add from '@material-ui/icons/Add'
import Search from '@material-ui/icons/Search'
import { Fab, IconButton } from '@material-ui/core'
import { getAllJournals, journalMadeToday } from '../api/journals'
import { JournalsFilter } from '../components/journals-filter'
import { JournalItem } from '../components/journal-item'
import { PageTitle } from '../styleguide/page-title'

export const JournalsPage: React.FC = () => {
  const navigate = useNavigate()
  const [filterOpen, setFilterOpen] = useState<boolean>(false)

  const { data: journals } = useQuery('allJournals', getAllJournals)
  console.log(journals)

  const { data: foundJournal } = useQuery('journalMadeToday', journalMadeToday)

  return (
    <>
      <JournalsFilter open={filterOpen} onClose={() => setFilterOpen(false)} />

      <div className="flex justify-between">
        <PageTitle className="mb-6">My journals</PageTitle>
        <IconButton size="small" onClick={() => setFilterOpen(true)}>
          <Search />
        </IconButton>
      </div>

      {journals &&
        journals.map(journal => (
          // @ts-ignore
          <JournalItem key={journal._id} journal={journal} />
        ))}

      <Fab
        disabled={foundJournal?.found ?? false}
        color="secondary"
        className="fixed bottom-4 right-4"
        onClick={() => navigate('/journals/new')}
      >
        <Add className="text-white" />
      </Fab>
    </>
  )
}
