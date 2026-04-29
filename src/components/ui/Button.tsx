import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-400 hover:to-cyan-400 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] border border-teal-400/30': variant === 'default',
            'border border-teal-500/50 bg-slate-900/50 backdrop-blur-sm hover:bg-teal-500/10 text-teal-300 hover:text-teal-200': variant === 'outline',
            'hover:bg-teal-500/10 text-teal-300 hover:text-teal-200': variant === 'ghost',
            'bg-rose-500/80 text-white hover:bg-rose-500 border border-rose-400/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]': variant === 'danger',
            'h-9 px-4 text-sm': size === 'sm',
            'h-11 px-6 py-2': size === 'md',
            'h-14 px-8 text-lg rounded-xl': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
