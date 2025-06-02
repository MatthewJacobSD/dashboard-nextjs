// shared/client/doctor/doctor-form-fields.ts
import { FormField } from '@/shared/components/ui/generics/Form';
import { DoctorCreateInput } from '@/shared/lib/zod';
import { Specialization, Experience } from '@/shared/lib/types';

export const baseDoctorFields: FormField<DoctorCreateInput>[] = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    required: true,
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    required: false,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text',
    required: false,
  },
  {
    name: 'specialization',
    label: 'Specialization',
    type: 'select',
    options: Object.values(Specialization).map((value) => ({
      value,
      label: value,
    })),
    required: false,
  },
  {
    name: 'experience',
    label: 'Experience',
    type: 'select',
    options: Object.values(Experience).map((value) => ({
      value,
      label: value,
    })),
    required: false,
  },
];