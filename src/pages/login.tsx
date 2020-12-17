import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { LoginASP } from 'trackbuddy-shared/payloads/auth'
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
  links: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(30),
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.common.black,
  },
}))

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

// TODO: make a styleguide Button that merges 'Button' and 'LoadingButton'
export const LoginPage: React.FC = () => {
  const classes = useStyles()
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
      <Typography variant="h4" className={classes.pageTitle}>
        Sign into your account
      </Typography>

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
            disabled={loading}
            type="submit"
            variant="contained"
            color="primary"
          >
            Sign in
          </Button>
        </Form>
      </Formik>

      <div className={classes.links}>
        <Typography
          variant="body2"
          className={classes.link}
          component={Link}
          to="/password-reset"
        >
          Forgot password?
        </Typography>
        <Typography
          variant="body2"
          className={classes.link}
          component={Link}
          to="/register"
        >
          No account?
        </Typography>
      </div>
    </Container>
  )
}
