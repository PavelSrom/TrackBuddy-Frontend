import React from 'react'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useSnackbar } from 'notistack'
import { Formik } from 'formik'
import { JournalFullASP } from 'trackbuddy-shared/payloads/journals'
import { getUsersTags } from '../api/profile'
import { createNewJournal, undoJournalEntry } from '../api/journals'
import { JournalEntryForm } from '../components/journal-entry-form'
import { PageTitle } from '../styleguide/page-title'
import { Button } from '../styleguide/button'
import { ErrorResponse } from '../types/error-response'
import { initialFilters } from '../utils/journal-filters'
import { journalEntrySchema } from '../utils/validations'

const initialValues: JournalFullASP = {
  mood: 3,
  standout: '',
  wentWell: '',
  wentWrong: '',
  betterNextTime: '',
  excuses: '',
  tags: [],
}

const useTags = () => useQuery('usersTags', getUsersTags)

const useUndoJournal = () => {
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

const useCreateJournal = () => {
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

export const NewJournalPage: React.FC = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const todayDate = format(new Date(), 'd MMMM yyyy')

  const { data: tags } = useTags()
  const { mutateAsync: undo } = useUndoJournal()
  const {
    mutate: submitEntry,
    isLoading: isCreatingJournal,
  } = useCreateJournal()

  const handleSubmit = (values: JournalFullASP): void => {
    submitEntry(values, {
      onSuccess: ({ _id }) => {
        enqueueSnackbar('Journal entry created', {
          variant: 'default',
          action: key => (
            <Button
              variant="text"
              color="secondary"
              onClick={() => {
                // make a request and close the snackbar no matter what
                undo(_id).finally(() => closeSnackbar(key))
              }}
            >
              Undo
            </Button>
          ),
        })
      },
    })
  }

  return (
    <>
      <PageTitle className="mt-4 mb-6">{todayDate}</PageTitle>

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={journalEntrySchema}
      >
        <JournalEntryForm
          loading={isCreatingJournal}
          availableTags={tags ?? []}
        />
      </Formik>
    </>
  )
}
