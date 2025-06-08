'use client'

import { useEffect, useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { ProgressBar } from '../state/ProgressBar'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { cn } from '@/shared/utils/cn'
import { formatPhoneNumber } from '@/shared/utils/formatPhoneNumber'

export type FieldType =
  | 'text'
  | 'email'
  | 'select'
  | 'number'
  | 'date'
  | 'checkbox'
  | 'textarea'
  | 'tel'

export interface FieldConfig<T> {
  name: keyof T & string
  label: string
  type: FieldType
  options?: { value: string; label: string }[] | (() => Promise<{ value: string; label: string }[]>)
  required?: boolean
  placeholder?: string
  disabled?: boolean
  pattern?: string
  inputMode?: 'numeric' | 'text' | 'tel' | 'email'
}

interface CrudFormProps<T> {
  initialValues?: Partial<T>
  formAction: (formData: FormData) => void
  fields: FieldConfig<T>[]
  onCancel: () => void
  isOpen: boolean
  title?: string
  submitText?: string
  fieldErrors?: Partial<Record<keyof T, string[]>>
  onSuccess?: () => void
}

function FormContent<T>({
  fields,
  onCancel,
  title,
  submitText,
  fieldErrors = {},
  initialValues = {},
  onSuccess,
}: Omit<CrudFormProps<T>, 'formAction' | 'isOpen'>) {
  const { pending } = useFormStatus()
  const [showProgress, setShowProgress] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fieldOptions, setFieldOptions] = useState<Record<string, { value: string; label: string }[]>>({})
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Fetch async options for select fields
  useEffect(() => {
    Promise.all(
      fields
        .filter(
          (field): field is FieldConfig<T> & { options: () => Promise<{ value: string; label: string }[]> } =>
            field.type === 'select' && typeof field.options === 'function'
        )
        .map(async (field) => ({
          name: field.name,
          options: await field.options(),
        }))
    ).then((results) => {
      setFieldOptions((prev) =>
        results.reduce((acc, { name, options }) => ({ ...acc, [name]: options }), prev)
      )
    })
  }, [fields])

  // Progress bar delay
  useEffect(() => {
    let progressTimer: NodeJS.Timeout
    if (isLoading) {
      progressTimer = setTimeout(() => setShowProgress(true), 1000)
    } else {
      setShowProgress(false)
    }
    return () => clearTimeout(progressTimer)
  }, [isLoading])

  // Minimum loading duration
  useEffect(() => {
    let loadingTimer: NodeJS.Timeout
    if (pending) {
      setHasSubmitted(true)
      setIsLoading(true)
    } else if (hasSubmitted) {
      loadingTimer = setTimeout(() => setIsLoading(false), 500)
    }
    return () => clearTimeout(loadingTimer)
  }, [pending, hasSubmitted])

  // Auto-close on success
  useEffect(() => {
    let closeTimer: NodeJS.Timeout
    if (hasSubmitted && !isLoading && onSuccess) {
      closeTimer = setTimeout(() => onCancel(), 1000)
    }
    return () => clearTimeout(closeTimer)
  }, [hasSubmitted, isLoading, onSuccess, onCancel])

  const getValue = (key: keyof T, type: FieldType) => {
    const value = initialValues[key]
    if (type === 'checkbox') return value === true || value === 'true'
    if (type === 'date' && value instanceof Date) return value.toISOString().split('T')[0]
    if (key === 'phoneNumber' && typeof value === 'string') return value.replace(/-/g, '/')
    return value ?? ''
  }

  return (
    <>
      <ProgressBar isLoading={showProgress} />
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-purple-900 text-white px-4 py-3 rounded-t-lg">
          <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        </div>

        {/* Scrollable Content Area */}
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label
                htmlFor={field.name}
                className="block text-base sm:text-lg font-medium text-gray-800"
              >
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </label>

              {/* Select Input */}
              {field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  defaultValue={getValue(field.name, field.type) as string}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-md border border-gray-300 bg-white',
                    'focus:outline-none focus:ring-2 focus:ring-purple-400',
                    fieldErrors[field.name]
                      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                      : '',
                    'disabled:bg-gray-100 disabled:text-gray-500',
                    'text-sm sm:text-base'
                  )}
                  disabled={isLoading || field.disabled}
                >
                  <option value="">Select {field.label}</option>
                  {(typeof field.options === 'function'
                    ? fieldOptions[field.name]
                    : field.options
                  )?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <input
                  id={field.name}
                  name={field.name}
                  type="checkbox"
                  checked={getValue(field.name, field.type) as boolean}
                  onChange={() => {}}
                  className={cn(
                    'h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-400',
                    fieldErrors[field.name]
                      ? 'border-red-300 text-red-900 focus:ring-red-500'
                      : '',
                    'disabled:bg-gray-100 disabled:text-gray-500'
                  )}
                  disabled={isLoading || field.disabled}
                />
              ) : field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  defaultValue={getValue(field.name, field.type) as string}
                  placeholder={field.placeholder}
                  required={field.required}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-md border border-gray-300 bg-white',
                    'focus:outline-none focus:ring-2 focus:ring-purple-400',
                    fieldErrors[field.name]
                      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                      : '',
                    'disabled:bg-gray-100 disabled:text-gray-500',
                    'text-sm sm:text-base'
                  )}
                  disabled={isLoading || field.disabled}
                />
              ) : field.type === 'tel' && field.name === 'phoneNumber' ? (
                <input
                  id={field.name}
                  name={field.name}
                  type="tel"
                  required={field.required}
                  defaultValue={getValue(field.name, field.type) as string}
                  placeholder={field.placeholder}
                  // pattern="\d{3}/\d{3}/\d{4}"
                  className={cn(
                    'w-full px-4 py-2.5 rounded-md border border-gray-300 bg-white',
                    'focus:outline-none focus:ring-2 focus:ring-purple-400',
                    fieldErrors[field.name]
                      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                      : '',
                    'disabled:bg-gray-100 disabled:text-gray-500',
                    'text-sm sm:text-base'
                  )}
                  disabled={isLoading || field.disabled}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    const input = e.target
                    const form = input.form!
                    const formData = new FormData(form)
                    formData.set(input.name, formatted)
                    Object.entries(Object.fromEntries(formData)).forEach(([key, value]) => {
                      const el = form.elements.namedItem(key) as HTMLInputElement
                      if (el && el.name === key) {
                        el.value = value as string
                      }
                    })
                  }}
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  defaultValue={getValue(field.name, field.type) as string}
                  placeholder={field.placeholder}
                  pattern={field.pattern}
                  inputMode={field.inputMode}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-md border border-gray-300 bg-white',
                    'focus:outline-none focus:ring-2 focus:ring-purple-400',
                    fieldErrors[field.name]
                      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                      : '',
                    'disabled:bg-gray-100 disabled:text-gray-500',
                    'text-sm sm:text-base'
                  )}
                  disabled={isLoading || field.disabled}
                />
              )}

              {fieldErrors[field.name] && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">
                  {fieldErrors[field.name]![0]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md',
              'border border-gray-300 shadow-sm',
              'bg-gray-200 text-gray-700 hover:bg-gray-300',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md shadow-sm',
              'bg-purple-600 text-white hover:bg-purple-700',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center justify-center gap-2'
            )}
          >
            {isLoading ? <LoadingSpinner size="sm" variant="primary" /> : submitText}
          </button>
        </div>
      </div>
    </>
  )
}

export function CrudForm<T>({
  initialValues = {},
  formAction,
  fields,
  onCancel,
  isOpen,
  title = 'Form',
  submitText = 'Submit',
  fieldErrors = {},
  onSuccess,
}: CrudFormProps<T>) {
  const [, startTransition] = useTransition()

  const modifiedFormAction = (formData: FormData) => {
    try {
      const phoneNumber = formData.get('phoneNumber') as string
      if (phoneNumber && phoneNumber.match(/^\d{3}\/\d{3}\/\d{4}$/)) {
        formData.set('phoneNumber', phoneNumber.replace(/\//g, '-'))
      } else if (phoneNumber && !phoneNumber.match(/^\d{3}-\d{3}-\d{4}$/)) {
        console.error('Invalid phone number format:', phoneNumber)
      }
      formAction(formData)
    } catch (error) {
      console.error('Error in modifiedFormAction:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <form
        action={(formData) => startTransition(() => modifiedFormAction(formData))}
        className={cn(
          'bg-gray-50 border border-gray-200',
          'p-4 sm:p-6 rounded-lg shadow-xl',
          'w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto',
          'space-y-6',
          'animate-in fade-in zoom-in-95',
          'max-h-[90vh] overflow-y-auto'
        )}
      >
        <FormContent
          initialValues={initialValues}
          fields={fields}
          onCancel={onCancel}
          title={title}
          submitText={submitText}
          fieldErrors={fieldErrors}
          onSuccess={onSuccess}
        />
      </form>
    </div>
  )
}