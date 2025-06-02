'use client';

import { cn } from '@/shared/utils/cnUtils';

interface ActionIconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ActionIconButton({
  icon,
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
}: ActionIconButtonProps) {
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary',
    danger: 'bg-danger text-white hover:bg-danger/90 focus:ring-danger',
    success: 'bg-success text-white hover:bg-success/90 focus:ring-success',
  };

  const sizeClasses = {
    sm: 'h-7 w-7 p-1.5',
    md: 'h-8 w-8 p-2',
    lg: 'h-9 w-9 p-2.5',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
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