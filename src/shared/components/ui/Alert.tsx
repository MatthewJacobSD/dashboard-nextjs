'use client';

import { cn } from '@/shared/utils/cnUtils'

type AlertVariant = 'error' | 'success' | 'warning' | 'info';

export const Alert = ({ 
  message,
  variant = 'error',
  className = ''
}: {
  message: string;
  variant?: AlertVariant;
  className?: string;
}) => {
  if (!message) return null;

  const variantClasses = {
    error: 'bg-red-50 border-red-200 text-red-500',
    success: 'bg-green-50 border-green-200 text-green-500',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-500',
    info: 'bg-blue-50 border-blue-200 text-blue-500'
  };

  return (
    <div className={cn(
      'mb-6 p-4 border rounded-lg',
      variantClasses[variant],
      className
    )}>
      <p className="text-sm sm:text-base">{message}</p>
    </div>
  );
};