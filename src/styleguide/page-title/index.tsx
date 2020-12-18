import React from 'react'
import clsx from 'clsx'

type Props = {
  className?: string
  style?: React.CSSProperties
}

export const PageTitle: React.FC<Props> = ({ className, style, children }) => {
  return (
    <p className={clsx('mt-4 text-3xl font-normal', className)} style={style}>
      {children}
    </p>
  )
}
