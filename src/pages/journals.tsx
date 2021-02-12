import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { useSnackbar } from 'notistack'
import { format } from 'date-fns'
import Add from '@material-ui/icons/Add'
import Search from '@material-ui/icons/Search'
import { Fab, IconButton } from '@material-ui/core'
import { getUsersTags } from '../api/profile'
import {
  getAllJournals,
  journalMadeToday,
  toggleJournalIsStarred,
} from '../api/journals'
import { JournalsFilter } from '../components/journals-filter'
import { JournalItem } from '../components/journal-item'
import { PageTitle } from '../styleguide/page-title'
import { Filters, initialFilters } from '../utils/journal-filters'
import { JournalItemSkeleton } from '../styleguide/journal-item-skeleton'
import { ErrorResponse } from '../types/error-response'
import { SomethingWentWrong } from '../styleguide/something-went-wrong'

const useTodayJournal = () => useQuery('journalMadeToday', journalMadeToday)
const useTags = () => useQuery('usersTags', getUsersTags)
const useJournals = (filters: Filters) =>
  useQuery(['allJournals', filters], () => getAllJournals(filters), {
    enabled: false,
  })

const useJournalToggle = () => {
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(toggleJournalIsStarred, {
    onSuccess: (_data, { isStarred }) => {
      enqueueSnackbar(
        isStarred ? 'Journal removed from starred' : 'Journal added to starred',
        { variant: 'success' }
      )
    },
    onError: (err: ErrorResponse) => {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
    },
  })
}

// TODO: custom spinners, tags logic
export const JournalsPage: React.FC = () => {
  const navigate = useNavigate()
  const [filterOpen, setFilterOpen] = useState<boolean>(false)
  const [filters, setFilters] = useState<Filters>(initialFilters)

  const monthAndYear = format(
    new Date(filters.year, filters.month, 15),
    'MMMM yyyy'
  )

  const journalsQuery = useJournals(filters)
  const todayJournalQuery = useTodayJournal()
  const tagsQuery = useTags()
  const { mutate: toggleStarred } = useJournalToggle()

  useEffect(() => {
    journalsQuery.refetch()
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
          journalsQuery.refetch()
        }}
        filters={filters}
        setFilters={setFilters}
        tags={tagsQuery.data}
      />

      <div className="flex justify-between mt-4 mb-6">
        <PageTitle>{monthAndYear}</PageTitle>
        <IconButton size="small" onClick={() => setFilterOpen(true)}>
          <Search />
        </IconButton>
      </div>

      {journalsQuery.isLoading && <JournalItemSkeleton />}
      {journalsQuery.isError && <SomethingWentWrong />}
      {journalsQuery.isSuccess && (
        <>
          {journalsQuery.data!.length > 0 ? (
            journalsQuery.data!.map(journal => (
              <JournalItem
                key={journal._id}
                journal={journal}
                onToggleStarred={() =>
                  toggleStarred(
                    {
                      id: journal._id,
                      isStarred: journal.isStarred,
                    },
                    {
                      onSettled: () => {
                        journalsQuery.refetch()
                      },
                    }
                  )
                }
                onCardClick={() => navigate(`/journals/${journal._id}`)}
              />
            ))
          ) : (
            <p>
              You have no journals during this period or no journals fit the
              criteria
            </p>
          )}
        </>
      )}

      <Fab
        disabled={todayJournalQuery.data?.found ?? false}
        color="secondary"
        className="fixed bottom-4 right-4"
        onClick={() => navigate('/journals/new')}
      >
        <Add className="text-white" />
      </Fab>
    </>
  )
}
