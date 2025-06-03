import { z } from 'zod';

/**
 * Reusable field definitions for Zod schemas to maintain consistency across models.
 */
export const commonFields = {
  id: z.string({
    description: 'Unique identifier',
    required_error: 'ID is required',
  }),
  firstName: z
    .string({ description: 'First name' })
    .min(3, 'First name too short (min 3 chars)')
    .max(20, 'First name too long (max 20 chars)'),
  lastName: z
    .string({ description: 'Last name' })
    .min(3, 'Last name too short (min 3 chars)')
    .max(20, 'Last name too long (max 20 chars)'),
  address: z
    .string({ description: 'Address' })
    .min(10, 'Address too short (min 10 chars)')
    .max(100, 'Address too long (max 100 chars)'),
  email: z
    .string({ description: 'Email' })
    .email('Invalid email')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),
  phoneNumber: z
    .string({ description: 'Phone number' })
    .regex(/^\+?[0-9]{3}-[0-9]{3}-[0-9]{4}$/, 'Phone must be [+]123-456-7890 format'),
};

/**
 * Composite key for visit model.
 */
export const compositeKey = z.object({
  patientId: commonFields.id,
  doctorId: commonFields.id,
  visitDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});