import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges and conditionally joins class names together with Tailwind-merge support.
 * This utility combines clsx and tailwind-merge for optimal class name handling.
 * 
 * @function cn
 * @param {...ClassValue[]} inputs - Array of class values (strings, arrays, objects)
 * @returns {string} The merged and optimized class string
 * 
 * @example
 * // Basic usage
 * cn('px-2 py-1', 'bg-red-500', 'hover:bg-red-600');
 * 
 * @example
 * // Conditional classes
 * cn('p-4', isActive && 'bg-blue-500', !isValid && 'text-red-500');
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
