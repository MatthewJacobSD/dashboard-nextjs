import { cn } from '@/shared/utils/cn';
import { X, Search } from 'lucide-react';

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
  placeholder = "Search...",
}: SearchFilterProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleClear = () => {
    onClear();
  };

  return (
    <div className={cn("relative flex items-center gap-2 animate-fade-in")}>
      {/* Search Input with Icon */}
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder={placeholder}
          className={cn(
            "w-full px-10 py-2 rounded-lg",
            "bg-gray-800 text-white border border-gray-700",
            "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-gray-500"
          )}
        />
      </div>

      {/* Clear Button */}
      {query && (
        <button
          onClick={handleClear}
          className={cn(
            "p-1.5 rounded-lg flex items-center justify-center",
            "text-gray-400 hover:text-orange-400",
            "hover:bg-gray-800 transition-all duration-200 transform hover:scale-105",
            "border border-gray-700 hover:border-orange-400"
          )}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};