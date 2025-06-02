// shared/client/doctor/update-form.tsx
'use client';

import { GenericForm } from '@/shared/components/ui/generics/Form';
import { updateDoctorSchema, DoctorUpdateInput } from '@/shared/lib/zod';
import { zodSchemaToFormFields } from '@/shared/utils/schemaToForm';
import { DefaultValues } from 'react-hook-form';

interface UpdateDoctorFormProps {
  initialValues: DefaultValues<DoctorUpdateInput>; // Use DefaultValues here
  onSubmit: (data: DoctorUpdateInput) => Promise<{ success: boolean; errors?: Record<string, string> }>;
  onCancel: () => void;
}

export function UpdateDoctorForm({ initialValues, onSubmit, onCancel }: UpdateDoctorFormProps) {
  const formFields = zodSchemaToFormFields(updateDoctorSchema);

  return (
    <GenericForm<DoctorUpdateInput>
      schema={updateDoctorSchema}
      fields={formFields}
      onSubmit={onSubmit}
      onCancel={onCancel}
      defaultValues={initialValues}
      submitButtonText="Update Doctor"
    />
  );
}