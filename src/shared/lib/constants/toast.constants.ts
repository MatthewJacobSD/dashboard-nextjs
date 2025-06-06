import { ToastEmojis, ToastMessages } from '../types'
import { EMOJI } from './emoji.constants'

/**
 * Standardized emojis for toast notifications.
 */
export const TOAST_EMOJIS: ToastEmojis = {
  success: EMOJI.STATUS.SUCCESS,
  error: EMOJI.STATUS.ERROR,
  warning: EMOJI.STATUS.WARNING,
  info: EMOJI.STATUS.INFO,
}

/**
 * Default toast messages used across the app.
 */
export const DEFAULT_TOAST_MESSAGES: ToastMessages = {
  success: `${TOAST_EMOJIS.success} Operation completed successfully.`,
  error: `${TOAST_EMOJIS.error} An unexpected error occurred.`,
  info: `${TOAST_EMOJIS.info} Here is some information.`,
  warning: `${TOAST_EMOJIS.warning} Please proceed with caution.`,
}

/**
 * Generates operation-specific messages for a given entity.
 *
 * @param name - The name of the entity (e.g., "Doctor", "Patient")
 */
export const VERB_ENTITY_TOAST_MESSAGES = (
  name: string
): Record<
  'create' | 'update' | 'delete' | 'fetch' | 'search',
  ToastMessages
> => ({
  create: {
    success: `${EMOJI.OPERATION.CREATE} ${name} created successfully.`,
    error: `${EMOJI.STATUS.ERROR} Failed to create ${name.toLowerCase()}.`,
    info: `${EMOJI.STATUS.INFO} ${name} creation complete.`,
    warning: `${EMOJI.OPERATION.DELETE} Confirm details before creating this ${name.toLowerCase()}.`,
  },
  update: {
    success: `${EMOJI.OPERATION.UPDATE} ${name} updated successfully.`,
    error: `${EMOJI.STATUS.ERROR} Failed to update ${name.toLowerCase()}.`,
    info: `${EMOJI.STATUS.INFO} ${name} has been modified.`,
    warning: `${EMOJI.OPERATION.UPDATE} You are editing this ${name.toLowerCase()}.`,
  },
  delete: {
    success: `${EMOJI.OPERATION.DELETE} ${name} deleted successfully.`,
    error: `${EMOJI.STATUS.ERROR} Failed to delete ${name.toLowerCase()}.`,
    info: `${EMOJI.STATUS.INFO} ${name} was removed.`,
    warning: `${EMOJI.STATUS.WARNING} This action cannot be undone.`,
  },
  fetch: {
    success: `${EMOJI.OPERATION.FETCH} ${name} loaded successfully.`,
    error: `${EMOJI.STATUS.ERROR} Failed to load ${name.toLowerCase()}.`,
    info: `${EMOJI.STATUS.INFO} Fetching ${name.toLowerCase()}...`,
    warning: `${EMOJI.STATUS.WARNING} No data found.`,
  },
  search: {
    success: `${EMOJI.STATUS.INFO} Search completed for ${name.toLowerCase()}.`,
    error: `${EMOJI.STATUS.ERROR} Search failed for ${name.toLowerCase()}.`,
    info: `${EMOJI.OPERATION.FETCH} Searching ${name.toLowerCase()}...`,
    warning: `${EMOJI.STATUS.WARNING} No results found.`,
  },
})
