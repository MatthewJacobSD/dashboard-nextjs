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
    <div className="table-container bg-accent-bg text-card-foreground border border-border rounded-radius-xl shadow-sm overflow-hidden animate-fadeIn">
      <table className="w-full text-font-size-base">
        <thead className="bg-gray-900 text-orange">
          <tr>
            {fields.map((field) => (
              <th
                key={String(field.key)}
                className="p-space-md text-left font-semibold uppercase tracking-wider text-xs"
              >
                {field.label}
              </th>
            ))}
            <th className="p-space-md text-right font-semibold uppercase tracking-wider text-xs">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              className={cn(
                'border-t border-border transition-all duration-200',
                'hover:scale-[1.01] hover:shadow-md hover:z-10',
                index % 2 === 0 ? 'bg-surface' : 'bg-card'
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {fields.map((field) => (
                <td
                  key={String(field.key)}
                  className="p-space-md text-gray-300 relative group"
                >
                  <span className="hidden md:inline">
                    {field.render
                      ? field.render(item[field.key], item)
                      : String(item[field.key] ?? '-')}
                  </span>
                  <div className="md:hidden flex flex-col">
                    <span className="text-yellow text-xs font-medium">{field.label}</span>
                    <span>
                      {field.render
                        ? field.render(item[field.key], item)
                        : String(item[field.key] ?? '-')}
                    </span>
                  </div>
                </td>
              ))}
              <td className="p-space-md text-right">
                <div className="flex justify-end gap-space-sm">
                  <Button
                    variant="secondary"
                    size='sm'
                    onClick={() => onEdit(item)}
                    className="rounded-button bg-purple/30 hover:bg-purple/50 text-card-foreground focus-visible:outline-ring"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size='sm'
                    onClick={() => onDelete(item)}
                    className="rounded-button bg-red/30 hover:bg-red/50 text-card-foreground focus-visible:outline-ring"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
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