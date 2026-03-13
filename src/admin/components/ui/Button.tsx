import React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    primary: 'bg-brand-blue hover:bg-blue-600 text-white focus:ring-brand-blue',
    secondary:
    'bg-slate-800 hover:bg-slate-700 text-slate-100 focus:ring-slate-700',
    outline:
    'border border-slate-700 hover:bg-slate-800 text-slate-200 focus:ring-slate-700',
    ghost:
    'hover:bg-slate-800 text-slate-300 hover:text-slate-100 focus:ring-slate-700',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-600'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}>
      
      {children}
    </button>);

}