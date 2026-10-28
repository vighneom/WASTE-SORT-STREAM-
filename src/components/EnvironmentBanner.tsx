import React from 'react';
import { Factory, UtensilsCrossed, Home, ShieldCheck, AlertCircle } from 'lucide-react';
import { EnvironmentMode } from '../types';

interface EnvironmentBannerProps {
  currentMode: EnvironmentMode;
  onSelectMode: (mode: EnvironmentMode) => void;
}

export function EnvironmentBanner({ currentMode, onSelectMode }: EnvironmentBannerProps) {
  const modes: {
    id: EnvironmentMode;
    label: string;
    subtitle: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'INDUSTRIAL_MRF',
      label: 'Industrial Recovery Facility',
      subtitle: 'Conveyor Line 03 · 240 FPS · 32 Pneumatic Air Jets',
      icon: <Factory className="w-4 h-4" />
    },
    {
      id: 'COMMERCIAL_RESTAURANT',
      label: 'Commercial & Restaurant Kitchen',
      subtitle: 'Grease Screening · Pure Organics · Takeaway Packaging',
      icon: <UtensilsCrossed className="w-4 h-4" />
    },
    {
      id: 'DOMESTIC_SMART_BIN',
      label: 'Domestic Smart Bin Kiosk',
      subtitle: 'Source Preparation Guidance · Zero Ambiguity Instructions',
      icon: <Home className="w-4 h-4" />
    }
  ];

  return (
    <div className="space-y-4">
      {/* Environment Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 rounded-xl p-2">
        <div className="flex items-center gap-2 px-3 py-1 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>ACTIVE DEPLOYMENT TARGET:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {modes.map((m) => {
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                }`}
              >
                <div
                  className={`p-1.5 rounded-md ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500'
                  }`}
                >
                  {m.icon}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold whitespace-nowrap">{m.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{m.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Senior Environmental Sustainability Engineer's Directive Callout */}
      <div className="bg-slate-900/60 border border-slate-800/90 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-2">
              <span>Principal Engineer's Directive: Zero-Tolerance Wishcycling</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-4xl">
              Source segregation is physics and chemistry, not optimism. When soiled cardboards, metallized pouches, or PVC-sleeved containers enter blue bins, they do not get magically recycled—they ruin pulp bonding and cause rejection of entire 40-ton batches. This sensor system makes deterministic routing decisions to protect recycling purity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0 text-xs font-mono border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6">
          <div>
            <div className="text-slate-400 text-[10px]">PURITY FLOOR</div>
            <div className="text-sm font-bold text-emerald-400 tabular-nums">&ge; 98.0%</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">MAX LATENCY</div>
            <div className="text-sm font-bold text-cyan-400 tabular-nums">&lt; 50 ms</div>
          </div>
        </div>
      </div>
    </div>
  );
}
