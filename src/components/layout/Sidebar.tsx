'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  FileText,
  Pill,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
  LayoutDashboard,
  Menu,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useState, useEffect, useCallback } from 'react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, iconColor: 'text-purple-400' },
  { label: 'Doctors', path: '/doctors', icon: Stethoscope, iconColor: 'text-purple-400' },
  { label: 'Insurances', path: '/insurances', icon: ShieldCheck, iconColor: 'text-cyan-400' },
  { label: 'Medications', path: '/medications', icon: Pill, iconColor: 'text-yellow-400' },
  { label: 'Patients', path: '/patients', icon: Users, iconColor: 'text-green-400' },
  { label: 'Prescriptions', path: '/prescriptions', icon: FileText, iconColor: 'text-red-400' },
  { label: 'Visits', path: '/visits', icon: Calendar, iconColor: 'text-orange-400' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);

  // Adjust main content padding based on sidebar state
  const adjustMainContentPadding = useCallback(() => {
    const main = document.getElementById('main-content');
    if (!main) return;

    if (isMobile) {
      main.style.paddingLeft = '0';
    } else if (isTablet) {
      main.style.paddingLeft = isOpen ? '16rem' : '0';
    } else {
      main.style.paddingLeft = '16rem';
    }
  }, [isMobile, isTablet, isOpen]);

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
      
      // Auto-close sidebar when resizing to mobile
      if (width < 640) setIsOpen(false);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adjust padding when state changes
  useEffect(() => {
    adjustMainContentPadding();
  }, [isOpen, isMobile, isTablet, adjustMainContentPadding]);

  return (
    <>
      {/* Mobile Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
          <div className="flex justify-around p-2">
            {NAV_ITEMS.slice(0, 4).map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'flex flex-col items-center p-2 rounded-lg transition-all duration-200',
                  'hover:bg-accent/50 hover:scale-105 hover:shadow-sm hover:shadow-gray-500 ',
                  pathname === item.path 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                <item.icon className={cn(
                  'w-5 h-5 transition-colors duration-200',
                  pathname === item.path 
                    ? item.iconColor 
                    : 'group-hover:text-primary'
                )} />
                <span className="text-xs mt-1 transition-colors duration-200">{item.label}</span>
              </Link>
            ))}
            <button
              onClick={toggleSidebar}
              className="flex flex-col items-center p-2 rounded-lg text-muted-foreground
                        hover:bg-accent/50 hover:scale-105 hover:text-primary transition-all duration-200"
            >
              <Menu className="w-5 h-5 transition-colors duration-200" />
              <span className="text-xs mt-1 transition-colors duration-200">More</span>
            </button>
          </div>

          {/* Expanded menu */}
          {isOpen && (
            <div className="absolute bottom-full left-0 right-0 bg-background p-4 border-b border-border shadow-lg">
              <div className="grid grid-cols-2 gap-2">
                {NAV_ITEMS.slice(4).map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-lg transition-all duration-200',
                      'hover:bg-accent/50 hover:scale-[1.02] hover:shadow-sm hover:shadow-gray-400 hover:border-b-2 hover:borde',
                      pathname === item.path 
                        ? 'text-primary bg-primary/10' 
                        : 'text-muted-foreground hover:text-primary'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className={cn(
                      'w-5 h-5 transition-colors duration-200',
                      pathname === item.path 
                        ? item.iconColor 
                        : 'group-hover:text-primary'
                    )} />
                    <span className="transition-colors duration-200">{item.label}</span>
                  </Link>
                ))}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-accent
                          hover:scale-110 transition-all duration-200"
              >
                <X className="w-5 h-5 transition-colors duration-200" />
              </button>
            </div>
          )}
        </nav>
      )}

      {/* Tablet/Desktop Sidebar */}
      {!isMobile && (
        <aside
          className={cn(
            'fixed top-0 left-0 h-screen w-64 bg-background border-r border-border z-40',
            'transition-transform duration-300 ease-in-out',
            isTablet && !isOpen ? '-translate-x-full' : 'translate-x-0'
          )}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <LayoutDashboard className="text-primary" />
                SanaSpace
              </h1>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg group transition-all duration-200',
                        'hover:bg-accent/50 hover:shadow-gray-400 hover:border-b-2 hover:border-l-3 hover:shadow-xl hover:translate-x-1',
                        pathname === item.path 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:text-primary'
                      )}
                    >
                      <item.icon className={cn(
                        'w-5 h-5 transition-colors duration-200',
                        pathname === item.path 
                          ? item.iconColor 
                          : 'group-hover:text-primary'
                      )} />
                      <span className="transition-colors duration-200">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <footer className="p-4 border-t border-border text-center text-sm text-muted-foreground">
              SanaSpace &copy; {new Date().getFullYear()} MatthewJacobSD
            </footer>
          </div>
        </aside>
      )}

      {/* Tablet Toggle Button */}
      {isTablet && (
        <button
          onClick={toggleSidebar}
          className={cn(
            'fixed z-30 p-2 rounded-full bg-background border border-border shadow-md',
            'transition-all duration-300 ease-in-out hover:bg-accent hover:scale-110',
            isOpen ? 'left-[16.5rem]' : 'left-4',
            'top-4'
          )}
        >
          <Menu className="w-5 h-5 transition-colors duration-200" />
        </button>
      )}
    </>
  );
}