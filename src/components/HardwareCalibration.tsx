import React, { useState } from 'react';
import { 
  Sliders, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  RefreshCw, 
  Gauge, 
  Disc, 
  Zap, 
  Terminal,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface HardwareCalibrationProps {
  airPressureBar: number;
  onUpdateAirPressure: (val: number) => void;
  beltSpeedMps: number;
  onUpdateBeltSpeed: (val: number) => void;
}

export function HardwareCalibration({
  airPressureBar,
  onUpdateAirPressure,
  beltSpeedMps,
  onUpdateBeltSpeed
}: HardwareCalibrationProps) {
  const [exposureUs, setExposureUs] = useState(120);
  const [darkCalibrated, setDarkCalibrated] = useState(true);
  const [whiteCalibrated, setWhiteCalibrated] = useState(true);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibratedMessage, setCalibratedMessage] = useState<string | null>(null);
  const [testValveActive, setTestValveActive] = useState<number | null>(null);

  // Trigger White/Dark tile reference scan
  const triggerBaselineScan = (type: 'DARK' | 'WHITE') => {
    setIsCalibrating(true);
    setCalibratedMessage(`Calibrating ${type} reference baseline...`);
    setTimeout(() => {
      setIsCalibrating(false);
      if (type === 'DARK') {
        setDarkCalibrated(true);
        setCalibratedMessage('Dark current thermal baseline recorded: Sensor noise < 0.008 AU.');
      } else {
        setWhiteCalibrated(true);
        setCalibratedMessage('White ceramic PTFE tile 99.8% reflectance baseline recorded: SNR = 2640:1.');
      }
    }, 1200);
  };

  // Test pulse air jet
  const testFireValve = (valveNumber: number) => {
    setTestValveActive(valveNumber);
    setTimeout(() => {
      setTestValveActive(null);
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Sensor Hardware Diagnostics & Calibration Engine
          </h2>
        </div>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Calibrate physical hardware components including high-speed optical exposure synchronization, Near-Infrared baseline white/dark references, conveyor belt rotary encoders, and pneumatic air jet manifold pressure.
        </p>

        {calibratedMessage && (
          <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-mono">{calibratedMessage}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: NIR Hyperspectral Baseline Calibration */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider font-mono">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>NIR Baseline Calibration</span>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              TE-COOLER: -20°C LOCKED
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Dust accumulation or ambient drift causes baseline absorbance distortion. Run reference scans to maintain &gt;98% classification confidence on difficult polymers (PET vs PVC vs PLA).
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => triggerBaselineScan('DARK')}
              disabled={isCalibrating}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all"
            >
              <div className="text-xs font-bold text-white">Dark Current Scan</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Shutter closed noise floor</div>
              <div className="text-[10px] font-mono text-emerald-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {darkCalibrated ? 'CALIBRATED' : 'REQUIRED'}
              </div>
            </button>

            <button
              onClick={() => triggerBaselineScan('WHITE')}
              disabled={isCalibrating}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all"
            >
              <div className="text-xs font-bold text-white">White Tile Scan</div>
              <div className="text-[10px] text-slate-400 mt-0.5">99.8% Sintered PTFE ceramic</div>
              <div className="text-[10px] font-mono text-emerald-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {whiteCalibrated ? 'CALIBRATED' : 'REQUIRED'}
              </div>
            </button>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1 text-slate-400">
            <div className="flex justify-between">
              <span>Sensor Bandwidth:</span>
              <span className="text-white">900nm - 1700nm</span>
            </div>
            <div className="flex justify-between">
              <span>Spectral Resolution:</span>
              <span className="text-white">4.2 nm / pixel</span>
            </div>
            <div className="flex justify-between">
              <span>Signal-to-Noise Ratio (SNR):</span>
              <span className="text-emerald-400 font-bold">2,640 : 1</span>
            </div>
          </div>
        </div>

        {/* Module 2: Conveyor Speed & Optical Exposure Synchronization */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider font-mono">
              <Disc className="w-4 h-4 text-emerald-400" />
              <span>Conveyor Encoder & Exposure</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              10,000 PULSES / METER
            </span>
          </div>

          {/* Belt Speed Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Conveyor Velocity:</span>
              <span className="text-emerald-400 font-bold tabular-nums">{beltSpeedMps.toFixed(2)} m/s</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.05"
              value={beltSpeedMps}
              onChange={(e) => onUpdateBeltSpeed(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 cursor-pointer h-1.5 rounded"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>1.0 m/s (Inspection)</span>
              <span>2.8 m/s (Standard MRF)</span>
              <span>4.0 m/s (Peak)</span>
            </div>
          </div>

          {/* Exposure Time Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Camera Exposure Window:</span>
              <span className="text-cyan-400 font-bold tabular-nums">{exposureUs} µs</span>
            </div>
            <input
              type="range"
              min="50"
              max="400"
              step="10"
              value={exposureUs}
              onChange={(e) => setExposureUs(parseInt(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-800 cursor-pointer h-1.5 rounded"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>50 µs (Zero Blur)</span>
              <span>120 µs (Optimal)</span>
              <span>400 µs (High Light)</span>
            </div>
          </div>

          {/* Calculated Motion Blur */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1 text-slate-400">
            <div className="flex justify-between">
              <span>Calculated Motion Blur:</span>
              <span className="text-emerald-400 font-bold">
                {((beltSpeedMps * (exposureUs / 1000000)) * 1000).toFixed(2)} mm (Sub-pixel)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Optical Strobe Pulse Delay:</span>
              <span className="text-white">12.4 µs</span>
            </div>
          </div>
        </div>

        {/* Module 3: Pneumatic Actuator Manifold Test Bench */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider font-mono">
              <Gauge className="w-4 h-4 text-purple-400" />
              <span>Pneumatic Actuator Manifold</span>
            </div>
            <span className="text-xs font-mono text-purple-300 font-bold">
              {airPressureBar.toFixed(1)} BAR
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            High-speed air jet ejectors require minimum 7.5 bar pressure to reliably reject heavy 2-liter HDPE bottles traveling at 3.0 m/s without missing target bin trajectory.
          </p>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Regulator Pressure:</span>
              <span className="text-purple-300 font-bold tabular-nums">{airPressureBar.toFixed(1)} Bar</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="10.0"
              step="0.1"
              value={airPressureBar}
              onChange={(e) => onUpdateAirPressure(parseFloat(e.target.value))}
              className="w-full accent-purple-500 bg-slate-800 cursor-pointer h-1.5 rounded"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>5.0 Bar (Low)</span>
              <span>8.2 Bar (Nominal)</span>
              <span>10.0 Bar (Heavy Mass)</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-slate-400 mb-2">
              CLICK VALVE TO TEST PULSE (10ms DRY BLAST):
            </div>
            <div className="grid grid-cols-8 gap-1.5">
              {Array.from({ length: 8 }).map((_, idx) => {
                const v = idx + 1;
                return (
                  <button
                    key={v}
                    onClick={() => testFireValve(v)}
                    className={`py-2 rounded font-mono text-xs border transition-all ${
                      testValveActive === v
                        ? 'bg-purple-500 text-white border-purple-400 animate-pulse'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    V{v}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Module 4: System Invariants & Quality Audit */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Subsystem Health Checklist</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              ALL NOMINAL
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-300">Optical RGB High-Speed Strobe:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-300">Hyperspectral InGaAs Sensor:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> -20°C Peltier Locked
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-300">Strain-Gauge Digital Load Cell:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tared (±0.2g accuracy)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-300">PLC EtherCAT Real-Time Bus:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> &lt; 2.0 ms roundtrip
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
