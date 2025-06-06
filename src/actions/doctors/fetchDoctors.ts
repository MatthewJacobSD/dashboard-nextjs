import { z } from 'zod'
import { Doctor } from '@/shared/lib/zod/doctor'
import { apiClient } from '@/shared/lib/api'

const FetchDoctorsResponse = z.object({
  data: z.array(Doctor),
  totalPages: z.number(),
})

export type FetchDoctorsResult = z.infer<typeof FetchDoctorsResponse>

interface FetchDoctorsParams {
  page?: number
  size?: number
  searchQuery?: string
}

export async function fetchDoctors({
  page = 0,
  size = 10,
  searchQuery = '',
}: FetchDoctorsParams): Promise<FetchDoctorsResult> {
  const response = await apiClient.get('/doctors', {
    params: {
      page,
      size,
      query: searchQuery,
    },
  })

  return FetchDoctorsResponse.parse(response.data)
}
