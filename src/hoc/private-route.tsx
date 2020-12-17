import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import { Container } from '@material-ui/core'
import { useAuth } from '../contexts/auth'

type Props = {
  path: string
  element: JSX.Element
}

export const PrivateRoute: React.FC<Props> = ({ element, ...rest }) => {
  const { isAuthenticated } = useAuth()

  return (
    <Route
      {...rest}
      element={
        isAuthenticated ? (
          <Container
            maxWidth="xs"
            className="bg-gray-100 w-screen h-screen absolute top-0 right-0 bottom-0 left-0"
          >
            {element}
          </Container>
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  )
}
