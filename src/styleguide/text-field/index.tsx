import React from 'react'
import { Field, FieldProps, FastField, FastFieldProps } from 'formik'
import { TextField as MUITextField, TextFieldProps } from '@material-ui/core'

type Props = TextFieldProps & {
  noFormik?: boolean
  fast?: boolean
}

export const TextField: React.FC<Props> = ({ noFormik, fast, ...rest }) => {
  const FieldComponent = fast ? FastField : Field

  // return a standard text field if 'noFormik' is provided
  if (noFormik)
    return <MUITextField {...rest} size="small" variant="outlined" />

  return (
    <FieldComponent name={rest.name}>
      {({ field, meta }: FieldProps | FastFieldProps) => (
        <MUITextField
          {...field}
          {...rest}
          size="small"
          variant="outlined"
          color="primary"
          error={!!meta.error}
          helperText={meta.error ?? ' '}
          FormHelperTextProps={{ style: { margin: `0 14px 8px 14px` } }}
        />
      )}
    </FieldComponent>
  )
}
