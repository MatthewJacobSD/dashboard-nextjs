// app/doctors/[id]/page.tsx
'use server';

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Doctor } from '@/shared/lib/zod';
import { getDoctor } from '@/shared/server/actions/doctor'; // Fix: Import getDoctor directly
import { cn } from '@/shared/utils/cnUtils';
import { Stethoscope } from 'lucide-react';
import { Alert } from '@/shared/components/ui/Alert';
import { Button } from '@/shared/components/ui/Button';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { DataDisplayField } from '@/shared/components/ui/generics/DataDisplay';

interface DoctorDetailProps {
  params: { id: string };
}

export default async function DoctorDetailPage({ params }: DoctorDetailProps) {
  const { data: doctor, errorCode } = await getDoctor(params.id); // Use getDoctor

  if (!doctor) {
    notFound();
  }

  const doctorFields: DataDisplayField<Doctor>[] = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    {
      key: 'specialization',
      label: 'Specialization',
      render: (value: unknown) => (
        <span className="text-primary font-medium">
          {String(value)}
        </span>
      ),
    },
    {
      key: 'experience',
      label: 'Experience',
      render: (value: unknown) => (
        <span className="text-secondary font-medium">
          {String(value)}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <PageHeader
        title={`Dr. ${doctor.firstName} ${doctor.lastName}`}
        description="View and manage doctor details"
        className="mb-8"
      />

      {errorCode && (
        <Alert message={errorCode} variant="error" className="mb-6" />
      )}

      <div className="bg-[hsl(var(--color-surface))] backdrop-blur-sm rounded-[var(--radius-xl)] border border-[hsl(var(--color-gray-200)/0.5)] shadow-[var(--shadow-sm)] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          <div className="flex-shrink-0">
            <div
              className={cn(
                'w-24 h-24 sm:w-32 sm:h-32 rounded-[var(--radius-full)]',
                'bg-[hsl(var(--color-primary)/0.1)] flex items-center justify-center',
                'border-4 border-[hsl(var(--color-primary)/0.2)]'
              )}
            >
              <Stethoscope className="w-12 h-12 text-[hsl(var(--color-primary))]" />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <Suspense fallback={<DetailLoadingSkeleton />}>
              {doctorFields.map((field) => (
                <div key={String(field.key)} className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                  <dt className="text-[var(--font-size-base)] font-medium text-[hsl(var(--color-muted))]">
                    {field.label}
                  </dt>
                  <dd className="sm:col-span-2 text-[var(--font-size-base)] text-[hsl(var(--color-foreground))]">
                    {field.render
                      ? field.render(doctor[field.key], doctor)
                      : String(doctor[field.key] ?? '-')}
                  </dd>
                </div>
              ))}
            </Suspense>

            <div className="pt-4 flex gap-3">
              <Button
                variant="primary"
                asChild
              >
                <a href={`/doctors/${doctor.id}/edit`}>Edit Profile</a>
              </Button>
              <Button
                variant="outline"
                asChild
              >
                <a href="/doctors">Back to List</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailLoadingSkeleton() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
          <div className="h-4 w-24 bg-[hsl(var(--color-gray-200)/0.7)] rounded-[var(--radius-sm)] animate-pulse" />
          <div className="sm:col-span-2 h-4 w-full bg-[hsl(var(--color-gray-200)/0.7)] rounded-[var(--radius-sm)] animate-pulse" />
        </div>
      ))}
    </>
  );
}