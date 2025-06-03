'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import {
  Prescription,
  createPrescriptionSchema,
  updatePrescriptionSchema,
} from '@/shared/lib/zod/prescription'; // Make sure this path matches your project structure
import {
  fetchPrescriptions,
  createPrescription,
  updatePrescription,
  deletePrescription,
} from '@/app/prescriptions/actions'; // Update this path accordingly
import { useFormSubmit } from '@/shared/hooks/useFormSubmit';

/**
 * Custom hook for managing prescription-related CRUD operations.
 * Handles fetching, creating, updating, and deleting prescriptions with pagination and toast notifications.
 *
 * @param initialData - Optional initial list of prescriptions.
 * @param page - Initial page number (default: 0).
 * @param size - Number of prescriptions per page (default: 10).
 * @returns Object containing state and handlers for prescription management.
 */
export function usePrescriptions({
  initialData = [],
  page: initialPage = 0,
  size = 10,
}: {
  initialData?: Prescription[];
  page?: number;
  size?: number;
}) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData.length);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState<Prescription | null>(null);
  const [entityToDelete, setEntityToDelete] = useState<Prescription | null>(null);

  // Fetch paginated prescriptions
  const loadEntities = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchPrescriptions(page, size);
      setPrescriptions(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load prescriptions';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  // Create a new prescription
  const handleCreate = useFormSubmit<z.infer<typeof createPrescriptionSchema>>(
    async (data) => {
      try {
        const validated = createPrescriptionSchema.parse(data);
        const response = await createPrescription(validated);
        setPrescriptions((prev) => [...prev, response.data]);
        toast.success('Prescription created successfully');
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
        toast.error('Failed to create prescription');
        return { success: false, errors: { general: 'Failed to add prescription' } };
      }
    }
  );

  // Update an existing prescription
  const handleUpdate = useFormSubmit<z.infer<typeof updatePrescriptionSchema>>(
    async (data) => {
      if (!selectedEntity) {
        return { success: false, errors: { general: 'No prescription selected' } };
      }
      try {
        const validated = updatePrescriptionSchema.parse(data);
        const response = await updatePrescription(selectedEntity.id, validated);
        setPrescriptions((prev) =>
          prev.map((p) => (p.id === selectedEntity.id ? response.data : p))
        );
        setSelectedEntity(null);
        toast.success('Prescription updated successfully');
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
        toast.error('Failed to update prescription');
        return { success: false, errors: { general: 'Failed to update prescription' } };
      }
    }
  );

  // Delete a prescription
  const handleDelete = useCallback(async (id: string) => {
    try {
      await deletePrescription(id);
      setPrescriptions((prev) => prev.filter((p) => p.id !== id));
      toast.success('Prescription deleted');
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete prescription';
      toast.error(errorMsg);
      return { success: false, errors: { general: errorMsg } };
    }
  }, []);

  return {
    prescriptions,
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