// actions/doctors/updateDoctor.ts

import { z } from 'zod'
import { updateDoctorSchema } from '@/shared/lib/zod/doctor'
import { apiClient } from '@/shared/lib/api'

export async function updateDoctor(
  id: string,
  formData: FormData
): Promise<{ data: z.infer<typeof updateDoctorSchema> }> {
  const parsed = updateDoctorSchema.parse(Object.fromEntries(formData))

  const response = await apiClient.put(`/doctors/${id}`, parsed)

  return {
    data: response.data,
  }
}
