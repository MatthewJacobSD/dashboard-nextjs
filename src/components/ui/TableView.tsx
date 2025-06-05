import { cn } from '@/shared/utils/cn';
import { DataDisplayProps } from '@/components/state/DataDisplay';
import { Edit, Trash } from 'lucide-react';
import { Button } from './Button';

export function TableView<T extends { id: string }>({
  data,
  fields,
  onEdit,
  onDelete,
}: Omit<DataDisplayProps<T>, 'view' | 'emptyMessage'>) {
  return (
    <div className="border border-border rounded-m shadow-sm overflow-hidden animate-fade-in">
      <table className="w-full table">
        <thead className="bg-gray-700 text-orange-500">
          <tr>
            {fields.map((field) => (
              <th
                key={String(field.key)}
                className="px-m py-sm text-left font-bold uppercase text-sm tracking-wider"
              >
                {field.label}
              </th>
            ))}
            <th className="px-m py-sm text-right font-bold uppercase text-sm tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item, index) => (
            <tr
              key={item.id}
              className={cn(
                'transition-colors duration-150',
                'hover:bg-gray-350',
                index % 2 === 0 ? 'bg-card' : 'bg-gray-300'
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {fields.map((field) => (
                <td
                  key={String(field.key)}
                  className="px-m py-sm group"
                >
                  <div className="hidden md:block text-gray-900">
                    {field.render
                      ? field.render(item[field.key], item)
                      : String(item[field.key] ?? '-')}
                  </div>
                  <div className="md:hidden flex flex-col">
                    <span className="text-yellow-500 text-xs font-medium">
                      {field.label}
                    </span>
                    <span className="text-gray-700">
                      {field.render
                        ? field.render(item[field.key], item)
                        : String(item[field.key] ?? '-')}
                    </span>
                  </div>
                </td>
              ))}
              <td className="px-m py-sm">
                <div className="flex justify-end gap-xs">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onEdit(item)}
                    className="text-purple-500 hover:bg-purple-500/10"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    <span className="sr-only md:not-sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onDelete(item)}
                    className="text-red-500 hover:bg-red-500/10"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    <span className="sr-only md:not-sr-only">Delete</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}