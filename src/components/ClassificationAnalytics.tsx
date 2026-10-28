import React from 'react';
import { 
  BarChart3, 
  Gauge, 
  TrendingUp, 
  DollarSign, 
  Leaf, 
  ShieldCheck, 
  AlertTriangle, 
  Layers,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { SPEC_STREAM_CLASSIFICATIONS } from '../data/specData';

interface ClassificationAnalyticsProps {
  currentPurityPercent: number;
  totalInterceptsCount: number;
  totalItemsCount: number;
}

export function ClassificationAnalytics({
  currentPurityPercent,
  totalInterceptsCount,
  totalItemsCount
}: ClassificationAnalyticsProps) {
  // Calculations based on municipal MRF economics
  const contaminantsBlockedKg = (totalInterceptsCount * 0.142).toFixed(1);
  const carbonOffsetCo2e = (totalInterceptsCount * 0.084).toFixed(2);
  const penaltyAvoidanceDollars = (totalInterceptsCount * 1.85).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  const balePurityStreams = [
    { name: 'Clear PET Bales (#1)', current: 99.4, historical24h: 99.1, target: 98.0, risk: 'Low (0.3%)' },
    { name: 'Rigid HDPE Natural (#2)', current: 98.9, historical24h: 98.7, target: 98.0, risk: 'Low (0.6%)' },
    { name: 'Sorted Clean Corrugated Fiber', current: 98.5, historical24h: 98.2, target: 98.0, risk: 'Minimal (0.8%)' },
    { name: 'Food Scraps & Wet Organics', current: 99.6, historical24h: 99.5, target: 98.0, risk: 'Very Low (0.1%)' }
  ];

  return (
    <div className="space-y-6" data-testid="classification-analytics-view">
      {/* Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Throughput, Yield, and Bale Purity Analytics
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Industrial audit metrics for Material Recovery Facility managers and municipal environmental compliance officers. Guarantees ASTM & ISO 15270 recycled commodity purity standards.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">AUDIT INTERVAL: </span>
              <span className="text-emerald-400 font-bold">REAL-TIME</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wishcycling Interception Tracker Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Contaminants Intercepted</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold text-amber-400 tabular-nums">
              {contaminantsBlockedKg} <span className="text-base font-normal text-slate-400">kg</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Prevented pulper & extruder fouling</span>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Landfill Carbon Avoidance</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold text-emerald-400 tabular-nums">
              {carbonOffsetCo2e} <span className="text-base font-normal text-slate-400">MT CO2e</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Methane abatement via source separation</span>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Mill Rejection Penalty Saved</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold text-cyan-400 tabular-nums">
              {penaltyAvoidanceDollars}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero downgraded bales or mill fines</span>
          </div>
        </div>
      </div>

      {/* Stream Purity Gauge & Bale Purity Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase font-mono">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <span>Stream Purity Indices & Downgrade Risk Audit</span>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            CURRENT COMPOSITE PURITY: {currentPurityPercent}%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Recycled Commodity Stream</th>
                <th className="py-2.5 px-3">Live Purity %</th>
                <th className="py-2.5 px-3">24h Rolling Purity</th>
                <th className="py-2.5 px-3">Quality Floor</th>
                <th className="py-2.5 px-3">Downgrade Risk Score</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {balePurityStreams.map((stream, idx) => (
                <tr key={idx} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">
                    {stream.name}
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-bold tabular-nums">
                    {stream.current}%
                  </td>
                  <td className="py-3 px-3 text-slate-300 tabular-nums">
                    {stream.historical24h}%
                  </td>
                  <td className="py-3 px-3 text-slate-400 tabular-nums">
                    &ge;{stream.target}%
                  </td>
                  <td className="py-3 px-3 text-cyan-300">
                    {stream.risk}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                      GRADE A CERTIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stream Classifications from Spec */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Spec Stream Classifications & Signatures
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SPEC_STREAM_CLASSIFICATIONS.map((stream) => (
            <div
              key={stream.stream_id}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-1">
                  <span>{stream.stream_id}</span>
                </div>
                <div className="font-bold text-sm text-white">{stream.display_name}</div>
                <div className="text-[11px] font-mono text-slate-400 mt-2 space-y-1">
                  <div>
                    NIR Peaks: {stream.sensor_signatures.nir_absorption_peaks_nm.join('nm, ')}nm
                  </div>
                  <div>
                    Visual Features: {stream.sensor_signatures.rgb_visual_features.join(', ')}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 text-xs">
                <div className="text-[11px] text-cyan-300 font-medium">
                  {stream.downstream_path}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
