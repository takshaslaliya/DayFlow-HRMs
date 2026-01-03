import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'primary' | 'muted';
  className?: string;
}

const variantClasses = {
  default: 'badge-primary',
  success: 'badge-success',
  warning: 'badge-warning',
  destructive: 'badge-destructive',
  primary: 'badge-primary',
  muted: 'badge-muted',
};

export const StatusBadge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  className 
}) => {
  return (
    <span className={cn('badge', variantClasses[variant], className)}>
      {children}
    </span>
  );
};

export const getLeaveStatusVariant = (status: string): BadgeProps['variant'] => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'destructive';
    default:
      return 'muted';
  }
};

export const getAttendanceStatusVariant = (status: string): BadgeProps['variant'] => {
  switch (status) {
    case 'present':
      return 'success';
    case 'late':
      return 'warning';
    case 'absent':
      return 'destructive';
    case 'half-day':
      return 'primary';
    case 'leave':
      return 'muted';
    default:
      return 'muted';
  }
};

export const getLeaveTypeVariant = (type: string): BadgeProps['variant'] => {
  switch (type) {
    case 'paid':
      return 'success';
    case 'sick':
      return 'warning';
    case 'unpaid':
      return 'destructive';
    case 'personal':
      return 'primary';
    default:
      return 'muted';
  }
};
