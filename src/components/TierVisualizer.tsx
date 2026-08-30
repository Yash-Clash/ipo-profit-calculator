import React from 'react';
import { CalculationResult } from '../types';
import { TIERS } from '../utils/calculator';
import { CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface TierVisualizerProps {
  result: CalculationResult;
  currency: string;
}

export const TierVisualizer: React.FC<TierVisualizerProps> = ({ result, currency }) => {
  const { returnPercent, activeTier, nextTier, gainNeededForNextTier, priceNeededForNextTier } = result;

  // Calculate visual progress percentage along 0% to 35%
  const clampedGain = Math.max(0, Math.min(35, returnPercent));
  const progressPercent = (clampedGain / 35) * 100;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 backdrop-blur-sm shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 sm:mb-5">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span>Slab Structure & Active Tier</span>
            <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              x = {returnPercent > 0 ? `+${returnPercent.toFixed(2)}%` : `${returnPercent.toFixed(2)}%`}
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Your IPO listing gain determines the Demat holder's cut
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 self-start sm:self-auto">
          <span className="text-[11px] sm:text-xs text-slate-400">Current Cut:</span>
          <span className="text-xs sm:text-sm font-extrabold text-emerald-400 font-mono">
            {activeTier.profitCutPercent}% of Profit
          </span>
        </div>
      </div>

      {/* Visual Progress Bar (Mobile & Desktop) */}
      <div className="mb-4 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
        <div className="flex justify-between text-[10px] sm:text-xs font-mono text-slate-400 mb-1.5">
          <span>0% Gain</span>
          <span>15%</span>
          <span>20%</span>
          <span>25%</span>
          <span>30%+</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative">
          <div
            className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stepped Slabs Cards: Horizontal Snap Carousel on Mobile, 5-col Grid on Desktop */}
      <div className="flex sm:grid overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 gap-2 sm:gap-2.5 sm:grid-cols-5 snap-x snap-mandatory -mx-1 px-1 sm:mx-0 sm:px-0">
        {TIERS.map((tier) => {
          const isActive = tier.id === activeTier.id;
          const isPassed = tier.id < activeTier.id;

          return (
            <div
              key={tier.id}
              className={`relative rounded-xl p-3 sm:p-3.5 border transition-all duration-200 w-[145px] sm:w-auto shrink-0 snap-start flex flex-col justify-between ${
                isActive
                  ? 'bg-emerald-950/50 border-emerald-500/80 shadow-lg shadow-emerald-900/30 ring-1 ring-emerald-500/40'
                  : isPassed
                  ? 'bg-slate-900/90 border-slate-800 text-slate-400'
                  : 'bg-slate-900/40 border-slate-800/60 text-slate-500'
              }`}
            >
              {isActive && (
                <div className="absolute -top-2 right-2 bg-emerald-500 text-slate-950 font-extrabold text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded-full shadow">
                  ACTIVE
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[11px] sm:text-xs font-mono font-bold ${isActive ? 'text-emerald-300' : isPassed ? 'text-slate-300' : 'text-slate-400'}`}>
                    {tier.label}
                  </span>
                  {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/70 shrink-0" />}
                </div>

                <div className="my-1">
                  <span className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${isActive ? 'text-white' : isPassed ? 'text-slate-200' : 'text-slate-400'}`}>
                    {tier.profitCutPercent}%
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 ml-1">cut</span>
                </div>
              </div>

              <p className="text-[10px] sm:text-[11px] leading-tight text-slate-400 mt-1 line-clamp-2">
                {tier.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Next Tier Incentive Banner */}
      {nextTier && gainNeededForNextTier !== null && priceNeededForNextTier !== null && (
        <div className="mt-3.5 p-2.5 sm:p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-start sm:items-center gap-2 text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <span className="text-[11px] sm:text-xs leading-relaxed">
              Next Tier ({nextTier.profitCutPercent}% cut): Needs gain of{' '}
              <strong className="text-white font-mono">+{gainNeededForNextTier.toFixed(2)}% more</strong>{' '}
              (Selling: <strong className="text-emerald-400 font-mono">{currency}{priceNeededForNextTier.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>)
            </span>
          </div>
          <div className="hidden sm:flex items-center text-slate-400 text-[11px] shrink-0">
            <span>{nextTier.label}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>
      )}
    </div>
  );
};
