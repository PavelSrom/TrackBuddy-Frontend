import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { RegisterASP } from 'trackbuddy-shared/payloads/auth'
import {
  makeStyles,
  Theme,
  Container,
  Typography,
  Button,
} from '@material-ui/core'
import { TextField } from '../styleguide/text-field'
import { useAuth } from '../contexts/auth'

const useStyles = makeStyles<Theme>(theme => ({
  pageTitle: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
  },
}))

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('required'),
  lastName: Yup.string().required('required'),
  email: Yup.string().email('must be an email').required('required'),
  password: Yup.string()
    .min(6, 'min 6 characters')
    .max(20, 'max 20 characters')
    .required('required'),
})

const initialValues: RegisterASP = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
}

// TODO: make a styleguide Button that merges 'Button' and 'LoadingButton'
export const RegisterPage: React.FC = () => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState<boolean>(false)
  const { isAuthenticated, registerUser } = useAuth()

  const handleSubmit = async (values: RegisterASP): Promise<void> => {
    try {
      setLoading(true)
      await registerUser(values)
      enqueueSnackbar('Registered successfully', { variant: 'success' })
    } catch (err) {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
      setLoading(false)
    }
  }

  if (isAuthenticated) return <Navigate to="/actions" />

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" className={classes.pageTitle}>
        Create a new account
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        <Form>
          <TextField name="firstName" label="First name" fullWidth />
          <TextField name="lastName" label="Last name" fullWidth />
          <TextField name="email" label="Email" fullWidth />
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
          />

          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            color="primary"
          >
            Sign up
          </Button>
        </Form>
      </Formik>
    </Container>
  )
}
