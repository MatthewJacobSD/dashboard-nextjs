'use client';

/*============Imports============*/
import { cn } from '@/shared/utils/cn';

/*============Types============*/
/**
 * Available alert types to indicate intent or severity.
 */
type AlertVariant = 'error' | 'success' | 'warning' | 'info';

/*============Alert Component============*/
/**
 * Displays a dismissible alert message with optional action.
 * Styled according to variant (error, success, warning, info).
 */
export const Alert = ({
  message,
  variant = 'error',
  className = '',
  action,
}: {
  message: string;
  variant?: AlertVariant;
  className?: string;
  action?: React.ReactNode;
}) => {
  /** Don't render if no message is provided */
  if (!message) return null;

  /** Log render for visibility and debugging */
  console.log(`⚠️ Rendering Alert with message: ${message} 🚀`);

  /** Map variant to corresponding styles */
  const variantClasses = {
    error: 'bg-red/10 border-red text-red',
    success: 'bg-green/10 border-green text-green',
    warning: 'bg-yellow/10 border-yellow text-yellow',
    info: 'bg-cyan/10 border-cyan text-cyan',
  };

  return (
    <div
      className={cn(
        'mb-space-lg p-space-md border rounded-radius-md flex items-center justify-between',
        variantClasses[variant],
        className
      )}
    >
      <p className="text-font-size-base">{message}</p>
      {action && <div className="ml-space-md">{action}</div>}
    </div>
  );
};