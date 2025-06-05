import { z } from 'zod';
import { commonFields } from './common';

/* ========= Insurance Base Schema ========= */
export const insuranceBaseSchema = z.object({
  companyName: z
    .string({ description: 'Legal name of the insurance company' })
    .min(3, 'Company name must be at least 3 characters')
    .max(50, 'Company name cannot exceed 50 characters')
    .trim(),
  address: commonFields.address,
  phoneNumber: commonFields.phoneNumber,
}).strict();

/* ========= Insurance Schema ========= */
export const insuranceSchema = insuranceBaseSchema.extend({ 
  id: commonFields.id 
}).strict();

/* ========= Insurance Create Schema ========= */
export const createInsuranceSchema = insuranceSchema.omit({ id: true });

/* ========= Insurance Update Schema ========= */
export const updateInsuranceSchema = insuranceSchema
  .omit({ id: true })
  .partial()
  .strict();

/* ========= Type Exports ========= */
export type Insurance = z.infer<typeof insuranceSchema>;
export type CreateInsurance = Omit<Insurance, 'id'>;
export type UpdateInsurance = Partial<Omit<Insurance, 'id'>>;