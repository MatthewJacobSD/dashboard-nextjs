import { Skeleton } from '@/components/ui/Skeleton';

export default function PatientDetailLoading() {
  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-7xl">
      <div className="animate-fadeIn">
        <Skeleton type="cards" count={1} />
      </div>
    </div>
  );
}