import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

//. ---- Constants ----
/**
 * Icons for different types of log messages
 */
const icon = {
  success: "🟢",
  created: "🟣",
  warning: "🟡",
  error: "🔴",
  notFound: "⚫",
  serverError: "🔥",
  cors: "🌐",
  custom_msg: "❗",
  status: "🔵",
  method: "📦",
  url: "🐛",
  data: "♨️",
} as const;

//. ---- Type Definitions ----
/**
 * Standard API error response format
 */
interface ApiErrorResponse {
  message?: string;
  [key: string]: unknown;
}

/**
 * Enhanced Axios config with type-safe error handling
 */
interface TypedAxiosConfig<D = unknown> extends InternalAxiosRequestConfig<D> {
  _retry?: boolean;
}

// ====== Axios Instance Configuration ======
/**
 * Configured Axios instance with:
 * - Base URL for SpringBoot backend
 * - JSON content type header
 * - 10 second timeout
 */
export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

//. ---- Request Interceptor ----
/**
 * Logs outgoing requests for debugging
 */
axiosInstance.interceptors.request.use((config) => {
  console.log(
    `${icon.method} [${config.method?.toUpperCase()}] ${config.url}\n` +
    `${icon.data} Request Data: ${config.data ? JSON.stringify(config.data, null, 2) : 'None'}`
  );
  return config;
});

//. ---- Success Response Interceptor ----
/**
 * Handles successful responses with formatted logging
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { status, statusText, config, data } = response;
    const label = status === 201 
      ? `${icon.created} Created` 
      : `${icon.success} Success`;

    console.log(
      `${label}\n` +
      `${icon.status} Status: ${status} ${statusText}\n` +
      `${icon.method} Method: ${config.method?.toUpperCase()}\n` +
      `${icon.url} Endpoint: ${config.url}\n` +
      `${icon.data} Response: ${JSON.stringify(data, null, 2)}`
    );

    return response;
  },

  //. ---- Error Response Interceptor ----
  /**
   * Handles API errors with detailed, typed error logging
   */
  (error: AxiosError<ApiErrorResponse>) => {
    const { config, response, message } = error;
    const typedConfig = config as TypedAxiosConfig;

    console.group(`${icon.error} Axios Error`);

    // Log basic request info
    console.log(
      `${icon.method} Failed Request:\n` +
      `  ${icon.url} ${typedConfig?.method?.toUpperCase()} ${typedConfig?.url}\n` +
      `  ${icon.data} ${typedConfig?.data ? JSON.stringify(typedConfig.data, null, 2) : 'No body'}`
    );

    // Handle network/CORS errors (no response)
    if (!response) {
      console.warn(`${icon.cors} Network Error: ${message}`);
      console.groupEnd();
      return Promise.reject(error);
    }

    const { status, statusText, data } = response;
    const errorMsg = data?.message ?? "No additional error details";

    // Status-specific handling
    switch (status) {
      case 400:
        console.warn(`${icon.warning} 400 Bad Request: ${errorMsg}`);
        break;
      case 401:
        console.warn(`${icon.warning} 401 Unauthorized: ${errorMsg}`);
        break;
      case 403:
        console.warn(`${icon.warning} 403 Forbidden: ${errorMsg}`);
        break;
      case 404:
        console.warn(`${icon.notFound} 404 Not Found: ${errorMsg}`);
        break;
      case 500:
        console.error(`${icon.serverError} 500 Server Error: ${errorMsg}`);
        break;
      default:
        console.warn(`${icon.warning} ${status} ${statusText}: ${errorMsg}`);
    }

    // Full error details
    console.log(`${icon.custom_msg} Complete Error:\n`, {
      status,
      message: errorMsg,
      url: typedConfig.url,
      method: typedConfig.method,
      data: data
    });

    console.groupEnd();
    return Promise.reject(error);
  }
);

// ====== Utility Functions ======
/**
 * Creates a standardized error object
 */
export function createApiError(error: unknown): ApiErrorResponse {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      code: error.code
    };
  }
  return {
    message: error instanceof Error ? error.message : 'Unknown error'
  };
}