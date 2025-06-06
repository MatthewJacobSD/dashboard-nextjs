import { useState } from 'react'
import { cn } from '@/shared/utils/cn'
import { Button } from '@/components/ui/Button'

interface SortOption {
    key: string
    label: string
}

interface SortProps {
    options: SortOption[]
    onChange: (key: string, direction: 'asc' | 'desc') => void
}

export function Sort({ options, onChange }: SortProps) {
    const [selected, setSelected] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

    const handleSort = (key: string) => {
        const newDirection = selected?.key === key && selected.direction === 'asc' ? 'desc' : 'asc'
        setSelected({ key, direction: newDirection })
        onChange(key, newDirection)
    }

    return (
        <div className="inline-flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Sort by:
            </label>
            <select
                id="sort"
                onChange={(e) => handleSort(e.target.value)}
                value={selected?.key || ''}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Select field</option>
                {options.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {selected && (
                <Button variant="ghost" size="xs" onClick={() => onChange('', 'asc')}>
                    Clear
                </Button>
            )}
        </div>
    )
}