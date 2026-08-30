import React from 'react';
import { Zap } from 'lucide-react';

interface QuickPresetsProps {
  onSelect: (bid: number, sell: number) => void;
}

export const QuickPresets: React.FC<QuickPresetsProps> = ({ onSelect }) => {
  const standardBid = 15000;

  const presets = [
    { label: '12% Gain (0% Cut)', gain: 12, color: 'hover:border-slate-600 active:border-slate-500' },
    { label: '18% Gain (10% Cut)', gain: 18, color: 'hover:border-emerald-600 active:border-emerald-500' },
    { label: '23% Gain (15% Cut)', gain: 23, color: 'hover:border-blue-600 active:border-blue-500' },
    { label: '28% Gain (20% Cut)', gain: 28, color: 'hover:border-purple-600 active:border-purple-500' },
    { label: '45% Gain (25% Cut)', gain: 45, color: 'hover:border-amber-600 active:border-amber-500' },
    { label: 'Discount (-5%)', gain: -5, color: 'hover:border-rose-600 active:border-rose-500' },
  ];

  return (
    <div className="mt-4 pt-3.5 border-t border-slate-800/80">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="font-semibold text-slate-300 text-[11px] sm:text-xs">Quick Test Scenarios (₹15,000 lot):</span>
      </div>
      {/* Horizontally scrollable on mobile, wrapping on desktop */}
      <div className="flex overflow-x-auto pb-1.5 sm:pb-0 sm:flex-wrap gap-1.5 sm:gap-2 -mx-1 px-1 scrollbar-none">
        {presets.map((p) => {
          const sellAmount = standardBid * (1 + p.gain / 100);
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => onSelect(standardBid, Math.round(sellAmount))}
              className={`text-[11px] sm:text-xs py-1.5 px-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-200 transition-all active:scale-95 whitespace-nowrap shrink-0 ${p.color}`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
