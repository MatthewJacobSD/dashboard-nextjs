// components/ui/Skeleton.tsx

import { cn } from '@/shared/utils/cn'

type SkeletonType = 'cards' | 'table'
type SkeletonProps = {
    type?: SkeletonType
    count?: number
    rows?: number
    columns?: number
    variant?: 'primary' | 'secondary'
}

export function Skeleton({ type = 'cards', count = 6, rows = 6, columns = 6, variant = 'primary' }: SkeletonProps) {
    const baseClasses = cn(
        'rounded-md animate-pulse',
        {
            'bg-purple-500/20': variant === 'primary',
            'bg-blue-500/20': variant === 'secondary',
        },
        {
            'aspect-video': type === 'cards',
            'h-10': type === 'table',
        }
    )

    const renderSkeletons = () => {
        if (type === 'cards') {
            return Array(count).fill(0).map((_, i) => (
                <div key={`card-${i}`} className={`${baseClasses} h-32`} />
            ))
        }

        return (
            <div className="space-y-2">
                {Array(rows).fill(0).map((_, i) => (
                    <div key={`row-${i}`} className="grid grid-cols-6 gap-2">
                        {Array(columns).fill(0).map((__, j) => (
                            <div key={`col-${j}`} className={`${baseClasses} h-6`} />
                        ))}
                    </div>
                ))}
            </div>
        )
    }

    return <div className="space-y-4">{renderSkeletons()}</div>
}