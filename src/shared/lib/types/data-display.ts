/**
 * Available display views for data rendering.
 */
export type DataDisplayView = 'cards' | 'table'

/**
 * Configuration for rendering a single field in data displays.
 *
 * @template T - The type of data being displayed
 */
export interface DataDisplayField<T> {
  key: keyof T
  label: string
  render?: (value: T[keyof T], item: T) => React.ReactNode
}

/**
 * Props for generic data display components like `DataDisplay`.
 *
 * @template T - The type of data being rendered
 */
export interface DataDisplayProps<T extends { id: string }> {
  data: T[]
  isLoading?: boolean
  onEdit: (item: T) => void
  onDelete: (item: T) => void
  view?: DataDisplayView
  fields: DataDisplayField<T>[]
  emptyMessage?: string
  page?: number // Zero-based
  size?: number
  totalPages?: number
  onPageChange?: (page: number, size: number) => void
  onSortChange?: (sort: { key: keyof T; direction: 'asc' | 'desc' }) => void
}
