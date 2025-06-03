'use client'

/*============Imports============*/
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

/*============StatsGrid Component============*/
/**
 * Displays a responsive grid of statistic cards.
 * Compares current stats to previous values to show trend indicators.
 * Implements responsive pagination when needed.
 */
export function StatsGrid({
  stats,
  previousStats,
}: {
  stats: StatsData | null;
  previousStats: StatsData | null;
}) {
  /** Log render for visibility and debugging */
  console.log('📈 Rendering StatsGrid 🚀');

  const [itemsPerPage, setItemsPerPage] = useState(6); // Default to showing all
  const [currentPage, setCurrentPage] = useState(0);

  const statItems = [
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
  const totalPages = Math.ceil(statItems.length / itemsPerPage);

  // Handle window resize to adjust items per page
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) { // sm breakpoint
        setItemsPerPage(2);
      } else if (width < 1024) { // lg breakpoint
        setItemsPerPage(4);
      } else {
        setItemsPerPage(6); // Show all items on large screens
      }
      // Reset to first page when items per page changes
      setCurrentPage(0);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get current items to display based on pagination
  const startIdx = currentPage * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = statItems.slice(startIdx, endIdx);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
        {currentItems.map((item) => {
          const up = stats && previousStats ? item.value > (item.previous ?? 0) : null;
          return <StatCard key={item.title} {...item} up={up} />;
        })}
      </div>

      {/* Pagination controls */}
      <PaginationControls
        page={currentPage}
        totalPages={totalPages}
        setPage={setCurrentPage}
      />
    </div>
  );
}