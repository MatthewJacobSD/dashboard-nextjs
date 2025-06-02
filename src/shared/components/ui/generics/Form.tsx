'use client';

import { useForm, FieldValues, SubmitHandler, Path, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/shared/utils/cnUtils';
import { ReactNode } from 'react';
import { ZodType } from 'zod';

export type FormFieldType = 'text' | 'email' | 'select' | 'textarea' | 'number' | 'date' | 'checkbox';

export interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: FormFieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  defaultValue?: unknown;
}

// Update the interface to use DeepPartial for nested objects
interface GenericFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  fields: FormField<T>[];
  onSubmit: SubmitHandler<T>;
  onCancel: () => void;
  defaultValues?: DefaultValues<T>; // This is the correct type from react-hook-form
  submitButtonText?: string;
  cancelButtonText?: string;
}

export function GenericForm<T extends FieldValues>({
  schema,
  fields,
  onSubmit,
  onCancel,
  defaultValues,
  submitButtonText = 'Save',
  cancelButtonText = 'Cancel',
}: GenericFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleFormSubmit: SubmitHandler<T> = async (data) => {
    await onSubmit(data);
    reset();
  };

  const renderField = (field: FormField<T>): ReactNode => {
    const commonProps = {
      id: String(field.name),
      ...register(field.name),
      className: cn(
        "w-full px-4 py-2 bg-white/95 text-gray-800 border border-gray-200/50 rounded-lg shadow-sm",
        "focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200",
        errors[field.name] ? "border-red-300" : "hover:border-yellow-300"
      ),
      'aria-invalid': errors[field.name] ? true : false,
      placeholder: field.placeholder,
      required: field.required,
    };

    switch (field.type) {
      case 'select':
        return (
          <select {...commonProps}>
            <option value="" disabled className="bg-gray-50 text-gray-800">
              {field.placeholder || `Select ${field.label}`}
            </option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-50 text-gray-800 hover:bg-orange-100">
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return <textarea {...commonProps} rows={4} />;
      case 'checkbox':
        return <input type="checkbox" {...commonProps} />;
      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {fields.map((field) => (
        <div key={String(field.name)}>
          <label htmlFor={String(field.name)} className="block text-sm sm:text-base font-medium text-cyan-500 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderField(field)}
          {errors[field.name] && (
            <p className="text-red-500 text-sm mt-1">
              {String(errors[field.name]?.message)}
            </p>
          )}
        </div>
      ))}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-cyan-300 focus:outline-none hover:scale-105 hover:shadow-lg"
        >
          {cancelButtonText}
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 focus:ring-2 focus:ring-cyan-300 focus:outline-none hover:scale-105 hover:shadow-lg disabled:bg-gray-300"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
}