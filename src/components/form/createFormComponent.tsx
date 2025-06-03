'use client';

/*============Imports============*/
import { GenericForm } from './GenericForm';
import { zodSchemaToFormFields } from '@/shared/lib/components/form/schemaToForm';
import { z } from 'zod';
import { DefaultValues } from 'react-hook-form';

/*============createFormComponent============*/
/**
 * Generates a reusable form component based on a Zod schema.
 * Integrates with `GenericForm` to provide a consistent UI layer.
 */
export function createFormComponent<T extends z.ZodTypeAny>(schema: T) {
  /**
   * Log form component creation for debugging and visibility.
   */
  console.log('📝 Created form component for schema 🚀');

  return function FormComponent({
    defaultValues,
    onSubmit,
    onCancel,
    submitButtonText = 'Submit',
    cancelButtonText = 'Cancel',
  }: {
    defaultValues?: DefaultValues<z.infer<T>>;
    onSubmit: (data: z.infer<T>) => Promise<{ success: boolean; errors?: Record<string, string> }>;
    onCancel: () => void;
    submitButtonText?: string;
    cancelButtonText?: string;
  }) {
    /**
     * Convert Zod schema to form field definitions.
     * This powers dynamic rendering inside `GenericForm`.
     */
    const fields = zodSchemaToFormFields(schema);

    return (
      <GenericForm<z.infer<T>>
        schema={schema}
        fields={fields}
        onSubmit={onSubmit}
        onCancel={onCancel}
        defaultValues={defaultValues}
        submitButtonText={submitButtonText}
        cancelButtonText={cancelButtonText}
      />
    );
  };
}