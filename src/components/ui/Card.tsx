import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'purple' | 'cyan' | 'none';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  glow = 'none',
  onClick,
}) => {
  const glowClasses = {
    none: '',
    purple: 'glow-purple',
    cyan: 'glow-cyan',
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-xl border border-[#293449] bg-[#151c2c]/80 text-[#f8fafc] transition-all duration-200 ${
        hover ? 'hover:border-slate-500/60 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : ''
      } ${glowClasses[glow]} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  children?: ReactNode;
}> = ({ title, subtitle, action, className = '', children }) => {
  if (children) {
    return <div className={`px-5 py-4 border-b border-[#293449]/80 ${className}`}>{children}</div>;
  }
  return (
    <div className={`px-5 py-4 border-b border-[#293449]/80 flex items-center justify-between gap-4 ${className}`}>
      <div>
        {title && <h3 className="text-base font-semibold text-slate-100">{title}</h3>}
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`px-5 py-3.5 border-t border-[#293449]/80 bg-[#101522]/40 rounded-b-xl ${className}`}>{children}</div>;
};
