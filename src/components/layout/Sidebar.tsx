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
  iconColor: string; // Tailwind class like "text-purple-400"
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
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);

      if (width < 640) setIsOpen(false);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    adjustMainContentPadding();
  }, [isOpen, isMobile, isTablet, adjustMainContentPadding]);
  return (
    <>
      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
          <div className="flex justify-around p-2">
            {NAV_ITEMS.slice(0, 4).map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'flex flex-col items-center p-2 rounded-lg transition-all duration-200',
                  'hover:bg-gray-700/70 hover:scale-105 hover:shadow-sm',
                  pathname === item.path
                    ? 'text-purple-400'
                    : 'text-gray-400 hover:text-purple-300'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5 transition-colors duration-200',
                    pathname === item.path
                      ? item.iconColor
                      : 'text-gray-400 group-hover:text-purple-300'
                  )}
                />
                <span className="text-xs mt-1 transition-colors duration-200">{item.label}</span>
              </Link>
            ))}
            <button
              onClick={toggleSidebar}
              className={cn(
                'flex flex-col items-center p-2 rounded-lg',
                'text-gray-400 hover:text-purple-300 hover:bg-gray-700/70',
                'transition-all duration-200'
              )}
            >
              <Menu className="w-5 h-5 transition-colors duration-200" />
              <span className="text-xs mt-1">More</span>
            </button>
          </div>

          {/* Expanded menu on mobile */}
          {isOpen && (
            <div className="absolute bottom-full left-0 right-0 bg-gray-800 p-4 border-b border-gray-700 shadow-lg">
              <div className="grid grid-cols-2 gap-2">
                {NAV_ITEMS.slice(4).map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-lg transition-all duration-200',
                      'hover:bg-gray-700 hover:text-purple-300',
                      pathname === item.path
                        ? 'text-purple-400 bg-gray-700/70'
                        : 'text-gray-400'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        'w-5 h-5 transition-colors duration-200',
                        pathname === item.path ? item.iconColor : 'text-gray-400'
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-700 hover:text-white transition-all duration-200"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>
          )}
        </nav>
      )}

      {/* Tablet/Desktop Sidebar */}
      {!isMobile && (
        <aside
          className={cn(
            'fixed top-0 left-0 h-screen w-64 bg-gray-900 border-r border-gray-700 z-40',
            'transition-transform duration-300 ease-in-out',
            isTablet && !isOpen ? '-translate-x-full' : 'translate-x-0'
          )}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h1 className="text-xl font-bold flex items-center gap-2 text-white">
                <LayoutDashboard className="text-purple-400" />
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
                        'flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
                        'hover:bg-gray-800 hover:shadow-md hover:shadow-purple-500/10 hover:translate-x-1',
                        pathname === item.path
                          ? 'bg-gray-800 text-purple-400'
                          : 'text-gray-400 hover:text-purple-300'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'w-5 h-5 transition-colors duration-200',
                          pathname === item.path ? item.iconColor : ''
                        )}
                      />
                      <span className="transition-colors duration-200">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <footer className="p-4 border-t border-gray-700 text-center text-sm text-gray-500">
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
            'fixed z-30 p-2 rounded-full bg-gray-800 border border-gray-700 shadow-md',
            'hover:bg-gray-700 hover:scale-110',
            'text-gray-400 hover:text-white',
            'transition-all duration-300 ease-in-out',
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