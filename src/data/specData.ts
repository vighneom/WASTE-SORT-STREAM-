export const SPEC_PLATFORM_OVERVIEW = {
  system_name: "SortIQ PureStream OS & Web Portal",
  version: "4.2.0-LTS",
  core_philosophy: "Zero-Tolerance Wishcycling: Direct, verified source segregation powered by real-time spectroscopic verification to preserve municipal recycling stream economics.",
  target_environments: [
    "Municipal Material Recovery Facilities (MRFs)",
    "Commercial High-Volume Venues (Restaurants, Food Distribution, Hotels)",
    "Industrial Manufacturing & Packaging Lines",
    "Smart Municipal Source-Separation Kiosks & Domestic Aggregation Hubs"
  ]
};

export const SPEC_TECHNICAL_SPECIFICATIONS = {
  sensor_ingestion_layer: {
    optical_rgb: "High-speed industrial area scan camera (240 FPS, global shutter, hardware strobe synchronized)",
    nir_spectroscopy: "Near-Infrared Hyperspectral Sensor (900nm - 1700nm wavelength array for definitive hydrocarbon fingerprinting)",
    gravimetric: "Strain-gauge digital load cell with microsecond settling time (<15ms)",
    edge_compute_target: "NVIDIA Jetson AGX Orin / TensorRT runtime for quantized INT8 inference",
    operational_latency_budget_ms: {
      sensor_acquisition_and_stitching: 8,
      deep_learning_spectral_inference: 22,
      actuator_trigger_calculation: 4,
      network_and_plc_handshake: 6,
      total_budget_ms: 40,
      latency_threshold_max_ms: 50
    },
    accuracy_target_percentage: 98.4,
    minimum_accuracy_floor_percentage: 95.0
  },
  actuator_interface: {
    actuation_mechanisms: [
      "High-frequency pneumatic solenoid valve air-jet manifold (8 bar dry air, 10ms blast duration)",
      "Delta parallel-robot pick-and-place end effectors for high-mass objects (>500g)",
      "High-speed servo-driven diverter gates for bulk package routing"
    ],
    timing_compensation_algorithm: "Distance-over-velocity dynamic belt encoder tracking with sub-millimeter precision"
  }
};

export const SPEC_ANTI_WISHCYCLING_RULES = [
  {
    item_condition: "Food-soiled paperboard (grease saturation >15%)",
    action: "ROUTE_TO_COMPOST_OR_RESIDUAL",
    rationale: "Grease destroys fiber hydrogen bonding during pulping; causes batch rejection in paper mills."
  },
  {
    item_condition: "Multilayer metallized plastic films (e.g., chip bags, pouches)",
    action: "ROUTE_TO_RESIDUAL",
    rationale: "Non-separable LDPE/Aluminum laminates cannot be mechanically separated; do not route to rigid plastics."
  },
  {
    item_condition: "Black/Pigmented Plastics lacking reflectance at 1200nm",
    action: "ROUTE_TO_SPECIALIZED_PYROLYSIS_OR_RESIDUAL",
    rationale: "Standard carbon black absorbs NIR signal entirely; must not contaminate pure PET/HDPE bales."
  },
  {
    item_condition: "PET beverage bottle with PVC shrink sleeve",
    action: "TRIGGER_LABEL_STRIPPER_OR_SORT_SECONDARY",
    rationale: "PVC melts at higher temperatures and produces hydrochloric acid, ruining PET recycled resin."
  }
];

export const SPEC_STREAM_CLASSIFICATIONS = [
  {
    stream_id: "BIN_A_PET_CLEAR",
    display_name: "Clear PET (Polyethylene Terephthalate)",
    sensor_signatures: {
      nir_absorption_peaks_nm: [1130, 1660],
      density_g_cm3: "1.38 - 1.40",
      rgb_visual_features: ["transparent", "semi-rigid", "neck-ring"]
    },
    downstream_path: "Bottle-to-bottle pelletization, food-grade rPET",
    preparation_instruction: "Ensure bottle is drained; cap can remain attached if standard HDPE/PP closure."
  },
  {
    stream_id: "BIN_B_HDPE_RIGID",
    display_name: "Rigid HDPE (High-Density Polyethylene)",
    sensor_signatures: {
      nir_absorption_peaks_nm: [1215, 1395, 1730],
      density_g_cm3: "0.94 - 0.96",
      rgb_visual_features: ["opaque", "pinch-off base scar", "structural ribbing"]
    },
    downstream_path: "Extrusion into drainage piping, secondary chemical containers",
    preparation_instruction: "Rinse chemical or dairy residue thoroughly before deposit."
  },
  {
    stream_id: "BIN_C_ORGANICS_FOOD_SCRAPS",
    display_name: "Pure Organics & Food Waste",
    sensor_signatures: {
      nir_absorption_peaks_nm: [1450, 1940],
      moisture_content_estimated_percent: ">55%",
      rgb_visual_features: ["organic texture", "irregular geometry", "moist surface"]
    },
    downstream_path: "Industrial anaerobic digestion with methane capture and digestate soil enrichment",
    preparation_instruction: "Strip all plastic film, stickers, and metal ties before discarding."
  },
  {
    stream_id: "BIN_D_FIBER_CLEAN",
    display_name: "Dry Clean Paper & Corrugated Cardboard",
    sensor_signatures: {
      nir_absorption_peaks_nm: [1490, 1590],
      moisture_content_estimated_percent: "<12%",
      rgb_visual_features: ["matte texture", "planar", "cellulose fiber grain"]
    },
    downstream_path: "Repulping for corrugated medium and kraft paper",
    preparation_instruction: "Flatten boxes completely. No tape larger than 50mm. Absolutely no food contamination."
  },
  {
    stream_id: "BIN_E_RESIDUAL_LANDFILL",
    display_name: "Non-Recyclable Residual Waste",
    sensor_signatures: {
      nir_absorption_peaks_nm: ["inconclusive", "mixed_composite"],
      density_g_cm3: "variable",
      rgb_visual_features: ["soiled", "composite packaging", "non-recoverable"]
    },
    downstream_path: "Engineered sanitary landfill with leachate management / Waste-to-Energy",
    preparation_instruction: "Final destination for mixed, soiled, and unidentifiable waste. Do not contaminate recyclables."
  }
];

export const SPEC_TERMINOLOGY_STANDARD = {
  forbidden_ambiguous_terms: [
    { term: "Single-Stream Recyclables", issue: "Falsely implies everything thrown together will be sorted magically." },
    { term: "Biodegradable", issue: "Misleads consumers into putting PLA bioplastics into rigid PET streams." },
    { term: "Eco-Friendly Packaging", issue: "Vague marketing label with zero technical polymer identification." },
    { term: "Check Locally", issue: "Causes decision fatigue leading directly to wishcycling." }
  ],
  mandatory_deterministic_terms: [
    { term: "Deposit Only: Clear Uncrushed Bottles", target: "BIN_A_PET_CLEAR" },
    { term: "Non-Recyclable: Wet or Greasy Paperboard", target: "BIN_E_RESIDUAL_LANDFILL" },
    { term: "Landfill Only: Metallized Chip Pouches", target: "BIN_E_RESIDUAL_LANDFILL" },
    { term: "Certified Food Scraps Only: No Utensils", target: "BIN_C_ORGANICS_FOOD_SCRAPS" }
  ]
};
