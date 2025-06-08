'use client'

import { cn } from '@/shared/utils/cn';
import { useState, useMemo, useCallback } from 'react';
import { Plus, FileText } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataDisplay, type DataDisplayField } from '@/components/state/DataDisplay';
import { CrudForm, type FieldConfig } from '@/components/form/CrudForm';
import { ViewToggle } from '@/components/state/ViewToggle';
import { SearchFilter } from '@/components/ui/SearchFilter';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorFallback } from '@/components/layout/FallBackError';
import { usePrescriptions } from '@/shared/hooks/usePrescription';
import { Prescription } from '@/shared/lib/zod/prescription';
import { DataDisplayView } from '@/components/state/DataDisplay';
import { CreatePrescription } from '@/shared/lib/zod/prescription';
import { SortComponent } from '@/components/state/Sort';
import { Patient } from '@/shared/lib/zod/patient';
import { Medication } from '@/shared/lib/zod/medication';
import { Doctor } from '@/shared/lib/zod/doctor';
import { fetchDoctors } from '../doctors/actions';
import { fetchMedications } from '../medications/actions';
import { fetchPatients } from '../patients/actions';

export default function PrescriptionsPage() {
  // State management
  const [view, setView] = useState<DataDisplayView>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<Prescription | null>(null);
  const [sort, setSort] = useState<{ key: keyof Prescription; direction: 'asc' | 'desc' } | null>({
    key: 'prescriptionDate',
    direction: 'asc',
  });

  // Custom hook for prescription operations
  const {
    prescriptions,
    isLoading,
    error,
    page,
    size,
    setPage,
    totPages,
    selectedEntity,
    setSelectedEntity,
    createFormAction,
    updateFormAction,
    handleDelete,
    createState,
    updateState,
  } = usePrescriptions({ page: 0, size: 10 });

  // Fetch options for select fields
  const fetchPatientOptions = async () => {
    try {
      const response = await fetchPatients(page, size);
      if (!response.data?.items) return [];
      return response.data.items.map((patient: Patient) => ({
        value: patient.id,
        label: `${patient.firstName} ${patient.lastName}`,
      }));
    } catch (error) {
      console.error('Failed to fetch patient options:', error);
      return [];
    }
  };

  const fetchMedicationOptions = async () => {
    try {
      const response = await fetchMedications(page, size);;
      if (!response.data?.items) return [];
      return response.data.items.map((medication: Medication) => ({
        value: medication.id,
        label: medication.name,
      }));
    } catch (error) {
      console.error('Failed to fetch medication options:', error);
      return [];
    }
  };

  const fetchDoctorOptions = async () => {
    try {
      const response = await fetchDoctors(page, size);;
      if (!response.data?.items) return [];
      return response.data.items.map((doctor: Doctor) => ({
        value: doctor.id,
        label: `${doctor.firstName} ${doctor.lastName}`,
      }));
    } catch (error) {
      console.error('Failed to fetch doctor options:', error);
      return [];
    }
  };

  // Filter and sort prescriptions based on search query
  const filteredAndSortedPrescriptions = useMemo(() => {
    let result = [...prescriptions];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (prescription) =>
          (prescription.comments?.toLowerCase().includes(query) || false) ||
          (prescription.patientId?.toLowerCase().includes(query) || false) ||
          (prescription.medicationId && prescription.medicationId.toLowerCase().includes(query)) ||
          (prescription.doctorId && prescription.doctorId.toLowerCase().includes(query))
      );
    }

    // Apply sorting if specified
    if (sort) {
      result.sort((a, b) => {
        const aValue = a[sort.key] ?? '';
        const bValue = b[sort.key] ?? '';
        return sort.direction === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }

    return result;
  }, [prescriptions, searchQuery, sort]);

  // Form field configurations
  const formFields: FieldConfig<CreatePrescription>[] = [
    {
      name: 'prescriptionDate',
      label: 'Prescription Date',
      type: 'date',
      required: true,
      placeholder: 'Select prescription date',
    },
    {
      name: 'dosage',
      label: 'Dosage (mg)',
      type: 'number',
      required: true,
      placeholder: 'Enter dosage in mg',
    },
    {
      name: 'duration',
      label: 'Duration (days)',
      type: 'number',
      required: true,
      placeholder: 'Enter duration in days',
    },
    {
      name: 'comments',
      label: 'Comments',
      type: 'textarea',
      required: true,
      placeholder: 'Enter additional comments',
    },
    {
      name: 'patientId',
      label: 'Patient',
      type: 'select',
      options: fetchPatientOptions,
      required: true,
    },
    {
      name: 'medicationId',
      label: 'Medication',
      type: 'select',
      options: fetchMedicationOptions,
    },
    {
      name: 'doctorId',
      label: 'Doctor',
      type: 'select',
      options: fetchDoctorOptions,
    },
  ];

  // Data display field configurations
  const displayFields: DataDisplayField<Prescription>[] = [
    {
      key: 'prescriptionDate',
      label: 'Prescription Date',
      render: (value) => (value ? new Date().toLocaleDateString() : 'N/A'),
    },
    { key: 'dosage', label: 'Dosage (mg)' },
    { key: 'duration', label: 'Duration (days)' },
    {
      key: 'comments',
      label: 'Comments',
      render: (value) => <span className="text-gray-600 line-clamp-2">{String(value)}</span>,
    },
    { key: 'patientId', label: 'Patient ID' },
    {
      key: 'medicationId',
      label: 'Medication ID',
      render: (value) => (value ? String(value) : 'N/A'),
    },
    {
      key: 'doctorId',
      label: 'Doctor ID',
      render: (value) => (value ? String(value) : 'N/A'),
    },
  ];

  // Handle sort change
  const handleSortChange = useCallback(
    (newSort: { key: keyof Prescription; direction: 'asc' | 'desc' } | null) => {
      console.log(`Sorting by ${newSort?.key ?? 'none'} (${newSort?.direction ?? 'none'})`);
      setSort((prevSort) => {
        if (
          newSort === null ||
          (prevSort?.key === newSort.key && prevSort?.direction === newSort.direction)
        ) {
          return prevSort ?? null;
        }
        return newSort;
      });
      setSelectedEntity(null);
    },
    [setSelectedEntity]
  );

  // Event handlers
  const handleEdit = useCallback(
    (prescription: Prescription) => {
      setSelectedEntity(prescription);
      setShowEditForm(true);
    },
    [setSelectedEntity]
  );

  const handleDeleteClick = useCallback(
    (prescription: Prescription) => {
      setPrescriptionToDelete(prescription);
      setShowDeleteDialog(true);
    },
    []
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!prescriptionToDelete) return;

    try {
      const result = await handleDelete(prescriptionToDelete.id);
      if (result.success) {
        setShowDeleteDialog(false);
        setPrescriptionToDelete(null);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }, [prescriptionToDelete, handleDelete]);

  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleFormClose = useCallback(() => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setSelectedEntity(null);
  }, [setSelectedEntity]);

  // Error boundary fallback
  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
        <ErrorFallback />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Prescription Management"
        description="Manage patient prescriptions and medication details"
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <ViewToggle view={view} setView={setView} />
          <Button
            onClick={() => setShowCreateForm(true)}
            className={cn(
              'bg-blue-600 text-white hover:bg-blue-700',
              'flex items-center gap-2 px-4 py-2 rounded-md',
              'transition-all duration-200 hover:shadow-lg'
            )}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
            Add Prescription
          </Button>
        </div>
      </PageHeader>

      {/* Search and Sort Section */}
      <div
        className={cn(
          'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
          'bg-gray-800 border border-gray-200 rounded-lg shadow-sm px-4 py-3',
          'transition-all sm:hover:shadow-lg'
        )}
      >
        <SearchFilter
          query={searchQuery}
          onSearch={setSearchQuery}
          onClear={handleSearchClear}
          placeholder="Search prescriptions by comments, patient ID, medication ID, or doctor ID..."
        />
        <SortComponent fields={displayFields} sort={sort} onSortChange={handleSortChange} />
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
        <FileText className="h-4 w-4" />
        <span>{filteredAndSortedPrescriptions.length} prescriptions found</span>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          variant="error"
          message={error}
          dismissible
          onDismiss={() => setSelectedEntity(null)}
          className="mb-6"
          fullWidth
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py Colombo
System: center py-4">
          <LoadingSpinner size="lg" variant="primary" />
        </div>
      )}

      {/* Data Display */}
      {!isLoading && (
        <DataDisplay
          data={filteredAndSortedPrescriptions}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          view={view}
          fields={displayFields}
          emptyMessage={
            searchQuery
              ? `No prescriptions found matching "${searchQuery}"`
              : 'No prescriptions found. Add your first prescription to get started.'
          }
          page={page}
          size={size}
          totalPages={totPages}
          onPageChange={(newPage) => setPage(newPage, size)}
        />
      )}

      {/* Create Form Dialog */}
      <Dialog open={showCreateForm} onClose={handleFormClose} title="Add New Prescription" className="max-w-2xl">
        <CrudForm
          formAction={createFormAction}
          fields={formFields}
          onCancel={handleFormClose}
          isOpen={showCreateForm}
          title="Add New Prescription"
          submitText="Create Prescription"
          fieldErrors={createState?.fieldErrors}
          onSuccess={() => {
            console.log('Create form success');
            setShowCreateForm(false);
          }}
        />
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog
        open={showEditForm}
        onClose={handleFormClose}
        title="Edit Prescription"
        className="max-w-2xl"
      >
        <CrudForm
          initialValues={selectedEntity || {}}
          formAction={updateFormAction}
          fields={formFields}
          onCancel={handleFormClose}
          isOpen={showEditForm}
          title="Edit Prescription"
          submitText="Update Prescription"
          fieldErrors={updateState?.fieldErrors}
          onSuccess={() => {
            console.log('Update form success');
            setShowEditForm(false);
          }}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} title="Confirm Deletion">
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this prescription for{' '}
            <span className="font-semibold text-gray-900">Patient ID: {prescriptionToDelete?.patientId}</span>? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Prescription
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}