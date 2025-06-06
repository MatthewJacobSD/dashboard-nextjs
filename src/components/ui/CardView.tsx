import { cn } from '@/shared/utils/cn'
import { Button } from './Button'
import { Edit, Trash } from 'lucide-react'

interface CardViewProps<T extends { id: string }> {
    data: T[]
    fields: { key: keyof T; label: string }[]
    onEdit: (item: T) => void
    onDelete: (item: T) => void
}

export function CardView<T extends { id: string }>({ data, fields, onEdit, onDelete }: CardViewProps<T>) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {data.map((item, index) => (
                <div
                    key={item.id}
                    className={cn(
                        'bg-gray-900/90 backdrop-blur-sm border border-gray-100/50 border-l-6 border-t-6 rounded-xl p-5 shadow-md',
                        'hover:bg-gray-800/90 hover:shadow-xl hover:-translate-y-1',
                        'transition-all duration-300 ease-in-out',
                        'animate-fadeIn'
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-orange-500 hover:underline">{String(item[fields[0].key])}</h3>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => onEdit(item)}
                                className="text-purple-300 hover:bg-purple-500/10 group"
                                aria-label="Edit"
                            >
                                <Edit className="h-4 w-4 transition-all duration-200 transform group-hover:scale-110" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => onDelete(item)}
                                className="text-red-400 hover:bg-red-500/10 group"
                                aria-label="Delete"
                            >
                                <Trash className="h-4 w-4 transition-all duration-200 transform group-hover:scale-110" />
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {fields.slice(1).map((field) => (
                            <div key={String(field.key)} className="text-sm">
                                <span className="font-medium text-cyan-400">{field.label}:</span> {String(item[field.key])}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}