import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { HabitOverviewASR } from 'trackbuddy-shared/responses/habits'
import Info from '@material-ui/icons/Info'
import Replay from '@material-ui/icons/Replay'
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked'
import CheckedCircle from '@material-ui/icons/CheckCircle'
import { Paper, IconButton } from '@material-ui/core'
import { determineHabitColor, HabitColor } from '../../utils/funcs'

type Props = {
  habit: HabitOverviewASR
  onToggleClick: () => void
  lastCheckIsToday: boolean
}

export const HabitItem: React.FC<Props> = ({
  habit: { _id, name, color, duration, frequency, newestRep },
  onToggleClick,
  lastCheckIsToday,
}) => {
  return (
    <Paper key={_id} className="p-4 mb-2">
      <div className="h-full flex items-center">
        <IconButton
          size="small"
          color="primary"
          className="mr-4"
          onClick={onToggleClick}
        >
          {lastCheckIsToday ? (
            <CheckedCircle
              className="text-3xl"
              style={{
                color: determineHabitColor(color as HabitColor),
              }}
            />
          ) : (
            <RadioButtonUnchecked
              className="text-3xl"
              style={{
                color: determineHabitColor(color as HabitColor),
              }}
            />
          )}
        </IconButton>
        <div className="truncate">
          <p className="text-xl font-semibold">{name}</p>
          <div className="flex items-center mt-1">
            <Info
              className="text-xl mr-2"
              style={{
                color: determineHabitColor(color as HabitColor),
              }}
            />
            <p className="text-sm">
              {duration} minutes, every {frequency} days
            </p>
          </div>
          <div className="flex items-center mt-1">
            <Replay
              className="text-xl mr-2"
              style={{
                color: determineHabitColor(color as HabitColor),
              }}
            />
            <p className="text-sm">
              {newestRep === 0
                ? 'never done yet'
                : `${formatDistanceToNow(new Date(newestRep))} ago`}
            </p>
          </div>
        </div>
      </div>
    </Paper>
  )
}
