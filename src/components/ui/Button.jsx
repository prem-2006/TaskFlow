'use client';

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-glow active:scale-[0.98]',
  secondary:
    'bg-surface-elevated dark:bg-surface-elevated-dark text-foreground border border-border dark:border-border-dark hover:bg-brand-50 dark:hover:bg-brand-600/10',
  ghost:
    'text-text-secondary hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5',
  danger:
    'bg-red-500 hover:bg-red-600 text-white shadow-md active:scale-[0.98]',
  gradient:
    'gradient-bg text-white shadow-md hover:shadow-glow-lg active:scale-[0.98]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
  icon: 'p-2 rounded-xl',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
});

export default Button;
