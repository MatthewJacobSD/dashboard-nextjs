'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/shared/utils/cn'

type NavItem = {
    label: string
    path: string
    icon: React.ComponentType<{ className?: string }>
    iconColor: string
}

const NAV_ITEMS: NavItem[] = [
    {
        label: 'Dashboard',
        path: '/',
        icon: require('lucide-react').LayoutDashboard,
        iconColor: 'text-purple-400',
    },
    {
        label: 'Doctors',
        path: '/doctors',
        icon: require('lucide-react').Stethoscope,
        iconColor: 'text-purple-400',
    },
    {
        label: 'Patients',
        path: '/patients',
        icon: require('lucide-react').Users,
        iconColor: 'text-green-400',
    },
    {
        label: 'Medications',
        path: '/medications',
        icon: require('lucide-react').Pill,
        iconColor: 'text-yellow-400',
    },
    {
        label: 'Prescriptions',
        path: '/prescriptions',
        icon: require('lucide-react').FileText,
        iconColor: 'text-red-400',
    },
    {
        label: 'Visits',
        path: '/visits',
        icon: require('lucide-react').Calendar,
        iconColor: 'text-orange-400',
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)

    const toggleSidebar = useCallback(() => {
        setIsOpen((prev) => !prev)
    }, [])

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            setIsMobile(width < 640)
            setIsTablet(width >= 640 && width < 1024)
            if (width < 640) setIsOpen(false)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <>
            {/* Mobile Menu Toggle */}
            <button
                onClick={toggleSidebar}
                className={cn(
                    'fixed top-4 left-4 z-30 p-2 rounded-md bg-gray-800 text-white md:hidden',
                    isOpen ? 'bg-gray-700' : ''
                )}
                aria-label="Toggle sidebar"
            >
                <span className="sr-only">Toggle menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 h-screen w-64 bg-gray-900 border-r border-gray-700 z-30',
                    'transition-transform duration-300 ease-in-out',
                    isMobile ? 'translate-x-full' : 'translate-x-0',
                    isTablet && !isOpen ? '-translate-x-full' : 'translate-x-0'
                )}
            >
                <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-gray-700">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                            <span className="text-purple-400">SanaSpace</span>
                        </h2>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-2">
                            {NAV_ITEMS.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        className={cn(
                                            'flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
                                            'hover:bg-gray-800 hover:shadow-md hover:shadow-purple-500/10 hover:translate-x-1',
                                            pathname === item.path
                                                ? 'bg-gray-800 text-purple-400'
                                                : 'text-gray-400 hover:text-purple-300'
                                        )}
                                    >
                                        <item.icon className={cn('w-5 h-5 transition-colors duration-200', item.iconColor)} />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Overlay when open on mobile */}
            {isOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                ></div>
            )}
        </>
    )
}