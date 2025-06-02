// shared/components/ui/Modal.tsx
'use client';

import { cn } from '@/shared/utils/cnUtils';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // Made optional since Dialog handles its own title
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string; // Add className prop
  showCloseButton?: boolean; // Add option to hide close button
  showFooter?: boolean; // Add option to hide footer
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className = '',
  showCloseButton = true,
  showFooter = true
}: ModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Modal container */}
        <div
          className={cn(
            'inline-block w-full overflow-hidden text-left align-bottom transition-all transform',
            'bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle',
            sizeClasses[size],
            'sm:w-full',
            className // Include passed className
          )}
        >
          {/* Modal header - only show if title exists */}
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
              {showCloseButton && (
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          )}

          {/* Modal content */}
          <div className="px-6 py-4">{children}</div>

          {/* Modal footer - optional */}
          {showFooter && (
            <div className="px-6 py-4 bg-gray-50 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full px-4 py-2 text-base font-medium text-white bg-primary rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}