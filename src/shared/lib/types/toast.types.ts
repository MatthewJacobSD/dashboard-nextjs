/**
 * Available toast types.
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning'

/**
 * Emoji set for different toast types.
 */
export interface ToastEmojis {
  success: string
  error: string
  info: string
  warning: string
}

/**
 * Base structure for static or dynamic toast messages.
 */
export interface ToastMessages {
  success: string
  error: string
  info: string
  warning: string
  [key: string]: string // Allow custom keys
}

/**
 * Configuration for a specific module or feature.
 */
export interface ToastConfig {
  emoji: ToastEmojis
  messages: ToastMessages
}
