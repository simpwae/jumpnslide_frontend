import React from 'react';
export function Table({
  children,
  className = ''



}: {children: React.ReactNode;className?: string;}) {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full text-sm text-left ${className}`}>
        {children}
      </table>
    </div>);

}
export function TableHeader({ children }: {children: React.ReactNode;}) {
  return (
    <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-800">
      {children}
    </thead>);

}
export function TableBody({ children }: {children: React.ReactNode;}) {
  return <tbody className="divide-y divide-slate-800">{children}</tbody>;
}
export function TableRow({
  children,
  className = ''



}: {children: React.ReactNode;className?: string;}) {
  return (
    <tr className={`hover:bg-slate-800/50 transition-colors ${className}`}>
      {children}
    </tr>);

}
export function TableHead({
  children,
  className = ''



}: {children: React.ReactNode;className?: string;}) {
  return <th className={`px-6 py-4 font-medium ${className}`}>{children}</th>;
}
export function TableCell({
  children,
  className = ''



}: {children: React.ReactNode;className?: string;}) {
  return <td className={`px-6 py-4 ${className}`}>{children}</td>;
}