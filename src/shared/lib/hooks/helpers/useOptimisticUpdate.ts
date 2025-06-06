import { useCallback } from 'react'
import { EMOJI } from '../../constants/emoji.constants'

type OptimisticUpdate<T extends { id: string }> =
  | { type: 'add'; entity: T }
  | { type: 'update'; entity: T }
  | { type: 'delete'; id: string }

export function useOptimisticUpdate<T extends { id: string }>() {
  const applyOptimisticUpdate = useCallback(
    (entities: T[], update: OptimisticUpdate<T>): T[] => {
      switch (update.type) {
        case 'add':
          console.log(`${EMOJI.OPERATION.CREATE} Optimistically adding`)
          return [...entities, update.entity]
        case 'update':
          console.log(`${EMOJI.OPERATION.UPDATE} Optimistically updating`)
          return entities.map((e) =>
            e.id === update.entity.id ? update.entity : e
          )
        case 'delete':
          console.log(`${EMOJI.OPERATION.DELETE} Optimistically deleting`)
          return entities.filter((e) => e.id !== update.id)
        default:
          return entities
      }
    },
    []
  )

  return { applyOptimisticUpdate }
}
