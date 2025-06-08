'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { IApiResponse, IPaginationResponse } from '@/shared/lib/types';
import { Visit, CreateVisit, UpdateVisit, createVisitSchema, updateVisitSchema, compositeKeySchema } from '@/shared/lib/zod/visit';
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
    
    console.log(
      `${EMOJI.SUCCESS} Visit created successfully for patient ${response.data.patientId}, doctor ${response.data.doctorId}, date ${response.data.visitDate}`
    );
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
 * @param {Object} compositeKey - Composite key identifying the visit
 * @param {UpdateVisit | FormData} data - Update data (can be FormData or plain object)
 * @returns {Promise<IApiResponse<Visit>>} API response with updated visit data
 * @throws {Error} When validation fails or API request fails
 */
export async function updateVisit(
  compositeKey: { patientId: string; doctorId: string; visitDate: string },
  data: UpdateVisit | FormData
): Promise<IApiResponse<Visit>> {
  try {
    console.log(
      `${EMOJI.OPERATION.UPDATE} Updating visit for patient ${compositeKey.patientId}, doctor ${compositeKey.doctorId}, date ${compositeKey.visitDate}...`
    );
    
    /* ===== Validate Composite Key ===== */
    const validatedKey = compositeKeySchema.safeParse(compositeKey);
    if (!validatedKey.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validatedKey.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Parse and Validate Data ===== */
    const parsedData = data instanceof FormData ? Object.fromEntries(data) : data;
    const validated = updateVisitSchema.safeParse(parsedData);
    
    if (!validated.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validated.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Update Visit ===== */
    const response = await visitService.update(compositeKey, validated.data);
    revalidatePath('/visits');
    revalidatePath(`/visit/${compositeKey.patientId}/${compositeKey.doctorId}/${compositeKey.visitDate}`);
    
    console.log(
      `${EMOJI.SUCCESS} Visit updated successfully for patient ${compositeKey.patientId}, doctor ${compositeKey.doctorId}, date ${compositeKey.visitDate}`
    );
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to update visit for patient ${compositeKey.patientId}, doctor ${compositeKey.doctorId}, date ${compositeKey.visitDate}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Deletes a visit record
 * @param {Object} compositeKey - Composite key identifying the visit
 * @returns {Promise<IApiResponse<{ deleted: boolean }>>} API response with deletion status
 * @throws {Error} When validation fails or API request fails
 */
export async function deleteVisit(
  compositeKey: { patientId: string; doctorId: string; visitDate: string }
): Promise<IApiResponse<{ deleted: boolean }>> {
  try {
    console.log(
      `${EMOJI.OPERATION.DELETE} Deleting visit for patient ${compositeKey.patientId}, doctor ${compositeKey.doctorId}, date ${compositeKey.visitDate}...`
    );
    
    /* ===== Validate Composite Key ===== */
    const validatedKey = compositeKeySchema.safeParse(compositeKey);
    if (!validatedKey.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validatedKey.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Delete Visit ===== */
    const response = await visitService.delete(compositeKey);
    revalidatePath('/visits');
    revalidatePath(`/visit/${compositeKey.patientId}/${compositeKey.doctorId}/${compositeKey.visitDate}`);
    
    console.log(
      `${EMOJI.SUCCESS} Visit deleted successfully for patient ${compositeKey.patientId}, doctor ${compositeKey.doctorId}, date ${compositeKey.visitDate}`
    );
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to delete visit for patient ${compositeKey.patientId}, doctor ${compositeKey.doctorId}, date ${compositeKey.visitDate}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Retrieves a single visit record by composite key
 * @param {Object} compositeKey - Composite key identifying the visit
 * @returns {Promise<IApiResponse<Visit>>} API response with visit data
 * @throws {Error} When validation fails or API request fails
 */
export async function getVisit(
  compositeKey: { patientId: string; doctorId: string; visitDate: string }
): Promise<IApiResponse<Visit>> {
  try {
    console.log(
      `${EMOJI.OPERATION.GET} Fetching visit for patient ${compositeKey.patientId}, doctor ${compositeKey.doctorId}, date ${compositeKey.visitDate}...`
    );
    
    /* ===== Validate Composite Key ===== */
    const validatedKey = compositeKeySchema.safeParse(compositeKey);
    if (!validatedKey.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validatedKey.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Fetch Visit ===== */
    const response = await visitService.fetchById(compositeKey);
    
    console.log(
      `${EMOJI.SUCCESS} Successfully fetched visit for patient ${compositeKey.patientId}, doctor ${compositeKey.doctorId}, date ${compositeKey.visitDate}`
    );
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to get visit for patient ${compositeKey.patientId}, doctor ${compositeKey.doctorId}, date ${compositeKey.visitDate}: ${error instanceof Error ? error.message : 'Unknown error'}`;
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
    }).safeParse({ page: page + 1, limit });
    
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