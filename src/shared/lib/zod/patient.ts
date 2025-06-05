import { z } from 'zod';
import { commonFields } from './common';
import { insuranceSchema } from './insurance';

/* ========= Patient Base Schema (without refinements) ========= */
const patientBaseSchema = z.object({
  firstName: commonFields.firstName,
  lastName: commonFields.lastName,
  postcode: z
    .string({ description: 'Postal/ZIP code' })
    .regex(/^[a-zA-Z0-9\- ]+$/, 'Invalid postcode format'),
  address: commonFields.address,
  phoneNumber: commonFields.phoneNumber,
  email: commonFields.email,
  isInsured: z.boolean({
    description: 'Flag indicating if patient has insurance',
    required_error: 'Insurance status is required'
  }).default(false),
  insuranceId: insuranceSchema.shape.id.optional(),
}).strict();

/* ========= Patient Refinement ========= */
const patientRefinement = (data: z.infer<typeof patientBaseSchema>, ctx: z.RefinementCtx) => {
  if (data.isInsured && !data.insuranceId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Insurance ID is required when patient is insured',
      path: ['insuranceId'],
    });
  }
};

/* ========= Patient Schema ========= */
export const patientSchema = patientBaseSchema
  .extend({ id: commonFields.id })
  .superRefine(patientRefinement);

/* ========= Patient Create Schema ========= */
export const createPatientSchema = patientBaseSchema.superRefine(patientRefinement);

/* ========= Patient Update Schema ========= */
export const updatePatientSchema = patientBaseSchema
  .partial()
  .superRefine((data, ctx) => {
    // Only validate if isInsured is explicitly set to true
    if (data.isInsured === true && !data.insuranceId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Insurance ID is required when patient is insured',
        path: ['insuranceId'],
      });
    }
  });

/* ========= Type Exports ========= */
export type Patient = z.infer<typeof patientSchema>;
export type CreatePatient = z.infer<typeof createPatientSchema>;
export type UpdatePatient = z.infer<typeof updatePatientSchema>;