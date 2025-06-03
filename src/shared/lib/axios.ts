import axios, { type AxiosError } from 'axios';

/**
 * 🚀 Axios instance with custom defaults for our healthcare API.
 * This is the base config used throughout the app for making HTTP requests.
 */
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Base URL for all API calls
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout after 10 seconds
});

// 🔍 Optional Request Interceptor - Log outgoing requests
api.interceptors.request.use(
  (config) => {
    console.log('📤 [REQUEST] Outgoing:', {
      url: config.url,
      method: config.method?.toUpperCase(),
      baseURL: config.baseURL,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('🚫 [REQUEST] Error in request pipeline:', error.message);
    return Promise.reject(error);
  }
);

// ✅ Success Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log('🟢 [RESPONSE] Success:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },

  // ❌ Error Response Interceptor - Unified handling
  (error: AxiosError<{ message?: string }>) => {
    const { config, response, message } = error;

    console.groupCollapsed('🔴 [ERROR] Error caught in interceptor');
    console.log('Request Config:', {
      url: config?.url,
      method: config?.method,
      baseURL: config?.baseURL,
    });
    console.log('Error Message:', message);
    console.log('Full Error Object:', error);
    console.groupEnd();

    // 🌐 Network or CORS error — no response object
    if (!response) {
      const errorMsg = '🌐 Network error or server unreachable';
      console.warn('💡 Throwing error:', errorMsg);
      throw new Error(errorMsg);
    }

    const { status, data } = response;

    const errorMessage = data?.message || '';

    // 📡 Handle known HTTP errors
    switch (status) {
      case 400:
        const badRequestMsg = errorMessage || '❌ Bad request: Invalid input';
        console.warn('💡 Throwing error:', badRequestMsg);
        throw new Error(badRequestMsg);

      case 401:
        const unauthorizedMsg = errorMessage || '🔑 Unauthorized access';
        console.warn('💡 Throwing error:', unauthorizedMsg);
        throw new Error(unauthorizedMsg);

      case 403:
        const forbiddenMsg = errorMessage || '🚫 Forbidden: Access denied';
        console.warn('💡 Throwing error:', forbiddenMsg);
        throw new Error(forbiddenMsg);

      case 404:
        const notFoundMsg = errorMessage || '🔍 Not found';
        console.warn('💡 Throwing error:', notFoundMsg);
        throw new Error(notFoundMsg);

      case 422:
        const unprocessableMsg = errorMessage || '📄 Unprocessable entity: Validation failed';
        console.warn('💡 Throwing error:', unprocessableMsg);
        throw new Error(unprocessableMsg);

      case 500:
        const serverErrorMsg = errorMessage || '💥 Internal server error';
        console.warn('💡 Throwing error:', serverErrorMsg);
        throw new Error(serverErrorMsg);

      default:
        const unknownMsg = errorMessage || `❓ Unknown error [${status}]`;
        console.warn('💡 Throwing error:', unknownMsg);
        throw new Error(unknownMsg);
    }
  }
);

/**
 * 🔁 Export configured instance so it can be imported and used anywhere.
 */
export { api };