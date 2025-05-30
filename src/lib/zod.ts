import { z } from 'zod';
import { ExperienceLevelList, SpecializationList } from './types';

// 🛡️ Validation rules for all fields
export const commons = {
  id: z.string({ required_error: '🆔 ID is required' }),
  firstName: z.string()
    .min(3, { message: '👨‍⚕️ First name too short (min 3 chars)' })
    .max(20, { message: '📛 First name too long (max 20 chars)' }),
  lastName: z.string()
    .min(3, { message: '👩‍⚕️ Last name too short (min 3 chars)' })
    .max(20, { message: '🪪 Last name too long (max 20 chars)' }),
  address: z.string()
    .min(3, { message: '🏠 Address too short (min 3 chars)' })
    .max(100, { message: '🗺️ Address too long (max 100 chars)' }),
  email: z.string()
    .email({ message: '📧 Invalid email format' })
    .regex(/^[^@]+@[^@]+\.[^@]+$/, { message: '✉️ Enter valid email (user@domain.com)' }),
  phoneNumber: z.string()
    .regex(/[0-9]{3}-[0-9]{3}-[0-9]{4}/, { message: '📱 Phone must be 123-456-7890 format' }),
};

// ⚙️ Base shape (only updatable fields)
const baseDoctorSchema = z.object({
  firstName: commons.firstName,  // 👨‍⚕️
  lastName: commons.lastName,    // 👩‍⚕️
  address: commons.address,     // 🏠
  email: commons.email,         // 📧
  phoneNumber: commons.phoneNumber.optional(),  // 📱 (optional)
});

// 🏥 Full doctor shape (API responses)
export const doctorSchema = baseDoctorSchema.extend({
  id: commons.id,                          // 🆔
  specialization: z.nativeEnum(SpecializationList).optional(),  // 🩺
  experience: z.nativeEnum(ExperienceLevelList).optional(),     // 🎓
});

// ➕ Creation rules (all required + defaults)
export const createDoctorSchema = baseDoctorSchema.extend({
  specialization: z.nativeEnum(SpecializationList, {
    required_error: "🩺 Specialization required"
  }).default(SpecializationList.General),  // ⚕️ Default: General
  experience: z.nativeEnum(ExperienceLevelList, {
    required_error: "🎓 Experience level required"
  }).default(ExperienceLevelList.Novice),  // 👶 Default: Novice
});

// ✏️ Update rules (all fields optional)
export const updateDoctorSchema = z.object({
  id: commons.id,                          // 🔑 Required ID
  firstName: commons.firstName.optional(), // ✏️ Optional
  lastName: commons.lastName.optional(),   // ✏️ Optional
  address: commons.address.optional(),     // ✏️ Optional
  email: commons.email.optional(),         // ✏️ Optional
  phoneNumber: commons.phoneNumber.optional(),  // ✏️ Optional
  specialization: z.nativeEnum(SpecializationList).optional(),  // 🩺 Optional
  experience: z.nativeEnum(ExperienceLevelList).optional(),     // 🎓 Optional
}).strict();  // 🚫 No extra fields

// 📜 TYPE EXPORTS
export type Doctor = z.infer<typeof doctorSchema>;  // 🏥 Full type
export type DoctorCreateInput = z.infer<typeof createDoctorSchema>;  // ➕ Creation type
export type DoctorUpdateInput = z.infer<typeof updateDoctorSchema>;  // ✏️ Update type