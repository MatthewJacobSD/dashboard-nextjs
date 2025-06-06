import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface StatCardProps {
    title: string
    value: number
    previous?: number
    icon: React.ComponentType<{ className?: string }>
    desc?: string
    up: boolean | null
    iconColor?: string
}

export function StatCard({
    title,
    value,
    previous,
    icon: Icon,
    desc,
    up,
    iconColor = 'text-purple-500',
}: StatCardProps) {
    const percentageChange = previous ? ((value - previous) / previous) * 100 : 0
    const isPositive = percentageChange >= 0

    return (
        <div
            className={cn(
                'bg-white border border-gray-200 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1',
                'group cursor-pointer flex flex-col justify-between h-full relative overflow-hidden'
            )}
        >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* Card Content */}
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <div className={`p-2 rounded-full ${iconColor} bg-opacity-10`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                </div>

                <div className="mt-2">
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {previous !== undefined && up !== null && (
                        <div className="flex items-center mt-1">
                            {isPositive ? (
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span
                                className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'
                                    }`}
                            >
                                {Math.abs(percentageChange).toFixed(1)}%
                            </span>
                            <span className="ml-1 text-xs text-gray-500">from last month</span>
                        </div>
                    )}
                </div>

                {desc && <p className="mt-3 text-sm text-gray-500">{desc}</p>}
            </div>
        </div>
    )
}