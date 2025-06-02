import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ApiResponse, PaginatedResponse } from '@/shared/lib/types';
import ApiService from '@/shared/lib/api';

// Generic CRUD action creator
export function createCrudActions<
  T extends Record<string, unknown>,
  C extends Record<string, unknown>,
  U extends Record<string, unknown>
>(
  model: string,
  service: ApiService<T, C, U>,
  createSchema: z.ZodSchema<C>,
  updateSchema: z.ZodSchema<U>,
  createFormParser: (formData: FormData) => C,
  updateFormParser: (formData: FormData) => Omit<U, 'id'>
) {
  // Create action
  const create = async (data: C | FormData): Promise<ApiResponse<T>> => {
    'use server';
    try {
      const input = data instanceof FormData ? createFormParser(data) : data;
      const validated = createSchema.parse(input);
      const response = await service.create(validated);
      revalidatePath(`/${model}`);
      return response;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        console.error(`Validation errors for ${model}:`, error.errors);
        throw new Error(`Invalid data: ${error.errors.map(e => e.message).join(', ')}`);
      }
      console.error(`Create ${model} error:`, error);
      throw new Error(`Failed to create ${model.toLowerCase()}`);
    }
  };

  // Get action
  const get = async (id: string | Record<string, unknown>): Promise<ApiResponse<T>> => {
    'use server';
    try {
      const validatedId = typeof id === 'string'
        ? z.string({ required_error: 'ID is required' }).parse(id)
        : z.record(z.unknown()).parse(id);
      return await service.get(validatedId);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        console.error(`Validation errors for ${model} ID:`, error.errors);
        throw new Error(`Invalid ${model.toLowerCase()} ID`);
      }
      console.error(`Get ${model} error:`, error);
      throw new Error(`Failed to fetch ${model.toLowerCase()}`);
    }
  };

  // Update action
  const update = async (id: string | Record<string, unknown>, data: U | FormData): Promise<ApiResponse<T>> => {
    'use server';
    try {
      if (!id) throw new Error(`${model} ID is required`);
      const input = data instanceof FormData ? updateFormParser(data) : data;
      const validated = updateSchema.parse(input);
      const response = await service.update(id, validated);
      revalidatePath(`/${model}`);
      return response;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        console.error(`Validation errors for ${model}:`, error.errors);
        throw new Error(`Invalid data: ${error.errors.map(e => e.message).join(', ')}`);
      }
      console.error(`Update ${model} error:`, error);
      throw new Error(`Failed to update ${model.toLowerCase()}`);
    }
  };

  // Delete action
  const del = async (id: string | Record<string, unknown>): Promise<ApiResponse<{ deleted: boolean }>> => {
    'use server';
    try {
      const validatedId = typeof id === 'string'
        ? z.string({ required_error: 'ID is required' }).parse(id)
        : z.record(z.unknown()).parse(id);
      const response = await service.delete(validatedId);
      revalidatePath(`/${model}`);
      return response;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        console.error(`Validation errors for ${model}:`, error.errors);
        throw new Error(`Invalid ${model.toLowerCase()} ID`);
      }
      console.error(`Delete ${model} error:`, error);
      throw new Error(`Failed to delete ${model.toLowerCase()}`);
    }
  };

  // Fetch action
  const fetch = async (page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<T>>> => {
    'use server';
    try {
      const validatedParams = z.object({
        page: z.number().min(0, 'Page must be non-negative'),
        limit: z.number().min(1, 'Limit must be at least 1'),
      }).parse({ page, size });
      const response = await service.fetchAll(validatedParams);
      revalidatePath(`/${model}`);
      return response;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        console.error(`Validation errors for ${model}:`, error.errors);
        throw new Error('Invalid pagination parameters');
      }
      console.error(`Fetch ${model} error:`, error);
      throw new Error(`Failed to fetch ${model.toLowerCase()}`);
    }
  };

  return { create, get, update, delete: del, fetch };
}