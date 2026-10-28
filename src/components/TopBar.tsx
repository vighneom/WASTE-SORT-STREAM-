import React from 'react';
import { Sparkles, Scan, Activity } from 'lucide-react';

interface TopBarProps {
  activeTab: 'feed' | 'scanner' | 'circularity' | 'calibration';
  onSelectTab: (tab: 'feed' | 'scanner' | 'circularity' | 'calibration') => void;
  onTriggerNextItem: () => void;
  isStreamPaused: boolean;
  onToggleStream: () => void;
}

export function TopBar({
  activeTab,
  onSelectTab,
  onTriggerNextItem,
  isStreamPaused,
  onToggleStream
}: TopBarProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-6 py-3.5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Scan className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            SortIQ PureStream
          </span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            · Optical & NIR Sensor OS
          </span>
        </div>

        {/* Zone 2: 4 single-line clean nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectTab('feed')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'feed'
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Live Sensor Feed
          </button>
          <button
            onClick={() => onSelectTab('scanner')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'scanner'
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Camera Scanner
          </button>
          <button
            onClick={() => onSelectTab('circularity')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'circularity'
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Anti-Wishcycling & Circularity
          </button>
          <button
            onClick={() => onSelectTab('calibration')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'calibration'
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Hardware Diagnostics
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleStream}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              isStreamPaused
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/40'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isStreamPaused ? 'Resume Feed' : 'Pause Feed'}
          </button>
          <button
            onClick={onTriggerNextItem}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
          >
            <Activity className="w-3.5 h-3.5" />
            Next Sample Item
          </button>
        </div>
      </div>

      {/* Mobile nav fallback row */}
      <div className="flex md:hidden items-center justify-around pt-3 mt-2 border-t border-slate-800/60 text-xs">
        <button
          onClick={() => onSelectTab('feed')}
          className={`py-1 ${activeTab === 'feed' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Sensor Feed
        </button>
        <button
          onClick={() => onSelectTab('scanner')}
          className={`py-1 ${activeTab === 'scanner' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Camera Scan
        </button>
        <button
          onClick={() => onSelectTab('circularity')}
          className={`py-1 ${activeTab === 'circularity' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Anti-Wishcycling
        </button>
        <button
          onClick={() => onSelectTab('calibration')}
          className={`py-1 ${activeTab === 'calibration' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Diagnostics
        </button>
      </div>
    </header>
  );
}
