import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'navy' | 'gold' | 'success' | 'warning' | 'danger' | 'slate' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'navy',
  size = 'md',
  className = '',
}) => {
  const variants = {
    navy: 'bg-navy-100 text-navy-800 border-navy-200',
    gold: 'bg-gold-50 text-gold-800 border-gold-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    outline: 'bg-transparent text-navy-700 border-slate-300',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};
