import { Suspense } from 'react';
import { PatientDetailClient } from '@/client/patient/patient-detail-client';
import { PageHeader } from '@/components/layout/PageHeader';
import PatientDetailLoading from './loading'
/**
 * 👤 Patient Detail Page
 *
 * Shows detailed info about a single patient.
 * Handles missing records gracefully.
 */
export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-7xl">
      <PageHeader 
        title={`Patient #${id}`} 
        description="View and manage patient details"
        className="mb-space-md"
      />

      <Suspense fallback={<PatientDetailLoading />}>
        <PatientDetailClient patientId={id} />
      </Suspense>
    </div>
  );
}
