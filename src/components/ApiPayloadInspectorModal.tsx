import React, { useState } from 'react';
import { Terminal, Copy, Check, X, Code2, Server, Cpu } from 'lucide-react';
import { WasteItem } from '../types';

interface ApiPayloadInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentItem: WasteItem;
}

export function ApiPayloadInspectorModal({
  isOpen,
  onClose,
  currentItem
}: ApiPayloadInspectorModalProps) {
  const [activeSchemaTab, setActiveSchemaTab] = useState<'INGEST' | 'ACTUATOR'>('INGEST');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Real-time sensor ingest packet matching spec schema
  const sensorIngestPacket = {
    timestamp_utc_epoch_us: Date.now() * 1000,
    sensor_station_id: 'MRF_LINE_03_OPT_NIR_01',
    conveyor_speed_mps: 2.85,
    optical_payload: {
      frame_id: 9842104 + Math.floor(Math.random() * 100),
      item_bounding_box: {
        x_min: 142,
        y_min: 58,
        x_max: 420,
        y_max: 310
      },
      visual_degradation_flags: {
        crushed: currentItem.visualCondition.crushed,
        soiled: currentItem.visualCondition.soiledGrease,
        partially_occluded: currentItem.visualCondition.partiallyOccluded
      }
    },
    spectral_payload: {
      dominant_polymer_fingerprint: currentItem.materialType,
      confidence_score: +(currentItem.confidencePercent / 100).toFixed(3),
      spectral_cleanliness_ratio: +(currentItem.chemicalIngredients.purityPercentage / 100).toFixed(2),
      identified_absorption_peaks_nm: currentItem.spectralPeaksNm
    },
    gravimetric_payload: {
      measured_weight_grams: currentItem.weightGrams
    }
  };

  // Real-time actuator command packet matching spec schema
  const actuatorCommandPacket = {
    command_id: `CMD_20261028_09${Math.floor(100000 + Math.random() * 900000)}`,
    target_actuator_id: currentItem.actuatorType === 'PNEUMATIC_AIR_JET'
      ? `AIR_JET_BANK_04_V${currentItem.actuatorValveIndex || 7}`
      : currentItem.actuatorType === 'MOTORIZED_DIVERTER'
      ? 'DIVERTER_GATE_02'
      : 'DELTA_ROBOT_GANTRY_01',
    actuator_type: currentItem.actuatorType,
    valve_indices: currentItem.actuatorValveIndex ? [currentItem.actuatorValveIndex] : [7, 8, 9],
    firing_timestamp_utc_epoch_us: Date.now() * 1000 + 42000,
    pulse_duration_microseconds: currentItem.actuatorDurationMs * 1000,
    destination_bin_id: currentItem.targetBin,
    rejection_flag: currentItem.isWishcycleTrap,
    audit_trail: {
      total_processing_latency_ms: currentItem.processingLatencyMs,
      classification_confidence: +(currentItem.confidencePercent / 100).toFixed(3),
      anti_wishcycling_override: currentItem.isWishcycleTrap
    }
  };

  const currentPayloadJson = JSON.stringify(
    activeSchemaTab === 'INGEST' ? sensorIngestPacket : actuatorCommandPacket,
    null,
    2
  );

  const copyPayload = () => {
    navigator.clipboard.writeText(currentPayloadJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      data-testid="api-payload-modal"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Live Edge API Data Contract Inspector
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Real-Time MQTT / Kafka Payload Schemas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between mt-4 mb-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveSchemaTab('INGEST')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeSchemaTab === 'INGEST'
                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              sensor_ingest_packet
            </button>
            <button
              onClick={() => setActiveSchemaTab('ACTUATOR')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeSchemaTab === 'ACTUATOR'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              actuator_command_packet
            </button>
          </div>

          <button
            onClick={copyPayload}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
        </div>

        {/* JSON Code Viewer */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-auto flex-1 font-mono text-xs text-emerald-300">
          <pre>{currentPayloadJson}</pre>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div>Broker: EMQX MQTT / Kafka Topic: `sortiq/line03/telemetry`</div>
          <div className="text-emerald-400 font-bold">Latency: {currentItem.processingLatencyMs}ms (INT8 Quantized)</div>
        </div>
      </div>
    </div>
  );
}
