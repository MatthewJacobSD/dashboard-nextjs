'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/shared/utils/cn';
import { Button } from '@/components/ui/Button';

type View = 'cards' | 'table';

export function ViewToggle({ view: initialView, setView }: { view: View; setView: (view: View) => void }) {
  const [, setHoveredButton] = useState<'table' | 'cards' | null>(null);

  const handleViewChange = useCallback((newView: View) => {
    if (newView !== initialView) {
      setView(newView);
    }
  }, [initialView, setView]);

  return (
    <div className={cn("flex gap-2 sm:gap-3 animate-fade-in")}>
      {/* Table View Button */}
      <Button
        onClick={() => handleViewChange('table')}
        disabled={initialView === 'table'}
        className={cn(
          'px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-purple-500',
          initialView === 'table'
            ? 'bg-purple-600 text-white shadow-sm cursor-default'
            : 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-orange-400'
        )}
        onMouseEnter={() => setHoveredButton('table')}
        onMouseLeave={() => setHoveredButton(null)}
        aria-label="Switch to table view"
        aria-pressed={initialView === 'table'}
      >
        Table View
      </Button>

      {/* Cards View Button */}
      <Button
        onClick={() => handleViewChange('cards')}
        disabled={initialView === 'cards'}
        className={cn(
          'px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-purple-500',
          initialView === 'cards'
            ? 'bg-purple-600 text-white shadow-sm cursor-default'
            : 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-orange-400'
        )}
        onMouseEnter={() => setHoveredButton('cards')}
        onMouseLeave={() => setHoveredButton(null)}
        aria-label="Switch to cards view"
        aria-pressed={initialView === 'cards'}
      >
        Cards View
      </Button>
    </div>
  );
}