'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

/* ===== Types ===== */
interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  autoClose?: number; // Time in milliseconds (e.g., 3000 for 3 seconds)
}

/* ===== Dialog Component ===== */
export function Dialog({
  open,
  onClose,
  children,
  className = '',
  title,
  autoClose,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<number | null>(null); // To store timeout ID

  /* Handle click outside to close */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent scrolling

      // Set auto-close timeout
      if (autoClose) {
        timeoutRef.current = window.setTimeout(() => {
          onClose();
        }, autoClose);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = ''; // Restore scrolling

      // Clear timeout on unmount or dialog close
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [open, onClose, autoClose]);

  /* Handle Escape key and focus trapping */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleTab = (event: KeyboardEvent) => {
      if (!dialogRef.current) return;

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstFocusableRef.current = firstElement;
      lastFocusableRef.current = lastElement;

      if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTab);
      firstFocusableRef.current?.focus(); // Focus first element when dialog opens
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-m',
        'animate-fade-in'
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'dialog-title' : undefined}
    >
      <div
        ref={dialogRef}
        className={cn(
          'dialog bg-card rounded-md shadow-md p-8 max-w-md w-full mx-auto',
          'sm:max-w-lg', // Slightly wider on larger screens
          'animate-slide-in',
          className
        )}
      >
        <div className="flex justify-between items-center mb-m">
          {title && (
            <h2 id="dialog-title" className="text-heading font-bold text-orange-500">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className={cn(
              'p-sm rounded-m hover:bg-gray-350 hover:text-gray-900',
              'transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-purple-accent'
            )}
            aria-label="Close dialog"
          >
            <X className="h-5 w-5 text-gray-575" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}