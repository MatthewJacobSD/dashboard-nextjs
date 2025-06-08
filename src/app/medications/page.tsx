'use client'

import { cn } from '@/shared/utils/cn';
import { useState, useMemo, useCallback } from 'react';
import { Plus, Pill } from 'lucide-react';
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
import { useMedications } from '@/shared/hooks/useMedication';
import { Medication } from '@/shared/lib/zod/medication';
import { DataDisplayView } from '@/components/state/DataDisplay';
import { CreateMedication } from '@/shared/lib/zod/medication';
import { SortComponent } from '@/components/state/Sort';

export default function MedicationsPage() {
  // State management
  const [view, setView] = useState<DataDisplayView>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState<Medication | null>(null);
  const [sort, setSort] = useState<{ key: keyof Medication; direction: 'asc' | 'desc' } | null>({
    key: 'name',
    direction: 'asc',
  });

  // Custom hook for medication operations
  const {
    medications,
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
  } = useMedications({ page: 0, size: 10 });

  // Filter and sort medications based on search query
  const filteredAndSortedMedications = useMemo(() => {
    let result = [...medications];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (medication) =>
          medication.name.toLowerCase().includes(query) ||
          medication.sideEffects.toLowerCase().includes(query) ||
          medication.benefits.toLowerCase().includes(query)
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
  }, [medications, searchQuery, sort]);

  // Form field configurations
  const formFields: FieldConfig<CreateMedication>[] = [
    {
      name: 'name',
      label: 'Medication Name',
      type: 'text',
      required: true,
      placeholder: 'Enter medication name',
    },
    {
      name: 'sideEffects',
      label: 'Side Effects',
      type: 'textarea',
      required: true,
      placeholder: 'Describe known side effects',
    },
    {
      name: 'benefits',
      label: 'Benefits',
      type: 'textarea',
      required: true,
      placeholder: 'Describe therapeutic benefits',
    },
  ];

  // Data display field configurations
  const displayFields: DataDisplayField<Medication>[] = [
    { key: 'name', label: 'Medication Name' },
    {
      key: 'sideEffects',
      label: 'Side Effects',
      render: (value) => <span className="text-gray-600 line-clamp-2">{String(value)}</span>,
    },
    {
      key: 'benefits',
      label: 'Benefits',
      render: (value) => <span className="text-gray-600 line-clamp-2">{String(value)}</span>,
    },
  ];

  // Handle sort change
  const handleSortChange = useCallback(
    (newSort: { key: keyof Medication; direction: 'asc' | 'desc' } | null) => {
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
    (medication: Medication) => {
      setSelectedEntity(medication);
      setShowEditForm(true);
    },
    [setSelectedEntity]
  );

  const handleDeleteClick = useCallback(
    (medication: Medication) => {
      setMedicationToDelete(medication);
      setShowDeleteDialog(true);
    },
    []
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!medicationToDelete) return;

    try {
      const result = await handleDelete(medicationToDelete.id);
      if (result.success) {
        setShowDeleteDialog(false);
        setMedicationToDelete(null);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }, [medicationToDelete, handleDelete]);

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
        title="Medication Management"
        description="Manage medication profiles, side effects, and benefits"
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
            Add Medication
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
          placeholder="Search medications by name, side effects, or benefits..."
        />
        <SortComponent fields={displayFields} sort={sort} onSortChange={handleSortChange} />
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
        <Pill className="h-4 w-4" />
        <span>{filteredAndSortedMedications.length} medications found</span>
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
          data={filteredAndSortedMedications}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          view={view}
          fields={displayFields}
          emptyMessage={
            searchQuery
              ? `No medications found matching "${searchQuery}"`
              : 'No medications found. Add your first medication to get started.'
          }
          page={page}
          size={size}
          totalPages={totPages}
          onPageChange={(newPage) => setPage(newPage, size)}
        />
      )}

      {/* Create Form Dialog */}
      <Dialog open={showCreateForm} onClose={handleFormClose} title="Add New Medication" className="max-w-2xl">
        <CrudForm
          formAction={createFormAction}
          fields={formFields}
          onCancel={handleFormClose}
          isOpen={showCreateForm}
          title="Add New Medication"
          submitText="Create Medication"
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
        title={`Edit Medication: ${selectedEntity?.name}`}
        className="max-w-2xl"
      >
        <CrudForm
          initialValues={selectedEntity || {}}
          formAction={updateFormAction}
          fields={formFields}
          onCancel={handleFormClose}
          isOpen={showEditForm}
          title="Edit Medication"
          submitText="Update Medication"
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
            <span className="font-semibold text-gray-900">{medicationToDelete?.name}</span>? This action cannot be
            undone.
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
              Delete Medication
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}