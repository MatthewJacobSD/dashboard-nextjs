'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '../ui/Skeleton';
import { PaginationControls } from './PaginationControls';
import { cn } from '@/shared/utils/cn';
import { CardView } from '@/components/ui/CardView';
import { TableView } from '@/components/ui/TableView';

export type DataDisplayView = 'cards' | 'table';

export interface DataDisplayField<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

export interface DataDisplayProps<T extends { id: string }> {
  data: T[];
  isLoading?: boolean;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  view?: DataDisplayView;
  fields: DataDisplayField<T>[];
  emptyMessage?: string;
  page?: number; // 0-based
  size?: number;
  totalPages?: number;
  onPageChange?: (page: number, size: number) => void;
  onSortChange?: (sort: { key: keyof T; direction: 'asc' | 'desc' }) => void;
}

export function DataDisplay<T extends { id: string }>({
  data = [],
  isLoading = false,
  onEdit,
  onDelete,
  view = 'cards',
  fields,
  emptyMessage = 'No data found',
  page: propPage = 0,
  size: propSize = 10,
  totalPages = 1,
  onPageChange,
  onSortChange,
}: DataDisplayProps<T>) {
  const [sort, setSort] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(propPage + 1); // convert 0-based to 1-based internally
  const [size, setSize] = useState(propSize);

  // Sync local state with external props
  useEffect(() => {
    setPage(propPage + 1);
  }, [propPage]);

  useEffect(() => {
    setSize(propSize);
  }, [propSize]);

  // Handle sort change
  useEffect(() => {
    if (onSortChange && sort) {
      // Only call onSortChange if sort has meaningful values
      onSortChange(sort);
    }
  }, [sort, onSortChange]); // Dependency array includes onSortChange

  const handlePaginationChange = (newPage: number, newSize: number) => {
    setPage(newPage);
    setSize(newSize);
    if (onPageChange) {
      onPageChange(newPage - 1, newSize); // convert back to 0-based
    }
  };

  if (isLoading) {
    return <Skeleton type={view} variant="primary" />;
  }

  if (!data.length) {
    return (
      <div
        className={cn(
          'text-gray-600 text-center bg-card rounded-md border border-border shadow-md p-4',
          'animate-fade-in'
        )}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sorting Dropdown */}
      {onSortChange && (
        <div
          className={cn(
            'flex flex-wrap items-center gap-2 justify-between bg-card p-2 rounded-md shadow-sm border border-border',
            'animate-slide-in'
          )}
        >
          <div className="flex items-center gap-2">
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
                'bg-card border border-border rounded-md p-2 text-gray-900',
                'focus:outline-none focus:ring-2 focus:ring-purple-500',
                'transition-all duration-200 hover:shadow-sm'
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

            {/* Clear Button */}
            {sort && (
              <button
                onClick={() => setSort(null)}
                className={cn(
                  'text-gray-600 hover:text-gray-900 hover:bg-gray-200 p-2 rounded-md',
                  'transition-all duration-200 hover:scale-105'
                )}
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
      {totalPages > 1 && (
        <PaginationControls
          page={page} // 1-based
          totalPages={totalPages}
          size={size}
          onPaginationChange={handlePaginationChange}
          className="mt-4"
        />
      )}
    </div>
  );
}