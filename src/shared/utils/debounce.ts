/**
 * Creates a debounced function that delays invoking `func` until after `delay` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @function debounce
 * @template T - The type of the function to debounce
 * @param {T} func - The function to debounce
 * @param {number} delay - The number of milliseconds to delay
 * @returns {(...args: Parameters<T>) => void} - The debounced function
 * 
 * @example
 * // Basic usage
 * const debouncedHandler = debounce((searchQuery: string) => {
 *   console.log(searchQuery);
 * }, 300);
 * 
 * // Later in code
 * debouncedHandler('react hooks');
 * 
 * @example
 * // With event handler
 * const handleInput = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
 *   console.log(event.target.value);
 * }, 200);
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}