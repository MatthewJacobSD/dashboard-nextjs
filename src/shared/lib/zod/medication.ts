import { z } from 'zod';
import { commonFields } from './common';

/**
 * Base medication schema without ID.
 */
const baseMedication = z.object({
  name: commonFields.firstName
    .min(3, 'Medication name too short (min 3 chars)')
    .max(50, 'Medication name too long (max 50 chars)'),
  sideEffects: z.string()
    .min(10, 'Side effects too short (min 10 chars)')
    .max(1000, 'Side effects too long (max 1000 chars)'),
  benefits: z.string()
    .min(10, 'Benefits too short (min 10 chars)')
    .max(1000, 'Benefits too long (max 1000 chars)'),
});

/**
 * Full medication schema including ID.
 */
export const medicationSchema = baseMedication.extend({
  id: commonFields.id,
});

/**
 * Schema for creating a new medication.
 */
export const createMedicationSchema = medicationSchema.omit({ id: true });

/**
 * Schema for updating an existing medication.
 */
export const updateMedicationSchema = medicationSchema.omit({ id: true }).partial().extend({
  id: commonFields.id,
}).strict();

// Types
export type Medication = z.infer<typeof medicationSchema>;
export type MedicationCreateInput = z.infer<typeof createMedicationSchema>;
export type MedicationUpdateInput = z.infer<typeof updateMedicationSchema>;