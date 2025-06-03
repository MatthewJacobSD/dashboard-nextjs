'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import {
  Visit,
  createVisitSchema,
  updateVisitSchema,
} from '@/shared/lib/zod/visit'; // Make sure this path matches your project structure
import {
  fetchVisits,
  createVisit,
  updateVisit,
  deleteVisit,
} from '@/app/visits/actions'; // Update this path accordingly
import { useFormSubmit } from '@/shared/hooks/useFormSubmit';

/**
 * Custom hook for managing visit-related CRUD operations.
 * Handles fetching, creating, updating, and deleting visits with pagination and toast notifications.
 *
 * @param initialData - Optional initial list of visits.
 * @param page - Initial page number (default: 0).
 * @param size - Number of visits per page (default: 10).
 * @returns Object containing state and handlers for visit management.
 */
export function useVisits({
  initialData = [],
  page: initialPage = 0,
  size = 10,
}: {
  initialData?: Visit[];
  page?: number;
  size?: number;
}) {
  const [visits, setVisits] = useState<Visit[]>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData.length);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState<Visit | null>(null);
  const [entityToDelete, setEntityToDelete] = useState<Visit | null>(null);

  // Fetch paginated visits
  const loadEntities = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchVisits(page, size);
      setVisits(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load visits';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  // Create a new visit
  const handleCreate = useFormSubmit<z.infer<typeof createVisitSchema>>(
    async (data) => {
      try {
        const validated = createVisitSchema.parse(data);
        const response = await createVisit(validated);
        setVisits((prev) => [...prev, response.data]);
        toast.success('Visit created successfully');
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
        toast.error('Failed to create visit');
        return { success: false, errors: { general: 'Failed to add visit' } };
      }
    }
  );

  // Update an existing visit
  const handleUpdate = useFormSubmit<z.infer<typeof updateVisitSchema>>(
    async (data) => {
      if (!selectedEntity) {
        return { success: false, errors: { general: 'No visit selected' } };
      }
      try {
        const validated = updateVisitSchema.parse(data);
        const response = await updateVisit(selectedEntity.id, validated);
        setVisits((prev) =>
          prev.map((v) => (v.id === selectedEntity.id ? response.data : v))
        );
        setSelectedEntity(null);
        toast.success('Visit updated successfully');
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
        toast.error('Failed to update visit');
        return { success: false, errors: { general: 'Failed to update visit' } };
      }
    }
  );

  // Delete a visit
  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteVisit(id);
      setVisits((prev) => prev.filter((v) => v.id !== id));
      toast.success('Visit deleted');
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete visit';
      toast.error(errorMsg);
      return { success: false, errors: { general: errorMsg } };
    }
  }, []);

  return {
    visits,
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