'use client';

import { cn } from '@/shared/utils/cnUtils';

export const ActionBar = ({ 
  title,
  description,
  actions,
  className = ''
}: {
  title: string;
  description: string;
  actions: React.ReactNode;
  className?: string;
}) => (
  <div className={cn(
    'flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4',
    className
  )}>
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-cyan-500">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <div className="flex flex-wrap gap-3">
      {actions}
    </div>
  </div>
);