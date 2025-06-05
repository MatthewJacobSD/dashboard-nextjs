'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { IApiResponse, IPaginationResponse } from '@/shared/lib/types';
import { Medication, CreateMedication, UpdateMedication, createMedicationSchema, updateMedicationSchema } from '@/shared/lib/zod/medication';
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

/* ===== Medication Service Instance ===== */
const medicationService = new ApiService<Medication, CreateMedication, UpdateMedication>('/medications');

/**
 * Creates a new medication record after validating input data
 * @param {CreateMedication | FormData} data - Medication creation data (can be FormData or plain object)
 * @returns {Promise<IApiResponse<Medication>>} API response with created medication data
 * @throws {Error} When validation fails or API request fails
 */
export async function createMedication(data: CreateMedication | FormData): Promise<IApiResponse<Medication>> {
  try {
    console.log(`${EMOJI.OPERATION.CREATE} Creating new medication...`);
    
    /* ===== Parse and Validate Data ===== */
    const parsedData = data instanceof FormData ? Object.fromEntries(data) : data;
    const validated = createMedicationSchema.safeParse(parsedData);
    
    if (!validated.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validated.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Create Medication ===== */
    const response = await medicationService.create(validated.data);
    revalidatePath('/medications');
    
    console.log(`${EMOJI.SUCCESS} Medication created successfully! ID: ${response.data.id}`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to create medication: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Updates an existing medication record
 * @param {string} id - ID of the medication to update
 * @param {UpdateMedication | FormData} data - Update data (can be FormData or plain object)
 * @returns {Promise<IApiResponse<Medication>>} API response with updated medication data
 * @throws {Error} When validation fails or API request fails
 */
export async function updateMedication(id: string, data: UpdateMedication | FormData): Promise<IApiResponse<Medication>> {
  try {
    console.log(`${EMOJI.OPERATION.UPDATE} Updating medication ${id}...`);
    
    /* ===== Parse and Validate Data ===== */
    const parsedData = data instanceof FormData ? Object.fromEntries(data) : data;
    const validated = updateMedicationSchema.safeParse(parsedData);
    
    if (!validated.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validated.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Update Medication ===== */
    const response = await medicationService.update(id, validated.data);
    revalidatePath('/medications');
    revalidatePath(`/medication/${id}`);
    
    console.log(`${EMOJI.SUCCESS} Medication ${id} updated successfully!`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to update medication ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Deletes a medication record
 * @param {string} id - ID of the medication to delete
 * @returns {Promise<IApiResponse<{ deleted: boolean }>>} API response with deletion status
 * @throws {Error} When validation fails or API request fails
 */
export async function deleteMedication(id: string): Promise<IApiResponse<{ deleted: boolean }>> {
  try {
    console.log(`${EMOJI.OPERATION.DELETE} Deleting medication ${id}...`);
    
    /* ===== Validate ID ===== */
    const validateId = z.string().min(1).safeParse(id);
    if (!validateId.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validateId.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Delete Medication ===== */
    const response = await medicationService.delete(validateId.data);
    revalidatePath('/medications');
    revalidatePath(`/medication/${id}`);
    
    console.log(`${EMOJI.SUCCESS} Medication ${id} deleted successfully!`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to delete medication ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Retrieves a single medication record by ID
 * @param {string} id - ID of the medication to fetch
 * @returns {Promise<IApiResponse<Medication>>} API response with medication data
 * @throws {Error} When validation fails or API request fails
 */
export async function getMedication(id: string): Promise<IApiResponse<Medication>> {
  try {
    console.log(`${EMOJI.OPERATION.GET} Fetching medication ${id}...`);
    
    /* ===== Validate ID ===== */
    const validateId = z.string().min(1).safeParse(id);
    if (!validateId.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validateId.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Fetch Medication ===== */
    const response = await medicationService.fetchById(validateId.data);
    
    console.log(`${EMOJI.SUCCESS} Successfully fetched medication ${id}`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to get medication ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Fetches paginated list of medications
 * @param {number} [page=1] - Page number (1-based)
 * @param {number} [limit=10] - Number of items per page
 * @returns {Promise<IApiResponse<IPaginationResponse<Medication>>>} API response with paginated medication data
 * @throws {Error} When validation fails or API request fails
 */
export async function fetchMedications(
  page: number = 1,
  limit: number = 10
): Promise<IApiResponse<IPaginationResponse<Medication>>> {
  try {
    console.log(`${EMOJI.OPERATION.FETCH} Fetching medications (page ${page}, limit ${limit})...`);
    
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

    /* ===== Fetch Medications ===== */
    const response = await medicationService.fetchAll(validateParams.data);
    
    console.log(`${EMOJI.SUCCESS} Fetched ${response.data.items.length} medications (page ${page} of ${response.data.totalPages})`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to fetch medications: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}