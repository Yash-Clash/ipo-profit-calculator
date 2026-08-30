import { Sliders } from 'lucide-react';

interface ListingGainSliderProps {
  currentGainPercent: number;
  onGainChange: (newGainPercent: number) => void;
  tierPercent: number;
}

export const ListingGainSlider: React.FC<ListingGainSliderProps> = ({
  currentGainPercent,
  onGainChange,
  tierPercent,
}) => {
  const gain = Math.round(currentGainPercent * 10) / 10;

  return (
    <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-[11px] sm:text-xs">Simulate Listing Gain:</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-extrabold font-mono text-emerald-400">
            {gain >= 0 ? `+${gain}%` : `${gain}%`}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {tierPercent}% Cut
          </span>
        </div>
      </div>

      {/* Range Slider */}
      <div className="relative flex items-center">
        <input
          type="range"
          min="-15"
          max="80"
          step="0.5"
          value={gain}
          onChange={(e) => onGainChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
        />
      </div>

      {/* Quick Tick Marks */}
      <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
        <span>-15% (Loss)</span>
        <span className={gain >= 15 ? 'text-emerald-400 font-bold' : ''}>15% (0% cut)</span>
        <span className={gain >= 20 ? 'text-emerald-400 font-bold' : ''}>20% (10%)</span>
        <span className={gain >= 25 ? 'text-emerald-400 font-bold' : ''}>25% (15%)</span>
        <span className={gain >= 30 ? 'text-emerald-400 font-bold' : ''}>30% (20%)</span>
        <span className={gain > 30 ? 'text-amber-400 font-bold' : ''}>+30% (25%)</span>
      </div>
    </div>
  );
};
