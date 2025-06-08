'use client'

import { cn } from '@/shared/utils/cn';
import { useState, useMemo, useCallback } from 'react';
import { Plus, Calendar } from 'lucide-react';
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
import { useVisits } from '@/shared/hooks/useVisit';
import { Visit } from '@/shared/lib/zod/visit';
import { DataDisplayView } from '@/components/state/DataDisplay';
import { CreateVisit } from '@/shared/lib/zod/visit';
import { SortComponent } from '@/components/state/Sort';
import { Doctor } from '@/shared/lib/zod/doctor';
import { fetchDoctors } from '../doctors/actions';
import { Patient } from '@/shared/lib/zod/patient';
import { fetchPatients } from '../patients/actions';

export default function VisitsPage() {
  // State management
  const [view, setView] = useState<DataDisplayView>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState<Visit | null>(null);
  const [sort, setSort] = useState<{ key: keyof Visit; direction: 'asc' | 'desc' } | null>({
    key: 'visitDate',
    direction: 'asc',
  });

  // Custom hook for visit operations
  const {
    visits,
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
  } = useVisits({ page: 0, size: 10 });

  // Fetch options for select fields
  const fetchPatientOptions = async () => {
    try {
      const response = await fetchPatients();
      if (!response.data?.items) {
        console.error('No patient data found');
        return [];
      }
      return response.data.items.map((patient: Patient) => ({
        value: patient.id,
        label: `${patient.firstName} ${patient.lastName}`,
      }));
    } catch (error) {
      console.error('Failed to fetch patient options:', error);
      return [];
    }
  };

  const fetchDoctorOptions = async () => {
    try {
      const response = await fetchDoctors();
      if (!response.data?.items) {
        console.error('No doctor data found');
        return [];
      }
      return response.data.items.map((doctor: Doctor) => ({
        value: doctor.id,
        label: `${doctor.firstName} ${doctor.lastName}`,
      }));
    } catch (error) {
      console.error('Failed to fetch doctor options:', error);
      return [];
    }
  };

  // Filter and sort visits based on search query
  const filteredAndSortedVisits = useMemo(() => {
    let result = [...visits];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (visit) =>
          visit.symptoms.toLowerCase().includes(query) ||
          visit.patientId.toLowerCase().includes(query) ||
          visit.doctorId.toLowerCase().includes(query)
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
  }, [visits, searchQuery, sort]);

  // Form field configurations
  const formFields: FieldConfig<CreateVisit>[] = [
    {
      name: 'patientId',
      label: 'Patient',
      type: 'select',
      options: fetchPatientOptions,
      required: true,
    },
    {
      name: 'doctorId',
      label: 'Doctor',
      type: 'select',
      options: fetchDoctorOptions,
      required: true,
    },
    {
      name: 'visitDate',
      label: 'Visit Date',
      type: 'date',
      required: true,
      placeholder: 'Select visit date',
    },
    {      
      name: 'symptoms',
      label: 'Symptoms',
      type: 'textarea',
      required: true,
      placeholder: 'Describe patient symptoms',
    },
    {
      name: 'diagnosis',
      label: 'Diagnosis Code',
      type: 'text',
      required: true,
      placeholder: 'Enter ICD-10 code (e.g., J45.0)',
    },
  ];

  // Data display field configurations
  const displayFields: DataDisplayField<Visit>[] = [
    { key: 'patientId', label: 'Patient ID' },
    { key: 'doctorId', label: 'Doctor ID' },
    {
      key: 'visitDate',
      label: 'Visit Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'symptoms',
      label: 'Symptoms',
      render: (value) => <span className="text-gray-600 line-clamp-2">{String(value)}</span>,
    },
    { key: 'diagnosis', label: 'Diagnosis Code' },
  ];

  // Handle sort change
  const handleSortChange = useCallback(
    (newSort: { key: keyof Visit; direction: 'asc' | 'desc' } | null) => {
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
    (visit: Visit) => {
      setSelectedEntity(visit);
      setShowEditForm(true);
    },
    [setSelectedEntity]
  );

  const handleDeleteClick = useCallback(
    (visit: Visit) => {
      setVisitToDelete(visit);
      setShowDeleteDialog(true);
    },
    []
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!visitToDelete) return;

    try {
      const result = await handleDelete(visitToDelete.id);
      if (result.success) {
        setShowDeleteDialog(false);
        setVisitToDelete(null);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }, [visitToDelete, handleDelete]);

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
        title="Visit Management"
        description="Manage patient visit records and diagnoses"
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
            Add Visit
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
          placeholder="Search visits by symptoms, patient ID, or doctor ID..."
        />
        <SortComponent fields={displayFields} sort={sort} onSortChange={handleSortChange} />
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
        <Calendar className="h-4 w-4" />
        <span>{filteredAndSortedVisits.length} visits found</span>
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
        <div className="flex justify-center py-4">
          <LoadingSpinner size="lg" variant="primary" />
        </div>
      )}

      {/* Data Display */}
      {!isLoading && (
        <DataDisplay
          data={filteredAndSortedVisits}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          view={view}
          fields={displayFields}
          emptyMessage={
            searchQuery
              ? `No visits found matching "${searchQuery}"`
              : 'No visits found. Add your first visit to get started.'
          }
          page={page}
          size={size}
          totalPages={totPages}
          onPageChange={(newPage) => setPage(newPage, size)}
        />
      )}

      {/* Create Form Dialog */}
      <Dialog open={showCreateForm} onClose={handleFormClose} title="Add New Visit" className="max-w-2xl">
        <CrudForm
          formAction={createFormAction}
          fields={formFields}
          onCancel={handleFormClose}
          isOpen={showCreateForm}
          title="Add New Visit"
          submitText="Create Visit"
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
        title="Edit Visit"
        className="max-w-2xl"
      >
        <CrudForm
          initialValues={selectedEntity || {}}
          formAction={updateFormAction}
          fields={formFields}
          onCancel={handleFormClose}
          isOpen={showEditForm}
          title="Edit Visit"
          submitText="Update Visit"
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
            Are you sure you want to delete this visit for{' '}
            <span className="font-semibold text-gray-900">
              Patient ID: {visitToDelete?.patientId} on{' '}
              {visitToDelete && new Date(visitToDelete.visitDate).toLocaleDateString()}
            </span>
            ? This action cannot be undone.
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
              Delete Visit
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}