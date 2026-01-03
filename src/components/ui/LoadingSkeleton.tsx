import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className, 
  variant = 'rectangular' 
}) => {
  const baseClasses = 'animate-pulse bg-muted rounded';
  
  const variantClasses = {
    text: 'h-4 w-full',
    circular: 'h-12 w-12 rounded-full',
    rectangular: 'h-24 w-full rounded-2xl',
    card: 'h-32 w-full rounded-2xl',
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)} />
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="glass-card rounded-2xl p-6 space-y-4">
    <div className="flex items-center gap-4">
      <LoadingSkeleton variant="circular" />
      <div className="space-y-2 flex-1">
        <LoadingSkeleton variant="text" className="w-1/2" />
        <LoadingSkeleton variant="text" className="w-1/3 h-3" />
      </div>
    </div>
    <LoadingSkeleton variant="text" />
    <LoadingSkeleton variant="text" className="w-3/4" />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    <LoadingSkeleton variant="text" className="h-10" />
    {Array.from({ length: rows }).map((_, i) => (
      <LoadingSkeleton key={i} variant="text" className="h-14" />
    ))}
  </div>
);
