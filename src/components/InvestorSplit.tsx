import React from 'react';
import { Investor } from '../types';
import { INVESTOR_PALETTE } from '../utils/calculator';
import { Users, Plus, Trash2, Split, AlertCircle, CheckCircle } from 'lucide-react';

interface InvestorSplitProps {
  investors: Investor[];
  setInvestors: React.Dispatch<React.SetStateAction<Investor[]>>;
  allottedAmount: number;
  currency: string;
}

export const InvestorSplit: React.FC<InvestorSplitProps> = ({
  investors,
  setInvestors,
  allottedAmount,
  currency,
}) => {
  const totalContributed = investors.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const diff = allottedAmount - totalContributed;
  const isBalanced = Math.abs(diff) < 0.01;

  const handleAddInvestor = () => {
    const nextIndex = investors.length + 1;
    const suggestedAmount = diff > 0 ? Math.round(diff) : 0;
    const color = INVESTOR_PALETTE[investors.length % INVESTOR_PALETTE.length];
    const newInvestor: Investor = {
      id: Math.random().toString(36).substring(2, 9),
      name: `Investor ${nextIndex}`,
      amount: suggestedAmount,
      color,
    };
    setInvestors([...investors, newInvestor]);
  };

  const handleRemoveInvestor = (id: string) => {
    if (investors.length <= 1) return;
    setInvestors(investors.filter((inv) => inv.id !== id));
  };

  const handleUpdateName = (id: string, name: string) => {
    setInvestors(
      investors.map((inv) => (inv.id === id ? { ...inv, name } : inv))
    );
  };

  const handleUpdateAmount = (id: string, amountStr: string) => {
    const amount = parseFloat(amountStr) || 0;
    setInvestors(
      investors.map((inv) => (inv.id === id ? { ...inv, amount } : inv))
    );
  };

  const handleSplitEqually = () => {
    if (investors.length === 0 || allottedAmount <= 0) return;
    const equalShare = parseFloat((allottedAmount / investors.length).toFixed(2));
    setInvestors(
      investors.map((inv, idx) => {
        const isLast = idx === investors.length - 1;
        const amount = isLast
          ? parseFloat((allottedAmount - equalShare * (investors.length - 1)).toFixed(2))
          : equalShare;
        return { ...inv, amount };
      })
    );
  };

  const handleAutoFillRemaining = () => {
    if (diff <= 0 || investors.length === 0) return;
    const updated = [...investors];
    const last = updated[updated.length - 1];
    last.amount = parseFloat((last.amount + diff).toFixed(2));
    setInvestors(updated);
  };

  return (
    <div className="mt-5 pt-4 sm:pt-5 border-t border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Investor Pool & Capital Share
            </h3>
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {investors.length} {investors.length === 1 ? 'Investor' : 'Investors'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 hidden xs:block">
            Capital pooled to fund the allotted bid amount
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {investors.length > 1 && (
            <button
              type="button"
              onClick={handleSplitEqually}
              className="flex items-center gap-1 px-2 py-1 text-[11px] sm:text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors min-h-[32px]"
              title="Divide allotted capital equally among investors"
            >
              <Split className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline">Split Equally</span>
              <span className="xs:hidden">Equal</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAddInvestor}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition-all active:scale-95 min-h-[32px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Investor</span>
          </button>
        </div>
      </div>

      {/* Portfolio Share Multi-Color Segment Bar */}
      {totalContributed > 0 && investors.length > 1 && (
        <div className="mb-3">
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
            {investors.map((inv, idx) => {
              const pct = ((Number(inv.amount) || 0) / totalContributed) * 100;
              const color = inv.color || INVESTOR_PALETTE[idx % INVESTOR_PALETTE.length];
              return (
                <div
                  key={inv.id}
                  style={{ width: `${pct}%`, backgroundColor: color }}
                  className="h-full transition-all duration-300"
                  title={`${inv.name}: ${pct.toFixed(1)}%`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Investor Rows */}
      <div className="space-y-2">
        {investors.map((inv, index) => {
          const sharePct =
            totalContributed > 0
              ? ((Number(inv.amount) || 0) / totalContributed) * 100
              : 0;
          const color = inv.color || INVESTOR_PALETTE[index % INVESTOR_PALETTE.length];

          return (
            <div
              key={inv.id}
              className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2.5"
            >
              {/* Mobile: Top Row with Color Dot + Name + Delete */}
              <div className="flex items-center gap-2 flex-1">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <input
                  type="text"
                  value={inv.name}
                  onChange={(e) => handleUpdateName(inv.id, e.target.value)}
                  placeholder={`Investor ${index + 1} Name`}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-sm sm:text-xs text-white placeholder:text-slate-600 focus:border-emerald-500 outline-none"
                />

                {investors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveInvestor(inv.id)}
                    className="sm:hidden p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors shrink-0"
                    title="Remove Investor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Amount & Share Badge */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-36">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-500 text-xs font-bold">
                    {currency}
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={inv.amount || ''}
                    onChange={(e) => handleUpdateAmount(inv.id, e.target.value)}
                    placeholder="Amount"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 pl-6 pr-2.5 text-sm sm:text-xs font-mono text-white placeholder:text-slate-600 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="w-16 text-center px-1.5 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 shrink-0">
                  <span>{sharePct.toFixed(1)}%</span>
                </div>

                {/* Desktop Delete Button */}
                {investors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveInvestor(inv.id)}
                    className="hidden sm:flex p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors shrink-0"
                    title="Remove Investor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Allocation Summary & Balance Bar */}
      <div className="mt-2.5 p-2 sm:p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/70 flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 text-[11px] sm:text-xs">
        <div className="flex items-center gap-1.5">
          {isBalanced ? (
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}
          <span className="text-slate-300">
            Allocated:{' '}
            <strong className="text-white font-mono">
              {currency}{totalContributed.toLocaleString('en-IN')}
            </strong>{' '}
            /{' '}
            <strong className="text-emerald-400 font-mono">
              {currency}{allottedAmount.toLocaleString('en-IN')}
            </strong>
          </span>
        </div>

        {!isBalanced && (
          <div className="flex items-center gap-2 self-end xs:self-auto">
            <span className="text-amber-400 text-[10px] sm:text-[11px]">
              {diff > 0
                ? `${currency}${Math.abs(diff).toLocaleString('en-IN')} left`
                : `${currency}${Math.abs(diff).toLocaleString('en-IN')} over`}
            </span>
            {diff > 0 && (
              <button
                type="button"
                onClick={handleAutoFillRemaining}
                className="text-[10px] sm:text-[11px] text-emerald-400 hover:underline font-semibold"
              >
                Auto-fill
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
