/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useSnackbar } from 'notistack'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
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

export const useJournals = (filters: Filters, enabled = false) =>
  useQuery(['allJournals', filters], () => getAllJournals(filters), {
    enabled,
  })

export const useTodayJournal = () =>
  useQuery('journalMadeToday', journalMadeToday)

export const useJournalById = (id: string) =>
  useQuery(['getFullJournal', id], () => getJournalById(id))

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
