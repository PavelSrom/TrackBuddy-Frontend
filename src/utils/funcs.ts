export const truncateText = (
  text: string,
  maxLength: number,
  allowDots = true
): string => {
  // return text right away if it doesn't need to be truncated
  if (text.length <= maxLength) return text
  // throw error if trying to truncate text that is too short
  if (maxLength < 4) throw new Error('Text must be at least 4 characters long')

  let slicedText = text.slice(0, allowDots ? maxLength - 3 : maxLength)
  slicedText += allowDots ? '...' : ''

  return slicedText.trim()
}

export type HabitColor = 'red' | 'yellow' | 'green' | 'blue' | 'black'

export const determineHabitColor = (color: HabitColor): string => {
  switch (color) {
    case 'red':
      return 'rgba(239, 68, 68, var(--tw-bg-opacity))'

    case 'yellow':
      return 'rgba(245, 158, 11, var(--tw-bg-opacity))'

    case 'green':
      return 'rgba(16, 185, 129, var(--tw-bg-opacity))'

    case 'blue':
      return 'rgba(59, 130, 246, var(--tw-bg-opacity))'

    case 'black':
      return '#000000'

    default:
      return '#000000'
  }
}
