'use client';

import { cn } from '@/shared/utils/cn';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  pageSize?: number;
  setPageSize?: (size: number) => void;
  className?: string;
}

export const PaginationControls = ({
  page,
  totalPages,
  setPage,
  pageSize = 10,
  setPageSize,
  className = '',
}: PaginationControlsProps) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    console.log(`📄 Page changed to ${newPage + 1} 🚀`);
    setPage(newPage);
  };

  return (
    <div
      className={cn(
        'mt-space-xl flex flex-wrap justify-between items-center gap-space-md',
        className
      )}
    >
      <div className="text-font-size-base text-gray-500">
        Showing page {page + 1} of {totalPages}
      </div>

      {/* Optional page size selector */}
      {setPageSize && (
        <div className="flex items-center gap-space-sm">
          <label htmlFor="pageSize" className="text-gray-500">
            Items per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="bg-card border border-border rounded-radius-md px-space-md py-space-sm focus-visible:outline-ring"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-space-sm">
        <button
          disabled={page === 0}
          onClick={() => handlePageChange(page - 1)}
          className={cn(
            'btn-secondary px-space-md py-space-sm disabled:opacity-50 rounded-radius-md font-medium transition-all',
            'hover:scale-105 focus-visible:outline-ring'
          )}
          aria-label="Previous page"
        >
          Previous
        </button>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => handlePageChange(page + 1)}
          className={cn(
            'bg-orange text-accent-foreground px-space-md py-space-sm disabled:opacity-50',
            'hover:bg-orange/90 rounded-radius-md font-medium transition-all hover:scale-105 focus-visible:outline-ring'
          )}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};