'use client';

/*============Imports============*/
import { cn } from '@/shared/utils/cn';

/*============Types============*/
/**
 * Props for the PageHeader component.
 */
interface PageHeaderProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
  className?: string;
}

/*============PageHeader Component============*/
/**
 * Unified header component used at the top of pages.
 * Displays a title, description, and optional action buttons.
 */
export const PageHeader = ({
  title,
  description,
  actions,
  className = '',
}: PageHeaderProps) => {
  /**
   * Log render for debugging and visibility
   */
  console.log('🏷️ Rendering PageHeader with title:', title, '🚀');

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row justify-between items-start sm:items-center',
        'gap-space-lg mb-space-2xl p-space-md',
        'bg-surface rounded-radius-md shadow-sm',
        className
      )}
    >
      <div>
        <h1 className="font-bold text-orange">
          {title}
        </h1>
        <p className="text-font-size-base text-gray-600 mt-space-xs">
          {description}
        </p>
      </div>
      {actions && (
        <div className="actionbar-actions">
          {actions}
        </div>
      )}
    </div>
  );
};