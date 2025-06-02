'use server';

import ApiService from '@/shared/lib/api';
import { createCrudActions } from '../crudActions';
import { 
  Doctor, 
  DoctorCreateInput, 
  DoctorUpdateInput, 
  createDoctorSchema, 
  updateDoctorSchema 
} from '@/shared/lib/zod';
import { Specialization, Experience } from '@/shared/lib/types';

const createFormDoctor = (formData: FormData): DoctorCreateInput => {
  const specialization = formData.get('specialization');
  const experience = formData.get('experience');

  if (typeof specialization !== 'string' || !Object.values(Specialization).includes(specialization as Specialization)) {
    throw new Error('Invalid specialization value');
  }

  if (typeof experience !== 'string' || !Object.values(Experience).includes(experience as Experience)) {
    throw new Error('Invalid experience value');
  }

  return {
    firstName: formData.get('firstName')?.toString() ?? '',
    lastName: formData.get('lastName')?.toString() ?? '',
    address: formData.get('address')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    specialization: specialization as Specialization,
    experience: experience as Experience,
  };
};

const updateFormDoctor = (formData: FormData): Omit<DoctorUpdateInput, 'id'> => {
  const specialization = formData.get('specialization');
  const experience = formData.get('experience');

  return {
    firstName: formData.get('firstName')?.toString(),
    lastName: formData.get('lastName')?.toString(),
    address: formData.get('address')?.toString(),
    email: formData.get('email')?.toString(),
    specialization: specialization ? specialization as Specialization : undefined,
    experience: experience ? experience as Experience : undefined,
  };
};

const doctorService = new ApiService<Doctor, DoctorCreateInput, DoctorUpdateInput>('doctors');

// Add explicit return type to ensure proper typing
export const {
  create: createDoctor,
  update: updateDoctor,
  delete: deleteDoctor,
  fetch: fetchDoctors,
  get: getDoctor // Add this to expose the get method
} = createCrudActions(
  'Doctors',
  doctorService,
  createDoctorSchema,
  updateDoctorSchema,
  createFormDoctor,
  updateFormDoctor
);