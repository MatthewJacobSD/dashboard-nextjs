'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Alert } from '@/components/ui/Alert';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataDisplayField } from '@/components/state/DataDisplay';
import { updatePatientSchema } from '@/shared/lib/zod/patient';
import { updatePatient } from '@/app/patients/actions';
import { Patient } from '@/shared/lib/zod/patient';
import { createFormComponent } from '@/components/form/createFormComponent';

const UpdatePatientForm = createFormComponent(updatePatientSchema);

export function PatientDetailClient({
  patientId,
}: {
  patientId: string;
}) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  // Fetch patient by ID when patientId changes
  useEffect(() => {
    async function loadPatient() {
      try {
        const response = await fetch(`/api/patients/${patientId}`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to load patient');
        }
        const data = await response.json();
        setPatient(data.patient);
      } catch (err) {
        console.error('❌ Failed to load patient:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load patient details'
        );
      }
    }

    loadPatient();
  }, [patientId]);

  if (error) {
    return <Alert variant="error" message={error} className="mb-space-md" />;
  }

  if (!patient) {
    return (
      <div className="text-center text-muted-foreground">
        Loading patient...
      </div>
    );
  }

  const patientFields: DataDisplayField<Patient>[] = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'address', label: 'Address' },
    { key: 'postcode', label: 'Postcode' },
    { key: 'isInsured', label: 'Insurance Status' },
    { key: 'insuranceId', label: 'Insurance ID' },
  ];

  return (
    <div className="space-y-space-lg animate-fadeIn">
      {/* Header */}
      <PageHeader
        title={`Patient #${patient.id}`}
        description="Patient Profile"
        actions={
          <Button variant="primary" onClick={() => setIsEditModalOpen(true)}>
            Edit Patient
          </Button>
        }
      />

      {/* Display fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md bg-surface p-space-md rounded-radius-md shadow-sm">
        {patientFields.map((field) => (
          <div key={String(field.key)} className="space-y-space-xs">
            <span className="text-muted-foreground">{field.label}</span>
            <p className="text-card-foreground font-medium">
              {String(patient[field.key] ?? '-')}
            </p>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Dialog
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Patient"
          showFooter={false}
        >
          <UpdatePatientForm
            defaultValues={patient}
            onSubmit={async (data) => {
              const result = await updatePatient(patient.id, data);
              if (result.success) {
                setIsEditModalOpen(false);
                router.refresh(); // Refresh page after successful update
              }
              return result;
            }}
            onCancel={() => setIsEditModalOpen(false)}
            submitButtonText="Save Changes"
            cancelButtonText="Cancel"
          />
        </Dialog>
      )}
    </div>
  );
}