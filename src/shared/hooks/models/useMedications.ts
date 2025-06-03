'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import {
  Medication,
  createMedicationSchema,
  updateMedicationSchema,
} from '@/shared/lib/zod/medication'; // Make sure this path matches your project structure
import {
  fetchMedications,
  createMedication,
  updateMedication,
  deleteMedication,
} from '@/app/medications/actions'; // Update this path accordingly
import { useFormSubmit } from '@/shared/hooks/useFormSubmit';

/**
 * Custom hook for managing medication-related CRUD operations.
 * Handles fetching, creating, updating, and deleting medications with pagination and toast notifications.
 *
 * @param initialData - Optional initial list of medications.
 * @param page - Initial page number (default: 0).
 * @param size - Number of medications per page (default: 10).
 * @returns Object containing state and handlers for medication management.
 */
export function useMedications({
  initialData = [],
  page: initialPage = 0,
  size = 10,
}: {
  initialData?: Medication[];
  page?: number;
  size?: number;
}) {
  const [medications, setMedications] = useState<Medication[]>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData.length);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState<Medication | null>(null);
  const [entityToDelete, setEntityToDelete] = useState<Medication | null>(null);

  // Fetch paginated medications
  const loadEntities = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchMedications(page, size);
      setMedications(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load medications';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  // Create a new medication
  const handleCreate = useFormSubmit<z.infer<typeof createMedicationSchema>>(
    async (data) => {
      try {
        const validated = createMedicationSchema.parse(data);
        const response = await createMedication(validated);
        setMedications((prev) => [...prev, response.data]);
        toast.success('Medication created successfully');
        return { success: true };
      } catch (err) {
        if (err instanceof z.ZodError) {
          return {
            success: false,
            errors: err.errors.reduce(
              (acc, e) => ({ ...acc, [e.path[0]]: e.message }),
              {}
            ),
          };
        }
        toast.error('Failed to create medication');
        return { success: false, errors: { general: 'Failed to add medication' } };
      }
    }
  );

  // Update an existing medication
  const handleUpdate = useFormSubmit<z.infer<typeof updateMedicationSchema>>(
    async (data) => {
      if (!selectedEntity) {
        return { success: false, errors: { general: 'No medication selected' } };
      }
      try {
        const validated = updateMedicationSchema.parse(data);
        const response = await updateMedication(selectedEntity.id, validated);
        setMedications((prev) =>
          prev.map((m) => (m.id === selectedEntity.id ? response.data : m))
        );
        setSelectedEntity(null);
        toast.success('Medication updated successfully');
        return { success: true };
      } catch (err) {
        if (err instanceof z.ZodError) {
          return {
            success: false,
            errors: err.errors.reduce(
              (acc, e) => ({ ...acc, [e.path[0]]: e.message }),
              {}
            ),
          };
        }
        toast.error('Failed to update medication');
        return { success: false, errors: { general: 'Failed to update medication' } };
      }
    }
  );

  // Delete a medication
  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteMedication(id);
      setMedications((prev) => prev.filter((m) => m.id !== id));
      toast.success('Medication deleted');
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete medication';
      toast.error(errorMsg);
      return { success: false, errors: { general: errorMsg } };
    }
  }, []);

  return {
    medications,
    isLoading,
    error,
    page,
    setPage,
    totalPages,
    selectedEntity,
    entityToDelete,
    setSelectedEntity,
    setEntityToDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}