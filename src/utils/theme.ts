import { createMuiTheme } from '@material-ui/core'

/**
 * Tailwind colors
 * primary: text-green, secondary: text-red
 * shades: light = 100, main = 400, dark = 600 or 700?
 */

export const theme = createMuiTheme({
  palette: {
    primary: { main: '#60A5FA', light: '#D1FAE5' },
    secondary: { main: '#F87171', light: '#FEE2E2' },
    success: { main: '#10B981' }, // text-green-500
    error: { main: '#EF4444' }, // text-red-500
    warning: { main: '#FBBF24' }, // text-yellow-400
    info: { main: '#3B82F6' }, // text-blue-500
  },
})
