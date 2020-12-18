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
