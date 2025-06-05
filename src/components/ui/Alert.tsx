'use client';

import { cn } from '@/shared/utils/cn';
import React from 'react';
import { X } from 'lucide-react'; // Using Lucide for modern icons

/* ===== Type Definitions ===== */

type AlertVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string | React.ReactNode;
  variant?: AlertVariant;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  fullWidth?: boolean;
}

/* ===== Variant Styles ===== */
const variantStyles = {
  default: 'bg-background text-foreground border',
  success: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
  error: 'bg-rose-50 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400',
  warning: 'bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
  info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
};

const iconColors = {
  default: 'text-muted-foreground',
  success: 'text-emerald-600 dark:text-emerald-400',
  error: 'text-rose-600 dark:text-rose-400',
  warning: 'text-amber-600 dark:text-amber-400',
  info: 'text-blue-600 dark:text-blue-400',
};

/* ===== Alert Component ===== */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      message,
      variant = 'default',
      className = '',
      action,
      icon,
      dismissible = false,
      onDismiss,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex items-start gap-3 rounded-lg p-4 text-sm',
          'transition-all duration-200 animate-in fade-in',
          'shadow-sm border border-border',
          variantStyles[variant],
          fullWidth ? 'w-full' : 'w-fit',
          className
        )}
        role="alert"
        aria-live={variant === 'error' ? 'assertive' : 'polite'}
        aria-atomic="true"
        {...props}
      >
        {/* Icon slot */}
        {icon && (
          <div className={cn('flex-shrink-0 size-5 mt-0.5', iconColors[variant])}>
            {icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>

        {/* Action slot */}
        {action && <div className="flex-shrink-0">{action}</div>}

        {/* Dismiss button */}
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              'absolute right-2 top-2 p-1 rounded-full transition-colors',
              'hover:bg-black/10 dark:hover:bg-white/20',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
            aria-label="Dismiss alert"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';