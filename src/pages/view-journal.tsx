import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Formik } from 'formik'
import { JournalFullASP } from 'trackbuddy-shared/payloads/journals'
import { useQuery, useMutation, queryCache } from 'react-query'
import { useSnackbar } from 'notistack'
import { isToday, format } from 'date-fns'
import { Paper, IconButton, Chip } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Close from '@material-ui/icons/Close'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
import {
  getJournalById,
  toggleJournalIsStarred,
  updateJournal,
} from '../api/journals'
import { JournalEntryForm } from '../components/journal-entry-form'
import { PageTitle } from '../styleguide/page-title'
import { moodIcons } from '../utils/mood-icons'
import { ErrorResponse } from '../types/error-response'
import { journalEntrySchema } from '../utils/validations'
import { getUsersTags } from '../api/profile'

export const ViewJournalPage: React.FC = () => {
  const params = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const { data, refetch } = useQuery(
    ['getFullJournal', params.id],
    getJournalById
  )

  const { data: tags } = useQuery('usersTags', getUsersTags)

  const [editJournal, { status: editStatus }] = useMutation(updateJournal, {
    onSuccess: () => {
      queryCache.invalidateQueries(['getFullJournal', params.id])
      enqueueSnackbar('Journal updated', { variant: 'success' })
    },
    onError: (err: ErrorResponse) => {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
    },
    onSettled: () => {
      window.scrollTo({ top: 0 })
      setIsEditMode(false)
    },
  })

  const [toggleStarred] = useMutation(toggleJournalIsStarred, {
    onSuccess: (_data, { isStarred }) => {
      enqueueSnackbar(
        isStarred ? 'Journal removed from starred' : 'Journal added to starred',
        { variant: 'success' }
      )
    },
    onError: (err: ErrorResponse) => {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
    },
    onSettled: () => {
      refetch()
    },
  })

  const journalCreatedToday = data ? isToday(data!.created) : false
  const EditIcon = isEditMode ? Close : Edit

  return !data ? null : (
    <>
      <PageTitle className="mt-4 mb-6">
        {format(new Date(data.created), 'd MMMM yyyy')}
      </PageTitle>

      <div className="my-4 space-x-2">
        <IconButton
          size="small"
          edge="start"
          className="text-yellow-400"
          onClick={() =>
            toggleStarred({ id: data._id, isStarred: data.isStarred })
          }
        >
          {data.isStarred ? <Star /> : <StarBorder />}
        </IconButton>
        {journalCreatedToday && (
          <IconButton size="small" onClick={() => setIsEditMode(prev => !prev)}>
            <EditIcon color="secondary" />
          </IconButton>
        )}
      </div>

      {isEditMode ? (
        <Formik
          initialValues={{
            mood: data!.mood,
            standout: data!.standout,
            wentWell: data!.wentWell,
            wentWrong: data!.wentWrong,
            betterNextTime: data!.betterNextTime,
            excuses: data!.excuses,
            tags: data!.tags,
          }}
          onSubmit={(values: JournalFullASP): void => {
            editJournal({ id: data._id, formData: values })
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={journalEntrySchema}
        >
          <JournalEntryForm
            loading={editStatus === 'loading'}
            availableTags={tags ?? []}
          />
        </Formik>
      ) : (
        <>
          {data.tags.length > 0 && (
            <div className="mb-4">
              {data.tags.map(tag => (
                <Chip
                  key={tag}
                  size="small"
                  variant="outlined"
                  color="primary"
                  label={tag}
                  className="m-1 bg-white"
                />
              ))}
            </div>
          )}

          <Paper className="p-4 mb-6 space-y-6">
            <div>
              <p className="text-lg font-semibold">How do you feel?</p>
              <p>{moodIcons[data.mood].label}</p>
            </div>

            <div>
              <p className="text-lg font-semibold">
                What stood out during the day?
              </p>
              <p>{data.standout}</p>
            </div>

            <div>
              <p className="text-lg font-semibold">What went well?</p>
              <p>{data.wentWell}</p>
            </div>

            <div>
              <p className="text-lg font-semibold">What went wrong?</p>
              <p>{data.wentWrong}</p>
            </div>

            <div>
              <p className="text-lg font-semibold">
                What could be done better next time?
              </p>
              <p>{data.betterNextTime}</p>
            </div>

            <div>
              <p className="text-lg font-semibold">Any excuses you had?</p>
              <p>{data.excuses ?? '-'}</p>
            </div>
          </Paper>
        </>
      )}
    </>
  )
}
