import { Suspense } from 'react';
import { StatsGrid, StatsData } from '@/components/stats/StatsGrid';
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert } from '@/components/ui/Alert';
import { axiosInstance } from '@/shared/lib/axios';
import { ErrorBoundary } from '@/shared/lib/components/ErrorBoundary';
import { cn } from '@/shared/utils/cn';
import { ErrorFallback } from '@/components/layout/FallBackError';

export default async function DashboardPage() {
  let stats: StatsData | null = null;
  let error: string | null = null;

  try {
    const response = await axiosInstance.get('/stats');
    stats = response.data;
    console.log('[DashboardPage] Fetched stats:', stats);
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error('[DashboardPage] Error fetching stats:', error);
  }

  return (
    <div className={cn(
      'min-h-screen bg-gray-300',
      'p-4 sm:p-6 lg:p-8',
      'transition-all duration-300 ease-in-out',
      'animate-fade-in'
    )}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PageHeader
          title="Dashboard"
          description="Welcome to your SanaSpace Stats overview"
          className={cn(
            'mb-8',
            'bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-sm p-6',
            'border border-gray-100 dark:border-gray-700'
          )}
        />

        {/* Main Content */}
        <ErrorBoundary fallback={<ErrorFallback />}>
          <Suspense fallback={<Loading />}>
            <div className="space-y-6">
              {error ? (
                <Alert
                  variant="error"
                  message={error}
                  dismissible
                  className="max-w-3xl mx-auto"
                  icon={<span className="text-lg">⚠️</span>}
                />
              ) : stats ? (
                <StatsGrid previousStats={stats} stats={stats} />
              ) : (
                <Alert
                  variant="info"
                  message="No statistics data available"
                  className="max-w-3xl mx-auto"
                  icon={<span className="text-lg">ℹ️</span>}
                />
              )}
            </div>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className={cn(
      'flex items-center justify-center h-48',
      'bg-white dark:bg-gray-800 rounded-xl',
      'shadow-sm border border-gray-100 dark:border-gray-700'
    )}>
      <div className={cn(
        'relative flex items-center justify-center',
        'animate-pulse'
      )}>
        <div className={cn(
          'absolute w-16 h-16 border-4 border-blue-200 rounded-full',
          'animate-spin'
        )} />
        <div className={cn(
          'w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full',
          'animate-spin'
        )} />
      </div>
    </div>
  );
}