'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { IApiResponse, IPaginationResponse } from '@/shared/lib/types';
import { Doctor, CreateDoctor, UpdateDoctor, createDoctorSchema, updateDoctorSchema } from '@/shared/lib/zod/doctor';
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

/* ===== Doctor Service Instance ===== */
const doctorService = new ApiService<Doctor, CreateDoctor, UpdateDoctor>('/doctors');

/**
 * Creates a new doctor record after validating input data
 * @param {CreateDoctor | FormData} data - Doctor creation data (can be FormData or plain object)
 * @returns {Promise<IApiResponse<Doctor>>} API response with created doctor data
 * @throws {Error} When validation fails or API request fails
 */
export async function createDoctor(data: CreateDoctor | FormData): Promise<IApiResponse<Doctor>> {
  try {
    console.log(`${EMOJI.OPERATION.CREATE} Creating new doctor...`);
    
    /* ===== Parse and Validate Data ===== */
    const parsedData = data instanceof FormData ? Object.fromEntries(data) : data;
    const validated = createDoctorSchema.safeParse(parsedData);
    
    if (!validated.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validated.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Create Doctor ===== */
    const response = await doctorService.create(validated.data);
    revalidatePath('/doctors');
    
    console.log(`${EMOJI.SUCCESS} Doctor created successfully! ID: ${response.data.id}`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to create doctor: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Updates an existing doctor record
 * @param {string} id - ID of the doctor to update
 * @param {UpdateDoctor | FormData} data - Update data (can be FormData or plain object)
 * @returns {Promise<IApiResponse<Doctor>>} API response with updated doctor data
 * @throws {Error} When validation fails or API request fails
 */
export async function updateDoctor(id: string, data: UpdateDoctor | FormData): Promise<IApiResponse<Doctor>> {
  try {
    console.log(`${EMOJI.OPERATION.UPDATE} Updating doctor ${id}...`);
    
    /* ===== Parse and Validate Data ===== */
    const parsedData = data instanceof FormData ? Object.fromEntries(data) : data;
    const validated = updateDoctorSchema.safeParse(parsedData);
    
    if (!validated.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validated.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Update Doctor ===== */
    const response = await doctorService.update(id, validated.data);
    revalidatePath('/doctors');
    revalidatePath(`/doctor/${id}`);
    
    console.log(`${EMOJI.SUCCESS} Doctor ${id} updated successfully!`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to update doctor ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Deletes a doctor record
 * @param {string} id - ID of the doctor to delete
 * @returns {Promise<IApiResponse<{ deleted: boolean }>>} API response with deletion status
 * @throws {Error} When validation fails or API request fails
 */
export async function deleteDoctor(id: string): Promise<IApiResponse<{ deleted: boolean }>> {
  try {
    console.log(`${EMOJI.OPERATION.DELETE} Deleting doctor ${id}...`);
    
    /* ===== Validate ID ===== */
    const validateId = z.string().min(1).safeParse(id);
    if (!validateId.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validateId.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Delete Doctor ===== */
    const response = await doctorService.delete(validateId.data);
    revalidatePath('/doctors');
    revalidatePath(`/doctor/${id}`);
    
    console.log(`${EMOJI.SUCCESS} Doctor ${id} deleted successfully!`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to delete doctor ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Retrieves a single doctor record by ID
 * @param {string} id - ID of the doctor to fetch
 * @returns {Promise<IApiResponse<Doctor>>} API response with doctor data
 * @throws {Error} When validation fails or API request fails
 */
export async function getDoctor(id: string): Promise<IApiResponse<Doctor>> {
  try {
    console.log(`${EMOJI.OPERATION.GET} Fetching doctor ${id}...`);
    
    /* ===== Validate ID ===== */
    const validateId = z.string().min(1).safeParse(id);
    if (!validateId.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validateId.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Fetch Doctor ===== */
    const response = await doctorService.fetchById(validateId.data);
    
    console.log(`${EMOJI.SUCCESS} Successfully fetched doctor ${id}`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to get doctor ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Fetches paginated list of doctors
 * @param {number} [page=1] - Page number (0-based)
 * @param {number} [limit=10] - Number of items per page
 * @returns {Promise<IApiResponse<IPaginationResponse<Doctor>>>} API response with paginated doctor data
 * @throws {Error} When validation fails or API request fails
 */
export async function fetchDoctors(
  page: number = 1,
  limit: number = 10
): Promise<IApiResponse<IPaginationResponse<Doctor>>> {
  try {
    console.log(`${EMOJI.OPERATION.FETCH} Fetching doctors (page ${page}, limit ${limit})...`);
    
    /* ===== Validate Pagination ===== */
    const validateParams = z.object({
      page: z.number().min(0),
      limit: z.number().min(1)
    }).safeParse({ page, limit });
    
    if (!validateParams.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validateParams.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Fetch Doctors ===== */
    const response = await doctorService.fetchAll(validateParams.data);
    
    // Validate response structure
    if (!response || !response.data || !Array.isArray(response.data.items)) {
      const errorMsg = `${EMOJI.ERROR} Invalid response structure from API`;
      console.error(errorMsg, { response });
      throw new Error(errorMsg);
    }
    
    console.log(`${EMOJI.SUCCESS} Fetched ${response.data.items.length} doctors (page ${page} of ${response.data.totalPages})`);
    return response;
    
  } catch (error) {
    let errorMsg = `${EMOJI.ERROR} Failed to fetch doctors: `;
    
    if (error instanceof z.ZodError) {
      errorMsg += `${error.errors.map(e => e.message).join(', ')}`;
    } else if (error instanceof Error) {
      errorMsg += error.message;
      console.error('Error details:', error.cause || error);
    } else {
      errorMsg += 'Unknown error';
      console.error('Raw error:', error);
    }
    
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}