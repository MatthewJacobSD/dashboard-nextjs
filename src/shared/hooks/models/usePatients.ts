'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  Patient,
  createPatientSchema,
  updatePatientSchema,
  PatientCreateInput,
  PatientUpdateInput,
} from '@/shared/lib/zod/patient';
import {
  fetchPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from '@/app/patients/actions';
import { useFormSubmit } from '@/shared/hooks/useFormSubmit';

/**
 * Custom hook for managing patient-related CRUD operations.
 * Handles fetching, creating, updating, and deleting patients with pagination and toast notifications.
 *
 * @param initialData - Optional initial list of patients.
 * @param page - Initial page number (default: 0).
 * @param size - Number of patients per page (default: 10).
 * @returns Object containing state and handlers for patient management.
 */
export function usePatients({
  initialData = [],
  page: initialPage = 0,
  size: initialSize = 10,
}: {
  initialData?: Patient[];
  page?: number;
  size?: number;
}) {
  const [patients, setPatients] = useState<Patient[]>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData.length);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState(initialSize);
  const [selectedEntity, setSelectedEntity] = useState<Patient | null>(null);

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

  // Fetch paginated patients
  const loadEntities = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchPatients(page, size);
      setPatients(response.data.content);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load patients';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  // Create a new patient - wrapped with useFormSubmit
  const handleCreate = useFormSubmit<PatientCreateInput>(async (data) => {
    const validated = createPatientSchema.parse(data);
    const response = await createPatient(validated);
    setPatients((prev) => [...prev, response.data]);
    toast.success('Patient created successfully');
    return { success: true };
  });

  // Update an existing patient - wrapped with useFormSubmit
  const handleUpdate = useFormSubmit<PatientUpdateInput>(async (data) => {
    if (!selectedEntity && data.id !== selectedEntity) {
      return { success: false, errors: { general: 'No patient selected' } };
    }
    const validated = updatePatientSchema.parse(data);
    const response = await updatePatient(selectedEntity.id, validated);
    setPatients((prev) =>
      prev.map((p) => (p.id === selectedEntity.id ? response.data : p))
    );
    setSelectedEntity(null);
    toast.success('Patient updated successfully');
    return { success: true };
  });

  // Delete a patient
  const handleDelete = useCallback(async (id: string) => {
    try {
      await deletePatient(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
      toast.success('Patient deleted');
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete patient';
      toast.error(errorMsg);
      return { success: false, errors: { general: errorMsg } };
    }
  }, []);

  return {
    patients,
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