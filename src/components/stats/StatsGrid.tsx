'use client'

import { Stethoscope, Users, Pill, FileText, Calendar, ShieldCheck } from 'lucide-react';
import { StatCard } from '@/components/stats/StatCard';
import { useState, useEffect } from 'react';
import { PaginationControls } from '@/components/state/PaginationControls';

/*============Types============*/
/**
 * Stats data interface for dashboard statistics.
 */
export interface StatsData {
  doctors: number;
  patients: number;
  medications: number;
  appointments: number;
  prescriptions: number;
  visits: number;
  insurances: number;
}

interface StatItem {
  title: string;
  value: number;
  previous?: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  desc: string;
}

interface StatsGridProps {
  stats: StatsData | null;
  previousStats: StatsData | null;
}

/*============StatsGrid Component============*/
/**
 * Displays a responsive grid of statistic cards.
 * Compares current stats to previous values to show trend indicators.
 * Implements responsive pagination when needed.
 */
export function StatsGrid({ stats, previousStats }: StatsGridProps) {
  /** Log render for visibility and debugging */
  console.log('📈 Rendering StatsGrid 🚀');

  const [pagination, setPagination] = useState({
    page: 1, // 1-based indexing
    size: 6   // Default to showing all
  });

  const statItems: StatItem[] = [
    {
      title: 'Doctors',
      value: stats?.doctors ?? 0,
      previous: previousStats?.doctors,
      icon: Stethoscope,
      iconColor: 'text-orange',
      desc: 'Medical legends',
    },
    {
      title: 'Patients',
      value: stats?.patients ?? 0,
      previous: previousStats?.patients,
      icon: Users,
      iconColor: 'text-green',
      desc: 'Your crew',
    },
    {
      title: 'Medications',
      value: stats?.medications ?? 0,
      previous: previousStats?.medications,
      icon: Pill,
      iconColor: 'text-yellow',
      desc: 'Pills in stock',
    },
    {
      title: 'Prescriptions',
      value: stats?.prescriptions ?? 0,
      previous: previousStats?.prescriptions,
      icon: FileText,
      iconColor: 'text-red',
      desc: 'Scripts on point',
    },
    {
      title: 'Visits',
      value: stats?.visits ?? 0,
      previous: previousStats?.visits,
      icon: Calendar,
      iconColor: 'text-purple',
      desc: 'Appointments slayed',
    },
    {
      title: 'Insurances',
      value: stats?.insurances ?? 0,
      previous: previousStats?.insurances,
      icon: ShieldCheck,
      iconColor: 'text-cyan',
      desc: 'Coverage locked in',
    },
  ];

  // Calculate total pages based on items per page
  const totalPages = Math.ceil(statItems.length / pagination.size);

  // Handle window resize to adjust items per page
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newSize: number;
      
      if (width < 640) { // sm breakpoint
        newSize = 2;
      } else if (width < 1024) { // lg breakpoint
        newSize = 4;
      } else {
        newSize = 6; // Show all items on large screens
      }

      setPagination(() => ({
        page: 1, // Reset to first page when changing size
        size: newSize
      }));
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get current items to display based on pagination
  const startIdx = (pagination.page - 1) * pagination.size;
  const endIdx = startIdx + pagination.size;
  const currentItems = statItems.slice(startIdx, endIdx);

  const handlePaginationChange = (newPage: number, newSize: number) => {
    console.log(`📊 Pagination changed to page ${newPage}, size ${newSize}`);
    setPagination({
      page: newPage,
      size: newSize
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {currentItems.map((item) => {
          const up = stats && previousStats ? item.value > (item.previous ?? 0) : null;
          return <StatCard key={item.title} {...item} up={up} />;
        })}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <PaginationControls
          page={pagination.page}
          totalPages={totalPages}
          size={pagination.size}
          onPaginationChange={handlePaginationChange}
          className="mt-4"
        />
      )}
    </div>
  );
}