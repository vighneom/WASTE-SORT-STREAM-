export type EnvironmentMode = 'INDUSTRIAL_MRF' | 'COMMERCIAL_RESTAURANT' | 'DOMESTIC_SMART_BIN';

export type PolymerCode = 
  | 'PET' 
  | 'HDPE' 
  | 'PP' 
  | 'LDPE' 
  | 'ALUMINUM' 
  | 'GLASS' 
  | 'CLEAN_CELLULOSE' 
  | 'ORGANIC_FOOD' 
  | 'COMPOSITE_LAMINATE' 
  | 'HAZARDOUS_EWASTE';

export type TargetBinId = 
  | 'BIN_A_PET' 
  | 'BIN_B_HDPE' 
  | 'BIN_C_ORGANICS' 
  | 'BIN_D_FIBER' 
  | 'BIN_E_METALS_GLASS' 
  | 'BIN_F_RESIDUAL_LANDFILL' 
  | 'BIN_G_HAZARDOUS_DROP';

export interface VisualDegradation {
  crushed: boolean;
  soiledGrease: boolean;
  partiallyOccluded: boolean;
  moistureSaturated: boolean;
}

export interface WasteItem {
  id: string;
  name: string;
  categoryName: string;
  materialType: PolymerCode;
  chemicalIngredients: {
    primaryComponent: string;
    secondaryComponents: string[];
    purityPercentage: number;
    contaminantRisk: string;
  };
  visualCondition: VisualDegradation;
  targetBin: TargetBinId;
  targetBinName: string;
  targetBinColor: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
  weightGrams: number;
  spectralPeaksNm: number[];
  spectralAbsorptionCurve: { wavelength: number; absorption: number }[];
  confidencePercent: number;
  processingLatencyMs: number;
  actuatorType: 'PNEUMATIC_AIR_JET' | 'DELTA_ROBOT_PICKER' | 'MOTORIZED_DIVERTER' | 'AUDIO_VISUAL_KIOSK';
  actuatorValveIndex: number | null;
  actuatorDurationMs: number;
  isWishcycleTrap: boolean;
  wishcyclingTrapRationale: string;
  preparationProtocol: string[];
  downstreamCircularPathway: {
    method: string;
    transformationSteps: string[];
    endProduct: string;
    circularityScore: number; // 0 - 100
    landfillDiversionTonsEstimate: string;
  };
}

export interface SystemMetrics {
  totalItemsSorted: number;
  streamPurityRate: number; // e.g. 98.7
  wishcyclingInterceptedCount: number;
  averageLatencyMs: number;
  pneumaticPressureBar: number;
  encoderBeltSpeedMps: number;
  opticalFps: number;
}
