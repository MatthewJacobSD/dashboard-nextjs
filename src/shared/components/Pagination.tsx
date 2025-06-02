'use client';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  className?: string;
}

export const PaginationControls = ({ 
  page,
  totalPages,
  setPage,
  className = ''
}: PaginationControlsProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 ${className}`}>
      <div className="text-sm sm:text-base text-gray-600">
        Showing page {page + 1} of {totalPages}
      </div>
      <div className="flex gap-2">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 disabled:opacity-50 text-gray-800 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 hover:bg-gray-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Previous page"
        >
          Previous
        </button>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-purple-500 disabled:opacity-50 hover:bg-purple-600 text-white rounded-lg text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};