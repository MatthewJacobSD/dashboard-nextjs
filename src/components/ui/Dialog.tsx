import { useEffect, useRef } from 'react'
import { cn } from '@/shared/utils/cn'

interface DialogProps {
    open: boolean
    onClose: () => void
    title?: string
    className?: string
    children: React.ReactNode
}

export function Dialog({ open, onClose, title, className, children }: DialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [onClose, open])

    useEffect(() => {
        if (!open || !dialogRef.current) return

        const focusableElements = Array.from(dialogRef.current.querySelectorAll('button, [href], input, select, textarea'))
        const firstFocusable = focusableElements[0] as HTMLElement
        const lastFocusable = focusableElements.slice(-1)[0] as HTMLElement

        firstFocusable?.focus()

        const handleTab = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault()
                    lastFocusable?.focus()
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault()
                    firstFocusable?.focus()
                }
            }
        }

        document.addEventListener('keydown', handleTab)
        return () => document.removeEventListener('keydown', handleTab)
    }, [open])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                ref={dialogRef}
                className={cn(
                    'relative w-full max-w-lg p-6 mx-auto bg-white rounded-lg shadow-xl animate-fadeIn',
                    className
                )}
            >
                <div className="flex justify-between items-center mb-4">
                    {title && <h2 className="text-xl font-bold">{title}</h2>}
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <span className="sr-only">Close</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    )
}