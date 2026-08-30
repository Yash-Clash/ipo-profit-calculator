import React, { useState } from 'react';
import { X, Copy, Check, Terminal, ExternalLink, Globe } from 'lucide-react';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentModal: React.FC<DeploymentModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-black border border-slate-700 flex items-center justify-center shadow">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Deploy to Vercel</h3>
            <p className="text-xs text-slate-400">Get your live public URL in 60 seconds</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          {/* Method 1: CLI */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white flex items-center gap-2 text-xs uppercase tracking-wider">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Option 1: Deploy with Vercel CLI (Fastest)
              </span>
              <button
                onClick={() => copyCommand('npx vercel')}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Open PowerShell/Terminal inside this project directory and run:
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-xs text-emerald-300 flex items-center justify-between">
              <code>npx vercel</code>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              • Vercel will ask to authenticate via email/GitHub (one-time).<br />
              • Press Enter for all prompts to accept default settings.<br />
              • Done! Your link will be instantly generated (e.g. <code>https://ipo-profit-calculator.vercel.app</code>).
            </p>
          </div>

          {/* Method 2: GitHub */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-semibold text-white flex items-center gap-2 text-xs uppercase tracking-wider mb-2">
              <ExternalLink className="w-4 h-4 text-blue-400" />
              Option 2: Deploy via GitHub + Vercel Dashboard
            </span>
            <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside">
              <li>Initialize git and push this project folder to your GitHub repository.</li>
              <li>Go to <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-emerald-400 underline">vercel.com/new</a>.</li>
              <li>Select your repository and click <strong>Deploy</strong>.</li>
              <li>Vercel automatically detects Vite and produces your live link!</li>
            </ol>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
          >
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
};
