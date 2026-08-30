import React from 'react';
import { InputMode } from '../types';
import { Layers, Hash } from 'lucide-react';

interface InputModeToggleProps {
  mode: InputMode;
  setMode: (mode: InputMode) => void;
}

export const InputModeToggle: React.FC<InputModeToggleProps> = ({ mode, setMode }) => {
  return (
    <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner">
      <button
        type="button"
        onClick={() => setMode('total')}
        className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all min-h-[42px] ${
          mode === 'total'
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        <span className="truncate">Total Amounts</span>
      </button>

      <button
        type="button"
        onClick={() => setMode('per_share')}
        className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all min-h-[42px] ${
          mode === 'per_share'
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        <span className="truncate">Per Share & LTP</span>
      </button>
    </div>
  );
};
