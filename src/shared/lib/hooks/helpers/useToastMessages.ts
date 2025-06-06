import { useMemo } from 'react'
import { VERB_ENTITY_TOAST_MESSAGES } from '../../constants/toast.constants'

export function useToastMessages(entityName: string) {
  return useMemo(() => VERB_ENTITY_TOAST_MESSAGES(entityName), [entityName])
}
