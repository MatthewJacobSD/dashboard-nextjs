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
    disabled?: boolean
    className?: string
}

/* ===== Button Component ===== */
export const Button = forwardRef<HTMLButtonElement, ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>>(({
    variant = 'default',
    size = 'default',
    className = '',
    children,
    isLoading = false,
    fullWidth = false,
    onClick,
    disabled = false,
    ...props
}, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
            console.log(`🖱️ Button clicked: ${children}`)
            onClick(e)
        }
    }

    /* ===== Styles ===== */
    const buttonStyles = cn(
        'btn', // Base button styles from components layer
        'flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-accent focus-visible:ring-offset-2',
        {
            // Variant styles
            'bg-purple-500 text-white hover:bg-purple-accent': variant === 'default' || variant === 'primary',
            'bg-green-500 text-white hover:bg-green-accent': variant === 'secondary',
            'bg-transparent text-purple-500 hover:bg-gray-350': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600': variant === 'destructive',
            'pointer-events-none opacity-50': disabled,
            'w-full': fullWidth,
        },
        // Size styles
        {
            'px-4 py-2 text-base': size === 'lg',
            'px-4 py-2 text-sm': size === 'default',
            'px-3 py-1.5 text-xs': size === 'sm',
            'px-2 py-1 text-xs': size === 'xs',
        },
        className
    )

    /* ===== Render ===== */
    return (
        <button
            ref={ref}
            onClick={handleClick}
            className={buttonStyles}
            disabled={disabled}
            {...props}
        >
            {isLoading ? <LoadingSpinner /> : children}
        </button>
    )
})

Button.displayName = 'Button'