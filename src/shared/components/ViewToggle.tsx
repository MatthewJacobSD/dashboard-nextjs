'use client';

interface ViewToggleProps {
  view: 'table' | 'cards';
  setView: (view: 'table' | 'cards') => void;
  className?: string;
}

export const ViewToggle = ({ 
  view,
  setView,
  className = ''
}: ViewToggleProps) => (
  <div className={`flex gap-3 ${className}`}>
    <button
      onClick={() => setView('table')}
      className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
        view === 'table'
          ? 'bg-purple-500 text-white shadow-md'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      } hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
      aria-label="Table view"
    >
      Table View
    </button>
    <button
      onClick={() => setView('cards')}
      className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
        view === 'cards'
          ? 'bg-purple-500 text-white shadow-md'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      } hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
      aria-label="Cards view"
    >
      Cards View
    </button>
  </div>
);