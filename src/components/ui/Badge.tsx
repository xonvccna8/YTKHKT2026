import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-teal-500/20 text-teal-300 shadow-[0_0_10px_rgba(20,184,166,0.2)]": variant === 'default',
          "border-transparent bg-slate-800 text-slate-300": variant === 'secondary',
          "border-transparent bg-emerald-500/20 text-emerald-300": variant === 'success',
          "border-transparent bg-amber-500/20 text-amber-300": variant === 'warning',
          "border-transparent bg-rose-500/20 text-rose-300": variant === 'danger',
          "text-teal-400 border-teal-500/30": variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
}
