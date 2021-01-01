import React from 'react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, queryCache } from 'react-query'
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

export const NewJournalPage: React.FC = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const todayDate = dayjs(new Date()).format('D MMMM YYYY')

  const { data: tags } = useQuery('usersTags', getUsersTags)

  const [undo] = useMutation(undoJournalEntry, {
    onSuccess: () => {
      queryCache.refetchQueries(['allJournals', initialFilters])
      queryCache.invalidateQueries('journalMadeToday')
    },
    onError: (err: ErrorResponse) => {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
    },
  })

  const [submitEntry, { status }] = useMutation(createNewJournal, {
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
    onError: (err: ErrorResponse) => {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
    },
    onSettled: () => {
      navigate('/journals')
    },
  })

  const handleSubmit = (values: JournalFullASP): void => {
    submitEntry(values)
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
          loading={status === 'loading'}
          availableTags={tags ?? []}
        />
      </Formik>
    </>
  )
}
