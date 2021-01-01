import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { RegisterASP } from 'trackbuddy-shared/payloads/auth'
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
import { useAuth } from '../contexts/auth'
import { PageTitle } from '../styleguide/page-title'

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

export const RegisterPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
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
    <section className="bg-white absolute w-screen h-screen">
      <Container maxWidth="xs">
        <div className="flex flex-col items-center mt-4 text-gray-800">
          <TrackChanges className="text-9xl" />
          <PageTitle className="mb-12 text-center">
            Create a new account
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
            <TextField name="firstName" label="First name" fullWidth />
            <TextField name="lastName" label="Last name" fullWidth />
            <TextField name="email" label="Email" fullWidth />
            <TextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
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
              Sign up
            </Button>
          </Form>
        </Formik>

        <div className="flex justify-end mt-4">
          <Typography
            variant="body2"
            color="primary"
            className="no-underline"
            component={Link}
            to="/login"
          >
            Have an account?
          </Typography>
        </div>
      </Container>
    </section>
  )
}
