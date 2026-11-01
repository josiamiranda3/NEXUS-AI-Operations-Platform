import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'cyan';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    xs: 'px-2.5 py-1 text-xs gap-1.5',
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
    md: 'px-4 py-2 text-sm font-medium gap-2',
    lg: 'px-5 py-2.5 text-base font-medium gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-purple-600 hover:bg-purple-500 text-white shadow-sm hover:shadow-purple-500/20 active:bg-purple-700 border border-purple-500/30',
    cyan:
      'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm hover:shadow-cyan-500/20 active:bg-cyan-700 border border-cyan-500/30',
    secondary:
      'bg-[#1c2638] hover:bg-[#25324a] text-slate-200 border border-[#293449] hover:border-slate-600 active:bg-[#151c2c]',
    outline:
      'bg-transparent hover:bg-slate-800/50 text-slate-300 border border-[#293449] hover:border-slate-500 active:bg-slate-800',
    ghost:
      'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white active:bg-slate-800',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-sm hover:shadow-rose-500/20 active:bg-rose-700 border border-rose-500/30',
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
