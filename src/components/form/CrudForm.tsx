'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/shared/utils/cn'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { ProgressBar } from '@/components/state/ProgressBar'

type FieldType = 'text' | 'email' | 'select' | 'number' | 'date'

interface FieldConfig<T> {
    name: keyof T & string
    label: string
    type: FieldType
    options?: string[]
    required?: boolean
    placeholder?: string
    disabled?: boolean
}

interface CrudFormProps<T> {
    initialValues?: Partial<T>
    formAction: (formData: FormData) => void
    fields: FieldConfig<T>[]
    onCancel: () => void
    isOpen: boolean
    title?: string
    submitText?: string
    fieldErrors?: Record<keyof T, string[]>
}

export function CrudForm<T>({ initialValues = {}, formAction, fields, onCancel, isOpen, title = 'Form', submitText = 'Submit', fieldErrors = {} }: CrudFormProps<T>) {
    const [formData, setFormData] = useState<Partial<T>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [showProgress, setShowProgress] = useState(false)

    // Sync initial values when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData(initialValues)
        }
    }, [initialValues, isOpen])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formDataObj = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            formDataObj.append(key, value as string)
        })

        setTimeout(() => {
            formAction(formDataObj)
            setIsLoading(false)
            setShowProgress(false)
        }, 1000)
    }

    const getInputType = (field: FieldConfig<T>): React.HTMLInputTypeAttribute => {
        switch (field.type) {
            case 'text':
            case 'email':
            case 'number':
            case 'date':
                return field.type
            default:
                return 'text'
        }
    }

    return (
        <Dialog open={isOpen} onClose={onCancel} title={title}>
            <ProgressBar isLoading={showProgress} />

            <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                    <div key={field.name} className="space-y-1">
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'select' ? (
                            <select
                                id={field.name}
                                name={field.name}
                                value={(formData[field.name] as string) || ''}
                                onChange={handleChange}
                                disabled={field.disabled}
                                className={cn(
                                    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                                    field.disabled && 'bg-gray-100 cursor-not-allowed'
                                )}
                            >
                                <option value="">Select an option</option>
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
                                type={getInputType(field)}
                                value={(formData[field.name] as string) || ''}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                required={field.required}
                                disabled={field.disabled}
                                className={cn(
                                    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                                    field.disabled && 'bg-gray-100 cursor-not-allowed'
                                )}
                            />
                        )}

                        {fieldErrors[field.name] && (
                            <p className="text-sm text-red-500">{fieldErrors[field.name]}</p>
                        )}
                    </div>
                ))}

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={onCancel} type="button">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            submitText
                        )}
                    </Button>
                </div>
            </form>
        </Dialog>
    )
}