import { z } from 'zod';
import { commonFields } from './common';

/**
 * Base patient schema without ID.
 */
const basePatient = z.object({
  firstName: commonFields.firstName,
  lastName: commonFields.lastName,
  address: commonFields.address,
  email: commonFields.email,
  postcode: z.string()
    .regex(/^\d{5}$/, 'Postcode must be 5 digits'),
  phoneNumber: commonFields.phoneNumber,
});

/**
 * Full patient schema including ID and insurance relation.
 */
export const patientSchema = basePatient.extend({
  id: commonFields.id,
  isInsured: z.boolean().default(false),
  insuranceId: commonFields.id.optional(),
}).refine((data) => {
  if (data.isInsured && !data.insuranceId) return false;
  return true;
}, {
  message: 'Insurance ID is required if patient is insured',
  path: ['insuranceId'],
});

/**
 * Schema for creating a new patient
 */
export const createPatientSchema = basePatient
  .extend({
    isInsured: z.boolean(),
    insuranceId: commonFields.id.optional(),
  })
  .refine(
    (data) => {
      if (data.isInsured) {
        return data.insuranceId !== undefined;
      }
      return true;
    },
    {
      message: '⚠️ Insurance ID is required if the patient is insured',
      path: ['insuranceId'],
    },
  );

/**
 * Schema for updating an existing patient.
 */
export const updatePatientSchema = basePatient
  .extend({
    id: commonFields.id,
    isInsured: z.boolean().optional(),
    insuranceId: commonFields.id.optional(),
  })
  .partial({ firstName: true, lastName: true, postcode: true, address: true, phoneNumber: true, email: true })
  .strict()
  .superRefine((data, ctx) => {
    if (data.isInsured) {
      if (data.insuranceId === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '⚠️ Insurance ID is required if the patient is insured',
          path: ['insuranceId'],
        });
      }
    }
  });

// Types
export type Patient = z.infer<typeof patientSchema>;
export type PatientCreateInput = z.infer<typeof createPatientSchema>;
export type PatientUpdateInput = z.infer<typeof updatePatientSchema>;