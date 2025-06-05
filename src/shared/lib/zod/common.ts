import { z } from 'zod';

/* ======== Common Fields ======== */
export const commonFields = {
  id: z.string({
    description: 'Unique Identifier (UUID format recommended)',
    required_error: 'ID is required'
  }),
  firstName: z
    .string({ description: 'First name of the person' })
    .min(3, 'First name must be at least 3 characters')
    .max(20, 'First name cannot exceed 20 characters')
    .regex(/^[a-zA-Z]+$/, 'First name can only contain letters'),
  lastName: z
    .string({ description: 'Last name of the person' })
    .min(3, 'Last name must be at least 3 characters')
    .max(20, 'Last name cannot exceed 20 characters')
    .regex(/^[a-zA-Z]+$/, 'Last name can only contain letters'),
  address: z
    .string({ description: 'Full physical address' })
    .min(10, 'Address must be at least 10 characters')
    .max(100, 'Address cannot exceed 100 characters'),
  email: z
    .string({ description: 'Email address' })
    .email('Invalid email format')
    .max(100, 'Email cannot exceed 100 characters'),
  phoneNumber: z
    .string({ description: 'Phone number in XXX-XXX-XXXX format' })
    .regex(/^\d{3}-\d{3}-\d{4}$/, 'Phone number must be in XXX-XXX-XXXX format')
} as const;

/* ===== Specialization Enum ====== */
export const Specialization = {
  Ophthalmology: 'Ophthalmology', // Fixed spelling
  Oncologists: 'Oncologists',
  Emergency: 'Emergency',
  General: 'General',
  Anaesthetists: 'Anaesthetists',
  IntensiveCare: 'IntensiveCare',
  Cardiology: 'Cardiology',
} as const;

export type TSpecialization = keyof typeof Specialization;

/* ===== Experience Enum ====== */
export const Experience = {
  Novice: 'Novice',
  Junior: 'Junior',
  Senior: 'Senior',
  Expert: 'Expert',
} as const;

export type TExperience = keyof typeof Experience;

/* ===== Utility Types ====== */
export type CommonFields = {
  [K in keyof typeof commonFields]: z.infer<typeof commonFields[K]>;
};