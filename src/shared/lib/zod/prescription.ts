import { z } from 'zod';
import { commonFields } from './common';

/**
 * Base prescription schema without ID.
 */
const basePrescription = z.object({
  prescriptionDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  dosage: z.string()
    .min(1, 'Dosage must be at least 1 char')
    .max(50, 'Dosage must be less than 50 chars'),
  duration: z.string()
    .min(1, 'Duration must be at least 1 char')
    .max(50, 'Duration must be less than 50 chars'),
  comments: z.string()
    .min(10, 'Comments must be at least 10 chars')
    .max(1000, 'Comments must be less than 1000 chars'),
});

/**
 * Full prescription schema with IDs and validation.
 */
export const prescriptionSchema = basePrescription.extend({
  id: commonFields.id,
  isPrescribed: z.boolean().default(false),
  patientId: commonFields.id,
  medicationId: commonFields.id,
  doctorId: commonFields.id,
}).refine((data) => {
  if (data.isPrescribed) {
    return data.patientId && data.medicationId && data.doctorId;
  }
  return true;
}, {
  message: 'Patient, medication, and doctor IDs are required if prescribed',
  path: ['patientId', 'medicationId', 'doctorId'],
});

/**
 * Schema for creating a new prescription.
 */
export const createPrescriptionSchema = basePrescription
  .extend({
    isPrescribed: z.boolean(),
    patientId: commonFields.id,
    medicationId: commonFields.id,
    doctorId: commonFields.id,
  })
  .refine(
    (data) => {
      if (data.isPrescribed) {
        return data.patientId && data.medicationId && data.doctorId;
      }
      return true;
    },
    {
      message: '⚠️ Patient, medication, and doctor IDs are required if prescribed',
      path: ['patientId', 'medicationId', 'doctorId'],
    },
  );

/**
 * Schema for updating an existing prescription.
 */
export const updatePrescriptionSchema = basePrescription
  .extend({
    id: commonFields.id,
    isPrescribed: z.boolean().optional(),
    patientId: commonFields.id.optional(),
    medicationId: commonFields.id.optional(),
    doctorId: commonFields.id.optional(),
  })
  .partial({ prescriptionDate: true, dosage: true, duration: true, comments: true })
  .strict()
  .superRefine((data, ctx) => {
    if (data.isPrescribed) {
      if (!data.patientId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '⚠️ Patient ID is required if the prescription is prescribed',
          path: ['patientId'],
        });
      }
      if (!data.medicationId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '⚠️ Medication ID is required if the prescription is prescribed',
          path: ['medicationId'],
        });
      }
      if (!data.doctorId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '⚠️ Doctor ID is required if the prescription is prescribed',
          path: ['doctorId'],
        });
      }
    }
  });

// Types
export type Prescription = z.infer<typeof prescriptionSchema>;
export type PrescriptionCreateInput = z.infer<typeof createPrescriptionSchema>;
export type PrescriptionUpdateInput = z.infer<typeof updatePrescriptionSchema>;