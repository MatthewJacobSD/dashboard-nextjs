'use client'

import { useEffect, useState } from 'react'

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
      const newProgress = Math.min((elapsed / duration) * 100, 95)
      
      setProgress(newProgress)

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isLoading, duration, progress])

  if (!isLoading && progress === 0) return null

  return (
    <div className="w-full fixed top-0 left-0 z-[60] overflow-hidden">
      <div
        className={`
          h-1 md:h-1.5 lg:h-2
          ${color}
          transition-all ease-out
          ${showGlow ? 'shadow-lg shadow-blue-500/20' : ''}
        `}
        style={{
          width: `${isComplete ? 100 : progress}%`,
          transitionDuration: isComplete ? '300ms' : '16ms',
          opacity: isComplete ? 0 : 1,
        }}
      />
    </div>
  )
}