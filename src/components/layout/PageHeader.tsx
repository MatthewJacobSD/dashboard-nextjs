import { cn } from '@/shared/utils/cn'

interface PageHeaderProps {
    title: string
    description?: string
    actions?: React.ReactNode
    className?: string
}

export function PageHeader({ title, description, actions, className = '' }: PageHeaderProps) {
    return (
        <header className={cn('mb-6', className)}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
                    {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
                </div>
                {actions && <div>{actions}</div>}
            </div>
        </header>
    )
}