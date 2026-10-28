import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  HelpCircle,
  ShieldCheck, 
  Sparkles, 
  FileText 
} from 'lucide-react';
import { WasteItem, EnvironmentMode } from '../types';

interface DeterministicDirectivesProps {
  item: WasteItem;
  mode: EnvironmentMode;
}

export function DeterministicDirectives({ item, mode }: DeterministicDirectivesProps) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-sm tracking-wide text-white uppercase">
              Deterministic Sorting Directive
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {mode === 'INDUSTRIAL_MRF'
              ? 'Actuator Routing Signal'
              : mode === 'COMMERCIAL_RESTAURANT'
              ? 'Kitchen Segregation Chute'
              : 'Countertop Bin Guide'}
          </span>
        </div>

        {/* Big High-Contrast Target Bin Banner */}
        <div
          className={`border rounded-xl p-4 mb-4 transition-all ${
            item.targetBin === 'BIN_F_RESIDUAL_LANDFILL'
              ? 'bg-rose-950/30 border-rose-500/50'
              : item.targetBin === 'BIN_G_HAZARDOUS_DROP'
              ? 'bg-red-950/50 border-red-500/80 animate-pulse'
              : item.targetBin === 'BIN_C_ORGANICS'
              ? 'bg-emerald-950/30 border-emerald-500/50'
              : 'bg-cyan-950/30 border-cyan-500/50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-slate-400 uppercase tracking-wider">
              ALLOCATED TARGET DESTINATION
            </span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-xs ${
                item.targetBin === 'BIN_F_RESIDUAL_LANDFILL'
                  ? 'bg-rose-500/20 text-rose-300'
                  : item.targetBin === 'BIN_G_HAZARDOUS_DROP'
                  ? 'bg-red-500/30 text-red-200'
                  : item.targetBin === 'BIN_C_ORGANICS'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-cyan-500/20 text-cyan-300'
              }`}
            >
              {item.targetBin}
            </span>
          </div>

          <div className="text-xl font-bold text-white tracking-tight">
            {item.targetBinName}
          </div>

          <div className="mt-2 text-xs flex items-center gap-2 font-mono">
            <span className="text-slate-400">Actuator Command:</span>
            <span className="font-bold text-emerald-400">
              {item.actuatorType === 'PNEUMATIC_AIR_JET'
                ? `VALVE NOZZLE #${item.actuatorValveIndex} (${item.actuatorDurationMs}ms BLAST)`
                : item.actuatorType === 'MOTORIZED_DIVERTER'
                ? `SERVO GATE #${item.actuatorValveIndex} (DIVERTER ACTIVE)`
                : item.actuatorType === 'DELTA_ROBOT_PICKER'
                ? 'GANTRY VACUUM PICK & PLACE'
                : 'DISPLAY CHUTE INDICATOR LIGHT'}
            </span>
          </div>
        </div>

        {/* Anti-Wishcycling Alert (Engineer Philosophy in Action) */}
        <div
          className={`rounded-xl p-4 mb-4 border ${
            item.isWishcycleTrap
              ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
              : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5">
            {item.isWishcycleTrap ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300">Anti-Wishcycling Intercept: Do Not Place in Blue Bin</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Certified Recyclable Stream Candidate</span>
              </>
            )}
          </div>
          <p className="text-xs leading-relaxed text-slate-300">
            {item.wishcyclingTrapRationale}
          </p>
        </div>

        {/* Chemical Ingredients & Purity */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 mb-3 text-xs">
          <div className="text-slate-400 text-[10px] uppercase font-mono mb-1.5 flex items-center justify-between">
            <span>Material Ingredients Breakdown</span>
            <span className="text-emerald-400 font-bold">{item.chemicalIngredients.purityPercentage}% Purity</span>
          </div>
          <div className="space-y-1">
            <div className="text-slate-200 font-medium">
              Primary: <span className="text-white">{item.chemicalIngredients.primaryComponent}</span>
            </div>
            {item.chemicalIngredients.secondaryComponents.length > 0 && (
              <div className="text-slate-400 text-[11px]">
                Additives / Films: {item.chemicalIngredients.secondaryComponents.join(' · ')}
              </div>
            )}
            <div className="text-[11px] text-amber-400/90 font-mono mt-1 pt-1 border-t border-slate-800">
              Contamination Risk: {item.chemicalIngredients.contaminantRisk}
            </div>
          </div>
        </div>

        {/* Source Preparation Checklist */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 mb-3 text-xs">
          <div className="text-slate-200 font-semibold mb-2 flex items-center gap-1.5">
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            Mandatory Source Preparation Protocol
          </div>
          <ul className="space-y-1.5 text-slate-300">
            {item.preparationProtocol.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded bg-slate-800 text-[10px] font-mono flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Downstream Circular Pathway */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="text-cyan-300 font-semibold flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              Downstream Recycling Pathway
            </div>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">
              Circularity Index: {item.downstreamCircularPathway.circularityScore}/100
            </span>
          </div>

          <div className="text-slate-300 text-xs mb-2 font-medium">
            Method: <span className="text-white">{item.downstreamCircularPathway.method}</span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono mb-2">
            End Product: <span className="text-slate-200">{item.downstreamCircularPathway.endProduct}</span>
          </div>

          <div className="text-[10px] text-slate-400 font-mono bg-slate-900 p-2 rounded border border-slate-800">
            Impact: {item.downstreamCircularPathway.landfillDiversionTonsEstimate}
          </div>
        </div>
      </div>
    </div>
  );
}
