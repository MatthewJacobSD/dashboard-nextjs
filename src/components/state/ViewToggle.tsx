import { useState } from 'react'
import { cn } from '@/shared/utils/cn'
import { Button } from '@/components/ui/Button'

export type DataDisplayView = 'cards' | 'table'

interface ViewToggleProps {
    currentView: DataDisplayView
    onViewChange: (view: DataDisplayView) => void
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
    return (
        <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange('cards')}
                className={cn(
                    'rounded-none px-3 py-1.5 text-sm font-medium',
                    currentView === 'cards'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                )}
            >
                Cards
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange('table')}
                className={cn(
                    'rounded-none px-3 py-1.5 text-sm font-medium',
                    currentView === 'table'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                )}
            >
                Table
            </Button>
        </div>
    )
}