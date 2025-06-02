// shared/components/ui/Button.tsx
'use client';

import { cn } from '@/shared/utils/cnUtils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'danger' 
  | 'outline' 
  | 'ghost';

type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
  disabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className = '',
      children,
      isLoading = false,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center rounded-lg font-medium',
      'transition-all duration-200 hover:scale-105 hover:shadow-lg',
      'focus:outline-none focus:ring-2 focus:ring-purple-500',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      fullWidth && 'w-full',
      className
    );

    const variantStyles = cn({
      // Primary (Purple)
      'bg-purple-500 text-white hover:bg-purple-600': variant === 'primary',
      // Secondary (Gray)
      'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
      // Danger (Red)
      'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
      // Outline
      'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-50': 
        variant === 'outline',
      // Ghost (No background)
      'bg-transparent text-gray-800 hover:bg-gray-100': variant === 'ghost',
      // Disabled
      'bg-gray-200 text-gray-500 cursor-not-allowed': props.disabled,
    });

    const sizeStyles = cn({
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-sm sm:text-base': size === 'md',
      'px-6 py-3 text-base sm:text-lg': size === 'lg',
    });

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles, sizeStyles)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';