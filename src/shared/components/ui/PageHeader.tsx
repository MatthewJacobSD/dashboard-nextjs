'use client';

import { cn } from '@/shared/utils/cnUtils'; 

export const PageHeader = ({ 
  title,
  description,
  className = ''
}: {
  title: string;
  description: string;
  className?: string;
}) => (
  <div className={cn('mb-8', className)}>
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-500 mb-2">
      {title}
    </h1>
    <p className="text-gray-600 text-sm sm:text-base">{description}</p>
  </div>
);