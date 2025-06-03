'use client';

/*============Imports============*/
// No imports needed

/*============Skeleton Component============*/
/**
 * Displays placeholder content while data is loading.
 * Supports both card and table view skeletons.
 */
export function Skeleton({
  type = 'cards',
  count = 6,
  rows = 6,
  columns = 6,
}: {
  type?: 'cards' | 'table';
  count?: number;
  rows?: number;
  columns?: number;
}) {
  console.log(`🧊 Rendering Skeleton for ${type} 🚀`);

  return type === 'cards' ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg p-space-lg animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="card h-48 bg-surface rounded-radius-lg border border-border shadow-sm transition-all animate-fadeIn"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="h-24 bg-gray-700/50 rounded-t-radius-lg" />
          <div className="p-space-sm space-y-space-xs">
            <div className="h-4 w-3/4 bg-gray-600/50 rounded" />
            <div className="h-3 w-1/2 bg-gray-600/50 rounded" />
            <div className="h-3 w-full bg-gray-600/30 rounded hidden md:block" />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="table-container bg-surface rounded-radius-lg border border-border shadow-sm animate-pulse">
      {/* Table header skeleton */}
      <div className="h-10 bg-gray-700/50 rounded-radius-sm mb-space-sm w-full" />

      {/* Table row skeletons */}
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="h-12 bg-surface rounded-radius-sm mb-space-xs w-full grid grid-cols-6 gap-space-sm items-center"
        >
          {[...Array(columns)].map((_, j) => (
            <div key={j} className="h-4 bg-gray-600/50 rounded w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}