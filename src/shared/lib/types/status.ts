/**
 * Represents the type of response status.
 */
export type StatusType = 'success' | 'error' | 'warning' | 'info'

/**
 * Interface for response status details.
 *
 * @template T - The discriminant status type (e.g., 'success', 'error')
 */
export interface ResponseStatus<T extends StatusType = 'success'> {
  code: number
  message: string
  type: T
}
