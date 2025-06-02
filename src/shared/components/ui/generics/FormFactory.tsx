// shared/components/ui/generics/FormFactory.tsx
'use client';

import { GenericForm } from './Form';
import { zodSchemaToFormFields } from '@/shared/utils/schemaToForm';
import { z } from 'zod';
import { DefaultValues } from 'react-hook-form';

export function createFormComponent<T extends z.ZodTypeAny>(schema: T) {
  return function FormComponent({
    defaultValues,
    onSubmit,
    onCancel,
    submitButtonText = 'Submit',
    cancelButtonText = 'Cancel',
  }: {
    defaultValues?: DefaultValues<z.infer<T>>; // Use DefaultValues instead of Partial
    onSubmit: (data: z.infer<T>) => Promise<{ success: boolean; errors?: Record<string, string> }>;
    onCancel: () => void;
    submitButtonText?: string;
    cancelButtonText?: string;
  }) {
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