import { Paginated, PaginationRequest } from './pagination'
import { apiClient, createApiError } from '../api'

export interface BaseService<T, C = T, U = Partial<T>> {
  getAll(params?: PaginationRequest): Promise<Paginated<T>>
  getById(id: string): Promise<T>
  create(data: C): Promise<T>
  update(id: string, data: U): Promise<T>
  delete(id: string): Promise<void>
}

export class GenericService<T, C = T, U = Partial<T>>
  implements BaseService<T, C, U>
{
  constructor(private endpoint: string) {}

  async getAll(params: PaginationRequest = { page: 0, size: 10 }) {
    try {
      const res = await apiClient.get<Paginated<T>>(this.endpoint, { params })
      return res.data
    } catch (err) {
      throw createApiError(err)
    }
  }

  async getById(id: string) {
    try {
      const res = await apiClient.get<T>(`${this.endpoint}/${id}`)
      return res.data
    } catch (err) {
      throw createApiError(err)
    }
  }

  async create(data: C) {
    try {
      const res = await apiClient.post<T>(this.endpoint, data)
      return res.data
    } catch (err) {
      throw createApiError(err)
    }
  }

  async update(id: string, data: U) {
    try {
      const res = await apiClient.put<T>(`${this.endpoint}/${id}`, data)
      return res.data
    } catch (err) {
      throw createApiError(err)
    }
  }

  async delete(id: string) {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`)
    } catch (err) {
      throw createApiError(err)
    }
  }
}
