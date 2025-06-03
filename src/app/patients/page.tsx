import { Suspense } from 'react';
import { PatientsClient } from '@/client/patient/patient-client';
import { PageHeader } from '@/components/layout/PageHeader';
import Loading from './loading';

/**
 * 👥 Patient Management Page
 *
 * Renders a list of patients in either card or table view.
 * Includes search, pagination, sorting, and filtering.
 */
export default function PatientsPage({
  searchParams,
}: {
  searchParams: URLSearchParams; // or better: any
}) {
  const params = searchParams;
  const page = Number(params) || 1;

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-7xl">
      <PageHeader
        title="Patient Management"
        description="Manage all your patients with ease"
        className="mb-space-md"
      />

      <Suspense fallback={<Loading />}>
        <PatientsClient initialPage={page} />
      </Suspense>
    </div>
  );
}
