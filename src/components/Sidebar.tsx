'use client';

// Grabbing Next.js navigation goodies
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Lucide icons for that clean, modern vibe
import { Calendar, FileText, Pill, ShieldCheck, Stethoscope, Users } from 'lucide-react';
// Utility for slick Tailwind class combos
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Nav items array, keeping routes and icons tight
const navItems = [
  { label: 'Doctors', path: '/doctors', icon: Stethoscope },
  { label: 'Insurance', path: '/insurances', icon: ShieldCheck },
  { label: 'Medication', path: '/medications', icon: Pill },
  { label: 'Patients', path: '/patients', icon: Users },
  { label: 'Prescriptions', path: '/prescriptions', icon: FileText },
  { label: 'Visits', path: '/visits', icon: Calendar },
];

// Sidebar component, now with mobile toggle magic
export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  // State for mobile menu toggle
  const [isOpen, setIsOpen] = useState(false);

  // Toggle sidebar for mobile, smooth vibes
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button, hidden on sm+ */}
      <button
        onClick={toggleSidebar}
        className="sm:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white/90 text-orange-500 hover:bg-orange-100 transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Sidebar, slides in on mobile, static on desktop */}
      <aside
        className={cn(
          'w-64 bg-white/95 border-r border-gray-200/50 p-4 sm:p-6 flex flex-col min-h-screen backdrop-blur-sm shadow-lg',
          'fixed inset-y-0 left-0 transform',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'sm:static sm:translate-x-0 transition-transform duration-300 z-40',
          className
        )}
      >
        {/* Sidebar header, bold and orange */}
        <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-6">Doctor Admin</h2>
        {/* Nav links, responsive and snappy */}
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 text-sm sm:text-base transition-all duration-200',
                pathname === item.path
                  ? 'bg-purple-100 text-purple-600 font-medium'
                  : 'hover:bg-purple-50 hover:text-purple-500 hover:scale-105'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        {/* Footer, chill copyright notice */}
        <div className="mt-auto pt-6 border-t border-gray-200/30 text-sm text-gray-500">
          © 2025 Admin Panel
        </div>
      </aside>
    </>
  );
}