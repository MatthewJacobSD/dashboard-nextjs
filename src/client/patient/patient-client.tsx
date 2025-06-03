'use client';

import { useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { usePatients } from '@/shared/hooks/models/usePatients';
import { DataDisplay } from '@/components/state/DataDisplay';
import { Dialog } from '@/components/ui/Dialog';
import { Alert } from '@/components/ui/Alert';
import { ViewToggle } from '@/components/state/ViewToggle';
import { PaginationControls } from '@/components/state/PaginationControls';
import { Button } from '@/components/ui/Button';
import { ActionIconButton } from '@/components/state/ActionIconButton';
import { Plus } from 'lucide-react';
import { createFormComponent } from '@/components/form/createFormComponent';
import { Patient } from '@/shared/lib/zod/patient';
import { createPatientSchema, updatePatientSchema } from '@/shared/lib/zod/patient';
import SearchFilterClient from '@/components/ui/SearchFilter';

const PatientForm = createFormComponent(createPatientSchema);
const UpdatePatientForm = createFormComponent(updatePatientSchema);

export function PatientsClient({
  initialData,
  initialPage = 1,
}: {
  initialData?: Patient[];
  initialPage?: number;
}) {
  const [view, setView] = useState<'cards' | 'table'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
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
  } = usePatients({
    initialData: initialData || [],
    page: initialPage ? initialPage - 1 : 0,
  });

  // Filter patients based on search term
  const filteredPatients = patients.filter((patient) =>
    Object.values(patient).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-space-lg">
      {/* Action Bar with View Toggle and Add New */}
      <div className="flex justify-between items-center flex-wrap gap-space-md">
        <div>
          <h3 className="font-semibold text-card-foreground">All Patients</h3>
          <p className="text-gray-500">
            {isLoading ? 'Loading...' : `${filteredPatients.length} patients found`}
          </p>
        </div>
        <div className="flex items-center gap-space-md">
          <ViewToggle view={view} setView={setView} />
          <ActionIconButton
            icon={<Plus className="h-5 w-5" />}
            label="Add New Patient"
            onClick={() => setIsModalOpen(true)}
            variant="secondary"
            className={cn(
              'focus-visible:outline-ring hover:scale-110 transition-transform duration-200',
              'bg-green/30 hover:bg-green/50 text-card-foreground'
            )}
          />
        </div>
      </div>

      {/* Search Filter */}
      <div className="mb-space-md">
        <SearchFilterClient searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Error alert */}
      {error && <Alert variant="error" message={error} className="mb-space-md" />}

      {/* Loading state */}
      {isLoading && (
        <div className="text-center text-gray-500">Loading patients...</div>
      )}

      {/* Data display */}
      {!isLoading && (
        <DataDisplay<Patient>
          data={filteredPatients}
          view={view}
          fields={[
            { key: 'firstName', label: 'First Name' },
            { key: 'lastName', label: 'Last Name' },
            { key: 'email', label: 'Email' },
            { key: 'phoneNumber', label: 'Phone' },
            { key: 'isInsured', label: 'Insurance Status' },
          ]}
          onEdit={(item) => {
            setSelectedEntity(item);
          }}
          onDelete={(item) => {
            setPatientToDelete(item);
            setIsDeleteModalOpen(true);
          }}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      )}

      {/* Add Patient Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Patient"
        showFooter={false}
      >
        <PatientForm
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

      {/* Edit Patient Modal */}
      <Dialog
        isOpen={!!selectedEntity}
        onClose={() => setSelectedEntity(null)}
        title={`Edit Patient: ${selectedEntity?.firstName} ${selectedEntity?.lastName}`}
        size="md"
      >
        {selectedEntity && (
          <UpdatePatientForm
            defaultValues={selectedEntity}
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
          setPatientToDelete(null);
        }}
        title="Confirm Deletion"
        showFooter={false}
      >
        {patientToDelete && (
          <div className="p-space-md space-y-space-sm">
            <p className="text-card-foreground">
              Are you sure you want to delete{' '}
              <span className="font-semibold">
                {patientToDelete.firstName} {patientToDelete.lastName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-space-sm pt-space-md">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setPatientToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="bg-red/30 hover:bg-red/50"
                onClick={async () => {
                  const result = await handleDelete(patientToDelete.id);
                  if (result.success) {
                    setIsDeleteModalOpen(false);
                    setPatientToDelete(null);
                  }
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