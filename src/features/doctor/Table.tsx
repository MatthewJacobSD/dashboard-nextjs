'use client';

import { Doctor } from '@/lib/zod';
import { SkeletonTable } from './Skeleton';
import { Edit, Trash } from 'lucide-react';
import { ActionIconButton } from '@/components/ui/ActionIconButton';
import { cn } from '@/lib/utils';

export interface TableDataProps {
  data: Doctor[];
  isLoading?: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

export function Table({
  data = [],
  isLoading = false,
  onEdit,
  onDelete,
}: TableDataProps) {
  if (isLoading) {
    return <SkeletonTable />;
  }

  return (
    <div className="rounded-md border border-gray-800 bg-gray-900 overflow-hidden">
      <table className="w-full text-gray-100">
        <thead className="bg-gradient-to-r from-purple-900 to-black text-sm text-gray-400">
          <tr>
            <th className="p-3 text-left">Id</th>
            <th className="p-3 text-left">First Name</th>
            <th className="p-3 text-left">Last Name</th>
            <th className="p-3 text-left">Address</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Specialization</th>
            <th className="p-3 text-left">Experience</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-6 text-gray-400">
                No doctors found
              </td>
            </tr>
          ) : (
            data.map((doctor) => (
              <tr
                key={doctor.id}
                className={cn(
                  'border-t border-gray-800 hover:bg-gray-800 transition-colors'
                )}
              >
                <td className="p-3">{doctor.id}</td>
                <td className="p-3">{doctor.firstName}</td>
                <td className="p-3">{doctor.lastName ?? '-'}</td>
                <td className="p-3">{doctor.address ?? '-'}</td>
                <td className="p-3">{doctor.email}</td>
                <td className="p-3">{doctor.specialization ?? 'General'}</td>
                <td className="p-3">{doctor.experience ?? 'Novice'}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
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
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}