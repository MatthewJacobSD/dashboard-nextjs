'use client';

/*============Imports============*/
import { cn } from '@/shared/utils/cn';

/*============ActionBar Component============*/
/**
 * Reusable header bar that displays a title, description, and action buttons.
 * Designed to be flexible and visually consistent across pages.
 */
export const ActionBar = ({
  title,
  description,
  actions,
  className = '',
}: {
  title: string;
  description: string;
  actions: React.ReactNode;
  className?: string;
}) => {
  /** Log render for debugging and visibility */
  console.log('🛠️ Rendering ActionBar with title:', title, '🚀');

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row justify-between items-start sm:items-center',
        'gap-space-lg mb-space-xl p-space-md',
        'bg-surface rounded-radius-md shadow-sm',
        className
      )}
    >
      <div>
        <h2 className="font-bold text-card-foreground">
          {title}
        </h2>
        <p className="text-font-size-muted text-muted-foreground mt-space-xs">
          {description}
        </p>
      </div>
      <div className="actionbar-actions">
        {actions}
      </div>
    </div>
  );
};