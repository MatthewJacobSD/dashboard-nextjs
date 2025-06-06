import { z } from 'zod'
import { doctorSchema } from './doctor'
import { patientSchema } from './patient'

const compositeKeySchema = z.object({
  patientId: patientSchema.shape.id.optional(),
  doctorId: doctorSchema.shape.id.optional(),
  visitDate: z.coerce.date().optional(),
})

export const apponitmentSchema = z.object({
  ...compositeKeySchema.shape,
  symptoms: z
    .string({ description: 'Patient-reported symptoms' })
    .min(10, 'Symptoms description must be at least 10 characters')
    .max(1000, 'Symptoms description cannot exceed 1000 characters')
    .trim(),
  diagnosis: z.number(),
})

export const createAppoitmentSchema = apponitmentSchema.omit({
  patientId: true,
  doctorId: true,
  visitDate: true,
})

export const updateAppoitmentSchema = apponitmentSchema.partial().strict()

export type Appointment = z.infer<typeof apponitmentSchema>
export type CreateAppointment = z.infer<typeof createAppoitmentSchema>
export type UpdateAppointment = z.infer<typeof updateAppoitmentSchema>
