import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { LoginASP } from 'trackbuddy-shared/payloads/auth'
import {
  Container,
  Typography,
  IconButton,
  InputAdornment,
} from '@material-ui/core'
import TrackChanges from '@material-ui/icons/TrackChanges'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
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
  const [showPassword, setShowPassword] = useState<boolean>(false)
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
    <section className="bg-gray-700 absolute w-screen h-screen">
      <Container maxWidth="xs">
        <div className="flex flex-col items-center mt-4 text-white">
          <TrackChanges className="text-9xl" />
          <PageTitle className="mb-12 text-center">
            Sign in to your account
          </PageTitle>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={handleSubmit}
        >
          <Form>
            <TextField name="email" label="Email" fullWidth color="white" />
            <TextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              color="white"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      className="text-white"
                      onClick={() => setShowPassword(prev => !prev)}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              loading={loading}
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Sign in
            </Button>
          </Form>
        </Formik>

        <div className="flex justify-between mt-4">
          <Typography
            variant="body2"
            color="primary"
            className="no-underline"
            component={Link}
            to="/password-reset"
          >
            Forgot password?
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            className="no-underline"
            component={Link}
            to="/register"
          >
            No account?
          </Typography>
        </div>
      </Container>
    </section>
  )
}
