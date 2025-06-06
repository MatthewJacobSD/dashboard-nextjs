import { forwardRef } from 'react'
import { cn } from '@/shared/utils/cn'

type AlertVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

const variantStyles = {
    default: 'bg-background text-foreground border',
    success: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
    error: 'bg-rose-50 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400',
    warning: 'bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
    info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
}

interface AlertProps {
    message: string
    variant?: AlertVariant
    icon?: React.ReactNode
    action?: React.ReactNode
    dismissible?: boolean
    onDismiss?: () => void
    fullWidth?: boolean
    className?: string
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
    ({ message, variant = 'default', icon, action, dismissible = false, onDismiss, fullWidth = false, className = '' }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'relative flex items-start gap-3 rounded-lg p-4 text-sm',
                    variantStyles[variant],
                    fullWidth && 'w-full',
                    className
                )}
            >
                {icon && <div className="mt-0.5 text-lg">{icon}</div>}
                <p className="flex-1">{message}</p>
                {action && <div>{action}</div>}
                {dismissible && (
                    <button onClick={onDismiss} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                        <span className="sr-only">Dismiss</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        )
    }
)