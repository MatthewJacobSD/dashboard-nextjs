'use client'

import { useEffect, useState } from 'react'
import { ProgressBar } from '../state/ProgressBar'
import { cn } from '@/shared/utils/cn'

export type FieldType = 'text' | 'email' | 'select' | 'number' | 'date'

export interface FieldConfig<T> {
  name: keyof T & string
  label: string
  type: FieldType
  options?: string[]
  required?: boolean
  placeholder?: string
  disabled?: boolean // Fixed typo from 'string' to 'boolean'
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
}: CrudFormProps<T>) {
  const [isPending, setIsPending] = useState(false)
  const [showProgress, setShowProgress] = useState(false)

  useEffect(() => {
    let progressTimer: NodeJS.Timeout

    if (isPending) {
      progressTimer = setTimeout(() => {
        setShowProgress(true)
      }, 1000)
    } else {
      setShowProgress(false)
    }

    return () => clearTimeout(progressTimer)
  }, [isPending])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    try {
      formAction(formData)
    } finally {
      setIsPending(false)
    }
  }

  const getValue = (key: keyof T) => initialValues[key] ?? ''

  if (!isOpen) return null

  return (
    <>
      <ProgressBar isLoading={showProgress} />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <form
          onSubmit={handleSubmit}
          className={cn(
            'bg-white border border-gray-200',
            'p-4 sm:p-6 rounded-lg shadow-xl',
            'w-full max-w-md mx-4',
            'space-y-4',
            'animate-in fade-in zoom-in-95',
            'max-h-[90vh] overflow-y-auto'
          )}
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      id={field.name}
                      name={field.name}
                      defaultValue={getValue(field.name) as string}
                      className={cn(
                        'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none',
                        fieldErrors[field.name]
                          ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                        'disabled:bg-gray-50 disabled:text-gray-500'
                      )}
                      disabled={isPending || field.disabled}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      required={field.required}
                      defaultValue={getValue(field.name) as string}
                      placeholder={field.placeholder}
                      className={cn(
                        'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none',
                        fieldErrors[field.name]
                          ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                        'disabled:bg-gray-50 disabled:text-gray-500'
                      )}
                      disabled={isPending || field.disabled}
                    />
                  )}

                  {fieldErrors[field.name] && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors[field.name]![0]}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={isPending}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md',
                  'border border-gray-300 shadow-sm',
                  'bg-white text-gray-700 hover:bg-gray-50',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md shadow-sm',
                  'bg-blue-600 text-white hover:bg-blue-700',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center justify-center gap-2'
                )}
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  submitText
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}