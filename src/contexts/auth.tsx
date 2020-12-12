import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { queryCache } from 'react-query'
import { useSnackbar } from 'notistack'
import { Backdrop, CircularProgress } from '@material-ui/core'
import { RegisterASP, LoginASP } from 'trackbuddy-shared/payloads/auth'
import { refreshToken, register, login } from '../api/auth'
import { useDevice } from '../hooks/use-device'
import { NonMobile } from '../components/non-mobile'

type AuthStatus = 'pending' | 'success' | 'error'

type AuthState = {
  status: AuthStatus
  isAuthenticated: boolean
}

type ContextProps = {
  isAuthenticated: boolean
  registerUser: (formData: RegisterASP) => Promise<void>
  loginUser: (formData: LoginASP) => Promise<void>
  logoutUser: () => void
}

const AuthContext = React.createContext<ContextProps>({} as ContextProps)

export const AuthProvider: React.FC = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const { width } = useDevice()

  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    status: 'pending',
  })

  const registerUser = async (formData: RegisterASP): Promise<void> => {
    const { token } = await register(formData)

    localStorage.setItem('trackbuddy-token', token)
    setState({ isAuthenticated: true, status: 'success' })
  }

  const loginUser = async (formData: LoginASP): Promise<void> => {
    const { token } = await login(formData)

    localStorage.setItem('trackbuddy-token', token)
    setState({ isAuthenticated: true, status: 'success' })
  }

  const logoutUser = (): void => {
    localStorage.removeItem('trackbuddy-token')
    queryCache.clear()
    setState({ isAuthenticated: false, status: 'success' })
    navigate('/login')
  }

  const loginFromToken = async (): Promise<void> => {
    try {
      const { token } = await refreshToken()

      localStorage.setItem('trackbuddy-token', token)
      setState({ isAuthenticated: true, status: 'success' })
      navigate('/actions')
      enqueueSnackbar('Logged in automatically', { variant: 'success' })
    } catch (err) {
      enqueueSnackbar('Session expired', { variant: 'warning' })
      logoutUser()
    }
  }

  // automatically login from token on mount
  useEffect(() => {
    const token = localStorage.getItem('trackbuddy-token')

    if (token) {
      loginFromToken()
    } else {
      setState({ status: 'success', isAuthenticated: false })
    }
    // eslint-disable-next-line
  }, [])

  if (width > 600) return <NonMobile />

  const { status, isAuthenticated } = state

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, registerUser, loginUser, logoutUser }}
    >
      {status === 'pending' ? (
        <Backdrop open style={{ color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : status === 'error' ? (
        <Navigate to="/login" replace />
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = (): ContextProps => React.useContext(AuthContext)
