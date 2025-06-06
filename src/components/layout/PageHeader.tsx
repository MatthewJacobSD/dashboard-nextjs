'use client'

import { cn } from '@/shared/utils/cn'
import React from 'react'

interface PageHeaderProps {
  title: string
  description: string
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export const PageHeader = React.memo(
  ({
    title,
    description,
    actions,
    className = '',
    children,
  }: PageHeaderProps): React.ReactElement => {
    return (
      <header
        className={cn(
          // Base styles
          'flex flex-col gap-4 p-4 sm:p-6 rounded-lg shadow-md border border-gray-700',
          'bg-gray-900 text-white', // dark background, white text
          // Responsive layout
          'md:flex-row md:justify-between md:items-center',
          // Custom classes override
          className
        )}
        role="banner"
        aria-label={`Page header: ${title}`}
      >
        {/* Left Content */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-orange-500 leading-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-gray-300">
            {description}
          </p>
          {children && <div className="mt-2">{children}</div>}
        </div>

        {/* Right Actions */}
        {actions && (
          <div
            className="flex flex-wrap gap-2 justify-start md:justify-end"
            role="toolbar"
            aria-label={`Actions for ${title}`}
          >
            {actions}
          </div>
        )}
      </header>
    )
  }
)

PageHeader.displayName = 'PageHeader'