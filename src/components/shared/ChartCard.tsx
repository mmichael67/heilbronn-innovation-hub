import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  insight?: string;
  delay?: number;
}

export function ChartCard({
  title,
  subtitle,
  children,
  className,
  headerAction,
  insight,
  delay = 0,
}: ChartCardProps) {
  return (
    <motion.div
      className={cn("chart-container", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {headerAction}
      </div>
      
      {children}

      {insight && (
        <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-xs text-accent flex items-start gap-2">
            <span className="text-lg">💡</span>
            <span className="leading-relaxed">{insight}</span>
          </p>
        </div>
      )}
    </motion.div>
  );
}
