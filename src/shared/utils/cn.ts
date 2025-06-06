import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names using `clsx` for conditional logic
 * and `tailwind-merge` to resolve Tailwind conflicts.
 *
 * @param inputs - A list of class values (strings, arrays, or objects).
 * @returns A merged, conflict-resolved class string.
 *
 * @example
 * cn("p-4", condition && "bg-blue-500", { "text-white": isDarkMode })
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
