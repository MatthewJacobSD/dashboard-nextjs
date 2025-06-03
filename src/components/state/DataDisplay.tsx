'use client';

/*============Imports============*/
import { useState, useEffect } from 'react';
import { Skeleton } from '../ui/Skeleton';
import { PaginationControls } from './PaginationControls';
import { TableView } from '@/components/ui/TableView';
import { CardView } from '@/components/ui/CardView';
import { CircleArrowUp, CircleArrowDown }  from 'lucide-react';

/*============Types============*/
/**
 * Supported display views for data presentation.
 */
export type DataDisplayView = 'cards' | 'table';

/**
 * Field definition for rendering a column/property in the data display.
 */
export interface DataDisplayField<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

/**
 * Props for the DataDisplay component.
 */
export interface DataDisplayProps<T extends { id: string }> {
  data: T[];
  isLoading?: boolean;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  view?: DataDisplayView;
  fields: DataDisplayField<T>[];
  emptyMessage?: string;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSortChange?: (sort: { key: keyof T; direction: 'asc' | 'desc' }) => void;
}

/*============DataDisplay Component============*/
/**
 * Displays data in either card or table format with sort, pagination,
 * and action buttons. Fully responsive and customizable.
 */
export function DataDisplay<T extends { id: string }>({
  data = [],
  isLoading = false,
  onEdit,
  onDelete,
  view = 'cards',
  fields,
  emptyMessage = 'No data found',
  onPageChange,
  onSortChange,
  page = 0,
  totalPages = 1,
}: DataDisplayProps<T>) {
  const [sort, setSort] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

  /** Handle sort change */
  useEffect(() => {
    if (onSortChange && sort) {
      console.log('🔄 Sort updated:', sort);
      onSortChange(sort);
    }
  }, [sort, onSortChange]);

  console.log(`🎨 Rendering DataDisplay in ${view} view with ${data.length} items 🚀`);

  if (isLoading) {
    return <Skeleton type={view} />;
  }

  if (!data.length) {
    return (
      <div className="text-muted-foreground text-center bg-surface rounded-radius-lg border border-border shadow-md p-space-lg animate-fadeIn">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-space-lg">
      
{/* Sorting Dropdown */}
{onSortChange && (
  <div className="flex flex-wrap items-center gap-space-md justify-between bg-surface p-space-md rounded-radius-lg shadow-sm border border-border-secondary-hover animate-slideIn">
    <div className="flex items-center gap-2">
      <select
        value={sort ? `${String(sort.key)}-${sort.direction}` : ""}
        onChange={(e) => {
          const val = e.target.value;
          if (!val) {
            setSort(null); // reset sort
            return;
          }
          const [key, direction] = val.split('-');
          setSort({ key: key as keyof T, direction: direction as 'asc' | 'desc' });
        }}
        className="bg-card border border-border rounded-radius-md px-space-md py-space-sm text-card-foreground focus-visible:outline-ring transition-all hover:shadow-sm"
      >
        <option value="">Sort by...</option>
        {fields.map((field) => (
          <>
            <option key={`${String(field.key)}-asc`} value={`${String(field.key)}-asc`}>
              {field.label} <CircleArrowUp className="inline-block ml-space-xs" />
            </option>
            <option key={`${String(field.key)}-desc`} value={`${String(field.key)}-desc`}>
              {field.label} <CircleArrowDown className="inline-block ml-space-xs" />
            </option>
          </>
        ))}
      </select>

      {/* Clear Button Outside Select */}
      {sort && (
        <button
          onClick={() => setSort(null)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Clear Sort
        </button>
      )}
    </div>
  </div>
)}
      {/* Data View */}
      {view === 'cards' ? (
        <CardView data={data} fields={fields} onEdit={onEdit} onDelete={onDelete} />
      ) : (
        <TableView data={data} fields={fields} onEdit={onEdit} onDelete={onDelete} />
      )}

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          setPage={onPageChange}
        />
      )}
    </div>
  );
}