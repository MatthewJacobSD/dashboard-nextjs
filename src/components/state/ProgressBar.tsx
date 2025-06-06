import { useEffect, useState } from 'react'
import { cn } from '@/shared/utils/cn'

interface ProgressBarProps {
    isLoading: boolean
    duration?: number
    color?: string
    showGlow?: boolean
}

export function ProgressBar({
    isLoading,
    duration = 1000,
    color = 'bg-gradient-to-r from-blue-500 to-purple-500',
    showGlow = true,
}: ProgressBarProps) {
    const [progress, setProgress] = useState(0)
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
        if (!isLoading) {
            if (progress > 0) {
                setIsComplete(true)
                const timer = setTimeout(() => {
                    setProgress(0)
                    setIsComplete(false)
                }, 300)
                return () => clearTimeout(timer)
            }
            return
        }

        let startTime: number | null = null
        let animationFrameId: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const elapsed = timestamp - startTime
            const progressPercent = Math.min(elapsed / duration, 1)
            setProgress(progressPercent * 100)

            if (elapsed < duration) {
                animationFrameId = requestAnimationFrame(animate)
            } else {
                setIsComplete(true)
                const timer = setTimeout(() => {
                    setProgress(0)
                    setIsComplete(false)
                }, 300)
            }
        }

        animationFrameId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationFrameId)
    }, [isLoading, duration])

    if (!isLoading && isComplete) return null

    return (
        <div
            className={cn(
                'relative h-1 w-full overflow-hidden rounded-full bg-gray-200',
                showGlow && 'shadow-lg shadow-blue-500/20'
            )}
        >
            <div
                className={cn('h-full transition-all duration-300 ease-in-out', color)}
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    )
}