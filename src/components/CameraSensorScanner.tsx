import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Scale, 
  ArrowRight,
  ShieldAlert,
  Zap,
  Info
} from 'lucide-react';
import { WasteItem } from '../types';
import { WASTE_ITEMS } from '../data/wasteDatabase';

interface CameraSensorScannerProps {
  onItemClassified: (item: WasteItem) => void;
}

export function CameraSensorScanner({ onItemClassified }: CameraSensorScannerProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzedItem, setAnalyzedItem] = useState<WasteItem | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start real webcam stream
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access unavailable or declined. You can upload an image or choose a sample test item below.');
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture frame from webcam
  const captureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      stopCamera();
      analyzeCapturedData(dataUrl);
    }
  };

  // Handle uploaded file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCapturedImage(dataUrl);
        stopCamera();
        analyzeCapturedData(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate or run edge sensor inference
  const analyzeCapturedData = (imageData: string, presetItem?: WasteItem) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const selected = presetItem || WASTE_ITEMS[Math.floor(Math.random() * WASTE_ITEMS.length)];
      setAnalyzedItem(selected);
      setIsAnalyzing(false);
      onItemClassified(selected);
    }, 900);
  };

  const selectPresetForScan = (preset: WasteItem) => {
    setCapturedImage(null);
    stopCamera();
    analyzeCapturedData('', preset);
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Point-of-Disposal Waste Sensor Scanner
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Use your device camera or upload an image to simulate the optical & NIR sensor. The platform identifies the material, evaluates food/grease contamination, reveals chemical ingredients, dictates the exact target bin, and provides unambiguous instructions on how the item is recycled.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <Camera className="w-4 h-4" />
                Enable Device Camera
              </button>
            ) : (
              <button
                onClick={captureFrame}
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 animate-pulse shadow-md"
              >
                <Zap className="w-4 h-4" />
                Capture & Analyze Now
              </button>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Photo
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {cameraError && (
          <div className="mt-4 p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}
      </div>

      {/* Main Viewport & Analysis Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Camera Feed / Viewport Simulator (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Sensor Camera Viewport
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              {cameraActive ? 'LIVE HARDWARE STREAM' : capturedImage ? 'STATIC CAPTURED FRAME' : 'READY TO SCAN'}
            </span>
          </div>

          {/* Video or Image or Placeholder */}
          <div className="relative h-80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured Waste Item"
                className="w-full h-full object-contain bg-slate-950"
              />
            ) : (
              <div className="text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-500">
                  <Camera className="w-8 h-8" />
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  No active camera feed
                </div>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Click 'Enable Device Camera' above, upload an image of a waste item, or pick a sample below to test.
                </p>
              </div>
            )}

            {/* Scanning beam overlay when analyzing or camera active */}
            {(cameraActive || isAnalyzing) && (
              <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_15px_#34d399] animate-laser pointer-events-none z-20" />
            )}

            {isAnalyzing && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-30">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                <div className="text-xs font-mono text-emerald-300 font-bold">
                  RUNNING NIR HYPERSPECTRAL & OPTICAL SENSOR MODEL...
                </div>
              </div>
            )}
          </div>

          {/* Quick Preset Selector for instant testing */}
          <div>
            <div className="text-[11px] font-mono text-slate-400 mb-2">
              OR TEST COMMON AMBIGUOUS ITEMS (CLICK TO SCAN):
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {WASTE_ITEMS.slice(0, 6).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => selectPresetForScan(preset)}
                  className="px-2.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 rounded-lg text-left transition-all"
                >
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {preset.name}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400">
                    {preset.materialType}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Real-Time Results & Actionable Instructions (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Sensor Classification Verdict & Instructions
            </span>
          </div>

          {analyzedItem ? (
            <div className="space-y-4">
              {/* Target Bin Result Banner */}
              <div
                className={`p-4 rounded-xl border ${
                  analyzedItem.targetBin === 'BIN_F_RESIDUAL_LANDFILL'
                    ? 'bg-rose-950/40 border-rose-500/50'
                    : analyzedItem.targetBin === 'BIN_G_HAZARDOUS_DROP'
                    ? 'bg-red-950/60 border-red-500/80 animate-pulse'
                    : analyzedItem.targetBin === 'BIN_C_ORGANICS'
                    ? 'bg-emerald-950/40 border-emerald-500/50'
                    : 'bg-cyan-950/40 border-cyan-500/50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">TARGET DESTINATION BIN</span>
                  <span className="font-bold px-2 py-0.5 rounded text-xs bg-slate-900/80 text-white">
                    {analyzedItem.targetBin}
                  </span>
                </div>
                <div className="text-xl font-bold text-white">
                  {analyzedItem.targetBinName}
                </div>
              </div>

              {/* Anti-Wishcycling Alert Box */}
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  analyzedItem.isWishcycleTrap
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                    : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1 uppercase">
                  {analyzedItem.isWishcycleTrap ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Contamination Warning (Do Not Wishcycle)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Certified Recyclable Material</span>
                    </>
                  )}
                </div>
                <p className="text-slate-300">{analyzedItem.wishcyclingTrapRationale}</p>
              </div>

              {/* Chemical Ingredients */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  Ingredients & Chemical Fingerprint
                </div>
                <div className="text-white font-medium">
                  {analyzedItem.chemicalIngredients.primaryComponent}
                </div>
                {analyzedItem.chemicalIngredients.secondaryComponents.length > 0 && (
                  <div className="text-slate-400 text-[11px]">
                    Secondary: {analyzedItem.chemicalIngredients.secondaryComponents.join(', ')}
                  </div>
                )}
                <div className="text-emerald-400 font-mono text-[11px] pt-1">
                  Measured Purity: {analyzedItem.chemicalIngredients.purityPercentage}% · NIR Confidence: {analyzedItem.confidencePercent}%
                </div>
              </div>

              {/* Actionable Instructions: How to prepare */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div className="text-white font-semibold mb-2 flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                  What you must do before discarding:
                </div>
                <ul className="space-y-1.5 text-slate-300">
                  {analyzedItem.preparationProtocol.map((inst, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded bg-slate-800 text-emerald-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* How can we recycle the waste from the bin (Downstream instructions) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div className="text-cyan-300 font-semibold mb-1 flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  How this waste is recycled from the bin:
                </div>
                <p className="text-slate-300 text-xs mb-2">
                  <span className="font-semibold text-white">{analyzedItem.downstreamCircularPathway.method}</span>
                </p>
                <div className="space-y-1 pl-2 border-l border-slate-800 text-[11px] text-slate-400">
                  {analyzedItem.downstreamCircularPathway.transformationSteps.slice(0, 3).map((st, i) => (
                    <div key={i}>&bull; {st}</div>
                  ))}
                </div>
                <div className="mt-2 text-[10px] font-mono text-emerald-400">
                  End Result: {analyzedItem.downstreamCircularPathway.endProduct}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500">
                <Layers className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-slate-300">
                Awaiting Sensor Input
              </div>
              <p className="text-xs text-slate-500 max-w-sm">
                Capture an item using your camera or click any sample item on the left to review its ingredients, target bin, and recycling instructions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
