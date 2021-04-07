/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useSnackbar } from 'notistack'
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from 'react-query'
import { useNavigate } from 'react-router-dom'
import {
  JournalBriefASR,
  JournalFullASR,
} from 'trackbuddy-shared/responses/journals'
import {
  createNewJournal,
  getAllJournals,
  getJournalById,
  journalMadeToday,
  toggleJournalIsStarred,
  undoJournalEntry,
  updateJournal,
} from '../../api/journals'
import { ErrorResponse } from '../../types/error-response'
import { Filters, initialFilters } from '../../utils/journal-filters'

export const useJournals = (
  filters: Filters,
  options?: UseQueryOptions<JournalBriefASR[]>
) =>
  useQuery(['allJournals', filters], () => getAllJournals(filters), {
    enabled: options?.enabled || false,
    ...options,
  })

export const useTodayJournal = (
  options?: UseQueryOptions<{ found: boolean }>
) => useQuery('journalMadeToday', journalMadeToday, options)

export const useJournalById = (
  id: string,
  options?: UseQueryOptions<JournalFullASR>
) => useQuery(['getFullJournal', id], () => getJournalById(id), options)

export const useCreateJournal = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  return useMutation(createNewJournal, {
    onError: (err: ErrorResponse) => {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
    },
    onSettled: () => {
      navigate('/journals')
    },
  })
}

export const useUpdateJournal = (id: string) => {
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation(updateJournal, {
    onSuccess: () => {
      queryClient.invalidateQueries(['getFullJournal', id])
      enqueueSnackbar('Journal updated', { variant: 'success' })
    },
    onError: (err: ErrorResponse) => {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
    },
  })
}

export const useJournalToggleFavorite = () => {
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

export const useUndoJournal = () => {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(undoJournalEntry, {
    onSuccess: () => {
      queryClient.refetchQueries(['allJournals', initialFilters])
      queryClient.invalidateQueries('journalMadeToday')
    },
    onError: (err: ErrorResponse) => {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
    },
  })
}
