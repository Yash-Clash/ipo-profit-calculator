import React, { useState } from 'react';
import { CalculationResult, InvestorPayout } from '../types';
import { Copy, Check, Info, ShieldCheck, Wallet, ArrowUpRight, ArrowDownRight, Users, UserCheck } from 'lucide-react';

interface ResultCardProps {
  result: CalculationResult;
  currency: string;
  investorPayouts: InvestorPayout[];
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  currency,
  investorPayouts,
}) => {
  const [copied, setCopied] = useState(false);

  const {
    allottedAmount,
    sellingValue,
    grossProfit,
    returnPercent,
    activeTier,
    tierPercent,
    profitCutAmount,
    investorRemainingAmount,
    netProfitRemaining,
    marginalCutAmount,
  } = result;

  const isProfit = grossProfit >= 0;

  const formatMoney = (amount: number) => {
    return `${currency}${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleCopy = async () => {
    let investorLines = '';
    if (investorPayouts.length > 1) {
      investorLines = `\n👥 *Individual Investor Payouts:*\n` +
        investorPayouts
          .map(
            (p) =>
              `• *${p.name}*: Contributed ${formatMoney(p.contributedAmount)} (${p.sharePercent.toFixed(1)}%) ➔ Profit: +${formatMoney(p.profitShare)} ➔ *Total Payout: ${formatMoney(p.totalPayout)}*`
          )
          .join('\n') + '\n';
    } else if (investorPayouts.length === 1) {
      investorLines = `\n👤 *Investor Payout (${investorPayouts[0].name}):* ${formatMoney(investorPayouts[0].totalPayout)} (Capital ${formatMoney(investorPayouts[0].contributedAmount)} + Net Profit ${formatMoney(investorPayouts[0].profitShare)})\n`;
    }

    const summaryText = `📊 *IPO Profit & Settlement Summary*
----------------------------------------
💰 *Allotted Capital:* ${formatMoney(allottedAmount)}
📈 *Selling Value:* ${formatMoney(sellingValue)}
🔥 *Gross Profit:* ${isProfit ? '+' : ''}${formatMoney(grossProfit)} (${returnPercent.toFixed(2)}%)

🏷️ *Tier Activated:* ${activeTier.label}
🏦 *Demat Holder Cut (${tierPercent}%):* ${formatMoney(profitCutAmount)} (Basis: % of Gross Profit)
🛡️ *Net Profit for Investors:* ${formatMoney(netProfitRemaining)}
💵 *Total Investor Pool:* ${formatMoney(investorRemainingAmount)}
----------------------------------------${investorLines}----------------------------------------
_Generated via IPO Profit Calculator_`;

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 sm:gap-2">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              <span>Profit Breakdown & Payout</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Live settlement amounts based on active slab
            </p>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-semibold shrink-0">
            <span>% of Profit</span>
          </div>
        </div>

        {/* Hero: Demat Account Holder Cut */}
        <div className="my-3.5 sm:my-5 p-3.5 sm:p-4 rounded-xl bg-slate-850/90 border border-slate-800 relative overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                Demat Holder Cut ({tierPercent}%)
              </span>
              <div className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono mt-1 tracking-tight truncate">
                {formatMoney(profitCutAmount)}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1 truncate">
                {tierPercent}% cut on Gross Profit ({formatMoney(grossProfit)})
              </p>
            </div>

            <div
              className={`px-2 sm:px-3 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-0.5 sm:gap-1 shrink-0 ${
                isProfit
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {isProfit ? (
                <>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+{returnPercent.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>{returnPercent.toFixed(1)}%</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Financial Overview Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
          <div className="bg-slate-900/60 p-2.5 sm:p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] sm:text-[11px] text-slate-400 block mb-0.5">Gross IPO Profit</span>
            <span
              className={`text-base sm:text-lg font-bold font-mono truncate block ${
                isProfit ? 'text-emerald-300' : 'text-rose-400'
              }`}
            >
              {isProfit ? '+' : ''}
              {formatMoney(grossProfit)}
            </span>
          </div>

          <div className="bg-slate-900/60 p-2.5 sm:p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] sm:text-[11px] text-slate-400 block mb-0.5">Active Tier</span>
            <span className="text-base sm:text-lg font-bold font-mono text-white truncate block">
              {activeTier.profitCutPercent}%{' '}
              <span className="text-[10px] sm:text-xs font-normal text-slate-400">
                ({activeTier.label})
              </span>
            </span>
          </div>

          <div className="bg-slate-900/60 p-2.5 sm:p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] sm:text-[11px] text-slate-400 block mb-0.5 truncate">
              Net Profit (Investors)
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-slate-200 truncate block">
              {formatMoney(netProfitRemaining)}
            </span>
          </div>

          <div className="bg-slate-900/60 p-2.5 sm:p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] sm:text-[11px] text-slate-400 block mb-0.5">
              Selling Realized
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-slate-200 truncate block">
              {formatMoney(sellingValue)}
            </span>
          </div>
        </div>

        {/* Total Pool to Investors */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/20 flex items-center justify-between gap-2 mb-4 sm:mb-5">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] sm:text-xs font-bold text-emerald-300 block truncate">
                Total Investor Payout
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 truncate block">
                Capital + Net Profit
              </span>
            </div>
          </div>
          <div className="text-base sm:text-lg font-bold text-white font-mono shrink-0">
            {formatMoney(investorRemainingAmount)}
          </div>
        </div>

        {/* Multi-Investor Payout Breakdown Table / Cards */}
        <div className="mb-4 sm:mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              Investor Payouts ({investorPayouts.length})
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400">Pro-rata</span>
          </div>

          <div className="space-y-2">
            {investorPayouts.map((p) => (
              <div
                key={p.id}
                className="p-2.5 sm:p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-xs sm:text-sm truncate">{p.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[9px] sm:text-[10px] shrink-0">
                      {p.sharePercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-slate-400 text-[10px] sm:text-[11px] mt-0.5 truncate">
                    <span>Inv: {formatMoney(p.contributedAmount)}</span>
                    <span className="mx-1">•</span>
                    <span className={p.profitShare >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {p.profitShare >= 0 ? '+' : ''}{formatMoney(p.profitShare)}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs sm:text-sm font-extrabold text-white font-mono">
                    {formatMoney(p.totalPayout)}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-emerald-400 font-mono">
                    ROI: {p.roiPercent >= 0 ? `+${p.roiPercent.toFixed(1)}%` : `${p.roiPercent.toFixed(1)}%`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marginal calculation note */}
        <div className="text-[10px] sm:text-[11px] text-slate-400 p-2 sm:p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/50 flex items-start gap-1.5 mb-3 sm:mb-4">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <span>
              Flat cut: <strong>{formatMoney(profitCutAmount)}</strong>.
              Progressive: <strong>{formatMoney(marginalCutAmount)}</strong>.
            </span>
          </div>
        </div>
      </div>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className={`w-full min-h-[44px] py-2.5 sm:py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
          copied
            ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
            : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-slate-950" />
            <span>Copied to Clipboard!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-slate-300" />
            <span>Copy WhatsApp/Telegram Summary</span>
          </>
        )}
      </button>
    </div>
  );
};
