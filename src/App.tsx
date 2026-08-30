import { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { IpoMetaHeader } from './components/IpoMetaHeader';
import { InputModeToggle } from './components/InputModeToggle';
import { ListingGainSlider } from './components/ListingGainSlider';
import { TierVisualizer } from './components/TierVisualizer';
import { WaterfallFlow } from './components/WaterfallFlow';
import { ResultCard } from './components/ResultCard';
import { QuickPresets } from './components/QuickPresets';
import { InvestorSplit } from './components/InvestorSplit';
import { InfoModal } from './components/InfoModal';
import { InputMode, Investor, IpoMetadata } from './types';
import { calculateIpoProfit, calculateInvestorPayouts } from './utils/calculator';
import { TrendingUp } from 'lucide-react';

export default function App() {
  // Application State
  const [currency, setCurrency] = useState<string>('₹');
  const [mode, setMode] = useState<InputMode>('total');
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  // IPO Syndicate Metadata
  const [metadata, setMetadata] = useState<IpoMetadata>({
    ipoName: '',
    dematAccount: '',
    settlementId: `IPO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    lotMultiplier: 1,
  });

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
      const shares = 30 * metadata.lotMultiplier;
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

  // Handle Interactive Listing Gain Simulation
  const handleSliderGainChange = (newGainPercent: number) => {
    const newSell = Math.round(effectiveAllotted * (1 + newGainPercent / 100));
    if (mode === 'total') {
      setTotalSellingPrice(newSell.toString());
    } else {
      const buyPrice = parseFloat(buyPricePerShare) || 0;
      const newLtp = buyPrice * (1 + newGainPercent / 100);
      setLtpPerShare(newLtp.toFixed(2));
    }
  };

  // Handle Lot Multiplier Change
  const handleLotMultiplierChange = (newMultiplier: number) => {
    const baseLotBid = 15000;
    const currentGainPct = calculationResult.returnPercent || 24;
    const scaledBid = baseLotBid * newMultiplier;
    const scaledSell = Math.round(scaledBid * (1 + currentGainPct / 100));

    if (mode === 'total') {
      setBidAmount(scaledBid.toString());
      setTotalSellingPrice(scaledSell.toString());
    } else {
      const baseShares = 30;
      setNumberOfShares((baseShares * newMultiplier).toString());
    }

    if (investors.length === 1) {
      setInvestors([{ id: investors[0].id, name: investors[0].name, amount: scaledBid }]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white antialiased">
      <Navbar
        currency={currency}
        setCurrency={setCurrency}
        onOpenInfo={() => setIsInfoOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* IPO Syndicate Header */}
        <IpoMetaHeader
          metadata={metadata}
          setMetadata={setMetadata}
          onLotMultiplierChange={handleLotMultiplierChange}
        />

        {/* Mode Switcher */}
        <div className="max-w-md mx-auto">
          <InputModeToggle mode={mode} setMode={setMode} />
        </div>

        {/* Core Interactive Section: 12-col Grid on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* Left Column: Input Form, Presets, Slider & Multi-Investor Split */}
          <div className="lg:col-span-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 backdrop-blur-sm shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 sm:gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <span>
                  {mode === 'total' ? 'Allotment & Selling Values' : 'Share Quantities & LTP'}
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
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Total Bid / Allotted Capital ({currency})
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">Lot size basis</span>
                  </div>
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
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Total Selling Realized Value ({currency})
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">Gross Exit</span>
                  </div>
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
                      LTP / Exit Price per Share ({currency})
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

            {/* Listing Gain Simulation Slider */}
            <ListingGainSlider
              currentGainPercent={calculationResult.returnPercent}
              onGainChange={handleSliderGainChange}
              tierPercent={calculationResult.tierPercent}
            />

            {/* Investor Split Component */}
            <InvestorSplit
              investors={investors}
              setInvestors={setInvestors}
              allottedAmount={effectiveAllotted}
              currency={currency}
            />
          </div>

          {/* Right Column: Settlement & Payout Card (Sticky on desktop) */}
          <div className="lg:col-span-6 lg:sticky lg:top-20">
            <ResultCard
              result={calculationResult}
              currency={currency}
              investorPayouts={investorPayouts}
              metadata={metadata}
            />
          </div>
        </div>

        {/* Visual Waterfall Flow */}
        <WaterfallFlow result={calculationResult} currency={currency} />

        {/* Stepped Tier Visualizer */}
        <TierVisualizer result={calculationResult} currency={currency} />

        {/* Professional Footer */}
        <footer className="pt-6 pb-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>IPO Listing Syndicate & Demat Settlement</span>
            <span>•</span>
            <button
              onClick={() => setIsInfoOpen(true)}
              className="text-slate-400 hover:text-emerald-400 underline"
            >
              Formula Specification
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span>Developed by</span>
              <span className="text-emerald-400 font-bold tracking-wide">Yash Sharma</span>
            </div>
            <a
              href="https://github.com/Yash-Clash/ipo-profit-calculator"
              target="_blank"
              rel="noreferrer"
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="GitHub Repository"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
          </div>
        </footer>
      </main>

      {/* Info Modal */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}
