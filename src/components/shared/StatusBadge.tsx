import { cn } from '@/lib/utils';

type Status = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: Status;
  label: string;
  pulse?: boolean;
}

const statusStyles: Record<Status, string> = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  info: 'badge-info',
  neutral: 'bg-muted text-muted-foreground border-border',
};

const dotStyles: Record<Status, string> = {
  success: 'status-dot-success',
  warning: 'status-dot-warning',
  danger: 'status-dot-danger',
  info: 'status-dot-info',
  neutral: 'bg-muted-foreground',
};

export function StatusBadge({ status, label, pulse = false }: StatusBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
      statusStyles[status]
    )}>
      <span className={cn(
        "status-dot",
        dotStyles[status],
        pulse && "animate-pulse"
      )} />
      {label}
    </span>
  );
}
