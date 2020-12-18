import React from 'react'
import { Route, Navigate, useLocation } from 'react-router-dom'
import { Container } from '@material-ui/core'
import { useAuth } from '../contexts/auth'
import { BottomNavigation } from '../components/bottom-navigation'

type Props = {
  path: string
  element: JSX.Element
}

export const PrivateRoute: React.FC<Props> = ({ element, ...rest }) => {
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  return (
    <Route
      {...rest}
      element={
        isAuthenticated ? (
          <>
            <Container
              maxWidth="xs"
              // pb-14 because of our bottom nav height
              className="bg-gray-100 w-screen min-h-screen absolute top-0 right-0 left-0 pb-14"
            >
              {element}
            </Container>

            {location.pathname !== '/actions' && <BottomNavigation />}
          </>
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  )
}
