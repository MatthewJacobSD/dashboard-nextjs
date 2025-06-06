## ✅ Folder Structure

```
/types
  ├── api/
  │   ├── response.types.ts
  │   └── status.types.ts
  ├── pagination/
  │   └── pagination.types.ts
  ├── data-display/
  │   └── display.types.ts
  ├── crud/
  │   └── service.types.ts
  ├── models/
  │   ├── doctor.types.ts
  │   ├── patient.types.ts
  │   ├── medication.types.ts
  │   ├── appointment.types.ts
  │   ├── prescription.types.ts
  │   ├── insurance.types.ts
  │   └── entity.types.ts
  ├── stats/
  │   └── stats.types.ts
  ├── utils/
  │   └── utility.types.ts
  └── types.md
```

---

## 📁 File: `/types/api/response.types.ts`

```ts
/**
 * Unified API response interface for all services.
 *
 * @template T - The main content/data returned by the API.
 * @template M - Optional metadata associated with the response.
 */
export interface ApiResponse<T = unknown, M = unknown> {
  /**
   * Main data or content returned by the API.
   */
  content: T

  /**
   * Status object indicating success, error, etc.
   */
  status: ResponseStatus

  /**
   * Timestamp when the response was generated (ISO format).
   */
  timestamp: string

  /**
   * Optional metadata field for additional context.
   */
  metadata?: M
}
```

```ts
/**
 * Success response with optional metadata.
 *
 * @template T - Content type.
 * @template M - Metadata type.
 */
export type SuccessResponse<T = unknown, M = unknown> = ApiResponse<T, M> & {
  status: ResponseStatus<'success'>
}
```

```ts
/**
 * Error response with no content.
 */
export type ErrorResponse = ApiResponse<{ error?: string }, never> & {
  status: ResponseStatus<'error'>
}
```

```ts
/**
 * Warning response with optional content.
 *
 * @template T - Content type.
 */
export type WarningResponse<T = unknown> = ApiResponse<T> & {
  status: ResponseStatus<'warning'>
}
```

```ts
/**
 * Informational response with optional content.
 *
 * @template T - Content type.
 */
export type InfoResponse<T = unknown> = ApiResponse<T> & {
  status: ResponseStatus<'info'>
}
```

```ts
/**
 * Unified response type used across services.
 *
 * @template T - Content type.
 */
export type Response<T = unknown> =
  | SuccessResponse<T>
  | ErrorResponse
  | WarningResponse<T>
  | InfoResponse<T>
```

---

## 📁 File: `/types/api/status.types.ts`

```ts
/**
 * Represents the type of response status.
 */
export type StatusType = 'success' | 'error' | 'warning' | 'info'
```

```ts
/**
 * Interface for response status details.
 *
 * @template T - The discriminant status type (e.g., 'success', 'error').
 */
export interface ResponseStatus<T extends StatusType = 'success'> {
  code: number
  message: string
  type: T
}
```

---

## 📁 File: `/types/pagination/pagination.types.ts`

```ts
/**
 * Pagination request parameters.
 */
export interface PaginationRequest {
  page: number // Zero-based page index
  size: number // Number of items per page
}
```

```ts
/**
 * Pagination metadata included in responses.
 */
export interface PaginationMetadata {
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
```

```ts
/**
 * Paginated response containing list and metadata.
 *
 * @template T - Type of item in the paginated list.
 */
export interface Paginated<T> {
  items: T[]
  pagination: PaginationMetadata
}
```

---

## 📁 File: `/types/data-display/display.types.ts`

```ts
/**
 * Available display views for data rendering.
 */
export type DataDisplayView = 'cards' | 'table'
```

```ts
/**
 * Configuration for a single form field.
 *
 * @template T - The type of data being edited or created.
 */
export interface FieldConfig<T> {
  name: keyof T & string
  label: string
  type: FieldType
  options?: string[]
  required?: boolean
  placeholder?: string
  disabled?: boolean
}
```

```ts
/**
 * Supported form field input types.
 */
export type FieldType = 'text' | 'email' | 'select' | 'number' | 'date'
```

```ts
/**
 * Configuration for rendering a single field in data displays.
 *
 * @template T - The type of data being displayed.
 */
export interface DataDisplayField<T> {
  key: keyof T
  label: string
  render?: (value: T[keyof T], item: T) => React.ReactNode
}
```

```ts
/**
 * Props for generic data display components like `DataDisplay`.
 *
 * @template T - The type of data being rendered.
 */
export interface DataDisplayProps<T extends { id: string }> {
  data: T[]
  isLoading?: boolean
  onEdit: (item: T) => void
  onDelete: (item: T) => void
  view?: DataDisplayView
  fields: DataDisplayField<T>[]
  emptyMessage?: string
  page?: number // Zero-based
  size?: number
  totalPages?: number
  onPageChange?: (page: number, size: number) => void
  onSortChange?: (sort: { key: keyof T; direction: 'asc' | 'desc' }) => void
}
```

---

## 📁 File: `/types/crud/service.types.ts`

```ts
import { Paginated, PaginationRequest } from '../pagination'

/**
 * Base interface for API services that support CRUD operations.
 *
 * @template T - The entity type.
 * @template C - Creation payload type.
 * @template U - Update payload type.
 */
export interface BaseService<T, C = T, U = Partial<T>> {
  getAll(params?: PaginationRequest): Promise<Paginated<T>>
  getById(id: string): Promise<T>
  create(data: C): Promise<T>
  update(id: string, data: U): Promise<T>
  delete(id: string): Promise<void>
}
```

```ts
/**
 * Generic implementation of BaseService for common CRUD operations.
 *
 * @template T - The entity type.
 * @template C - Creation payload type.
 * @template U - Update payload type.
 */
export class GenericService<T, C = T, U = Partial<T>>
  implements BaseService<T, C, U>
{
  constructor(private endpoint: string) {}

  async getAll(params: PaginationRequest = { page: 0, size: 10 }) {
    try {
      const res = await apiClient.get<Paginated<T>>(this.endpoint, { params })
      return res.data
    } catch (err) {
      throw createApiError(err)
    }
  }

  async getById(id: string) {
    try {
      const res = await apiClient.get<T>(`${this.endpoint}/${id}`)
      return res.data
    } catch (err) {
      throw createApiError(err)
    }
  }

  async create(data: C) {
    try {
      const res = await apiClient.post<T>(this.endpoint, data)
      return res.data
    } catch (err) {
      throw createApiError(err)
    }
  }

  async update(id: string, data: U) {
    try {
      const res = await apiClient.put<T>(`${this.endpoint}/${id}`, data)
      return res.data
    } catch (err) {
      throw createApiError(err)
    }
  }

  async delete(id: string) {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`)
    } catch (err) {
      throw createApiError(err)
    }
  }
}
```

---

## 📁 File: `/types/models/entity.types.ts`

```ts
import { Doctor } from './doctor.types'
import { Patient } from './patient.types'
import { Medication } from './medication.types'
import { Appointment } from './appointment.types'
import { Prescription } from './prescription.types'
import { Insurance } from './insurance.types'

/**
 * Union type representing all possible domain entities.
 */
export type Entity =
  | Doctor
  | Patient
  | Medication
  | Appointment
  | Prescription
  | Insurance
```

```ts
/**
 * Type alias for a CRUD service bound to a specific entity.
 *
 * @template T - The entity type.
 */
export type CrudService<T extends Entity> = GenericService<T>
```

---

## 📁 File: `/types/stats/stats.types.ts`

```ts
/**
 * Dashboard statistics model.
 */
export interface StatsData {
  doctors: number
  patients: number
  medications: number
  appointments: number
  prescriptions: number
  visits: number
  insurances: number
}
```

---

## 📁 File: `/types/utils/utility.types.ts`

```ts
/**
 * Makes certain keys required in T.
 *
 * @template T - The original type.
 * @template K - Keys to make required.
 */
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>
```

```ts
/**
 * Makes certain keys optional in T.
 *
 * @template T - The original type.
 * @template K - Keys to make optional.
 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>
```

```ts
/**
 * Extracts only the fields that match a given type.
 *
 * @template T - The object type.
 * @template FieldType - The target type to filter by.
 */
export type FilterFieldsByType<T, FieldType> = {
  [K in keyof T]: T[K] extends FieldType ? K : never
}[keyof T]
```

```ts
/**
 * Recursively makes all properties of an object optional.
 *
 * @template T - The object type.
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T
```

```ts
/**
 * Extracts members of a union where property K equals value V.
 *
 * @template T - The union type.
 * @template K - Discriminant key.
 * @template V - Expected value for K.
 */
export type FilterBy<T, K extends keyof T, V extends T[K]> =
  T extends Record<K, V> ? T : never
```

---

## 📄 File: `/types/types.md`

# 🧠 Types Documentation

This directory contains all shared TypeScript types used throughout the application.

## 📁 `/api/`

- `response.types.ts`: Defines unified structures for API responses including success, error, warning, and info types.
- `status.types.ts`: Defines the status codes and messages used in API responses.

## 📁 `/pagination/`

- `pagination.types.ts`: Includes interfaces for handling pagination requests and responses.

## 📁 `/data-display/`

- `display.types.ts`: Contains types related to rendering UI components like forms, tables, and cards.

## 📁 `/crud/`

- `service.types.ts`: Provides base interfaces and classes for implementing CRUD services.

## 📁 `/models/`

- Each file corresponds to a domain entity (`Doctor`, `Patient`, etc.).
- `entity.types.ts`: Exports a union type of all available entities.

## 📁 `/stats/`

- `stats.types.ts`: Models for dashboard statistics and analytics.

## 📁 `/utils/`

- `utility.types.ts`: Reusable utility types such as `WithRequired`, `DeepPartial`, and more.
