import React from 'react';
import { Scan, Activity, Terminal, Volume2, VolumeX } from 'lucide-react';

interface TopBarProps {
  activeTab: 'feed' | 'analytics' | 'scanner' | 'circularity' | 'calibration';
  onSelectTab: (tab: 'feed' | 'analytics' | 'scanner' | 'circularity' | 'calibration') => void;
  onTriggerNextItem: () => void;
  isStreamPaused: boolean;
  onToggleStream: () => void;
  onOpenApiInspector: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
}

export function TopBar({
  activeTab,
  onSelectTab,
  onTriggerNextItem,
  isStreamPaused,
  onToggleStream,
  onOpenApiInspector,
  isAudioMuted,
  onToggleAudio
}: TopBarProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Scan className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            SortIQ PureStream
          </span>
          <span className="text-xs text-slate-400 font-mono hidden lg:inline">
            · Optical & NIR Sensor OS
          </span>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-5 text-xs lg:text-sm font-medium text-slate-400">
          <button
            data-testid="nav-feed"
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
            data-testid="nav-analytics"
            onClick={() => onSelectTab('analytics')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'analytics'
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Purity Analytics
          </button>
          <button
            data-testid="nav-scanner"
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
            data-testid="nav-circularity"
            onClick={() => onSelectTab('circularity')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'circularity'
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Anti-Wishcycling
          </button>
          <button
            data-testid="nav-calibration"
            onClick={() => onSelectTab('calibration')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'calibration'
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Diagnostics
          </button>
        </nav>

        {/* Zone 3: Primary action & utilities */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Audio Alert Toggle */}
          <button
            onClick={onToggleAudio}
            title={isAudioMuted ? 'Unmute Audio Alerts' : 'Mute Audio Alerts'}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* API Schema Inspector */}
          <button
            onClick={onOpenApiInspector}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono rounded-lg transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>API Spec</span>
          </button>

          {/* Pause / Resume */}
          <button
            onClick={onToggleStream}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              isStreamPaused
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/40'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isStreamPaused ? 'Resume' : 'Pause'}
          </button>

          {/* Next Sample Action */}
          <button
            onClick={onTriggerNextItem}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <Activity className="w-3.5 h-3.5" />
            Next Sample
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="flex md:hidden items-center justify-around pt-2.5 mt-2 border-t border-slate-800/60 text-xs">
        <button
          onClick={() => onSelectTab('feed')}
          className={`py-1 ${activeTab === 'feed' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Feed
        </button>
        <button
          onClick={() => onSelectTab('analytics')}
          className={`py-1 ${activeTab === 'analytics' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Analytics
        </button>
        <button
          onClick={() => onSelectTab('scanner')}
          className={`py-1 ${activeTab === 'scanner' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Scanner
        </button>
        <button
          onClick={() => onSelectTab('circularity')}
          className={`py-1 ${activeTab === 'circularity' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Codex
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
