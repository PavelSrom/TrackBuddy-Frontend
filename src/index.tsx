import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider, StylesProvider } from '@material-ui/core'
import { SnackbarProvider } from 'notistack'
import { App } from './app'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import { AuthProvider } from './contexts/auth'
import { theme } from './utils/theme'
import './index.css'

require('./utils/axios-interceptor')

const app = (
  <ThemeProvider theme={theme}>
    <StylesProvider injectFirst>
      <Router>
        <SnackbarProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SnackbarProvider>
      </Router>
    </StylesProvider>
  </ThemeProvider>
)

ReactDOM.render(app, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()
