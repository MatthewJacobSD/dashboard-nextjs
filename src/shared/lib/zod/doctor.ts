import { z } from 'zod';
import { commonFields, Specialization, Experience } from './common';

/* ========= Doctor Base Schema ========= */
export const doctorBaseSchema = z.object({
  firstName: commonFields.firstName,
  lastName: commonFields.lastName,
  address: commonFields.address,
  email: commonFields.email,
});

/* ========= Doctor Schema ========= */
export const doctorSchema = doctorBaseSchema.extend({
  id: commonFields.id,
  specialization: z.nativeEnum(Specialization, {
    description: 'Medical specialization area',
    required_error: 'Specialization is required',
    invalid_type_error: 'Invalid specialization value'
  }).default('General'),
  experience: z.nativeEnum(Experience, {
    description: 'Level of professional experience',
    required_error: 'Experience level is required',
    invalid_type_error: 'Invalid experience value'
  }).default('Novice'),
}).strict();

/* ========= Doctor Create Schema ========= */
export const createDoctorSchema = doctorSchema.omit({ id: true }).extend({
  specialization: z.nativeEnum(Specialization),
  experience: z.nativeEnum(Experience),
});

/* ========= Doctor Update Schema ========= */
export const updateDoctorSchema = doctorSchema
  .omit({ id: true })
  .partial()
  .strict();

/* ========= Type Exports ========= */
export type Doctor = z.infer<typeof doctorSchema>;
export type CreateDoctor = Omit<Doctor, 'id'>;
export type UpdateDoctor = Partial<Omit<Doctor, 'id'>>;