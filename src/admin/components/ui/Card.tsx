import React from 'react';
export function Card({
  className = '',
  children



}: {className?: string;children: React.ReactNode;}) {
  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-xl shadow-sm overflow-hidden ${className}`}>
      
      {children}
    </div>);

}
export function CardHeader({
  className = '',
  children



}: {className?: string;children: React.ReactNode;}) {
  return (
    <div className={`px-6 py-4 border-b border-slate-800 ${className}`}>
      {children}
    </div>);

}
export function CardTitle({
  className = '',
  children



}: {className?: string;children: React.ReactNode;}) {
  return (
    <h3 className={`text-lg font-semibold text-slate-100 ${className}`}>
      {children}
    </h3>);

}
export function CardContent({
  className = '',
  children



}: {className?: string;children: React.ReactNode;}) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}