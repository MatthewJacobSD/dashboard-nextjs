'use client';

// Skeleton components for loading states
import { SkeletonCards, SkeletonTable } from '@/features/doctor/Skeleton';

// Loading component for doctor management page
export default function Loading({ view }: { view: 'table' | 'cards' }) {
  // Render loading UI with vibrant styles
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-500 mb-6">Doctor Management</h1>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-semibold text-cyan-500">Doctors Data</h2>
            <p className="text-sm text-gray-600">You can view, add, edit, and delete doctors at choice</p>
          </div>
          <div className="h-10 w-32 bg-gray-300/70 rounded-lg animate-pulse" />
        </div>
        {view === 'table' ? <SkeletonTable /> : <SkeletonCards />}
      </div>
    </div>
  );
}