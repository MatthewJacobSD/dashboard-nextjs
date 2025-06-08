import { z } from 'zod'

/* ===== Composite Key Schema ===== */
export const compositeKeySchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  doctorId: z.string().min(1, 'Doctor ID is required'),
  visitDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
});

export const visitSchema = z.object({
  ...compositeKeySchema.shape,
  symptoms: z
    .string({ description: 'Patient-reported symptoms' })
    .min(10, 'Symptoms description must be at least 10 characters')
    .max(1000, 'Symptoms description cannot exceed 1000 characters')
    .trim(),
  diagnosis: z.number(),
})

export const createVisitSchema = visitSchema;

export const updateVisitSchema = visitSchema.partial().strict()

export type Visit = z.infer<typeof visitSchema>
export type CreateVisit = z.infer<typeof createVisitSchema>
export type UpdateVisit = z.infer<typeof updateVisitSchema>