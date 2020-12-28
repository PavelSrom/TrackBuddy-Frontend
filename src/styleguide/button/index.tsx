import React from 'react'
import clsx from 'clsx'
import {
  Button as MUIButton,
  ButtonProps,
  CircularProgress,
} from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'

type Props = ButtonProps & {
  loading?: boolean
}

export const Button: React.FC<Props> = ({
  loading = false,
  size = 'medium',
  variant = 'outlined',
  color = 'primary',
  children,
  className,
  ...rest
}) => {
  const theme = useTheme()

  return (
    <MUIButton
      {...rest}
      size={size}
      variant={variant}
      color={color}
      disabled={loading}
      className={clsx(className, {
        ['text-white']: variant === 'contained',
      })}
    >
      {loading && (
        <CircularProgress
          color={color !== 'default' ? color : 'inherit'}
          size={size && size === 'small' ? 16 : 24}
          className={clsx(
            'absolute inset-x-2/4',
            size === 'small' ? '-ml-2' : '-ml-3'
          )}
          // @ts-ignore
          style={{ color: theme.palette[color].main }}
        />
      )}
      {children}
    </MUIButton>
  )
}
