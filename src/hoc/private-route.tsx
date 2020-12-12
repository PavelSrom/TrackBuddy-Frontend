import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import { makeStyles, Container } from '@material-ui/core'
import { useAuth } from '../contexts/auth'

const useStyles = makeStyles(() => ({
  container: {
    background: '#f4f4f4',
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
}))

type Props = {
  path: string
  element: JSX.Element
}

export const PrivateRoute: React.FC<Props> = ({ element, ...rest }) => {
  const { isAuthenticated } = useAuth()
  const classes = useStyles()

  return (
    <Route
      {...rest}
      element={
        isAuthenticated ? (
          <Container maxWidth="xs" className={classes.container}>
            {element}
          </Container>
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  )
}
