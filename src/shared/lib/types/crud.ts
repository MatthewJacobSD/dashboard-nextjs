/**
 * Supported form field input types.
 */
export type FieldType = 'text' | 'email' | 'select' | 'number' | 'date'

/**
 * Configuration for a single form field.
 *
 * @template T - The type of data being edited or created
 */
export interface FieldConfig<T> {
  name: keyof T & string
  label: string
  type: FieldType
  options?: string[]
  required?: boolean
  placeholder?: string
  disabled?: boolean
}
