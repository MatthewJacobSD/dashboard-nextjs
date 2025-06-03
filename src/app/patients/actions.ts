'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ApiResponse, PaginatedResponse } from '@/shared/lib/types';
import {
  Patient,
  PatientCreateInput,
  PatientUpdateInput,
  createPatientSchema,
  updatePatientSchema
} from '@/shared/lib/zod/patient';
import ApiService from '@/shared/lib/ApiService';

const patientService = new ApiService<Patient, PatientCreateInput, PatientUpdateInput>('patients');

export async function createPatient(
  data: PatientCreateInput | FormData
): Promise<ApiResponse<Patient>> {
  try {
    const patientInput = data instanceof FormData ? {
      firstName: data.get('firstName')?.toString() ?? '',
      lastName: data.get('lastName')?.toString() ?? '',
      address: data.get('address')?.toString() ?? '',
      email: data.get('email')?.toString() ?? '',
      postcode: data.get('postcode')?.toString() ?? '',
      phoneNumber: data.get('phoneNumber')?.toString() ?? '',
      isInsured: data.get('isInsured') === 'on',
      insuranceId: data.get('insuranceId')?.toString(),
    } : data;

    const validated = createPatientSchema.parse(patientInput);
    const response = await patientService.create(validated);
    revalidatePath('/patients');
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw new Error('Failed to create patient');
  }
}

export async function updatePatient(
  id: string,
  data: PatientUpdateInput | FormData
): Promise<ApiResponse<Patient>> {
  try {
    const patientInput = data instanceof FormData ? {
      firstName: data.get('firstName')?.toString(),
      lastName: data.get('lastName')?.toString(),
      address: data.get('address')?.toString(),
      email: data.get('email')?.toString(),
      postcode: data.get('postcode')?.toString(),
      phoneNumber: data.get('phoneNumber')?.toString(),
      isInsured: data.get('isInsured') === 'on',
      insuranceId: data.get('insuranceId')?.toString(),
    } : data;

    const validated = updatePatientSchema.parse({ id, ...patientInput });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...payload } = validated;
    const response = await patientService.update(id, payload);
    revalidatePath('/patients');
    revalidatePath(`/patients/${id}`);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw new Error('Failed to update patient');
  }
}

export async function deletePatient(
  id: string
): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    const validatedId = z.string().parse(id);
    const response = await patientService.delete(validatedId);
    revalidatePath('/patients');
    return response;
  } catch (error) {
    throw new Error('Failed to delete patient', error instanceof Error ? error : undefined);
  }
}

export async function fetchPatients(
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PaginatedResponse<Patient>>> {
  try {
    const response = await patientService.fetchAll({ page, limit: size });
    return response;
  } catch (error) {
    throw new Error('Failed to fetch patients', error instanceof Error ? error : undefined);
  }
}

export async function getPatient(
  id: string
): Promise<ApiResponse<Patient>> {
  try {
    const response = await patientService.get(id);
    return response;
  } catch (error) {
    throw new Error('Failed to fetch patient', error instanceof Error ? error : undefined);
  }
}