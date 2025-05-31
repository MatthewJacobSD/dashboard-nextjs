'use client';

// Doctor schema for type safety
import { Doctor } from '@/lib/zod';
// Skeleton for loading state
import { SkeletonCards } from './Skeleton';
// Lucide icons for edit/delete actions
import { Edit, Trash } from 'lucide-react';
// Reusable action button component
import { ActionIconButton } from '@/components/ui/ActionIconButton';
// Utility for clean class merging
import { cn } from '@/lib/utils';

// Props for the cards component, typed for clarity
export interface CardsDataProps {
  data: Doctor[];
  isLoading?: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

// Card view for doctors, clean and responsive
export function Cards({
  data = [],
  isLoading = false,
  onEdit,
  onDelete,
}: CardsDataProps) {
  // Show skeleton while loading
  if (isLoading) {
    return <SkeletonCards />;
  }

  // Handle empty data state
  if (!data.length) {
    return <div className="text-lg text-gray-500 p-4 sm:p-6 lg:p-8 text-center">No doctors found</div>;
  }

  // Render cards in a responsive grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6 lg:p-8">
      {data.map((doctor) => (
        <div
          key={doctor.id}
          className={cn(
            'border border-gray-200/50 p-4 sm:p-6 rounded-xl shadow-sm bg-white/95 backdrop-blur-sm hover:bg-purple-50 transition-all duration-200'
          )}
        >
          <div className="flex justify-between items-start">
            <p className="font-semibold text-gray-800 text-base sm:text-lg">
              {doctor.firstName} {doctor.lastName || ''}
            </p>
            <div className="flex gap-2">
              <ActionIconButton
                icon={<Edit className="h-4 w-4" />}
                label="Edit"
                onClick={() => onEdit(doctor)}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-md p-2 focus:ring-2 focus:ring-cyan-300 focus:outline-none"
              />
              <ActionIconButton
                icon={<Trash className="h-4 w-4" />}
                label="Delete"
                onClick={() => onDelete(doctor)}
                className="bg-red-500 hover:bg-red-600 text-white rounded-md p-2 focus:ring-2 focus:ring-cyan-300 focus:outline-none"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Email: {doctor.email}</p>
          <p className="text-sm text-gray-600">
            Specialization: {doctor.specialization ?? 'General'}
          </p>
          <p className="text-sm text-gray-600">
            Experience: {doctor.experience ?? 'Novice'}
          </p>
          {doctor.address && (
            <p className="text-sm text-gray-600">Address: {doctor.address}</p>
          )}
        </div>
      ))}
    </div>
  );
}