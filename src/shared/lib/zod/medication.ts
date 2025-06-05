import { z } from 'zod';
import { commonFields } from './common';

/* ========= Medication Base Schema ========= */
export const medicationBaseSchema = z.object({
  name: z
    .string({ description: 'Brand or generic name of the medication' })
    .min(3, 'Medication name must be at least 3 characters')
    .max(50, 'Medication name cannot exceed 50 characters')
    .trim(),
  sideEffects: z
    .string({ description: 'Known side effects of the medication' })
    .min(10, 'Side effects description must be at least 10 characters')
    .max(1000, 'Side effects description cannot exceed 1000 characters')
    .trim(),
  benefits: z
    .string({ description: 'Therapeutic benefits of the medication' })
    .min(10, 'Benefits description must be at least 10 characters')
    .max(1000, 'Benefits description cannot exceed 1000 characters')
    .trim(),
}).strict();

/* ========= Medication Schema ========= */
export const medicationSchema = medicationBaseSchema.extend({ 
  id: commonFields.id 
}).strict();

/* ========= Medication Create Schema ========= */
export const createMedicationSchema = medicationSchema.omit({ id: true });

/* ========= Medication Update Schema ========= */
export const updateMedicationSchema = medicationSchema
  .omit({ id: true })
  .partial()
  .strict();

/* ========= Type Exports ========= */
export type Medication = z.infer<typeof medicationSchema>;
export type CreateMedication = Omit<Medication, 'id'>;
export type UpdateMedication = Partial<Omit<Medication, 'id'>>;