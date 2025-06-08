import { z } from "zod";

// Enum for medical specializations
export enum Specialization {
  Ophthalmology = "Ophthalmology", // Eye and vision care
  Oncologists = "Oncologists", // Cancer treatment and research
  Emergency = "Emergency", // Acute and urgent care
  General = "General", // Primary and general healthcare
  Anaesthetists = "Anaesthetists", // Anesthesia and pain management
  IntensiveCare = "IntensiveCare", // Critical care for severe conditions
  Cardiology = "Cardiology", // Heart and cardiovascular system
  Neurology = "Neurology", // Brain and nervous system disorders
  Orthopedics = "Orthopedics", // Musculoskeletal system and injuries
  Pediatrics = "Pediatrics", // Medical care for children
  Dermatology = "Dermatology", // Skin, hair, and nail conditions
  Gastroenterology = "Gastroenterology", // Digestive system disorders
  Psychiatry = "Psychiatry", // Mental health and behavioral disorders
  Radiology = "Radiology", // Medical imaging and diagnostics
  Surgery = "Surgery", // Surgical procedures and interventions
  Endocronilogy = "Endocronilogy", // Hormone and metabolic disorders
  Urology = "Urology", // Urinary tract and reproductive system
}

// Enum for levels of professional experience
export enum Experience {
  Novice = "Novice", // Beginner, less than 1 year of experience
  Intern = "Intern", // Entry-level, 0-1 years in training
  Resident = "Resident", // 1-3 years, post-graduate training
  Junior = "Junior", // 3-5 years, early career professional
  MidLevel = "MidLevel", // 5-10 years, established practitioner
  Senior = "Senior", // 10+ years, highly experienced
  Consultant = "Consultant", // Expert leading teams or projects
  Specialist = "Specialist", // Focused expertise in a specific field
  Expert = "Expert", // Advanced mastery, 15+ years or recognized authority
}

// Common fields for data validation with Zod
export const commonFields = {
  id: z.string({ description: "Unique identifier for the record" }),
  firstName: z
    .string({ description: "First name of the individual" })
    .min(3, "First name must be at least 3 characters")
    .max(20, "First name cannot exceed 20 characters")
    .regex(/^[a-zA-Z]+$/, "First name can only contain letters")
    .trim(),
  lastName: z
    .string({ description: "Last name of the individual" })
    .min(3, "Last name must be at least 3 characters")
    .max(20, "Last name cannot exceed 20 characters")
    .regex(/^[a-zA-Z]+$/, "Last name can only contain letters")
    .trim(),
  address: z
    .string({ description: "Full physical address of the individual" })
    .min(10, "Address must be at least 10 characters")
    .max(100, "Address cannot exceed 100 characters")
    .trim(),
  email: z
    .string({ description: "Email address of the individual" })
    .email("Invalid email format")
    .max(100, "Email cannot exceed 100 characters")
    .trim(),
  phoneNumber: z
    .string({ description: "Phone number in XXX/XXX/XXXX format" })
    .regex(
      /^\d{3}\/\d{3}\/\d{4}$/,
      "Phone number must be in XXX/XXX/XXXX format"
    ),
};

// Insurance schema for creating a new insurance
export const createInsuranceSchema = z.object({
  companyName: z
    .string()
    .min(3, "Company name must be at least 3 characters")
    .max(100, "Company name cannot exceed 100 characters")
    .trim(),
  address: commonFields.address,
  phoneNumber: commonFields.phoneNumber,
});

// Insurance schema for updating an existing insurance
export const updateInsuranceSchema = z.object({
  companyName: z
    .string()
    .min(3, "Company name must be at least 3 characters")
    .max(100, "Company name cannot exceed 100 characters")
    .trim(),
  address: commonFields.address,
  phoneNumber: commonFields.phoneNumber,
});

// Type for Insurance
export type Insurance = z.infer<typeof createInsuranceSchema> & { id: string };
