/**
 * Interface for statistical data counts
 */
export interface StatsData {
  /** Number of doctors in the database */
  doctors: number
  /** Number of patients in the database */
  patients: number
  /** Number of medications in the database */
  medications: number
  /** Number of appointments in the database */
  appointments: number
  /** Number of prescriptions in the database */
  prescriptions: number
  /** Number of visits in the database */
  visits: number
  /** Number of insurance records in the database */
  insurances: number
}

/**
 * Interface for pagination request parameters
 */
export interface PaginationRequest {
  /** Current page number for pagination */
  page: number
  /** Number of items per page */
  size: number
}

/**
 * Interface for pagination metadata
 */
export interface PaginationMetadata {
  /** Total number of items available */
  totalItems: number
  /** Total number of pages based on page size */
  totalPages: number
  /** Current page number */
  currentPage: number
  /** Number of items per page */
  pageSize: number
  /** Indicates if there is a next page */
  hasNextPage: boolean
  /** Indicates if there is a previous page */
  hasPreviousPage: boolean
}

/**
 * Interface for paginated response
 * @template T - Type of items in the paginated response
 */
export interface Paginated<T> {
  /** Array of items for the current page */
  items: T[]
  /** Metadata for pagination details */
  pagination: PaginationMetadata
}

/**
 * Type for API response status
 */
export type StatusType = 'success' | 'error' | 'warning' | 'info'

/**
 * Interface for response status
 * @template T - Specific status type
 */
export interface ResponseStatus<T extends StatusType = 'success'> {
  /** HTTP status code or custom code */
  code: number
  /** Descriptive message for the response status */
  message: string
  /** Type of response status (success, error, warning, info) */
  type: T
}

/**
 * Interface for generic API response
 * @template T - Type of content
 * @template M - Type of metadata
 */
export interface ApiResponse<T = unknown, M = unknown> {
  /** Main content or data of the response */
  content: T
  /** Status details of the response */
  status: ResponseStatus
  /** ISO timestamp of when the response was generated */
  timestamp: string
  /** Optional metadata for additional context */
  metadata?: M
}

/**
 * Type for successful API response
 * @template T - Type of content
 * @template M - Type of metadata
 */
export type SuccessResponse<T = unknown, M = unknown> = ApiResponse<T, M> & {
  /** Response status specifically for successful operations */
  status: ResponseStatus<'success'>
}

/**
 * Type for error API response
 */
export type ErrorResponse = ApiResponse<{ error?: string }, never> & {
  /** Response status specifically for error cases */
  status: ResponseStatus<'error'>
}

/**
 * Type for warning API response
 * @template T - Type of content
 */
export type WarningResponse<T = unknown> = ApiResponse<T> & {
  /** Response status specifically for warning cases */
  status: ResponseStatus<'warning'>
}

/**
 * Type for informational API response
 * @template T - Type of content
 */
export type InfoResponse<T = unknown> = ApiResponse<T> & {
  /** Response status specifically for informational cases */
  status: ResponseStatus<'info'>
}

/**
 * Unified Response Type - use this as return type for all API services
 * @template T - Type of content
 */
export type Response<T = unknown> =
  | SuccessResponse<T> // Response type for successful API calls
  | ErrorResponse // Response type for error API calls
  | WarningResponse<T> // Response type for warning API calls
  | InfoResponse<T> // Response type for informational API calls
