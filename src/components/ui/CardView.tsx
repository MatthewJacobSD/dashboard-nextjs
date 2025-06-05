import { cn } from '@/shared/utils/cn';
import { DataDisplayProps } from '@/components/state/DataDisplay';
import { Button } from './Button';
import { Edit, Trash } from 'lucide-react';

export function CardView<T extends { id: string }>({
  data,
  fields,
  onEdit,
  onDelete,
}: Omit<DataDisplayProps<T>, 'view' | 'emptyMessage'>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-m p-m">
      {data.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            'bg-card border border-border rounded-m p-m shadow-sm',
            'transition-all duration-200 hover:shadow-md',
            'hover:-translate-y-0.5 hover:border-orange-500/30',
            'animate-fade-in'
          )}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Card Header */}
          <div className="flex justify-between items-start mb-m">
            <h3 className="text-heading font-semibold text-orange-500">
              {String(item[fields[0].key])}
            </h3>
            <div className="flex gap-xs">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onEdit(item)}
                className="text-purple-500 hover:bg-purple-500/10"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onDelete(item)}
                className="text-red-500 hover:bg-red-500/10"
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>

          {/* Card Content */}
          <div className="space-y-xs">
            {fields.slice(1).map((field) => (
              <div key={String(field.key)} className="text-base">
                <span className="font-medium text-cyan-500">{field.label}:</span>{' '}
                <span className="text-gray-700">
                  {field.render
                    ? field.render(item[field.key], item)
                    : String(item[field.key] ?? '-')}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}