import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  BookOpen, 
  ArrowRight,
  Factory,
  Flame,
  Leaf
} from 'lucide-react';
import { ANTI_WISHCYCLING_DIRECTIVES } from '../data/wasteDatabase';

interface WasteLookupItem {
  name: string;
  category: string;
  isRecyclable: boolean;
  targetBin: string;
  whyExplanation: string;
  prepAction: string;
  downstreamProcess: string;
}

const COMMON_WASTE_DIRECTORY: WasteLookupItem[] = [
  {
    name: 'Greasy Pizza Box (Oil Stained > 15%)',
    category: 'Paperboard',
    isRecyclable: false,
    targetBin: 'Trash / Compost (Lid to Paper)',
    whyExplanation: 'Oil and water do not mix. Oil creates grease spots during hydropulping that weaken paper hydrogen bonding and ruin entire batches.',
    prepAction: 'Tear off clean lid for recycling; place oily base into residual trash or commercial compost.',
    downstreamProcess: 'Waste-to-Energy incineration or aerobic municipal composting.'
  },
  {
    name: 'Clean Cardboard Shipping Box',
    category: 'Corrugated Fiber',
    isRecyclable: true,
    targetBin: 'Dry Paper & Cardboard Bin',
    whyExplanation: 'Long virgin kraft cellulose fibers can be recycled 5 to 7 times into new boxes.',
    prepAction: 'Flatten completely. Remove heavy packing tape strips and shipping labels if easily peelable.',
    downstreamProcess: 'Hydropulped at paper mill, screened, formed into continuous linerboard rolls.'
  },
  {
    name: 'Thermal Cash Register Receipt',
    category: 'Treated Paper',
    isRecyclable: false,
    targetBin: 'Residual Landfill',
    whyExplanation: 'Thermal receipts are coated with Bisphenol A (BPA) or BPS endocrine disruptors. If recycled, they contaminate toilet paper and paper towels.',
    prepAction: 'Do not recycle. Put directly into residual waste.',
    downstreamProcess: 'Sanitary containment to prevent chemical leach into paper supply.'
  },
  {
    name: 'Shredded Office Paper',
    category: 'Cellulose',
    isRecyclable: false,
    targetBin: 'Compost or Residual (Unless bagged per local rule)',
    whyExplanation: 'Shredding cuts long cellulose fibers into tiny specks that fall through sorting screens at MRFs like confetti, contaminating glass piles.',
    prepAction: 'Compost in backyard or household compost, or put in brown organics bin.',
    downstreamProcess: 'Biological decomposition into organic soil humus.'
  },
  {
    name: 'Clear PET Beverage Bottle (#1)',
    category: 'Rigid Plastics',
    isRecyclable: true,
    targetBin: 'Plastics Bin',
    whyExplanation: 'High value polymer. 100% recyclable into new food-grade bottles or polyester fiber.',
    prepAction: 'Empty liquid completely. Cap can stay on. Do not crush if optical scanner uses barcode.',
    downstreamProcess: 'Hot wash caustic flakes -> Solid State Polycondensation -> Bottle pellets.'
  },
  {
    name: 'Plastic Grocery Bags & Bubble Wrap',
    category: 'LDPE Film (#4)',
    isRecyclable: false,
    targetBin: 'Supermarket Film Drop-Off Only (NEVER curbside)',
    whyExplanation: 'Film plastic wraps around MRF spinning disk screens (star screens), seizing heavy bearings and halting the entire plant.',
    prepAction: 'Bundle clean bags together and return to grocery store entry collection bins.',
    downstreamProcess: 'Pelletized into composite plastic lumber (decking, park benches).'
  },
  {
    name: 'Styrofoam / Polystyrene Foam (#6)',
    category: 'Expanded Polystyrene',
    isRecyclable: false,
    targetBin: 'Residual Landfill (Unless specialized depot exists)',
    whyExplanation: '95% air by volume and breaks into static-charged beads that contaminate everything in the facility.',
    prepAction: 'Place into residual trash, or bring to dedicated EPS densification drop-off if available.',
    downstreamProcess: 'Thermal densification into picture frames, or landfill containment.'
  },
  {
    name: 'Aluminum Soda Can',
    category: 'Metals',
    isRecyclable: true,
    targetBin: 'Metals & Cans Bin',
    whyExplanation: 'Infinitely recyclable without degradation. Uses 95% less energy than mining raw bauxite ore.',
    prepAction: 'Empty all liquids. Do not put cigarette butts or napkins inside.',
    downstreamProcess: 'Induction melt at 700°C -> Rolling mill -> Back on shelves in 60 days.'
  },
  {
    name: 'Biodegradable PLA Plastic Cup (#7)',
    category: 'Biopolymer',
    isRecyclable: false,
    targetBin: 'Commercial Compost Only (NEVER Plastics Bin)',
    whyExplanation: 'PLA melts at 150°C while PET melts at 260°C. Contaminating PET with PLA ruins clarity and tensile strength of recycled bottles.',
    prepAction: 'Route to certified industrial commercial composting facility.',
    downstreamProcess: 'Industrial compost windrows reach 60°C, microbial breakdown in 90 days.'
  },
  {
    name: 'Lithium-Ion Vape / Battery',
    category: 'Hazardous Waste',
    isRecyclable: false,
    targetBin: 'Special Hazardous E-Waste Drop (NEVER Curbside)',
    whyExplanation: 'Severe fire hazard. Crushing batteries inside compactor trucks or MRF shredders causes massive explosive fires.',
    prepAction: 'Tape terminal contacts. Drop off at battery recycling kiosks at hardware stores.',
    downstreamProcess: 'Nitrogen inert atmosphere shredding -> Hydrometallurgical black mass refining.'
  }
];

export function CircularityHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'RECYCLABLE' | 'NON_RECYCLABLE'>('ALL');

  const filteredItems = COMMON_WASTE_DIRECTORY.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.whyExplanation.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === 'RECYCLABLE') return matchesSearch && item.isRecyclable;
    if (filterType === 'NON_RECYCLABLE') return matchesSearch && !item.isRecyclable;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Manifesto Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Municipal Waste Circularity & Anti-Wishcycling Codex
          </h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          As Environmental Sustainability Engineers, our mandate is grounded in thermodynamics and economics. 
          When citizens practice <em>wishcycling</em> (throwing non-recyclable or contaminated items into recycling bins with the wish that they might be recycled), they cause catastrophic consequences: mill shutdowns, batch rejections, equipment fires, and thousands of tons of clean material sent to landfills.
        </p>

        {/* 5 Core Engineering Rules Against Wishcycling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {ANTI_WISHCYCLING_DIRECTIVES.map((directive) => (
            <div
              key={directive.id}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold text-amber-300 mb-1">
                  {directive.rule}
                </div>
                <div className="text-[11px] text-slate-400 italic mb-2">
                  Myth: {directive.myth}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {directive.reality}
                </p>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-500/20 mt-2">
                Action: {directive.unambiguousAction}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Downstream Industrial Processing Infrastructure Guide */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          How Waste is Recycled from the Designated Bins
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
              <Factory className="w-4 h-4" />
              <span>Rigid Thermoplastics (PET & HDPE)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Optical sorting separates PET from HDPE. Items are flaked into 10mm chips, subjected to 85°C caustic wash to dissolve glues and float polyolefin labels, decontaminated under high vacuum at 210°C, and pelletized into food-contact resin.
            </p>
            <div className="text-[10px] font-mono text-cyan-300 pt-1">
              End Product: 100% rPET Beverage Bottles & Pipe
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <Leaf className="w-4 h-4" />
              <span>Clean Organics & Food Waste</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Food scraps and yard waste are pulped into organic slurry and pumped into continuous stirred-tank anaerobic digesters. Methanogens digest waste in 21 days, producing biomethane for the city grid and pasteurized organic fertilizer.
            </p>
            <div className="text-[10px] font-mono text-emerald-300 pt-1">
              End Product: Renewable Biomethane & Soil Compost
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
              <RefreshCw className="w-4 h-4" />
              <span>Infinitely Recyclable Metals (Aluminum)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              High-frequency eddy current rotors induce magnetic repulsion, launching aluminum cans into a dedicated hopper. Thermal kilns flash off decorative ink, then reverberatory furnaces melt aluminum at 720°C with 95% less energy than raw ore.
            </p>
            <div className="text-[10px] font-mono text-purple-300 pt-1">
              End Product: Brand-New Beverage Cans in 60 Days
            </div>
          </div>
        </div>
      </div>

      {/* Searchable Waste Directory Lookup */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Municipal Waste Sorter Directory
            </h3>
            <p className="text-xs text-slate-400">
              Instant truth lookup for everyday items.
            </p>
          </div>

          {/* Search bar and Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search item (e.g. coffee cup)..."
                className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-64"
              />
            </div>

            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-2 py-1 rounded transition-colors ${
                  filterType === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('RECYCLABLE')}
                className={`px-2 py-1 rounded transition-colors ${
                  filterType === 'RECYCLABLE' ? 'bg-emerald-950 text-emerald-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Recyclable
              </button>
              <button
                onClick={() => setFilterType('NON_RECYCLABLE')}
                className={`px-2 py-1 rounded transition-colors ${
                  filterType === 'NON_RECYCLABLE' ? 'bg-rose-950 text-rose-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Non-Recyclable
              </button>
            </div>
          </div>
        </div>

        {/* Directory Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-2 hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-sm text-white">{item.name}</div>
                  <div
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 flex items-center gap-1 ${
                      item.isRecyclable
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {item.isRecyclable ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        RECYCLABLE
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        DO NOT WISHCYCLE
                      </>
                    )}
                  </div>
                </div>

                <div className="text-xs text-emerald-400 font-mono mt-1">
                  Target: {item.targetBin}
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {item.whyExplanation}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 text-xs space-y-1">
                <div className="text-slate-400 text-[11px]">
                  <span className="text-slate-200 font-semibold">Preparation:</span> {item.prepAction}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono">
                  Downstream: {item.downstreamProcess}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
