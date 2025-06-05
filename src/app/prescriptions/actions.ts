'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { IApiResponse, IPaginationResponse } from '@/shared/lib/types';
import { Prescription, CreatePrescription, UpdatePrescription, createPrescriptionSchema, updatePrescriptionSchema } from '@/shared/lib/zod/prescription';
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

/* ===== Prescription Service Instance ===== */
const prescriptionService = new ApiService<Prescription, CreatePrescription, UpdatePrescription>('/prescriptions');

/**
 * Creates a new prescription record after validating input data
 * @param {CreatePrescription | FormData} data - Prescription creation data (can be FormData or plain object)
 * @returns {Promise<IApiResponse<Prescription>>} API response with created prescription data
 * @throws {Error} When validation fails or API request fails
 */
export async function createPrescription(data: CreatePrescription | FormData): Promise<IApiResponse<Prescription>> {
  try {
    console.log(`${EMOJI.OPERATION.CREATE} Creating new prescription...`);
    
    /* ===== Parse and Validate Data ===== */
    const parsedData = data instanceof FormData ? Object.fromEntries(data) : data;
    const validated = createPrescriptionSchema.safeParse(parsedData);
    
    if (!validated.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validated.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Create Prescription ===== */
    const response = await prescriptionService.create(validated.data);
    revalidatePath('/prescriptions');
    
    console.log(`${EMOJI.SUCCESS} Prescription created successfully! ID: ${response.data.id}`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to create prescription: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Updates an existing prescription record
 * @param {string} id - ID of the prescription to update
 * @param {UpdatePrescription | FormData} data - Update data (can be FormData or plain object)
 * @returns {Promise<IApiResponse<Prescription>>} API response with updated prescription data
 * @throws {Error} When validation fails or API request fails
 */
export async function updatePrescription(id: string, data: UpdatePrescription | FormData): Promise<IApiResponse<Prescription>> {
  try {
    console.log(`${EMOJI.OPERATION.UPDATE} Updating prescription ${id}...`);
    
    /* ===== Parse and Validate Data ===== */
    const parsedData = data instanceof FormData ? Object.fromEntries(data) : data;
    const validated = updatePrescriptionSchema.safeParse(parsedData);
    
    if (!validated.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validated.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Update Prescription ===== */
    const response = await prescriptionService.update(id, validated.data);
    revalidatePath('/prescriptions');
    revalidatePath(`/prescription/${id}`);
    
    console.log(`${EMOJI.SUCCESS} Prescription ${id} updated successfully!`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to update prescription ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Deletes a prescription record
 * @param {string} id - ID of the prescription to delete
 * @returns {Promise<IApiResponse<{ deleted: boolean }>>} API response with deletion status
 * @throws {Error} When validation fails or API request fails
 */
export async function deletePrescription(id: string): Promise<IApiResponse<{ deleted: boolean }>> {
  try {
    console.log(`${EMOJI.OPERATION.DELETE} Deleting prescription ${id}...`);
    
    /* ===== Validate ID ===== */
    const validateId = z.string().min(1).safeParse(id);
    if (!validateId.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validateId.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Delete Prescription ===== */
    const response = await prescriptionService.delete(validateId.data);
    revalidatePath('/prescriptions');
    revalidatePath(`/prescription/${id}`);
    
    console.log(`${EMOJI.SUCCESS} Prescription ${id} deleted successfully!`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to delete prescription ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Retrieves a single prescription record by ID
 * @param {string} id - ID of the prescription to fetch
 * @returns {Promise<IApiResponse<Prescription>>} API response with prescription data
 * @throws {Error} When validation fails or API request fails
 */
export async function getPrescription(id: string): Promise<IApiResponse<Prescription>> {
  try {
    console.log(`${EMOJI.OPERATION.GET} Fetching prescription ${id}...`);
    
    /* ===== Validate ID ===== */
    const validateId = z.string().min(1).safeParse(id);
    if (!validateId.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validateId.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Fetch Prescription ===== */
    const response = await prescriptionService.fetchById(validateId.data);
    
    console.log(`${EMOJI.SUCCESS} Successfully fetched prescription ${id}`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to get prescription ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Fetches paginated list of prescriptions
 * @param {number} [page=1] - Page number (1-based)
 * @param {number} [limit=10] - Number of items per page
 * @returns {Promise<IApiResponse<IPaginationResponse<Prescription>>>} API response with paginated prescription data
 * @throws {Error} When validation fails or API request fails
 */
export async function fetchPrescriptions(
  page: number = 1,
  limit: number = 10
): Promise<IApiResponse<IPaginationResponse<Prescription>>> {
  try {
    console.log(`${EMOJI.OPERATION.FETCH} Fetching prescriptions (page ${page}, limit ${limit})...`);
    
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

    /* ===== Fetch Prescriptions ===== */
    const response = await prescriptionService.fetchAll(validateParams.data);
    
    console.log(`${EMOJI.SUCCESS} Fetched ${response.data.items.length} prescriptions (page ${page} of ${response.data.totalPages})`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to fetch prescriptions: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}