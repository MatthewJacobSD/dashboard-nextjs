import { apiClient } from '@/shared/lib/api'

export async function deleteDoctor(id: string): Promise<void> {
  await apiClient.delete(`/doctors/${id}`)
}
