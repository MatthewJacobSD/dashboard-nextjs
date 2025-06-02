'use server';

import ApiService from '@/shared/lib/api';
import { createCrudActions } from '../crudActions';
import { 
  Patient, 
  PatientCreateInput, 
  PatientUpdateInput, 
  createPatientSchema, 
  updatePatientSchema 
} from '@/shared/lib/zod';

const createFormPatient = (formData: FormData): PatientCreateInput => {
  const isInsured = formData.get('isInsured');
  
  return {
    firstName: formData.get('firstName')?.toString() ?? '',
    lastName: formData.get('lastName')?.toString() ?? '',
    postcode: formData.get('postcode')?.toString() ?? '',
    address: formData.get('address')?.toString() ?? '',
    phoneNumber: formData.get('phoneNumber')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    isInsured: isInsured === 'true' || isInsured === 'on' || false,
    insuranceId: formData.get('insuranceId')?.toString(),
  };
};

const updateFormPatient = (formData: FormData): Omit<PatientUpdateInput, 'id'> => {
  const isInsured = formData.get('isInsured');
  
  return {
    firstName: formData.get('firstName')?.toString(),
    lastName: formData.get('lastName')?.toString(),
    postcode: formData.get('postcode')?.toString(),
    address: formData.get('address')?.toString(),
    phoneNumber: formData.get('phoneNumber')?.toString(),
    email: formData.get('email')?.toString(),
    isInsured: isInsured === 'true' || isInsured === 'on' || false,
    insuranceId: formData.get('insuranceId')?.toString(),
  };
};

const patientService = new ApiService<Patient, PatientCreateInput, PatientUpdateInput>('patients');
export const { 
  create: createPatient, 
  update: updatePatient, 
  delete: deletePatient, 
  fetch: fetchPatients 
} = createCrudActions(
  'Patients',
  patientService,
  createPatientSchema,
  updatePatientSchema,
  createFormPatient,
  updateFormPatient
);