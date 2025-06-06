import { z } from 'zod'

export interface UseEntityProps<T> {
  initialData?: T[]
  page?: number
  size?: number
}

export interface EntityState<T> {
  entities: T[]
  error: string | null
  fieldErrors?: Record<string, string[]>
  selectedEntity: T | null
}

export interface ActionState<T> {
  success: boolean
  error: string | null
  fieldErrors?: Record<string, string[]>
  data?: T
}

type EntityWithId = { id: string }

export type OptimisticUpdate<T extends EntityWithId> =
  | { type: 'add'; entity: T }
  | { type: 'update'; entity: T }
  | { type: 'delete'; id: string }

export interface UseEntityActions<T extends EntityWithId> {
  createAction: (formData: FormData) => Promise<ActionState<T>>
  updateAction: (id: string, formData: FormData) => Promise<ActionState<T>>
  deleteAction: (id: string) => Promise<{ success: boolean; error?: string }>
  fetchAction: (
    page: number,
    size: number
  ) => Promise<{
    success: boolean
    data?: { items?: T[]; totalPages?: number }
  }>
}

export interface UseEntityOptions<T extends EntityWithId> {
  schema: {
    create: z.ZodSchema<unknown>
    update: z.ZodSchema<unknown>
  }
  actions: UseEntityActions<T>
}
