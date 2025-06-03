'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  Doctor,
  createDoctorSchema,
  updateDoctorSchema,
  DoctorCreateInput,
  DoctorUpdateInput,
} from '@/shared/lib/zod/doctor';
import {
  fetchDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from '@/app/doctors/actions';
import { useFormSubmit } from '@/shared/hooks/useFormSubmit';

export function useDoctors({
  initialData = [],
  page: initialPage = 0,
  size: initialSize = 10,
}: {
  initialData?: Doctor[];
  page?: number;
  size?: number;
}) {
  const [doctors, setDoctors] = useState<Doctor[]>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData.length);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState(initialSize);
  const [selectedEntity, setSelectedEntity] = useState<Doctor | null>(null);

  // Adjust size based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setSize(width < 640 ? 5 : width < 1024 ? 10 : 15);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch paginated doctors
  const loadEntities = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchDoctors(page, size);
      setDoctors(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load doctors';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  // Create a new doctor
  const handleCreate = useFormSubmit<DoctorCreateInput>(async (data) => {
    const validated = createDoctorSchema.parse(data);
    const response = await createDoctor(validated);
    setDoctors((prev) => [...prev, response.data]);
    return { success: true };
  });

  // Update an existing doctor
  const handleUpdate = useFormSubmit<DoctorUpdateInput>(async (data) => {
    if (!selectedEntity) {
      return { success: false, errors: { general: 'No doctor selected' } };
    }
    const validated = updateDoctorSchema.parse(data);
    const response = await updateDoctor(selectedEntity.id, validated);
    setDoctors((prev) =>
      prev.map((d) => (d.id === selectedEntity.id ? response.data : d))
    );
    setSelectedEntity(null);
    return { success: true };
  });

  // Delete a doctor
  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteDoctor(id);
      setDoctors((prev) => prev.filter((d) => d.id !== id));
      toast.success('Doctor deleted');
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete doctor';
      toast.error(errorMsg);
      return { success: false, errors: { general: errorMsg } };
    }
  }, []);

  return {
    doctors,
    isLoading,
    error,
    page,
    setPage,
    totalPages,
    selectedEntity,
    setSelectedEntity,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}