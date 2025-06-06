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
import { useDoctors } from '@/shared/hooks/useDoctors';
import { Doctor } from '@/shared/lib/zod/doctor';
import { Experience, Specialization } from '@/shared/lib/zod/common';
import { DataDisplayView } from '@/components/state/DataDisplay';
import { CreateDoctor } from '@/shared/lib/zod/doctor';
import { SortComponent } from '@/components/state/Sort';

export default function DoctorsPage() {
  // State management
  const [view, setView] = useState<DataDisplayView>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  // Custom hook for doctor operations
  const {
    doctors,
    isLoading,
    error,
    fieldErrors,
    page,
    size,
    setPage,
    totPages,
    selectedEntity,
    setSelectedEntity,
    createFormAction,
    updateFormAction,
    handleDelete,
  } = useDoctors({
    page: 0, // 0-based for backend
    size: 10,
  });

  // Filter doctors based on search query
  const filteredAndSortedDoctors = useMemo(() => {
    let result = [...doctors];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (doctor) =>
          doctor.firstName.toLowerCase().includes(query) ||
          doctor.lastName.toLowerCase().includes(query) ||
          doctor.email.toLowerCase().includes(query) ||
          doctor.specialization.toLowerCase().includes(query) ||
          doctor.experience.toLowerCase().includes(query)
      );
    }

    return result;
  }, [doctors, searchQuery]);

  // Form field configurations
  const formFields: FieldConfig<CreateDoctor>[] = [
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
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'doctor@example.com',
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      required: true,
      placeholder: 'Enter full address',
    },
    {
      name: 'specialization',
      label: 'Specialization',
      type: 'select',
      options: Object.values(Specialization),
      required: true,
    },
    {
      name: 'experience',
      label: 'Experience Level',
      type: 'select',
      options: Object.values(Experience),
      required: true,
    },
  ];

  // Data display field configurations
  const displayFields: DataDisplayField<Doctor>[] = [
    {
      key: 'firstName',
      label: 'First Name',
    },
    {
      key: 'lastName',
      label: 'Last Name',
    },
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
      key: 'specialization',
      label: 'Specialization',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {String(value)}
        </span>
      ),
    },
    {
      key: 'experience',
      label: 'Experience',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {String(value)}
        </span>
      ),
    },
  ];

  // Handle sort change
  const handleSortChange = useCallback(
    (sort: { key: keyof Doctor; direction: 'asc' | 'desc' }) => {
      console.log(`Sorting by ${sort.key} (${sort.direction})`);
      const sortedDoctors = [...doctors].sort((a, b) => {
        const aValue = a[sort.key] as string;
        const bValue = b[sort.key] as string;
        return sort.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
      setSelectedEntity(null);
    },
    [doctors, setSelectedEntity]
  );

  // Event handlers
  const handleEdit = useCallback(
    (doctor: Doctor) => {
      setSelectedEntity(doctor);
      setShowEditForm(true);
    },
    [setSelectedEntity]
  );

  const handleDeleteClick = useCallback(
    (doctor: Doctor) => {
      setDoctorToDelete(doctor);
      setShowDeleteDialog(true);
    },
    []
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!doctorToDelete) return;

    try {
      const result = await handleDelete(doctorToDelete.id);
      if (result.success) {
        setShowDeleteDialog(false);
        setDoctorToDelete(null);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }, [doctorToDelete, handleDelete]);

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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Doctor Management"
        description="Manage doctor profiles, specializations, and contact information"
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <ViewToggle view={view} setView={setView} />
          <Button
            onClick={() => setShowCreateForm(true)}
            className={cn(
              'bg-blue-600 text-white hover:bg-blue-700',
              'flex items-center gap-2 px-4 py-2 rounded-md',
              'transition-all duration-200 hover:scale-105 shadow-sm'
            )}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
            Add Doctor
          </Button>
        </div>
      </PageHeader>

      {/* Search and Sort Section */}
      <div
        className={cn(
          'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
          'bg-gray-800 border border-gray-700 rounded-lg shadow-sm px-4 py-3',
          'transition-all duration-200 hover:shadow-md'
        )}
      >
        {/* Search Bar */}
        <SearchFilter
          query={searchQuery}
          onSearch={setSearchQuery}
          onClear={handleSearchClear}
          placeholder="Search doctors by name, email, or specialization..."
        />

        {/* Sort Component */}
        <SortComponent
          fields={displayFields}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
        <Users className="h-4 w-4" />
        <span>{filteredAndSortedDoctors.length} doctors found</span>
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
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" variant="primary" />
        </div>
      )}

      {/* Data Display */}
      {!isLoading && (
        <DataDisplay
          data={filteredAndSortedDoctors}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          view={view}
          fields={displayFields}
          emptyMessage={
            searchQuery
              ? `No doctors found matching "${searchQuery}"`
              : "No doctors found. Add your first doctor to get started."
          }
          page={page}
          size={size}
          totalPages={totPages}
          onPageChange={(newPage) => setPage(newPage, size)}
        />
      )}

      {/* Create Form Dialog */}
      <Dialog open={showCreateForm} onClose={handleFormClose} title="Add New Doctor" className="max-w-2xl">
        <CrudForm
          formAction={createFormAction}
          fields={formFields}
          onCancel={handleFormClose}
          isOpen={showCreateForm}
          title="Add New Doctor"
          submitText="Create Doctor"
          fieldErrors={fieldErrors}
        />
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog
        open={showEditForm}
        onClose={handleFormClose}
        title={`Edit Doctor: ${selectedEntity?.firstName} ${selectedEntity?.lastName}`}
        className="max-w-2xl"
      >
        <CrudForm
          initialValues={selectedEntity || {}}
          formAction={updateFormAction}
          fields={formFields}
          onCancel={handleFormClose}
          isOpen={showEditForm}
          title="Edit Doctor"
          submitText="Update Doctor"
          fieldErrors={fieldErrors}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} title="Confirm Deletion">
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">
              Dr. {doctorToDelete?.firstName} {doctorToDelete?.lastName}
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
              Delete Doctor
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}