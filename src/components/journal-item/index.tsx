import React from 'react'
import dayjs from 'dayjs'
import { Paper, IconButton } from '@material-ui/core'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
import { JournalBriefASR } from 'trackbuddy-shared/responses/journals'
import { moodIcons } from '../../utils/mood-icons'
import { truncateText } from '../../utils/funcs'

type Props = {
  journal: JournalBriefASR
  onToggleStarred: () => void
}

export const JournalItem: React.FC<Props> = ({
  journal: { mood, isStarred, standout, created },
  onToggleStarred,
}) => {
  const { icon: Icon } = moodIcons[mood]
  const StarIcon = isStarred ? Star : StarBorder

  return (
    <Paper className="mb-6 w-full p-2 flex">
      <Icon className="text-yellow-400" style={{ fontSize: 60 }} />
      <div className="pl-2 flex-1">
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold">
            {dayjs(new Date(created)).format('D MMMM YYYY')}
          </p>
          <IconButton size="small" edge="end" onClick={() => onToggleStarred()}>
            <StarIcon className="text-yellow-400" />
          </IconButton>
        </div>
        <p className="text-base">{truncateText(standout, 70)}</p>
      </div>
    </Paper>
  )
}
