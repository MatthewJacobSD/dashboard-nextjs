'use client';

/*============Imports============*/
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  FileText,
  Pill,
  ShieldCheck,
  Stethoscope,
  Users,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useState, useEffect, useCallback } from 'react';

/*============Types============*/
interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
}

/*============Constants============*/
const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, iconColor: 'text-purple' },
  { label: 'Doctors', path: '/doctors', icon: Stethoscope, iconColor: 'text-purple' },
  { label: 'Insurances', path: '/insurances', icon: ShieldCheck, iconColor: 'text-cyan' },
  { label: 'Medications', path: '/medications', icon: Pill, iconColor: 'text-yellow' },
  { label: 'Patients', path: '/patients', icon: Users, iconColor: 'text-green' },
  { label: 'Prescriptions', path: '/prescriptions', icon: FileText, iconColor: 'text-red' },
  { label: 'Visits', path: '/visits', icon: Calendar, iconColor: 'text-orange' },
];

/*============Sidebar Component============*/
export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /** Detect screen size */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => {
      console.log(`📱 Sidebar ${!prev ? 'opened' : 'closed'} on mobile 🚀`);
      return !prev;
    });
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
    console.log('📱 Sidebar closed 🚀');
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed z-50 top-space-md left-space-md p-space-sm rounded-radius-md bg-surface shadow-md hover:bg-gray-100 focus-visible:outline-ring"
          aria-label="Toggle sidebar"
          aria-expanded={isOpen}
        >
          <Menu className="w-6 h-6 text-muted-foreground" />
        </button>
      )}

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          'sidebar flex flex-col h-screen justify-between fixed md:sticky top-0 left-0 bottom-0 md:translate-x-0 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0 z-50' : '-translate-x-full md:translate-x-0',
          className
        )}
      >
        {/* Top section (logo + nav) */}
        <div className="flex flex-col flex-none">
          {/* Header/logo section */}
          <div className="sidebar-header flex-col items-center justify-between px-space-md py-space-lg border-b border-border">
            <h1 className="text-white font-bold text-accent-foreground flex items-center gap-space-sm">
              <span className="bg-orange/10 p-space-sm rounded-radius-md">
                <LayoutDashboard className="w-6 h-6 text-orange" />
              </span>
              SanaSpace
            </h1>
            {isMobile && (
              <button
                onClick={closeSidebar}
                className="p-space-sm rounded-radius-md hover:bg-gray-100 focus-visible:outline-ring"
                aria-label="Close sidebar"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Navigation links */}
          <nav className="sidebar-nav mt-space-md px-space-md space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.path || (item.path !== '/dashboard' && pathname?.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    'group sidebar-link flex items-center gap-space-md py-space-sm px-space-md rounded-radius-md transition-all',
                    isActive ? 'active' : ''
                  )}
                  onClick={() => {
                    console.log(`🧭 Navigated to ${item.label} 🚀`);
                    if (isMobile) closeSidebar();
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className={cn('w-5 h-5 mr-space-md', item.iconColor)} />
                  <span className="text-font-size-base">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <footer className="sidebar-footer border-t border-border px-space-md py-space-md text-accent-foreground mb-space-md">
          <p>© {new Date().getFullYear()} SanaSpace</p>
          <p className="text-font-size-muted mt-space-xs">v1.0.0</p>
        </footer>
      </aside>
    </>
  );
}
