/**
 * Emoji constants used throughout the application.
 */
export const EMOJI = {
  /**
   * Status indicators
   */
  STATUS: {
    SUCCESS: '🟢',
    CREATED: '🟣',
    WARNING: '🟡',
    ERROR: '🔴',
    NOT_FOUND: '⚫',
    SERVER_ERROR: '🔥',
    CORS: '🌐',
    CUSTOM_MESSAGE: '❗',
    STATUS: '🔵',
    INFO: '⚡',
  },

  /**
   * Operation-related icons
   */
  OPERATION: {
    CREATE: '➕',
    UPDATE: '♻️',
    DELETE: '🗑️',
    FETCH: '🔍', // Also used for GET
    METHOD: '📦',
  },

  /**
   * Debugging or data context
   */
  DEBUG: {
    URL: '🐛',
    DATA: '♨️',
  },
} as const
