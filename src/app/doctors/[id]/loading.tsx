import { PageHeader } from '@/shared/components/ui/PageHeader';
import { cn } from '@/shared/utils/cnUtils';

export default function DoctorDetailLoading() {
  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <PageHeader
        title="Loading Doctor..."
        description="Please wait while we load the doctor details"
        className="mb-8"
      />

      <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          <div className="flex-shrink-0">
            <div className={cn(
              "w-24 h-24 sm:w-32 sm:h-32 rounded-full",
              "bg-gray-200 animate-pulse",
              "border-4 border-gray-200/80"
            )} />
          </div>

          <div className="flex-1 space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <div className="h-4 w-24 bg-gray-200/70 rounded animate-pulse" />
                <div className="sm:col-span-2 h-4 w-full bg-gray-200/70 rounded animate-pulse" />
              </div>
            ))}

            <div className="pt-4 flex gap-3">
              <div className="h-10 w-24 bg-gray-200/70 rounded-lg animate-pulse" />
              <div className="h-10 w-24 bg-gray-200/70 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}