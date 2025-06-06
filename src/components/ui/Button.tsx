import { forwardRef } from 'react'
import { cn } from '@/shared/utils/cn'

type ButtonVariant = 'default' | 'primary' | 'secondary' | 'ghost' | 'destructive'
type ButtonSize = 'xs' | 'sm' | 'default' | 'lg'

interface ButtonProps {
    variant?: ButtonVariant
    size?: ButtonSize
    isLoading?: boolean
    fullWidth?: boolean
    disabled?: boolean
    className?: string
}

export const Button = forwardRef<
    HTMLButtonElement,
    ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ variant = 'default', size = 'default', isLoading = false, fullWidth = false, disabled = false, className = '', children, ...props }, ref) => {
    const baseStyles = cn(
        'flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
        {
            'bg-purple-600 text-white hover:bg-purple-700': variant === 'default' || variant === 'primary',
            'bg-green-600 text-white hover:bg-green-700': variant === 'secondary',
            'text-purple-500 hover:bg-gray-100 dark:hover:bg-gray-800': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
            'w-full': fullWidth,
            'pointer-events-none opacity-50': disabled,
        },
        {
            'px-4 py-2 text-base gap-2': size === 'lg',
            'px-4 py-2 text-sm gap-2': size === 'default',
            'px-3 py-1.5 text-xs gap-1.5': size === 'sm',
            'px-2 py-1 text-xs gap-1': size === 'xs',
        },
        className
    )

    return (
        <button ref={ref} className={baseStyles} disabled={disabled || isLoading} {...props}>
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </>
            ) : (
                children
            )}
        </button>
    )
})