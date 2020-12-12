import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

type ReturnType = {
  width: number
}

export const useDevice = (): ReturnType => {
  const [width, setWidth] = useState<number>(window.innerWidth)
  const { callback: handleResize } = useDebouncedCallback(
    () => setWidth(window.innerWidth),
    100
  )

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
    // eslint-disable-next-line
  }, [])

  return {
    width,
  }
}
