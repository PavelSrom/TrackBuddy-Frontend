import React from 'react'
import { Paper } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

type Props = {
  numOfSkeletons?: number
}

export const HabitItemSkeleton: React.FC<Props> = ({ numOfSkeletons = 5 }) => (
  <>
    {[...new Array(numOfSkeletons)].map((_, index) => (
      <Paper key={index} className="p-4 mb-2 flex">
        <div className="flex-1 flex items-center">
          <Skeleton variant="circle" width={28} height={28} className="ml-1" />
        </div>
        <div className="w-full ml-7">
          <Skeleton variant="text" width="100%" height={32} />
          <div className="flex justify-start items-center">
            <Skeleton
              variant="circle"
              width={20}
              height={20}
              className="mr-4"
            />
            <Skeleton variant="text" width="50%" />
          </div>
          <div className="flex justify-start items-center">
            <Skeleton
              variant="circle"
              width={20}
              height={20}
              className="mr-4"
            />
            <Skeleton variant="text" width="50%" />
          </div>
        </div>
      </Paper>
    ))}
  </>
)
