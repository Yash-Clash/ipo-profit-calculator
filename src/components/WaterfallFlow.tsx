import React from 'react';
import { CalculationResult } from '../types';
import { formatCurrency } from '../utils/exportUtils';
import { Coins, Percent, ShieldCheck, UserCheck } from 'lucide-react';

interface WaterfallFlowProps {
  result: CalculationResult;
  currency: string;
}

export const WaterfallFlow: React.FC<WaterfallFlowProps> = ({ result, currency }) => {
  const { allottedAmount, grossProfit, returnPercent, tierPercent, profitCutAmount, netProfitRemaining, investorRemainingAmount } = result;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
            Settlement Waterfall Flow
          </h3>
        </div>
        <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          Pro-Rata Routing
        </span>
      </div>

      {/* Waterfall Flow Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
        {/* Step 1: Realized Value */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">1. Total Realized</span>
            <span className="text-slate-500">Gross</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-white">
            {formatCurrency(result.sellingValue, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Capital ({formatCurrency(allottedAmount, currency)}) + Gain ({returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(1)}%)
          </div>
        </div>

        {/* Step 2: Gross Profit */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">2. Gross Listing Gain</span>
            <Percent className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
            +{formatCurrency(grossProfit, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Pure upside before deductions
          </div>
        </div>

        {/* Step 3: Demat Commission Cut */}
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-300 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              3. Demat Cut ({tierPercent}%)
            </span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-amber-400">
            -{formatCurrency(profitCutAmount, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Retained by Demat holder
          </div>
        </div>

        {/* Step 4: Net Investor Pool */}
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              4. Investor Payout
            </span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-white">
            {formatCurrency(investorRemainingAmount, currency)}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">
            Net Profit: +{formatCurrency(netProfitRemaining, currency)}
          </div>
        </div>
      </div>
    </div>
  );
};
