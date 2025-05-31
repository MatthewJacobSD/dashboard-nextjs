'use client';

// Doctor schema for type safety
import { Doctor } from '@/lib/zod';
// Skeleton for loading state
import { SkeletonTable } from './Skeleton';
// Lucide icons for edit/delete actions
import { Edit, Trash } from 'lucide-react';
// Reusable action button component
import { ActionIconButton } from '@/components/ui/ActionIconButton';
// Utility for clean class merging
import { cn } from '@/lib/utils';

// Props for the table component, typed for clarity
export interface TableDataProps {
  data: Doctor[];
  isLoading?: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

// Table view for doctors, responsive and sharp
export function Table({
  data = [],
  isLoading = false,
  onEdit,
  onDelete,
}: TableDataProps) {
  // Show skeleton while loading
  if (isLoading) {
    return <SkeletonTable />;
  }

  // Render table with vibrant styles
  return (
    <div className="rounded-lg border border-gray-200/50 bg-white/95 backdrop-blur-sm overflow-hidden shadow-sm">
      <table className="w-full text-gray-800 text-sm sm:text-base">
        <thead className="bg-purple-100 text-gray-600">
          <tr>
            <th className="p-4 text-left font-medium">Id</th>
            <th className="p-4 text-left font-medium">First Name</th>
            <th className="p-4 text-left font-medium">Last Name</th>
            <th className="p-4 text-left font-medium">Address</th>
            <th className="p-4 text-left font-medium">Email</th>
            <th className="p-4 text-left font-medium">Specialization</th>
            <th className="p-4 text-left font-medium">Experience</th>
            <th className="p-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-8 text-gray-500">
                No doctors found
              </td>
            </tr>
          ) : (
            data.map((doctor) => (
              <tr
                key={doctor.id}
                className={cn(
                  'border-t border-gray-200/30 hover:bg-purple-50 transition-all duration-200'
                )}
              >
                <td className="p-4">{doctor.id}</td>
                <td className="p-4">{doctor.firstName}</td>
                <td className="p-4">{doctor.lastName ?? '-'}</td>
                <td className="p-4">{doctor.address ?? '-'}</td>
                <td className="p-4">{doctor.email}</td>
                <td className="p-4">{doctor.specialization ?? 'General'}</td>
                <td className="p-4">{doctor.experience ?? 'Novice'}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
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
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}