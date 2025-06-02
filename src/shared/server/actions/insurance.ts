'use server';

import ApiService from '@/shared/lib/api';
import { createCrudActions } from '../crudActions';
import { 
  Insurance, 
  InsuranceCreateInput, 
  InsuranceUpdateInput, 
  createInsuranceSchema, 
  updateInsuranceSchema 
} from '@/shared/lib/zod';

const createFormInsurance = (formData: FormData): InsuranceCreateInput => {
  return {
    companyName: formData.get('companyName')?.toString() ?? '',
    address: formData.get('address')?.toString() ?? '',
    phoneNumber: formData.get('phoneNumber')?.toString() ?? '',
  };
};

const updateFormInsurance = (formData: FormData): Omit<InsuranceUpdateInput, 'id'> => {
  return {
    companyName: formData.get('companyName')?.toString(),
    address: formData.get('address')?.toString(),
    phoneNumber: formData.get('phoneNumber')?.toString(),
  };
};

const insuranceService = new ApiService<Insurance, InsuranceCreateInput, InsuranceUpdateInput>('insurances');
export const { 
  create: createInsurance, 
  update: updateInsurance, 
  delete: deleteInsurance, 
  fetch: fetchInsurances 
} = createCrudActions(
  'Insurances',
  insuranceService,
  createInsuranceSchema,
  updateInsuranceSchema,
  createFormInsurance,
  updateFormInsurance
);