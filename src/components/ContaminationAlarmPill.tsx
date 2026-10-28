import React from 'react';
import { AlertOctagon, ShieldAlert, ArrowRight, XCircle } from 'lucide-react';
import { WasteItem } from '../types';

interface ContaminationAlarmPillProps {
  item: WasteItem;
}

export function ContaminationAlarmPill({ item }: ContaminationAlarmPillProps) {
  if (!item.isWishcycleTrap && item.targetBin !== 'BIN_G_HAZARDOUS_DROP') {
    return (
      <div 
        data-testid="status-nominal-pill"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-300"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span>STREAM INTEGRITY: NOMINAL</span>
        <span className="text-slate-400 hidden sm:inline">· Purity &ge;98%</span>
      </div>
    );
  }

  const isEmergency = item.targetBin === 'BIN_G_HAZARDOUS_DROP';

  return (
    <div
      data-testid="contamination-alarm-pill"
      className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg border font-mono text-xs transition-all ${
        isEmergency
          ? 'bg-red-950/70 border-red-500 text-red-200 animate-pulse'
          : 'bg-amber-950/70 border-amber-500 text-amber-200'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-bold uppercase tracking-wider">
          {isEmergency ? 'EMERGENCY HAZARD INTERCEPT' : 'CONTAMINATION DETECTED'}
        </span>
      </div>

      <span className="text-slate-400 hidden md:inline">|</span>

      <div className="hidden sm:flex items-center gap-2">
        <span className="text-slate-300">
          TYPE: <span className="text-white font-bold">{item.chemicalIngredients.contaminantRisk.split(' ')[0]}</span>
        </span>
        <span className="text-slate-400">·</span>
        <span className="text-rose-400 font-semibold">BIN ABORT: ENGAGED</span>
        <span className="text-slate-400">·</span>
        <span className="text-cyan-400">DIVERTER OVERRIDE ACTIVE</span>
      </div>
    </div>
  );
}
