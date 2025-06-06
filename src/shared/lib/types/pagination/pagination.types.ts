/**
 * Pagination request parameters.
 */
export interface PaginationRequest {
  page: number // Zero-based page index
  size: number // Number of items per page
}

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

/**
 * Paginated response containing list and metadata.
 *
 * @template T - Type of item in the paginated list.
 */
export interface Paginated<T> {
  items: T[]
  pagination: PaginationMetadata
}
