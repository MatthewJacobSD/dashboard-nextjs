import { z } from 'zod'
import { commonFields } from './common'
import { insuranceSchema } from './insurance'

// Base schema for patient data
export const patientSchema = z.object({
  ...commonFields, // Spread common fields (e.g., id, other shared properties)
  postcode: z.string(), // Define postcode field, must be a string
  isInsured: z.boolean(), // Define isInsured field, must be a boolean
  insuranceId: insuranceSchema.shape.id.optional(), // Define optional insuranceId field, referencing insurance schema
})

// Schema for creating new patient, omitting id (auto-generated)
export const createPatientSchema = patientSchema
  .omit({ id: true })
  .superRefine((data, ctx) => {
    // Validate insuranceId requirement when isInsured is true
    if (data.isInsured === true && !data.insuranceId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Insurance ID is required when patient is insured',
        path: ['insuranceId'],
      })
    }
  })

// Schema for updating patient, all fields optional, no extra fields allowed
export const updatePatientSchema = patientSchema
  .partial() // Make all fields optional
  .strict() // Prevent extra fields
  .superRefine((data, ctx) => {
    // Validate insuranceId requirement when isInsured is true
    if (data.isInsured === true && !data.insuranceId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Insurance ID is required when patient is insured',
        path: ['insuranceId'],
      })
    }
  })

// TypeScript types inferred from Zod schemas
export type Patient = z.infer<typeof patientSchema> // Type for patient data
export type CreatePatient = z.infer<typeof createPatientSchema> // Type for creating patient
export type UpdatePatient = z.infer<typeof updatePatientSchema> // Type for updating patient