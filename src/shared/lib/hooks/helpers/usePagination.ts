import { useState, useCallback } from 'react'
import { EMOJI } from '../../constants/emoji.constants'

export function usePagination(initialPage = 1, initialSize = 10) {
  const [page, setPage] = useState(initialPage)
  const [size, setSize] = useState(initialSize)

  const handleSetPage = useCallback((newPage: number) => {
    console.log(`${EMOJI.OPERATION.FETCH} Changing to page ${newPage}`)
    setPage(newPage)
  }, [])

  const handleSetSize = useCallback((newSize: number) => {
    console.log(`${EMOJI.OPERATION.FETCH} Changing size to ${newSize}`)
    setSize(newSize)
    setPage(1)
  }, [])

  return {
    page,
    size,
    setPage: handleSetPage,
    setSize: handleSetSize,
  }
}
