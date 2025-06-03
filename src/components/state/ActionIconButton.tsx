'use client';

/*============Imports============*/
import { cn } from '@/shared/utils/cn';

/*============Types============*/
/**
 * Props for the ActionIconButton component.
 */
interface ActionIconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/*============ActionIconButton Component============*/
/**
 * Small, accessible button with an icon and optional label.
 * Supports multiple variants and sizes for flexible use.
 */
export function ActionIconButton({
  icon,
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
}: ActionIconButtonProps) {
  /** Map variant to corresponding button styles */
  const variantClasses = {
    primary: 'bg-orange text-accent-foreground hover:bg-orange/90',
    secondary: 'btn-secondary',
    tertiary: 'btn-tertiary',
    danger: 'bg-red text-accent-foreground hover:bg-red/90',
    success: 'bg-green text-accent-foreground hover:bg-green/90',
  };

  /** Map size to dimension classes */
  const sizeClasses = {
    sm: 'h-7 w-7 p-space-xs',
    md: 'h-8 w-8 p-space-sm',
    lg: 'h-9 w-9 p-space-sm',
  };

  /** Handle click with logging and callback */
  const handleClick = () => {
    console.log(`🖱️ ActionIconButton clicked: ${label} 🚀`);
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center rounded-radius-md font-medium transition-all',
        'focus-visible:outline-ring',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      aria-label={label}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
}