'use client';

import { cn } from '@/shared/utils/cn';

interface PaginationControlsProps {
  page: number; // 1-based page number
  totalPages: number;
  size: number;
  onPaginationChange: (newPage: number, newSize: number) => void;
  className?: string;
}

export const PaginationControls = ({
  page,
  totalPages,
  size,
  onPaginationChange,
  className = '',
}: PaginationControlsProps) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    console.log(`📄 Page changed to ${newPage} 🚀`);
    onPaginationChange(newPage, size);
  };

  const handleSizeChange = (newSize: number) => {
    console.log(`📊 Items per page changed to ${newSize} 🔄`);
    onPaginationChange(1, newSize); // Reset to first page when changing size
  };

  // Generate page numbers for display (1-based)
  const pageNumbers = [];
  const maxVisiblePages = 5;
  const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row justify-between items-center gap-4 p-4 mt-4',
        'animate-fade-in',
        className
      )}
      role="navigation"
      aria-label="Pagination"
    >
      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <label htmlFor="pageSize" className="text-sm text-gray-600">
          Items per page:
        </label>
        <select
          id="pageSize"
          value={size}
          onChange={(e) => handleSizeChange(Number(e.target.value))}
          className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
          aria-label="Select items per page"
        >
          {[5, 10, 20, 50].map((sizeOption) => (
            <option key={sizeOption} value={sizeOption}>
              {sizeOption}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          className={cn(
            'px-4 py-2 rounded-lg font-medium',
            'bg-white text-black border border-gray-200',
            'hover:bg-gray-100 hover:scale-105',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200 ease-in-out',
            'shadow-sm hover:shadow-md'
          )}
          aria-label="Previous page"
        >
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex gap-2">
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium',
                num === page
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-black border border-gray-200 hover:bg-gray-100 hover:scale-105',
                'transition-all duration-200 ease-in-out',
                'shadow-sm'
              )}
              aria-current={num === page ? 'page' : undefined}
              aria-label={`Go to page ${num}`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
          className={cn(
            'px-4 py-2 rounded-lg font-medium',
            'bg-white text-black border border-gray-200',
            'hover:bg-gray-100 hover:scale-105',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200 ease-in-out',
            'shadow-sm hover:shadow-md'
          )}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};