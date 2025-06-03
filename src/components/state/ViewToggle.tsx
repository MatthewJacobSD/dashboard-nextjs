/*============Imports============*/
import { useState, useCallback } from 'react';
import { Ban } from 'lucide-react';
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
    <div className="flex flex-wrap gap-space-md">
      {/* Table View Button */}
      <Button
        variant={initialView === 'table' ? 'secondary' : 'outline'}
        onClick={() => handleViewChange('table')}
        disabled={initialView === 'table'}
        className={`
          text-card-foreground whitespace-nowrap
          ${initialView === 'table'
            ? 'rounded-button bg-green/30 hover:bg-green/50 cursor-not-allowed'
            : 'rounded-button bg-card hover:bg-gray-200'
          }
          transition-all duration-200
        `}
        onMouseEnter={() => setIsHoveringTable(true)}
        onMouseLeave={() => setIsHoveringTable(false)}
      >
        {initialView === 'table' && isHoveringTable && (
          <Ban className="w-4 h-4 mr-2 text-red" />
        )}
        Table View
      </Button>

      {/* Cards View Button */}
      <Button
        variant={initialView === 'cards' ? 'secondary' : 'outline'}
        onClick={() => handleViewChange('cards')}
        disabled={initialView === 'cards'}
        className={`
          text-card-foreground whitespace-nowrap
          ${initialView === 'cards'
            ? 'rounded-button bg-green/30 hover:bg-green/50 cursor-not-allowed m-auto'
            : 'rounded-button bg-card hover:bg-gray-200 m-auto'
          }
          transition-all duration-200
        `}
        onMouseEnter={() => setIsHoveringCards(true)}
        onMouseLeave={() => setIsHoveringCards(false)}
      >
        {initialView === 'cards' && isHoveringCards && (
          <Ban className="w-4 h-4 mr-2 text-red" />
        )}
        Cards View
      </Button>
    </div>
  );
}