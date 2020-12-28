import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import { Paper, IconButton, Chip } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
import { getJournalById, toggleJournalIsStarred } from '../api/journals'
import { PageTitle } from '../styleguide/page-title'
import { moodIcons } from '../utils/mood-icons'
import { ErrorResponse } from '../types/error-response'

dayjs.extend(isToday)

export const ViewJournalPage: React.FC = () => {
  const params = useParams()
  const { enqueueSnackbar } = useSnackbar()

  const { data, refetch } = useQuery(
    ['getFullJournal', params.id],
    getJournalById
  )
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

  const journalCreatedToday = dayjs(data?.created).isToday()

  return !data ? null : (
    <>
      <PageTitle className="mt-4 mb-2 text-2xl">
        {dayjs(new Date(data.created)).format('D MMMM YYYY')}
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
          <IconButton size="small">
            <Edit color="secondary" />
          </IconButton>
        )}
      </div>

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
  )
}
