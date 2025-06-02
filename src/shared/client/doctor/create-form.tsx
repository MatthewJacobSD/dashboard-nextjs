// shared/client/doctor/create-form.tsx
'use client';

import { GenericForm } from '@/shared/components/ui/generics/Form';
import { createDoctorSchema, DoctorCreateInput } from '@/shared/lib/zod';
import { Specialization, Experience } from '@/shared/lib/types';
import { DefaultValues } from 'react-hook-form';
import { baseDoctorFields } from './doctor-form-fields'; // Import the fields

// Define proper default values
const defaultDoctorValues: DefaultValues<DoctorCreateInput> = {
  specialization: Specialization.General,
  experience: Experience.Novice,
};

interface CreateDoctorFormProps {
  onSubmit: (data: DoctorCreateInput) => Promise<{ success: boolean; errors?: Record<string, string> }>;
  onCancel: () => void;
}

export function CreateDoctorForm({ onSubmit, onCancel }: CreateDoctorFormProps) {
  return (
    <GenericForm<DoctorCreateInput>
      schema={createDoctorSchema}
      fields={baseDoctorFields}
      onSubmit={onSubmit}
      onCancel={onCancel}
      defaultValues={defaultDoctorValues}
      submitButtonText="Create Doctor"
    />
  );
}