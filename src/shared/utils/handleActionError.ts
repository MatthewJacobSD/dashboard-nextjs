import { toast } from 'react-toastify'
import { z } from 'zod'
import { EMOJI } from '../lib/constants/emoji.constants'
import { VERB_ENTITY_TOAST_MESSAGES } from '../lib/constants/toast.constants'

/**
 * Standardized error handler for form actions.
 *
 * Handles both Zod validation errors and general runtime errors.
 */
export function handleActionError(
  error: unknown | z.ZodError,
  entityName?: string
): {
  success: false
  error: string
  fieldErrors?: Record<string, string[]>
} {
  if (error instanceof z.ZodError) {
    const fieldErrors = error.flatten().fieldErrors
    const errorMsg = `${EMOJI.STATUS.ERROR} Validation failed`
    console.error(errorMsg, fieldErrors)

    return {
      success: false,
      error: errorMsg,
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).map(([key, messages]) => [
          key,
          messages || [],
        ])
      ),
    }
  }

  let errorMessage = ''

  if (entityName) {
    // Use create-specific error message from verb-based messages
    const { create } = VERB_ENTITY_TOAST_MESSAGES(entityName)
    errorMessage = create.error
  } else {
    // Fallback to generic error message
    errorMessage = `${EMOJI.STATUS.ERROR} ${
      error instanceof Error ? error.message : 'Operation failed'
    }`
  }

  console.error(errorMessage)
  toast.error(errorMessage)

  return { success: false, error: errorMessage }
}
