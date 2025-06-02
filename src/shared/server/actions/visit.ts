'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import ApiService from '@/shared/lib/api';
import { createCrudActions } from '../crudActions';
import { 
  Visit, 
  VisitCreateInput, 
  VisitUpdateInput, 
  createVisitSchema, 
  updateVisitSchema, 
  compositeKey 
} from '@/shared/lib/zod';
import { ApiResponse } from '@/shared/lib/types';

const createFormVisit = (formData: FormData): VisitCreateInput => {
  return {
    symptoms: formData.get('symptoms')?.toString() ?? '',
    diagnosis: formData.get('diagnosis')?.toString() ?? '',
    patientId: formData.get('patientId')?.toString() ?? '',
    doctorId: formData.get('doctorId')?.toString() ?? '',
    visitDate: formData.get('visitDate')?.toString() ?? '',
  };
};

const updateFormVisit = (formData: FormData): Omit<VisitUpdateInput, 'id'> => {
  return {
    symptoms: formData.get('symptoms')?.toString(),
    diagnosis: formData.get('diagnosis')?.toString(),
  };
};

async function getVisit(id: z.infer<typeof compositeKey>): Promise<ApiResponse<Visit>> {
  try {
    const validatedId = compositeKey.parse(id);
    const response = await visitService.get(validatedId);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors for Visit ID:', error.errors);
      throw new Error(`Invalid visit ID: ${error.errors.map(e => e.message).join(', ')}`);
    }
    console.error('Get Visit error:', error);
    throw new Error('Failed to fetch visit');
  }
}

async function updateVisit(
  id: z.infer<typeof compositeKey>, 
  data: VisitUpdateInput | FormData
): Promise<ApiResponse<Visit>> {
  try {
    const visitInput = data instanceof FormData ? updateFormVisit(data) : data;
    const validated = updateVisitSchema.parse({ id, ...visitInput });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...payload } = validated;
    const response = await visitService.update(validated.id, payload);
    revalidatePath('/visits');
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors for Visits:', error.errors);
      throw new Error(`Invalid data: ${error.errors.map(e => e.message).join(', ')}`);
    }
    console.error('Update Visit error:', error);
    throw new Error('Failed to update visit');
  }
}

async function deleteVisit(id: z.infer<typeof compositeKey>): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    const validatedId = compositeKey.parse(id);
    const response = await visitService.delete(validatedId);
    revalidatePath('/visits');
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors for Visits:', error.errors);
      throw new Error(`Invalid visit ID: ${error.errors.map(e => e.message).join(', ')}`);
    }
    console.error('Delete Visit error:', error);
    throw new Error('Failed to delete visit');
  }
}

const visitService = new ApiService<Visit, VisitCreateInput, VisitUpdateInput>('visits');
export const { create: createVisit, fetch: fetchVisits } = createCrudActions(
  'Visits',
  visitService,
  createVisitSchema,
  updateVisitSchema,
  createFormVisit,
  updateFormVisit
);

export { getVisit, updateVisit, deleteVisit };