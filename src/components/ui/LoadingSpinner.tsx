'use client';

/*============Imports============*/
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

/*============Types============*/
type LoadingSpinnerProps = {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'primary' | 'secondary' | 'destructive';
};

/*============LoadingSpinner Component============*/
/**
 * A centered loading spinner with animated rotation.
 * Configurable size and variant for use in buttons, cards, or standalone.
 */
export const LoadingSpinner = ({
  className,
  size = 'default',
  variant = 'primary',
}: LoadingSpinnerProps) => {
  console.log('🌀 Rendering LoadingSpinner 🚀');

  return (
    <div
      className={cn(
        'flex justify-center items-center h-auto p-sm rounded-m',
        'animate-fade-in',
        className
      )}
      aria-label="Loading"
    >
      <Loader2
        className={cn(
          'animate-spin',
          {
            'h-4 w-4': size === 'sm',
            'h-8 w-8': size === 'default',
            'h-12 w-12': size === 'lg',
          },
          {
            'text-purple-500': variant === 'primary',
            'text-green-500': variant === 'secondary',
            'text-red-500': variant === 'destructive',
          }
        )}
        aria-hidden="true"
      />
    </div>
  );
};