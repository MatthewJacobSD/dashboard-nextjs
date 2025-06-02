'use client'

import { Suspense } from 'react';
import DoctorDisplay from '@/shared/client/doctor/data-display';
import { CreateDoctorForm } from '@/shared/client/doctor/create-form';
import { UpdateDoctorForm } from '@/shared/client/doctor/update-form';
import { useDoctors } from '@/shared/hooks/useDoctors';
import { ActionBar } from '@/shared/components/ui/generics/ActionBar';
import { ViewToggle } from '@/shared/components/ViewToggle';
import { Dialog } from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { Alert } from '@/shared/components/ui/Alert';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { PaginationControls } from '@/shared/components/Pagination';
import { useState } from 'react';
import { DoctorCreateInput, DoctorUpdateInput } from '@/shared/lib/zod';

export default function DoctorsPage() {
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const {
    entities: doctors,
    isLoading,
    error,
    page,
    totalPages,
    selectedEntity: selectedDoctor,
    entityToDelete: doctorToDelete,
    setPage,
    setSelectedEntity: setSelectedDoctor,
    setEntityToDelete: setDoctorToDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useDoctors();

  const handleCreateSubmit = async (data: DoctorCreateInput) => {
    const result = await handleCreate(data);
    if (result.success) {
      setIsCreateDialogOpen(false);
    }
    return result;
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <PageHeader
        title="Doctors Management"
        description="Manage all doctors in the hospital system"
      />

      {error && <Alert message={error} variant="error" className="mb-6" />}

      <ActionBar
        title="Doctors List"
        description={`Showing ${doctors.length} doctors`}
        actions={
          <>
            <ViewToggle view={view} setView={setView} />
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Add New Doctor
            </Button>
          </>
        }
      />

      <Suspense fallback={null}>
        <DoctorDisplay
          doctors={doctors}
          isLoading={isLoading}
          onEdit={setSelectedDoctor}
          onDelete={setDoctorToDelete}
          view={view}
        />
      </Suspense>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        className="mt-8"
      />

      {/* Create Doctor Dialog */}
      <Dialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        title="Create New Doctor"
        size="lg"
      >
        <CreateDoctorForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateDialogOpen(false)}
        />
      </Dialog>

      {/* Edit Doctor Dialog */}
      <Dialog
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        title="Edit Doctor"
        size="lg"
      >
        {selectedDoctor && (
          <UpdateDoctorForm
            initialValues={selectedDoctor}
            onSubmit={async (data: DoctorUpdateInput) => {
              const result = await handleUpdate(data);
              if (result.success) {
                setSelectedDoctor(null);
              }
              return result;
            }}
            onCancel={() => setSelectedDoctor(null)}
          />
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={!!doctorToDelete}
        onClose={() => setDoctorToDelete(null)}
        title="Confirm Deletion"
        showFooter
      >
        {doctorToDelete && (
          <div className="space-y-4">
            <p>
              Are you sure you want to delete Dr. {doctorToDelete.firstName}{' '}
              {doctorToDelete.lastName}?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setDoctorToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  await handleDelete(doctorToDelete.id);
                  setDoctorToDelete(null);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}