import React from 'react';
import { X, Shield, Calculator, CheckCircle2 } from 'lucide-react';
import { TIERS } from '../utils/calculator';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">IPO Profit Sharing Rules</h3>
            <p className="text-xs text-slate-400">Exact mathematical specification</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              Formula Definition
            </h4>
            <div className="space-y-1 font-mono text-slate-300">
              <div>Allotted Amount = Avg Buy Price × Quantity (or Total Bid)</div>
              <div>Selling Value = LTP / Selling Price × Quantity</div>
              <div>Gross Profit = Selling Value - Allotted Amount</div>
              <div className="text-emerald-400">Return (x%) = (Gross Profit ÷ Allotted Amount) × 100</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="font-semibold text-white mb-2">Applied Slabs</h4>
            <div className="space-y-2">
              {TIERS.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono font-bold text-white">{t.label}</span>
                  </div>
                  <span className="font-bold text-emerald-400 font-mono">{t.profitCutPercent}% profit</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
            <p>
              💡 <strong>Profit Sharing Basis:</strong> The applicable tier cut is calculated strictly as a percentage of the <strong>Gross IPO Profit</strong>, and remaining net profit is distributed pro-rata to investors.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
