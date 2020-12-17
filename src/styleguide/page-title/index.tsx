import React from 'react'
import clsx from 'clsx'
import { Typography } from '@material-ui/core'

type Props = {
  className?: string
  style?: React.CSSProperties
}

export const PageTitle: React.FC<Props> = ({ className, style, children }) => {
  return (
    <Typography variant="h4" className={clsx('mt-4', className)} style={style}>
      {children}
    </Typography>
  )
}
