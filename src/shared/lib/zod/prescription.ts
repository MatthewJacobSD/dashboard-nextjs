import { z } from 'zod';
import { commonFields } from './common';
import { medicationSchema } from './medication';
import { doctorSchema } from './doctor';

/* ========= Prescription Base Schema (without refinements) ========= */
const prescriptionBaseSchema = z.object({
  prescriptionDate: z.coerce.date({
    description: 'Date when prescription was issued',
    required_error: 'Prescription date is required',
    invalid_type_error: 'Invalid date format'
  }),
  dosage: z.number({
    description: 'Medication dosage in mg',
    required_error: 'Dosage is required',
    invalid_type_error: 'Dosage must be a number'
  }).positive('Dosage must be positive'),
  duration: z.number({
    description: 'Treatment duration in days',
    required_error: 'Duration is required',
    invalid_type_error: 'Duration must be a number'
  }).int('Duration must be an integer').positive('Duration must be positive'),
  comments: z
    .string({ description: 'Additional medical comments' })
    .min(10, 'Comments must be at least 10 characters')
    .max(1000, 'Comments cannot exceed 1000 characters')
    .trim(),
  isPrescribed: z.boolean({
    description: 'Flag indicating if prescription is active',
    required_error: 'Prescription status is required'
  }).default(false),
  patientId: commonFields.id,
  medicationId: medicationSchema.shape.id.optional(),
  doctorId: doctorSchema.shape.id.optional(),
}).strict();

/* ========= Prescription Refinement ========= */
const prescriptionRefinement = (data: z.infer<typeof prescriptionBaseSchema>, ctx: z.RefinementCtx) => {
  if (data.isPrescribed) {
    if (!data.medicationId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Medication ID is required for active prescriptions',
        path: ['medicationId'],
      });
    }
    if (!data.doctorId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Doctor ID is required for active prescriptions',
        path: ['doctorId'],
      });
    }
  }
};

/* ========= Prescription Schema ========= */
export const prescriptionSchema = prescriptionBaseSchema
  .extend({ id: commonFields.id })
  .superRefine(prescriptionRefinement);

/* ========= Prescription Create Schema ========= */
export const createPrescriptionSchema = prescriptionBaseSchema.superRefine(prescriptionRefinement);

/* ========= Prescription Update Schema ========= */
export const updatePrescriptionSchema = prescriptionBaseSchema
  .partial()
  .superRefine((data, ctx) => {
    // Only validate if isPrescribed is explicitly set to true
    if (data.isPrescribed === true) {
      if (data.medicationId === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Medication ID is required for active prescriptions',
          path: ['medicationId'],
        });
      }
      if (data.doctorId === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Doctor ID is required for active prescriptions',
          path: ['doctorId'],
        });
      }
    }
  });

/* ========= Type Exports ========= */
export type Prescription = z.infer<typeof prescriptionSchema>;
export type CreatePrescription = z.infer<typeof createPrescriptionSchema>;
export type UpdatePrescription = z.infer<typeof updatePrescriptionSchema>;