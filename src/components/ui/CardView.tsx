import { cn } from '@/shared/utils/cn';
import { DataDisplayProps } from '@/components/state/DataDisplay';
import { Button } from '@/components/ui/Button';
import { Edit, Trash } from 'lucide-react';

export function CardView<T extends { id: string }>({
  data,
  fields,
  onEdit,
  onDelete,
}: Omit<DataDisplayProps<T>, 'view' | 'emptyMessage'>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg p-space-lg">
      {data.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            'card p-space-lg bg-accent-bg text-accent-foreground border border-orange/30 rounded-radius-lg shadow-sm hover:shadow-xl',
            'transition-all duration-300 hover:-translate-y-1 animate-fadeIn'
          )}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex justify-between items-start">
            <p className="font-semibold text-font-size-heading text-orange">
              {String(item[fields[0].key])}
            </p>
            <div className="flex gap-space-sm">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(item)}
                className="rounded-button bg-purple/30 hover:bg-purple/50 focus-visible:outline-ring"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(item)}
                className="rounded-button bg-red/30 hover:bg-red/50 focus-visible:outline-ring"
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>

          {fields.slice(1).map((field) => (
            <p key={String(field.key)} className="text-font-size-base text-gray-300 mt-space-sm">
              <span className="font-medium text-cyan">{field.label}:</span>{' '}
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