'use client'

import { Doctor } from '@/lib/zod';
import { SkeletonCards } from './Skeleton';
import { Edit, Trash } from 'lucide-react';
import { ActionIconButton } from '@/components/ui/ActionIconButton';
import { cn } from '@/lib/utils';

export interface CardsDataProps {
  data: Doctor[];
  isLoading?: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

export function Cards({
  data = [],
  isLoading = false,
  onEdit,
  onDelete,
}: CardsDataProps) {
  if (isLoading) {
    return <SkeletonCards />;
  }

  if (!data.length) {
    return <div className="text-lg text-gray-400 p-8 text-center">No doctors found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
      {data.map((doctor) => (
        <div
          key={doctor.id}
          className={cn(
            'border border-gray-800 p-4 rounded-lg shadow-sm bg-gray-900 hover:bg-gray-800 transition-colors'
          )}
        >
          <div className="flex justify-between items-start">
            <p className="font-semibold text-gray-100">
              {doctor.firstName} {doctor.lastName || ''}
            </p>
            <div className="flex gap-2">
              <ActionIconButton
                icon={<Edit className="h-4 w-4" />}
                label="Edit"
                onClick={() => onEdit(doctor)}
                className="bg-orange-500 hover:bg-orange-600"
              />
              <ActionIconButton
                icon={<Trash className="h-4 w-4" />}
                label="Delete"
                onClick={() => onDelete(doctor)}
                className="bg-purple-600 hover:bg-purple-700"
              />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">Email: {doctor.email}</p>
          <p className="text-sm text-gray-400">
            Specialization: {doctor.specialization ?? 'General'}
          </p>
          <p className="text-sm text-gray-400">
            Experience: {doctor.experience ?? 'Novice'}
          </p>
          {doctor.address && (
            <p className="text-sm text-gray-400">Address: {doctor.address}</p>
          )}
        </div>
      ))}
    </div>
  );
}