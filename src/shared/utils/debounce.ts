/**
 * Creates a debounced version of the provided function.
 *
 * The returned function will only run after `delay` milliseconds have passed
 * since the last time it was invoked.
 *
 * Useful for:
 * - Input search fields
 * - Resize events
 * - Optimizing frequent user interactions
 *
 * @template T - The function type being debounced
 * @param func - The function to debounce
 * @param delay - Time in milliseconds to wait before invoking the function
 * @returns A debounced function that can be called multiple times,
 *          but will execute only once after the delay
 *
 * @example
 * const logSearch = debounce((query: string) => {
 *   console.log('Searching:', query)
 * }, 300)
 *
 * // Call as many times as you want
 * logSearch('a')
 * logSearch('ap')
 * logSearch('app') // Only this one runs after 300ms
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = null
    }, delay)
  }
}
