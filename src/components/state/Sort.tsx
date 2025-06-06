import { cn } from '@/shared/utils/cn';
import { useEffect, useState } from 'react';
import { DataDisplayField } from './DataDisplay';

interface SortComponentProps<T> {
  fields: DataDisplayField<T>[];
  onSortChange?: (sort: { key: keyof T; direction: 'asc' | 'desc' }) => void;
}

export function SortComponent<T>({ fields, onSortChange }: SortComponentProps<T>) {
  const [sort, setSort] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    if (onSortChange && sort) {
      onSortChange(sort);
    }
  }, [sort, onSortChange]);

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        'bg-gray-800 border border-gray-700 rounded-lg shadow-sm px-4 py-3',
        'transition-all duration-200 hover:shadow-md'
      )}
    >
      {/* Sort Dropdown */}
      {fields.length > 0 && (
        <select
          value={sort ? `${String(sort.key)}-${sort.direction}` : ''}
          onChange={(e) => {
            const val = e.target.value;
            if (!val) {
              setSort(null);
              return;
            }
            const [key, direction] = val.split('-');
            setSort({ key: key as keyof T, direction: direction as 'asc' | 'desc' });
          }}
          className={cn(
            'bg-gray-900 text-white border border-gray-600 rounded-md px-3 py-1.5',
            'focus:outline-none focus:ring-2 focus:ring-purple-500',
            'transition-all duration-200 hover:border-gray-500',
            'text-sm'
          )}
        >
          <option key="no-sort" value="">
            Sort by...
          </option>
          {fields.map((field) => [
            <option key={`${String(field.key)}-asc`} value={`${String(field.key)}-asc`}>
              {field.label} (Asc)
            </option>,
            <option key={`${String(field.key)}-desc`} value={`${String(field.key)}-desc`}>
              {field.label} (Desc)
            </option>,
          ])}
        </select>
      )}

      {/* Clear Button */}
      {sort && (
        <button
          onClick={() => setSort(null)}
          className={cn(
            'text-gray-400 hover:text-orange-400 hover:bg-gray-900',
            'px-3 py-1.5 rounded-md transition-all duration-200 hover:scale-105',
            'text-sm'
          )}
          aria-label="Clear sort"
        >
          Clear Sort
        </button>
      )}
    </div>
  );
}