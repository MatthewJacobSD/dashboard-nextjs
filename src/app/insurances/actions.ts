'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { IApiResponse, IPaginationResponse } from '@/shared/lib/types';
import { Insurance, CreateInsurance, UpdateInsurance, createInsuranceSchema, updateInsuranceSchema } from '@/shared/lib/zod/insurance';
import { ApiService } from '@/shared/lib/api';

/* ===== Constants ===== */
const EMOJI = {
  SUCCESS: '🔥',
  ERROR: '♨️',
  OPERATION: {
    CREATE: '🆕',
    UPDATE: '♻️',
    DELETE: '🗑️',
    FETCH: '🔍',
    GET: '📋'
  }
} as const;

/* ===== Insurance Service Instance ===== */
const insuranceService = new ApiService<Insurance, CreateInsurance, UpdateInsurance>('/insurances');

/**
 * Creates a new insurance record after validating input data
 * @param {CreateInsurance | FormData} data - Insurance creation data (can be FormData or plain object)
 * @returns {Promise<IApiResponse<Insurance>>} API response with created insurance data
 * @throws {Error} When validation fails or API request fails
 */
export async function createInsurance(data: CreateInsurance | FormData): Promise<IApiResponse<Insurance>> {
  try {
    console.log(`${EMOJI.OPERATION.CREATE} Creating new insurance...`);
    
    /* ===== Parse and Validate Data ===== */
    const parsedData = data instanceof FormData ? Object.fromEntries(data) : data;
    const validated = createInsuranceSchema.safeParse(parsedData);
    
    if (!validated.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validated.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Create Insurance ===== */
    const response = await insuranceService.create(validated.data);
    revalidatePath('/insurances');
    
    console.log(`${EMOJI.SUCCESS} Insurance created successfully! ID: ${response.data.id}`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to create insurance: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Updates an existing insurance record
 * @param {string} id - ID of the insurance to update
 * @param {UpdateInsurance | FormData} data - Update data (can be FormData or plain object)
 * @returns {Promise<IApiResponse<Insurance>>} API response with updated insurance data
 * @throws {Error} When validation fails or API request fails
 */
export async function updateInsurance(id: string, data: UpdateInsurance | FormData): Promise<IApiResponse<Insurance>> {
  try {
    console.log(`${EMOJI.OPERATION.UPDATE} Updating insurance ${id}...`);
    
    /* ===== Parse and Validate Data ===== */
    const parsedData = data instanceof FormData ? Object.fromEntries(data) : data;
    const validated = updateInsuranceSchema.safeParse(parsedData);
    
    if (!validated.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validated.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Update Insurance ===== */
    const response = await insuranceService.update(id, validated.data);
    revalidatePath('/insurances');
    revalidatePath(`/insurance/${id}`);
    
    console.log(`${EMOJI.SUCCESS} Insurance ${id} updated successfully!`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to update insurance ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Deletes a insurance record
 * @param {string} id - ID of the insurance to delete
 * @returns {Promise<IApiResponse<{ deleted: boolean }>>} API response with deletion status
 * @throws {Error} When validation fails or API request fails
 */
export async function deleteInsurance(id: string): Promise<IApiResponse<{ deleted: boolean }>> {
  try {
    console.log(`${EMOJI.OPERATION.DELETE} Deleting insurance ${id}...`);
    
    /* ===== Validate ID ===== */
    const validateId = z.string().min(1).safeParse(id);
    if (!validateId.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validateId.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Delete Insurance ===== */
    const response = await insuranceService.delete(validateId.data);
    revalidatePath('/insurances');
    revalidatePath(`/insurance/${id}`);
    
    console.log(`${EMOJI.SUCCESS} Insurance ${id} deleted successfully!`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to delete insurance ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Retrieves a single insurance record by ID
 * @param {string} id - ID of the insurance to fetch
 * @returns {Promise<IApiResponse<Insurance>>} API response with insurance data
 * @throws {Error} When validation fails or API request fails
 */
export async function getInsurance(id: string): Promise<IApiResponse<Insurance>> {
  try {
    console.log(`${EMOJI.OPERATION.GET} Fetching insurance ${id}...`);
    
    /* ===== Validate ID ===== */
    const validateId = z.string().min(1).safeParse(id);
    if (!validateId.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validateId.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Fetch Insurance ===== */
    const response = await insuranceService.fetchById(validateId.data);
    
    console.log(`${EMOJI.SUCCESS} Successfully fetched insurance ${id}`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to get insurance ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Fetches paginated list of insurances
 * @param {number} [page=1] - Page number (1-based)
 * @param {number} [limit=10] - Number of items per page
 * @returns {Promise<IApiResponse<IPaginationResponse<Insurance>>>} API response with paginated insurance data
 * @throws {Error} When validation fails or API request fails
 */
export async function fetchInsurances(
  page: number = 1,
  limit: number = 10
): Promise<IApiResponse<IPaginationResponse<Insurance>>> {
  try {
    console.log(`${EMOJI.OPERATION.FETCH} Fetching insurances (page ${page}, limit ${limit})...`);
    
    /* ===== Validate Pagination ===== */
    const validateParams = z.object({
      page: z.number().min(1),
      limit: z.number().min(1)
    }).safeParse({ page: page + 1, limit });
    
    if (!validateParams.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validateParams.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Fetch Insurances ===== */
    const response = await insuranceService.fetchAll(validateParams.data);
    
    console.log(`${EMOJI.SUCCESS} Fetched ${response.data.items.length} insurances (page ${page} of ${response.data.totalPages})`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to fetch insurances: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}