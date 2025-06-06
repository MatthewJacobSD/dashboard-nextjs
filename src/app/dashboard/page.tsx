'use client'

import { useState, useEffect } from 'react'
import { StatCard } from '@/components/stats/StatCard'
import { fetchStats } from '@/actions/doctors/fetchDoctors'

export default function DashboardPage() {
    const [stats, setStats] = useState<{
        doctors: number
        patients: number
        medications: number
        appointments: number
        prescriptions: number
        visits: number
        insurances: number
    } | null>(null)

    useEffect(() => {
        async function loadStats() {
            try {
                const response = await fetch('/api/stats')
                const data = await response.json()
                setStats(data)
            } catch (error) {
                console.error('Failed to fetch stats:', error)
            }
        }

        loadStats()
    }, [])

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stats ? (
                    <>
                        <StatCard title="Doctors" value={stats.doctors} icon="doctor" />
                        <StatCard title="Patients" value={stats.patients} icon="users" />
                        <StatCard title="Medications" value={stats.medications} icon="pill" />
                        <StatCard title="Appointments" value={stats.appointments} icon="calendar" />
                        <StatCard title="Prescriptions" value={stats.prescriptions} icon="file" />
                        <StatCard title="Visits" value={stats.visits} icon="calendar" />
                        <StatCard title="Insurances" value={stats.insurances} icon="shield" />
                    </>
                ) : (
                    <p>Loading stats...</p>
                )}
            </div>
        </div>
    )
}