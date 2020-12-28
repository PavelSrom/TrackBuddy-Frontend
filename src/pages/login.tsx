import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { LoginASP } from 'trackbuddy-shared/payloads/auth'
import { Container, Typography } from '@material-ui/core'
import { TextField } from '../styleguide/text-field'
import { Button } from '../styleguide/button'
import { PageTitle } from '../styleguide/page-title'
import { useAuth } from '../contexts/auth'

const validationSchema = Yup.object().shape({
  email: Yup.string().email('must be an email').required('required'),
  password: Yup.string()
    .min(6, 'min 6 characters')
    .max(20, 'max 20 characters')
    .required('required'),
})

const initialValues: LoginASP = {
  email: '',
  password: '',
}

export const LoginPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState<boolean>(false)
  const { isAuthenticated, loginUser } = useAuth()

  const handleSubmit = async (values: LoginASP): Promise<void> => {
    try {
      setLoading(true)
      await loginUser(values)
      enqueueSnackbar('Logged in successfully', { variant: 'success' })
    } catch (err) {
      enqueueSnackbar(err.response.data.message, { variant: 'error' })
      setLoading(false)
    }
  }

  if (isAuthenticated) return <Navigate to="/actions" />

  return (
    <Container maxWidth="xs">
      <PageTitle className="mb-12">Sign in to your account</PageTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        <Form>
          <TextField name="email" label="Email" fullWidth />
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
          />

          <Button
            loading={loading}
            type="submit"
            variant="contained"
            color="primary"
          >
            Sign in
          </Button>
        </Form>
      </Formik>

      <div className="flex justify-between mt-40">
        <Typography
          variant="body2"
          className="text-black no-underline"
          component={Link}
          to="/password-reset"
        >
          Forgot password?
        </Typography>
        <Typography
          variant="body2"
          className="text-black no-underline"
          component={Link}
          to="/register"
        >
          No account?
        </Typography>
      </div>
    </Container>
  )
}
