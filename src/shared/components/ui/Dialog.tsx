// shared/components/ui/Dialog.tsx
'use client';
import { ReactNode } from 'react';
import { Modal } from './Modal';
import { cn } from '@/shared/utils/cnUtils';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showFooter?: boolean;
}

export const Dialog = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md',
  showFooter = false
}: DialogProps) => (
  <Modal 
    isOpen={isOpen} 
    onClose={onClose}
    size={size}
    showFooter={showFooter}
    showCloseButton={false}
    className={cn(
      size === 'sm' && 'max-w-md',
      size === 'md' && 'max-w-lg',
      size === 'lg' && 'max-w-2xl'
    )}
  >
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </div>
  </Modal>
);