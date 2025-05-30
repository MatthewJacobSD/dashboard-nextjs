'use client'

import { SkeletonCards, SkeletonTable } from '@/features/doctor/Skeleton';

export default function Loading({ view }: { view: 'table' | 'cards' }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-100">Doctor Management</h1>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-100">Doctors Data</h2>
            <p className="text-sm text-gray-500">You can view, add, edit, and delete doctors at choice</p>
          </div>
          <div className="h-10 w-32 bg-gray-700 rounded-md animate-pulse" />
        </div>
        {view === 'table' ? <SkeletonTable /> : <SkeletonCards />}
      </div>
    </div>
  );
}