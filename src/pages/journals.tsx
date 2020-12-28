import React, { useState, useEffect } from 'react'
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
import { JournalItemSkeleton } from '../styleguide/journal-item-skeleton'

// TODO: custom spinners & <SomethingWentWrong />

export const JournalsPage: React.FC = () => {
  const navigate = useNavigate()
  const [filterOpen, setFilterOpen] = useState<boolean>(false)
  const [filters, setFilters] = useState<Filters>(initialFilters)

  const monthAndYear = dayjs(new Date(filters.year, filters.month, 15)).format(
    'MMMM YYYY'
  )

  const {
    data: journals,
    status: journalsStatus,
    refetch: refetchJournals,
  } = useQuery(['allJournals', filters], getAllJournals, {
    enabled: false,
  })
  const { data: foundJournal } = useQuery('journalMadeToday', journalMadeToday)

  useEffect(() => {
    refetchJournals()
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <JournalsFilter
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onReset={() => setFilters(initialFilters)}
        onApply={() => {
          setFilterOpen(false)
          refetchJournals()
        }}
        filters={filters}
        setFilters={setFilters}
      />

      <div className="flex justify-between mt-4 mb-6">
        <PageTitle>{monthAndYear}</PageTitle>
        <IconButton size="small" onClick={() => setFilterOpen(true)}>
          <Search />
        </IconButton>
      </div>

      {journalsStatus === 'loading' ? (
        <JournalItemSkeleton />
      ) : journalsStatus === 'success' ? (
        <>
          {journals!.length > 0 ? (
            journals!.map(journal => (
              <JournalItem key={journal._id} journal={journal} />
            ))
          ) : (
            <p>
              You have no journals during this period or no journals fit the
              criteria
            </p>
          )}
        </>
      ) : (
        <p>Something went wrong</p>
      )}

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
