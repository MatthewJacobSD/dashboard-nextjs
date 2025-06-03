/*============Imports============*/
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

/*============Types============*/
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  up: boolean | null;
  iconColor?: string;
}

/*============StatCard Component============*/
export function StatCard({
  title,
  value,
  icon: Icon,
  desc,
  up,
  iconColor = 'text-orange',
}: StatCardProps) {
  return (
    <div className={cn(
      'card p-6 transition-all duration-300 ease-in-out',
      'bg-white border border-gray-200 rounded-lg',
      'hover:shadow-xl hover:-translate-y-1 hover:border-orange/30',
      'group cursor-pointer',
      'animate-fadeIn',
      'h-full flex flex-col justify-between'
    )}>
      {/* Header with title and trend indicator */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Icon className={cn(
            `w-6 h-6 ${iconColor}`,
            'transition-transform duration-300 group-hover:scale-110'
          )} />
          <span className="transition-colors duration-300 group-hover:text-orange">
            {title}
          </span>
        </h3>
        <div className="flex items-center gap-2">
          {up === true && (
            <TrendingUp className="w-5 h-5 text-green animate-pulse duration-1000" />
          )}
          {up === false && (
            <TrendingDown className="w-5 h-5 text-red animate-pulse duration-1000" />
          )}
          {up === null && (
            <span className="text-gray-400">—</span>
          )}
        </div>
      </div>

      {/* Value and description with more spacing */}
      <div className="mt-4 transition-all duration-500 group-hover:pl-1">
        <p className={cn(
          'text-3xl font-bold text-gray-900',
          'transition-all duration-300 group-hover:text-orange'
        )}>
          {value.toLocaleString()}
        </p>
        <p className={cn(
          'text-sm text-gray-500 mt-2',
          'transition-all duration-300 group-hover:text-gray-700'
        )}>
          {desc}
        </p>
      </div>
    </div>
  );
}