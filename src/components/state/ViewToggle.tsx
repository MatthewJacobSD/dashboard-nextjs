'use client';

/*============Imports============*/
import { useState, useCallback } from 'react';
import { Ban } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Button } from '@/components/ui/Button';

/*============Types============*/
type View = 'cards' | 'table';

/*============ViewToggle Component============*/
/**
 * Toggle between card and table views with active state and disabled behavior.
 */
export function ViewToggle({ view: initialView, setView }: { view: View; setView: (view: View) => void }) {
  const [isHoveringTable, setIsHoveringTable] = useState(false);
  const [isHoveringCards, setIsHoveringCards] = useState(false);

  const handleViewChange = useCallback((newView: View) => {
    if (newView !== initialView) {
      setView(newView);
    }
  }, [initialView, setView]);

  return (
    <div className={cn("flex flex-wrap gap-m animate-fade-in")}>
      {/* Table View Button */}
      <Button
        variant={initialView === 'table' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => handleViewChange('table')}
        disabled={initialView === 'table'}
        className={cn(
          'btn text-gray-900 whitespace-nowrap',
          initialView === 'table'
            ? 'bg-purple-500/30 text-purple-500 cursor-not-allowed shadow-sm'
            : 'bg-card hover:bg-gray-350 hover:text-purple-500',
          'transition-all duration-200 hover:scale-105'
        )}
        onMouseEnter={() => setIsHoveringTable(true)}
        onMouseLeave={() => setIsHoveringTable(false)}
        aria-label="Switch to table view"
        aria-disabled={initialView === 'table'}
      >
        {initialView === 'table' && isHoveringTable && (
          <Ban className="w-4 h-4 mr-1 text-red-500" />
        )}
        Table View
      </Button>

      {/* Cards View Button */}
      <Button
        variant={initialView === 'cards' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => handleViewChange('cards')}
        disabled={initialView === 'cards'}
        className={cn(
          'btn text-gray-900 whitespace-nowrap',
          initialView === 'cards'
            ? 'bg-purple-500/30 text-purple-500 cursor-not-allowed shadow-sm'
            : 'bg-card hover:bg-gray-350 hover:text-purple-500',
          'transition-all duration-200 hover:scale-105'
        )}
        onMouseEnter={() => setIsHoveringCards(true)}
        onMouseLeave={() => setIsHoveringCards(false)}
        aria-label="Switch to cards view"
        aria-disabled={initialView === 'cards'}
      >
        {initialView === 'cards' && isHoveringCards && (
          <Ban className="w-4 h-4 mr-1 text-red-500" />
        )}
        Cards View
      </Button>
    </div>
  );
}