import axios, { AxiosRequestConfig } from 'axios'

/**
 * On every request this injects access token directly to headers if possible.
 */
axios.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const accessToken: string | null = localStorage.getItem('trackbuddy-token')

    let methodColor: string

    switch (config.method!.toUpperCase()) {
      case 'GET':
        methodColor = 'green'
        break
      case 'POST':
        methodColor = 'yellow'
        break
      case 'DELETE':
        methodColor = 'red'
        break
      case 'PUT':
        methodColor = 'orange'
        break
      case 'PATCH':
        methodColor = 'orange'
        break
      default:
        return config
    }

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(
        `%c${config.method!.toUpperCase()} -> %c${config.url}`,
        `font-weight: bold; color: ${methodColor};`
      )
    }

    if (accessToken) {
      // eslint-disable-next-line no-param-reassign
      config.headers.common['trackbuddy-token'] = accessToken
    }

    return config
  }
)
