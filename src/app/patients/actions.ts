'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { IApiResponse, IPaginationResponse } from '@/shared/lib/types';
import { Patient, CreatePatient, UpdatePatient, createPatientSchema, updatePatientSchema } from '@/shared/lib/zod/patient';
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

/* ===== Patient Service Instance ===== */
const patientService = new ApiService<Patient, CreatePatient, UpdatePatient>('/patients');

/**
 * Creates a new patient record after validating input data
 * @param {CreatePatient | FormData} data - Patient creation data (can be FormData or plain object)
 * @returns {Promise<IApiResponse<Patient>>} API response with created patient data
 * @throws {Error} When validation fails or API request fails
 */
export async function createPatient(data: CreatePatient | FormData): Promise<IApiResponse<Patient>> {
  try {
    console.log(`${EMOJI.OPERATION.CREATE} Creating new patient...`);
    
    /* ===== Parse and Validate Data ===== */
    const parsedData = data instanceof FormData ? Object.fromEntries(data) : data;
    const validated = createPatientSchema.safeParse(parsedData);
    
    if (!validated.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validated.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Create Patient ===== */
    const response = await patientService.create(validated.data);
    revalidatePath('/patients');
    
    console.log(`${EMOJI.SUCCESS} Patient created successfully! ID: ${response.data.id}`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to create patient: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Updates an existing patient record
 * @param {string} id - ID of the patient to update
 * @param {UpdatePatient | FormData} data - Update data (can be FormData or plain object)
 * @returns {Promise<IApiResponse<Patient>>} API response with updated patient data
 * @throws {Error} When validation fails or API request fails
 */
export async function updatePatient(id: string, data: UpdatePatient | FormData): Promise<IApiResponse<Patient>> {
  try {
    console.log(`${EMOJI.OPERATION.UPDATE} Updating patient ${id}...`);
    
    /* ===== Parse and Validate Data ===== */
    const parsedData = data instanceof FormData ? Object.fromEntries(data) : data;
    const validated = updatePatientSchema.safeParse(parsedData);
    
    if (!validated.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validated.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Update Patient ===== */
    const response = await patientService.update(id, validated.data);
    revalidatePath('/patients');
    revalidatePath(`/patient/${id}`);
    
    console.log(`${EMOJI.SUCCESS} Patient ${id} updated successfully!`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to update patient ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Deletes a patient record
 * @param {string} id - ID of the patient to delete
 * @returns {Promise<IApiResponse<{ deleted: boolean }>>} API response with deletion status
 * @throws {Error} When validation fails or API request fails
 */
export async function deletePatient(id: string): Promise<IApiResponse<{ deleted: boolean }>> {
  try {
    console.log(`${EMOJI.OPERATION.DELETE} Deleting patient ${id}...`);
    
    /* ===== Validate ID ===== */
    const validateId = z.string().min(1).safeParse(id);
    if (!validateId.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validateId.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Delete Patient ===== */
    const response = await patientService.delete(validateId.data);
    revalidatePath('/patients');
    revalidatePath(`/patient/${id}`);
    
    console.log(`${EMOJI.SUCCESS} Patient ${id} deleted successfully!`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to delete patient ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Retrieves a single patient record by ID
 * @param {string} id - ID of the patient to fetch
 * @returns {Promise<IApiResponse<Patient>>} API response with patient data
 * @throws {Error} When validation fails or API request fails
 */
export async function getPatient(id: string): Promise<IApiResponse<Patient>> {
  try {
    console.log(`${EMOJI.OPERATION.GET} Fetching patient ${id}...`);
    
    /* ===== Validate ID ===== */
    const validateId = z.string().min(1).safeParse(id);
    if (!validateId.success) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${validateId.error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    /* ===== Fetch Patient ===== */
    const response = await patientService.fetchById(validateId.data);
    
    console.log(`${EMOJI.SUCCESS} Successfully fetched patient ${id}`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to get patient ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Fetches paginated list of patients
 * @param {number} [page=1] - Page number (1-based)
 * @param {number} [limit=10] - Number of items per page
 * @returns {Promise<IApiResponse<IPaginationResponse<Patient>>>} API response with paginated patient data
 * @throws {Error} When validation fails or API request fails
 */
export async function fetchPatients(
  page: number = 1,
  limit: number = 10
): Promise<IApiResponse<IPaginationResponse<Patient>>> {
  try {
    console.log(`${EMOJI.OPERATION.FETCH} Fetching patients (page ${page}, limit ${limit})...`);
    
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

    /* ===== Fetch Patients ===== */
    const response = await patientService.fetchAll(validateParams.data);
    
    console.log(`${EMOJI.SUCCESS} Fetched ${response.data.items.length} patients (page ${page} of ${response.data.totalPages})`);
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = `${EMOJI.ERROR} Validation failed: ${error.errors.map(e => e.message).join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMsg = `${EMOJI.ERROR} Failed to fetch patients: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}