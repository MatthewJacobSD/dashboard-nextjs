import { cn } from '@/shared/utils/cn'
import { Button } from '@/components/ui/Button'

interface TableViewProps<T extends { id: string }> {
    data: T[]
    fields: {
        key: keyof T
        label: string
        render?: (value: T[keyof T], item: T) => React.ReactNode
    }[]
    onEdit: (item: T) => void
    onDelete: (item: T) => void
    onSortChange?: (sort: { key: keyof T; direction: 'asc' | 'desc' }) => void
}

export function TableView<T extends { id: string }>({
    data,
    fields,
    onEdit,
    onDelete,
    onSortChange,
}: TableViewProps<T>) {
    const handleSort = (key: keyof T) => {
        if (!onSortChange) return
        onSortChange({ key, direction: 'asc' })
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {fields.map((field) => (
                            <th
                                key={String(field.key)}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => onSortChange && handleSort(field.key)}
                            >
                                {field.label}
                            </th>
                        ))}
                        <th scope="col" className="px-6 py-3 relative">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                            {fields.map((field) => (
                                <td key={String(field.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {field.render ? field.render(item[field.key], item) : String(item[field.key] ?? '-')}
                                </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end">
                                <Button variant="ghost" size="xs" onClick={() => onEdit(item)}>
                                    Edit
                                </Button>
                                <Button variant="ghost" size="xs" onClick={() => onDelete(item)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}