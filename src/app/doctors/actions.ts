'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ApiResponse, ExperienceLevel, PaginatedResponse, Specialization } from '@/lib/types';
import { Doctor, DoctorCreateInput, DoctorUpdateInput, createDoctorSchema, updateDoctorSchema } from '@/lib/zod';
import ApiService from '@/utils/api';

// Initialize ApiService for doctors
const doctorService = new ApiService<Doctor, DoctorCreateInput, DoctorUpdateInput>('doctors');

// 🏗️ FormData → Doctor shape (for creation)
const createFormDoctor = (formData: FormData): DoctorCreateInput => {
  return {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    address: formData.get('address') as string,
    email: formData.get('email') as string,
    specialization: formData.get('specialization') as Specialization[keyof Specialization],
    experience: formData.get('experience') as ExperienceLevel[keyof ExperienceLevel],
  };
};

// ➕ Create doctor | validates → API call → revalidates
export async function createDoctor(
  data: DoctorCreateInput | FormData
): Promise<ApiResponse<Doctor>> {
  try {
    const doctorInput = data instanceof FormData 
      ? createFormDoctor(data) 
      : data;
    const validated = createDoctorSchema.parse(doctorInput);
    const response = await doctorService.create(validated);
    revalidatePath('/doctors');
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
      throw new Error(`Invalid data: ${error.errors.map(e => e.message).join(', ')}`);
    }
    console.error('Create doctor error:', error);
    throw new Error('Failed to update doctor');
  }
}

// 🔄 FormData → Update shape
const updateFormDoctor = (formData: FormData): Omit<DoctorUpdateInput, 'id'> => {
  return {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    address: formData.get('address') as string,
    email: formData.get('email') as string,
    specialization: formData.get('specialization') as Specialization[keyof Specialization],
    experience: formData.get('experience') as ExperienceLevel[keyof ExperienceLevel],
  };
};

// ✏️ Update doctor | checks ID → validates → updates
export async function updateDoctor(
  id: string,
  data: DoctorUpdateInput | FormData
): Promise<ApiResponse<Doctor>> {
  try {
    const doctorInput = data instanceof FormData 
      ? updateFormDoctor(data) 
      : data;
    const validated = updateDoctorSchema.parse({ id, ...doctorInput });
    
    if (!id) {
      throw new Error('Doctor ID is required');
    }
    
    // Remove id from the payload before sending to the server
    const { id: _, ...payload } = validated;
    const response = await doctorService.update(id, payload);
    revalidatePath('/doctors');
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
      throw new Error(`Invalid data: ${error.errors.map(e => e.message).join(', ')}`);
    }
    console.error('Update doctor error:', error);
    throw new Error('Failed to update doctor');
  }
}

// 🗑️ Delete doctor | validates ID → deletes → refreshes
export async function deleteDoctor(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    const validatedId = z.string({ required_error: 'ID is required' }).parse(id);
    const response = await doctorService.delete(validatedId);
    revalidatePath('/doctors');
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
      throw new Error('Invalid doctor ID');
    }
    console.error('Delete doctor error:', error);
    throw new Error('Failed to delete doctor');
  }
}

// 📜 Get doctors | pagination → fetches → returns
export async function fetchDoctors(page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<Doctor>>> {
  try {
    const validatedParams = z.object({
      page: z.number().min(0, 'Page must be non-negative'),
      size: z.number().min(1, 'Size must be at least 1'),
    }).parse({ page, size });
    const response = await doctorService.fetchAll(validatedParams);
    revalidatePath('/doctors');
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
      throw new Error('Invalid pagination parameters');
    }
    console.error('Fetch doctors error:', error);
    throw new Error('Failed to fetch doctors');
  }
}