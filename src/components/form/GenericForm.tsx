'use client';
import { useForm, FieldValues, SubmitHandler, Path, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/shared/utils/cn';
import { ReactNode } from 'react';
import { ZodType } from 'zod';
import { Button } from '../ui/Button';

export type FormFieldType = 'text' | 'email' | 'select' | 'textarea' | 'number' | 'date' | 'checkbox';

export interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: FormFieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

interface GenericFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  fields: FormField<T>[];
  onSubmit: SubmitHandler<T>;
  onCancel: () => void;
  defaultValues?: DefaultValues<T>;
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
    console.log('📤 Form submitted:', data, '🚀');
    await onSubmit(data);
    reset();
  };

  const renderField = (field: FormField<T>): ReactNode => {
    const commonProps = {
      id: String(field.name),
      ...register(field.name),
      className: cn(
        'w-full bg-surface text-card-foreground border border-border rounded-radius-md shadow-sm',
        field.type === 'textarea'
          ? 'p-space-md min-h-[80px]'
          : 'px-space-md py-space-xs',
        'focus-visible:outline-ring transition-all duration-200',
        'placeholder:text-gray-400',
        errors[field.name]
          ? 'border-red focus:border-red'
          : 'hover:border-orange',
        field.type === 'checkbox' && 'h-5 w-auto'
      ),
      'aria-invalid': Boolean(errors[field.name]),
      placeholder: field.placeholder,
      required: field.required,
    };

    switch (field.type) {
      case 'select':
        return (
          <select {...commonProps}>
            <option value="" disabled>Select {field.label}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return <textarea {...commonProps} rows={5} />;

      case 'checkbox':
        return (
          <div className="flex items-center gap-space-md mt-space-sm">
            <input type="checkbox" {...commonProps} />
            <label
              htmlFor={String(field.name)}
              className="text-card-foreground cursor-pointer select-none"
            >
              {field.label}
            </label>
          </div>
        );

      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-space-lg animate-fadeIn">
      {fields.map((field) => (
        <div key={String(field.name)} className="space-y-space-xs">
          {!['checkbox'].includes(field.type) && (
            <label
              htmlFor={String(field.name)}
              className="block font-semibold text-card-foreground"
            >
              {field.label}
              {field.required && <span className="text-red ml-space-xs">*</span>}
            </label>
          )}
          {renderField(field)}
          {errors[field.name] && (
            <p className="text-font-size-muted mt-space-xs text-red">
              {String(errors[field.name]?.message)}
            </p>
          )}
        </div>
      ))}

      <div className="flex justify-end gap-space-sm pt-space-md">
        <Button type="button" variant="outline" onClick={onCancel}>
          {cancelButtonText}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={Object.keys(errors).length > 0}
          className="bg-orange hover:bg-orange/90 text-white"
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}