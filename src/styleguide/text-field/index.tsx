import React from 'react'
import clsx from 'clsx'
import { Field, FieldProps, FastField, FastFieldProps } from 'formik'
import { TextField as MUITextField, TextFieldProps } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

type TextFieldColor = 'primary' | 'secondary' | 'white'

type ThemeProps = {
  color: TextFieldColor
}

const useStyles = makeStyles<Theme, ThemeProps>(theme => ({
  root: {
    '& label.Mui-focused': {
      color: ({ color }) =>
        color !== 'white'
          ? theme.palette[color].main
          : theme.palette.common.white,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: ({ color }) =>
        color !== 'white'
          ? theme.palette[color].main
          : theme.palette.common.white,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: ({ color }) =>
          color === 'white' && theme.palette.common.white,
      },
      '&:hover fieldset': {
        borderColor: ({ color }) =>
          color !== 'white'
            ? theme.palette[color].main
            : theme.palette.common.white,
      },
      '&.Mui-focused fieldset': {
        borderColor: ({ color }) =>
          color !== 'white'
            ? theme.palette[color].main
            : theme.palette.common.white,
      },
    },
  },
  label: {
    color: theme.palette.common.white,
  },
}))

type Props = Omit<TextFieldProps, 'color'> & {
  noFormik?: boolean
  fast?: boolean
  color?: TextFieldColor
}

export const TextField: React.FC<Props> = ({
  noFormik,
  fast,
  color = 'primary',
  ...rest
}) => {
  const classes = useStyles({ color })

  const FieldComponent = fast ? FastField : Field

  // return a standard text field if 'noFormik' is provided
  if (noFormik)
    return (
      <MUITextField
        {...rest}
        size="small"
        variant="outlined"
        classes={{ root: classes.root }}
        InputProps={{
          ...rest.InputProps,
          style: { color: color === 'white' ? 'white' : 'inherit' },
        }}
        InputLabelProps={{
          className: clsx({
            [classes.label]: color === 'white',
          }),
        }}
        FormHelperTextProps={{ style: { margin: `0 14px 8px 14px` } }}
      />
    )

  return (
    <FieldComponent name={rest.name}>
      {({ field, meta }: FieldProps | FastFieldProps) => (
        <MUITextField
          {...field}
          {...rest}
          size="small"
          variant="outlined"
          error={!!meta.error}
          classes={{ root: classes.root }}
          helperText={meta.error ?? ' '}
          InputProps={{
            ...rest.InputProps,
            style: { color: color === 'white' ? 'white' : 'inherit' },
          }}
          InputLabelProps={{
            className: clsx({
              [classes.label]: color === 'white',
            }),
          }}
          FormHelperTextProps={{ style: { margin: `0 14px 8px 14px` } }}
        />
      )}
    </FieldComponent>
  )
}
