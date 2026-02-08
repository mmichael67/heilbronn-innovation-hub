import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const variantColors = {
  default: 'from-primary to-accent',
  success: 'from-green-500 to-emerald-400',
  warning: 'from-amber-500 to-yellow-400',
  danger: 'from-red-500 to-rose-400',
};

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  variant = 'default',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-1.5">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showValue && (
            <span className="font-medium">{value.toLocaleString()} / {max.toLocaleString()}</span>
          )}
        </div>
      )}
      <div className={cn("progress-bar", sizeClasses[size])}>
        <motion.div
          className={cn(
            "h-full rounded-full bg-gradient-to-r",
            variantColors[variant]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
