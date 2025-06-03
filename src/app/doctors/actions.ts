'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ApiResponse, Experience, PaginatedResponse, Specialization } from '@/shared/lib/types';
import {
  Doctor,
  DoctorCreateInput,
  DoctorUpdateInput,
  createDoctorSchema,
  updateDoctorSchema
} from '@/shared/lib/zod/doctor';
import ApiService from '@/shared/lib/ApiService';

const doctorService = new ApiService<Doctor, DoctorCreateInput, DoctorUpdateInput>('doctors');

export async function createDoctor(
  data: DoctorCreateInput | FormData
): Promise<ApiResponse<Doctor>> {
  try {
    const doctorInput = data instanceof FormData ? {
      firstName: data.get('firstName')?.toString() ?? '',
      lastName: data.get('lastName')?.toString() ?? '',
      address: data.get('address')?.toString() ?? '',
      email: data.get('email')?.toString() ?? '',
      specialization: data.get('specialization') as Specialization ?? Specialization.General,
      experience: data.get('experience') as Experience ?? Experience.Junior,
    } : data;

    const validated = createDoctorSchema.parse(doctorInput);
    const response = await doctorService.create(validated);
    revalidatePath('/doctors');
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw new Error('Failed to create doctor');
  }
}

export async function updateDoctor(
  id: string,
  data: DoctorUpdateInput | FormData
): Promise<ApiResponse<Doctor>> {
  try {
    const doctorInput = data instanceof FormData ? {
      firstName: data.get('firstName')?.toString(),
      lastName: data.get('lastName')?.toString(),
      address: data.get('address')?.toString(),
      email: data.get('email')?.toString(),
      specialization: data.get('specialization') as Specialization ?? Specialization.General,
      experience: data.get('experience') as Experience ?? Experience.Junior,
    } : data;

    const validated = updateDoctorSchema.parse({ id, ...doctorInput });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...payload } = validated;
    const response = await doctorService.update(id, payload);
    revalidatePath('/doctors');
    revalidatePath(`/doctors/${id}`);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw new Error('Failed to update doctor');
  }
}

export async function deleteDoctor(
  id: string
): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    const validatedId = z.string().parse(id);
    const response = await doctorService.delete(validatedId);
    revalidatePath('/doctors');
    return response;
  } catch (error) {
    throw new Error('Failed to delete doctor', error instanceof Error ? error : undefined);
  }
}

export async function fetchDoctors(
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PaginatedResponse<Doctor>>> {
  try {
    const response = await doctorService.fetchAll({ page, limit: size });
    return response;
  } catch (error) {
    throw new Error('Failed to fetch doctors', error instanceof Error ? error : undefined);
  }
}

export async function getDoctor(
  id: string
): Promise<ApiResponse<Doctor>> {
  try {
    const response = await doctorService.get(id);
    return response;
  } catch (error) {
    throw new Error('Failed to fetch doctor', error instanceof Error ? error : undefined);
  }
}