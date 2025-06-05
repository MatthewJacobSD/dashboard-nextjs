'use client';

/*============Imports============*/
import { cn } from '@/shared/utils/cn';

/*============Types============*/
type SkeletonProps = {
  type?: 'cards' | 'table';
  count?: number;
  rows?: number;
  columns?: number;
  variant?: 'primary' | 'secondary';
};

/*============Skeleton Component============*/
/**
 * Displays placeholder content while data is loading.
 * Supports card and table view skeletons with theme-aligned styles.
 */
export function Skeleton({
  type = 'cards',
  count = 6,
  rows = 6,
  columns = 6,
  variant = 'primary',
}: SkeletonProps) {
  console.log(`🧊 Rendering Skeleton for ${type} 🚀`);

  const placeholderColor = cn({
    'bg-purple-500/20': variant === 'primary',
    'bg-green-500/20': variant === 'secondary',
  });

  return type === 'cards' ? (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-m p-m animate-pulse',
        'animate-fade-in'
      )}
      role="status"
      aria-label="Loading"
      aria-hidden="true"
    >
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-card border border-border rounded-m p-m shadow-sm',
            'transition-all duration-200',
            'animate-fade-in'
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {/* Card Header Placeholder */}
          <div className="flex justify-between items-start mb-m">
            <div className={cn('h-6 w-1/2 rounded', placeholderColor)} />
            <div className="flex gap-xs">
              <div className={cn('h-8 w-16 rounded-m', placeholderColor)} />
              <div className={cn('h-8 w-16 rounded-m', placeholderColor)} />
            </div>
          </div>
          {/* Card Content Placeholder */}
          <div className="space-y-xs">
            <div className={cn('h-4 w-3/4 rounded', placeholderColor)} />
            <div className={cn('h-4 w-1/2 rounded', placeholderColor)} />
            <div className={cn('h-4 w-full rounded hidden md:block', placeholderColor)} />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div
      className={cn(
        'border border-border rounded-m shadow-sm overflow-hidden animate-pulse',
        'animate-fade-in'
      )}
      role="status"
      aria-label="Loading"
      aria-hidden="true"
    >
      <table className="w-full table">
        <thead className="bg-gray-700">
          <tr>
            {[...Array(columns)].map((_, j) => (
              <th
                key={j}
                className={cn(
                  'px-m py-sm text-left',
                  placeholderColor,
                  'h-6 rounded'
                )}
              />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {[...Array(rows)].map((_, i) => (
            <tr
              key={i}
              className={cn(
                'transition-colors duration-150',
                i % 2 === 0 ? 'bg-card' : 'bg-gray-300',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {[...Array(columns)].map((_, j) => (
                <td key={j} className="px-m py-sm">
                  <div className={cn('h-4 w-full rounded', placeholderColor)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}