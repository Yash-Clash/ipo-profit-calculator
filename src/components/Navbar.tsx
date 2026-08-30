import React from 'react';
import { TrendingUp, HelpCircle } from 'lucide-react';

interface NavbarProps {
  currency: string;
  setCurrency: (c: string) => void;
  onOpenInfo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  setCurrency,
  onOpenInfo,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400/30 shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-bold text-base sm:text-xl text-white tracking-tight truncate">
                IPO Profit Calculator
              </h1>
              <span className="hidden xs:inline-block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                Slabs
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block truncate">
              Listing Gain & Multi-Investor Settlement Engine
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Currency Selector */}
          <div className="relative flex items-center bg-slate-800/90 border border-slate-700 rounded-lg px-2 py-1">
            <span className="text-[11px] sm:text-xs text-slate-400 mr-1 font-medium hidden xs:inline">Cur:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-200 outline-none cursor-pointer pr-0.5"
            >
              <option value="₹" className="bg-slate-900 text-white">₹ INR</option>
              <option value="$" className="bg-slate-900 text-white">$ USD</option>
              <option value="€" className="bg-slate-900 text-white">€ EUR</option>
              <option value="£" className="bg-slate-900 text-white">£ GBP</option>
            </select>
          </div>

          {/* Rules Info Button */}
          <button
            onClick={onOpenInfo}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700 min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="View Tier Rules"
            aria-label="View Tier Rules"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
