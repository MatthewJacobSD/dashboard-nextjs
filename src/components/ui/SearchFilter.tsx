import { cn } from '@/shared/utils/cn';
import { X } from 'lucide-react';

/* ===== Types ===== */
type SearchFilterProps = {
    query: string;
    onSearch: (query: string) => void;
    onClear: () => void;
    placeholder?: string;
};

/* ===== Search Filter Component ===== */
export const SearchFilter = ({
    query,
    onSearch,
    onClear,
    placeholder = 'Search...',
}: SearchFilterProps) => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
    };

    const handleClear = () => {
        onClear();
    };

    return (
        <div className={cn("flex items-center space-x-xs animate-fade-in")}>
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder={placeholder}
                className={cn(
                    "w-full sm:w-64 p-sm border border-border rounded-m text-base text-gray-700 bg-card",
                    "focus:outline-none focus:ring-2 focus:ring-purple-accent focus:border-transparent",
                    "transition-colors duration-200"
                )}
            />
            {query && (
                <button
                    onClick={handleClear}
                    className={cn(
                        "btn text-gray-575 hover:text-gray-900 hover:bg-gray-350 p-xs rounded-m",
                        "transition-all duration-200 transform hover:scale-105"
                    )}
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};