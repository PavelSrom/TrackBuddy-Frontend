export const API_CONFIG = {
  BASE_URL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000/api'
      : 'https://pavelsrom-trackbuddy.herokuapp.com/api',
} as const
