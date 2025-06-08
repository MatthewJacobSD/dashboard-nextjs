import { z } from 'zod'
import { commonFields } from './common'
import { medicationSchema } from './medication'
import { doctorSchema } from './doctor'
import { patientSchema } from './patient'

// Base schema for prescription data, excluding personal fields
export const prescriptionSchema = z
  .object({
    ...commonFields, // Spread common fields (e.g., id, other shared properties)
    prescriptionDate: z.coerce.date(), // Define prescription date field, coerced to Date
    dosage: z.number(), // Define dosage field, must be a number
    duration: z.number(), // Define duration field, must be a number
    comments: z // Define comments field
      .string({ description: 'Additional medical comments' }) // Must be a string with description
      .min(10, 'Comments must be at least 10 characters') // Minimum length of 10 characters
      .max(1000, 'Comments cannot exceed 1000 characters') // Maximum length of 1000 characters
      .trim(), // Remove leading/trailing whitespace
    isPrescribed: z.boolean(), // Define isPrescribed field, must be a boolean
    patientId: patientSchema.shape.id.optional(), // Define optional patientId field, referencing patient schema
    medicationId: medicationSchema.shape.id.optional(), // Define optional medicationId field, referencing medication schema
    doctorId: doctorSchema.shape.id.optional(), // Define optional doctorId field, referencing doctor schema
  })
  .omit({
    firstName: true, // Exclude firstName from schema
    lastName: true, // Exclude lastName from schema
    address: true, // Exclude address from schema
    email: true, // Exclude email from schema
    phoneNumber: true, // Exclude phoneNumber from schema
  })

// Schema for creating new prescription, omitting id (auto-generated)
export const createPrescriptionSchema = prescriptionSchema
  .omit({ id: true })
  .superRefine((data, ctx) => {
    // Validate medicationId and doctorId requirements when isPrescribed is true
    if (data.isPrescribed === true) {
      if (data.medicationId === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Medication ID is required for active prescriptions',
          path: ['medicationId'],
        })
      }
      if (data.doctorId === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Doctor ID is required for active prescriptions',
          path: ['doctorId'],
        })
      }
    }
  })

// Schema for updating prescription, all fields optional, no extra fields allowed
export const updatePrescriptionSchema = prescriptionSchema
  .partial() // Make all fields optional
  .strict() // Prevent extra fields
  .superRefine((data, ctx) => {
    // Validate medicationId and doctorId requirements when isPrescribed is true
    if (data.isPrescribed === true) {
      if (data.medicationId === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Medication ID is required for active prescriptions',
          path: ['medicationId'],
        })
      }
      if (data.doctorId === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Doctor ID is required for active prescriptions',
          path: ['doctorId'],
        })
      }
    }
  })

// TypeScript types inferred from Zod schemas
export type Prescription = z.infer<typeof prescriptionSchema> // Type for prescription data
export type CreatePrescription = z.infer<typeof createPrescriptionSchema> // Type for creating prescription
export type UpdatePrescription = z.infer<typeof updatePrescriptionSchema> // Type for updating prescription