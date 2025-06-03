import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-7xl">
      <Skeleton type="cards" count={6} />
    </div>
  );
}