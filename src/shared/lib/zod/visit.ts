import { z } from 'zod';
import { commonFields } from './common';
import { doctorSchema } from './doctor';

/* ========= Composite Key ========= */
const compositeKeySchema = z.object({
  patientId: commonFields.id,
  doctorId: doctorSchema.shape.id,
  visitDate: z.coerce.date({
    description: 'Date of the patient visit',
    required_error: 'Visit date is required',
    invalid_type_error: 'Invalid date format'
  }),
}).strict();

/* ========= Visit Base Schema ========= */
export const visitBaseSchema = z.object({
  symptoms: z
    .string({ description: 'Patient-reported symptoms' })
    .min(10, 'Symptoms description must be at least 10 characters')
    .max(1000, 'Symptoms description cannot exceed 1000 characters')
    .trim(),
  diagnosis: z.number({
    description: 'Diagnosis code (ICD-10 recommended)',
    required_error: 'Diagnosis code is required',
    invalid_type_error: 'Diagnosis must be a numeric code'
  }).int('Diagnosis code must be an integer'),
}).strict();

/* ========= Visit Schema ========= */
export const visitSchema = visitBaseSchema.merge(compositeKeySchema).extend({
  id: commonFields.id,
}).strict();

/* ========= Visit Create Schema ========= */
export const createVisitSchema = visitSchema.omit({ id: true });

/* ========= Visit Update Schema ========= */
export const updateVisitSchema = visitSchema
  .omit({ id: true })
  .partial()
  .extend({ id: commonFields.id })
  .strict();

/* ========= Type Exports ========= */
export type Visit = z.infer<typeof visitSchema>;
export type CreateVisit = Omit<Visit, 'id'>;
export type UpdateVisit = Partial<Omit<Visit, 'id'>> & { id: string };