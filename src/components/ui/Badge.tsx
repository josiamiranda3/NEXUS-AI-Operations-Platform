import React from 'react';
import { ProjectStatus, PriorityLevel, TaskStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'purple' | 'cyan' | 'neutral';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 font-medium',
    sm: 'text-xs px-2.5 py-1 font-medium',
    md: 'text-sm px-3 py-1 font-semibold',
  };

  const variantClasses = {
    default: 'bg-[#1c2638] text-slate-300 border border-[#293449]',
    neutral: 'bg-slate-800/80 text-slate-400 border border-slate-700/50',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    purple: 'bg-purple-500/10 text-purple-300 border border-purple-500/25',
    cyan: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/25',
  };

  const dotColor = {
    default: 'bg-slate-400',
    neutral: 'bg-slate-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    purple: 'bg-purple-400',
    cyan: 'bg-cyan-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border tracking-wide select-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor[variant]}`} />}
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ProjectStatus | TaskStatus | string; size?: 'xs' | 'sm' | 'md' }> = ({
  status,
  size = 'sm',
}) => {
  let variant: 'default' | 'success' | 'warning' | 'danger' | 'purple' | 'cyan' = 'default';

  switch (status) {
    case 'Completed':
    case 'Done':
      variant = 'success';
      break;
    case 'In Progress':
      variant = 'purple';
      break;
    case 'In Review':
      variant = 'cyan';
      break;
    case 'Planning':
    case 'To Do':
      variant = 'warning';
      break;
    case 'On Hold':
    case 'Backlog':
      variant = 'default';
      break;
    case 'Cancelled':
      variant = 'danger';
      break;
    default:
      variant = 'default';
  }

  return (
    <Badge variant={variant} size={size} dot>
      {status}
    </Badge>
  );
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel | string; size?: 'xs' | 'sm' | 'md' }> = ({
  priority,
  size = 'sm',
}) => {
  let variant: 'default' | 'success' | 'warning' | 'danger' | 'purple' | 'cyan' = 'default';

  switch (priority) {
    case 'Urgent':
      variant = 'danger';
      break;
    case 'High':
      variant = 'warning';
      break;
    case 'Medium':
      variant = 'cyan';
      break;
    case 'Low':
      variant = 'default';
      break;
    default:
      variant = 'default';
  }

  return (
    <Badge variant={variant} size={size}>
      {priority}
    </Badge>
  );
};
