'use client'

import { cn } from '@/shared/utils/cn';
import { useState, useMemo, useCallback } from 'react';
import { Plus, Users } from 'lucide-react';
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
import { usePatients } from '@/shared/hooks/usePatient';
import { Patient } from '@/shared/lib/zod/patient';
import { DataDisplayView } from '@/components/state/DataDisplay';
import { CreatePatient } from '@/shared/lib/zod/patient';
import { SortComponent } from '@/components/state/Sort';
import { Insurance } from '@/shared/lib/zod/insurance';
import { fetchInsurances } from '../insurances/actions';

export default function PatientsPage() {
  // State management
  const [view, setView] = useState<DataDisplayView>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [sort, setSort] = useState<{ key: keyof Patient; direction: 'asc' | 'desc' } | null>({
    key: 'firstName',
    direction: 'asc',
  });

  // Custom hook for patient operations
  const {
    patients,
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
  } = usePatients({ page: 0, size: 10 });

  // Fetch insurance options for select field
  const fetchinsuranceOptions = async () => {
    try {
      const response = await fetchInsurances(page)
      if (!response.data.items) return []
      return response.data.items.map((insurance: Insurance) => ({
        value: insurance.id,
        label: insurance.companyName,
      }))
    } catch (error) {
      console.error('Failed to fetch insurance options:', error)
      return []
    }
  }

  // Filter and sort patients based on search query
  const filteredAndSortedPatients = useMemo(() => {
    let result = [...patients];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (patient) =>
          patient.firstName.toLowerCase().includes(query) ||
          patient.lastName.toLowerCase().includes(query) ||
          patient.email.toLowerCase().includes(query) ||
          patient.address.toLowerCase().includes(query) ||
          patient.postcode.toLowerCase().includes(query) ||
          patient.phoneNumber.toLowerCase().includes(query)
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
  }, [patients, searchQuery, sort]);

  // Form field configurations
  const formFields: FieldConfig<CreatePatient>[] = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter first name',
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      placeholder: 'Enter last name',
    },
    {
      name: 'postcode',
      label: 'Postcode',
      type: 'text',
      required: true,
      placeholder: 'Enter postcode',
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      required: true,
      placeholder: 'Enter full address',
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
      required: true,
      placeholder: '123-456-7890',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'patient@example.com',
    },
    {
      name: 'insuranceId',
      label: 'Insurance',
      type: 'select',
      options: fetchinsuranceOptions,
      placeholder: 'Select insurance company',
    },
  ];

  // Data display field configurations
  const displayFields: DataDisplayField<Patient>[] = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    {
      key: 'email',
      label: 'Email',
      render: (value) => (
        <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-800 hover:underline">
          {String(value)}
        </a>
      ),
    },
    {
      key: 'phoneNumber',
      label: 'Phone Number',
      // render: (value) => (
      //   <a href={`tel:${value}`} className="text-blue-600 hover:text-blue-800 hover:underline">
      //     {String(value)}
      //   </a>
      // ),
    },
    { key: 'postcode', label: 'Postcode' },
    {
      key: 'insuranceId',
      label: 'Insurance',
      render: (value) => (
        <span className="text-gray-600">{value ? String(value) : 'N/A'}</span>
      ),
    },
  ];

  // Handle sort change
  const handleSortChange = useCallback(
    (newSort: { key: keyof Patient; direction: 'asc' | 'desc' } | null) => {
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
    (patient: Patient) => {
      setSelectedEntity(patient);
      setShowEditForm(true);
    },
    [setSelectedEntity]
  );

  const handleDeleteClick = useCallback(
    (patient: Patient) => {
      setPatientToDelete(patient);
      setShowDeleteDialog(true);
    },
    []
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!patientToDelete) return;

    try {
      const result = await handleDelete(patientToDelete.id);
      if (result.success) {
        setShowDeleteDialog(false);
        setPatientToDelete(null);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }, [patientToDelete, handleDelete]);

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
        title="Patient Management"
        description="Manage patient profiles and insurance information"
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
            Add Patient
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
          placeholder="Search patients by name, email, address, or postcode..."
        />
        <SortComponent fields={displayFields} sort={sort} onSortChange={handleSortChange} />
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
        <Users className="h-4 w-4" />
        <span>{filteredAndSortedPatients.length} patients found</span>
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
          data={filteredAndSortedPatients}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          view={view}
          fields={displayFields}
          emptyMessage={
            searchQuery
              ? `No patients found matching "${searchQuery}"`
              : 'No patients found. Add your first patient to get started.'
          }
          page={page}
          size={size}
          totalPages={totPages}
          onPageChange={(newPage) => setPage(newPage, size)}
        />
      )}

      {/* Create Form Dialog */}
      <Dialog open={showCreateForm} onClose={handleFormClose} title="Add New Patient" className="max-w-2xl">
        <CrudForm
          formAction={createFormAction}
          fields={formFields}
          onCancel={handleFormClose}
          isOpen={showCreateForm}
          title="Add New Patient"
          submitText="Create Patient"
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
        title={`Edit Patient: ${selectedEntity?.firstName} ${selectedEntity?.lastName}`}
        className="max-w-2xl"
      >
        <CrudForm
          initialValues={selectedEntity || {}}
          formAction={updateFormAction}
          fields={formFields}
          onCancel={handleFormClose}
          isOpen={showEditForm}
          title="Edit Patient"
          submitText="Update Patient"
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
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">
              {patientToDelete?.firstName} {patientToDelete?.lastName}
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
              Delete Patient
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}