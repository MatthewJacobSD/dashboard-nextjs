import { z } from 'zod'
import { commonFields } from './common'

// Base schema for medication data, excluding personal fields
export const medicationSchema = z
  .object({
    ...commonFields, // Spread common fields (e.g., id, other shared properties)
    name: z // Define medication name field
      .string({ description: 'Brand or generic name of the medication' }) // Must be a string with description
      .min(3, 'Medication name must be at least 3 characters') // Minimum length of 3 characters
      .max(50, 'Medication name cannot exceed 50 characters') // Maximum length of 50 characters
      .trim(), // Remove leading/trailing whitespace
    sideEffects: z // Define side effects field
      .string({ description: 'Known side effects of the medication' }) // Must be a string with description
      .min(10, 'Side effects description must be at least 10 characters') // Minimum length of 10 characters
      .max(1000, 'Side effects description cannot exceed 1000 characters') // Maximum length of 1000 characters
      .trim(), // Remove leading/trailing whitespace
    benefits: z // Define benefits field
      .string({ description: 'Therapeutic benefits of the medication' }) // Must be a string with description
      .min(10, 'Benefits description must be at least 10 characters') // Minimum length of 10 characters
      .max(1000, 'Benefits description cannot exceed 1000 characters') // Maximum length of 1000 characters
      .trim(), // Remove leading/trailing whitespace
  })
  .omit({
    firstName: true, // Exclude firstName from schema
    lastName: true, // Exclude lastName from schema
    address: true, // Exclude address from schema
    email: true, // Exclude email from schema
    phoneNumber: true, // Exclude phoneNumber from schema
  })

// Schema for creating new medication, omitting id (auto-generated)
export const createMedicationSchema = medicationSchema.omit({ id: true })

// Schema for updating medication, all fields optional, no extra fields allowed
export const updateMedicationSchema = medicationSchema.partial().strict()

// TypeScript types inferred from Zod schemas
export type Medication = z.infer<typeof medicationSchema> // Type for medication data
export type CreateMedication = z.infer<typeof createMedicationSchema> // Type for creating medication
export type UpdateMedication = z.infer<typeof updateMedicationSchema> // Type for updating medication
