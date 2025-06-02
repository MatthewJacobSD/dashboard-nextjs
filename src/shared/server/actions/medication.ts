'use server';

import ApiService from '@/shared/lib/api';
import { createCrudActions } from '../crudActions';
import { 
  Medication, 
  MedicationCreateInput, 
  MedicationUpdateInput, 
  createMedicationSchema, 
  updateMedicationSchema 
} from '@/shared/lib/zod';

const createFormMedication = (formData: FormData): MedicationCreateInput => {
  return {
    name: formData.get('name')?.toString() ?? '',
    sideEffects: formData.get('sideEffects')?.toString() ?? '',
    benefits: formData.get('benefits')?.toString() ?? '',
  };
};

const updateFormMedication = (formData: FormData): Omit<MedicationUpdateInput, 'id'> => {
  return {
    name: formData.get('name')?.toString(),
    sideEffects: formData.get('sideEffects')?.toString(),
    benefits: formData.get('benefits')?.toString(),
  };
};

const medicationService = new ApiService<Medication, MedicationCreateInput, MedicationUpdateInput>('medications');
export const { 
  create: createMedication, 
  update: updateMedication, 
  delete: deleteMedication, 
  fetch: fetchMedications 
} = createCrudActions(
  'Medications',
  medicationService,
  createMedicationSchema,
  updateMedicationSchema,
  createFormMedication,
  updateFormMedication
);