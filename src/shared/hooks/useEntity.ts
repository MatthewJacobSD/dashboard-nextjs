'use client'

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { ApiResponse, PaginatedResponse } from '@/shared/lib/types';

// This is a generic factory hook for creating custom hooks for any entity (like Doctor, Patient, etc.)
export function createEntityHook<
  T extends z.ZodTypeAny,         // Type schema for the full entity
  CreateInput extends z.ZodTypeAny, // Schema for create form data
  UpdateInput extends z.ZodTypeAny  // Schema for update form data
>(schemas: {
  // Zod schemas for validation
  entity: T;
  create: CreateInput;
  update: UpdateInput;
}, actions: {
  // API functions for CRUD operations
  fetch: (page: number, size: number) => Promise<ApiResponse<PaginatedResponse<z.infer<T>>>>;
  create: (data: z.infer<CreateInput>) => Promise<ApiResponse<z.infer<T>>>;
  update: (id: string, data: z.infer<UpdateInput>) => Promise<ApiResponse<z.infer<T>>>;
  delete: (id: string) => Promise<ApiResponse<{ deleted: boolean }>>;
}) {

  // Returns a reusable hook for a specific entity type
  return function useEntity(initialPage = 0, initialSize = 10) {
    // State for managing entities and UI state
    const [entities, setEntities] = useState<z.infer<T>[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(initialPage);
    const [size] = useState(initialSize); // page size doesn't change after mount
    const [totalPages, setTotalPages] = useState(0);
    const [selectedEntity, setSelectedEntity] = useState<z.infer<T> | null>(null);
    const [entityToDelete, setEntityToDelete] = useState<z.infer<T> | null>(null);

    // Load paginated list of entities from server
    const loadEntities = useCallback(async () => {
      try {
        setIsLoading(true);
        const response = await actions.fetch(page, size);
        setEntities(response.data.content);
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load entities');
      } finally {
        setIsLoading(false);
      }
    }, [page, size]);

    // Fetch data when hook initializes or loadEntities changes
    useEffect(() => {
      loadEntities();
    }, [loadEntities]);

    // Handle creating a new entity
    const handleCreate = useCallback(async (data: z.infer<CreateInput>) => {
      try {
        const validated = schemas.create.parse(data); // validate input
        const response = await actions.create(validated); // call create action
        setEntities(prev => [...prev, response.data]); // add to list
        toast.success('Entity created successfully');
        return { success: true };
      } catch (err) {
        if (err instanceof z.ZodError) {
          // Return validation errors for form display
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

    // Handle updating an existing entity
    const handleUpdate = useCallback(async (data: z.infer<UpdateInput>) => {
      if (!selectedEntity) return { success: false, errors: { general: 'No entity selected' } };
      try {
        const validated = schemas.update.parse(data); // validate input
        const response = await actions.update(selectedEntity.id, validated); // send update
        setEntities(prev => prev.map(e => e.id === selectedEntity.id ? response.data : e)); // replace old data
        toast.success('Entity updated successfully');
        setSelectedEntity(null); // close modal
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

    // Handle deleting an entity
    const handleDelete = useCallback(async (id: string) => {
      try {
        await actions.delete(id); // call delete action
        setEntities(prev => prev.filter(e => e.id !== id)); // remove from list
        toast.success('Entity deleted successfully');
        return { success: true };
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to delete entity');
        return { success: false };
      }
    }, []);

    // Return all useful values and handlers so components can use them
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