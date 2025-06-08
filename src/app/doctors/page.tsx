'use client'

import { cn } from '@/shared/utils/cn'
import { useState, useCallback, useMemo } from 'react'
import { Plus, Users } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataDisplay, type DataDisplayField } from '@/components/state/DataDisplay'
import { CrudForm, type FieldConfig } from '@/components/form/CrudForm'
import { ViewToggle } from '@/components/state/ViewToggle'
import { SearchFilter } from '@/components/ui/SearchFilter'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Alert } from '@/components/ui/Alert'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorFallback } from '@/components/layout/FallBackError'
import { useDoctors } from '@/shared/hooks/useDoctors'
import { Doctor } from '@/shared/lib/zod/doctor'
import { Experience, Specialization } from '@/shared/lib/zod/common'
import { DataDisplayView } from '@/components/state/DataDisplay'
import { CreateDoctor } from '@/shared/lib/zod/doctor'
import { SortComponent } from '@/components/state/Sort'

export default function DoctorsPage() {
  const [view, setView] = useState<DataDisplayView>('cards')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null)
  const [sort, setSort] = useState<{ key: keyof Doctor; direction: 'asc' | 'desc' } | null>({
    key: 'firstName',
    direction: 'asc',
  })

  const {
    doctors,
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
  } = useDoctors({ page: 0, size: 10 })

  const filteredAndSortedDoctors = useMemo(() => {
    let result = [...doctors]
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (doctor) =>
          doctor.firstName.toLowerCase().includes(query) ||
          doctor.lastName.toLowerCase().includes(query) ||
          doctor.email.toLowerCase().includes(query) ||
          doctor.specialization.toLowerCase().includes(query) ||
          doctor.experience.toLowerCase().includes(query)
      )
    }
    if (sort) {
      result.sort((a, b) => {
        const aValue = a[sort.key] ?? ''
        const bValue = b[sort.key] ?? ''
        return sort.direction === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue))
      })
    }
    return result
  }, [doctors, searchQuery, sort])

  const specializationOptions = Object.values(Specialization).map((spec) => ({
    value: spec,
    label: spec,
  }))

  const experienceOptions = Object.values(Experience).map((exp) => ({
    value: exp,
    label: exp,
  }))

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
      options: specializationOptions,
      required: true,
    },
    {
      name: 'experience',
      label: 'Experience Level',
      type: 'select',
      options: experienceOptions,
      required: true,
    },
  ]

  const displayFields: DataDisplayField<Doctor>[] = [
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
  ]

  const handleSortChange = useCallback(
    (newSort: { key: keyof Doctor; direction: 'asc' | 'desc' } | null) => {
      console.log(`Sorting by ${newSort?.key ?? 'none'} (${newSort?.direction ?? 'none'})`)
      setSort((prevSort) => {
        if (
          newSort === null ||
          (prevSort?.key === newSort?.key && prevSort?.direction === newSort?.direction)
        ) {
          return prevSort ?? null
        }
        return newSort
      })
      setSelectedEntity(null)
    },
    [setSelectedEntity]
  )

  const handleEdit = useCallback(
    (doctor: Doctor) => {
      setSelectedEntity(doctor)
      setShowEditForm(true)
    },
    [setSelectedEntity]
  )

  const handleDeleteClick = useCallback((doctor: Doctor) => {
    setDoctorToDelete(doctor)
    setShowDeleteDialog(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!doctorToDelete) return
    try {
      const result = await handleDelete(doctorToDelete.id)
      if (result.success) {
        setShowDeleteDialog(false)
        setDoctorToDelete(null)
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }, [doctorToDelete, handleDelete])

  const handleSearchClear = useCallback(() => {
    setSearchQuery('')
  }, [])

  const handleFormClose = useCallback(() => {
    setShowCreateForm(false)
    setShowEditForm(false)
    setSelectedEntity(null)
  }, [setSelectedEntity])

  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
        <ErrorFallback />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 space-y-6">
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
              'transition-all duration-200 hover:shadow-lg'
            )}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
            Add Doctor
          </Button>
        </div>
      </PageHeader>

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
          placeholder="Search doctors by name, email, or specialization..."
        />
        <SortComponent fields={displayFields} sort={sort} onSortChange={handleSortChange} />
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
        <Users className="h-4 w-4" />
        <span>{filteredAndSortedDoctors.length} doctors found</span>
      </div>

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

      {isLoading && (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="lg" variant="primary" />
        </div>
      )}

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
              : 'No doctors found. Add your first doctor to get started.'
          }
          page={page}
          size={size}
          totalPages={totPages}
          onPageChange={(newPage) => setPage(newPage, size)}
        />
      )}

      <Dialog open={showCreateForm} onClose={handleFormClose} title="Add Doctor" className="max-w-2xl">
        <CrudForm
          formAction={createFormAction}
          fields={formFields}
          onCancel={handleFormClose}
          isOpen={showCreateForm}
          title="Add Doctor"
          submitText="Create Doctor"
          fieldErrors={createState?.fieldErrors}
          onSuccess={() => {
            console.log('Create form success')
            setShowCreateForm(false)
          }}
        />
      </Dialog>

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
          fieldErrors={updateState?.fieldErrors}
          onSuccess={() => {
            console.log('Update form success')
            setShowEditForm(false)
          }}
        />
      </Dialog>

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} title="Confirm Deletion">
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete{' '}
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
  )
}