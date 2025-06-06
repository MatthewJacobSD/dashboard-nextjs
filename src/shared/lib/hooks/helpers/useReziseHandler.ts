import { useEffect } from 'react'
import { debounce } from '../../../utils/debounce'

export function useResizeHandler(setSize: (size: number) => void) {
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const newSize = width < 640 ? 5 : width < 1024 ? 10 : 15
      setSize(newSize)
    }

    const debouncedResize = debounce(handleResize, 250)
    window.addEventListener('resize', debouncedResize)
    return () => window.removeEventListener('resize', debouncedResize)
  }, [setSize])
}
