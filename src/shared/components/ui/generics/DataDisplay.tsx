'use client';

import { cn } from '@/shared/utils/cnUtils';
import { Edit, Trash } from 'lucide-react';
import { ActionIconButton } from '@/shared/components/ActionIconButton';
import { SkeletonCards, SkeletonTable } from '../Skeleton';

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
}

export function DataDisplay<T extends { id: string }>({
  data = [],
  isLoading = false,
  onEdit,
  onDelete,
  view = 'cards',
  fields,
  emptyMessage = 'No data found',
}: DataDisplayProps<T>) {
  if (isLoading) {
    return view === 'cards' ? <SkeletonCards /> : <SkeletonTable />;
  }

  if (!data.length) {
    return (
      <div className="text-lg text-gray-500 p-4 sm:p-6 lg:p-8 text-center">
        {emptyMessage}
      </div>
    );
  }

  return view === 'cards' ? (
    <CardView data={data} fields={fields} onEdit={onEdit} onDelete={onDelete} />
  ) : (
    <TableView data={data} fields={fields} onEdit={onEdit} onDelete={onDelete} />
  );
}

function CardView<T extends { id: string }>({
  data,
  fields,
  onEdit,
  onDelete,
}: Omit<DataDisplayProps<T>, 'view' | 'emptyMessage'>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6 lg:p-8">
      {data.map((item) => (
        <div
          key={item.id}
          className={cn(
            'border border-gray-200/50 p-4 sm:p-6 rounded-xl shadow-sm bg-white/95 backdrop-blur-sm hover:bg-purple-50 transition-all duration-200'
          )}
        >
          <div className="flex justify-between items-start">
            <p className="font-semibold text-gray-800 text-base sm:text-lg">
              {String(item[fields[0].key])}
            </p>
            <div className="flex gap-2">
              <ActionIconButton
                icon={<Edit className="h-4 w-4" />}
                label="Edit"
                onClick={() => onEdit(item)}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-md p-2 focus:ring-2 focus:ring-cyan-300 focus:outline-none"
              />
              <ActionIconButton
                icon={<Trash className="h-4 w-4" />}
                label="Delete"
                onClick={() => onDelete(item)}
                className="bg-red-500 hover:bg-red-600 text-white rounded-md p-2 focus:ring-2 focus:ring-cyan-300 focus:outline-none"
              />
            </div>
          </div>

          {fields.slice(1).map((field) => (
            <p key={String(field.key)} className="text-sm text-gray-600 mt-2">
              {field.label}:{' '}
              {field.render
                ? field.render(item[field.key], item)
                : String(item[field.key] ?? '-')}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

function TableView<T extends { id: string }>({
  data,
  fields,
  onEdit,
  onDelete,
}: Omit<DataDisplayProps<T>, 'view' | 'emptyMessage'>) {
  return (
    <div className="rounded-lg border border-gray-200/50 bg-white/95 backdrop-blur-sm overflow-hidden shadow-sm">
      <table className="w-full text-gray-800 text-sm sm:text-base">
        <thead className="bg-purple-100 text-gray-600">
          <tr>
            {fields.map((field) => (
              <th key={String(field.key)} className="p-4 text-left font-medium">
                {field.label}
              </th>
            ))}
            <th className="p-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className={cn(
                'border-t border-gray-200/30 hover:bg-purple-50 transition-all duration-200'
              )}
            >
              {fields.map((field) => (
                <td key={String(field.key)} className="p-4">
                  {field.render
                    ? field.render(item[field.key], item)
                    : String(item[field.key] ?? '-')}
                </td>
              ))}
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <ActionIconButton
                    icon={<Edit className="h-4 w-4" />}
                    label="Edit"
                    onClick={() => onEdit(item)}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-md p-2 focus:ring-2 focus:ring-cyan-300 focus:outline-none"
                  />
                  <ActionIconButton
                    icon={<Trash className="h-4 w-4" />}
                    label="Delete"
                    onClick={() => onDelete(item)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-md p-2 focus:ring-2 focus:ring-cyan-300 focus:outline-none"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}