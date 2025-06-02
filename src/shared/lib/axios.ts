import axios from 'axios'

// 🚀 Create an Axios instance with custom defaults
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Base URL for all API calls
  headers: { 'Content-Type': 'application/json' }, // Default JSON header
  timeout: 10000, // Timeout after 10s if no response
})

// 🛡️ Response interceptor to handle errors globally
api.interceptors.response.use(
  // ✅ If the request was successful, log key details and return the response
  (response) => {
    console.log('🟢 Success:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  // ❌ Handle any error here
  (error) => {
    console.error('🔴 Error caught in interceptor:', error);

    // 🌐 Network error (no response at all)
    if (!error.response) {
      console.error('🌐 Network error:', error.message);
      const errorMsg = 'Network error, please try again later 😕';
      console.error('💡 Throwing error:', errorMsg);
      throw new Error(errorMsg);
    }

    // 📡 Switch on HTTP status codes
    switch (error.response.status) {
      case 400:
        console.error('❌ Bad request:', error.response.data);
        const badRequestMsg = error.response.data.message || 'Invalid data submitted';
        console.error('💡 Throwing error:', badRequestMsg);
        throw new Error(badRequestMsg);

      case 404:
        console.error('🔍 Not found:', error.response.data);
        const notFoundMsg = error.response.data.message || 'Resource not found';
        console.error('💡 Throwing error:', notFoundMsg);
        throw new Error(notFoundMsg);

      case 422:
        console.error('📄 Unprocessable entity:', error.response.data);
        const unprocessableMsg = error.response.data.message || 'Invalid data format';
        console.error('💡 Throwing error:', unprocessableMsg);
        throw new Error(unprocessableMsg);

      case 500:
        console.error('💥 Internal server error:', error.response.data);
        const serverErrorMsg = error.response.data.message || 'Server error, try again later';
        console.error('💡 Throwing error:', serverErrorMsg);
        throw new Error(serverErrorMsg);

      default:
        console.error('❓ Unknown error:', error.response.data);
        const unknownMsg = error.response.data.message || 'Something went wrong';
        console.error('💡 Throwing error:', unknownMsg);
        throw new Error(unknownMsg);
    }
  }
)

// 🔁 Export the configured instance
export { api }