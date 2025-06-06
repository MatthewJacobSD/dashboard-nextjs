'use client'

import { useState, useEffect, useCallback, useTransition, useMemo } from 'react'
import { toast } from 'react-toastify'
import {
  defineEntityHook,
  GenericService,
  ActionState,
  EntityState,
  UseEntityOptions,
  UseEntityProps,
} from '../types'
import {
  useEntityActions,
  useOptimisticUpdate,
  usePagination,
  useResizeHandler,
  useToastMessages,
} from '../hooks/helpers'
import {
  createDoctorSchema,
  updateDoctorSchema,
  Doctor,
  CreateDoctor,
  UpdateDoctor,
} from '../zod/doctor'
import { handleActionError } from '../../utils/handleActionError'
import { fetchDoctors } from '../rr'

// const doctorHook = defineEntityHook<Doctor>();

export function useDoctors({
  initialData,
  page: initialPage = 1,
  size: initialSize = 10,
}: UseEntityProps<Doctor> = {}) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<EntityState<Doctor>>({
    entities: initialData ?? [],
    error: null,
    fieldErrors: undefined,
    selectedEntity: null,
  })
  const [totalPages, setTotalPages] = useState(1)

  // Initialize CRUD service
  const doctorService = new GenericService<Doctor, CreateDoctor, UpdateDoctor>(
    '/doctors'
  )

  // Toast messages
  const toastMessages = useToastMessages('Doctor')

  // Pagination
  const { page, size, setPage, setSize } = usePagination(
    initialPage,
    initialSize
  )

  // Optimistic updates
  const { applyOptimisticUpdate } = useOptimisticUpdate<Doctor>()

  // Resize handler
  useResizeHandler(setSize)

  // Entity actions
  const { handleCreate, handleUpdate, handleDelete } = useEntityActions<Doctor>(
    {
      schema: {
        create: createDoctorSchema,
        update: updateDoctorSchema,
      },
      actions: {
        createAction: async (
          formData: FormData
        ): Promise<ActionState<Doctor>> => {
          try {
            const data = await doctorService.create(
              Object.fromEntries(formData) as CreateDoctor
            )
            return { success: true, data, error: null }
          } catch (error) {
            return handleActionError(error)
          }
        },
        updateAction: async (
          id: string,
          formData: FormData
        ): Promise<ActionState<Doctor>> => {
          try {
            const data = await doctorService.update(
              id,
              Object.fromEntries(formData) as UpdateDoctor
            )
            return { success: true, data, error: null }
          } catch (error) {
            return handleActionError(error)
          }
        },
        deleteAction: async (
          id: string
        ): Promise<{ success: boolean; error?: string }> => {
          try {
            await doctorService.delete(id)
            return { success: true }
          } catch (error) {
            return handleActionError(error)
          }
        },
        fetchAction: async (page: number, size: number) => {
          try {
            const data = await doctorService.getAll({ page: page - 1, size })
            return {
              success: true,
              data: { items: data.items, totalPages: data.pagination },
            }
          } catch (error) {
            const errorMsg =
              error instanceof Error ? error.message : 'Unknown error'
            return { success: false, error: errorMsg }
          }
        },
      },
    } as UseEntityOptions<Doctor>
  )

  // Fetch doctors
  const loadDoctors = useCallback(async () => {
    try {
      const response = await fetchDoctors(page, size)
      if (!response.success) throw new Error('Fetch failed')
      setState((prev) => ({
        ...prev,
        entities: response.data?.items || [],
        error: null,
      }))
      setTotalPages(response.data?.totalPages || 1)
      toast.success(toastMessages.fetch.success)
    } catch (error) {
      const errorResult = handleActionError(error)
      setState((prev) => ({
        ...prev,
        error: errorResult.error,
        fieldErrors: errorResult.fieldErrors,
      }))
      toast.error(toastMessages.fetch.error)
    }
  }, [page, size, toastMessages])

  useEffect(() => {
    startTransition(() => {
      loadDoctors()
    })
  }, [loadDoctors])

  // Create action
  const createFormAction = useCallback(
    async (formData: FormData): Promise<ActionState<Doctor>> => {
      const tempId = `temp-${crypto.randomUUID()}`
      const optimisticDoctor: Doctor = {
        id: tempId,
        ...Object.fromEntries(formData),
      } as Doctor
      startTransition(() => {
        setState((prev) => ({
          ...prev,
          entities: applyOptimisticUpdate(prev.entities, {
            type: 'add',
            entity: optimisticDoctor,
          }),
        }))
      })

      try {
        const result = await handleCreate(formData)
        if (!result.success) throw new Error('Creation failed')
        setState((prev) => ({
          ...prev,
          entities: [
            ...prev.entities.filter((d) => d.id !== tempId),
            result.data!,
          ],
        }))
        toast.success(toastMessages.create.success)
        return { success: true, data: result.data!, error: null }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          entities: applyOptimisticUpdate(prev.entities, {
            type: 'delete',
            id: tempId,
          }),
        }))
        const errorResult = handleActionError(error)
        toast.error(toastMessages.create.error)
        return errorResult
      }
    },
    [handleCreate, applyOptimisticUpdate, toastMessages]
  )

  // Update action
  const updateFormAction = useCallback(
    async (formData: FormData): Promise<ActionState<Doctor>> => {
      if (!state.selectedEntity) {
        const errorResult = handleActionError(new Error('No doctor selected'))
        toast.error(errorResult.error)
        return errorResult
      }

      const prevDoctor = state.selectedEntity
      const optimisticDoctor: Doctor = {
        ...prevDoctor,
        ...Object.fromEntries(formData),
      }
      startTransition(() => {
        setState((prev) => ({
          ...prev,
          entities: applyOptimisticUpdate(prev.entities, {
            type: 'update',
            entity: optimisticDoctor,
          }),
        }))
      })

      try {
        const result = await handleUpdate(state.selectedEntity.id, formData)
        if (!result.success) throw new Error('Update failed')
        setState((prev) => ({
          ...prev,
          entities: prev.entities.map((d) =>
            d.id === result.data!.id ? result.data! : d
          ),
          selectedEntity: null,
        }))
        toast.success(toastMessages.update.success)
        return { success: true, data: result.data!, error: null }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          entities: applyOptimisticUpdate(prev.entities, {
            type: 'update',
            entity: prevDoctor,
          }),
        }))
        const errorResult = handleActionError(error)
        toast.error(toastMessages.update.error)
        return errorResult
      }
    },
    [handleUpdate, state.selectedEntity, applyOptimisticUpdate, toastMessages]
  )

  // Delete action
  const handleDeleteAction = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      const prevEntities = [...state.entities]
      startTransition(() => {
        setState((prev) => ({
          ...prev,
          entities: applyOptimisticUpdate(prev.entities, {
            type: 'delete',
            id,
          }),
        }))
      })

      try {
        const result = await handleDelete(id)
        if (!result.success) throw new Error('Deletion failed')
        toast.success(toastMessages.delete.success)
        return result
      } catch (error) {
        setState((prev) => ({ ...prev, entities: prevEntities }))
        const errorResult = handleActionError(error)
        toast.error(toastMessages.delete.error)
        return errorResult
      }
    },
    [handleDelete, state.entities, applyOptimisticUpdate, toastMessages]
  )

  // Derived values
  const isLoading = useMemo(() => isPending, [isPending])

  return {
    doctors: state.entities,
    isLoading,
    error: state.error,
    fieldErrors: state.fieldErrors,
    page,
    size,
    setPage,
    setSize,
    totalPages,
    selectedEntity: state.selectedEntity,
    setSelectedEntity: (doctor: Doctor | null) =>
      setState((prev) => ({ ...prev, selectedEntity: doctor })),
    createFormAction,
    updateFormAction,
    handleDelete: handleDeleteAction,
  }
}
