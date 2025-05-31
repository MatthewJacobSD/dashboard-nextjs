// Utility for clean class merging
import { cn } from '@/lib/utils';

// Props for the action button, typed for safety
interface ActionIconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

// Icon button for actions, small but mighty
export function ActionIconButton({
  icon,
  label,
  onClick,
  className,
}: ActionIconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-8 w-8 rounded-md flex items-center justify-center bg-white/90 text-gray-700 transition-all duration-200 hover:bg-cyan-100 hover:text-cyan-500 hover:scale-105 focus:ring-2 focus:ring-cyan-300 focus:outline-none',
        className
      )}
      aria-label={label}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
}