// Utility for slick class merging
import { cn } from '@/lib/utils';

// Props for the modal, keeping it structured
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Modal component, pops up with style
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Don't render if not open, keep it clean
  if (!isOpen) return null;

  // Render modal with a bright, animated look
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        className={cn(
          'bg-white/95 backdrop-blur-md rounded-xl p-4 sm:p-6 lg:p-8 max-w-lg w-full shadow-xl border border-purple-300',
          'animate-in fade-in zoom-in-90 duration-300'
        )}
      >
        {/* Modal header with title and close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-yellow-500">{title}</h2>
          <button
            onClick={onClose}
            className="text-orange-500 hover:text-orange-600 transition-colors duration-200 focus:ring-2 focus:ring-cyan-300 focus:outline-none"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {/* Modal content, ready for action */}
        {children}
      </div>
    </div>
  );
}