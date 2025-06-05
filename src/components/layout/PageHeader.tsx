'use client';

import { cn } from '@/shared/utils/cn';
import React from 'react';

/* ============ Type Definitions ============ */

/**
 * Props for the PageHeader component
 * 
 * @property {string} title - The main heading text (required)
 * @property {string} description - The subheading text (required)
 * @property {React.ReactNode} [actions] - Optional action buttons or elements
 * @property {string} [className] - Additional CSS classes for custom styling
 * @property {React.ReactNode} [children] - Optional children elements
 */
interface PageHeaderProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/* ============ PageHeader Component ============ */

/**
 * A reusable page header component with consistent styling and layout.
 * 
 * Features:
 * - Responsive layout (vertical on mobile, horizontal on larger screens)
 * - Proper ARIA attributes for accessibility
 * - Animation on mount
 * - Optional action buttons area
 * - Customizable styling
 * 
 * @param {PageHeaderProps} props - Component properties
 * @returns {React.ReactElement} A fully accessible page header component
 */
export const PageHeader = React.memo(
  ({
    title,
    description,
    actions,
    className = '',
    children,
  }: PageHeaderProps): React.ReactElement => {
    console.log('🏷️ Rendering PageHeader with title:', title);

    return (
      <header
        className={cn(
          'flex flex-col sm:flex-row justify-between items-start sm:items-center',
          'gap-m mb-m p-m bg-card rounded-m shadow-md border border-border',
          'animate-fade-in',
          className
        )}
        role="banner"
        aria-label={`Page header: ${title}`}
      >
        <div className="space-y-xs">
          <h1 className="text-heading font-bold text-orange-500">
            {title}
          </h1>
          <p className="text-base text-gray-575">
            {description}
          </p>
          {children}
        </div>
        
        {actions && (
          <div 
            className="flex gap-xs flex-wrap" 
            role="toolbar" 
            aria-label={`Actions for ${title}`}
          >
            {actions}
          </div>
        )}
      </header>
    );
  }
);

PageHeader.displayName = 'PageHeader';