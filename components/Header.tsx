import React from 'react';
import { LucideStethoscope } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <LucideStethoscope size={20} />
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">MediAssist AI</span>
        </div>
        <div className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
          Beta Preview
        </div>
      </div>
    </header>
  );
};