'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { IApiResponse, IPaginationResponse } from '@/shared/lib/types';
import { Visit, CreateVisit, UpdateVisit, createVisitSchema, updateVisitSchema } from '@/shared/lib/zod/visit';
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

/* ===== Visit Service Instance ===== */
const visitService = new ApiService<Visit, CreateVisit, UpdateVisit>('/visits');

/**
 * Creates a new visit record after validating input data
 * @param {CreateVisit | FormData} data - Visit creation data (can be FormData or plain object)
 * @returns {Promise<IApiResponse<Visit>>} API response with created visit data
 * @throws {Error} When validation fails or API request fails
 */
export async function createVisit(data: CreateVisit | FormData): Promise<IApiResponse<Visit>> {
  try {
    console.log(`${EMOJI.OPERATION.CREATE} Creating new visit...`);
    
    /* ===== Parse and Validate Data ===== */
    const parsedData = data instanceof FormData ? Object.fromEntries(data) : data;
    const validated = createVisitSchema.safeParse(parsedData);
    
    if (!validated.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validated.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Create Visit ===== */
    const response = await visitService.create(validated.data);
    revalidatePath('/visits');
    
    console.log(`${EMOJI.SUCCESS} Visit created successfully! ID: ${response.data.id}`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to create visit: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Updates an existing visit record
 * @param {string} id - ID of the visit to update
 * @param {UpdateVisit | FormData} data - Update data (can be FormData or plain object)
 * @returns {Promise<IApiResponse<Visit>>} API response with updated visit data
 * @throws {Error} When validation fails or API request fails
 */
export async function updateVisit(id: string, data: UpdateVisit | FormData): Promise<IApiResponse<Visit>> {
  try {
    console.log(`${EMOJI.OPERATION.UPDATE} Updating visit ${id}...`);
    
    /* ===== Parse and Validate Data ===== */
    const parsedData = data instanceof FormData ? Object.fromEntries(data) : data;
    const validated = updateVisitSchema.safeParse(parsedData);
    
    if (!validated.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validated.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Update Visit ===== */
    const response = await visitService.update(id, validated.data);
    revalidatePath('/visits');
    revalidatePath(`/visit/${id}`);
    
    console.log(`${EMOJI.SUCCESS} Visit ${id} updated successfully!`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to update visit ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Deletes a visit record
 * @param {string} id - ID of the visit to delete
 * @returns {Promise<IApiResponse<{ deleted: boolean }>>} API response with deletion status
 * @throws {Error} When validation fails or API request fails
 */
export async function deleteVisit(id: string): Promise<IApiResponse<{ deleted: boolean }>> {
  try {
    console.log(`${EMOJI.OPERATION.DELETE} Deleting visit ${id}...`);
    
    /* ===== Validate ID ===== */
    const validateId = z.string().min(1).safeParse(id);
    if (!validateId.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validateId.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Delete Visit ===== */
    const response = await visitService.delete(validateId.data);
    revalidatePath('/visits');
    revalidatePath(`/visit/${id}`);
    
    console.log(`${EMOJI.SUCCESS} Visit ${id} deleted successfully!`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to delete visit ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Retrieves a single visit record by ID
 * @param {string} id - ID of the visit to fetch
 * @returns {Promise<IApiResponse<Visit>>} API response with visit data
 * @throws {Error} When validation fails or API request fails
 */
export async function getVisit(id: string): Promise<IApiResponse<Visit>> {
  try {
    console.log(`${EMOJI.OPERATION.GET} Fetching visit ${id}...`);
    
    /* ===== Validate ID ===== */
    const validateId = z.string().min(1).safeParse(id);
    if (!validateId.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validateId.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Fetch Visit ===== */
    const response = await visitService.fetchById(validateId.data);
    
    console.log(`${EMOJI.SUCCESS} Successfully fetched visit ${id}`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to get visit ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Fetches paginated list of visits
 * @param {number} [page=1] - Page number (1-based)
 * @param {number} [limit=10] - Number of items per page
 * @returns {Promise<IApiResponse<IPaginationResponse<Visit>>>} API response with paginated visit data
 * @throws {Error} When validation fails or API request fails
 */
export async function fetchVisits(
  page: number = 1,
  limit: number = 10
): Promise<IApiResponse<IPaginationResponse<Visit>>> {
  try {
    console.log(`${EMOJI.OPERATION.FETCH} Fetching visits (page ${page}, limit ${limit})...`);
    
    /* ===== Validate Pagination ===== */
    const validateParams = z.object({
      page: z.number().min(1),
      limit: z.number().min(1)
    }).safeParse({ page, limit });
    
    if (!validateParams.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validateParams.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Fetch Visits ===== */
    const response = await visitService.fetchAll(validateParams.data);
    
    console.log(`${EMOJI.SUCCESS} Fetched ${response.data.items.length} visits (page ${page} of ${response.data.totalPages})`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to fetch visits: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}