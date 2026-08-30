import { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InputModeToggle } from './components/InputModeToggle';
import { TierVisualizer } from './components/TierVisualizer';
import { ResultCard } from './components/ResultCard';
import { QuickPresets } from './components/QuickPresets';
import { InvestorSplit } from './components/InvestorSplit';
import { InfoModal } from './components/InfoModal';
import { InputMode, Investor } from './types';
import { calculateIpoProfit, calculateInvestorPayouts } from './utils/calculator';
import { TrendingUp } from 'lucide-react';

export default function App() {
  // Application State
  const [currency, setCurrency] = useState<string>('₹');
  const [mode, setMode] = useState<InputMode>('total');
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  // Mode 1: Lump sum values
  const [bidAmount, setBidAmount] = useState<string>('15000');
  const [totalSellingPrice, setTotalSellingPrice] = useState<string>('18600');

  // Mode 2: Per-share values
  const [buyPricePerShare, setBuyPricePerShare] = useState<string>('500');
  const [ltpPerShare, setLtpPerShare] = useState<string>('620');
  const [numberOfShares, setNumberOfShares] = useState<string>('30');

  // Multi-Investor State (Defaults to 1 investor)
  const [investors, setInvestors] = useState<Investor[]>([
    { id: '1', name: 'Investor 1', amount: 15000 },
  ]);

  // Derived calculations
  const { effectiveAllotted, effectiveSelling } = useMemo(() => {
    if (mode === 'total') {
      const bid = parseFloat(bidAmount) || 0;
      const sell = parseFloat(totalSellingPrice) || 0;
      return { effectiveAllotted: bid, effectiveSelling: sell };
    } else {
      const buyPrice = parseFloat(buyPricePerShare) || 0;
      const ltp = parseFloat(ltpPerShare) || 0;
      const shares = parseFloat(numberOfShares) || 0;
      return {
        effectiveAllotted: buyPrice * shares,
        effectiveSelling: ltp * shares,
      };
    }
  }, [mode, bidAmount, totalSellingPrice, buyPricePerShare, ltpPerShare, numberOfShares]);

  // Keep single investor in sync with allotted capital
  useEffect(() => {
    if (investors.length === 1) {
      setInvestors((prev) =>
        prev[0]?.amount === effectiveAllotted
          ? prev
          : [{ ...prev[0], amount: effectiveAllotted }]
      );
    }
  }, [effectiveAllotted, investors.length]);

  const calculationResult = useMemo(() => {
    return calculateIpoProfit(effectiveAllotted, effectiveSelling);
  }, [effectiveAllotted, effectiveSelling]);

  // Calculate individual investor payouts
  const investorPayouts = useMemo(() => {
    return calculateInvestorPayouts(
      investors,
      effectiveAllotted,
      calculationResult.netProfitRemaining
    );
  }, [investors, effectiveAllotted, calculationResult.netProfitRemaining]);

  // Handle Preset selection
  const handleSelectPreset = (newBid: number, newSell: number) => {
    if (mode === 'total') {
      setBidAmount(newBid.toString());
      setTotalSellingPrice(newSell.toString());
    } else {
      const shares = 30;
      const buyPrice = newBid / shares;
      const ltp = newSell / shares;
      setBuyPricePerShare(buyPrice.toFixed(2));
      setLtpPerShare(ltp.toFixed(2));
      setNumberOfShares(shares.toString());
    }

    if (investors.length === 1) {
      setInvestors([{ id: investors[0].id, name: investors[0].name, amount: newBid }]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar
        currency={currency}
        setCurrency={setCurrency}
        onOpenInfo={() => setIsInfoOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Top Header Banner */}
        <div className="text-center max-w-2xl mx-auto mb-1 sm:mb-4 px-1">
          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            IPO Listing Profit & Multi-Investor Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
            Calculate your listing gains, demat holder commission (<code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-[11px] sm:text-xs">x ≤ 15% = 0%</code> up to <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-[11px] sm:text-xs">x &gt; 30% = 25%</code>), and split net payouts pro-rata.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="max-w-md mx-auto">
          <InputModeToggle mode={mode} setMode={setMode} />
        </div>

        {/* Core Interactive Section: Responsive 12-col Grid on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* Left Column: Input Form & Multi-Investor Split */}
          <div className="lg:col-span-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 backdrop-blur-sm shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 sm:gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <span>
                  {mode === 'total' ? 'Enter Total Amounts' : 'Enter Share Prices & Quantity'}
                </span>
              </h2>
              <span className="text-[11px] sm:text-xs font-mono text-slate-400">
                {mode === 'total' ? 'Lump Sum' : 'Per-Share'}
              </span>
            </div>

            {mode === 'total' ? (
              /* Mode 1: Lump Sum Inputs */
              <div className="space-y-3.5 sm:space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Total Bid / Allotted Amount ({currency})
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-bold text-sm sm:text-base">
                      {currency}
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="e.g. 15000"
                      className="block w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 sm:py-3 pl-9 pr-3 text-white text-base sm:text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    The total amount blocked or allotted for your IPO lot(s).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Total Selling Price / Realized Value ({currency})
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-bold text-sm sm:text-base">
                      {currency}
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={totalSellingPrice}
                      onChange={(e) => setTotalSellingPrice(e.target.value)}
                      placeholder="e.g. 18600"
                      className="block w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 sm:py-3 pl-9 pr-3 text-white text-base sm:text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    The total amount obtained after selling all allotted shares.
                  </p>
                </div>
              </div>
            ) : (
              /* Mode 2: Per Share Inputs */
              <div className="space-y-3.5 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Avg Buying Price / Share ({currency})
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 font-bold text-sm">
                        {currency}
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={buyPricePerShare}
                        onChange={(e) => setBuyPricePerShare(e.target.value)}
                        placeholder="e.g. 500"
                        className="block w-full rounded-xl bg-slate-950 border border-slate-800 py-2 sm:py-2.5 pl-8 pr-3 text-white text-base sm:text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      LTP / Selling Price per Share ({currency})
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 font-bold text-sm">
                        {currency}
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={ltpPerShare}
                        onChange={(e) => setLtpPerShare(e.target.value)}
                        placeholder="e.g. 620"
                        className="block w-full rounded-xl bg-slate-950 border border-slate-800 py-2 sm:py-2.5 pl-8 pr-3 text-white text-base sm:text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Number of Shares Allotted
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 font-bold text-sm">
                      #
                    </div>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={numberOfShares}
                      onChange={(e) => setNumberOfShares(e.target.value)}
                      placeholder="e.g. 30"
                      className="block w-full rounded-xl bg-slate-950 border border-slate-800 py-2 sm:py-2.5 pl-8 pr-3 text-white text-base sm:text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Sub-total summary for Mode 2 */}
                <div className="p-2.5 sm:p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    Bid: <strong className="text-white">{currency}{effectiveAllotted.toLocaleString('en-IN')}</strong>
                  </span>
                  <span className="text-slate-400">
                    Selling: <strong className="text-emerald-400">{currency}{effectiveSelling.toLocaleString('en-IN')}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Quick Test Presets */}
            <QuickPresets onSelect={handleSelectPreset} />

            {/* Investor Split Component */}
            <InvestorSplit
              investors={investors}
              setInvestors={setInvestors}
              allottedAmount={effectiveAllotted}
              currency={currency}
            />
          </div>

          {/* Right Column: Results & Payout Card (Sticky on desktop) */}
          <div className="lg:col-span-6 lg:sticky lg:top-20">
            <ResultCard
              result={calculationResult}
              currency={currency}
              investorPayouts={investorPayouts}
            />
          </div>
        </div>

        {/* Full Width Bottom: Stepped Tier Visualizer */}
        <TierVisualizer result={calculationResult} currency={currency} />

        {/* Footer */}
        <footer className="pt-5 pb-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>Built for IPO Investors & Demat Sharing</span>
            <span>•</span>
            <button
              onClick={() => setIsInfoOpen(true)}
              className="text-slate-400 hover:text-emerald-400 underline"
            >
              Formula Rules
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span>Developed by</span>
            <span className="text-emerald-400 font-bold tracking-wide">Yash Sharma</span>
          </div>
        </footer>
      </main>

      {/* Info Modal */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}
