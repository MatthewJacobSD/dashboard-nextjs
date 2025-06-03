/*============Imports============*/
import { Suspense } from 'react';
import { StatsGrid, StatsData } from '@/components/stats/StatsGrid';
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert } from '@/components/ui/Alert';
import ErrorBoundary from '@/shared/lib/components/ErrorBoundary';
import { ErrorFallback } from '@/shared/lib/components/ErrorFallback';
import { api } from '@/shared/lib/axios';
import Loading from './loading';

/*============Page Component============*/
/**
 * 🏠 Dashboard Home Page
 *
 * Displays key metrics and statistics for the healthcare dashboard.
 * Uses a responsive layout with error handling and loading state.
 */
export default async function HomePage() {
  let stats: StatsData | null = null;
  let error: string | null = null;

  try {
    const response = await api.get<StatsData>('/stats'); 
    stats = response.data; 
    console.log('[HomePage] Fetched stats:', stats); 
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load stats';
    console.error('[HomePage] Error fetching stats:', error);
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      {/* Header */}
      <PageHeader 
        title="Dashboard Overview" 
        description="Key metrics and statistics for your practice"
        className="mb-space-md gap-2"
      />

      {/* Error Boundary + Data Display */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Loading />}>
          {error ? (
            <Alert variant="error" message={error} className="mb-space-md" />
          ) : stats ? (
            <StatsGrid previousStats={stats} stats={stats} />
          ) : (
            <Alert variant="info" message="No statistics data available" className="mb-space-md" />
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}