import { z } from 'zod'
import { Specialization, Experience, commonFields } from './common'

// Base schema for doctor data, excluding phoneNumber
export const doctorSchema = z
  .object({
    ...commonFields,
    specialization: z
      .nativeEnum(Specialization)
      .default(Specialization.General), // Default to General specialization
    experience: z.nativeEnum(Experience).default(Experience.Novice), // Default to Novice experience
  })
  .omit({ phoneNumber: true })

// Schema for creating a new doctor, omitting id (auto-generated)
export const createDoctorSchema = doctorSchema.omit({ id: true })

// Schema for updating a doctor, all fields optional, no extra fields allowed
export const updateDoctorSchema = doctorSchema.partial().strict()

// TypeScript types inferred from Zod schemas
export type Doctor = z.infer<typeof doctorSchema>
export type CreateDoctor = z.infer<typeof createDoctorSchema>
export type UpdateDoctor = z.infer<typeof updateDoctorSchema>