import React from 'react'
import { format } from 'date-fns'
import { useSnackbar } from 'notistack'
import { Formik } from 'formik'
import { JournalFullASP } from 'trackbuddy-shared/payloads/journals'
import { JournalEntryForm } from '../components/journal-entry-form'
import { PageTitle } from '../styleguide/page-title'
import { Button } from '../styleguide/button'
import { journalEntrySchema } from '../utils/validations'
import { useTags } from '../hooks/api/profile'
import { useCreateJournal, useUndoJournal } from '../hooks/api/journals'

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
