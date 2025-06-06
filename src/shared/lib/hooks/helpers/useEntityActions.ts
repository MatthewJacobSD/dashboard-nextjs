import { useCallback } from 'react'
import { handleActionError } from '../../../utils/handleActionError'
import { z } from 'zod'

export function useEntityActions<T extends { id: string }>(options: {
  schema: {
    create: z.ZodSchema<unknown>
    update: z.ZodSchema<unknown>
  }
  actions: {
    createAction: (
      formData: FormData
    ) => Promise<{ success: boolean; data?: T }>
    updateAction: (
      id: string,
      formData: FormData
    ) => Promise<{ success: boolean; data?: T }>
    deleteAction: (id: string) => Promise<{ success: boolean }>
  }
}) {
  const handleCreate = useCallback(
    async (formData: FormData): Promise<{ success: boolean; data?: T }> => {
      const validation = options.schema.create.safeParse(
        Object.fromEntries(formData)
      )
      if (!validation.success) {
        return handleActionError(validation.error)
      }

      try {
        return await options.actions.createAction(formData)
      } catch (error) {
        return handleActionError(error)
      }
    },
    [options]
  )

  const handleUpdate = useCallback(
    async (
      id: string,
      formData: FormData
    ): Promise<{ success: boolean; data?: T }> => {
      const validation = options.schema.update.safeParse(
        Object.fromEntries(formData)
      )
      if (!validation.success) {
        return handleActionError(validation.error)
      }

      try {
        return await options.actions.updateAction(id, formData)
      } catch (error) {
        return handleActionError(error)
      }
    },
    [options]
  )

  const handleDelete = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await options.actions.deleteAction(id)
        if (!response.success) {
          throw new Error('Failed to delete')
        }
        return { success: true }
      } catch (error) {
        return handleActionError(error)
      }
    },
    [options]
  )

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
  }
}
