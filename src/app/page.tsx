'use client'

import { useState, useEffect } from 'react'
import { api } from '@/utils/axios'
import ErrorBoundary from '@/utils/error'
import { 
  Stethoscope, 
  User, 
  Pill, 
  ClipboardList, 
  Hospital, 
  Shield 
} from 'lucide-react'

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get<StatsData>('/api/stats')
        setStats(response.data)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-100">Welcome to the Dashboard</h1>
      
      <ErrorBoundary 
        fallback={(error) => (
          <div className="text-red-400 p-4 border border-red-800 bg-red-900/50 rounded">
            Dashboard Error: {error.message}
            <button
              onClick={() => window.location.reload()}
              className="ml-3 px-3 py-1 bg-red-800 rounded hover:bg-red-700"
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
          <StatsGrid stats={stats} />
        )}
      </ErrorBoundary>
    </div>
  )
}

function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-900 p-4 rounded-md border border-gray-800 animate-pulse">
          <div className="h-5 w-3/4 bg-gray-700 rounded mb-3" />
          <div className="h-8 w-1/2 bg-gray-700 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  )
}

function StatsGrid({ stats }: { stats: StatsData | null }) {
  const statItems = [
    { 
      title: "Doctors", 
      value: stats?.doctors, 
      icon: <Stethoscope className="w-6 h-6" />,
      description: "Medical professionals" 
    },
    { 
      title: "Patients", 
      value: stats?.patients, 
      icon: <User className="w-6 h-6" />,
      description: "Active patients" 
    },
    { 
      title: "Medications", 
      value: stats?.medications, 
      icon: <Pill className="w-6 h-6" />,
      description: "Available drugs" 
    },
    { 
      title: "Prescriptions", 
      value: stats?.prescriptions, 
      icon: <ClipboardList className="w-6 h-6" />,
      description: "Active prescriptions" 
    },
    { 
      title: "Visits", 
      value: stats?.visits, 
      icon: <Hospital className="w-6 h-6" />,
      description: "Completed visits" 
    },
    { 
      title: "Insurances", 
      value: stats?.insurances, 
      icon: <Shield className="w-6 h-6" />,
      description: "Covered patients" 
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statItems.map((item) => (
        <StatCard 
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          description={item.description}
        />
      ))}
    </div>
  )
}

interface StatCardProps {
  title: string
  value?: number
  icon: React.ReactNode
  description: string
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <div className="border border-gray-800 p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-300">{title}</h3>
        <span className="text-gray-400">
          {icon}
        </span>
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold text-gray-100">{value?.toLocaleString() ?? '-'}</p>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  )
}