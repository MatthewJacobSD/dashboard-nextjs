'use client';

/*============Imports============*/
import { cn } from '@/shared/utils/cn';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/*============Types============*/
/**
 * Available button styles to indicate intent or usage.
 */
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'tertiary';

/**
 * Available button sizes for flexible scaling.
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Button component.
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

/*============Button Component============*/
/**
 * Reusable button component with multiple variants and sizes.
 * Supports loading state and click logging.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className = '',
      children,
      isLoading = false,
      fullWidth = false,
      onClick,
      ...props
    },
    ref
  ) => {
    /** Handle click with logging and callback */
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        console.log(`🖱️ Button clicked: ${children} 🚀`);
        onClick(e);
      }
    };

    /** Base button styles shared across all variants */
    const baseStyles = cn(
      'inline-flex items-center justify-center font-medium transition-all',
      fullWidth && 'w-full',
      className
    );

    /** Variant-specific styling */
    const variantStyles = cn({
      'bg-orange text-accent-foreground hover:bg-orange/90': variant === 'primary',
      'btn-secondary': variant === 'secondary',
      'btn-tertiary': variant === 'tertiary',
      'bg-red text-accent-foreground hover:bg-red/90': variant === 'danger',
      'bg-transparent border border-border text-card-foreground hover:bg-gray-100': variant === 'outline',
      'bg-transparent text-card-foreground hover:bg-gray-100': variant === 'ghost',
      'bg-gray-200 text-muted-foreground cursor-not-allowed': props.disabled,
    });

    /** Size-based padding and font sizing */
    const sizeStyles = cn({
      'px-space-md py-space-xs text-font-size-muted': size === 'sm',
      'px-space-lg py-space-sm text-font-size-base': size === 'md',
      'px-space-xl py-space-md text-font-size-heading': size === 'lg',
    });

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles, sizeStyles)}
        disabled={isLoading || props.disabled}
        onClick={handleClick}
        {...props}
      >
        {isLoading && <LoadingSpinner className="mr-space-xs h-4 w-4" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';