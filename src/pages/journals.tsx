import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import Add from '@material-ui/icons/Add'
import Search from '@material-ui/icons/Search'
import { Fab, IconButton } from '@material-ui/core'
import { getAllJournals, journalMadeToday } from '../api/journals'
import { JournalsFilter } from '../components/journals-filter'
import { JournalItem } from '../components/journal-item'
import { PageTitle } from '../styleguide/page-title'
import { Filters, initialFilters } from '../utils/journal-filters'

export const JournalsPage: React.FC = () => {
  const navigate = useNavigate()
  const [filterOpen, setFilterOpen] = useState<boolean>(false)
  const [filters, setFilters] = useState<Filters>(initialFilters)

  const monthAndYear = dayjs(new Date(filters.year, filters.month, 15)).format(
    'MMMM YYYY'
  )

  const { data: journals } = useQuery('allJournals', getAllJournals)
  const { data: foundJournal } = useQuery('journalMadeToday', journalMadeToday)

  return (
    <>
      <JournalsFilter
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onReset={() => setFilters(initialFilters)}
        filters={filters}
        setFilters={setFilters}
      />

      <div className="flex justify-between mt-4 mb-6">
        <PageTitle>{monthAndYear}</PageTitle>
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
