'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import {
  Insurance,
  createInsuranceSchema,
  updateInsuranceSchema,
} from '@/shared/lib/zod/insurance'; // Make sure this path is correct
import {
  fetchInsurances,
  createInsurance,
  updateInsurance,
  deleteInsurance,
} from '@/app/insurances/actions'; // Make sure this path is correct
import { useFormSubmit } from '@/shared/hooks/useFormSubmit';

/**
 * Custom hook for managing insurance-related CRUD operations.
 * Handles fetching, creating, updating, and deleting insurances with pagination and toast notifications.
 *
 * @param initialData - Optional initial list of insurances.
 * @param page - Initial page number (default: 0).
 * @param size - Number of insurances per page (default: 10).
 * @returns Object containing state and handlers for insurance management.
 */
export function useInsurances({
  initialData = [],
  page: initialPage = 0,
  size = 10,
}: {
  initialData?: Insurance[];
  page?: number;
  size?: number;
}) {
  const [insurances, setInsurances] = useState<Insurance[]>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData.length);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState<Insurance | null>(null);
  const [entityToDelete, setEntityToDelete] = useState<Insurance | null>(null);

  // Fetch paginated insurances
  const loadEntities = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchInsurances(page, size);
      setInsurances(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load insurances';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  // Create a new insurance
  const handleCreate = useFormSubmit<z.infer<typeof createInsuranceSchema>>(
    async (data) => {
      try {
        const validated = createInsuranceSchema.parse(data);
        const response = await createInsurance(validated);
        setInsurances((prev) => [...prev, response.data]);
        toast.success('Insurance created successfully');
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
        toast.error('Failed to create insurance');
        return { success: false, errors: { general: 'Failed to add insurance' } };
      }
    }
  );

  // Update an existing insurance
  const handleUpdate = useFormSubmit<z.infer<typeof updateInsuranceSchema>>(
    async (data) => {
      if (!selectedEntity) {
        return { success: false, errors: { general: 'No insurance selected' } };
      }
      try {
        const validated = updateInsuranceSchema.parse(data);
        const response = await updateInsurance(selectedEntity.id, validated);
        setInsurances((prev) =>
          prev.map((i) => (i.id === selectedEntity.id ? response.data : i))
        );
        setSelectedEntity(null);
        toast.success('Insurance updated successfully');
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
        toast.error('Failed to update insurance');
        return { success: false, errors: { general: 'Failed to update insurance' } };
      }
    }
  );

  // Delete an insurance
  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteInsurance(id);
      setInsurances((prev) => prev.filter((i) => i.id !== id));
      toast.success('Insurance deleted');
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete insurance';
      toast.error(errorMsg);
      return { success: false, errors: { general: errorMsg } };
    }
  }, []);

  return {
    insurances,
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