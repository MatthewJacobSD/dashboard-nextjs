'use client';

import { useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { useDoctors } from '@/shared/hooks/models/useDoctors';
import { DataDisplay } from '@/components/state/DataDisplay';
import { Dialog } from '@/components/ui/Dialog';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { ActionIconButton } from '@/components/state/ActionIconButton';
import { Plus } from 'lucide-react';
import { createFormComponent } from '@/components/form/createFormComponent';
import { Doctor } from '@/shared/lib/zod/doctor';
import { createDoctorSchema, updateDoctorSchema } from '@/shared/lib/zod/doctor';

const DoctorForm = createFormComponent(createDoctorSchema);
const UpdateDoctorForm = createFormComponent(updateDoctorSchema);

export default function DoctorsPage({
  initialData,
  initialPage = 1,
}: {
  initialData?: Doctor[];
  initialPage?: number;
}) {
  const [view, setView] = useState<'cards' | 'table'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  const {
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
  } = useDoctors({
    initialData: initialData || [],
    page: initialPage ? initialPage - 1 : 0,
  });

  return (
    <div className="container mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 max-w-7xl">
      <div className="bg-white/95 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-200/50">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-500 mb-2">
            Doctors Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            View and manage all doctor records in your system
          </p>
        </div>

        {/* Control Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-cyan-500">
              Doctor Records
            </h2>
            <p className="text-sm text-gray-600">
              {isLoading ? 'Loading...' : `${doctors.length} records found`}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setView('table')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200',
                view === 'table'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
                'hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
              )}
            >
              Table View
            </button>
            <button
              onClick={() => setView('cards')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200',
                view === 'cards'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
                'hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
              )}
            >
              Cards View
            </button>
            <ActionIconButton
              icon={<Plus className="h-5 w-5" />}
              label="Add New Doctor"
              onClick={() => setIsModalOpen(true)}
              variant="success"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert
            variant="error"
            message={error}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center text-gray-600">Loading doctors...</div>
        )}

        {/* Data Display */}
        {!isLoading && (
          <DataDisplay<Doctor>
            data={doctors}
            view={view}
            fields={[
              { key: 'firstName', label: 'First Name' },
              { key: 'lastName', label: 'Last Name' },
              { key: 'email', label: 'Email' },
              { key: 'specialization', label: 'Specialization' },
              { key: 'experience', label: 'Experience' },
            ]}
            onEdit={(item) => {
              console.log('Edit doctor:', item);
              setSelectedEntity(item);
            }}
            onDelete={(item) => {
              console.log('Delete doctor:', item);
              setDoctorToDelete(item);
              setIsDeleteModalOpen(true);
            }}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm sm:text-base text-gray-600">
              Showing page {page + 1} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 bg-gray-200 disabled:opacity-50 text-gray-800 rounded-lg font-medium transition-all duration-200 hover:bg-gray-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Previous
              </Button>
              <Button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-purple-500 disabled:opacity-50 hover:bg-purple-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Add Doctor Modal */}
        <Dialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Doctor"
          showFooter={false}
        >
          <DoctorForm
            onSubmit={async (data) => {
              const result = await handleCreate(data);
              if (result.success) {
                setIsModalOpen(false);
              }
              return result;
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </Dialog>

        {/* Edit Doctor Modal */}
        <Dialog
          isOpen={!!selectedEntity}
          onClose={() => setSelectedEntity(null)}
          title={`Edit Doctor: ${selectedEntity?.firstName} ${selectedEntity?.lastName || ''}`}
          size="md"
        >
          {selectedEntity && (
            <UpdateDoctorForm
              defaultValues={{
                id: selectedEntity.id,
                firstName: selectedEntity.firstName,
                lastName: selectedEntity.lastName || '',
                address: selectedEntity.address || '',
                email: selectedEntity.email,
                specialization: selectedEntity.specialization || 'General',
                experience: selectedEntity.experience || 'Novice',
              }}
              onSubmit={async (data) => {
                const result = await handleUpdate(data);
                if (result.success) {
                  setSelectedEntity(null);
                }
                return result;
              }}
              onCancel={() => setSelectedEntity(null)}
              submitButtonText="Save Changes"
              cancelButtonText="Cancel"
            />
          )}
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDoctorToDelete(null);
          }}
          title="Confirm Deletion"
          showFooter={false}
        >
          {doctorToDelete && (
            <div className="p-space-md space-y-space-sm">
              <p className="text-card-foreground">
                Are you sure you want to permanently delete{' '}
                <span className="font-semibold">
                  {doctorToDelete.firstName} {doctorToDelete.lastName || ''}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-space-sm pt-space-md">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDoctorToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={async () => {
                    const result = await handleDelete(doctorToDelete.id);
                    if (result.success) {
                      setIsDeleteModalOpen(false);
                      setDoctorToDelete(null);
                    }
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </div>
  );
}