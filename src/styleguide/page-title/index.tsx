import React from 'react'
import { Typography } from '@material-ui/core'

type Props = {
  className?: string
  style?: React.CSSProperties
}

export const PageTitle: React.FC<Props> = ({ className, style, children }) => {
  return (
    <Typography
      variant="h4"
      className={className}
      style={{ ...style, marginTop: 16 }}
    >
      {children}
    </Typography>
  )
}
