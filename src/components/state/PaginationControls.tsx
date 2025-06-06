import { cn } from '@/shared/utils/cn'

interface PaginationControlsProps {
    currentPage: number
    totalPages: number
    pageSize: number
    onPageChange: (page: number, size: number) => void
}

export function PaginationControls({
    currentPage,
    totalPages,
    pageSize,
    onPageChange,
}: PaginationControlsProps) {
    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1, pageSize)
    }

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1, pageSize)
    }

    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5

        let startPage = Math.max(1, currentPage - 2)
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }

        return pages
    }

    return (
        <div className="inline-flex items-center space-x-1">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
            >
                Previous
            </button>

            {getPageNumbers().map((pageNum) => (
                <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum, pageSize)}
                    className={cn(
                        'px-3 py-1 rounded-md border border-gray-300',
                        pageNum === currentPage ? 'bg-blue-600 text-white' : ''
                    )}
                >
                    {pageNum}
                </button>
            ))}

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    )
}