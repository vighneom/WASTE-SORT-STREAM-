import React from 'react';
import { Sliders, Wind, CheckCircle, AlertOctagon, Cpu, Zap, Activity } from 'lucide-react';
import { WasteItem } from '../types';

interface ActuatorMatrixProps {
  item: WasteItem;
  airPressureBar: number;
}

export function ActuatorMatrix({ item, airPressureBar }: ActuatorMatrixProps) {
  // 16 pneumatic valve nozzles across the conveyor width
  const totalValves = 16;
  const activeValve = item.actuatorValveIndex || 4;

  const latencyBreakdown = [
    { label: 'Sensor Ingest & Calibration', ms: 8, color: 'bg-cyan-500' },
    { label: 'NIR + RGB Quantized Inference', ms: 22, color: 'bg-emerald-500' },
    { label: 'Belt Encoder Velocity Tracking', ms: 4, color: 'bg-indigo-500' },
    { label: 'PLC / EtherCAT Signal Dispatch', ms: 6, color: 'bg-purple-500' }
  ];

  const totalCalculatedLatency = latencyBreakdown.reduce((sum, step) => sum + step.ms, 0);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-sm tracking-wide text-white uppercase">
            Downstream Actuator Bus & Pneumatic Manifold
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">MANIFOLD PRESSURE:</span>
          <span className="text-purple-300 font-bold tabular-nums">{airPressureBar.toFixed(1)} BAR</span>
        </div>
      </div>

      {/* 16-Valve Air Jet Array */}
      <div>
        <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between">
          <span>HIGH-FREQUENCY SOLENOID AIR-JET BANK (16 NOZZLES)</span>
          <span className="text-emerald-400 font-bold">
            {item.actuatorType === 'PNEUMATIC_AIR_JET'
              ? `TRIGGERED: NOZZLE #${activeValve} (${item.actuatorDurationMs}ms PULSE)`
              : `${item.actuatorType} ACTIVATED`}
          </span>
        </div>

        <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 p-3 bg-slate-950 rounded-xl border border-slate-800">
          {Array.from({ length: totalValves }).map((_, i) => {
            const valveNum = i + 1;
            const isFiring = item.actuatorType === 'PNEUMATIC_AIR_JET' && valveNum === activeValve;
            return (
              <div
                key={valveNum}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center ${
                  isFiring
                    ? 'bg-purple-500/20 border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.4)] text-purple-300 scale-105'
                    : 'bg-slate-900 border-slate-800/80 text-slate-500'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full mb-1 ${
                    isFiring ? 'bg-purple-400 animate-ping' : 'bg-slate-700'
                  }`}
                />
                <span className="text-[10px] font-mono font-bold">#{valveNum}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Latency Budget Waterfall (Must be < 50ms) */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>OPERATIONAL LATENCY BUDGET WATERFALL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Total:</span>
            <span className="text-emerald-400 font-bold tabular-nums">
              {totalCalculatedLatency} ms
            </span>
            <span className="text-slate-500">/ 50 ms max floor</span>
          </div>
        </div>

        {/* Progress Bar Stack */}
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex">
          {latencyBreakdown.map((step, idx) => (
            <div
              key={idx}
              className={`${step.color} h-full transition-all`}
              style={{ width: `${(step.ms / 50) * 100}%` }}
              title={`${step.label}: ${step.ms}ms`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono pt-1 text-slate-400">
          {latencyBreakdown.map((step, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${step.color}`} />
              <span className="truncate">{step.label}</span>
              <span className="text-slate-200 font-bold ml-auto tabular-nums">{step.ms}ms</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actuator Audit Log Line */}
      <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>PLC EtherCAT Handshake: 1.2µs Jitter · Zero Packet Drops</span>
        </div>
        <div className="text-emerald-400">
          Target Route: <span className="font-bold">{item.targetBin}</span>
        </div>
      </div>
    </div>
  );
}
