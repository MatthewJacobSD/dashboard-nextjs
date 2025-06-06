'use client'

import { cn } from '@/shared/utils/cn'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

/* ===== Types ===== */
type ButtonProps = {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'default' | 'xs' | 'sm' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
  className?: string
}

/* ===== Button Component ===== */
export const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
>(
  (
    {
      variant = 'default',
      size = 'default',
      className = '',
      children,
      isLoading = false,
      fullWidth = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    /* ===== Styles ===== */
    const baseStyles = cn(
      'flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-in-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2',
      {
        // Variant styles
        'bg-purple-600 text-white hover:bg-purple-700': variant === 'default' || variant === 'primary',
        'bg-green-600 text-white hover:bg-green-700': variant === 'secondary',
        'bg-transparent text-purple-500 hover:bg-gray-100 dark:hover:bg-gray-800': variant === 'ghost',
        'bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
        'w-full': fullWidth,
        'pointer-events-none opacity-50': disabled,
      },
      // Size styles
      {
        'px-4 py-2 text-base gap-2': size === 'lg',
        'px-4 py-2 text-sm gap-2': size === 'default',
        'px-3 py-1.5 text-xs gap-1.5': size === 'sm',
        'px-2 py-1 text-xs gap-1': size === 'xs',
      },
      className
    )

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || isLoading}
        className={baseStyles}
        {...props}
      >
        {isLoading && <LoadingSpinner />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'