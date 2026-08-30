import React from 'react';
import { IpoMetadata } from '../types';
import { Briefcase, Building2, Layers } from 'lucide-react';

interface IpoMetaHeaderProps {
  metadata: IpoMetadata;
  setMetadata: React.Dispatch<React.SetStateAction<IpoMetadata>>;
  onLotMultiplierChange: (multiplier: number) => void;
}

export const IpoMetaHeader: React.FC<IpoMetaHeaderProps> = ({
  metadata,
  setMetadata,
  onLotMultiplierChange,
}) => {
  const lotOptions = [1, 2, 5, 10, 14];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 sm:p-4 backdrop-blur-sm">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* IPO / Script Name */}
        <div className="sm:col-span-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-500">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={metadata.ipoName}
              onChange={(e) => setMetadata({ ...metadata, ipoName: e.target.value })}
              placeholder="Script / IPO Name (e.g. Premier Energies)"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 pl-8 pr-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Demat Account Label */}
        <div className="sm:col-span-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-500">
              <Briefcase className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={metadata.dematAccount}
              onChange={(e) => setMetadata({ ...metadata, dematAccount: e.target.value })}
              placeholder="Demat Account (e.g. Zerodha Primary)"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 pl-8 pr-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Lot Multipliers */}
        <div className="sm:col-span-4 flex items-center justify-between sm:justify-end gap-1.5">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mr-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden xs:inline">Lots:</span>
          </div>
          <div className="flex items-center gap-1">
            {lotOptions.map((lot) => (
              <button
                key={lot}
                type="button"
                onClick={() => {
                  setMetadata({ ...metadata, lotMultiplier: lot });
                  onLotMultiplierChange(lot);
                }}
                className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all ${
                  metadata.lotMultiplier === lot
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {lot}x{lot === 14 ? ' (sHNI)' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
