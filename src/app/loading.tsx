// app/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-7xl">
      <div className="space-y-6">
        <Skeleton type="cards" rows={5} columns={6} />
      </div>
    </div>
  );
}