import { z } from 'zod';
import { commonFields } from './common';

/**
 * Base insurance schema without ID.
 */
const baseInsurance = z.object({
  companyName: commonFields.firstName
    .min(3, 'Company name too short (min 3 chars)')
    .max(50, 'Company name too long (max 50 chars)'),
  address: commonFields.address,
  phoneNumber: commonFields.phoneNumber,
});

/**
 * Full insurance schema including ID.
 */
export const insuranceSchema = baseInsurance.extend({
  id: commonFields.id,
});

/**
 * Schema for creating a new insurance.
 */
export const createInsuranceSchema = insuranceSchema.omit({ id: true });

/**
 * Schema for updating an existing insurance.
 */
export const updateInsuranceSchema = insuranceSchema.omit({ id: true }).partial().extend({
  id: commonFields.id,
}).strict();

// Types
export type Insurance = z.infer<typeof insuranceSchema>;
export type InsuranceCreateInput = z.infer<typeof createInsuranceSchema>;
export type InsuranceUpdateInput = z.infer<typeof updateInsuranceSchema>;