import { z } from 'zod';
import { Specialization, Experience } from './types';

// ======================
// COMMON FIELDS
// ======================
export const commonFields = {
  id: z.string({
    description: 'Unique identifier of the schema',
    required_error: '📛 ID is required',
  }),
  firstName: z
    .string({
      description: 'First name of the schema',
      required_error: '📛 FirstName is required',
    })
    .min(3, { message: '👨‍⚕️ First name too short (min 3 chars)' })
    .max(20, { message: '📛 First name too long (max 20 chars)' }),
  lastName: z
    .string({
      description: 'Last name of the schema',
      required_error: '📛 LastName is required',
    })
    .min(3, { message: '👩‍⚕️ Last name too short (min 3 chars)' })
    .max(20, { message: '📛 Last name too long (max 20 chars)' }),
  address: z
    .string({
      description: 'Address of the schema',
      required_error: '📛 Address is required',
    })
    .min(10, { message: '🏠 Address too short (min 10 chars)' })
    .max(100, { message: '🗺️ Address too long (max 100 chars)' }),
  email: z
    .string({
      description: 'Email of the schema',
      required_error: '📧 Email is required',
    })
    .email({ message: '💌 Email is not valid' })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: '💌 Enter valid email (user@domain.com)',
    }),
  phoneNumber: z
    .string({
      description: 'Phone number of the schema',
      required_error: '📞 Phone is required',
    })
    .regex(/^\+?[0-9]{3}-[0-9]{3}-[0-9]{4}$/, {
      message: '📱 Phone must be [+]123-456-7890 format',
    }),
};

// ======================
// DOCTOR MODEL
// ======================
const baseDoctor = z.object({
  firstName: commonFields.firstName,
  lastName: commonFields.lastName,
  address: commonFields.address,
  email: commonFields.email,
});

export const doctorSchema = baseDoctor.extend({
  id: commonFields.id,
  specialization: z.enum(Object.values(Specialization) as [string, ...string[]]).default(Specialization.General),
  experience: z.enum(Object.values(Experience) as [string, ...string[]]).default(Experience.Novice),
});

export const createDoctorSchema = doctorSchema.omit({ id: true }).extend({
  specialization: z.enum(Object.values(Specialization) as [string, ...string[]]),
  experience: z.enum(Object.values(Experience) as [string, ...string[]]),
});

export const updateDoctorSchema = doctorSchema.omit({ id: true }).partial().extend({
  id: commonFields.id,
}).strict();

export type Doctor = z.infer<typeof doctorSchema>;
export type DoctorCreateInput = z.infer<typeof createDoctorSchema>;
export type DoctorUpdateInput = z.infer<typeof updateDoctorSchema>;

// ======================
// INSURANCE MODEL
// ======================
const baseInsurance = z.object({
  companyName: z
    .string({
      description: 'Name of the insurance',
      required_error: '📛 Name is required',
    })
    .min(3, { message: '🏥 Insurance name too short (min 3 chars)' })
    .max(50, { message: '🏥 Insurance name too long (max 50 chars)' }),
  address: commonFields.address,
  phoneNumber: commonFields.phoneNumber,
});

export const insuranceSchema = baseInsurance.extend({
  id: commonFields.id,
});

export const createInsuranceSchema = insuranceSchema.omit({ id: true });

export const updateInsuranceSchema = insuranceSchema.omit({ id: true }).partial().extend({
  id: commonFields.id,
}).strict();

export type Insurance = z.infer<typeof insuranceSchema>;
export type InsuranceCreateInput = z.infer<typeof createInsuranceSchema>;
export type InsuranceUpdateInput = z.infer<typeof updateInsuranceSchema>;

// ======================
// MEDICATION MODEL
// ======================
const baseMedication = z.object({
  name: z
    .string({
      description: 'Name of the medication',
      required_error: '📛 Name is required',
    })
    .min(3, { message: '💊 Medication name too short (min 3 chars)' })
    .max(50, { message: '💊 Medication name too long (max 50 chars)' }),
  sideEffects: z
    .string({
      description: 'Side effects of the medication',
      required_error: '📛 Side effects are required',
    })
    .min(10, { message: '💊 Side effects too short (min 10 chars)' })
    .max(1000, { message: '💊 Side effects too long (max 1000 chars)' }),
  benefits: z
    .string({
      description: 'Benefits of the medication',
      required_error: '📛 Benefits are required',
    })
    .min(10, { message: '💊 Benefits too short (min 10 chars)' })
    .max(1000, { message: '💊 Benefits too long (max 1000 chars)' }),
});

export const medicationSchema = baseMedication.extend({
  id: commonFields.id,
});

export const createMedicationSchema = medicationSchema.omit({ id: true });

export const updateMedicationSchema = medicationSchema.omit({ id: true }).partial().extend({
  id: commonFields.id,
}).strict();

export type Medication = z.infer<typeof medicationSchema>;
export type MedicationCreateInput = z.infer<typeof createMedicationSchema>;
export type MedicationUpdateInput = z.infer<typeof updateMedicationSchema>;

// ======================
// PATIENT MODEL
// ======================
const basePatient = z.object({
  firstName: commonFields.firstName,
  lastName: commonFields.lastName,
  postcode: z
    .string({
      description: 'Postcode of the patient',
      required_error: '📛 Postcode is required',
    })
    .regex(/^\d{5}$/, { message: '📍 Postcode must be 5 digits (e.g., 12345)' }),
  address: commonFields.address,
  phoneNumber: commonFields.phoneNumber,
  email: commonFields.email,
});

export const patientSchema = basePatient
  .extend({
    id: commonFields.id,
    isInsured: z
      .boolean({
        description: 'Is the patient insured',
        required_error: '📛 Is insured is required',
      })
      .default(false),
    insuranceId: commonFields.id.optional(),
  })
  .refine(
    (data) => {
      if (data.isInsured) {
        return data.insuranceId !== undefined;
      }
      return true;
    },
    {
      message: '📛 Insurance is required if the patient is insured',
      path: ['insuranceId'],
    },
  );

export const createPatientSchema = basePatient
  .extend({
    isInsured: z
      .boolean({
        description: 'Is the patient insured',
        required_error: '📛 Is insured is required',
      }),
    insuranceId: commonFields.id.optional(),
  })
  .refine(
    (data) => {
      if (data.isInsured) {
        return data.insuranceId !== undefined;
      }
      return true;
    },
    {
      message: '📛 Insurance ID is required if the patient is insured',
      path: ['insuranceId'],
    },
  );

export const updatePatientSchema = basePatient
  .extend({
    id: commonFields.id,
    isInsured: z
      .boolean({
        description: 'Is the patient insured',
        required_error: '📛 Is insured is required',
      })
      .optional(),
    insuranceId: commonFields.id.optional(),
  })
  .partial({ firstName: true, lastName: true, postcode: true, address: true, phoneNumber: true, email: true })
  .strict()
  .superRefine((data, ctx) => {
    if (data.isInsured) {
      if (data.insuranceId === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '📛 Insurance ID is required if the patient is insured',
          path: ['insuranceId'],
        });
      }
    }
  });

export type Patient = z.infer<typeof patientSchema>;
export type PatientCreateInput = z.infer<typeof createPatientSchema>;
export type PatientUpdateInput = z.infer<typeof updatePatientSchema>;

// ======================
// PRESCRIPTION MODEL
// ======================
const basePrescription = z.object({
  prescriptionDate: z
    .string({
      description: 'Date of the prescription',
      required_error: '📛 Date is required',
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: '📆 Date must be in YYYY-MM-DD format' }),
  dosage: z
    .string({
      description: 'Dosage of the prescription',
      required_error: '📛 Dosage is required',
    })
    .min(1, { message: '📛 Dosage must be at least 1 character' })
    .max(50, { message: '📛 Dosage must be less than 50 characters' }),
  duration: z
    .string({
      description: 'Duration of the prescription',
      required_error: '📛 Duration is required',
    })
    .min(1, { message: '📛 Duration must be at least 1 character' })
    .max(50, { message: '📛 Duration must be less than 50 characters' }),
  comments: z
    .string({
      description: 'Comments of the prescription',
      required_error: '📛 Comments is required',
    })
    .min(10, { message: '📛 Comments must be at least 10 characters' })
    .max(1000, { message: '📛 Comments must be less than 1000 characters' }),
});

export const prescriptionSchema = basePrescription
  .extend({
    id: commonFields.id,
    isPrescribed: z.boolean({
      description: 'Is the prescription prescribed',
      required_error: '📛 Is prescribed is required',
    })
    .default(false),
    patientId: commonFields.id,
    medicationId: commonFields.id,
    doctorId: commonFields.id,
  })
  .refine(
    (data) => {
      if (data.isPrescribed) {
        return data.patientId !== undefined && data.medicationId !== undefined && data.doctorId !== undefined;
      }
      return true;
    },
    {
      message: '📛 Patient, medication, and doctor Ids are required if the prescription is prescribed',
      path: ['patientId', 'medicationId', 'doctorId'],
    },
  );

export const createPrescriptionSchema = basePrescription
  .extend({
    isPrescribed: z
      .boolean({
        description: 'Is the prescription prescribed',
        required_error: '📛 Is prescribed is required',
      }),
    patientId: commonFields.id,
    medicationId: commonFields.id,
    doctorId: commonFields.id,
  })
  .refine(
    (data) => {
      if (data.isPrescribed) {
        return data.patientId !== undefined && data.medicationId !== undefined && data.doctorId !== undefined;
      }
      return true;
    },
    {
      message: '📛 Patient, medication, and doctor IDs are required if the prescription is prescribed',
      path: ['patientId', 'medicationId', 'doctorId'],
    },
  );

export const updatePrescriptionSchema = basePrescription
  .extend({
    id: commonFields.id,
    isPrescribed: z
      .boolean({
        description: 'Is the prescription prescribed',
        required_error: '📛 Is prescribed is required',
      })
      .optional(),
    patientId: commonFields.id.optional(),
    medicationId: commonFields.id.optional(),
    doctorId: commonFields.id.optional(),
  })
  .partial({ prescriptionDate: true, dosage: true, duration: true, comments: true })
  .strict()
  .superRefine((data, ctx) => {
    if (data.isPrescribed) {
      if (data.patientId === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '📛 Patient ID is required if the prescription is prescribed',
          path: ['patientId'],
        });
      }
      if (data.medicationId === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '📛 Medication ID is required if the prescription is prescribed',
          path: ['medicationId'],
        });
      }
      if (data.doctorId === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '📛 Doctor ID is required if the prescription is prescribed',
          path: ['doctorId'],
        });
      }
    }
  });

export type Prescription = z.infer<typeof prescriptionSchema>;
export type PrescriptionCreateInput = z.infer<typeof createPrescriptionSchema>;
export type PrescriptionUpdateInput = z.infer<typeof updatePrescriptionSchema>;

// ======================
// VISIT MODEL
// ======================
const baseVisit = z.object({
  symptoms: z
    .string({
      description: 'Symptoms of the visit',
      required_error: '📛 Symptoms is required',
    })
    .min(1, { message: '📛 Symptoms must be at least 1 character' })
    .max(50, { message: '📛 Symptoms must be less than 50 characters' }),
  diagnosis: z
    .string({
      description: 'Diagnosis of the visit',
      required_error: '📛 Diagnosis is required',
    })
    .min(1, { message: '📛 Diagnosis must be at least 1 character' })
    .max(50, { message: '📛 Diagnosis must be less than 50 characters' }),
});

export const compositeKey = z.object({
  patientId: commonFields.id,
  doctorId: commonFields.id,
  visitDate: z
    .string({
      description: 'Date of the visit',
      required_error: '📛 Date is required',
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: '📆 Date must be in YYYY-MM-DD format' }),
});

export const visitSchema = baseVisit.extend({
  id: compositeKey,
});

export const createVisitSchema = baseVisit.extend({
  patientId: commonFields.id,
  doctorId: commonFields.id,
  visitDate: compositeKey.shape.visitDate,
});

export const updateVisitSchema = visitSchema.omit({ id: true }).partial().extend({
  id: compositeKey,
}).strict();

export type Visit = z.infer<typeof visitSchema>;
export type VisitCreateInput = z.infer<typeof createVisitSchema>;
export type VisitUpdateInput = z.infer<typeof updateVisitSchema>;