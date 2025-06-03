/*============Imports============*/
import { X } from 'lucide-react';

/*============Types============*/
/**
 * Props for the SearchFilterClient component.
 */
interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
}

/*============SearchFilterClient Component============*/
/**
 * Reusable search input component for filtering data.
 * Includes clear button and real-time updates.
 */
export default function SearchFilterClient({
  searchTerm,
  setSearchTerm,
  placeholder = 'Search...',
}: SearchFilterProps) {
  return (
    <div className="flex items-center gap-space-md relative w-full sm:w-auto max-w-sm">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-card text-card-foreground border border-input rounded-radius-md px-space-md py-space-sm focus-visible:outline-ring transition-all hover:shadow-sm"
        aria-label="Search patients"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute right-2 text-red hover:text-red/80 transition-colors duration-200"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}