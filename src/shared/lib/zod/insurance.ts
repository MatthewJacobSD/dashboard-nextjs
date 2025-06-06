import { z } from 'zod'
import { commonFields } from './common'

// Base schema for insurance data, excluding firstName, lastName, and email
export const insuranceSchema = z
  .object({
    ...commonFields, // Spread common fields (e.g., id, other shared properties)
    companyName: z // Define companyName field
      .string({ description: 'Legal name of the insurance company' }) // Must be a string with description
      .min(3, 'Company name must be at least 3 characters') // Minimum length of 3 characters
      .max(50, 'Company name cannot exceed 50 characters') // Maximum length of 50 characters
      .trim(), // Remove leading/trailing whitespace
  })
  .omit({
    firstName: true, // Exclude firstName from schema
    lastName: true, // Exclude lastName from schema
    email: true, // Exclude email from schema
  })

// Schema for creating new insurance, omitting id (auto-generated)
export const createInsuranceSchema = insuranceSchema

// Schema for updating insurance, all fields optional, no extra fields allowed
export const updateInsuranceSchema = insuranceSchema.partial().strict()

// TypeScript types inferred from Zod schemas
export type Insurance = z.infer<typeof insuranceSchema> // Type for insurance data
export type CreateInsurance = z.infer<typeof createInsuranceSchema> // Type for creating insurance
export type UpdateInsurance = z.infer<typeof updateInsuranceSchema> // Type for updating insurance
