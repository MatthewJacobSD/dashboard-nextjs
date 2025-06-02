'use server';

import ApiService from '@/shared/lib/api';
import { createCrudActions } from '../crudActions';
import { 
  Prescription, 
  PrescriptionCreateInput, 
  PrescriptionUpdateInput, 
  createPrescriptionSchema, 
  updatePrescriptionSchema 
} from '@/shared/lib/zod';

const createFormPrescription = (formData: FormData): PrescriptionCreateInput => {
  const isPrescribed = formData.get('isPrescribed');
  
  return {
    prescriptionDate: formData.get('prescriptionDate')?.toString() ?? '',
    dosage: formData.get('dosage')?.toString() ?? '',
    duration: formData.get('duration')?.toString() ?? '',
    comments: formData.get('comments')?.toString() ?? '',
    isPrescribed: isPrescribed === 'true' || isPrescribed === 'on' || false,
    patientId: formData.get('patientId')?.toString() ?? '',
    medicationId: formData.get('medicationId')?.toString() ?? '',
    doctorId: formData.get('doctorId')?.toString() ?? '',
  };
};

const updateFormPrescription = (formData: FormData): Omit<PrescriptionUpdateInput, 'id'> => {
  const isPrescribed = formData.get('isPrescribed');
  
  return {
    prescriptionDate: formData.get('prescriptionDate')?.toString(),
    dosage: formData.get('dosage')?.toString(),
    duration: formData.get('duration')?.toString(),
    comments: formData.get('comments')?.toString(),
    isPrescribed: isPrescribed === 'true' || isPrescribed === 'on' || false,
    patientId: formData.get('patientId')?.toString(),
    medicationId: formData.get('medicationId')?.toString(),
    doctorId: formData.get('doctorId')?.toString(),
  };
};

const prescriptionService = new ApiService<Prescription, PrescriptionCreateInput, PrescriptionUpdateInput>('prescriptions');
export const { 
  create: createPrescription, 
  update: updatePrescription, 
  delete: deletePrescription, 
  fetch: fetchPrescriptions 
} = createCrudActions(
  'Prescriptions',
  prescriptionService,
  createPrescriptionSchema,
  updatePrescriptionSchema,
  createFormPrescription,
  updateFormPrescription
);