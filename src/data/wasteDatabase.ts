import { WasteItem } from '../types';

// Helper to generate a realistic synthetic NIR spectral curve between 900nm and 1700nm
function generateNIRCurve(dominantPeaks: number[]): { wavelength: number; absorption: number }[] {
  const points: { wavelength: number; absorption: number }[] = [];
  for (let w = 900; w <= 1700; w += 20) {
    let baseline = 0.12 + Math.sin(w / 120) * 0.05;
    for (const peak of dominantPeaks) {
      const dist = Math.abs(w - peak);
      const intensity = Math.exp(-(dist * dist) / (2 * 28 * 28));
      baseline += intensity * 0.78;
    }
    points.push({ wavelength: w, absorption: Math.min(0.98, Math.max(0.04, baseline)) });
  }
  return points;
}

export const WASTE_ITEMS: WasteItem[] = [
  {
    id: 'ITEM-PET-101',
    name: 'Clear Mineral Water Bottle (Uncapped, Drained)',
    categoryName: 'Rigid Thermoplastic',
    materialType: 'PET',
    chemicalIngredients: {
      primaryComponent: 'Polyethylene Terephthalate (>96%)',
      secondaryComponents: ['Polypropylene label (2%)', 'Hot-melt EVA adhesive (<1%)'],
      purityPercentage: 97.4,
      contaminantRisk: 'Low (Adhesive detaches cleanly in 85°C caustic wash)'
    },
    visualCondition: {
      crushed: false,
      soiledGrease: false,
      partiallyOccluded: false,
      moistureSaturated: false
    },
    targetBin: 'BIN_A_PET',
    targetBinName: 'Bin A: Pure Rigid PET #1',
    targetBinColor: {
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      accent: '#10b981'
    },
    weightGrams: 24.2,
    spectralPeaksNm: [1130, 1660],
    spectralAbsorptionCurve: generateNIRCurve([1130, 1660]),
    confidencePercent: 99.4,
    processingLatencyMs: 31,
    actuatorType: 'PNEUMATIC_AIR_JET',
    actuatorValveIndex: 4,
    actuatorDurationMs: 12,
    isWishcycleTrap: false,
    wishcyclingTrapRationale: 'Uncontaminated clear PET. Highly sought-after industrial feedstock for bottle-to-bottle closed loops.',
    preparationProtocol: [
      'Ensure completely drained of all liquids',
      'Remove non-PET shrink wrap if opaque/printed',
      'Caps (PP/HDPE) may stay on if bottle is empty'
    ],
    downstreamCircularPathway: {
      method: 'Bottle-to-Bottle Mechanical Decontamination & Pelletization',
      transformationSteps: [
        'Bale opening and ballistic optical re-screening',
        'Rotary wet granulator flaking into 10mm chips',
        'Caustic hot wash at 85°C with caustic soda & surfactant to float label film',
        'Optical color flake sorting (removing colored or degraded chips)',
        'Solid-State Polycondensation (SSP) vacuum decontamination at 210°C to restore intrinsic viscosity',
        'Extrusion into certified FDA/EFSA food-grade rPET resin pellets'
      ],
      endProduct: '100% Recycled Food-Contact Beverage Bottles or Thermoformed Trays',
      circularityScore: 96,
      landfillDiversionTonsEstimate: '0.024 kg / item (~1.2 tons / 50k items)'
    }
  },
  {
    id: 'ITEM-GREASY-PIZZA-102',
    name: 'Takeaway Pizza Box (Oil Stained >15%)',
    categoryName: 'Soiled Composite Fiber',
    materialType: 'COMPOSITE_LAMINATE',
    chemicalIngredients: {
      primaryComponent: 'Unbleached Kraft Cellulose Fiber (76%)',
      secondaryComponents: ['Triglyceride lipids / animal fats (19%)', 'Starch adhesive (5%)'],
      purityPercentage: 42.0,
      contaminantRisk: 'Severe (Grease causes catastrophic hydrogen-bonding failure in hydropulper)'
    },
    visualCondition: {
      crushed: true,
      soiledGrease: true,
      partiallyOccluded: false,
      moistureSaturated: true
    },
    targetBin: 'BIN_F_RESIDUAL_LANDFILL',
    targetBinName: 'Bin F: Residual Non-Recyclable Waste',
    targetBinColor: {
      bg: 'bg-rose-950/40',
      border: 'border-rose-500/40',
      text: 'text-rose-400',
      accent: '#f43f5e'
    },
    weightGrams: 182.5,
    spectralPeaksNm: [1450, 1720],
    spectralAbsorptionCurve: generateNIRCurve([1450, 1720]),
    confidencePercent: 98.7,
    processingLatencyMs: 29,
    actuatorType: 'MOTORIZED_DIVERTER',
    actuatorValveIndex: 2,
    actuatorDurationMs: 280,
    isWishcycleTrap: true,
    wishcyclingTrapRationale: 'WISHCYCLING REJECTION: Paper mills use water in pulping vats. Oil and water do not mix; grease spreads into micro-droplets, creating holes and weak spots in new paper rolls, causing entire 50-ton batches to be discarded.',
    preparationProtocol: [
      'Tear off and inspect the box lid: if clean and dry, sort lid into Bin D (Paper)',
      'Deposit oil-soaked corrugated base into Residual Waste or Municipal Organic Digester',
      'Never mix with clean office paper or dry cardboard'
    ],
    downstreamCircularPathway: {
      method: 'Engineered Sanitary Landfill or High-Efficiency Waste-to-Energy',
      transformationSteps: [
        'Diverted away from paper recycling pulpers to prevent mill equipment fouling',
        'Processed in municipal thermal energy recovery facility',
        'Generates electricity and high-temperature steam for district heating',
        'Flue gas scrubbed through wet electrostatic precipitators and activated carbon'
      ],
      endProduct: 'Thermal Energy Generation & Ash Vitrification',
      circularityScore: 18,
      landfillDiversionTonsEstimate: 'Avoids contaminating 250 kg of clean cardboard bales'
    }
  },
  {
    id: 'ITEM-CHIP-BAG-103',
    name: 'Multi-Layer Metallized Snack Chip Pouch',
    categoryName: 'Multi-Material Laminate',
    materialType: 'COMPOSITE_LAMINATE',
    chemicalIngredients: {
      primaryComponent: 'Biaxially Oriented Polypropylene - BOPP (68%)',
      secondaryComponents: ['Vapor-deposited Aluminum barrier (4%)', 'Low-Density Polyethylene - LDPE (28%)'],
      purityPercentage: 35.0,
      contaminantRisk: 'High (Impossible to delaminate mechanically in standard MRF infrastructure)'
    },
    visualCondition: {
      crushed: true,
      soiledGrease: true,
      partiallyOccluded: false,
      moistureSaturated: false
    },
    targetBin: 'BIN_F_RESIDUAL_LANDFILL',
    targetBinName: 'Bin F: Residual Non-Recyclable Waste',
    targetBinColor: {
      bg: 'bg-amber-950/40',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      accent: '#f59e0b'
    },
    weightGrams: 9.8,
    spectralPeaksNm: [1195, 1735],
    spectralAbsorptionCurve: generateNIRCurve([1195, 1735]),
    confidencePercent: 99.1,
    processingLatencyMs: 24,
    actuatorType: 'PNEUMATIC_AIR_JET',
    actuatorValveIndex: 8,
    actuatorDurationMs: 10,
    isWishcycleTrap: true,
    wishcyclingTrapRationale: 'WISHCYCLING REJECTION: Even though it has a shiny metallic foil appearance and flexible plastic texture, the microscopic aluminum is thermally bonded to polypropylene. It cannot be melted with aluminum or recycled with rigid plastics.',
    preparationProtocol: [
      'Empty any residual chip crumbs and salt into food organics',
      'Do not throw into blue recycling bins',
      'Place directly into residual non-recyclables'
    ],
    downstreamCircularPathway: {
      method: 'Refuse-Derived Fuel (RDF) or Pyrolysis Research',
      transformationSteps: [
        'Secondary mechanical shredding into 25mm shreds',
        'Compaction into high-calorific engineered fuel pellets',
        'Co-combusted in cement kilns substituting fossil coal',
        'Minerals bound into clinker matrix with zero landfill leachate'
      ],
      endProduct: 'Industrial Cement Kiln Process Energy',
      circularityScore: 24,
      landfillDiversionTonsEstimate: 'Direct replacement of high-emission fossil coal'
    }
  },
  {
    id: 'ITEM-HDPE-JUG-104',
    name: 'Milk Jug (High-Density Polyethylene, Crushed)',
    categoryName: 'Rigid Polyolefin',
    materialType: 'HDPE',
    chemicalIngredients: {
      primaryComponent: 'High-Density Polyethylene - HDPE resin (>95%)',
      secondaryComponents: ['Pigment masterbatch (<2%)', 'Polypropylene pour spout (3%)'],
      purityPercentage: 96.2,
      contaminantRisk: 'Low (Clean melting index, density floats in water float-sink tanks)'
    },
    visualCondition: {
      crushed: true,
      soiledGrease: false,
      partiallyOccluded: false,
      moistureSaturated: false
    },
    targetBin: 'BIN_B_HDPE',
    targetBinName: 'Bin B: Rigid HDPE #2 (Natural/Color)',
    targetBinColor: {
      bg: 'bg-cyan-950/40',
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
      accent: '#06b6d4'
    },
    weightGrams: 58.0,
    spectralPeaksNm: [1215, 1395, 1730],
    spectralAbsorptionCurve: generateNIRCurve([1215, 1395, 1730]),
    confidencePercent: 98.9,
    processingLatencyMs: 33,
    actuatorType: 'PNEUMATIC_AIR_JET',
    actuatorValveIndex: 6,
    actuatorDurationMs: 16,
    isWishcycleTrap: false,
    wishcyclingTrapRationale: 'APPROVED HDPE: Extremely robust polymer backbone. Even when physically deformed or crushed, NIR spectroscopy recognizes the 1215nm C-H stretching overtone.',
    preparationProtocol: [
      'Perform a 2-second water swish to rinse out sour dairy residue',
      'Keep cap attached or separate based on local municipality guidance',
      'Crushing is acceptable and saves bin space'
    ],
    downstreamCircularPathway: {
      method: 'Extrusion Compounding & Continuous Pipe Forming',
      transformationSteps: [
        'Shredded into coarse 15mm flakes',
        'Density separation in water tank (HDPE density 0.95 g/cm³ floats, dirt/metal sinks)',
        'Melt filtration through 150-mesh continuous screen changers to remove micro-particulates',
        'Twin-screw extrusion compounding with anti-oxidants',
        'Cast into durable smooth-interior drainage and irrigation conduits'
      ],
      endProduct: 'Heavy-Duty Underground Agricultural & Stormwater Piping (50+ year lifespan)',
      circularityScore: 94,
      landfillDiversionTonsEstimate: '0.058 kg / unit (~2.9 tons / 50k units)'
    }
  },
  {
    id: 'ITEM-FOOD-SCRAPS-105',
    name: 'Avocado Rind & Kitchen Vegetable Trimmings',
    categoryName: 'Biodegradable Organic Residue',
    materialType: 'ORGANIC_FOOD',
    chemicalIngredients: {
      primaryComponent: 'Moist Cellulose & Lignin Structure (62%)',
      secondaryComponents: ['Water moisture (34%)', 'Natural lipids and mineral salts (4%)'],
      purityPercentage: 99.1,
      contaminantRisk: 'Zero (Natural biological material)'
    },
    visualCondition: {
      crushed: false,
      soiledGrease: true,
      partiallyOccluded: false,
      moistureSaturated: true
    },
    targetBin: 'BIN_C_ORGANICS',
    targetBinName: 'Bin C: Pure Organics & Digestion',
    targetBinColor: {
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-600/40',
      text: 'text-emerald-300',
      accent: '#059669'
    },
    weightGrams: 114.5,
    spectralPeaksNm: [1450, 1940],
    spectralAbsorptionCurve: generateNIRCurve([1450, 1680]),
    confidencePercent: 99.6,
    processingLatencyMs: 27,
    actuatorType: 'DELTA_ROBOT_PICKER',
    actuatorValveIndex: null,
    actuatorDurationMs: 220,
    isWishcycleTrap: false,
    wishcyclingTrapRationale: 'BIODEGRADABLE ORGANIC: High moisture and organic carbon. High biogas yield when routed to commercial anaerobic digestion.',
    preparationProtocol: [
      'Peel off any plastic PLU barcode stickers (PLU stickers do not decompose)',
      'Remove rubber bands, twist-ties, and produce mesh bags',
      'Place in ventilated compost bin or lined organics caddy'
    ],
    downstreamCircularPathway: {
      method: 'Thermophilic Anaerobic Digestion with Combined Heat & Power (CHP)',
      transformationSteps: [
        'Hydro-mechanical pulping into organic soup (removing rogue grit)',
        'Inoculation in continuous stirred-tank anaerobic digester at 55°C for 21 days',
        'Methanogenic archaea metabolize volatile fatty acids into biomethane (CH4 65%, CO2 35%)',
        'Biomethane scrubbed into renewable natural gas (RNG) injected into city grid',
        'Digestate centrifuge separated; solids pasteurized into Grade-A soil enrichment compost'
      ],
      endProduct: 'Grid-Injected Biomethane Energy + Organic Farm Fertilizer',
      circularityScore: 98,
      landfillDiversionTonsEstimate: 'Diverts methane emission equivalent to 0.18 kg CO2e per item'
    }
  },
  {
    id: 'ITEM-COFFEE-CUP-106',
    name: 'Disposable Takeaway Coffee Cup (Plastic-Lined)',
    categoryName: 'Plastic-Coated Paperboard',
    materialType: 'COMPOSITE_LAMINATE',
    chemicalIngredients: {
      primaryComponent: 'Bleached Chemical Paper Pulp (91%)',
      secondaryComponents: ['Polyethylene waterproof film barrier (8%)', 'Printing inks (1%)'],
      purityPercentage: 45.0,
      contaminantRisk: 'Severe (Thin inner PE barrier melts during repulping and gums up paper screens)'
    },
    visualCondition: {
      crushed: true,
      soiledGrease: false,
      partiallyOccluded: false,
      moistureSaturated: true
    },
    targetBin: 'BIN_F_RESIDUAL_LANDFILL',
    targetBinName: 'Bin F: Residual Non-Recyclable Waste',
    targetBinColor: {
      bg: 'bg-rose-950/40',
      border: 'border-rose-500/40',
      text: 'text-rose-400',
      accent: '#e11d48'
    },
    weightGrams: 16.4,
    spectralPeaksNm: [1420, 1690],
    spectralAbsorptionCurve: generateNIRCurve([1420, 1690]),
    confidencePercent: 97.8,
    processingLatencyMs: 34,
    actuatorType: 'PNEUMATIC_AIR_JET',
    actuatorValveIndex: 3,
    actuatorDurationMs: 14,
    isWishcycleTrap: true,
    wishcyclingTrapRationale: 'WISHCYCLING ENEMY #1: Most citizens assume coffee cups are paper and throw them into paper recycling. In reality, the inside has a heat-bonded polyethylene liner that prevents leakage. Standard municipal paper mills cannot separate this film and will reject entire shipments.',
    preparationProtocol: [
      'Separate the plastic lid (check lid: if embossed #5 PP or #6 PS, sort to plastics if accepted)',
      'Empty any residual coffee or milk down the sink',
      'Throw the cup body into Residual Landfill unless a certified specialized cup collection station exists'
    ],
    downstreamCircularPathway: {
      method: 'Sanitary Municipal Waste Management or Specialized Delamination',
      transformationSteps: [
        'Sorted into residual stream away from pure cellulose pulp',
        'Routed to municipal high-efficiency energy recovery facility',
        'Alternatively sent to rare specialized hydrapulping mills with 120-minute cycle times if localized'
      ],
      endProduct: 'Energy Recovery / Steam Generation',
      circularityScore: 22,
      landfillDiversionTonsEstimate: 'Protects 100+ kg batches of dry paper recycling from plastic contamination'
    }
  },
  {
    id: 'ITEM-ALU-CAN-107',
    name: 'Aluminum Soda Beverage Can',
    categoryName: 'Non-Ferrous Metal',
    materialType: 'ALUMINUM',
    chemicalIngredients: {
      primaryComponent: 'Aluminum Alloy 3104/5182 (>97.5%)',
      secondaryComponents: ['Epoxy/acrylic internal lacquer liner (1.2%)', 'Lithographic decorative exterior ink (1.3%)'],
      purityPercentage: 97.5,
      contaminantRisk: 'Very Low (Lacquer flashes off instantaneously in rotary de-lacquering furnace)'
    },
    visualCondition: {
      crushed: false,
      soiledGrease: false,
      partiallyOccluded: false,
      moistureSaturated: false
    },
    targetBin: 'BIN_E_METALS_GLASS',
    targetBinName: 'Bin E: Infinitely Recyclable Metals',
    targetBinColor: {
      bg: 'bg-indigo-950/40',
      border: 'border-indigo-500/40',
      text: 'text-indigo-400',
      accent: '#6366f1'
    },
    weightGrams: 14.8,
    spectralPeaksNm: [980, 1100],
    spectralAbsorptionCurve: generateNIRCurve([980, 1100]),
    confidencePercent: 99.8,
    processingLatencyMs: 19,
    actuatorType: 'PNEUMATIC_AIR_JET',
    actuatorValveIndex: 12,
    actuatorDurationMs: 10,
    isWishcycleTrap: false,
    wishcyclingTrapRationale: 'THE CIRCULAR GOLD STANDARD: Aluminum is 100% infinitely recyclable without quality loss. Recycling an aluminum can saves 95% of the energy needed to make new aluminum from raw bauxite ore.',
    preparationProtocol: [
      'Ensure completely drained of all soda/liquid',
      'Do not stuff foreign objects (cigarette butts, wrappers, plastics) inside the can opening',
      'Crushing is acceptable if municipal MRF eddy current separators are tuned for flats'
    ],
    downstreamCircularPathway: {
      method: 'Eddy-Current Ejection & High-Temperature Induction Melting',
      transformationSteps: [
        'Eddy Current Separator induces magnetic repulsion, launching aluminum into dedicated bin',
        'De-lacquering thermal kiln at 500°C vaporizes decorative paint and epoxy barrier',
        'Submerged induction reverberatory furnace melts aluminum at 720°C',
        'Direct-chill casting into 25-ton monolithic ingots (10 meters long)',
        'Cold-rolled into 0.28mm thin sheet coil; shipped to can manufacturing plant in 60-day closed loop'
      ],
      endProduct: 'New Aluminum Beverage Cans on Supermarket Shelf within 60 Days',
      circularityScore: 99,
      landfillDiversionTonsEstimate: 'Saves 95% electrical energy compared to primary smelting'
    }
  },
  {
    id: 'ITEM-LITHIUM-BATT-108',
    name: 'Vape Device / Lithium-Ion Battery (CRITICAL FIRE HAZARD)',
    categoryName: 'Hazardous Electrochemical Waste',
    materialType: 'HAZARDOUS_EWASTE',
    chemicalIngredients: {
      primaryComponent: 'Lithium Cobalt Oxide / Nickel Manganese Cobalt (NMC)',
      secondaryComponents: ['Volatile organic electrolyte solvent (EC/DMC)', 'Copper and Aluminum current collectors'],
      purityPercentage: 0,
      contaminantRisk: 'CATASTROPHIC FIRE HAZARD (Thermal runaway upon compaction)'
    },
    visualCondition: {
      crushed: false,
      soiledGrease: false,
      partiallyOccluded: false,
      moistureSaturated: false
    },
    targetBin: 'BIN_G_HAZARDOUS_DROP',
    targetBinName: 'Bin G: Special Hazardous E-Waste Drop-Off',
    targetBinColor: {
      bg: 'bg-red-950/60',
      border: 'border-red-500/80',
      text: 'text-red-400',
      accent: '#ef4444'
    },
    weightGrams: 42.0,
    spectralPeaksNm: [1050, 1320],
    spectralAbsorptionCurve: generateNIRCurve([1050, 1320]),
    confidencePercent: 99.9,
    processingLatencyMs: 16,
    actuatorType: 'MOTORIZED_DIVERTER',
    actuatorValveIndex: 1,
    actuatorDurationMs: 400,
    isWishcycleTrap: true,
    wishcyclingTrapRationale: 'EMERGENCY SAFETY HAZARD: Lithium-ion batteries placed into household recycling trucks or MRF shredders ignite upon mechanical puncture. Over 5,000 catastrophic MRF fires occur annually worldwide due to wishcycled vapes and battery packs.',
    preparationProtocol: [
      'IMMEDIATELY REMOVE FROM REGULAR WASTE AND RECYCLING',
      'Tape terminal contacts with electrical or insulating tape if loose',
      'Deliver to a designated e-waste drop-off box at electronic stores or municipal depot'
    ],
    downstreamCircularPathway: {
      method: 'Inert Atmosphere Shredding & Black Mass Hydrometallurgy',
      transformationSteps: [
        'Quenched in brine or nitrogen inert-atmosphere shredder to prevent explosion',
        'Electrolyte evaporated and safely collected in condenser',
        'Physical screening of copper, aluminum, and plastic casing',
        'Black mass chemical leaching with sulfuric acid and hydrogen peroxide',
        'Solvent extraction of battery-grade Lithium Carbonate, Cobalt Sulfate, and Nickel Sulfate'
      ],
      endProduct: 'Battery-Grade Cathode Precursors for New Electric Vehicle Batteries',
      circularityScore: 92,
      landfillDiversionTonsEstimate: 'Prevents facility fires and reclaims critical strategic rare minerals'
    }
  }
];

export const ANTI_WISHCYCLING_DIRECTIVES = [
  {
    id: 'AW-01',
    rule: 'Rule 1: Grease Destroys Paper Fibers',
    myth: '"If it\'s made of cardboard or paper, it belongs in the blue recycling bin."',
    reality: 'Water-based paper hydropulpers cannot separate lipids. Oil saturates cellulose fibers, causing sheet breaks on 200 mph paper machines and causing entire 40-ton batches of recycled paper to be rejected at the mill.',
    unambiguousAction: 'Tear off clean lids for recycling. Put greasy, oil-soaked bases into residual trash or certified composting.'
  },
  {
    id: 'AW-02',
    rule: 'Rule 2: Shiny Metallic Pouches Are NOT Aluminum or Plastic',
    myth: '"Chip bags and juice pouches are foil, so they can be recycled with metal."',
    reality: 'They are multi-layer laminates composed of BOPP plastic, polyethylene, and microscopic vapor-deposited aluminum. They cannot be melted into metal or plastic and will contaminate both streams.',
    unambiguousAction: 'Throw all chip bags, candy wrappers, and shiny metallized snack pouches straight into Residual Landfill.'
  },
  {
    id: 'AW-03',
    rule: 'Rule 3: Plastic Bags and Film Jam MRF Sorting Gears',
    myth: '"I can bag my recyclables in a plastic trash bag before putting it in the bin."',
    reality: 'Plastic grocery bags, bubble wrap, and cling film wrap around high-speed MRF rotating disk screens (starscreens) in minutes, forcing the entire facility to shut down twice a day for workers to cut them out with utility knives.',
    unambiguousAction: 'Recycle loose items only! Empty items directly into the bin. Recycle clean plastic bags only at designated grocery drop-off bins.'
  },
  {
    id: 'AW-04',
    rule: 'Rule 4: "Biodegradable" and "PLA" Plastics Ruin PET Batches',
    myth: '"Bio-plastic is eco-friendly so I should put it in the plastics bin."',
    reality: 'Polylactic Acid (PLA #7) melts at a much lower temperature (150°C) than PET (260°C). If even 0.1% PLA contaminates a clear PET bale, the resulting recycled resin turns yellow, brittle, and hazy.',
    unambiguousAction: 'Never mix PLA or compostable cutlery/cups with standard PET or HDPE plastics. Route to commercial composting if accepted, otherwise residual waste.'
  },
  {
    id: 'AW-05',
    rule: 'Rule 5: Disposable Coffee Cups Are Not Plain Paper',
    myth: '"Paper coffee cups are just paper, so they can go into the paper bin."',
    reality: 'To hold hot liquid without disintegrating, paper coffee cups have a polyethylene plastic lining bonded to the interior. Paper mills cannot dissolve this without special high-energy hydropulpers.',
    unambiguousAction: 'Lids go to plastics (if #5 PP); paper cups go to residual landfill unless your office has a dedicated cup collection tube.'
  }
];
