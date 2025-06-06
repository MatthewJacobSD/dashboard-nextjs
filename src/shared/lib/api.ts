import axios, { AxiosError, AxiosResponse } from 'axios'

/**
 * Emoji-based icons for different log types.
 */
const icon = {
  success: '🟢',
  created: '🟣',
  warning: '🟡',
  error: '🔴',
  notFound: '⚫',
  serverError: '🔥',
  cors: '🌐',
  custom_msg: '❗',
  status: '🔵',
  method: '📦',
  url: '🐛',
  data: '♨️',
} as const

/**
 * Standard API error response format.
 */
interface ApiErrorResponse {
  message?: string
  [key: string]: unknown
}

/**
 * Base URL for the backend API.
 */
const BASE_URL = 'http://localhost:8080/api'

/**
 * Configured Axios instance with:
 * - Base URL
 * - JSON content type header
 * - 10-second timeout
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

/**
 * Response interceptor for successful responses.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const { status, statusText, config, data } = response
    const label =
      status === 201 ? `${icon.created} Created` : `${icon.success} Success`

    console.log(
      `${label}\n` +
        `${icon.status} Status: ${status} ${statusText}\n` +
        `${icon.method} Method: ${config.method?.toUpperCase()}\n` +
        `${icon.url} Endpoint: ${config.url}\n` +
        `${icon.data} Response: ${JSON.stringify(data, null, 2)}`
    )

    return response
  },

  /**
   * Error interceptor for failed responses.
   */
  (error: AxiosError<ApiErrorResponse>) => {
    const { config, response, message } = error

    console.group(`${icon.error} Axios Error`)

    // Log basic request info
    console.log(
      `${icon.method} Failed Request:\n` +
        `  ${icon.url} ${config?.method?.toUpperCase()} ${config?.url}\n` +
        `  ${icon.data} ${config?.data ? JSON.stringify(config.data, null, 2) : 'No body'}`
    )

    // Network or CORS errors (no response)
    if (!response) {
      console.warn(`${icon.cors} Network Error: ${message}`)
      console.groupEnd()
      return Promise.reject(error)
    }

    const { status, statusText, data } = response
    const errorMsg = data?.message ?? 'No additional error details'

    // Status-specific handling
    switch (status) {
      case 400:
        console.warn(`${icon.warning} 400 Bad Request: ${errorMsg}`)
        break
      case 404:
        console.warn(`${icon.notFound} 404 Not Found: ${errorMsg}`)
        break
      case 500:
        console.error(`${icon.serverError} 500 Server Error: ${errorMsg}`)
        break
      default:
        console.warn(`${icon.warning} ${status} ${statusText}: ${errorMsg}`)
    }

    // Full error details
    console.log(`${icon.custom_msg} Complete Error:\n`, {
      status,
      message: errorMsg,
      url: config?.url,
      method: config?.method,
      data: data,
    })

    console.groupEnd()
    return Promise.reject(error)
  }
)

/**
 * Creates a standardized error object from any error source.
 *
 * @param error - The raw error object
 * @returns A consistent error shape for use in UI or logs
 */
export function createApiError(error: unknown): ApiErrorResponse {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      code: error.code,
    }
  }

  return {
    message: error instanceof Error ? error.message : 'Unknown error',
  }
}
