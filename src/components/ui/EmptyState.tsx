import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Sparkles,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-xl border border-dashed border-slate-300 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center mb-4 ring-8 ring-navy-50/50">
        <Icon className="w-6 h-6 text-navy-700" />
      </div>
      <h3 className="text-base font-semibold text-navy-950 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && (
        actionHref ? (
          <a href={actionHref}>
            <Button variant="primary" size="sm">
              {actionLabel}
            </Button>
          </a>
        ) : (
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
};
