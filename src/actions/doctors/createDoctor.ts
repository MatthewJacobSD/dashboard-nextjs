import { z } from 'zod'
import { createDoctorSchema } from '@/shared/lib/zod/doctor'
import { apiClient } from '@/shared/lib/api'

export async function createDoctor(
  formData: FormData
): Promise<{ data: z.infer<typeof createDoctorSchema> }> {
  const parsed = createDoctorSchema.parse(Object.fromEntries(formData))

  const response = await apiClient.post('/doctors', parsed)

  return {
    data: response.data,
  }
}
