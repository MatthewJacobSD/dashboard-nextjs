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
    <div className={cn(
      "border border-gray-700 rounded-xl overflow-hidden shadow-md",
      "transition-shadow duration-300 hover:shadow-xl bg-gray-800/80 backdrop-blur-sm"
    )}>
      <table className="w-full table-auto">
        <thead className="bg-gray-900 text-orange-500">
          <tr>
            {fields.map((field) => (
              <th
                key={String(field.key)}
                className="px-5 py-4 text-left font-bold uppercase text-xs tracking-wider"
              >
                {field.label}
              </th>
            ))}
            <th className="px-5 py-4 text-right font-bold uppercase text-xs tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((item, index) => (
            <tr
              key={item.id}
              className={cn(
                'transition-all duration-200',
                index % 2 === 0
                  ? 'bg-gray-900/70 hover:bg-gray-800/90'
                  : 'bg-gray-800/70 hover:bg-gray-900/60',
                'hover:shadow-inner'
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {fields.map((field) => (
                <td
                  key={String(field.key)}
                  className="px-5 py-4 group"
                >
                  <div className="hidden md:block text-gray-300">
                    {field.render
                      ? field.render(item[field.key], item)
                      : String(item[field.key] ?? '-')}
                  </div>
                  <div className="md:hidden flex flex-col">
                    <span className="text-orange-500 text-xs font-medium">
                      {field.label}
                    </span>
                    <span className="text-gray-300">
                      {field.render
                        ? field.render(item[field.key], item)
                        : String(item[field.key] ?? '-')}
                    </span>
                  </div>
                </td>
              ))}
              <td className="px-5 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onEdit(item)}
                    className="text-purple-400 hover:bg-purple-500/10 group"
                    aria-label="Edit"
                  >
                    <Edit className="h-4 w-4 transition-all duration-200 transform group-hover:scale-110 group-hover:stroke-[2.5]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onDelete(item)}
                    className="text-red-400 hover:bg-red-500/10 group"
                    aria-label="Delete"
                  >
                    <Trash className="h-4 w-4 transition-all duration-200 transform group-hover:scale-110 group-hover:stroke-[2.5]" />
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