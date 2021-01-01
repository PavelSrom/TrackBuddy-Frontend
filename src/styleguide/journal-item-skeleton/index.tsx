import React from 'react'
import { Paper } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

type Props = {
  numOfSkeletons?: number
}

export const JournalItemSkeleton: React.FC<Props> = ({
  numOfSkeletons = 4,
}) => (
  <>
    {[...new Array(numOfSkeletons)].map((_, index) => (
      <Paper key={index} className="mb-6 w-full p-2 flex">
        <Skeleton variant="circle" width={60} height={60} />
        <div className="px-2 flex-1">
          <Skeleton variant="text" width={144} />
          <Skeleton variant="text" />
        </div>
        <Skeleton variant="circle" width={24} height={24} />
      </Paper>
    ))}
  </>
)
