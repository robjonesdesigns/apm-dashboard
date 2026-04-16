// ============================================================
// data.mjs — static reference data for the Baytown tenant.
// ISO 14224 taxonomy, org/plant, 10 assets with sub-components,
// sensors with thresholds, failure stories.
//
// K-101 is fully instrumented (12 sensors, hockey-stick failure).
// Other 9 assets are baseline-healthy with 2-4 sensors each.
// ============================================================

// ---- ISO 14224 equipment classes ----
// Codes per DESK-RESEARCH-022.
export const EQUIPMENT_CLASSES = [
  { code: 'CP', class: 'rotating', name: 'Compressor' },
  { code: 'PU', class: 'rotating', name: 'Pump' },
  { code: 'HE', class: 'static',   name: 'Heat Exchanger' },
  { code: 'VE', class: 'static',   name: 'Pressure Vessel' },
  { code: 'TU', class: 'rotating', name: 'Turbine' },
  { code: 'MO', class: 'electrical', name: 'Electric Motor' },
  { code: 'FA', class: 'rotating', name: 'Fan' },
  { code: 'RE', class: 'static',   name: 'Reactor' },
  { code: 'BE', class: 'rotating', name: 'Bearing' },
  { code: 'SL', class: 'rotating', name: 'Mechanical Seal' },
];

// Failure modes, scoped to equipment class code where meaningful.
export const FAILURE_MODES = [
  { code: 'VIB', name: 'Vibration',         klass: 'CP' },
  { code: 'ELP', name: 'External leakage',  klass: 'CP' },
  { code: 'LOO', name: 'Low output',        klass: 'CP' },
  { code: 'BRD', name: 'Breakdown',         klass: 'CP' },
  { code: 'ELP', name: 'External leakage',  klass: 'PU' },
  { code: 'VIB', name: 'Vibration',         klass: 'PU' },
  { code: 'NOI', name: 'Abnormal noise',    klass: 'PU' },
  { code: 'PDE', name: 'Parameter deviation', klass: 'HE' },
  { code: 'INL', name: 'Internal leakage', klass: 'HE' },
  { code: 'OHE', name: 'Overheating',       klass: 'TU' },
  { code: 'PDE', name: 'Parameter deviation', klass: 'TU' },
  { code: 'PDE', name: 'Parameter deviation', klass: 'RE' },
  { code: 'BRD', name: 'Breakdown',         klass: 'BE' },
  { code: 'ELP', name: 'External leakage',  klass: 'SL' },
];

// Mechanisms are global (not scoped to equipment class in our simplified taxonomy).
export const FAILURE_MECHANISMS = [
  { code: 'WEA', name: 'Wear' },
  { code: 'COR', name: 'Corrosion' },
  { code: 'ERO', name: 'Erosion' },
  { code: 'CAV', name: 'Cavitation' },
  { code: 'FAT', name: 'Fatigue' },
  { code: 'OHE', name: 'Overheating' },
  { code: 'CON', name: 'Contamination' },
  { code: 'DFL', name: 'Deformation' },
];

// ---- Tenant ----
export const ORG_NAME   = 'Baytown Refining Co.';
export const PLANT_NAME = 'Baytown Refinery';
export const PLANT_TZ   = 'America/Chicago';

// ============================================================
// ASSET DEFINITIONS
// ============================================================
// Each asset: { tag, name, klass, criticality, parentTag?, sensors: [...], story?: {...} }
// Sensors: { tag, name, unit, measurementType, model, modelParams, thresholds }
// Thresholds: { lo_lo, lo, hi, hi_hi, expected_min, expected_max }
//
// `story` is the failure narrative. If present, the simulator generates a
// failure_record at the end of the window and emits insights + work orders.
// ============================================================

// ---- K-101: Naphtha Reformer Compressor (the hero failure story) ----
const K101 = {
  tag: 'K-101',
  name: 'Naphtha Reformer Compressor',
  klass: 'CP',
  criticality: 'A',
  installedYears: 11,
  replacementCost: 4800000,
  sensors: [], // filled below (top-level asset has no direct sensors)
  children: [
    {
      tag: 'K-101-DE',
      name: 'Drive End Bearing',
      klass: 'BE',
      criticality: 'A',
      sensors: [
        {
          tag: 'K-101-DE.VIB.RMS',
          name: 'DE bearing vibration RMS',
          unit: 'mm/s',
          measurementType: 'vibration',
          model: 'bearingFourStage',
          modelParams: {
            baseline: 1.05,
            stage2Start: 0.50, // day 14 of 28
            stage3Start: 0.78, // day 22
            stage4Start: 0.964, // day 27.0
            stage2End: 2.1,
            stage3End: 5.6,
            stage4End: 8.2,
          },
          noiseSigma: 0.12,
          thresholds: { lo: null, lo_lo: null, hi: 4.5, hi_hi: 7.1, expected_min: 0.5, expected_max: 3.0 },
        },
        {
          tag: 'K-101-DE.TEMP',
          name: 'DE bearing temperature',
          unit: 'degC',
          measurementType: 'temperature',
          model: 'bearingFourStage',
          modelParams: {
            baseline: 62,
            stage2Start: 0.50, stage3Start: 0.78, stage4Start: 0.964,
            stage2End: 74, stage3End: 92, stage4End: 112,
          },
          noiseSigma: 0.8,
          thresholds: { lo: null, lo_lo: null, hi: 85, hi_hi: 95, expected_min: 45, expected_max: 75 },
        },
      ],
    },
    {
      tag: 'K-101-NDE',
      name: 'Non-Drive End Bearing',
      klass: 'BE',
      criticality: 'B',
      sensors: [
        {
          tag: 'K-101-NDE.VIB.RMS',
          name: 'NDE bearing vibration RMS',
          unit: 'mm/s',
          measurementType: 'vibration',
          model: 'flat',
          modelParams: { baseline: 1.2 },
          noiseSigma: 0.15,
          thresholds: { lo: null, lo_lo: null, hi: 4.5, hi_hi: 7.1, expected_min: 0.5, expected_max: 3.0 },
        },
      ],
    },
    {
      tag: 'K-101-LOS',
      name: 'Lube Oil System',
      klass: 'CP',
      criticality: 'A',
      sensors: [
        {
          tag: 'K-101-LOS.PRESS',
          name: 'Lube oil header pressure',
          unit: 'bar',
          measurementType: 'pressure',
          model: 'bearingFourStage', // pressure drops at failure
          modelParams: {
            baseline: 2.8,
            stage2Start: 0.50, stage3Start: 0.78, stage4Start: 0.964,
            stage2End: 2.6, stage3End: 2.2, stage4End: 0.95,
          },
          noiseSigma: 0.05,
          thresholds: { lo: 1.8, lo_lo: 1.0, hi: null, hi_hi: null, expected_min: 2.4, expected_max: 3.2 },
        },
        {
          tag: 'K-101-LOS.FILTER.DP',
          name: 'Lube filter differential pressure',
          unit: 'bar',
          measurementType: 'pressure',
          model: 'linear',
          modelParams: { baseline: 0.28, final: 0.85, startFrac: 0.0, endFrac: 1.0 },
          noiseSigma: 0.02,
          thresholds: { lo: null, lo_lo: null, hi: 0.6, hi_hi: 0.8, expected_min: 0.2, expected_max: 0.5 },
        },
        {
          tag: 'K-101-LOS.OIL.TEMP',
          name: 'Lube oil temperature',
          unit: 'degC',
          measurementType: 'temperature',
          model: 'linear',
          modelParams: { baseline: 58, final: 66, startFrac: 0.50, endFrac: 1.0 },
          noiseSigma: 0.4,
          thresholds: { lo: null, lo_lo: null, hi: 70, hi_hi: 80, expected_min: 50, expected_max: 65 },
        },
      ],
    },
    {
      tag: 'K-101-SEAL',
      name: 'Mechanical Seal',
      klass: 'SL',
      criticality: 'A',
      sensors: [
        {
          tag: 'K-101-SEAL.GAS.DP',
          name: 'Seal gas differential pressure',
          unit: 'bar',
          measurementType: 'pressure',
          model: 'flat',
          modelParams: { baseline: 3.2 },
          noiseSigma: 0.08,
          thresholds: { lo: 2.0, lo_lo: 1.5, hi: null, hi_hi: null, expected_min: 2.8, expected_max: 3.6 },
        },
        {
          tag: 'K-101-SEAL.LEAK',
          name: 'Seal leakage rate',
          unit: 'Nm3/hr',
          measurementType: 'flow',
          model: 'flat',
          modelParams: { baseline: 0.8 },
          noiseSigma: 0.06,
          thresholds: { lo: null, lo_lo: null, hi: 1.8, hi_hi: 2.5, expected_min: 0.2, expected_max: 1.2 },
        },
      ],
    },
    {
      tag: 'K-101-ASV',
      name: 'Anti-Surge Valve',
      klass: 'CP',
      criticality: 'B',
      sensors: [
        {
          tag: 'K-101-ASV.POS',
          name: 'ASV position',
          unit: 'pct',
          measurementType: 'position',
          model: 'flat',
          modelParams: { baseline: 42 },
          noiseSigma: 1.2,
          thresholds: { lo: null, lo_lo: null, hi: 80, hi_hi: 95, expected_min: 30, expected_max: 60 },
        },
        {
          tag: 'K-101-ASV.SURGE.MARGIN',
          name: 'Surge margin',
          unit: 'pct',
          measurementType: 'process',
          model: 'flat',
          modelParams: { baseline: 7.2 },
          noiseSigma: 0.3,
          thresholds: { lo: 4.0, lo_lo: 2.5, hi: null, hi_hi: null, expected_min: 5.0, expected_max: 12.0 },
        },
      ],
    },
    {
      tag: 'K-101-CPL',
      name: 'Coupling',
      klass: 'BE',
      criticality: 'B',
      sensors: [
        {
          tag: 'K-101-CPL.ALIGN',
          name: 'Coupling alignment',
          unit: 'mm',
          measurementType: 'displacement',
          model: 'flat',
          modelParams: { baseline: 0.05 },
          noiseSigma: 0.003,
          thresholds: { lo: null, lo_lo: null, hi: 0.10, hi_hi: 0.15, expected_min: 0.0, expected_max: 0.08 },
        },
      ],
    },
    {
      tag: 'K-101-ROT',
      name: 'Rotor / Impeller',
      klass: 'CP',
      criticality: 'A',
      sensors: [
        {
          tag: 'K-101-ROT.AXIAL',
          name: 'Axial displacement',
          unit: 'mm',
          measurementType: 'displacement',
          model: 'flat',
          modelParams: { baseline: 0.12 },
          noiseSigma: 0.008,
          thresholds: { lo: null, lo_lo: null, hi: 0.18, hi_hi: 0.25, expected_min: 0.05, expected_max: 0.15 },
        },
      ],
    },
  ],
  story: {
    failureModeCode: 'BRD',
    failureMechanismCode: 'WEA',
    detectedAtFrac: 0.50,  // filter bypass signal
    failedAtFrac:   0.964, // trip event
    severity: 'critical',
    downtimeHours: 72,
    productionLossUsd: 1_200_000,
    rootCause: 'DE bearing spalling driven by lube oil contamination (filter bypass). Oil film collapse under load led to progressive bearing damage and trip on lo-lo oil pressure + hi-hi vibration.',
  },
};

// ---- 9 supporting assets, baseline-healthy with a few sensors each ----
const SUPPORTING_ASSETS = [
  {
    tag: 'P-203', name: 'Reformer Feed Pump', klass: 'PU', criticality: 'B',
    sensors: [
      { tag: 'P-203.DISCHARGE.PRESS', name: 'Discharge pressure', unit: 'bar', measurementType: 'pressure',
        model: 'flat', modelParams: { baseline: 24.8 }, noiseSigma: 0.25,
        thresholds: { lo: 22.0, lo_lo: 20.0, hi: 28.0, hi_hi: 30.0, expected_min: 23.0, expected_max: 26.5 } },
      { tag: 'P-203.VIB', name: 'Pump vibration', unit: 'mm/s', measurementType: 'vibration',
        model: 'linear', modelParams: { baseline: 2.1, final: 3.4, startFrac: 0, endFrac: 1 }, noiseSigma: 0.15,
        thresholds: { lo: null, lo_lo: null, hi: 4.5, hi_hi: 7.1, expected_min: 1.0, expected_max: 3.5 } },
    ],
  },
  {
    tag: 'K-302', name: 'Recycle Gas Compressor', klass: 'CP', criticality: 'A',
    sensors: [
      { tag: 'K-302.DISCH.TEMP', name: 'Discharge temperature', unit: 'degC', measurementType: 'temperature',
        model: 'flat', modelParams: { baseline: 146 }, noiseSigma: 2.8,
        thresholds: { lo: null, lo_lo: null, hi: 155, hi_hi: 165, expected_min: 138, expected_max: 152 } },
      { tag: 'K-302.VIB', name: 'Compressor vibration', unit: 'mm/s', measurementType: 'vibration',
        model: 'flat', modelParams: { baseline: 1.6 }, noiseSigma: 0.12,
        thresholds: { lo: null, lo_lo: null, hi: 4.5, hi_hi: 7.1, expected_min: 0.8, expected_max: 3.0 } },
    ],
  },
  {
    tag: 'C-201', name: 'Cooling Tower Fan 1', klass: 'FA', criticality: 'C',
    sensors: [
      { tag: 'C-201.VIB', name: 'Fan vibration', unit: 'mm/s', measurementType: 'vibration',
        model: 'flat', modelParams: { baseline: 3.2 }, noiseSigma: 0.28,
        thresholds: { lo: null, lo_lo: null, hi: 4.5, hi_hi: 6.0, expected_min: 1.5, expected_max: 4.0 } },
    ],
  },
  {
    tag: 'T-102', name: 'Gas Turbine Generator', klass: 'TU', criticality: 'A',
    sensors: [
      { tag: 'T-102.EXH.SPREAD', name: 'Exhaust spread', unit: 'degC', measurementType: 'temperature',
        model: 'linear', modelParams: { baseline: 12, final: 22, startFrac: 0, endFrac: 1 }, noiseSigma: 0.8,
        thresholds: { lo: null, lo_lo: null, hi: 25, hi_hi: 30, expected_min: 8, expected_max: 20 } },
      { tag: 'T-102.VIB', name: 'Turbine vibration', unit: 'mm/s', measurementType: 'vibration',
        model: 'flat', modelParams: { baseline: 2.1 }, noiseSigma: 0.1,
        thresholds: { lo: null, lo_lo: null, hi: 4.5, hi_hi: 6.5, expected_min: 1.0, expected_max: 3.0 } },
    ],
  },
  {
    tag: 'T-401', name: 'Process Gas Turbine', klass: 'TU', criticality: 'A',
    sensors: [
      { tag: 'T-401.EXH.SPREAD', name: 'Exhaust spread', unit: 'degC', measurementType: 'temperature',
        model: 'flat', modelParams: { baseline: 18 }, noiseSigma: 1.0,
        thresholds: { lo: null, lo_lo: null, hi: 25, hi_hi: 30, expected_min: 10, expected_max: 22 } },
    ],
  },
  {
    tag: 'E-105', name: 'Crude Preheat Exchanger', klass: 'HE', criticality: 'B',
    sensors: [
      { tag: 'E-105.FOUL', name: 'Fouling factor', unit: 'm2K/W', measurementType: 'process',
        model: 'asymptotic', modelParams: { baseline: 0.00018, asymptote: 0.00058, tau: 1200000 }, noiseSigma: 0.00002,
        thresholds: { lo: null, lo_lo: null, hi: 0.00050, hi_hi: 0.00060, expected_min: 0.00010, expected_max: 0.00040 } },
      { tag: 'E-105.OUT.TEMP', name: 'Outlet temperature', unit: 'degC', measurementType: 'temperature',
        model: 'linear', modelParams: { baseline: 148, final: 142, startFrac: 0, endFrac: 1 }, noiseSigma: 0.6,
        thresholds: { lo: 140, lo_lo: 135, hi: null, hi_hi: null, expected_min: 145, expected_max: 152 } },
    ],
  },
  {
    tag: 'V-501', name: 'HP Separator', klass: 'VE', criticality: 'B',
    sensors: [
      { tag: 'V-501.PRESS', name: 'Vessel pressure', unit: 'bar', measurementType: 'pressure',
        model: 'flat', modelParams: { baseline: 152 }, noiseSigma: 1.2,
        thresholds: { lo: null, lo_lo: null, hi: 170, hi_hi: 180, expected_min: 145, expected_max: 165 } },
    ],
  },
  {
    tag: 'R-301', name: 'Hydrotreater Reactor', klass: 'RE', criticality: 'A',
    sensors: [
      { tag: 'R-301.BED.TEMP', name: 'Average bed temperature', unit: 'degC', measurementType: 'temperature',
        model: 'linear', modelParams: { baseline: 382, final: 388, startFrac: 0, endFrac: 1 }, noiseSigma: 0.8,
        thresholds: { lo: null, lo_lo: null, hi: 405, hi_hi: 410, expected_min: 375, expected_max: 395 } },
      { tag: 'R-301.ACTIVITY', name: 'Catalyst activity', unit: 'pct', measurementType: 'process',
        model: 'linear', modelParams: { baseline: 92, final: 91, startFrac: 0, endFrac: 1 }, noiseSigma: 0.2,
        thresholds: { lo: 82, lo_lo: 80, hi: null, hi_hi: null, expected_min: 88, expected_max: 100 } },
    ],
  },
  {
    tag: 'P-102', name: 'Utility Water Pump', klass: 'PU', criticality: 'D',
    sensors: [
      { tag: 'P-102.DISCHARGE.PRESS', name: 'Discharge pressure', unit: 'bar', measurementType: 'pressure',
        model: 'flat', modelParams: { baseline: 4.8 }, noiseSigma: 0.1,
        thresholds: { lo: 4.2, lo_lo: 4.0, hi: null, hi_hi: null, expected_min: 4.5, expected_max: 5.2 } },
    ],
  },
];

export const ASSETS = [K101, ...SUPPORTING_ASSETS];

// ============================================================
// DESIGN THROUGHPUT and PRODUCTION WEIGHTS (ADR-032)
// ============================================================
// design_throughput_rate: ideal hourly output at 100% performance
// design_throughput_unit: physical unit (refinery conventions)
// production_weight: fraction of plant OEE this asset contributes
// All weights sum to ~1.00. K-101 carries the largest share (sole H2
// recycle compressor on the hydrocracker -- single point of failure).
export const ASSET_DESIGN = {
  'K-101': { rate: 850_000, unit: 'Nm3/h',  weight: 0.20 },
  'K-302': { rate: 480_000, unit: 'Nm3/h',  weight: 0.16 },
  'T-102': { rate:      18, unit: 'MW',     weight: 0.14 },
  'T-401': { rate:      22, unit: 'MW',     weight: 0.13 },
  'R-301': { rate:     450, unit: 't/h',    weight: 0.12 },
  'E-105': { rate:     380, unit: 't/h',    weight: 0.09 },
  'P-203': { rate:     220, unit: 'm3/h',   weight: 0.08 },
  'V-501': { rate:     350, unit: 't/h',    weight: 0.05 },
  'C-201': { rate:     180, unit: 'm3/s',   weight: 0.02 },
  'P-102': { rate:      60, unit: 'm3/h',   weight: 0.01 },
};
