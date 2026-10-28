import React, { useState, useEffect } from 'react';
import { Eye, Layers, Scale, Clock, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { WasteItem, EnvironmentMode } from '../types';
import { ContaminationAlarmPill } from './ContaminationAlarmPill';
import { audioAlerts } from '../utils/audioAlerts';

interface SensorViewportProps {
  item: WasteItem;
  mode: EnvironmentMode;
  isStreamPaused: boolean;
  onToggleStream: () => void;
  onSelectSampleItem: (id: string) => void;
  availableItems: WasteItem[];
}

export function SensorViewport({
  item,
  mode,
  isStreamPaused,
  onToggleStream,
  onSelectSampleItem,
  availableItems
}: SensorViewportProps) {
  const [hoveredWavelength, setHoveredWavelength] = useState<{
    x: number;
    wavelength: number;
    absorption: number;
  } | null>(null);

  // Play audio alert on item change matching operator feedback specification
  useEffect(() => {
    if (item.targetBin === 'BIN_G_HAZARDOUS_DROP') {
      audioAlerts.playEmergencyHazardAlert();
    } else if (item.isWishcycleTrap) {
      audioAlerts.playContaminationWarning();
    } else {
      audioAlerts.playVerifiedChime();
    }
  }, [item.id, item.targetBin, item.isWishcycleTrap]);

  // SVG dimensions for the NIR spectrogram
  const chartWidth = 520;
  const chartHeight = 140;
  const minW = 900;
  const maxW = 1700;

  // Build the SVG path from the spectral points
  const points = item.spectralAbsorptionCurve.map((pt) => {
    const x = ((pt.wavelength - minW) / (maxW - minW)) * chartWidth;
    const y = chartHeight - pt.absorption * (chartHeight - 20) - 10;
    return `${x},${y}`;
  });
  const pathData = `M ${points.join(' L ')}`;
  const areaData = `${pathData} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;

  // Multi-state industrial beacon indicator
  const beaconState = item.targetBin === 'BIN_G_HAZARDOUS_DROP' || item.isWishcycleTrap
    ? 'RED_INTERCEPT'
    : isStreamPaused
    ? 'YELLOW_PROCESSING'
    : 'GREEN_VERIFIED';

  return (
    <div 
      data-testid="spectro-optical-feed-viewer"
      className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col space-y-4 shadow-xl"
    >
      {/* Viewport Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-sm tracking-wide text-white uppercase">
            Spectro-Optical Feed Viewer (240 FPS Hardware Strobe)
          </h2>
        </div>

        {/* Industrial Multi-State LED Beacon (Per Spec UX Strategy) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-[11px] font-mono">
            <span className="text-slate-400">CHUTE BEACON:</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  beaconState === 'RED_INTERCEPT'
                    ? 'bg-rose-500 animate-ping shadow-[0_0_8px_#f43f5e]'
                    : 'bg-slate-800'
                }`}
                title="Red = Contamination Intercept"
              />
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  beaconState === 'YELLOW_PROCESSING'
                    ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]'
                    : 'bg-slate-800'
                }`}
                title="Yellow = Processing / Paused"
              />
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  beaconState === 'GREEN_VERIFIED'
                    ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                    : 'bg-slate-800'
                }`}
                title="Green = Pure Verified Material"
              />
            </div>
            <span className="font-bold text-slate-200">
              {beaconState === 'RED_INTERCEPT' ? 'INTERCEPT' : beaconState === 'YELLOW_PROCESSING' ? 'HOLD' : 'VERIFIED'}
            </span>
          </div>

          <button
            onClick={onToggleStream}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors text-xs font-mono"
          >
            {isStreamPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      {/* Contamination Alert Pill */}
      <ContaminationAlarmPill item={item} />

      {/* Hardware Simulation Viewport Screen */}
      <div className="relative h-64 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-4">
        {/* Animated Laser Scanning Beam */}
        <div className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-laser pointer-events-none z-20" />

        {/* Optical Sensor HUD Corner Elements */}
        <div className="absolute top-3 left-3 font-mono text-[10px] text-slate-400 space-y-0.5 z-10">
          <div>CAM_ID: OPT-RGB-702 (240 FPS)</div>
          <div>STROBE_WINDOW: 120 µs SYNCHRONIZED</div>
          <div>BANDWIDTH: 900nm - 1700nm NIR</div>
        </div>

        <div className="absolute top-3 right-3 font-mono text-xs z-10 flex items-center gap-2">
          <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-2.5 py-1 rounded">
            CONFIDENCE: <span className="font-bold tabular-nums">{item.confidencePercent}%</span>
          </div>
        </div>

        {/* Dynamic Item Target Visualizer Card */}
        <div className="relative z-10 border border-emerald-500/50 bg-slate-900/90 rounded-xl p-5 max-w-md w-full shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              {item.categoryName}
            </span>
            <span className="text-xs font-mono text-slate-400">
              ID: {item.id}
            </span>
          </div>

          <div className="text-base font-bold text-white mb-2 leading-snug">
            {item.name}
          </div>

          {/* Chemical composition snippet */}
          <div className="text-xs text-slate-300 mb-3 bg-slate-950/60 p-2.5 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono mb-0.5">
              Verified Composition
            </div>
            <div className="font-medium text-slate-200">
              {item.chemicalIngredients.primaryComponent}
            </div>
          </div>

          {/* Degradation Flags */}
          <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
            <span
              className={`px-2 py-0.5 rounded ${
                item.visualCondition.crushed
                  ? 'bg-amber-950/50 text-amber-300 border border-amber-600/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              Crushed: {item.visualCondition.crushed ? 'YES' : 'NO'}
            </span>
            <span
              className={`px-2 py-0.5 rounded ${
                item.visualCondition.soiledGrease
                  ? 'bg-rose-950/50 text-rose-300 border border-rose-600/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              Grease Soiled: {item.visualCondition.soiledGrease ? 'DETECTED' : 'CLEAR'}
            </span>
            <span
              className={`px-2 py-0.5 rounded ${
                item.visualCondition.moistureSaturated
                  ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-600/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              Moisture: {item.visualCondition.moistureSaturated ? 'SATURATED' : 'DRY'}
            </span>
          </div>
        </div>

        {/* Viewport Bottom Status Bar */}
        <div className="absolute bottom-2 inset-x-4 flex justify-between items-center text-[10px] font-mono text-slate-400 z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>BELT TRACKING: 2.85 m/s ENCODER SYNC</span>
          </div>
          <div className="text-cyan-400">
            PROCESSING TIME: <span className="font-bold tabular-nums">{item.processingLatencyMs} ms</span> (&lt; 50 ms budget)
          </div>
        </div>
      </div>

      {/* NIR Hyperspectral Absorption Curve Visualizer */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-mono text-slate-300">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">NIR Spectrogram (900nm - 1700nm Fingerprint)</span>
          </div>
          <div className="text-xs font-mono text-cyan-400">
            Detected Peaks: {item.spectralPeaksNm.map((nm) => `${nm}nm`).join(', ')}
          </div>
        </div>

        {/* Interactive SVG Spectrogram */}
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-28 cursor-crosshair"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const relX = Math.max(0, Math.min(chartWidth, (e.clientX - rect.left) * (chartWidth / rect.width)));
              const calcWavelength = Math.round(minW + (relX / chartWidth) * (maxW - minW));
              const closest = item.spectralAbsorptionCurve.reduce((prev, curr) =>
                Math.abs(curr.wavelength - calcWavelength) < Math.abs(prev.wavelength - calcWavelength) ? curr : prev
              );
              setHoveredWavelength({
                x: relX,
                wavelength: closest.wavelength,
                absorption: closest.absorption
              });
            }}
            onMouseLeave={() => setHoveredWavelength(null)}
          >
            <defs>
              <linearGradient id="nirGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Subtle grid lines */}
            <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="#1f2937" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="60" x2={chartWidth} y2="60" stroke="#1f2937" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2={chartWidth} y2="100" stroke="#1f2937" strokeWidth="1" strokeDasharray="3 3" />

            {/* Peak vertical markers */}
            {item.spectralPeaksNm.map((peak) => {
              const peakX = ((peak - minW) / (maxW - minW)) * chartWidth;
              return (
                <g key={peak}>
                  <line
                    x1={peakX}
                    y1="10"
                    x2={peakX}
                    y2={chartHeight}
                    stroke="#10b981"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={peakX}
                    y="14"
                    fill="#34d399"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {peak}nm
                  </text>
                </g>
              );
            })}

            {/* Shaded Area */}
            <path d={areaData} fill="url(#nirGradient)" />

            {/* Main Absorption Curve */}
            <path d={pathData} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />

            {/* Interactive hover indicator */}
            {hoveredWavelength && (
              <g>
                <line
                  x1={hoveredWavelength.x}
                  y1="0"
                  x2={hoveredWavelength.x}
                  y2={chartHeight}
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <circle
                  cx={hoveredWavelength.x}
                  cy={chartHeight - hoveredWavelength.absorption * (chartHeight - 20) - 10}
                  r="4"
                  fill="#f59e0b"
                />
              </g>
            )}
          </svg>

          {/* Tooltip floating */}
          {hoveredWavelength && (
            <div className="text-[11px] font-mono text-amber-300 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded inline-block mt-1">
              Probe: {hoveredWavelength.wavelength}nm · Absorption: {(hoveredWavelength.absorption * 100).toFixed(1)}%
            </div>
          )}
        </div>
      </div>

      {/* Sensor Ingest Sub-Bar: Weight, Purity, Latency */}
      <div className="grid grid-cols-3 gap-3 font-mono text-xs">
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <div className="text-slate-400 text-[10px] flex items-center gap-1">
            <Scale className="w-3 h-3 text-slate-400" />
            LOAD CELL
          </div>
          <div className="text-white font-bold text-sm tabular-nums mt-0.5">
            {item.weightGrams} g
          </div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <div className="text-slate-400 text-[10px] flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            SPECTRAL PURITY
          </div>
          <div className="text-emerald-400 font-bold text-sm tabular-nums mt-0.5">
            {item.chemicalIngredients.purityPercentage}%
          </div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <div className="text-slate-400 text-[10px] flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            INFERENCE DELAY
          </div>
          <div className="text-cyan-400 font-bold text-sm tabular-nums mt-0.5">
            {item.processingLatencyMs} ms
          </div>
        </div>
      </div>

      {/* Quick Sample Selector Bar */}
      <div className="border-t border-slate-800 pt-3">
        <div className="text-[10px] font-mono text-slate-400 mb-2">
          LOAD PRESET CALIBRATION ITEM ONTO SENSOR:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {availableItems.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSampleItem(sample.id)}
              className={`text-xs px-2.5 py-1 rounded font-mono transition-colors border ${
                item.id === sample.id
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
              }`}
            >
              {sample.name.split(' ')[0]} {sample.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
