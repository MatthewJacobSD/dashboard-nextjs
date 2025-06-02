'use client'

import { useState, useEffect } from 'react'
import { api } from '@/shared/lib/axios'
import ErrorBoundary from '@/shared/lib/error'
import { 
  Stethoscope, 
  User, 
  Pill, 
  ClipboardList, 
  Hospital, 
  Shield,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  Check,
  Heart
} from 'lucide-react'
import { cn } from '@/shared/utils/cnUtils' // Import the cn utility

interface StatsData {
  doctors: number
  patients: number
  medications: number
  prescriptions: number
  visits: number
  insurances: number
}

export default function HomePage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [previousStats, setPreviousStats] = useState<StatsData | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Store current stats as previous before fetching new ones
        if (stats) setPreviousStats(stats)
        
        const response = await api.get<StatsData>('/stats')
        setStats(response.data)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    // Set up polling every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [stats]) // Added stats to dependency array

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow mb-1">
          Welcome back, Doc!
        </h1>
        <p className="text-foreground/80">
          Here&apos;s what&apos;s happening with your practice today
        </p>
      </div>
      
      <ErrorBoundary 
        fallback={(error) => (
          <div className="text-red p-4 border border-red/30 bg-red/10 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <span className="font-bold">Oops!</span>
              <span className="text-sm">Error: {error.message}</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red/80 rounded-lg hover:bg-red/90 text-foreground"
            >
              Reload Dashboard
            </button>
          </div>
        )}
        resetOnChange={[stats]}
      >
        {loading ? (
          <StatsGridSkeleton />
        ) : (
          <StatsGrid stats={stats} previousStats={previousStats} />
        )}
      </ErrorBoundary>
    </div>
  )
}

function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <div 
          key={i} 
          className="bg-gray-dark/50 p-5 rounded-lg border border-gray-dark/30 animate-pulse"
        >
          <div className="h-6 w-24 bg-gray-dark/70 rounded mb-4" />
          <div className="h-8 w-12 bg-gray-dark/70 rounded mb-2" />
          <div className="h-4 w-32 bg-gray-dark/70 rounded" />
        </div>
      ))}
    </div>
  )
}

function StatsGrid({ stats, previousStats }: { stats: StatsData | null, previousStats: StatsData | null }) {
  const getTrendDirection = (current: number | undefined, previous: number | undefined) => {
    if (current === undefined || previous === undefined) return 'neutral'
    if (current > previous) return 'up'
    if (current < previous) return 'down'
    return 'neutral'
  }

  const statItems = [
    { 
      title: "Doctors", 
      value: stats?.doctors ?? 0, 
      previousValue: previousStats?.doctors ?? 0,
      icon: <Stethoscope className="w-5 h-5" />,
      description: "Rockstar medical pros",
      color: "cyan",
      trendIcon: (direction: string) => {
        if (direction === 'up') return <TrendingUp className="w-4 h-4 text-green-400 animate-bounce" />
        if (direction === 'down') return <TrendingDown className="w-4 h-4 text-red-400 animate-bounce" />
        return <span className="text-foreground/50">—</span>
      }
    },
    { 
      title: "Prescriptions", 
      value: stats?.prescriptions ?? 0, 
      previousValue: previousStats?.prescriptions ?? 0,
      icon: <ClipboardList className="w-5 h-5" />,
      description: "Scripts making lives better",
      color: "orange",
      trendIcon: (direction: string) => {
        if (direction === 'up') return <ArrowUp className="w-4 h-4 text-green-400 animate-bounce" />
        if (direction === 'down') return <ArrowDown className="w-4 h-4 text-red-400 animate-bounce" />
        return <span className="text-foreground/50">—</span>
      }
    },
    { 
      title: "Patients", 
      value: stats?.patients ?? 0, 
      previousValue: previousStats?.patients ?? 0,
      icon: <User className="w-5 h-5" />,
      description: "People trusting your skills",
      color: "cyan",
      trendIcon: (direction: string) => {
        if (direction === 'up') return <ArrowUp className="w-4 h-4 text-green-400 animate-bounce" />
        if (direction === 'down') return <ArrowDown className="w-4 h-4 text-red-400 animate-bounce" />
        return <span className="text-foreground/50">—</span>
      }
    },
    { 
      title: "Visits", 
      value: stats?.visits ?? 0, 
      previousValue: previousStats?.visits ?? 0,
      icon: <Hospital className="w-5 h-5" />,
      description: "Appointments crushed today",
      color: "purple",
      trendIcon: (direction: string) => {
        if (direction === 'up') return <TrendingUp className="w-4 h-4 text-green-400 animate-bounce" />
        if (direction === 'down') return <TrendingDown className="w-4 h-4 text-red-400 animate-bounce" />
        return <span className="text-foreground/50">—</span>
      }
    },
    { 
      title: "Medications", 
      value: stats?.medications ?? 0, 
      previousValue: previousStats?.medications ?? 0,
      icon: <Pill className="w-5 h-5" />,
      description: "Drugs in your arsenal",
      color: "green",
      trendIcon: (direction: string) => {
        if (direction === 'up') return <Check className="w-4 h-4 text-green-400 animate-bounce" />
        if (direction === 'down') return <span className="text-red-400">✕</span>
        return <span className="text-foreground/50">—</span>
      }
    },
    { 
      title: "Insurances", 
      value: stats?.insurances ?? 0, 
      previousValue: previousStats?.insurances ?? 0,
      icon: <Shield className="w-5 h-5" />,
      description: "Covered and protected",
      color: "yellow",
      trendIcon: (direction: string) => {
        if (direction === 'up') return <Heart className="w-4 h-4 text-red-400 animate-pulse" />
        if (direction === 'down') return <span className="text-red-400">💔</span>
        return <span className="text-foreground/50">—</span>
      }
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {statItems.map((item) => {
        const trendDirection = getTrendDirection(item.value, item.previousValue)
        const TrendIcon = item.trendIcon(trendDirection)
        const change = item.value - item.previousValue
        
        return (
          <StatCard 
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            description={item.description}
            color={item.color as 'cyan' | 'green' | 'orange' | 'purple' | 'yellow'}
            trendIcon={TrendIcon}
            change={change}
          />
        )
      })}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  description: string
  color: 'cyan' | 'green' | 'orange' | 'purple' | 'yellow'
  trendIcon: React.ReactNode
  change: number
}

function StatCard({ title, value, icon, description, color, trendIcon, change }: StatCardProps) {
  const colorClasses = {
    cyan: 'text-cyan border-cyan/20',
    green: 'text-green border-green/20',
    orange: 'text-orange border-orange/20',
    purple: 'text-purple border-purple/20',
    yellow: 'text-yellow border-yellow/20'
  }

  return (
    <div className={cn(
      'border p-5 rounded-lg bg-gray-dark/40',
      colorClasses[color]
    )}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-foreground/90 flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <div className="flex items-center gap-1">
          {change !== 0 && (
            <span className={cn(
              'text-xs',
              change > 0 ? 'text-green-400' : 'text-red-400'
            )}>
              {change > 0 ? '+' : ''}{change}
            </span>
          )}
          {trendIcon}
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold mb-1">{value.toLocaleString()}</p>
        <p className="text-sm text-foreground/70 flex items-center gap-1">
          {description}
        </p>
      </div>
    </div>
  )
}