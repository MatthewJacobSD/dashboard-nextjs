import { X, Search } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface SearchFilterProps {
    query: string
    onSearch: (query: string) => void
    onClear: () => void
    placeholder?: string
}

export const SearchFilter = ({ query, onSearch, onClear, placeholder = 'Search...' }: SearchFilterProps) => {
    const handleClear = () => {
        onClear()
    }

    return (
        <div className="relative w-full sm:w-64">
            <input
                type="text"
                value={query}
                onChange={(e) => onSearch(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    'w-full pl-10 pr-8 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500',
                    'transition-all duration-200'
                )}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            {query && (
                <button
                    onClick={handleClear}
                    className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}