import React from 'react';
import { CheckCircle2Icon } from 'lucide-react';
interface ItemCardProps {
  title: string;
  subtitle?: string;
  gradient: string;
  badge?: {
    text: string;
    variant: 'included' | 'free' | 'extra' | 'selected';
  };
  selected?: boolean;
  selectable?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}
export function ItemCard({
  title,
  subtitle,
  gradient,
  badge,
  selected,
  selectable,
  onClick,
  disabled
}: ItemCardProps) {
  const getBadgeStyles = (variant: string) => {
    switch (variant) {
      case 'included':
        return 'bg-blue-100 text-blue-700';
      case 'free':
        return 'bg-green-100 text-green-700';
      case 'extra':
        return 'bg-amber-100 text-amber-700';
      case 'selected':
        return 'bg-brand-pink text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  return (
    <div
      onClick={!disabled && selectable ? onClick : undefined}
      className={`relative rounded-xl border-2 overflow-hidden transition-all flex flex-col h-full
        ${selectable && !disabled ? 'cursor-pointer hover:border-brand-blue/50 hover:shadow-md' : ''} 
        ${selected ? 'border-green-500 shadow-md ring-1 ring-green-500' : 'border-gray-100'} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      
      <div className={`h-28 bg-gradient-to-br ${gradient} relative shrink-0`}>
        {badge &&
        <div
          className={`absolute top-2 left-2 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm ${getBadgeStyles(badge.variant)}`}>
          
            {badge.text}
          </div>
        }
        {selected &&
        <div className="absolute top-2 right-2 bg-white rounded-full p-0.5 shadow-sm">
            <CheckCircle2Icon className="w-5 h-5 text-green-500" />
          </div>
        }
      </div>
      <div className="p-3 text-center bg-white flex-1 flex flex-col justify-center">
        <p className="font-bold text-sm text-brand-navy leading-tight">
          {title}
        </p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>);

}