import { useState } from 'react'
import { cn } from '@/shared/utils/cn'
import { CardView } from '@/components/ui/CardView'
import { TableView } from '@/components/ui/TableView'
import { ViewToggle } from './ViewToggle'

export type DataDisplayView = 'cards' | 'table'

export interface DataDisplayField<T> {
    key: keyof T
    label: string
    render?: (value: T[keyof T], item: T) => React.ReactNode
}

export interface DataDisplayProps<T extends { id: string }> {
    data: T[]
    isLoading?: boolean
    onEdit: (item: T) => void
    onDelete: (item: T) => void
    view?: DataDisplayView
    fields: DataDisplayField<T>[]
    emptyMessage?: string
    page?: number // 0-based
    size?: number
    totalPages?: number
    onPageChange?: (page: number, size: number) => void
    onSortChange?: (sort: { key: keyof T; direction: 'asc' | 'desc' }) => void
}

export function DataDisplay<T extends { id: string }>({
    data = [],
    isLoading = false,
    onEdit,
    onDelete,
    view = 'cards',
    fields,
    emptyMessage = 'No data found',
    page = 0,
    size = 10,
    totalPages = 1,
    onPageChange,
    onSortChange,
}: DataDisplayProps<T>) {
    const [currentView, setCurrentView] = useState<DataDisplayView>(view)

    return (
        <div className="space-y-4">
            {/* Toggle View */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Results</h2>
                <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
            </div>

            {/* Display Component */}
            {data.length > 0 ? (
                currentView === 'cards' ? (
                    <CardView data={data} fields={fields} onEdit={onEdit} onDelete={onDelete} />
                ) : (
                    <TableView
                        data={data}
                        fields={fields}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onSortChange={onSortChange}
                    />
                )
            ) : (
                <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
            )}

            {/* Pagination */}
            {totalPages > 1 && onPageChange && (
                <div className="flex justify-center mt-6">
                    <PaginationControls
                        currentPage={page + 1}
                        totalPages={totalPages}
                        pageSize={size}
                        onPageChange={(newPage, newSize) => onPageChange(newPage - 1, newSize)}
                    />
                </div>
            )}
        </div>
    )
}