import React from 'react';
import { XIcon } from 'lucide-react';
import { Button } from './Button';

interface EditModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function EditModal({ title, onClose, children }: EditModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h3 className="text-lg font-heading font-bold text-slate-100">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}