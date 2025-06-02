import { SkeletonCards, SkeletonTable } from '@/shared/components/ui/Skeleton';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { ActionBar } from '@/shared/components/ui/generics/ActionBar';

export default function DoctorsLoading() {
  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <PageHeader
        title="Doctors Management"
        description="Manage all doctors in the hospital system"
      />

      <ActionBar
        title="Loading Doctors"
        description="Please wait while we load the doctors list"
        actions={
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6">
        <div className="flex gap-4 mb-4">
          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        {Math.random() > 0.5 ? <SkeletonCards /> : <SkeletonTable />}
      </div>
    </div>
  );
}