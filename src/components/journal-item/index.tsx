import React from 'react'
import { format } from 'date-fns'
import { Paper, IconButton, Divider, Chip } from '@material-ui/core'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
import { JournalBriefASR } from 'trackbuddy-shared/responses/journals'
import { moodIcons } from '../../utils/mood-icons'
import { truncateText } from '../../utils/funcs'

type Props = {
  journal: JournalBriefASR
  onToggleStarred: () => void
  onCardClick: () => void
}

export const JournalItem: React.FC<Props> = ({
  journal: { mood, isStarred, standout, created, tags },
  onToggleStarred,
  onCardClick,
}) => {
  const { icon: Icon } = moodIcons[mood]
  const StarIcon = isStarred ? Star : StarBorder

  const onFaviconClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.stopPropagation()
    onToggleStarred()
  }

  return (
    <Paper className="mb-6 w-full p-2" onClick={onCardClick}>
      <div className="flex">
        <Icon className="text-yellow-400" style={{ fontSize: 60 }} />
        <div className="pl-2 flex-1">
          <div className="flex justify-between items-center">
            <p className="text-base font-semibold">
              {format(new Date(created), 'd MMMM yyyy')}
            </p>
            <IconButton size="small" edge="end" onClick={onFaviconClick}>
              <StarIcon className="text-yellow-400" />
            </IconButton>
          </div>
          <p className="text-base">{truncateText(standout, 70)}</p>
        </div>
      </div>

      {tags.length > 0 && (
        <>
          <Divider className="my-2" />
          <div className="flex flex-wrap">
            {tags.map(tag => (
              <Chip
                key={tag}
                size="small"
                variant="outlined"
                color="primary"
                label={tag}
                className="m-1"
              />
            ))}
          </div>
        </>
      )}
    </Paper>
  )
}
