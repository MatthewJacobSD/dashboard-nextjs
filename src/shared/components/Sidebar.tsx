'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Pill, 
  ShieldCheck, 
  Stethoscope, 
  Users, 
  Menu, 
  X 
} from 'lucide-react';
import { cn } from '@/shared/utils/cnUtils';
import { useState, useEffect } from 'react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'SanaSpace Hospital',
    path: '/dashboard',
    icon: LayoutDashboard,
    iconColor: 'text-primary'
  },
  {
    label: 'Doctors',
    path: '/doctors',
    icon: Stethoscope,
    iconColor: 'text-secondary'
  },
  {
    label: 'Insurances',
    path: '/insurances',
    icon: ShieldCheck,
    iconColor: 'text-info'
  },
  {
    label: 'Medications',
    path: '/medications',
    icon: Pill,
    iconColor: 'text-warning'
  },
  {
    label: 'Patients',
    path: '/patients',
    icon: Users,
    iconColor: 'text-success'
  },
  {
    label: 'Prescriptions',
    path: '/prescriptions',
    icon: FileText,
    iconColor: 'text-danger'
  },
  {
    label: 'Visits',
    path: '/visits',
    icon: Calendar,
    iconColor: 'text-accent'
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsOpen(false);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed z-50 top-4 left-4 p-2 rounded-lg bg-surface shadow-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Toggle sidebar"
          aria-expanded={isOpen}
        >
          <Menu className="w-6 h-6 text-muted" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-64 bg-surface border-r border-gray-200 p-4 transition-transform duration-300 ease-in-out z-50 shadow-lg flex flex-col',
          'transform', // Needed for transition
          isOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Sidebar navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <span className="bg-primary/10 p-2 rounded-lg mr-2">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </span>
            SanaSpace
          </h1>
          {isMobile && (
            <button
              onClick={closeSidebar}
              className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6 text-muted" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path || 
              (item.path !== '/dashboard' && pathname?.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'flex items-center px-4 py-3 rounded-lg transition-colors',
                  'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted'
                )}
                onClick={isMobile ? closeSidebar : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className={cn('w-5 h-5 mr-3', item.iconColor)} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <footer className="mt-auto pt-4 border-t border-gray-200 text-sm text-muted">
          <p>© {new Date().getFullYear()} SanaSpace Hospital Copyrighted by MatthewJacobSD</p>
          <p className="text-xs mt-1">v1.0.0</p>
        </footer>
      </aside>
    </>
  );
}