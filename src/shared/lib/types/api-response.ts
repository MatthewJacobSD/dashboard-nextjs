import { ResponseStatus } from './status'

/**
 * Base interface for API responses.
 *
 * @template T - Type of content returned by the API
 * @template M - Optional metadata associated with the response
 */
export interface ApiResponse<T = unknown, M = unknown> {
  /**
   * Main data or content of the response.
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

/**
 * Success response with optional metadata.
 *
 * @template T - Content type
 * @template M - Metadata type
 */
export type SuccessResponse<T = unknown, M = unknown> = ApiResponse<T, M> & {
  status: ResponseStatus<'success'>
}

/**
 * Error response with no content.
 */
export type ErrorResponse = ApiResponse<{ error?: string }, never> & {
  status: ResponseStatus<'error'>
}

/**
 * Warning response.
 *
 * @template T - Content type
 */
export type WarningResponse<T = unknown> = ApiResponse<T> & {
  status: ResponseStatus<'warning'>
}

/**
 * Informational response.
 *
 * @template T - Content type
 */
export type InfoResponse<T = unknown> = ApiResponse<T> & {
  status: ResponseStatus<'info'>
}

/**
 * Unified response type used across services.
 *
 * @template T - Content type
 */
export type Response<T = unknown> =
  | SuccessResponse<T>
  | ErrorResponse
  | WarningResponse<T>
  | InfoResponse<T>
