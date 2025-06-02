// shared/hooks/useDoctors.ts
import { createEntityHook } from './useEntity';
import { doctorSchema, createDoctorSchema, updateDoctorSchema } from '@/shared/lib/zod';
import { 
  fetchDoctors, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor 
} from '@/shared/server/actions/doctor';

export const useDoctors = createEntityHook(
  {
    entity: doctorSchema,
    create: createDoctorSchema,
    update: updateDoctorSchema,
  },
  {
    fetch: fetchDoctors,
    create: createDoctor,
    update: updateDoctor,
    delete: deleteDoctor,
  }
);