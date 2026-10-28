import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Gauge, 
  Layers, 
  ShieldAlert, 
  Sliders, 
  Radio, 
  Scale, 
  Zap, 
  RefreshCw 
} from 'lucide-react';
import { EnvironmentMode, WasteItem, SystemMetrics } from './types';
import { WASTE_ITEMS } from './data/wasteDatabase';
import { TopBar } from './components/TopBar';
import { EnvironmentBanner } from './components/EnvironmentBanner';
import { SensorViewport } from './components/SensorViewport';
import { DeterministicDirectives } from './components/DeterministicDirectives';
import { ActuatorMatrix } from './components/ActuatorMatrix';
import { CameraSensorScanner } from './components/CameraSensorScanner';
import { CircularityHub } from './components/CircularityHub';
import { HardwareCalibration } from './components/HardwareCalibration';
import { ClassificationAnalytics } from './components/ClassificationAnalytics';
import { ApiPayloadInspectorModal } from './components/ApiPayloadInspectorModal';
import { audioAlerts } from './utils/audioAlerts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'analytics' | 'scanner' | 'circularity' | 'calibration'>('feed');
  const [currentMode, setCurrentMode] = useState<EnvironmentMode>('INDUSTRIAL_MRF');
  const [itemIndex, setItemIndex] = useState(0);
  const [isStreamPaused, setIsStreamPaused] = useState(false);
  const [beltSpeedMps, setBeltSpeedMps] = useState(2.85);
  const [airPressureBar, setAirPressureBar] = useState(8.2);
  const [isApiInspectorOpen, setIsApiInspectorOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // System telemetry metrics
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalItemsSorted: 52410,
    streamPurityRate: 99.24,
    wishcyclingInterceptedCount: 7120,
    averageLatencyMs: 28.5,
    pneumaticPressureBar: 8.2,
    encoderBeltSpeedMps: 2.85,
    opticalFps: 240
  });

  const currentItem: WasteItem = WASTE_ITEMS[itemIndex];

  // Auto-stream conveyor simulation
  useEffect(() => {
    if (isStreamPaused || activeTab !== 'feed') return;

    const interval = setInterval(() => {
      setItemIndex((prev) => (prev + 1) % WASTE_ITEMS.length);
      setMetrics((prev) => ({
        ...prev,
        totalItemsSorted: prev.totalItemsSorted + 1,
        wishcyclingInterceptedCount: currentItem.isWishcycleTrap
          ? prev.wishcyclingInterceptedCount + 1
          : prev.wishcyclingInterceptedCount,
        averageLatencyMs: +(26 + Math.random() * 7).toFixed(1)
      }));
    }, 4200);

    return () => clearInterval(interval);
  }, [isStreamPaused, activeTab, currentItem.isWishcycleTrap]);

  const handleNextItem = () => {
    setItemIndex((prev) => (prev + 1) % WASTE_ITEMS.length);
  };

  const handleSelectSample = (id: string) => {
    const idx = WASTE_ITEMS.findIndex((item) => item.id === id);
    if (idx !== -1) {
      setItemIndex(idx);
    }
  };

  const handleClassifiedItem = (classifiedItem: WasteItem) => {
    const idx = WASTE_ITEMS.findIndex((i) => i.id === classifiedItem.id);
    if (idx !== -1) {
      setItemIndex(idx);
    }
  };

  const handleToggleAudio = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    audioAlerts.setMuted(nextMuted);
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950"
      data-testid="app-root"
    >
      {/* 3-Zone Top Navigation Bar */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onTriggerNextItem={handleNextItem}
        isStreamPaused={isStreamPaused}
        onToggleStream={() => setIsStreamPaused(!isStreamPaused)}
        onOpenApiInspector={() => setIsApiInspectorOpen(true)}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Environment Mode Switcher & Engineer Directive */}
        <EnvironmentBanner
          currentMode={currentMode}
          onSelectMode={setCurrentMode}
        />

        {/* Real-Time Operational Telemetry Strip (4-column quantitative metrics) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Feed Volume Today</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white tabular-nums my-1">
              {metrics.totalItemsSorted.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400">
              Conveyor Velocity: <span className="text-emerald-400 font-semibold">{beltSpeedMps.toFixed(2)} m/s</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Verified Stream Purity</span>
              <Gauge className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums my-1">
              {metrics.streamPurityRate}%
            </div>
            <div className="text-[11px] text-slate-400">
              Contract Quality Floor: <span className="text-slate-300 font-semibold">&ge;98.0%</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Wishcycling Averted</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 tabular-nums my-1">
              {metrics.wishcyclingInterceptedCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400">
              Contamination Rejected: <span className="text-amber-300 font-semibold">100% Deterministic</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Hardware Inference</span>
              <Radio className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-cyan-400 tabular-nums my-1">
              {currentItem.processingLatencyMs} ms
            </div>
            <div className="text-[11px] text-slate-400">
              Threshold Budget: <span className="text-cyan-300 font-semibold">&lt;50 ms Safe</span>
            </div>
          </div>
        </div>

        {/* Tab 1: Live Sensor Feed View (/dashboard/live-stream) */}
        {activeTab === 'feed' && (
          <div className="space-y-6" data-testid="live-feed-tab">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Optical & NIR Sensor Viewport (7 Cols) */}
              <div className="lg:col-span-7">
                <SensorViewport
                  item={currentItem}
                  mode={currentMode}
                  isStreamPaused={isStreamPaused}
                  onToggleStream={() => setIsStreamPaused(!isStreamPaused)}
                  onSelectSampleItem={handleSelectSample}
                  availableItems={WASTE_ITEMS}
                />
              </div>

              {/* Right Column: Deterministic Directives & Downstream Instructions (5 Cols) */}
              <div className="lg:col-span-5">
                <DeterministicDirectives
                  item={currentItem}
                  mode={currentMode}
                />
              </div>
            </div>

            {/* Bottom Row: Pneumatic Actuator Manifold & Latency Budget Waterfall */}
            <ActuatorMatrix
              item={currentItem}
              airPressureBar={airPressureBar}
            />
          </div>
        )}

        {/* Tab 2: Purity & Yield Analytics (/dashboard/classification-analytics) */}
        {activeTab === 'analytics' && (
          <ClassificationAnalytics
            currentPurityPercent={metrics.streamPurityRate}
            totalInterceptsCount={metrics.wishcyclingInterceptedCount}
            totalItemsCount={metrics.totalItemsSorted}
          />
        )}

        {/* Tab 3: Camera & Photo Scanner (/portal/user-guidance) */}
        {activeTab === 'scanner' && (
          <CameraSensorScanner onItemClassified={handleClassifiedItem} />
        )}

        {/* Tab 4: Anti-Wishcycling & Circularity Directory */}
        {activeTab === 'circularity' && (
          <CircularityHub />
        )}

        {/* Tab 5: Hardware Diagnostics & Sensor Calibration (/admin/hardware-calibration) */}
        {activeTab === 'calibration' && (
          <HardwareCalibration
            airPressureBar={airPressureBar}
            onUpdateAirPressure={setAirPressureBar}
            beltSpeedMps={beltSpeedMps}
            onUpdateBeltSpeed={setBeltSpeedMps}
          />
        )}
      </main>

      {/* API Data Contract Schema Modal */}
      <ApiPayloadInspectorModal
        isOpen={isApiInspectorOpen}
        onClose={() => setIsApiInspectorOpen(false)}
        currentItem={currentItem}
      />

      {/* Engineering Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-4 mt-auto text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            SortIQ PureStream OS v4.2.0-LTS &bull; Optical, NIR & Gravimetric Automated Waste Segregation
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
            <span>ISO 15270 (Plastics Recovery)</span>
            <span>·</span>
            <span>DIN SPEC 91446 Grade A</span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold">Subsystem Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
