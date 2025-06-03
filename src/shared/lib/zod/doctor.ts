import { z } from 'zod';
import { commonFields } from './common';
import { Specialization, Experience } from '../types';

/**
 * Base doctor schema without ID.
 */
const baseDoctor = z.object({
  firstName: commonFields.firstName,
  lastName: commonFields.lastName,
  address: commonFields.address,
  email: commonFields.email,
});

/**
 * Full doctor schema with ID, specialization, and experience.
 */
export const doctorSchema = baseDoctor.extend({
  id: commonFields.id,
  specialization: z.enum(Object.values(Specialization) as [string, ...string[]]).default(Specialization.General),
  experience: z.enum(Object.values(Experience) as [string, ...string[]]).default(Experience.Novice),
});

/**
 * Schema for creating a new doctor.
 */
export const createDoctorSchema = doctorSchema.omit({ id: true }).extend({
  specialization: z.enum(Object.values(Specialization) as [string, ...string[]]),
  experience: z.enum(Object.values(Experience) as [string, ...string[]]),
});

/**
 * Schema for updating an existing doctor.
 */
export const updateDoctorSchema = doctorSchema.omit({ id: true }).partial().extend({
  id: commonFields.id,
}).strict();

export type Doctor = z.infer<typeof doctorSchema>;
export type DoctorCreateInput = z.infer<typeof createDoctorSchema>;
export type DoctorUpdateInput = z.infer<typeof updateDoctorSchema>;