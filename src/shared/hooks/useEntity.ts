'use client'

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { ApiResponse, PaginatedResponse } from '@/shared/lib/types';

export function createEntityHook<
  T extends z.ZodTypeAny,
  CreateInput extends z.ZodTypeAny,
  UpdateInput extends z.ZodTypeAny
>(schemas: {
  entity: T;
  create: CreateInput;
  update: UpdateInput;
}, actions: {
  fetch: (page: number, size: number) => Promise<ApiResponse<PaginatedResponse<z.infer<T>>>>;
  create: (data: z.infer<CreateInput>) => Promise<ApiResponse<z.infer<T>>>;
  update: (id: string, data: z.infer<UpdateInput>) => Promise<ApiResponse<z.infer<T>>>;
  delete: (id: string) => Promise<ApiResponse<{ deleted: boolean }>>;
}) {
  return function useEntity(initialPage = 0, initialSize = 10) {
    const [entities, setEntities] = useState<z.infer<T>[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(initialPage);
    const [size] = useState(initialSize);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedEntity, setSelectedEntity] = useState<z.infer<T> | null>(null);
    const [entityToDelete, setEntityToDelete] = useState<z.infer<T> | null>(null);

    const loadEntities = useCallback(async () => {
      try {
        setIsLoading(true);
        const response = await actions.fetch(page, size);
        setEntities(response.data.data);
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load entities');
      } finally {
        setIsLoading(false);
      }
    }, [page, size]);

    useEffect(() => {
      loadEntities();
    }, [loadEntities]);

    const handleCreate = useCallback(async (data: z.infer<CreateInput>) => {
      try {
        const validated = schemas.create.parse(data);
        const response = await actions.create(validated);
        setEntities(prev => [...prev, response.data]);
        toast.success('Entity created successfully');
        return { success: true };
      } catch (err) {
        if (err instanceof z.ZodError) {
          const formErrors = err.errors.reduce((acc, e) => ({
            ...acc,
            [e.path[0]]: e.message,
          }), {});
          return { success: false, errors: formErrors };
        }
        toast.error('Failed to create entity');
        return { success: false, errors: { general: 'Failed to create entity' } };
      }
    }, []);

    const handleUpdate = useCallback(async (data: z.infer<UpdateInput>) => {
      if (!selectedEntity) return { success: false, errors: { general: 'No entity selected' } };
      try {
        const validated = schemas.update.parse(data);
        const response = await actions.update(selectedEntity.id, validated);
        setEntities(prev => prev.map(e => e.id === selectedEntity.id ? response.data : e));
        toast.success('Entity updated successfully');
        setSelectedEntity(null);
        return { success: true };
      } catch (err) {
        if (err instanceof z.ZodError) {
          const formErrors = err.errors.reduce((acc, e) => ({
            ...acc,
            [e.path[0]]: e.message,
          }), {});
          return { success: false, errors: formErrors };
        }
        toast.error('Failed to update entity');
        return { success: false, errors: { general: 'Failed to update entity' } };
      }
    }, [selectedEntity]);

    const handleDelete = useCallback(async (id: string) => {
      try {
        await actions.delete(id);
        setEntities(prev => prev.filter(e => e.id !== id));
        toast.success('Entity deleted successfully');
        return { success: true };
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to delete entity');
        return { success: false };
      }
    }, []);

    return {
      entities,
      isLoading,
      error,
      page,
      size,
      totalPages,
      selectedEntity,
      entityToDelete,
      setPage,
      setSelectedEntity,
      setEntityToDelete,
      loadEntities,
      handleCreate,
      handleUpdate,
      handleDelete,
    };
  };
}