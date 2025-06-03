'use client';

/*============Imports============*/
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

/*============LoadingSpinner Component============*/
/**
 * A centered loading spinner with animated rotation.
 * Uses primary color by default but supports custom styling.
 */
export const LoadingSpinner = ({ className }: { className?: string }) => {
  console.log('🌀 Rendering LoadingSpinner 🚀');

  return (
    <div className="flex justify-center items-center h-32">
      <Loader2
        className={cn(
          'animate-spin text-orange h-12 w-12',
          className
        )}
        aria-hidden="true"
      />
    </div>
  );
};