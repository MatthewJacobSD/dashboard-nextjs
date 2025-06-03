'use client';

/*============Imports============*/
import { cn } from '@/shared/utils/cn';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

/*============Types============*/
/**
 * Props for the Dialog component.
 */
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showCloseButton?: boolean;
  showFooter?: boolean;
}

/*============Dialog Component============*/
/**
 * Reusable modal dialog component with animations, keyboard support,
 * and optional footer and close button.
 */
export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
  showCloseButton = true,
  showFooter = true,
}: DialogProps) {
  /** Log open/close state changes */
  useEffect(() => {
    console.log(`🪟 Dialog ${isOpen ? 'opened' : 'closed'} 🚀`);
  }, [isOpen]);

  /** Close on Escape key press */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('🔒 Closed dialog with Escape key 🚀');
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  /** Don't render if closed */
  if (!isOpen) return null;

  /** Size classes */
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-space-lg">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-dark/60 backdrop-blur-md transition-opacity duration-300"
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Dialog content */}
        <div
          className={cn(
            'dialog relative w-full text-card-foreground',
            'transition-all duration-300 transform scale-95 opacity-0 animate-fadeIn',
            sizeClasses[size],
            className
          )}
        >
          {/* Header */}
          {title && (
            <header className="flex items-center justify-between px-space-lg py-space-md border-b border-border">
              <h3 className="font-bold text-accent-foreground">{title}</h3>
              {showCloseButton && (
                <button
                  type="button"
                  className="p-space-sm rounded-radius-sm text-muted-foreground hover:bg-gray-100 focus-visible:outline-ring"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </header>
          )}

          {/* Body */}
          <div className="px-space-lg py-space-md">{children}</div>

          {/* Footer */}
          {showFooter && (
            <footer className="px-space-lg py-space-md bg-surface rounded-b-radius-xl flex justify-end gap-space-sm">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};

Dialog.displayName = 'Dialog';