import { cn } from '@/shared/utils/cn';

export function ErrorFallback() {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-6',
      'bg-white dark:bg-gray-800 rounded-xl',
      'shadow-sm border border-gray-100 dark:border-gray-700',
      'text-center text-red-500 dark:text-red-400'
    )}>
      <span className="text-4xl mb-2">⚠️</span>
      <h2 className="font-bold text-lg">Something went wrong</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Please refresh the page or contact support.
      </p>
    </div>
  );
}