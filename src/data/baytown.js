// ── APM Dashboard sample data ─────────────────────────────────────────────────
// Source of truth: vector/research/STORY-001-baytown-refinery.md
// Engineering thresholds: vector/research/DESK-RESEARCH-002-engineering-data.md
//
// ARCHITECTURE RULE: No colors in this file.
// Colors belong in src/styles/tokens.js and src/styles/global.css only.
// All values here are numbers, strings, and structure only.

// ── Plant ─────────────────────────────────────────────────────────────────────

export const PLANT = {
  name: 'Baytown Refinery',
  location: 'Baytown, TX',
  // Current KPIs -- post K-101 trip (7:00 AM Tuesday)
  // oee is the authoritative measured plant-level value (from OEE_TREND / KPI_24H).
  // The 10 demo assets in ASSETS account for ~80% of plant capacity; the remaining
  // 128 assets run near 95%+ OEE. derivePlantOEE(ASSETS) returns ~83.5 from just
  // these 10 assets -- correct formula, partial scope. 76.3 is the full-plant measurement.
  oee: 76.3,
  availability: 78.4,
  performance: 93.8,
  quality: 99.1,
  // KPIs before K-101 tripped at 2:03 AM
  previousOee: 87.4,
  previousAvailability: 94.2,
  previousPerformance: 94.8,
  previousQuality: 99.2,
  trains: 4,
  activeAssets: 138,
  totalAssets: 168,
  lastRefreshed: '7:00 AM EST',
}

// ── OEE Trend (last 12 months) ────────────────────────────────────────────────
// Mar shows the drop caused by the K-101 trip this morning.

export const OEE_TREND = [
  { month: 'Apr', oee: 82.1, availability: 88.5, performance: 92.3, quality: 98.8 },
  { month: 'May', oee: 84.3, availability: 89.2, performance: 93.1, quality: 99.0 },
  { month: 'Jun', oee: 81.7, availability: 87.8, performance: 91.9, quality: 98.7 },
  { month: 'Jul', oee: 85.9, availability: 90.4, performance: 94.0, quality: 99.1 },
  { month: 'Aug', oee: 83.2, availability: 88.9, performance: 92.7, quality: 98.9 },
  { month: 'Sep', oee: 86.5, availability: 91.3, performance: 94.5, quality: 99.3 },
  { month: 'Oct', oee: 84.8, availability: 90.1, performance: 93.6, quality: 99.0 },
  { month: 'Nov', oee: 87.1, availability: 91.8, performance: 94.2, quality: 99.2 },
  { month: 'Dec', oee: 85.4, availability: 90.6, performance: 93.8, quality: 99.1 },
  { month: 'Jan', oee: 86.9, availability: 91.5, performance: 94.6, quality: 99.3 },
  { month: 'Feb', oee: 86.2, availability: 91.0, performance: 94.1, quality: 99.1 },
  // March: K-101 trip at 2:03 AM + 5 hours of downtime drops availability to critical
  { month: 'Mar', oee: 76.3, availability: 78.4, performance: 93.8, quality: 99.1 },
]

// ── KPI 24-Hour Trend ────────────────────────────────────────────────────────
// Hourly snapshots from 7 PM yesterday to 7 AM today.
// Shows the step change at 2:03 AM when K-101 tripped.
// Performance and quality barely moved. Availability and OEE fell off a cliff.

export const KPI_24H = [
  { time: '7 PM',  oee: 87.4, availability: 94.2, performance: 94.8, quality: 99.2 },
  { time: '8 PM',  oee: 87.4, availability: 94.2, performance: 94.8, quality: 99.2 },
  { time: '9 PM',  oee: 87.3, availability: 94.1, performance: 94.8, quality: 99.2 },
  { time: '10 PM', oee: 87.3, availability: 94.1, performance: 94.7, quality: 99.2 },
  { time: '11 PM', oee: 87.3, availability: 94.1, performance: 94.7, quality: 99.2 },
  { time: '12 AM', oee: 87.4, availability: 94.2, performance: 94.8, quality: 99.2 },
  { time: '1 AM',  oee: 87.4, availability: 94.2, performance: 94.8, quality: 99.2 },
  { time: '2 AM',  oee: 87.4, availability: 94.2, performance: 94.8, quality: 99.2 },
  // 2:03 AM -- K-101 trips. Availability crashes, OEE follows.
  { time: '3 AM',  oee: 78.1, availability: 80.2, performance: 94.0, quality: 99.1 },
  { time: '4 AM',  oee: 77.2, availability: 79.3, performance: 93.9, quality: 99.1 },
  { time: '5 AM',  oee: 76.8, availability: 78.9, performance: 93.8, quality: 99.1 },
  { time: '6 AM',  oee: 76.5, availability: 78.6, performance: 93.8, quality: 99.1 },
  { time: '7 AM',  oee: 76.3, availability: 78.4, performance: 93.8, quality: 99.1 },
]

// ── Assets (all 10) ───────────────────────────────────────────────────────────
// Asset Criticality: A=Safety, B=Production, C=Support (permanent classification)
// Event Severity: derived from eventType x asset criticality (see deriveEventSeverity)
// status: running | tripped | degraded | planned-outage

export const ASSETS = [
  {
    id: 'K-101',
    name: 'Compressor K-101',
    type: 'Centrifugal Compressor',
    service: 'H2 Recycle Gas',
    processUnit: 'Hydrocracker',
    criticality: 'A',
    status: 'tripped',
    urgency: 'urgent',
    oee: 64.2,
    // MES-fed in production; static in demo
    assumedPerformance: 0.649,
    assumedQuality: 0.990,
    oeeTrend: [89.1, 88.7, 88.4, 87.9, 86.2, 82.1, 64.2],
    rulTrend: [42, 35, 28, 21, 14, 9, 5],
    downtimeTrend: [0, 0, 0, 0, 0, 0, 5],
    repetitiveEvents: 3,
    downtime: '5h',
    rul: '5 days',
    mtbf: 312,
    mttr: 4.2,
    pmCompliance: 88,
    // productionWeight: fraction of plant OEE this asset contributes (0-1, all weights sum to 1.0)
    // K-101 is the single highest-weight asset: sole H2 recycle compressor on the hydrocracker.
    productionWeight: 0.20,
    narrative: 'Oil filter starts bypassing around day 14. Contaminated lubricant enters bearing housing. Journal bearing surfaces erode over two weeks. Oil pressure slowly drops as bearing clearances widen. Vibration climbs as shaft runs eccentric. Day 28, 1:30 AM: oil pressure drops to 1.2 bar. 2:03 AM: automatic trip on high vibration. The signals were there for 3 days with no intervention.',
    lesson: 'The signals were there. The system generated alerts. Nobody connected the dots in time.',
    subAssets: [
      {
        id: 'K-101-DE',
        name: 'Drive End Bearing',
        status: 'degraded',
        sensors: [
          { name: 'Vibration', value: 7.8, unit: 'mm/s', alarm: 7.1, status: 'alarm' },
          { name: 'Temperature', value: 108, unit: 'C', alarm: 95, status: 'alarm' },
          { name: 'Oil Film Thickness', value: 18, unit: 'microns', alarm: 25, status: 'alarm' },
        ],
      },
      {
        id: 'K-101-NDE',
        name: 'Non-Drive End Bearing',
        status: 'running',
        sensors: [
          { name: 'Vibration', value: 1.2, unit: 'mm/s', alarm: 7.1, status: 'normal' },
          { name: 'Temperature', value: 62, unit: 'C', alarm: 95, status: 'normal' },
        ],
      },
      {
        id: 'K-101-LOS',
        name: 'Lube Oil System',
        status: 'degraded',
        sensors: [
          { name: 'Oil Pressure', value: 1.0, unit: 'bar', alarm: 1.5, status: 'alarm' },
          { name: 'Filter DP', value: 0.3, unit: 'bar', alarm: 0.8, status: 'normal', note: 'bypassing' },
          { name: 'Oil Temperature', value: 58, unit: 'C', alarm: 65, status: 'normal' },
          { name: 'Particle Count', value: '22/19/16', unit: 'ISO 4406', alarm: null, status: 'elevated' },
        ],
      },
      {
        id: 'K-101-SEAL',
        name: 'Mechanical Seal',
        status: 'running',
        sensors: [
          { name: 'Seal Gas DP', value: 3.2, unit: 'bar', alarm: 2.0, status: 'normal' },
          { name: 'Leakage Rate', value: 0.8, unit: 'Nm3/hr', alarm: 2.5, status: 'normal' },
        ],
      },
      {
        id: 'K-101-ASV',
        name: 'Anti-Surge Valve',
        status: 'running',
        sensors: [
          { name: 'Valve Position', value: 42, unit: '%', alarm: null, status: 'elevated' },
          { name: 'Surge Margin', value: 7, unit: '%', alarm: 10, status: 'alarm' },
          { name: 'Cycle Count (24hr)', value: 14, unit: 'cycles', alarm: 20, status: 'elevated' },
        ],
      },
      {
        id: 'K-101-CPL',
        name: 'Coupling',
        status: 'running',
        sensors: [
          { name: 'Alignment Offset', value: 0.05, unit: 'mm', alarm: 0.15, status: 'normal' },
          { name: 'Temperature', value: 45, unit: 'C', alarm: 80, status: 'normal' },
        ],
      },
      {
        id: 'K-101-ROT',
        name: 'Rotor/Impeller',
        status: 'running',
        sensors: [
          { name: 'Axial Displacement', value: 0.12, unit: 'mm', alarm: 0.25, status: 'normal' },
          { name: 'Balance', value: 'G2.5', unit: 'grade', alarm: null, status: 'normal' },
        ],
      },
    ],
    // All K-101 events tracked in TIMELINE. 13 total: 2 new, 6 in-progress, 4 closed, 1 false-positive.
  },
  {
    id: 'P-203',
    name: 'Pump P-203',
    type: 'Centrifugal Pump',
    service: 'Hydrocracker feed pump',
    processUnit: 'Hydrocracker',
    criticality: 'B',
    status: 'degraded',
    urgency: 'urgent',
    oee: 78.4,
    // MES-fed in production; static in demo
    assumedPerformance: 0.793,
    assumedQuality: 0.989,
    oeeTrend: [86.3, 85.8, 84.1, 82.7, 81.0, 79.8, 78.4],
    rulTrend: [90, 82, 74, 66, 58, 51, 45],
    downtimeTrend: [0, 6, 6, 6, 6, 6, 6],
    repetitiveEvents: 2,
    downtime: '0h',
    rul: '45 days',
    mtbf: 1820,
    mttr: 6.1,
    pmCompliance: 94,
    // Hydrocracker feed pump. Production-critical but has standby.
    productionWeight: 0.12,
    narrative: 'Third mechanical seal replacement in six months. Each time maintenance replaces the seal and the pump runs fine for 6-8 weeks, then starts leaking again. Root cause: shaft runout from improper alignment after second seal replacement. Shaft runs slightly eccentric, wearing the seal face unevenly. Each replacement addresses the symptom but not the cause. Coupling alignment at 73% of alarm threshold and trending up.',
    lesson: 'The engineer who connects recurring seal failures to creeping alignment finds the root cause.',
    subAssets: [
      {
        id: 'P-203-SEAL',
        name: 'Mechanical Seal (Discharge)',
        status: 'degraded',
        sensors: [
          { name: 'Leakage Rate', value: 4.2, unit: 'L/hr', alarm: 2.0, status: 'alarm' },
          { name: 'Seal Chamber Pressure', value: 8.1, unit: 'bar', alarm: 7.5, status: 'alarm' },
          { name: 'Seal Face Temperature', value: 78, unit: 'C', alarm: 85, status: 'elevated' },
        ],
      },
      {
        id: 'P-203-DE',
        name: 'Drive End Bearing',
        status: 'running',
        sensors: [
          { name: 'Vibration', value: 2.1, unit: 'mm/s', alarm: 5.0, status: 'normal' },
          { name: 'Temperature', value: 58, unit: 'C', alarm: 85, status: 'normal' },
        ],
      },
      {
        id: 'P-203-NDE',
        name: 'Non-Drive End Bearing',
        status: 'running',
        sensors: [
          { name: 'Vibration', value: 1.8, unit: 'mm/s', alarm: 5.0, status: 'normal' },
          { name: 'Temperature', value: 55, unit: 'C', alarm: 85, status: 'normal' },
        ],
      },
      {
        id: 'P-203-IMP',
        name: 'Impeller',
        status: 'running',
        sensors: [
          { name: 'Discharge Pressure', value: 32.4, unit: 'bar', alarm: 30.5, status: 'normal' },
          { name: 'Flow Rate', value: 285, unit: 'm3/hr', alarm: 250, status: 'normal' },
          { name: 'Efficiency', value: 76, unit: '%', alarm: null, status: 'normal' },
        ],
      },
      {
        id: 'P-203-CPL',
        name: 'Coupling',
        status: 'running',
        sensors: [
          { name: 'Alignment Offset', value: 0.11, unit: 'mm', alarm: 0.15, status: 'elevated', note: '73% of alarm threshold, trending up' },
          { name: 'Axial Play', value: 0.08, unit: 'mm', alarm: 0.12, status: 'normal' },
        ],
      },
      {
        id: 'P-203-MTR',
        name: 'Motor',
        status: 'running',
        sensors: [
          { name: 'Current Draw', value: 42, unit: 'A', alarm: 48, status: 'normal' },
          { name: 'Winding Temperature', value: 68, unit: 'C', alarm: 95, status: 'normal' },
          { name: 'Insulation Resistance', value: 850, unit: 'MOhm', alarm: 200, status: 'normal' },
        ],
      },
    ],
    // All P-203 events tracked in TIMELINE. 6 total: 1 new, 3 in-progress, 2 closed.
  },
  {
    id: 'C-201',
    name: 'Cooler C-201',
    type: 'Air Fin Cooler',
    service: 'Compressor interstage cooling',
    processUnit: 'Hydrocracker',
    criticality: 'B',
    status: 'degraded',
    urgency: 'scheduled',
    oee: 82.1,
    // MES-fed in production; static in demo
    assumedPerformance: 0.831,
    assumedQuality: 0.988,
    oeeTrend: [88.2, 88.0, 87.9, 87.8, 87.6, 87.4, 82.1],
    rulTrend: [152, 145, 138, 131, 124, 117, 110],
    downtimeTrend: [0, 0, 0, 0, 0, 0, 0],
    repetitiveEvents: 1,
    downtime: '0h',
    rul: '110 days',
    mtbf: 3200,
    mttr: 8.4,
    pmCompliance: 91,
    // Interstage cooler for K-101. Support role; no cooling = reduced compression capacity.
    productionWeight: 0.08,
    narrative: 'C-201 cools gas between compression stages on K-101. When K-101 tripped at 2:03 AM, the sudden pressure release sent a transient pulse through interstage piping. The fan belt was already losing tension over months. The pressure transient shifted the belt on the sheave. Fan now runs with intermittent vibration, 3.2 mm/s spiking to 4.8 during belt slip events. The cooler itself is fine. Purely a mechanical issue on the air side.',
    lesson: 'How one trip event cascades to adjacent equipment. Belt was already loose, transient made it worse.',
    subAssets: [
      {
        id: 'C-201-FAN',
        name: 'Fan Assembly',
        status: 'degraded',
        sensors: [
          { name: 'Vibration', value: 3.2, unit: 'mm/s', alarm: 4.0, status: 'elevated', note: 'spikes to 4.8 during belt slip' },
          { name: 'Motor Current', value: 12.4, unit: 'A', alarm: 15, status: 'normal' },
          { name: 'Belt Tension', value: 82, unit: '%', alarm: 75, status: 'elevated' },
        ],
      },
      {
        id: 'C-201-MTR',
        name: 'Fan Motor',
        status: 'running',
        sensors: [
          { name: 'Winding Temperature', value: 62, unit: 'C', alarm: 95, status: 'normal' },
          { name: 'Insulation Resistance', value: 920, unit: 'MOhm', alarm: 200, status: 'normal' },
        ],
      },
      {
        id: 'C-201-TUB',
        name: 'Tube Bundle',
        status: 'running',
        sensors: [
          { name: 'Process Outlet Temperature', value: 48, unit: 'C', alarm: 55, status: 'normal' },
          { name: 'Fouling Factor', value: 0.0003, unit: 'm2K/W', alarm: 0.0006, status: 'normal' },
          { name: 'Pressure Drop', value: 0.4, unit: 'bar', alarm: 0.8, status: 'normal' },
        ],
      },
      {
        id: 'C-201-LVR',
        name: 'Louvers',
        status: 'running',
        sensors: [
          { name: 'Position', value: 65, unit: '%', alarm: null, status: 'normal' },
          { name: 'Actuator Response', value: 2.1, unit: 'sec', alarm: 5, status: 'normal' },
        ],
      },
      {
        id: 'C-201-STR',
        name: 'Structure/Frame',
        status: 'running',
        sensors: [
          { name: 'Foundation Vibration', value: 0.8, unit: 'mm/s', alarm: 2.5, status: 'normal' },
        ],
      },
    ],
    // All C-201 events tracked in TIMELINE. 3 total: 2 new, 1 in-progress.
  },
  {
    id: 'T-401',
    name: 'Turbine T-401',
    type: 'Gas Turbine',
    service: 'Power generation turbine',
    processUnit: 'Utilities',
    criticality: 'B',
    status: 'running',
    urgency: 'scheduled',
    oee: 88.1,
    // MES-fed in production; static in demo
    assumedPerformance: 0.890,
    assumedQuality: 0.990,
    oeeTrend: [88.4, 88.3, 88.2, 88.2, 88.1, 88.1, 88.1],
    rulTrend: [222, 215, 208, 201, 194, 187, 180],
    downtimeTrend: [0, 0, 0, 0, 0, 0, 0],
    repetitiveEvents: 0,
    downtime: '0h',
    rul: '180 days',
    mtbf: 2800,
    mttr: 96,
    pmCompliance: 100,
    // Utilities: 18.4 MW power generation. High weight -- plant grid stability.
    productionWeight: 0.15,
    narrative: '12,000-hour combustion inspection was scheduled weeks ago. The maintenance window opened at 6:00 AM but K-101 tripped at 2:03 AM. Now there is a question: should we shut down a healthy power source during a crisis to do preventive maintenance that can wait another week? The turbine is healthy. Previous inspections found minor coating wear within expected limits. Maintenance team, contractors, parts, and scaffolding are standing by. Morning huddle will decide whether to proceed or defer.',
    lesson: 'Not every decision is reactive. Sometimes the dashboard helps with scheduling trade-offs during a crisis.',
    subAssets: [
      {
        id: 'T-401-CMB',
        name: 'Combustion Section',
        status: 'running',
        sensors: [
          { name: 'Exhaust Temperature Spread', value: 18, unit: 'C', alarm: 25, status: 'normal' },
          { name: 'Flame Detection', value: 'All detected', unit: null, alarm: null, status: 'normal' },
        ],
      },
      {
        id: 'T-401-GGT',
        name: 'Gas Generator Turbine',
        status: 'running',
        sensors: [
          { name: 'Inlet Temperature', value: 945, unit: 'C', alarm: 980, status: 'normal' },
          { name: 'Exhaust Temperature', value: 520, unit: 'C', alarm: 560, status: 'normal' },
          { name: 'Vibration', value: 4.2, unit: 'mm/s', alarm: 12, status: 'normal' },
        ],
      },
      {
        id: 'T-401-PT',
        name: 'Power Turbine',
        status: 'running',
        sensors: [
          { name: 'Output Speed', value: 3600, unit: 'RPM', alarm: null, status: 'normal', note: 'overspeed alarm at 105%' },
          { name: 'Vibration', value: 3.8, unit: 'mm/s', alarm: 12, status: 'normal' },
          { name: 'Bearing Temperature', value: 72, unit: 'C', alarm: 95, status: 'normal' },
        ],
      },
      {
        id: 'T-401-LOS',
        name: 'Lube Oil System',
        status: 'running',
        sensors: [
          { name: 'Oil Pressure', value: 2.1, unit: 'bar', alarm: 1.5, status: 'normal' },
          { name: 'Oil Temperature', value: 48, unit: 'C', alarm: 65, status: 'normal' },
          { name: 'Filter DP', value: 0.3, unit: 'bar', alarm: 0.8, status: 'normal' },
        ],
      },
      {
        id: 'T-401-AIR',
        name: 'Inlet Air System',
        status: 'running',
        sensors: [
          { name: 'Filter DP', value: 0.6, unit: 'kPa', alarm: 1.2, status: 'normal' },
          { name: 'Ambient Temperature', value: 24, unit: 'C', alarm: null, status: 'normal' },
        ],
      },
      {
        id: 'T-401-GEN',
        name: 'Generator',
        status: 'running',
        sensors: [
          { name: 'Winding Temperature', value: 82, unit: 'C', alarm: 105, status: 'normal' },
          { name: 'Insulation Resistance', value: 1200, unit: 'MOhm', alarm: 200, status: 'normal' },
          { name: 'Output', value: 18.4, unit: 'MW', alarm: null, status: 'normal' },
        ],
      },
      {
        id: 'T-401-FUEL',
        name: 'Fuel System',
        status: 'running',
        sensors: [
          { name: 'Fuel Gas Pressure', value: 22, unit: 'bar', alarm: 18, status: 'normal' },
          { name: 'Flow Rate', value: 4200, unit: 'Nm3/hr', alarm: null, status: 'normal' },
        ],
      },
    ],
    // All T-401 events tracked in TIMELINE. 2 total: 0 new, 1 in-progress, 1 closed.
  },
  {
    id: 'E-105',
    name: 'Heat Exchanger E-105',
    type: 'Shell and Tube Heat Exchanger',
    service: 'Feed/effluent heat exchange',
    processUnit: 'Hydrocracker',
    criticality: 'C',
    status: 'running',
    urgency: 'scheduled',
    oee: 93.7,
    // MES-fed in production; static in demo
    assumedPerformance: 0.946,
    assumedQuality: 0.990,
    oeeTrend: [96.1, 95.8, 95.4, 95.0, 94.6, 94.1, 93.7],
    rulTrend: [282, 275, 268, 261, 254, 247, 240],
    downtimeTrend: [0, 0, 0, 0, 0, 0, 0],
    repetitiveEvents: 0,
    downtime: '0h',
    rul: '240 days',
    mtbf: 4800,
    mttr: 12.0,
    pmCompliance: 97,
    // Feed/effluent HX. Criticality C; downstream fired heater compensates when degraded.
    productionWeight: 0.06,
    narrative: 'E-105 preheats hydrocracker feed using hot reactor effluent. Two months ago the refinery shifted to a heavier crude slate. Heavier feed produces more asphaltene precursors that deposit on tube surfaces faster than the fouling model predicted. Feed outlet temperature is 6C lower than expected. Model predicted this fouling at month 8; happened at month 4. Investigation IN-0896 checking whether accelerated fouling is purely from feed change or if there is a tube leak. Lab results pending. Exchanger still running, fired heater downstream compensates but burns more fuel.',
    lesson: 'Not all problems have alarms. Some are trends that need explaining. Tests whether the dashboard supports slow-burn investigation, not just crisis response.',
    subAssets: [
      {
        id: 'E-105-TUB-P',
        name: 'Tube Bundle (Process Side)',
        status: 'running',
        sensors: [
          { name: 'Outlet Temperature', value: 142, unit: 'C', alarm: null, status: 'degraded', note: 'expected 148C' },
          { name: 'Fouling Factor', value: 0.00045, unit: 'm2K/W', alarm: 0.0006, status: 'elevated' },
          { name: 'Pressure Drop', value: 0.6, unit: 'bar', alarm: 0.8, status: 'elevated' },
        ],
      },
      {
        id: 'E-105-TUB-S',
        name: 'Tube Bundle (Shell Side)',
        status: 'running',
        sensors: [
          { name: 'Outlet Temperature', value: 88, unit: 'C', alarm: null, status: 'normal' },
          { name: 'Pressure Drop', value: 0.3, unit: 'bar', alarm: 0.6, status: 'normal' },
        ],
      },
      {
        id: 'E-105-CH',
        name: 'Channel Head',
        status: 'running',
        sensors: [
          { name: 'UT Thickness', value: 12.2, unit: 'mm', alarm: 10, status: 'normal', note: 'nominal 14 mm' },
        ],
      },
      {
        id: 'E-105-SHL',
        name: 'Shell',
        status: 'running',
        sensors: [
          { name: 'UT Thickness', value: 18.4, unit: 'mm', alarm: 15, status: 'normal', note: 'nominal 20 mm' },
          { name: 'Corrosion Rate', value: 0.15, unit: 'mm/yr', alarm: 0.25, status: 'normal' },
        ],
      },
      {
        id: 'E-105-GSK',
        name: 'Gaskets',
        status: 'running',
        sensors: [
          { name: 'External Leak Detection', value: 'None detected', unit: null, alarm: null, status: 'normal' },
        ],
      },
      {
        id: 'E-105-RV',
        name: 'Relief Valve',
        status: 'running',
        sensors: [
          { name: 'Set Pressure', value: 42, unit: 'bar', alarm: null, status: 'normal' },
          { name: 'Last Test Date', value: '6 months ago', unit: null, alarm: null, status: 'normal', note: 'retest at 12 months' },
        ],
      },
    ],
    // All E-105 events tracked in TIMELINE. 2 total: 1 new, 1 false-positive.
  },
  {
    id: 'R-301',
    name: 'Reactor R-301',
    type: 'Fixed-Bed Reactor',
    service: 'Hydrocracker reactor',
    processUnit: 'Hydrocracker',
    criticality: 'A',
    status: 'running',
    urgency: 'scheduled',
    oee: 95.2,
    // MES-fed in production; static in demo
    assumedPerformance: 0.960,
    assumedQuality: 0.992,
    oeeTrend: [95.4, 95.3, 95.3, 95.2, 95.2, 95.2, 95.2],
    rulTrend: [407, 400, 393, 386, 379, 372, 365],
    downtimeTrend: [0, 0, 0, 0, 0, 0, 0],
    repetitiveEvents: 0,
    downtime: '0h',
    rul: '365 days',
    mtbf: 8760,
    mttr: 168,
    pmCompliance: 99,
    // Most critical asset in the plant. Sole hydrocracker reactor -- failure shuts the unit.
    productionWeight: 0.18,
    narrative: 'Most critical asset in the plant, most stable. Fixed-bed catalytic reactor, heavy hydrocarbons with hydrogen at high temp and pressure. Catalyst bed loaded 18 months ago, performing within expected parameters. Next reload scheduled for turnaround in 12 months. No events, no investigations. K-101 trip did not affect R-301 operationally because standby compressor picked up recycle gas duty.',
    lesson: 'If K-101 had no standby, R-301 would have been the real story. A healthy critical asset still needs context.',
    subAssets: [
      {
        id: 'R-301-CAT',
        name: 'Catalyst Bed',
        status: 'running',
        sensors: [
          { name: 'Bed Temperature (avg)', value: 385, unit: 'C', alarm: 410, status: 'normal', note: '12 zones' },
          { name: 'WABT', value: 388, unit: 'C', alarm: 400, status: 'normal' },
          { name: 'Catalyst Activity', value: 91, unit: '%', alarm: 80, status: 'normal' },
        ],
      },
      {
        id: 'R-301-SHL',
        name: 'Reactor Shell',
        status: 'running',
        sensors: [
          { name: 'Wall Temperature', value: 362, unit: 'C', alarm: 395, status: 'normal', note: 'design 425C' },
          { name: 'UT Thickness', value: 148, unit: 'mm', alarm: 135, status: 'normal', note: 'nominal 152 mm' },
          { name: 'Hydrogen Embrittlement Index', value: 0.02, unit: null, alarm: 0.05, status: 'normal' },
        ],
      },
      {
        id: 'R-301-INL',
        name: 'Inlet Distribution',
        status: 'running',
        sensors: [
          { name: 'Flow Distribution Variance', value: 2.1, unit: '%', alarm: 5, status: 'normal' },
          { name: 'Inlet Temperature', value: 378, unit: 'C', alarm: 395, status: 'normal' },
        ],
      },
      {
        id: 'R-301-QCH',
        name: 'Quench System',
        status: 'running',
        sensors: [
          { name: 'Quench Gas Flow', value: 8400, unit: 'Nm3/hr', alarm: null, status: 'normal' },
          { name: 'Quench Valve Position', value: 34, unit: '%', alarm: null, status: 'normal' },
          { name: 'Bed Delta-T', value: 28, unit: 'C', alarm: 40, status: 'normal' },
        ],
      },
      {
        id: 'R-301-TC',
        name: 'Thermocouples (12)',
        status: 'running',
        sensors: [
          { name: 'Calibration Drift (worst)', value: 0.4, unit: 'C', alarm: 1.5, status: 'normal' },
          { name: 'Last Calibration', value: '5 months ago', unit: null, alarm: null, status: 'normal', note: 'recal at 12 months' },
        ],
      },
      {
        id: 'R-301-SRV',
        name: 'Safety Relief System',
        status: 'running',
        sensors: [
          { name: 'Set Pressure', value: 195, unit: 'bar', alarm: null, status: 'normal' },
          { name: 'Last Test', value: '8 months ago', unit: null, alarm: null, status: 'normal', note: 'retest at 12 months' },
          { name: 'Rupture Disc Integrity', value: 'Intact', unit: null, alarm: null, status: 'normal' },
        ],
      },
      {
        id: 'R-301-H2',
        name: 'Hydrogen Analyzer',
        status: 'running',
        sensors: [
          { name: 'H2 Purity', value: 99.2, unit: '%', alarm: 98.5, status: 'normal' },
          { name: 'Calibration Status', value: '4 months ago', unit: null, alarm: null, status: 'normal' },
        ],
      },
    ],
  },
  {
    id: 'V-501',
    name: 'Vessel V-501',
    type: 'Pressure Vessel',
    service: 'High-pressure separator',
    processUnit: 'Hydrocracker',
    criticality: 'C',
    status: 'running',
    urgency: 'scheduled',
    oee: 94.8,
    // MES-fed in production; static in demo
    assumedPerformance: 0.957,
    assumedQuality: 0.991,
    oeeTrend: [95.0, 95.0, 94.9, 94.9, 94.8, 94.8, 94.8],
    rulTrend: [342, 335, 328, 321, 314, 307, 300],
    downtimeTrend: [0, 0, 0, 0, 0, 0, 0],
    repetitiveEvents: 0,
    downtime: '0h',
    rul: '300 days',
    mtbf: 6500,
    mttr: 24,
    pmCompliance: 98,
    // HP separator: support function. Pressure transient documented but no damage.
    productionWeight: 0.05,
    narrative: 'V-501 separates hydrogen-rich gas from liquid product downstream of reactor. When K-101 tripped, sudden loss of recycle gas compression caused pressure transient. V-501 saw brief spike from 152 bar to 161 bar over 90 seconds before control systems stabilized it. Design pressure is 180 bar. Relief valve did not lift. No damage. Operations flagged because any unexpected pressure excursion on a high-pressure hydrogen vessel gets documented. Investigation IN-0898 is verification: confirm no damage, review pressure trace, close it out.',
    lesson: 'Not every investigation means something is broken. Sometimes it is due diligence.',
    subAssets: [
      {
        id: 'V-501-SHL',
        name: 'Vessel Shell',
        status: 'running',
        sensors: [
          { name: 'Operating Pressure', value: 152, unit: 'bar', alarm: 165, status: 'normal', note: 'design 180 bar' },
          { name: 'Operating Temperature', value: 285, unit: 'C', alarm: 310, status: 'normal', note: 'design 320C' },
          { name: 'UT Thickness', value: 62, unit: 'mm', alarm: 55, status: 'normal', note: 'nominal 65 mm' },
          { name: 'Corrosion Rate', value: 0.12, unit: 'mm/yr', alarm: null, status: 'normal' },
        ],
      },
      {
        id: 'V-501-LVL',
        name: 'Level Control',
        status: 'running',
        sensors: [
          { name: 'Liquid Level', value: 48, unit: '%', alarm: 80, status: 'normal', note: 'low alarm at 15%' },
          { name: 'Control Valve Position', value: 52, unit: '%', alarm: null, status: 'normal' },
        ],
      },
      {
        id: 'V-501-PRV',
        name: 'Pressure Relief Valve',
        status: 'running',
        sensors: [
          { name: 'Set Pressure', value: 176, unit: 'bar', alarm: null, status: 'normal' },
          { name: 'Last Test Date', value: '4 months ago', unit: null, alarm: null, status: 'normal', note: 'retest at 12 months' },
          { name: 'Lift Count', value: 0, unit: 'lifts', alarm: null, status: 'normal' },
        ],
      },
      {
        id: 'V-501-INL',
        name: 'Inlet Nozzle',
        status: 'running',
        sensors: [
          { name: 'Erosion Rate', value: 0.08, unit: 'mm/yr', alarm: 0.20, status: 'normal' },
        ],
      },
      {
        id: 'V-501-OUT-G',
        name: 'Outlet Nozzle (Gas)',
        status: 'running',
        sensors: [
          { name: 'Erosion Rate', value: 0.05, unit: 'mm/yr', alarm: 0.20, status: 'normal' },
        ],
      },
      {
        id: 'V-501-OUT-L',
        name: 'Outlet Nozzle (Liquid)',
        status: 'running',
        sensors: [
          { name: 'Erosion Rate', value: 0.06, unit: 'mm/yr', alarm: 0.20, status: 'normal' },
        ],
      },
      {
        id: 'V-501-LT',
        name: 'Level Transmitter',
        status: 'running',
        sensors: [
          { name: 'Calibration Drift', value: 0.3, unit: '%', alarm: 1.0, status: 'normal' },
          { name: 'Last Calibration', value: '3 months ago', unit: null, alarm: null, status: 'normal', note: 'recal at 6 months' },
        ],
      },
    ],
  },
  {
    id: 'P-102',
    name: 'Pump P-102',
    type: 'Centrifugal Pump',
    service: 'Reflux pump',
    processUnit: 'Fractionation',
    criticality: 'C',
    status: 'running',
    urgency: 'scheduled',
    oee: 96.1,
    // MES-fed in production; static in demo
    assumedPerformance: 0.970,
    assumedQuality: 0.991,
    oeeTrend: [96.3, 96.2, 96.2, 96.1, 96.1, 96.1, 96.1],
    rulTrend: [322, 315, 308, 301, 294, 287, 280],
    downtimeTrend: [0, 0, 0, 0, 0, 0, 0],
    repetitiveEvents: 0,
    downtime: '0h',
    rul: '280 days',
    mtbf: 2400,
    mttr: 5.2,
    pmCompliance: 96,
    // Reflux pump: Criticality C with standby available. Lowest production contribution.
    productionWeight: 0.04,
    narrative: 'Support pump in fractionation unit. Returns condensed liquid from top of fractionation column back into process. Simple, single-stage. Low criticality because spare pump available within minutes. No events, no investigations. Only routine preventive WOs. This pump runs, gets maintained on schedule, does not cause problems.',
    lesson: 'Background asset that fills out the table and shows the engineer most of the plant is fine.',
    subAssets: [
      {
        id: 'P-102-IMP',
        name: 'Impeller',
        status: 'running',
        sensors: [
          { name: 'Discharge Pressure', value: 4.8, unit: 'bar', alarm: 4.2, status: 'normal' },
          { name: 'Flow Rate', value: 120, unit: 'm3/hr', alarm: 100, status: 'normal' },
          { name: 'Efficiency', value: 79, unit: '%', alarm: null, status: 'normal' },
        ],
      },
      {
        id: 'P-102-SEAL',
        name: 'Mechanical Seal',
        status: 'running',
        sensors: [
          { name: 'Leakage Rate', value: 0.2, unit: 'L/hr', alarm: 2.0, status: 'normal' },
          { name: 'Seal Chamber Pressure', value: 5.1, unit: 'bar', alarm: 4.5, status: 'normal' },
        ],
      },
      {
        id: 'P-102-DE',
        name: 'Drive End Bearing',
        status: 'running',
        sensors: [
          { name: 'Vibration', value: 1.1, unit: 'mm/s', alarm: 5.0, status: 'normal' },
          { name: 'Temperature', value: 48, unit: 'C', alarm: 85, status: 'normal' },
        ],
      },
      {
        id: 'P-102-NDE',
        name: 'Non-Drive End Bearing',
        status: 'running',
        sensors: [
          { name: 'Vibration', value: 0.9, unit: 'mm/s', alarm: 5.0, status: 'normal' },
          { name: 'Temperature', value: 45, unit: 'C', alarm: 85, status: 'normal' },
        ],
      },
      {
        id: 'P-102-CPL',
        name: 'Coupling',
        status: 'running',
        sensors: [
          { name: 'Alignment Offset', value: 0.04, unit: 'mm', alarm: 0.15, status: 'normal' },
        ],
      },
      {
        id: 'P-102-MTR',
        name: 'Motor',
        status: 'running',
        sensors: [
          { name: 'Current Draw', value: 18, unit: 'A', alarm: 22, status: 'normal' },
          { name: 'Winding Temperature', value: 52, unit: 'C', alarm: 95, status: 'normal' },
          { name: 'Insulation Resistance', value: 1100, unit: 'MOhm', alarm: 200, status: 'normal' },
        ],
      },
    ],
  },
  {
    id: 'K-302',
    name: 'Compressor K-302',
    type: 'Centrifugal Compressor',
    service: 'Wet gas compressor',
    processUnit: 'FCC',
    criticality: 'A',
    status: 'degraded',
    urgency: 'scheduled',
    oee: 79.3,
    // MES-fed in production; static in demo
    assumedPerformance: 0.802,
    assumedQuality: 0.989,
    oeeTrend: [88.1, 86.9, 85.4, 83.8, 82.1, 80.6, 79.3],
    rulTrend: [140, 132, 124, 116, 110, 102, 95],
    downtimeTrend: [0, 0, 0, 2, 2, 2, 2],
    repetitiveEvents: 3,
    downtime: '0h',
    rul: '95 days',
    mtbf: 980,
    mttr: 3.8,
    pmCompliance: 87,
    // FCC wet gas compressor: Safety A but FCC is independent of hydrocracker.
    productionWeight: 0.07,
    narrative: 'Operations noticed discharge temperature swinging by 8-10C every few minutes. Control room initially blamed the anti-surge control valve (hunting). WO-4494 opened to stroke-test the valve. Investigation IN-0893 started as a controls issue. Root cause: polymer fouling on the first-stage impeller blades. FCC wet gas carries heavy hydrocarbons that polymerize on blade surfaces. Buildup is uneven, so compressor oscillates between restricted flow (fouled) and partial break-off (cleaner). Control valve is responding correctly to the oscillation, not causing it.',
    lesson: 'Discharge temperature oscillates but suction conditions are stable. If it were a valve issue, suction pressure would fluctuate too. Steady suction with oscillating discharge points to something inside the compressor.',
    subAssets: [
      {
        id: 'K-302-IMP1',
        name: 'First-Stage Impeller',
        status: 'degraded',
        sensors: [
          { name: 'Discharge Temperature', value: 142, unit: 'C', alarm: 148, status: 'elevated', note: 'oscillating +/-8C' },
          { name: 'Polytropic Efficiency', value: 71, unit: '%', alarm: 68, status: 'elevated' },
          { name: 'Discharge Pressure', value: 4.8, unit: 'bar', alarm: 4.2, status: 'normal' },
        ],
      },
      {
        id: 'K-302-IMP2',
        name: 'Second-Stage Impeller',
        status: 'running',
        sensors: [
          { name: 'Discharge Temperature', value: 198, unit: 'C', alarm: 210, status: 'normal' },
          { name: 'Polytropic Efficiency', value: 74, unit: '%', alarm: 68, status: 'normal' },
        ],
      },
      {
        id: 'K-302-DE',
        name: 'Drive End Bearing',
        status: 'running',
        sensors: [
          { name: 'Vibration', value: 2.4, unit: 'mm/s', alarm: 7.1, status: 'normal' },
          { name: 'Temperature', value: 65, unit: 'C', alarm: 95, status: 'normal' },
        ],
      },
      {
        id: 'K-302-NDE',
        name: 'Non-Drive End Bearing',
        status: 'running',
        sensors: [
          { name: 'Vibration', value: 2.1, unit: 'mm/s', alarm: 7.1, status: 'normal' },
          { name: 'Temperature', value: 62, unit: 'C', alarm: 95, status: 'normal' },
        ],
      },
      {
        id: 'K-302-LOS',
        name: 'Lube Oil System',
        status: 'running',
        sensors: [
          { name: 'Oil Pressure', value: 2.0, unit: 'bar', alarm: 1.5, status: 'normal' },
          { name: 'Filter DP', value: 0.4, unit: 'bar', alarm: 0.8, status: 'normal' },
          { name: 'Oil Temperature', value: 52, unit: 'C', alarm: 65, status: 'normal' },
        ],
      },
      {
        id: 'K-302-ASV',
        name: 'Anti-Surge Valve',
        status: 'running',
        sensors: [
          { name: 'Valve Position', value: 38, unit: '%', alarm: null, status: 'normal' },
          { name: 'Surge Margin', value: 14, unit: '%', alarm: 10, status: 'normal' },
          { name: 'Cycle Count (24hr)', value: 8, unit: 'cycles', alarm: 20, status: 'normal' },
        ],
      },
      {
        id: 'K-302-SEAL',
        name: 'Mechanical Seal',
        status: 'running',
        sensors: [
          { name: 'Seal Gas DP', value: 3.5, unit: 'bar', alarm: 2.0, status: 'normal' },
          { name: 'Leakage Rate', value: 0.6, unit: 'Nm3/hr', alarm: 2.5, status: 'normal' },
        ],
      },
    ],
    // All K-302 events tracked in TIMELINE. 4 total: 1 new, 2 in-progress, 1 false-positive.
  },
  {
    id: 'T-102',
    name: 'Turbine T-102',
    type: 'Power Recovery Turbine',
    service: 'FCC power recovery turbine',
    processUnit: 'FCC',
    criticality: 'B',
    status: 'running',
    urgency: 'scheduled',
    oee: 91.4,
    // MES-fed in production; static in demo
    assumedPerformance: 0.924,
    assumedQuality: 0.989,
    oeeTrend: [94.2, 93.8, 93.2, 92.7, 92.1, 91.8, 91.4],
    rulTrend: [242, 235, 228, 221, 214, 207, 200],
    downtimeTrend: [0, 0, 0, 0, 0, 0, 0],
    repetitiveEvents: 0,
    downtime: '0h',
    rul: '200 days',
    mtbf: 2200,
    mttr: 14.0,
    pmCompliance: 95,
    // FCC power recovery turbine: 12.6 MW. Production B, FCC flue gas energy recovery.
    productionWeight: 0.05,
    narrative: 'T-102 recovers energy from FCC flue gas. Running 14 months since last overhaul. Exhaust temperature spread widening over three weeks: 12C three weeks ago, now 22C. Alarm threshold is 30C. Root cause: two of eight fuel nozzles developing coke deposits. Coking restricts fuel flow, those nozzles run lean, other six compensate rich. Uneven combustion creates hot spots near clean nozzles, cool spots near coked ones. At current rate, spread hits 30C alarm in about two weeks, triggering forced outage. Investigation IN-0895 monitoring to decide whether to schedule cleaning now or wait.',
    lesson: 'Parallel to K-101: K-101 had signals for days before the trip and nobody acted. T-102 has signals now. Will this time be different?',
    subAssets: [
      {
        id: 'T-102-CMB',
        name: 'Combustion Section',
        status: 'running',
        sensors: [
          { name: 'Exhaust Temp Spread', value: 22, unit: 'C', alarm: 30, status: 'elevated', note: 'was 12C three weeks ago' },
          { name: 'Nozzle 3 Temperature', value: null, unit: 'C', alarm: null, status: 'degraded', note: '15C cool vs average' },
          { name: 'Nozzle 7 Temperature', value: null, unit: 'C', alarm: null, status: 'degraded', note: '15C cool vs average' },
          { name: 'Flame Intensity', value: 'Even', unit: null, alarm: null, status: 'normal' },
        ],
      },
      {
        id: 'T-102-EXP',
        name: 'Expander Wheel',
        status: 'running',
        sensors: [
          { name: 'Vibration', value: 3.1, unit: 'mm/s', alarm: 8, status: 'normal' },
          { name: 'Blade Path Temperature', value: 645, unit: 'C', alarm: 680, status: 'normal' },
        ],
      },
      {
        id: 'T-102-DE',
        name: 'Drive End Bearing',
        status: 'running',
        sensors: [
          { name: 'Vibration', value: 1.9, unit: 'mm/s', alarm: 8, status: 'normal' },
          { name: 'Temperature', value: 58, unit: 'C', alarm: 95, status: 'normal' },
        ],
      },
      {
        id: 'T-102-NDE',
        name: 'Non-Drive End Bearing',
        status: 'running',
        sensors: [
          { name: 'Vibration', value: 1.7, unit: 'mm/s', alarm: 8, status: 'normal' },
          { name: 'Temperature', value: 55, unit: 'C', alarm: 95, status: 'normal' },
        ],
      },
      {
        id: 'T-102-LOS',
        name: 'Lube Oil System',
        status: 'running',
        sensors: [
          { name: 'Oil Pressure', value: 2.2, unit: 'bar', alarm: 1.5, status: 'normal' },
          { name: 'Oil Temperature', value: 46, unit: 'C', alarm: 65, status: 'normal' },
          { name: 'Filter DP', value: 0.3, unit: 'bar', alarm: 0.8, status: 'normal' },
        ],
      },
      {
        id: 'T-102-GEN',
        name: 'Generator',
        status: 'running',
        sensors: [
          { name: 'Output', value: 12.6, unit: 'MW', alarm: null, status: 'normal' },
          { name: 'Winding Temperature', value: 78, unit: 'C', alarm: 105, status: 'normal' },
          { name: 'Insulation Resistance', value: 980, unit: 'MOhm', alarm: 200, status: 'normal' },
        ],
      },
      {
        id: 'T-102-FN',
        name: 'Fuel Nozzles (8)',
        status: 'running',
        sensors: [
          { name: 'Nozzle 3 Flow', value: 82, unit: '%', alarm: 75, status: 'elevated', note: 'coking suspected' },
          { name: 'Nozzle 7 Flow', value: 82, unit: '%', alarm: 75, status: 'elevated', note: 'coking suspected' },
          { name: 'Other Nozzles Flow', value: '100-103', unit: '%', alarm: null, status: 'normal' },
        ],
      },
    ],
    // All T-102 events tracked in TIMELINE. 2 total: 1 new, 1 closed.
  },
]

// ── Event counts on assets are derived from TIMELINE after it is defined ─────
// See "Computed: event, WO, and investigation counts" section below.

// ── Timeline of Events (all tracked events) ─────────────────────────────────
// Complete event record backing all per-asset counts. Chronological (earliest first).
// status: 'new' | 'in-progress' | 'closed' | 'false-positive' (triage workflow)
// WO creation and case opening are system actions, tracked in WORK_ORDERS/CASES.
// Each event has full metadata with provenance (source, confidence, status) and relationships.
// Historical events (beyond 24 hours) use compact format with date field instead of time.

export const TIMELINE = [
  // ── Historical events (oldest first) ────────────────────────────────────────

  // P-203: Seal Failure #1 (4 months ago) -- closed
  // Severity override: matrix yields 'low' (alert x B), escalated to 'high' -- first occurrence of failure mode that becomes a recurring pattern
  {
    id: 'EVT-P203-H1',
    name: 'Mechanical Seal Failure',
    date: '4 months ago',
    severity: 'high',
    eventType: 'alert',
    asset: 'Pump P-203',
    assetId: 'P-203',
    subAsset: 'Mechanical Seal (Discharge)',
    subAssetId: 'P-203-SEAL',
    event: 'Seal leakage detected at 3.8 L/hr. Seal replaced. No alignment check performed.',
    status: 'closed',
    incidentId: null,
    relationships: [],
    cause: { text: 'Mechanical seal face wear from normal operation. No root cause investigation performed at the time.', source: 'human', confidence: null, updatedBy: 'Fred Martinez', updatedAt: null, status: 'confirmed' },
    consequence: { text: 'Pump taken offline for 6 hours for seal replacement. Spare pump covered duty. No production impact.', source: 'system', confidence: null, updatedBy: 'Auto-detection', updatedAt: null, status: 'confirmed' },
    recommendation: { text: 'Seal replaced. Pump returned to service. No further action at the time.', source: 'human', confidence: null, updatedBy: 'Fred Martinez', updatedAt: null, status: 'confirmed' },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: [],
  },

  // R-301: Catalyst Bed Hot Spot (3 months ago) -- closed
  {
    id: 'EVT-R301-H1',
    name: 'Catalyst Bed Hot Spot',
    date: '3 months ago',
    severity: 'high',
    eventType: 'alarm',
    asset: 'Reactor R-301',
    assetId: 'R-301',
    subAsset: 'Catalyst Bed',
    subAssetId: 'R-301-CAT',
    event: 'Zone 7 temperature exceeded delta-T alarm at 42C (threshold 40C)',
    status: 'closed',
    incidentId: null,
    relationships: [],
    cause: { text: 'Localized flow maldistribution in catalyst bed zone 7. Quench gas injection momentarily insufficient during feed rate ramp-up. Temperature normalized within 2 hours after quench valve repositioning.', source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: null, status: 'confirmed' },
    consequence: { text: 'Brief temperature excursion in one of twelve zones. No catalyst damage. Quench system responded as designed once operator adjusted valve position. Bed delta-T returned to 28C within 2 hours.', source: 'system', confidence: null, updatedBy: 'Auto-detection', updatedAt: null, status: 'confirmed' },
    recommendation: { text: 'Review quench valve auto-response during feed rate changes. Consider tighter setpoint band for zone 7 given its position relative to inlet distribution.', source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: null, status: 'confirmed' },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: [],
  },

  // P-102: Vibration Spike During Startup (3 months ago) -- closed
  {
    id: 'EVT-P102-H1',
    name: 'Vibration Spike During Startup',
    date: '3 months ago',
    severity: 'low',
    eventType: 'alert',
    asset: 'Pump P-102',
    assetId: 'P-102',
    subAsset: 'Drive End Bearing',
    subAssetId: 'P-102-DE',
    event: 'Vibration spike to 3.8 mm/s during cold startup, settled to 1.1 mm/s within 10 minutes',
    status: 'closed',
    incidentId: null,
    relationships: [],
    cause: { text: 'Thermal transient during cold startup caused temporary rotor bow. Vibration settled as pump reached thermal equilibrium. Normal startup behavior for this pump model.', source: 'system', confidence: null, updatedBy: 'Auto-detection', updatedAt: null, status: 'confirmed' },
    consequence: { text: 'No impact. Vibration returned to baseline within 10 minutes. All bearing temperatures nominal.', source: 'system', confidence: null, updatedBy: 'Auto-detection', updatedAt: null, status: 'confirmed' },
    recommendation: { text: 'No action required. Documented as baseline startup behavior for future reference.', source: 'human', confidence: null, updatedBy: 'James Park', updatedAt: null, status: 'confirmed' },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: [],
  },

  // T-102: Vibration Spike During Load Change (2 months ago) -- closed
  {
    id: 'EVT-T102-H2',
    name: 'Vibration Spike During Load Change',
    date: '2 months ago',
    severity: 'low',
    eventType: 'alert',
    asset: 'Turbine T-102',
    assetId: 'T-102',
    subAsset: 'Expander Wheel',
    subAssetId: 'T-102-EXP',
    event: 'Expander vibration briefly reached 5.2 mm/s during rapid FCC throughput change',
    status: 'closed',
    incidentId: null,
    relationships: [],
    cause: { text: 'Rapid load change during FCC throughput adjustment caused transient rotor imbalance. Vibration returned to 3.1 mm/s within 5 minutes as flow stabilized.', source: 'system', confidence: null, updatedBy: 'Auto-detection', updatedAt: null, status: 'confirmed' },
    consequence: { text: 'No damage. Transient event during normal operations. Bearings and seals unaffected.', source: 'system', confidence: null, updatedBy: 'Auto-detection', updatedAt: null, status: 'confirmed' },
    recommendation: { text: 'Documented for baseline. Consider slower load ramp rate if FCC throughput changes become more frequent.', source: 'human', confidence: null, updatedBy: 'Mike Torres', updatedAt: null, status: 'confirmed' },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: [],
  },

  // R-301: Thermocouple Drift Alert (2 months ago) -- closed
  {
    id: 'EVT-R301-H2',
    name: 'Thermocouple Drift Alert',
    date: '2 months ago',
    severity: 'medium',
    eventType: 'alert',
    asset: 'Reactor R-301',
    assetId: 'R-301',
    subAsset: 'Thermocouples (12)',
    subAssetId: 'R-301-TC',
    event: 'Three thermocouples drifting beyond 1.0C calibration tolerance (alarm at 1.5C)',
    status: 'closed',
    incidentId: null,
    relationships: [],
    cause: { text: 'Normal thermocouple drift from extended high-temperature service. Three of twelve thermocouples (zones 3, 8, 11) showing 1.0-1.2C drift. Within recalibration interval.', source: 'system', confidence: null, updatedBy: 'Auto-detection', updatedAt: null, status: 'confirmed' },
    consequence: { text: 'Bed temperature readings slightly off in three zones. Compensated by redundant sensors. No process impact. Recalibration brought all within 0.4C.', source: 'human', confidence: null, updatedBy: 'Sarah Chen', updatedAt: null, status: 'confirmed' },
    recommendation: { text: 'Recalibrate affected thermocouples. Update calibration schedule to account for drift rate at current operating temperatures.', source: 'human', confidence: null, updatedBy: 'Sarah Chen', updatedAt: null, status: 'confirmed' },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: [],
  },

  // P-203: Seal Failure #2 (2 months ago) -- closed
  // Severity override: matrix yields 'low' (alert x B), escalated to 'high' -- second identical failure in 2 months, recurring failure pattern confirmed
  {
    id: 'EVT-P203-H2',
    name: 'Mechanical Seal Failure',
    date: '2 months ago',
    severity: 'high',
    eventType: 'alert',
    asset: 'Pump P-203',
    assetId: 'P-203',
    subAsset: 'Mechanical Seal (Discharge)',
    subAssetId: 'P-203-SEAL',
    event: 'Same failure mode as EVT-P203-H1. Seal leakage at 4.0 L/hr. Second failure in 2 months.',
    status: 'closed',
    incidentId: null,
    relationships: [
      { type: 'related_to', eventId: 'EVT-P203-H1' },
    ],
    cause: { text: 'Identical seal face wear pattern as first failure. Recurring failure engine flagged this as a repetitive event. Seal replaced again without alignment check. Investigation IN-0894 opened to find root cause of recurring pattern.', source: 'model', confidence: 78, updatedBy: 'Recurring Failure Engine', updatedAt: null, status: 'confirmed' },
    consequence: { text: 'Second pump outage for seal replacement in 2 months. 6 hours downtime each time. Parts cost doubling. Same symptom, same fix, same result predicted.', source: 'model', confidence: 78, updatedBy: 'Recurring Failure Engine', updatedAt: null, status: 'confirmed' },
    recommendation: { text: 'Do not simply replace the seal again. Investigate alignment, shaft runout, and coupling condition before next seal installation.', source: 'human', confidence: null, updatedBy: 'Sarah Chen', updatedAt: null, status: 'confirmed' },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: ['IN-0894'],
  },

  // K-101: Vibration Baseline Check (6 weeks ago) -- closed
  {
    id: 'EVT-K101-H4',
    name: 'Quarterly Vibration Baseline',
    date: '6 weeks ago',
    severity: 'medium',
    eventType: 'inspection',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Drive End Bearing',
    subAssetId: 'K-101-DE',
    event: 'Quarterly vibration baseline: 2.8 mm/s DE, 1.2 mm/s NDE. Within limits.',
    status: 'closed',
    incidentId: null,
    relationships: [],
    cause: {
      text: 'Routine quarterly vibration baseline measurement per PM schedule. Drive end bearing at 2.8 mm/s, non-drive end at 1.2 mm/s. Both within ISO 10816 Zone A/B boundary for this machine class. Oil film thickness not measured during routine baselines (requires shutdown). Bearing temperature at 72C, well within the 95C alarm. The 2.8 mm/s reading represented a 33% increase from the previous quarter (2.1 mm/s), but the absolute value was so far below alarm that the trend was not flagged. The quarterly measurement interval is too coarse to catch a degradation that would accelerate rapidly over the next six weeks.',
      source: 'human', confidence: null, updatedBy: 'James Park', updatedAt: null, status: 'confirmed',
    },
    consequence: {
      text: 'No action taken. At 2.8 mm/s (39% of the 7.1 mm/s alarm threshold), the reading appeared healthy. In hindsight, this was the first measurable evidence that the oil filter was beginning to bypass and contaminated lubricant was starting to affect bearing surfaces. The 33% quarter-over-quarter increase should have prompted a trend review, but the PM checklist only requires comparison against alarm thresholds, not trend analysis. A simple time-series plot of the last four quarterly readings would have shown the inflection point. This is the kind of signal that a condition monitoring system should catch automatically -- the absolute value is fine, but the rate of change is not.',
      source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: '7:00 AM', status: 'confirmed',
    },
    recommendation: {
      text: 'Investigation IN-0891 is reviewing whether quarterly baselines should include automated trend comparison, not just threshold checks. The recommendation: configure the condition monitoring system to flag any bearing vibration increase greater than 25% quarter-over-quarter, regardless of absolute value. This would have caught the K-101 degradation at least two weeks earlier.',
      source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: '7:00 AM', status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: [],
  },

  // K-101: Seal Gas DP Alert (5 weeks ago) -- false-positive
  {
    id: 'EVT-K101-H8',
    name: 'Seal Gas DP Alert',
    date: '5 weeks ago',
    severity: 'medium',
    eventType: 'alert',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Mechanical Seal',
    subAssetId: 'K-101-SEAL',
    event: 'Seal gas differential pressure briefly read 1.8 bar (alarm 2.0 bar)',
    status: 'false-positive',
    incidentId: null,
    relationships: [],
    cause: { text: 'Pressure transmitter drift. Actual DP was 3.2 bar. Transmitter recalibrated and reading returned to normal immediately.', source: 'human', confidence: null, updatedBy: 'Fred Martinez', updatedAt: null, status: 'confirmed' },
    consequence: { text: 'No real seal gas pressure issue. False reading from drifting transmitter.', source: 'human', confidence: null, updatedBy: 'Fred Martinez', updatedAt: null, status: 'confirmed' },
    recommendation: { text: 'Transmitter recalibrated. Add to next PM cycle for early replacement if drift recurs.', source: 'human', confidence: null, updatedBy: 'Fred Martinez', updatedAt: null, status: 'confirmed' },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: [],
  },

  // K-101: Anti-Surge Valve Alert (4 weeks ago) -- closed
  {
    id: 'EVT-K101-H7',
    name: 'Anti-Surge Valve Cycling High',
    date: '4 weeks ago',
    severity: 'medium',
    eventType: 'alert',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Anti-Surge Valve',
    subAssetId: 'K-101-ASV',
    event: 'Anti-surge valve cycling 18 times in 24 hours (alarm 20). Resolved by PID tuning.',
    status: 'closed',
    incidentId: null,
    relationships: [],
    cause: { text: 'Process upset in downstream hydrocracker caused pressure fluctuations. Anti-surge controller responding correctly but aggressively. PID gain reduced slightly to dampen response without compromising surge protection.', source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: null, status: 'confirmed' },
    consequence: { text: 'Valve cycling within acceptable limits. No surge event. Cycle count returned to normal after PID adjustment.', source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: null, status: 'confirmed' },
    recommendation: { text: 'Monitor cycle count for one week to confirm PID tuning is stable. Consider surge margin trending if cycling recurs.', source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: null, status: 'confirmed' },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: [],
  },

  // T-401: Inlet Air Filter DP Alert (1 month ago) -- closed
  {
    id: 'EVT-T401-H2',
    name: 'Inlet Air Filter DP Elevated',
    date: '1 month ago',
    severity: 'low',
    eventType: 'alert',
    asset: 'Turbine T-401',
    assetId: 'T-401',
    subAsset: 'Inlet Air System',
    subAssetId: 'T-401-AIR',
    event: 'Inlet air filter DP at 1.0 kPa (alarm 1.2 kPa). Filter replaced on schedule.',
    status: 'closed',
    incidentId: null,
    relationships: [],
    cause: { text: 'Normal filter loading from dust accumulation. DP approaching alarm threshold triggered replacement per PM schedule.', source: 'system', confidence: null, updatedBy: 'Auto-detection', updatedAt: null, status: 'confirmed' },
    consequence: { text: 'No performance impact. Filter replaced before DP reached alarm. Inlet conditions returned to normal.', source: 'human', confidence: null, updatedBy: 'Mike Torres', updatedAt: null, status: 'confirmed' },
    recommendation: { text: 'Filter replaced. DP returned to 0.6 kPa. Normal PM cycle.', source: 'human', confidence: null, updatedBy: 'Mike Torres', updatedAt: null, status: 'confirmed' },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: [],
  },

  // K-101: Oil Sample Routine (3 weeks ago) -- closed
  {
    id: 'EVT-K101-H5',
    name: 'Oil Sample Marginal Results',
    date: '3 weeks ago',
    severity: 'medium',
    eventType: 'inspection',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Lube Oil System',
    subAssetId: 'K-101-LOS',
    event: 'Quarterly oil sample: particle count 18/16/13 ISO 4406. Marginal but within limits.',
    status: 'closed',
    incidentId: null,
    relationships: [],
    cause: {
      text: 'Quarterly oil analysis per PM schedule. Particle count 18/16/13 per ISO 4406 (>4 micron / >6 micron / >14 micron). The OEM acceptable limit is 19/17/14. These results are at the 90th percentile of the acceptable range -- technically passing but barely. Filter differential pressure at the time: 0.5 bar (alarm 0.8 bar). The filter appeared to be functioning, but the elevated particle count suggests the bypass valve was beginning to crack open intermittently under pressure spikes. When a filter starts bypassing, particle count rises gradually because most flow still goes through the filter -- only brief surges go around it. The steady-state DP reading misses these transient bypass events entirely.',
      source: 'human', confidence: null, updatedBy: 'Fred Martinez', updatedAt: null, status: 'confirmed',
    },
    consequence: {
      text: 'Oil sample closed as acceptable because it fell within OEM specification. The results were filed and the next sample was scheduled for the standard quarterly interval -- three months away. In hindsight, this was the clearest early warning signal in the entire failure chain. The particle count had risen from 15/13/11 the previous quarter to 18/16/13 -- a 20% increase across all size categories. Combined with the vibration baseline increase (2.8 mm/s, up 33% from previous quarter), a correlation analysis would have revealed concurrent degradation in two independent parameters pointing to the same root cause: oil contamination driving bearing wear. Neither parameter crossed its individual alarm threshold, but together they told an unmistakable story.',
      source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: '7:00 AM', status: 'confirmed',
    },
    recommendation: {
      text: 'Investigation IN-0897 is reviewing alarm threshold adequacy. One finding: the OEM particle count specification (19/17/14 ISO 4406) was set for general centrifugal compressor service, not specifically for journal bearing applications where oil cleanliness is critical to bearing life. For journal bearings operating at the clearances and speeds in K-101, industry best practice suggests a tighter limit of 16/14/11. The marginal 18/16/13 result would have exceeded this tighter threshold and triggered a filter inspection that would have found the intermittent bypass. Recommendation: adopt bearing-specific oil cleanliness standards for all Criticality A rotating equipment.',
      source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: '7:00 AM', status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: [],
  },

  // C-201: Belt Tension Low (3 weeks ago) -- in-progress
  {
    id: 'EVT-C201-H1',
    name: 'Belt Tension Low',
    date: '3 weeks ago',
    severity: 'low',
    eventType: 'alert',
    asset: 'Cooler C-201',
    assetId: 'C-201',
    subAsset: 'Fan Assembly',
    subAssetId: 'C-201-FAN',
    event: 'Fan belt tension measured at 88% during routine check. Below optimal but above 75% alarm.',
    status: 'in-progress',
    incidentId: null,
    relationships: [
      { type: 'related_to', eventId: 'EVT-C201-H2' },
    ],
    cause: {
      text: 'V-belt tension measured at 88% of nominal during routine PM check. Industrial V-belts lose tension at 0.5-1.5% per week under continuous duty from elastomer fatigue and cord stretch. C-201 runs 24/7 at approximately 12.4 amps motor load (83% of 15A rated capacity), which is moderate duty. The belt has been in service for 8 months -- within the typical 12-month replacement interval for this cooler, but tension decline is tracking toward the upper end of the expected wear rate. At the measured 88%, the belt still transmits full torque without gross slippage, but the safety margin against transient loads (sudden wind gusts on the air fin, pressure transients in the process piping) is reduced. The 75% alarm threshold represents the point where belt slip becomes likely under normal operating conditions.',
      source: 'human', confidence: null, updatedBy: 'Fred Martinez', updatedAt: null, status: 'confirmed',
    },
    consequence: {
      text: 'Belt replacement added to the maintenance backlog as a scheduled item (WO-4498). Not prioritized because: belt is still functional, the cooler has no standby unit, and the replacement requires a 2-hour fan shutdown which means temporarily losing interstage cooling for K-101. With K-101 running normally, a brief cooling interruption is manageable but requires coordination with operations. The maintenance team had three higher-priority items in the queue. In retrospect, this deferred maintenance decision created the vulnerability that the K-101 trip transient exploited three weeks later. When the trip sent a pressure pulse through interstage piping, the belt at 82% tension (having declined further from 88%) was unable to maintain its sheave position under the momentary shock load. A belt at 95%+ tension would have ridden through the transient without displacement.',
      source: 'human', confidence: null, updatedBy: 'Fred Martinez', updatedAt: null, status: 'confirmed',
    },
    recommendation: {
      text: 'Schedule belt replacement within the next PM window. Coordinate a 2-hour fan shutdown with operations during a period of low cooling demand (overnight or when ambient temperature is below 20C). While the belt is off, inspect sheave alignment and groove wear -- both contribute to accelerated belt degradation if out of spec. Standard replacement is a single V-belt, but consider upgrading to a banded belt if sheave condition permits. Banded belts have 30-40% longer service life and better transient load resistance.',
      source: 'human', confidence: null, updatedBy: 'Fred Martinez', updatedAt: null, status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: ['WO-4498'],
    investigationIds: [],
  },

  // P-203: Alignment Drift Detected (3 weeks ago) -- in-progress
  {
    id: 'EVT-P203-H3',
    name: 'Alignment Drift Detected',
    date: '3 weeks ago',
    severity: 'low',
    eventType: 'anomaly',
    asset: 'Pump P-203',
    assetId: 'P-203',
    subAsset: 'Coupling',
    subAssetId: 'P-203-CPL',
    event: 'Coupling alignment at 0.09 mm, trending toward 0.15 mm alarm. Correlated with seal failures.',
    status: 'in-progress',
    incidentId: null,
    relationships: [
      { type: 'related_to', eventId: 'EVT-P203-H1' },
      { type: 'related_to', eventId: 'EVT-P203-H2' },
    ],
    cause: {
      text: 'Coupling alignment measured at 0.09 mm offset during investigation IN-0894. The 0.15 mm alarm threshold is per ISO 10816 for this pump class. Alignment has been drifting since the second seal replacement two months ago, when the pump was reassembled without a post-installation alignment check. The recurring failure engine correlated three data streams: two identical seal failures (EVT-P203-H1, H2) at 6-8 week intervals, coupling offset trending upward at approximately 0.01 mm per month, and seal face temperature rising in sync with alignment drift. The correlation confidence is 82% -- high enough to warrant action but below the auto-escalation threshold. The shaft is running slightly eccentric due to the misalignment, which creates an uneven load distribution across the mechanical seal face. The loaded side wears 3-4x faster than the unloaded side, explaining why each replacement seal fails in the same pattern after the same interval.',
      source: 'model', confidence: 82, updatedBy: 'Recurring Failure Engine', updatedAt: null, status: 'under-review',
    },
    consequence: {
      text: 'At the current drift rate (0.01 mm/month), alignment will reach the 0.15 mm alarm threshold in approximately 6 months. But the seal will fail again in 4-6 weeks regardless, because the existing misalignment at 0.09 mm is already sufficient to cause uneven seal face wear. The fourth seal replacement without alignment correction will cost another $8,000 in parts and 6 hours of downtime, and will fail again on the same timeline. More critically, if alignment drifts past 0.12 mm, the eccentric shaft loading will begin affecting the drive end bearing. At that point, the failure mode shifts from seal wear (expensive but contained) to bearing damage (more expensive, longer outage, risk of shaft scoring). This is the same category of progressive degradation that destroyed K-101 -- the difference is that P-203 failure mode is slower and the consequences are less severe because a spare pump is available.',
      source: 'model', confidence: 82, updatedBy: 'Recurring Failure Engine', updatedAt: null, status: 'under-review',
    },
    recommendation: {
      text: 'Do not replace the seal without correcting alignment first. The alignment correction procedure: decouple motor from pump, install dial indicators on coupling hub faces, measure angular and offset misalignment at four positions (top, bottom, left, right), shim motor feet to bring offset below 0.05 mm and angular below 0.03 mm/100mm. Then measure shaft runout at the seal chamber to confirm the shaft is running true. If runout exceeds 0.025 mm, the shaft itself may be bent from the accumulated eccentric loading -- in that case, the pump needs to go to the shop. Estimated alignment correction time: 4 hours with the pump offline. This is the fix that should have been done after the second seal failure.',
      source: 'human', confidence: null, updatedBy: 'Sarah Chen', updatedAt: null, status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: ['IN-0894'],
  },

  // E-105: Tube Leak Alert (3 weeks ago) -- false-positive
  // Severity override: matrix yields 'low' (alert x B), escalated to 'high' -- potential tube leak on HX is a safety concern requiring immediate response
  {
    id: 'EVT-E105-H2',
    name: 'Tube Leak Alert',
    date: '3 weeks ago',
    severity: 'high',
    eventType: 'alert',
    asset: 'Heat Exchanger E-105',
    assetId: 'E-105',
    subAsset: 'Tube Bundle (Shell Side)',
    subAssetId: 'E-105-TUB-S',
    event: 'Hydrocarbon trace detected in shell-side sample. Lab retest confirmed sample contamination, not a tube leak.',
    status: 'false-positive',
    incidentId: null,
    relationships: [],
    cause: { text: 'Initial sample showed hydrocarbon traces on the shell side, suggesting a tube-to-shell leak. Rush lab retest with fresh sample found no hydrocarbons. Original sample was contaminated during collection (sampler was previously used on process side without adequate flushing).', source: 'human', confidence: null, updatedBy: 'Sarah Chen', updatedAt: null, status: 'confirmed' },
    consequence: { text: 'No tube leak. False alarm from contaminated sample. Sampling procedure reviewed.', source: 'human', confidence: null, updatedBy: 'Sarah Chen', updatedAt: null, status: 'confirmed' },
    recommendation: { text: 'Update sampling SOP to require dedicated samplers per service or triple-flush between uses.', source: 'human', confidence: null, updatedBy: 'Sarah Chen', updatedAt: null, status: 'confirmed' },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: [],
  },

  // K-101: Filter DP Elevated (2 weeks ago) -- closed
  {
    id: 'EVT-K101-H6',
    name: 'Filter DP Elevated',
    date: '2 weeks ago',
    severity: 'medium',
    eventType: 'alert',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Lube Oil System',
    subAssetId: 'K-101-LOS',
    event: 'Filter differential pressure at 0.6 bar, trending up. Alarm at 0.8 bar. No action taken.',
    status: 'closed',
    incidentId: null,
    relationships: [],
    cause: {
      text: 'Filter differential pressure at 0.6 bar, up from 0.5 bar one week prior. The OEM alarm threshold is 0.8 bar, based on the pressure at which the filter bypass valve is designed to open fully. But the bypass valve does not operate as a binary switch -- it begins cracking open at approximately 60-70% of its rated setpoint. At 0.6 bar DP, the valve was already allowing intermittent surges of unfiltered oil past the element during pressure transients in the lube oil circuit. The steady-state DP reading of 0.6 bar looked safe, but the transient peaks were reaching 0.7-0.75 bar, enough to push the bypass valve open for fractions of a second each cycle. This is why the oil sample showed elevated particles despite the filter DP being below alarm.',
      source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: '7:00 AM', status: 'confirmed',
    },
    consequence: {
      text: 'No action taken because the reading was below the 0.8 bar alarm threshold. The operator checked the DP, saw 0.6 bar, and logged it as normal. This is the third missed signal in the K-101 failure chain: vibration trending up (6 weeks ago, closed as normal), oil sample marginal (3 weeks ago, closed as acceptable), and now filter DP elevated (2 weeks ago, closed as below alarm). Each signal was evaluated in isolation against its own threshold. None crossed. But together, they describe a single failure narrative that was already two weeks old: filter bypassing, oil contaminated, bearing surfaces degrading. The alarm system was designed to catch individual parameter exceedances, not multi-parameter degradation patterns. This is the systemic gap.',
      source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: '7:00 AM', status: 'confirmed',
    },
    recommendation: {
      text: 'Investigation IN-0897 primary finding: the 0.8 bar filter DP alarm threshold is based on the bypass valve nameplate rating and does not account for transient bypass behavior below the rated setpoint. Recommendation: lower the filter DP alarm to 0.5 bar for all critical compressors with journal bearings. Additionally, implement cross-parameter correlation rules: if filter DP exceeds 0.5 bar AND the most recent oil sample shows particle count above the 75th percentile of historical readings, auto-generate an investigation request regardless of whether either parameter has crossed its individual alarm threshold. This rule would have caught the K-101 failure chain at least two weeks before the trip.',
      source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: '7:00 AM', status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: ['IN-0897'],
  },

  // P-203: Seal Chamber Pressure Elevated (2 weeks ago) -- in-progress
  {
    id: 'EVT-P203-H4',
    name: 'Seal Chamber Pressure Elevated',
    date: '2 weeks ago',
    severity: 'low',
    eventType: 'alert',
    asset: 'Pump P-203',
    assetId: 'P-203',
    subAsset: 'Mechanical Seal (Discharge)',
    subAssetId: 'P-203-SEAL',
    event: 'Seal chamber pressure trending up to 7.8 bar (alarm 7.5 bar). Correlates with seal degradation.',
    status: 'in-progress',
    incidentId: null,
    relationships: [
      { type: 'related_to', eventId: 'EVT-P203-H3' },
    ],
    cause: {
      text: 'Seal chamber pressure at 7.8 bar, above the 7.5 bar alarm threshold and climbing. The mechanical seal on P-203 is a single cartridge design with pressurized buffer fluid in the seal chamber. As the seal faces wear from eccentric shaft loading (alignment drift at 0.09 mm, EVT-P203-H3), the gap between the rotating and stationary seal faces widens asymmetrically. Buffer fluid leaks through the widening gap into the process side, and the seal chamber pressure rises as the buffer fluid system works harder to maintain the pressure differential. The seal leakage rate has increased from 2.0 L/hr (alarm threshold) two weeks ago to 4.2 L/hr today. Seal face temperature is at 78C, approaching the 85C alarm where thermal damage to the carbon face accelerates the failure.',
      source: 'model', confidence: 82, updatedBy: 'Recurring Failure Engine', updatedAt: null, status: 'under-review',
    },
    consequence: {
      text: 'The seal is in active failure. Chamber pressure above alarm confirms the seal faces can no longer maintain adequate separation. At the current degradation rate, the seal will reach the shutdown threshold (chamber pressure 9.0 bar or leakage rate 8.0 L/hr) in approximately 2-3 weeks. This matches the timeline of the previous two failures: 6-8 weeks from new seal to failure, with the last 2-3 weeks showing accelerating chamber pressure and leakage. The third failure will cost the same as the first two ($8,000 parts, 6 hours downtime) unless the alignment root cause is addressed simultaneously. Without alignment correction, ordering a fourth seal is ordering a fourth failure.',
      source: 'model', confidence: 82, updatedBy: 'Recurring Failure Engine', updatedAt: null, status: 'under-review',
    },
    recommendation: {
      text: 'Monitor seal chamber pressure and leakage rate daily. The seal can continue operating safely until chamber pressure reaches 9.0 bar or leakage exceeds 8.0 L/hr -- roughly 2-3 weeks. Use this window to schedule a combined seal replacement and alignment correction (WO-4483 scope should be expanded to include alignment per IN-0894 findings). Do not wait for the seal to fail catastrophically, which risks process fluid release and a longer outage. Have the spare pump warmed up and ready to take over duty before starting the work.',
      source: 'human', confidence: null, updatedBy: 'Sarah Chen', updatedAt: null, status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: ['WO-4483'],
    investigationIds: ['IN-0894'],
  },

  // K-302: Anti-Surge Valve Hunting Alert (10 days ago) -- false-positive
  {
    id: 'EVT-K302-H3',
    name: 'Anti-Surge Valve Hunting',
    date: '10 days ago',
    severity: 'medium',
    eventType: 'alert',
    asset: 'Compressor K-302',
    assetId: 'K-302',
    subAsset: 'Anti-Surge Valve',
    subAssetId: 'K-302-ASV',
    event: 'Control room reported anti-surge valve hunting. Stroke test ordered (WO-4494). Valve later confirmed healthy.',
    status: 'false-positive',
    incidentId: null,
    relationships: [
      { type: 'related_to', eventId: 'EVT-001' },
    ],
    cause: { text: 'Control room misdiagnosed discharge temperature oscillation as anti-surge valve hunting. WO-4494 opened to stroke-test the valve. Valve is responding correctly to the oscillation, not causing it. Root cause is impeller fouling (EVT-001). This event reclassified as false positive after IN-0893 investigation.', source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: '6:30 AM', status: 'confirmed' },
    consequence: { text: 'No valve issue. Unnecessary WO opened. Diagnostic time wasted on wrong component.', source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: '6:30 AM', status: 'confirmed' },
    recommendation: { text: 'Cancel valve stroke test WO-4494 or repurpose as verification only. Focus on impeller fouling as root cause.', source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: '6:30 AM', status: 'confirmed' },
    kpiImpact: null,
    workOrderIds: ['WO-4494'],
    investigationIds: ['IN-0893'],
  },

  // E-105: Accelerated Fouling Detected (1 week ago) -- new
  {
    id: 'EVT-E105-H1',
    name: 'Accelerated Fouling Detected',
    date: '1 week ago',
    severity: 'low',
    eventType: 'anomaly',
    asset: 'Heat Exchanger E-105',
    assetId: 'E-105',
    subAsset: 'Tube Bundle (Process Side)',
    subAssetId: 'E-105-TUB-P',
    event: 'Fouling rate 2x faster than model predicted. Feed outlet temp 6C below expected.',
    status: 'new',
    incidentId: null,
    relationships: [],
    cause: {
      text: 'The fouling prediction engine flagged a 2x acceleration in tube-side fouling rate compared to the calibrated model. The model was built on 18 months of data from the previous crude slate (light sweet crude, approximately 0.5% asphaltenic content). Two months ago, the refinery shifted to a heavier crude (approximately 2-3% asphaltenic content). Heavier aromatic molecules in the feed have lower solubility at the elevated temperatures inside E-105 (feed inlet at 378C). As the feed heats up passing through the tubes, asphaltene precursors precipitate out of solution and deposit on tube surfaces. This is a SARA-kinetics-driven process: the precipitation rate increases exponentially with temperature and asphaltene concentration. Current fouling factor: 0.00045 m2K/W, up from 0.0001 at the last cleaning. The model predicted reaching 0.00045 at month 8; it happened at month 4. Investigation IN-0896 is checking whether a tube leak is contributing to the accelerated rate, or if the crude slate change alone explains it.',
      source: 'model', confidence: 71, updatedBy: 'Fouling Prediction Engine', updatedAt: null, status: 'under-review',
    },
    consequence: {
      text: 'Feed outlet temperature at 142C versus 148C design -- a 6C shortfall that the downstream fired heater is compensating for by burning additional fuel gas. The extra fuel cost is approximately $2,000-3,000 per day. More importantly, the fouling factor is at 75% of the 0.0006 alarm threshold. At the current acceleration rate (0.0000375 m2K/W per week), the alarm threshold will be reached in approximately 4 weeks. Below alarm, the exchanger cannot maintain minimum heat duty and must be taken offline for cleaning. A cleaning outage requires 5-7 days: depressure, cool down, open channel head, hydroblast tubes, inspect for tube wall thinning, close and pressure test. Process-side pressure drop is also climbing (0.6 bar versus 0.8 alarm), which confirms the fouling is physical deposition, not just thermal resistance. Shell-side conditions remain normal (outlet temp 88C, DP 0.3 bar), which argues against a tube leak.',
      source: 'model', confidence: 71, updatedBy: 'Fouling Prediction Engine', updatedAt: null, status: 'under-review',
    },
    recommendation: {
      text: 'Await lab results from IN-0896. The diagnostic test: shell-side sample analysis for hydrocarbon traces (chloride marker). If chlorides are detected on the shell side, a tube-to-shell leak is confirmed and the outage becomes urgent (leak worsens under thermal cycling). If no chlorides, the fouling is purely from the crude slate change and the outage can be planned on a 4-week timeline. Either way, the fouling model needs recalibration for the heavier crude. Update the SARA composition inputs and rerun the precipitation kinetics to get an accurate fouling rate forecast. Schedule the cleaning outage for the next available window -- ideally coordinated with a planned FCC or hydrocracker outage to minimize standalone downtime. Review whether anti-foulant injection (chemical treatment) could slow the deposition rate enough to extend the run length on heavier crude.',
      source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: null, status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: ['WO-4487'],
    investigationIds: ['IN-0896'],
  },

  // T-102: Exhaust Temperature Spread Widening (1 week ago) -- new
  {
    id: 'EVT-T102-H1',
    name: 'Exhaust Temperature Spread Widening',
    date: '1 week ago',
    severity: 'low',
    eventType: 'anomaly',
    asset: 'Turbine T-102',
    assetId: 'T-102',
    subAsset: 'Combustion Section',
    subAssetId: 'T-102-CMB',
    event: 'Exhaust temp spread widened from 12C to 22C over three weeks. Alarm at 30C. Nozzles 3 and 7 suspect.',
    status: 'new',
    incidentId: null,
    relationships: [],
    cause: {
      text: 'Exhaust temperature spread has widened from 12C to 22C over three weeks (0.48C per day increase). The pattern recognition engine identified fuel nozzles 3 and 7 as the probable cause with 76% confidence. Both nozzles show flow rates at 82% of nominal versus 100-103% for the other six. In FCC power recovery turbines, coke deposits form when heavy hydrocarbon carryover from the FCC regenerator condenses on cooler nozzle surfaces during load changes or startup transients. Nozzles 3 and 7 are on the same combustor quadrant, which suggests a localized flow pattern in the fuel manifold may be directing heavier fractions preferentially to these positions. The coked nozzles run lean (less fuel, cooler exhaust), while the six clean nozzles compensate rich through the fuel control system (more fuel, hotter exhaust). The 22C spread represents the temperature difference between the hottest clean nozzle exhaust and the coolest coked nozzle exhaust.',
      source: 'model', confidence: 76, updatedBy: 'Pattern Recognition Engine', updatedAt: null, status: 'under-review',
    },
    consequence: {
      text: 'At the current widening rate (0.48C/day), the 30C alarm threshold will be reached in approximately 17 days. The 30C spread alarm triggers an automatic derate to 70% load to protect the hot gas path components -- the clean nozzles are running hotter than design to compensate for the coked ones, and sustained hot spots accelerate thermal barrier coating degradation on the first-stage nozzle guide vanes. If the spread reaches 35C, the turbine trips automatically. A forced outage on T-102 loses 12.6 MW of power recovery from FCC flue gas and requires the plant to purchase replacement power from the grid. The parallel to K-101 is deliberate: K-101 had signals for three days and nobody acted. T-102 has had signals for three weeks. The degradation is slower and the consequences less dramatic, but the question is the same -- will the team intervene proactively, or wait for the alarm?',
      source: 'model', confidence: 76, updatedBy: 'Pattern Recognition Engine', updatedAt: null, status: 'under-review',
    },
    recommendation: {
      text: 'Two options. Proactive: schedule a nozzle cleaning outage within the next 10 days, before the spread reaches 27C (conservative margin below the 30C alarm). This requires a 36-48 hour shutdown, removal and cleaning of all 8 nozzles (clean the healthy ones too as preventive maintenance), and a borescope inspection of the combustion liner and transition pieces (WO-4488) to rule out liner degradation as a contributing factor. Reactive: continue monitoring and let the alarm derate the turbine at 30C, then plan the outage from the derated state. The proactive option costs the same outage time but avoids the derate, avoids potential coating damage from sustained hot spots, and gives the maintenance team control over the schedule. Given the K-101 crisis, the team must decide whether maintenance resources can support a T-102 outage simultaneously with K-101 emergency repairs.',
      source: 'human', confidence: null, updatedBy: 'Mike Torres', updatedAt: null, status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: ['WO-4488', 'WO-4495'],
    investigationIds: ['IN-0895'],
  },

  // C-201: Belt Tension Declining (1 week ago) -- new
  {
    id: 'EVT-C201-H2',
    name: 'Belt Tension Declining',
    date: '1 week ago',
    severity: 'low',
    eventType: 'anomaly',
    asset: 'Cooler C-201',
    assetId: 'C-201',
    subAsset: 'Fan Assembly',
    subAssetId: 'C-201-FAN',
    event: 'Belt tension declined to 85%. Rate suggests replacement needed within 2 weeks.',
    status: 'new',
    incidentId: null,
    relationships: [
      { type: 'related_to', eventId: 'EVT-C201-H1' },
    ],
    cause: {
      text: 'Belt tension declined from 88% to 85% over two weeks -- a 1.5% per week rate, at the upper end of normal wear but consistent with a belt in its 9th month of continuous service. The auto-detection system flagged the decline rate because the trend projects arrival at the 75% alarm threshold within 7 weeks. However, the more immediate concern is transient load vulnerability. At 85% tension, the belt can still transmit steady-state torque (motor running at 12.4A, 83% load), but the slip margin under transient loads (piping vibration, startup surges, upstream pressure events) is reduced to approximately 10% versus the 25% margin at nominal tension. An external shock that adds even 15% momentary load to the fan drive could cause the belt to skip on the sheave.',
      source: 'system', confidence: null, updatedBy: 'Auto-detection', updatedAt: null, status: 'confirmed',
    },
    consequence: {
      text: 'WO-4498 remains in the backlog, deprioritized against more urgent work. The belt will continue operating without slip under normal conditions for several more weeks. But the transient vulnerability window is now open. C-201 is directly connected to K-101 through interstage piping -- any compressor event that sends a pressure pulse through that piping will stress the fan drive. The probability of such an event is low on any given day, but K-101 was already showing vibration alerts (EVT-K101-H1, H2) at the time this belt measurement was taken. If someone had connected the two facts -- K-101 bearing degradation progressing and C-201 belt tension declining -- they might have prioritized the belt replacement before the compressor situation escalated. Instead, the K-101 trip one week later sent exactly the kind of transient that the marginal belt could not handle.',
      source: 'system', confidence: null, updatedBy: 'Auto-detection', updatedAt: null, status: 'confirmed',
    },
    recommendation: {
      text: 'Escalate WO-4498 priority from scheduled to urgent. The declining rate (1.5%/week) is faster than the previous 6 months of service history, which suggests the belt may be approaching end-of-life elasticity rather than normal wear. Order replacement belt immediately and schedule the 2-hour fan shutdown within the next 5 days. If the belt reaches 80% before replacement, restrict operations that could cause interstage pressure transients (compressor startups, process upsets on connected units).',
      source: 'human', confidence: null, updatedBy: 'Fred Martinez', updatedAt: null, status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: ['WO-4498'],
    investigationIds: [],
  },

  // P-203: Bearing Temperature Trend (1 week ago) -- in-progress
  {
    id: 'EVT-P203-H5',
    name: 'Bearing Temperature Trending Up',
    date: '1 week ago',
    severity: 'low',
    eventType: 'anomaly',
    asset: 'Pump P-203',
    assetId: 'P-203',
    subAsset: 'Drive End Bearing',
    subAssetId: 'P-203-DE',
    event: 'DE bearing temperature 58C, up from 52C baseline. Within limits but trending.',
    status: 'in-progress',
    incidentId: null,
    relationships: [
      { type: 'related_to', eventId: 'EVT-P203-H3' },
    ],
    cause: {
      text: 'Drive end bearing temperature at 58C, up from a 52C baseline established over the previous 12 months. The 6C increase over 3-4 weeks correlates with the coupling alignment drift timeline (EVT-P203-H3). The trend analysis engine flagged this with 65% confidence because the temperature-alignment correlation is suggestive but not conclusive -- bearing temperature can rise from other causes (ambient temperature changes, oil viscosity, load variations). However, the P-203 ambient conditions and process load have been stable, which strengthens the alignment hypothesis. Mechanically, misalignment changes the load vector on the bearing journal. The loaded zone shifts from its design position, concentrating the oil film pressure on a smaller arc of the bearing surface. This increases local friction and heat generation even though the overall load has not changed.',
      source: 'model', confidence: 65, updatedBy: 'Trend Analysis Engine', updatedAt: null, status: 'under-review',
    },
    consequence: {
      text: 'No immediate risk to the bearing -- 58C is only 68% of the 85C alarm threshold and bearing oil film is still well-established at this temperature. But this is the leading indicator that the alignment problem (currently manifesting as seal wear) is beginning to affect the bearing. The P-203 failure progression from alignment drift follows a predictable sequence: seal wear first (already happening, third failure approaching), then bearing temperature rise (this event), then bearing vibration increase (not yet), then bearing damage (months away if alignment stays at 0.09 mm, weeks away if alignment reaches 0.15 mm). This is exactly the K-101 pattern in slow motion -- a multi-parameter degradation where each parameter looks acceptable in isolation but the combined trend tells a clear story.',
      source: 'model', confidence: 65, updatedBy: 'Trend Analysis Engine', updatedAt: null, status: 'under-review',
    },
    recommendation: {
      text: 'Add bearing temperature to the daily monitoring checklist alongside seal chamber pressure and leakage rate. If bearing temperature exceeds 65C or increases more than 2C in any week, escalate the alignment correction from scheduled to urgent. The fact that bearing temperature is now correlated with alignment drift adds weight to the IN-0894 recommendation: do not replace the seal without correcting alignment first. The bearing temperature trend is the clearest evidence that the alignment problem is propagating beyond the seal to the bearing system. Address it now while the correction is a 4-hour alignment job, not a bearing replacement.',
      source: 'human', confidence: null, updatedBy: 'Sarah Chen', updatedAt: null, status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: ['IN-0894'],
  },

  // K-302: Discharge Temp Rate-of-Change (2 days ago) -- in-progress
  {
    id: 'EVT-K302-H1',
    name: 'Discharge Temp Rate-of-Change',
    date: '2 days ago',
    severity: 'medium',
    eventType: 'anomaly',
    asset: 'Compressor K-302',
    assetId: 'K-302',
    subAsset: 'First-Stage Impeller',
    subAssetId: 'K-302-IMP1',
    event: 'Discharge temperature swing exceeded rate-of-change threshold. First occurrence of oscillation pattern.',
    status: 'in-progress',
    incidentId: null,
    relationships: [
      { type: 'related_to', eventId: 'EVT-001' },
    ],
    cause: {
      text: 'Discharge temperature swung 8C in a 45-minute cycle, exceeding the 5C/hour rate-of-change threshold configured for K-302 first stage. The oscillation pattern is distinctive: temperature rises 4C over 30 minutes as fouled impeller blades restrict flow and increase compression work, then drops 4C over 15 minutes as a section of polymer buildup breaks off and flow briefly improves. The cycle repeats as new deposits form on the freshly cleaned blade surfaces. This sawtooth pattern is characteristic of polymer fouling on wet gas compressors processing FCC overhead gas. The initial diagnosis from the control room was anti-surge valve hunting -- a reasonable assumption since the valve position was oscillating in response. Investigation IN-0893 opened to determine the true root cause.',
      source: 'system', confidence: null, updatedBy: 'Auto-detection', updatedAt: null, status: 'confirmed',
    },
    consequence: {
      text: 'First occurrence of the oscillation pattern that will repeat continuously over the following days. At this point, polytropic efficiency is approximately 73% (design 76%), indicating light-to-moderate fouling on the first-stage impeller blades. The compressor can continue operating safely -- the oscillation does not approach surge -- but efficiency is declining. Each cycle of deposit-and-shed leaves slightly more residual polymer on the blades, meaning the average fouling level is ratcheting upward even though the peaks and troughs appear stable. The control room misdiagnosis (valve hunting) led to WO-4494 being opened for a stroke test on the anti-surge valve, which diverted maintenance attention from the real problem.',
      source: 'system', confidence: null, updatedBy: 'Auto-detection', updatedAt: null, status: 'confirmed',
    },
    recommendation: {
      text: 'The key diagnostic: compare suction and discharge conditions. If the anti-surge valve were hunting, both suction and discharge would oscillate as the control loop rings. If the oscillation is internal to the compressor (fouling, rotor imbalance), suction conditions remain stable while discharge oscillates. Pull 24 hours of suction pressure trend data and overlay with discharge temperature. If suction is flat, the valve is not the problem -- cancel the stroke test and focus on impeller condition. Check polytropic efficiency calculation against design curves to estimate fouling severity.',
      source: 'system', confidence: null, updatedBy: 'Auto-detection', updatedAt: null, status: 'auto-generated',
    },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: ['IN-0893'],
  },

  // K-101: Vibration Alert #1 (3 days ago) -- in-progress
  // Severity override: matrix yields 'medium' (alert x A), escalated to 'high' -- first of three consecutive alerts in cascading bearing failure, no intervention taken
  {
    id: 'EVT-K101-H1',
    name: 'Vibration Alert',
    date: '3 days ago',
    severity: 'high',
    eventType: 'alert',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Drive End Bearing',
    subAssetId: 'K-101-DE',
    event: 'Drive end bearing vibration at 5.1 mm/s, approaching 7.1 alarm threshold. No intervention taken.',
    status: 'in-progress',
    incidentId: 'INC-001',
    relationships: [
      { type: 'related_to', eventId: 'EVT-K101-H2' },
    ],
    cause: {
      text: 'Drive end bearing vibration at 5.1 mm/s, up from 2.8 mm/s at the quarterly baseline six weeks ago. The acceleration is consistent with progressive journal bearing surface degradation from contaminated lubrication. ISO 10816 Zone B/C boundary for this machine class is 4.5 mm/s -- the bearing has crossed into Zone C (restricted long-term operation). Oil sample two weeks prior showed particle count at 18/16/13 ISO 4406, marginal but within spec. Nobody correlated the rising vibration with the marginal oil results. The alert was auto-generated by the condition monitoring system and appeared in the control room event feed, but no work order was created and no operator acknowledged it beyond clearing the notification.',
      source: 'system', confidence: null, updatedBy: 'Auto-detection', updatedAt: null, status: 'confirmed',
    },
    consequence: {
      text: 'First vibration alert in what becomes a 3-day escalation window before the trip. At 5.1 mm/s, the compressor can still run safely but the trend demands investigation. The daily vibration increase from baseline (2.8 to 5.1 mm/s over 11 days) suggests bearing clearances are opening as journal surfaces erode. If someone had plotted the vibration trend against the oil sample timeline, the connection would have been obvious: contaminated oil is destroying the bearing. Instead, the alert sat in the event feed alongside dozens of routine notifications. This is the organizational failure that investigation IN-0891 is focused on -- not a sensor failure or a threshold problem, but an alert that was seen and ignored.',
      source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: '7:00 AM', status: 'confirmed',
    },
    recommendation: {
      text: 'At 5.1 mm/s and trending, the correct response was: pull the vibration trend for the last 30 days, compare against oil analysis results, and check lube oil filter differential pressure. All three data points were available in the system. Together they would have shown the failure narrative: filter bypassing, oil contaminated, bearing degrading. A planned shutdown at this point would have cost 8 hours. The unplanned trip 3 days later cost 5+ hours of downtime, emergency work orders, two investigations, and downstream cascade events on V-501 and C-201.',
      source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: '7:00 AM', status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: ['IN-0891'],
  },

  // K-101: Vibration Alert #2 (2 days ago) -- in-progress
  // Severity override: matrix yields 'medium' (alert x A), escalated to 'high' -- second consecutive alert, bearing in rapid degradation phase
  {
    id: 'EVT-K101-H2',
    name: 'Vibration Alert',
    date: '2 days ago',
    severity: 'high',
    eventType: 'alert',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Drive End Bearing',
    subAssetId: 'K-101-DE',
    event: 'Drive end bearing vibration at 5.8 mm/s. Second consecutive alert. No response.',
    status: 'in-progress',
    incidentId: 'INC-001',
    relationships: [
      { type: 'caused_by', eventId: 'EVT-K101-H1' },
      { type: 'related_to', eventId: 'EVT-K101-H3' },
    ],
    cause: {
      text: 'Vibration climbed from 5.1 mm/s to 5.8 mm/s in 24 hours -- a 14% daily increase. The acceleration rate is nonlinear, consistent with bearing surface damage entering the rapid progression phase. As babbitt material erodes from the loaded zone, bearing clearances widen asymmetrically. The shaft begins running eccentric, which increases the dynamic load on the already damaged surface, which accelerates the erosion. This is the feedback loop that turns a slow degradation into a fast failure. Oil film thickness on the drive end bearing is estimated at 22-24 microns at this point (alarm at 25 microns). The bearing temperature has risen to approximately 95C, right at the alarm threshold, but the temperature alarm did not fire because the bearing had not yet crossed the sustained duration requirement.',
      source: 'system', confidence: null, updatedBy: 'Auto-detection', updatedAt: null, status: 'confirmed',
    },
    consequence: {
      text: 'Second consecutive vibration alert with no operator response. The compressor is now deep in ISO 10816 Zone C -- continued operation is acceptable only for limited periods. At the current acceleration rate (0.7 mm/s per day), vibration will reach the 7.1 mm/s trip threshold in approximately 48 hours. The window for a planned shutdown is closing. A controlled shutdown from this point requires 2-3 hours of preparation: standby compressor warm-up, process unit notification, controlled unloading. An automatic trip happens in seconds with no preparation, causing pressure transients downstream. This alert was the last realistic opportunity to choose the orderly option. After this point, the race is between the maintenance response time and the bearing failure rate.',
      source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: '7:00 AM', status: 'confirmed',
    },
    recommendation: {
      text: 'Two consecutive daily vibration alerts on a Criticality A compressor bearing should have triggered an immediate engineering review. The minimum response: compare the vibration spectrum against the baseline to determine whether the increase is broadband (bearing damage) or narrowband (imbalance or misalignment). A broadband increase at this rate on a journal bearing points directly to surface degradation. The next step: check oil system health -- filter DP, oil sample, auxiliary pump status. If both vibration and oil system show degradation, the correct call is to begin a controlled shutdown within 12 hours while the standby compressor comes online. Every hour of delay past this point increases the risk of an uncontrolled trip.',
      source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: '7:00 AM', status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: ['IN-0891'],
  },

  // K-302: Discharge Temp Rate-of-Change #2 (1 day ago) -- in-progress (kept as second occurrence)
  // Note: This is the second occurrence of the oscillation pattern from K302-H1.
  // It is kept as a separate event because the rate-of-change threshold was exceeded again independently.

  // K-101: Vibration Alert #3 (1 day ago) -- in-progress
  // Severity override: matrix yields 'medium' (alert x A), escalated to 'high' -- third consecutive alert, trip imminent within hours
  {
    id: 'EVT-K101-H3',
    name: 'Vibration Alert',
    date: '1 day ago',
    severity: 'high',
    eventType: 'alert',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Drive End Bearing',
    subAssetId: 'K-101-DE',
    event: 'Drive end bearing vibration at 6.3 mm/s. Third alert in 3 days. No work order created.',
    status: 'in-progress',
    incidentId: 'INC-001',
    relationships: [
      { type: 'caused_by', eventId: 'EVT-K101-H2' },
      { type: 'cascaded_to', eventId: 'EVT-002' },
    ],
    cause: {
      text: 'Third consecutive daily vibration alert. 6.3 mm/s, 89% of the 7.1 mm/s trip threshold. The daily progression -- 5.1, 5.8, 6.3 -- shows the classic nonlinear acceleration of journal bearing degradation. Oil pressure has started declining as well, dropping from 1.8 bar to 1.6 bar over the same period as widening bearing clearances allow more oil to leak through. The lube oil auxiliary pump has not yet auto-started (that triggers at 1.2 bar), but the main pump is working harder to maintain pressure. Bearing temperature is now sustained above 95C alarm. The vibration spectrum shows dominant 1X and 2X components with broadband elevation from 800 Hz to 2 kHz -- textbook babbitt surface damage signature. All of this was visible in the condition monitoring system. None of it was acted on.',
      source: 'system', confidence: null, updatedBy: 'Auto-detection', updatedAt: null, status: 'confirmed',
    },
    consequence: {
      text: 'Three escalating alerts over three days with zero intervention. The compressor will trip within 14 hours. At this vibration level, the bearing has approximately 12-18 hours of remaining useful life before the shaft orbit exceeds the trip protection threshold. The oil pressure decline confirms that this is not just vibration -- the entire lubrication system is compromised. When the trip happens, it will not be a clean shutdown: the anti-surge valve will slam open, pressure transients will propagate to V-501 downstream, and any equipment with marginal mechanical condition in the connected piping network (like C-201 fan belt at 82% tension) will be stressed by the hydraulic shock. The cascade that follows this trip was preventable at every step of this 3-day window.',
      source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: '7:00 AM', status: 'confirmed',
    },
    recommendation: {
      text: 'This was the final opportunity for a controlled response. The correct action: declare an imminent equipment failure, begin controlled unloading of K-101 over 30 minutes, bring the standby compressor online, then shut K-101 down for bearing inspection. Total cost: 4-6 hours of planned downtime with no downstream impact. Instead, 14 hours later, the automatic trip caused 5+ hours of emergency downtime, pressure transients on V-501, mechanical damage to C-201 fan belt, two emergency work orders, and four investigations. Investigation IN-0891 is asking the question that matters: why did three consecutive alerts on a Criticality A machine generate no response? Was it alarm fatigue? Staffing? Unclear escalation procedures? The answer determines whether this happens again.',
      source: 'human', confidence: null, updatedBy: 'Carlos Mendez', updatedAt: '7:00 AM', status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: ['IN-0891'],
  },

  // K-302: Efficiency Approaching Alarm (today) -- new
  {
    id: 'EVT-K302-H4',
    name: 'Polytropic Efficiency Declining',
    time: '7:00 AM',
    severity: 'medium',
    eventType: 'anomaly',
    asset: 'Compressor K-302',
    assetId: 'K-302',
    subAsset: 'First-Stage Impeller',
    subAssetId: 'K-302-IMP1',
    event: 'First-stage polytropic efficiency at 71% (alarm 68%). Fouling confirmed by oscillation pattern.',
    status: 'new',
    incidentId: null,
    relationships: [
      { type: 'caused_by', eventId: 'EVT-001' },
    ],
    cause: {
      text: 'Polymer fouling on the first-stage impeller confirmed by the pattern recognition engine with 87% confidence. The correlation between discharge temperature oscillation (EVT-001, ongoing for 2 days) and declining polytropic efficiency establishes the diagnosis that the control room initially missed. Efficiency has dropped from 74% (baseline measured at last cleaning) to 71% over the past two weeks. The fouling rate is approximately 0.2% efficiency loss per day, which is consistent with FCC wet gas polymer deposition at the current feed composition. The anti-surge valve hunting misdiagnosis (EVT-K302-H3, reclassified as false positive) delayed the correct diagnosis by 10 days, during which the fouling progressed from light to moderate. Suction conditions remain stable at 4.8 bar, confirming the problem is internal to the compressor, not in the control system.',
      source: 'model', confidence: 87, updatedBy: 'Pattern Recognition Engine', updatedAt: '7:00 AM', status: 'under-review',
    },
    consequence: {
      text: 'At the current fouling rate (0.2%/day), efficiency will reach the 68% alarm threshold in 5-7 days. Below 68%, the compressor cannot maintain design discharge pressure, which means the FCC overhead gas recovery system loses capacity. The plant has two options: schedule a cleaning outage now (24-48 hours, planned) or wait for the alarm and face a forced outage (same duration but unplanned, with production scheduling disruptions). The K-101 crisis complicates the decision: with K-101 tripped and the standby compressor carrying hydrocracker duty, the plant cannot afford to lose K-302 simultaneously. K-302 serves the FCC unit, not the hydrocracker, so it is operationally independent of K-101 -- but maintenance resources are stretched thin by the K-101 emergency work orders. This is a resource allocation problem as much as a technical one.',
      source: 'model', confidence: 87, updatedBy: 'Pattern Recognition Engine', updatedAt: '7:00 AM', status: 'under-review',
    },
    recommendation: {
      text: 'Cancel the anti-surge valve stroke test (WO-4494) -- the valve is healthy and the diagnostic time is wasted. Evaluate two cleaning options: (1) online wash using solvent injection through the existing wash nozzles while the compressor runs at reduced load -- faster (4-6 hours) but less thorough, typically recovers 60-70% of lost efficiency; (2) offline cleaning during a planned shutdown -- takes 24-48 hours but fully restores efficiency and allows borescope inspection of blade condition. Given the K-101 crisis drawing maintenance resources, recommend the online wash as an interim measure to buy 3-4 additional weeks before the offline cleaning is needed. Schedule the offline cleaning for the next planned FCC turnaround window.',
      source: 'model', confidence: 87, updatedBy: 'Pattern Recognition Engine', updatedAt: '7:00 AM', status: 'auto-generated',
    },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: ['IN-0893'],
  },

  // T-401: Combustion Inspection Due (today) -- in-progress
  {
    id: 'EVT-T401-H1',
    name: 'Combustion Inspection Due',
    time: '6:00 AM',
    severity: 'low',
    eventType: 'alert',
    asset: 'Turbine T-401',
    assetId: 'T-401',
    subAsset: 'Combustion Section',
    subAssetId: 'T-401-CMB',
    event: '12,000-hour combustion inspection interval reached. Deferred pending morning huddle due to K-101 crisis.',
    status: 'in-progress',
    incidentId: null,
    relationships: [],
    cause: {
      text: 'T-401 reached the 12,000-hour combustion inspection interval per OEM maintenance schedule. This is a mandatory inspection that checks combustion liner condition, transition piece wear, fuel nozzle integrity, and hot gas path component coating thickness. The maintenance window was planned weeks in advance: contractors mobilized, combustion parts staged in the warehouse, scaffolding erected around the turbine enclosure. Previous inspections at 6,000 and 9,000 hours found minor thermal barrier coating wear on the first-stage nozzle guide vanes, within expected limits for natural gas firing. The turbine is currently healthy -- exhaust temperature spread at 18C (alarm 25C), all flame detectors active, vibration nominal at 4.2 mm/s (alarm 12 mm/s). There is no technical urgency to this inspection; it is preventive, not corrective.',
      source: 'human', confidence: null, updatedBy: 'Mike Torres', updatedAt: '6:00 AM', status: 'confirmed',
    },
    consequence: {
      text: 'The K-101 trip at 2:03 AM changed the calculus. T-401 generates 18.4 MW for the refinery. With K-101 down and the standby compressor ramping up, electrical demand on the plant grid is elevated. Taking T-401 offline for a 48-72 hour combustion inspection means losing 18.4 MW of on-site generation during a period when the plant is already operating in a degraded state. The inspection can safely be deferred one week -- the OEM allows a 500-hour grace period beyond the 12,000-hour interval. But deferring has costs: contractors are already on-site and being paid standby rates, scaffolding is erected and blocking a maintenance access corridor, and the maintenance team planned their week around this outage. Not every decision in a crisis is about the crisis itself. Sometimes the dashboard helps with scheduling trade-offs that are purely operational.',
      source: 'human', confidence: null, updatedBy: 'Mike Torres', updatedAt: '6:00 AM', status: 'confirmed',
    },
    recommendation: {
      text: 'Decision for the morning huddle. Arguments to proceed: contractors staged and being paid, scaffolding blocking access, no K-101 dependency (T-401 serves the electrical grid, not the hydrocracker directly), inspection takes 48-72 hours and K-101 repair will take longer. Arguments to defer: plant is stressed, losing 18.4 MW generation capacity during a crisis adds operational risk, and the maintenance team may be needed for K-101 emergency work orders (WO-4481, WO-4482). If the huddle decides to defer, release contractors, demobilize scaffolding, and reschedule within 500 hours. If the huddle decides to proceed, ensure the electrical grid can handle the 18.4 MW loss with K-101 already down.',
      source: 'human', confidence: null, updatedBy: 'Mike Torres', updatedAt: '6:00 AM', status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: ['WO-4484'],
    investigationIds: [],
  },

  // ── Last 24 hours (the original 9 events, chronological) ───────────────────

  {
    id: 'EVT-001',
    name: 'Discharge Temperature Oscillation',
    time: '11:00 PM',
    timeNote: 'previous day',
    severity: 'medium',
    eventType: 'anomaly',
    asset: 'Compressor K-302',
    assetId: 'K-302',
    subAsset: 'First-Stage Impeller',
    subAssetId: 'K-302-IMP1',
    event: 'Discharge temperature oscillating +/-8C every few minutes',
    status: 'in-progress',
    incidentId: null,
    relationships: [],
    cause: {
      text: 'Polymer fouling on first-stage impeller blades. FCC wet gas carries heavy hydrocarbons that polymerize on blade surfaces. Uneven buildup causes the compressor to oscillate between restricted flow (fouled blades) and partial break-off (cleaner blades). Control room initially misdiagnosed this as anti-surge valve hunting and opened WO-4494 to stroke-test the valve. The valve is responding correctly to the oscillation, not causing it.',
      source: 'model',
      confidence: 87,
      updatedBy: 'Pattern Recognition Engine',
      updatedAt: '11:42 PM',
      status: 'under-review',
    },
    consequence: {
      text: 'Compressor operating with reduced polytropic efficiency (71% vs 74% design). Three repetitive events flagged in the last 24 hours as discharge temperature swings exceed the rate-of-change threshold each cycle. If fouling progresses unchecked, efficiency will drop below the 68% alarm threshold and force a cleaning outage. The key diagnostic clue: suction conditions are stable while discharge oscillates. If it were a valve problem, suction pressure would fluctuate too.',
      source: 'model',
      confidence: 87,
      updatedBy: 'Pattern Recognition Engine',
      updatedAt: '11:42 PM',
      status: 'under-review',
    },
    recommendation: {
      text: 'Cancel the valve stroke test (WO-4494) -- the valve is not the problem, it is responding correctly to the oscillation. Compare suction vs discharge trend data to confirm internal fouling as root cause. Estimate fouling rate to predict when efficiency hits the 68% alarm threshold. Schedule an online wash or plan a cleaning outage before efficiency degrades to a forced trip. Review why the initial diagnosis focused on the valve instead of looking at the compressor internals.',
      source: 'human',
      confidence: null,
      updatedBy: 'Carlos Mendez',
      updatedAt: '6:30 AM',
      status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: ['WO-4494'],
    investigationIds: ['IN-0893'],
  },
  // Severity override: matrix yields 'medium' (alert x A), escalated to 'high' -- oil pressure at critical level with aux pump auto-start, immediate precursor to trip
  {
    id: 'EVT-002',
    name: 'Oil Pressure Drop',
    time: '1:30 AM',
    severity: 'high',
    eventType: 'alert',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Lube Oil System',
    subAssetId: 'K-101-LOS',
    event: 'Oil pressure dropped to 1.2 bar, aux pump auto-started',
    status: 'in-progress',
    incidentId: 'INC-001',
    relationships: [
      { type: 'cascaded_to', eventId: 'EVT-003' },
    ],
    cause: {
      text: 'Oil filter bypass valve opened due to excessive differential pressure across a clogged primary filter. Unfiltered lubricant has been circulating through the bearing housing for 14 days, eroding journal bearing surfaces and widening clearances. As clearances open up, oil leaks through faster than the pump can supply it, and pressure drops.',
      source: 'human',
      confidence: null,
      updatedBy: 'Carlos Mendez',
      updatedAt: '6:50 AM',
      status: 'confirmed',
    },
    consequence: {
      text: 'Lube oil pressure at 1.2 bar, below the 1.5 bar alarm threshold. Main oil pump is still running but cannot maintain pressure against widening bearing clearances. Auxiliary pump auto-started to boost supply. The aux pump is a backup measure, not a permanent solution -- it buys time but does not address the contaminated oil or the bearing damage already in progress. Bearing is operating on reduced oil film thickness. Continued operation risks accelerating surface damage and eventual compressor trip.',
      source: 'system',
      confidence: null,
      updatedBy: 'Auto-detection',
      updatedAt: '1:30 AM',
      status: 'confirmed',
    },
    recommendation: {
      text: 'Investigate filter condition. Sample oil for particle contamination. Monitor bearing temperature and vibration for acceleration.',
      source: 'model',
      confidence: 74,
      updatedBy: 'Failure Mode Engine',
      updatedAt: '1:32 AM',
      status: 'auto-generated',
    },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: [],
  },
  // Severity override: matrix yields 'high' (alarm x A), escalated to 'critical' -- cascading failure with imminent trip, oil pressure below critical threshold
  {
    id: 'EVT-003',
    name: 'Oil Pressure Alarm',
    time: '1:45 AM',
    severity: 'critical',
    eventType: 'alarm',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Lube Oil System',
    subAssetId: 'K-101-LOS',
    event: 'Oil pressure alarm: 1.0 bar (threshold 1.5 bar)',
    status: 'in-progress',
    incidentId: 'INC-001',
    relationships: [
      { type: 'caused_by', eventId: 'EVT-002' },
      { type: 'cascaded_to', eventId: 'EVT-004' },
    ],
    cause: {
      text: 'Escalation from EVT-002 fifteen minutes prior. Oil filter bypass has been allowing contaminated lubricant to circulate for 14 days. Auxiliary pump activated at 1:30 AM but cannot compensate for widening bearing clearances. Pressure decayed from 1.2 bar to 1.0 bar in 15 minutes, crossing the alarm threshold of 1.5 bar. Particle count elevated at 22/19/16 (ISO 4406).',
      source: 'system',
      confidence: null,
      updatedBy: 'Auto-correlation',
      updatedAt: '1:45 AM',
      status: 'confirmed',
    },
    consequence: {
      text: 'Oil pressure now at critical alarm level. The 15-minute window between EVT-002 and this alarm was the last opportunity for intervention before the failure cascade accelerated. Bearing lubrication is critically compromised -- oil film thickness on the drive end bearing has dropped to 18 microns (alarm at 25 microns). Vibration increase and potential trip are imminent.',
      source: 'human',
      confidence: null,
      updatedBy: 'Carlos Mendez',
      updatedAt: '6:50 AM',
      status: 'confirmed',
    },
    recommendation: {
      text: 'Prepare for compressor trip. Notify operations and downstream units. Verify standby compressor is ready to pick up recycle gas duty. Do not attempt filter change or oil system work while running -- the window for that intervention has passed. Alert maintenance for post-trip bearing inspection.',
      source: 'human',
      confidence: null,
      updatedBy: 'Carlos Mendez',
      updatedAt: '6:50 AM',
      status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: [],
  },
  // Severity override: matrix yields 'high' (alarm x A), escalated to 'critical' -- vibration exceeded trip threshold in cascading failure sequence
  {
    id: 'EVT-004',
    name: 'Vibration Exceedance',
    time: '2:00 AM',
    severity: 'critical',
    eventType: 'alarm',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Drive End Bearing',
    subAssetId: 'K-101-DE',
    event: 'Vibration spike: 7.8 mm/s (trip threshold 7.1 mm/s)',
    status: 'in-progress',
    incidentId: 'INC-001',
    relationships: [
      { type: 'caused_by', eventId: 'EVT-003' },
      { type: 'cascaded_to', eventId: 'EVT-005' },
    ],
    cause: {
      text: 'Drive end bearing journal surfaces have degraded from 14 days of contaminated lubrication. Shaft running eccentric as bearing clearances exceeded tolerance. Oil film thickness collapsed to 18 microns (alarm 25 microns). Bearing temperature at 108C (alarm 95C). Vibration alerts were present in the system for 3 days prior to this spike -- vibration had been climbing from 2.8 mm/s on day 14 through 5.1 mm/s on day 25 -- but no intervention was taken.',
      source: 'human',
      confidence: null,
      updatedBy: 'Carlos Mendez',
      updatedAt: '6:50 AM',
      status: 'confirmed',
    },
    consequence: {
      text: 'Vibration at 7.8 mm/s exceeds the 7.1 mm/s trip threshold. Automatic compressor trip will fire within seconds. This is now a protection system response, not an operator decision. Continued operation past this point risks catastrophic bearing failure, shaft seizure, and potential seal damage. The 3-day window where vibration alerts went unaddressed is the core failure this event exposes.',
      source: 'system',
      confidence: null,
      updatedBy: 'Protection System',
      updatedAt: '2:00 AM',
      status: 'confirmed',
    },
    recommendation: {
      text: 'Do not attempt to override the protection system. Prepare for automatic trip. Alert downstream operations (hydrocracker, V-501) for pressure transient. After trip, this event becomes the central evidence in the root cause investigation -- why were vibration alerts present for 3 days with no response?',
      source: 'human',
      confidence: null,
      updatedBy: 'Carlos Mendez',
      updatedAt: '6:50 AM',
      status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: [],
    investigationIds: [],
  },
  {
    id: 'EVT-005',
    name: 'High Vibration Trip',
    time: '2:03 AM',
    severity: 'critical',
    eventType: 'trip',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: null,
    subAssetId: null,
    event: 'Automatic trip on high vibration at 7.8 mm/s (threshold 7.1 mm/s)',
    status: 'new',
    incidentId: 'INC-001',
    relationships: [
      { type: 'caused_by', eventId: 'EVT-004' },
      { type: 'cascaded_to', eventId: 'EVT-006' },
      { type: 'cascaded_to', eventId: 'EVT-007' },
    ],
    cause: {
      text: 'Automatic trip triggered by vibration protection system at 7.8 mm/s (threshold 7.1 mm/s). Root cause chain: oil filter began bypassing on day 14, contaminated lubricant entered bearing housing, journal bearing surfaces eroded over two weeks, oil pressure decayed as clearances widened, vibration climbed as shaft ran eccentric. The system generated vibration alerts for 3 days before this trip. Nobody connected oil pressure decay, rising vibration, and filter bypass into a single failure narrative.',
      source: 'human',
      confidence: null,
      updatedBy: 'Carlos Mendez',
      updatedAt: '6:55 AM',
      status: 'confirmed',
    },
    consequence: {
      text: 'Compressor tripped and emergency shutdown sequence completed within 7 minutes. Anti-surge valve opened fully to depressure, isolation valves closed in sequence, seal gas maintained pressure during depressurization. No secondary damage to seal (DP held at 3.2 bar), coupling (alignment unchanged at 0.05 mm), or rotor (axial displacement stable at 0.12 mm). Plant availability dropped 12.1%, OEE dropped 5.9%. Recycle gas flow to hydrocracker lost -- standby compressor picking up duty but slowly, causing temporary throughput reduction. Downstream cascade: V-501 saw pressure transient to 161 bar (EVT-006), C-201 fan belt shifted from piping transient (EVT-007). Two emergency work orders and two investigations opened immediately.',
      source: 'system',
      confidence: null,
      updatedBy: 'KPI Engine',
      updatedAt: '2:10 AM',
      status: 'confirmed',
    },
    recommendation: {
      text: 'Verify all isolation valves in correct locked-out position. Confirm zero residual pressure in casing. Maintain lube oil circulation for bearing cooldown. Complete bearing inspection (WO-4481). Flush and replace lube oil system filters (WO-4482). Do not attempt restart until both are complete. Initiate formal root cause analysis (IN-0891) with focus on: why did vibration alerts go unaddressed for 3 days? Why was filter DP alarm threshold set too high to catch the bypass? Review alarm threshold adequacy across all critical compressors (IN-0897).',
      source: 'human',
      confidence: null,
      updatedBy: 'Carlos Mendez',
      updatedAt: '6:55 AM',
      status: 'confirmed',
    },
    kpiImpact: 'Availability -12.1%, OEE -5.9%',
    workOrderIds: ['WO-4481', 'WO-4482'],
    investigationIds: ['IN-0891', 'IN-0897'],
  },
  // Severity override: matrix yields 'low' (anomaly x C), escalated to 'medium' -- pressure transient on high-pressure hydrogen vessel requires safety protocol response
  {
    id: 'EVT-006',
    name: 'Pressure Transient',
    time: '2:04 AM',
    severity: 'medium',
    eventType: 'anomaly',
    asset: 'Vessel V-501',
    assetId: 'V-501',
    subAsset: 'Vessel Shell',
    subAssetId: 'V-501-SHL',
    event: 'Pressure spike to 161 bar (design 180 bar) during K-101 trip',
    status: 'new',
    incidentId: 'INC-001',
    relationships: [
      { type: 'caused_by', eventId: 'EVT-005' },
    ],
    cause: {
      text: 'Cascade from K-101 trip (EVT-005). Sudden loss of recycle gas compression caused a pressure transient in the high-pressure separator. Operating pressure spiked from 152 bar to 161 bar over 90 seconds before control systems stabilized it. V-501 sits directly downstream of K-101 in the hydrocracker loop -- any compressor trip creates a momentary pressure surge as gas flow redistributes.',
      source: 'system',
      confidence: null,
      updatedBy: 'Auto-correlation',
      updatedAt: '2:04 AM',
      status: 'confirmed',
    },
    consequence: {
      text: 'Pressure excursion stayed within design envelope (design pressure 180 bar, relief valve set at 176 bar). Relief valve did not lift. No damage expected. However, any unexpected pressure excursion on a high-pressure hydrogen vessel gets documented as a matter of safety protocol. Vessel shell UT thickness is 62 mm (nominal 65 mm, alarm at 55 mm) with a corrosion rate of 0.12 mm/yr -- plenty of margin. This is a verification exercise, not a failure response.',
      source: 'system',
      confidence: null,
      updatedBy: 'Auto-detection',
      updatedAt: '2:06 AM',
      status: 'under-review',
    },
    recommendation: {
      text: 'Pull the pressure trace from the historian and confirm no sustained overpressure above 165 bar (alarm threshold). Verify vessel integrity per API 510 standard protocol. Review whether control system response time was adequate or if a faster depressure path is needed. Close investigation IN-0898 once documentation is complete.',
      source: 'human',
      confidence: null,
      updatedBy: 'Carlos Mendez',
      updatedAt: '6:55 AM',
      status: 'confirmed',
    },
    kpiImpact: 'Pressure excursion to 161 bar',
    workOrderIds: [],
    investigationIds: ['IN-0898'],
  },
  {
    id: 'EVT-007',
    name: 'Fan Vibration Anomaly',
    time: '2:05 AM',
    severity: 'low',
    eventType: 'anomaly',
    asset: 'Cooler C-201',
    assetId: 'C-201',
    subAsset: 'Fan Assembly',
    subAssetId: 'C-201-FAN',
    event: 'Fan vibration spiking to 4.8 mm/s during belt slip events',
    status: 'new',
    incidentId: 'INC-001',
    relationships: [
      { type: 'caused_by', eventId: 'EVT-005' },
    ],
    cause: {
      text: 'Cascade from K-101 trip (EVT-005). C-201 cools gas between compression stages on K-101. The trip at 2:03 AM sent a sudden pressure release through interstage piping. The fan belt was already losing tension gradually over months (belt tension at 82%, alarm at 75%). The pressure transient shifted the belt on the sheave. Fan now runs at 3.2 mm/s baseline vibration with intermittent spikes to 4.8 mm/s during belt slip events (alarm at 4.0 mm/s).',
      source: 'system',
      confidence: null,
      updatedBy: 'Auto-correlation',
      updatedAt: '2:05 AM',
      status: 'under-review',
    },
    consequence: {
      text: 'Cooler process side is completely unaffected -- tubes are clean, fouling factor normal at 0.0003 m2K/W, heat transfer performance is fine. This is purely a mechanical issue on the air side. The investigation question (IN-0892) is whether this was triggered by the K-101 trip or was developing independently. Answer: both. The belt was already degrading; the transient accelerated the failure. If belt tension drops below 75%, the fan could stall entirely and interstage cooling would be lost, forcing a compression limit.',
      source: 'human',
      confidence: null,
      updatedBy: 'Carlos Mendez',
      updatedAt: '6:55 AM',
      status: 'confirmed',
    },
    recommendation: {
      text: 'Schedule belt tension adjustment or replacement (WO-4498 already open). Inspect sheave alignment while belt is off. Determine whether belt replacement interval needs shortening based on condition found. Close investigation IN-0892 with finding: pre-existing degradation accelerated by trip transient -- both causes contributed.',
      source: 'human',
      confidence: null,
      updatedBy: 'Carlos Mendez',
      updatedAt: '6:55 AM',
      status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: ['WO-4498'],
    investigationIds: ['IN-0892'],
  },
  // Severity override: matrix yields 'low' (alert x B), escalated to 'high' -- active seal failure above alarm threshold, third recurrence in 6 months
  {
    id: 'EVT-009',
    name: 'Discharge Pressure Low',
    time: '4:30 AM',
    severity: 'high',
    eventType: 'alert',
    asset: 'Pump P-203',
    assetId: 'P-203',
    subAsset: 'Mechanical Seal (Discharge)',
    subAssetId: 'P-203-SEAL',
    event: 'Discharge pressure 8% below normal, seal leakage at 4.2 L/hr',
    status: 'new',
    incidentId: null,
    relationships: [],
    cause: {
      text: 'Mechanical seal wear causing internal leakage at 4.2 L/hr (alarm 2.0 L/hr). This is the third mechanical seal replacement in six months. Each time maintenance replaces the seal, the pump runs fine for 6-8 weeks, then starts leaking again. After the second seal replacement, coupling alignment was not checked properly. Shaft is running slightly eccentric, wearing the seal face unevenly. Coupling alignment is at 0.11 mm -- 73% of the 0.15 mm alarm threshold -- and trending upward. The seal is the symptom. Alignment is the disease.',
      source: 'model',
      confidence: 82,
      updatedBy: 'Recurring Failure Engine',
      updatedAt: '4:35 AM',
      status: 'under-review',
    },
    consequence: {
      text: 'Discharge pressure at 32.4 bar (8% below normal 35.2 bar). Seal chamber pressure elevated at 8.1 bar (alarm 7.5 bar). No immediate production impact, but every seal replacement costs downtime and parts without fixing the problem. If alignment continues to drift past 0.15 mm, bearing damage will follow and the failure mode shifts from seal wear to something much more expensive. The recurring pattern is the signal -- three identical failures in six months should trigger a root cause investigation, not a fourth seal order.',
      source: 'model',
      confidence: 82,
      updatedBy: 'Recurring Failure Engine',
      updatedAt: '4:35 AM',
      status: 'under-review',
    },
    recommendation: {
      text: 'Complete seal inspection (WO-4483) but do not just replace the seal again. Investigate shaft runout and coupling alignment as root cause (IN-0894). Measure alignment offset before and after any seal work. If alignment exceeds 0.10 mm, correct it before installing the new seal. Review maintenance records for the second seal replacement to determine when alignment was last verified.',
      source: 'human',
      confidence: null,
      updatedBy: 'Sarah Chen',
      updatedAt: '5:15 AM',
      status: 'confirmed',
    },
    kpiImpact: null,
    workOrderIds: ['WO-4483'],
    investigationIds: ['IN-0894'],
  },
  // Severity override: matrix yields 'medium' (inspection x A), escalated to 'critical' -- post-trip bearing damage confirmed, compressor restart blocked, RUL revised to 5 days
  {
    id: 'EVT-011',
    name: 'Bearing Damage Detected',
    time: '6:45 AM',
    severity: 'critical',
    eventType: 'inspection',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Drive End Bearing',
    subAssetId: 'K-101-DE',
    event: 'Bearing damage detected during manual inspection, RUL revised to 5 days',
    status: 'new',
    incidentId: 'INC-001',
    relationships: [
      { type: 'related_to', eventId: 'EVT-005' },
      { type: 'related_to', eventId: 'EVT-002' },
    ],
    cause: {
      text: 'Morning shift inspection of drive end bearing detected mechanical damage consistent with contaminated lubrication over an extended period. Babbitt surface shows scoring and wiping on the loaded zone. Journal surface has visible wear tracks from particulate contamination in the oil film. Oil sample from the bearing drain shows elevated particle count (22/19/16 ISO 4406) and metallic debris consistent with babbitt material. Damage pattern matches the vibration signature recorded over the past 3 days -- the bearing was failing progressively, not suddenly.',
      source: 'human',
      confidence: null,
      updatedBy: 'Sarah Chen',
      updatedAt: '6:45 AM',
      status: 'confirmed',
    },
    consequence: {
      text: 'Remaining useful life revised from the predictive model estimate down to 5 days based on physical evidence. The bearing cannot be run in this condition -- compressor restart is blocked until the bearing is replaced. This confirms what the data was signaling: oil pressure decay (EVT-002, EVT-003), vibration climb (EVT-004), and the eventual trip (EVT-005) were all symptoms of this single root cause. The 28-day failure timeline is now fully traceable from filter bypass to bearing destruction.',
      source: 'human',
      confidence: null,
      updatedBy: 'Sarah Chen',
      updatedAt: '6:45 AM',
      status: 'confirmed',
    },
    recommendation: {
      text: 'Expedite bearing procurement -- confirm lead time and availability of replacement journal bearing set. Schedule replacement coordinated with lube oil system flush (WO-4482) so both are completed before restart attempt. Photograph bearing damage for IN-0891 root cause report. Continue alarm threshold review (IN-0897) -- the filter DP alarm was set too high to catch the bypass, and vibration alerts were generated but not acted on for 3 days. Both failures in the alert system need to be addressed before this compressor returns to service.',
      source: 'human',
      confidence: null,
      updatedBy: 'Sarah Chen',
      updatedAt: '6:45 AM',
      status: 'confirmed',
    },
    kpiImpact: 'RUL revised to 5 days',
    workOrderIds: ['WO-4481', 'WO-4482'],
    investigationIds: ['IN-0891', 'IN-0897'],
  },
]

// ── Event severity derivation ────────────────────────────────────────────────
// Event severity derivation matrix (ISA-18.2 / IEC 62682 aligned)
// Severity = f(event impact type, asset criticality)
//
//                    A (Safety)    B (Production)    C (Support)
// Trip/Shutdown      Critical      High              Medium
// Threshold breach   High          Medium            Low
// Advisory/Info      Medium        Low               Low
//
// Note: anomaly and inspection types map to advisory (0) impact level.

// `anomaly` and `inspection` event types fall back to advisory level (0) by default.
// They are listed explicitly here for clarity.
const IMPACT_MAP = { trip: 2, alarm: 1, alert: 0, anomaly: 0, inspection: 0 }
const CRITICALITY_MAP = { A: 2, B: 1, C: 0 }
const SEVERITY_MATRIX = [
  ['low', 'low', 'medium'],     // advisory (0) x [C, B, A]
  ['low', 'medium', 'high'],    // threshold (1) x [C, B, A]
  ['medium', 'high', 'critical'] // trip (2) x [C, B, A]
]

export function deriveEventSeverity(eventType, assetCriticality) {
  const impact = IMPACT_MAP[eventType] ?? 0
  const crit = CRITICALITY_MAP[assetCriticality] ?? 0
  return SEVERITY_MATRIX[impact][crit]
}

// ── Incidents ────────────────────────────────────────────────────────────────
// Groups related events into a single narrative. Each entity cross-references.

export const INCIDENTS = [
  {
    id: 'INC-001',
    name: 'K-101 Bearing Failure',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    severity: 'critical',
    status: 'investigating',
    lead: 'Carlos Mendez',
    opened: '2:03 AM',
    rootCauseEventId: 'EVT-002',
    triggerEventId: 'EVT-005',
    eventIds: ['EVT-002', 'EVT-003', 'EVT-004', 'EVT-005', 'EVT-006', 'EVT-007', 'EVT-011'],
    workOrderIds: ['WO-4481', 'WO-4482', 'WO-4498'],
    investigationIds: ['IN-0891', 'IN-0892', 'IN-0897', 'IN-0898'],
  },
]

// ── Work Orders (active at 7:00 AM) ──────────────────────────────────────────

export const WORK_ORDERS = [
  {
    id: 'WO-4481',
    assetId: 'K-101',
    asset: 'Compressor K-101',
    task: 'Bearing inspection and assessment',
    urgency: 'emergency',
    assignee: 'Sarah Chen',
    // Inspection opened at 2:15 AM. Bearing damage confirmed at 6:45 AM (EVT-011). 4.5 hours total.
    status: 'completed',
    created: '2:15 AM',
    completedAt: '6:45 AM',
    eventId: 'EVT-005',
    investigationIds: ['IN-0891'],
  },
  {
    id: 'WO-4482',
    assetId: 'K-101',
    asset: 'Compressor K-101',
    task: 'Lube oil system flush and filter replacement',
    urgency: 'emergency',
    assignee: null,
    // Blocked pending bearing replacement completion. Not yet started.
    status: 'open',
    created: '2:30 AM',
    completedAt: null,
    eventId: 'EVT-005',
    investigationIds: ['IN-0891'],
  },
  {
    id: 'WO-4483',
    assetId: 'P-203',
    asset: 'Pump P-203',
    task: 'Mechanical seal inspection, discharge side',
    urgency: 'urgent',
    assignee: 'Fred Martinez',
    status: 'in-progress',
    created: '5:00 AM',
    completedAt: null,
    eventId: 'EVT-009',
    investigationIds: ['IN-0894'],
  },
  {
    id: 'WO-4484',
    assetId: 'T-401',
    asset: 'Turbine T-401',
    task: 'Combustion inspection (12,000 hr interval)',
    urgency: 'scheduled',
    assignee: 'Mike Torres',
    status: 'pending-decision',
    created: '6:00 AM',
    completedAt: null,
    eventId: null,
    investigationIds: [],
    note: 'Maintenance window opened but inspection not started. K-101 crisis raises scheduling question: defer one week or proceed? Morning huddle to decide. Contractors, parts, and scaffolding staged. Previous inspections at 6,000 and 9,000 hours found minor coating wear within limits.',
  },
  // Additional work orders -- eventId null for routine/preventive WOs not triggered by an acute event
  { id: 'WO-4485', assetId: 'P-102', asset: 'Pump P-102', task: 'Quarterly vibration baseline measurement', urgency: 'scheduled', assignee: 'James Park', status: 'in-progress', created: 'Yesterday', completedAt: null, eventId: null, investigationIds: [] },
  { id: 'WO-4486', assetId: 'V-501', asset: 'Vessel V-501', task: 'Pressure relief valve test and recertification', urgency: 'scheduled', assignee: 'Sarah Chen', status: 'open', created: 'Yesterday', completedAt: null, eventId: null, investigationIds: [] },
  { id: 'WO-4487', assetId: 'E-105', asset: 'Heat Exchanger E-105', task: 'Tube bundle fouling assessment', urgency: 'scheduled', assignee: null, status: 'open', created: '2 days ago', completedAt: null, eventId: null, investigationIds: ['IN-0896'] },
  { id: 'WO-4488', assetId: 'T-102', asset: 'Turbine T-102', task: 'Borescope inspection preparation', urgency: 'scheduled', assignee: 'Mike Torres', status: 'open', created: '2 days ago', completedAt: null, eventId: null, investigationIds: ['IN-0895'] },
  { id: 'WO-4489', assetId: 'R-301', asset: 'Reactor R-301', task: 'Catalyst bed thermocouple calibration', urgency: 'scheduled', assignee: null, status: 'open', created: '3 days ago', completedAt: null, eventId: null, investigationIds: [] },
  { id: 'WO-4490', assetId: 'K-302', asset: 'Compressor K-302', task: 'Discharge temperature sensor replacement', urgency: 'scheduled', assignee: 'Fred Martinez', status: 'open', created: '3 days ago', completedAt: null, eventId: null, investigationIds: ['IN-0893'] },
  { id: 'WO-4491', assetId: 'P-102', asset: 'Pump P-102', task: 'Coupling alignment check', urgency: 'scheduled', assignee: null, status: 'open', created: '4 days ago', completedAt: null, eventId: null, investigationIds: [] },
  { id: 'WO-4492', assetId: 'E-105', asset: 'Heat Exchanger E-105', task: 'Shell-side UT thickness survey', urgency: 'scheduled', assignee: null, status: 'open', created: '4 days ago', completedAt: null, eventId: null, investigationIds: [] },
  { id: 'WO-4493', assetId: 'V-501', asset: 'Vessel V-501', task: 'Level transmitter recalibration', urgency: 'scheduled', assignee: null, status: 'open', created: '5 days ago', completedAt: null, eventId: null, investigationIds: [] },
  { id: 'WO-4494', assetId: 'K-302', asset: 'Compressor K-302', task: 'Anti-surge valve stroke test', urgency: 'scheduled', assignee: null, status: 'open', created: '5 days ago', completedAt: null, eventId: 'EVT-001', investigationIds: ['IN-0893'] },
  { id: 'WO-4495', assetId: 'T-102', asset: 'Turbine T-102', task: 'Exhaust temperature profile review', urgency: 'scheduled', assignee: null, status: 'open', created: '6 days ago', completedAt: null, eventId: null, investigationIds: ['IN-0895'] },
  { id: 'WO-4496', assetId: 'P-203', asset: 'Pump P-203', task: 'Suction strainer cleaning', urgency: 'scheduled', assignee: null, status: 'open', created: '1 week ago', completedAt: null, eventId: null, investigationIds: [] },
  { id: 'WO-4497', assetId: 'R-301', asset: 'Reactor R-301', task: 'Hydrogen analyzer calibration', urgency: 'scheduled', assignee: 'Sarah Chen', status: 'open', created: '1 week ago', completedAt: null, eventId: null, investigationIds: [] },
  { id: 'WO-4498', assetId: 'C-201', asset: 'Cooler C-201', task: 'Fan belt tension check', urgency: 'scheduled', assignee: null, status: 'open', created: '1 week ago', completedAt: null, eventId: 'EVT-007', investigationIds: ['IN-0892'] },
  { id: 'WO-4499', assetId: 'E-105', asset: 'Heat Exchanger E-105', task: 'Gasket inventory verification', urgency: 'scheduled', assignee: null, status: 'open', created: '1 week ago', completedAt: null, eventId: null, investigationIds: [] },
  { id: 'WO-4500', assetId: 'K-302', asset: 'Compressor K-302', task: 'Lube oil sample and analysis', urgency: 'scheduled', assignee: 'Fred Martinez', status: 'open', created: '1 week ago', completedAt: null, eventId: null, investigationIds: [] },
  { id: 'WO-4501', assetId: 'T-401', asset: 'Turbine T-401', task: 'Inlet air filter differential pressure check', urgency: 'scheduled', assignee: null, status: 'open', created: '2 weeks ago', completedAt: null, eventId: null, investigationIds: [] },
  { id: 'WO-4502', assetId: 'V-501', asset: 'Vessel V-501', task: 'Corrosion coupon retrieval and analysis', urgency: 'scheduled', assignee: null, status: 'open', created: '2 weeks ago', completedAt: null, eventId: null, investigationIds: [] },
  { id: 'WO-4503', assetId: 'P-102', asset: 'Pump P-102', task: 'Motor insulation resistance test', urgency: 'scheduled', assignee: null, status: 'open', created: '2 weeks ago', completedAt: null, eventId: null, investigationIds: [] },
  { id: 'WO-4504', assetId: 'R-301', asset: 'Reactor R-301', task: 'Safety valve inspection scheduling', urgency: 'scheduled', assignee: null, status: 'open', created: '2 weeks ago', completedAt: null, eventId: null, investigationIds: [] },
  { id: 'WO-4505', assetId: 'K-101', asset: 'Compressor K-101', task: 'Vibration probe gap voltage verification', urgency: 'scheduled', assignee: null, status: 'open', created: '3 weeks ago', completedAt: null, eventId: null, investigationIds: [] },
]

// ── Cases (active at 7:00 AM) ─────────────────────────────────────────────────

export const INVESTIGATIONS = [
  {
    id: 'IN-0891',
    assetId: 'K-101',
    asset: 'Compressor K-101',
    description: 'Root cause analysis: recurring bearing degradation. Vibration alerts ignored for 3 days. Oil filter bypass suspected. Threshold review needed.',
    status: 'investigating',
    assignee: 'Carlos Mendez',
    workOrderIds: ['WO-4481', 'WO-4482'],
    eventIds: ['EVT-002', 'EVT-003', 'EVT-004', 'EVT-005', 'EVT-011'],
    incidentId: 'INC-001',
    opened: '3:00 AM',
  },
  {
    id: 'IN-0892',
    assetId: 'C-201',
    asset: 'Cooler C-201',
    description: 'Vibration anomaly on fan assembly. Determine if related to K-101 trip transient or independent belt degradation.',
    status: 'open',
    assignee: null,
    workOrderIds: ['WO-4498'],
    eventIds: ['EVT-007'],
    incidentId: 'INC-001',
    opened: '2:15 AM',
  },
  { id: 'IN-0893', assetId: 'K-302', asset: 'Compressor K-302', description: 'Discharge temperature oscillation pattern. Determine if control valve hunting or early-stage fouling.', status: 'open', assignee: null, workOrderIds: ['WO-4494'], eventIds: ['EVT-001'], incidentId: null, opened: '2 days ago' },
  { id: 'IN-0894', assetId: 'P-203', asset: 'Pump P-203', description: 'Recurring seal leakage. Third seal replacement in 6 months. Investigate shaft runout or alignment root cause.', status: 'investigating', assignee: 'Sarah Chen', workOrderIds: ['WO-4483'], eventIds: ['EVT-009'], incidentId: null, opened: '4 days ago' },
  { id: 'IN-0895', assetId: 'T-102', asset: 'Turbine T-102', description: 'Gradual exhaust temperature spread widening. Monitor for combustion liner degradation.', status: 'open', assignee: null, workOrderIds: ['WO-4488', 'WO-4495'], eventIds: ['EVT-T102-H1'], incidentId: null, opened: '1 week ago' },
  { id: 'IN-0896', assetId: 'E-105', asset: 'Heat Exchanger E-105', description: 'Heat duty declining faster than fouling model predicts. Investigate potential tube leak.', status: 'open', assignee: null, workOrderIds: ['WO-4487'], eventIds: ['EVT-E105-H1'], incidentId: null, opened: '1 week ago' },
  { id: 'IN-0897', assetId: 'K-101', asset: 'Compressor K-101', description: 'Historical review: alarm threshold adequacy across all critical compressors. Initiated after K-101 trip.', status: 'open', assignee: null, workOrderIds: [], eventIds: ['EVT-005'], incidentId: 'INC-001', opened: '3:30 AM' },
  { id: 'IN-0898', assetId: 'V-501', asset: 'Vessel V-501', description: 'Unexpected pressure fluctuation during K-101 trip transient. Confirm vessel integrity.', status: 'open', assignee: null, workOrderIds: [], eventIds: ['EVT-006'], incidentId: 'INC-001', opened: '2:10 AM' },
]

// ── Reliability derivation helpers ──────────────────────────────────────────
//
// Time parsing: relative strings -> hours since now (positive = in the past)
// Today timestamps (e.g. '2:15 AM') are converted to hours from midnight.
// Used only for MTTR derivation from WO created/completedAt strings.

function parseTimeToHours(str) {
  if (!str) return null
  if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(str)) {
    const [time, period] = str.split(' ')
    let [h, m] = time.split(':').map(Number)
    if (/pm/i.test(period) && h !== 12) h += 12
    if (/am/i.test(period) && h === 12) h = 0
    return h + m / 60
  }
  if (str === 'Yesterday') return 24
  const daysMatch = str.match(/^(\d+)\s+days?\s+ago$/)
  if (daysMatch) return Number(daysMatch[1]) * 24
  const weeksMatch = str.match(/^(\d+)\s+weeks?\s+ago$/)
  if (weeksMatch) return Number(weeksMatch[1]) * 168
  if (str === '1 week ago') return 168
  return null
}

// MTBF = total observation hours / number of failure events
// Failure events = eventType 'trip' OR status 'closed' (validated failures)
// Observation window approximated per asset from narrative timeframes (hours).
// Assets with < 2 data points fall back to the hardcoded value in ASSETS
// (noted inline on the asset).
//
// Observation windows by asset (conservative: uses story narrative context):
//   K-101: 28 days = 672h (story spans day-1 to trip on day-28)
//   P-203: 4 months = 2880h (two historical seal failures 4 and 2 months ago)
//   C-201: 4 months = 2880h (first belt alert 3 weeks ago; no failures yet)
//   T-401: 4 months = 2880h (only 1 closed event in 4 months)
//   E-105: 4 months = 2880h (no closed events)
//   R-301: 4 months = 2880h (2 closed minor events)
//   V-501: 4 months = 2880h (no closed events)
//   P-102: 4 months = 2880h (1 closed startup spike)
//   K-302: 4 months = 2880h (no closed events; historical MTBF reflects older data)
//   T-102: 4 months = 2880h (1 closed vibration spike)

const ASSET_OBS_HOURS = {
  'K-101': 672,   // 28-day failure chain narrative
  'P-203': 2880,  // 4-month recurring seal pattern
  'C-201': 2880,
  'T-401': 2880,
  'E-105': 2880,
  'R-301': 2880,
  'V-501': 2880,
  'P-102': 2880,
  'K-302': 2880,
  'T-102': 2880,
}

export function deriveMTBF(assetId, timelineEvents) {
  const failures = timelineEvents.filter(
    e => e.eventType === 'trip' || e.status === 'closed'
  )
  const obsHours = ASSET_OBS_HOURS[assetId] ?? 2880
  if (failures.length === 0) return null  // insufficient data
  return Math.round(obsHours / failures.length)
}

// MTTR = average (completedAt - created) hours for completed WOs on this asset.
// Only includes WOs where completedAt !== null.
// Time strings parsed via parseTimeToHours(); today-timestamps anchored at
// hours-from-midnight, relative strings at hours-before-now (7:00 AM = 7h).
// For MTTR the delta is what matters, so absolute anchor cancels out as long
// as created and completedAt are both today-timestamps or both relative.

export function deriveMTTR(assetId, workOrders) {
  const done = workOrders.filter(wo => wo.assetId === assetId && wo.completedAt !== null)
  if (done.length === 0) return null
  const durations = done.map(wo => {
    const start = parseTimeToHours(wo.created)
    const end   = parseTimeToHours(wo.completedAt)
    if (start == null || end == null) return null
    // If end < start, the WO crossed midnight (treat as same-day delta)
    return end >= start ? end - start : 24 - start + end
  }).filter(d => d !== null)
  if (durations.length === 0) return null
  const avg = durations.reduce((s, d) => s + d, 0) / durations.length
  return Math.round(avg * 10) / 10
}

// RUL = linear projection of rulTrend to zero.
// If the last two points are flat or rising, RUL = last value (stable, no decline).
// If declining, compute the slope (days/step over 7 weekly steps) and project to 0.
// rulTrend has 7 data points at weekly intervals; slope is in days per week.

export function deriveRUL(rulTrend) {
  if (!rulTrend || rulTrend.length < 2) return null
  const last  = rulTrend[rulTrend.length - 1]
  const prev  = rulTrend[rulTrend.length - 2]
  const slope = last - prev  // days change per week (negative = declining)
  if (slope >= 0) return `${last} days`  // stable or rising
  // Weeks until zero crossing from the last reading: last / |slope|
  const weeksToZero = last / Math.abs(slope)
  const daysToZero  = Math.round(weeksToZero * 7)
  // Cap at last value as an upper bound sanity check
  return `${Math.min(daysToZero, last)} days`
}

// ── OEE Derivation ────────────────────────────────────────────────────────────
//
// OEE = Availability x Performance x Quality
//
// Availability = uptime / (uptime + downtime)
//   Production: derived from DCS historian (asset run/stop status over time).
//   Demo: derived from TIMELINE downtime events + WORK_ORDERS repair durations.
//   Each asset's downtime hours come from events that took the asset offline.
//
// Performance = actual_throughput / rated_throughput
//   Production: fed from MES (manufacturing execution system) production counters.
//   Demo: assumed constant per asset. Held static to isolate reliability-driven
//   OEE changes through availability. Documented as assumedPerformance.
//
// Quality = good_output / total_output
//   Production: fed from MES quality inspection data and reject counters.
//   Demo: assumed constant per asset. Documented as assumedQuality.
//
// Asset OEE = deriveAvailability(asset) x assumedPerformance x assumedQuality
// Plant OEE = weighted sum of asset OEE values by productionWeight.
// ──────────────────────────────────────────────────────────────────────────────

// Total observation period in hours (same as MTBF observation window)
const OBS_HOURS_TOTAL = 4320  // ~6 months

export function deriveAvailability(assetId) {
  // Sum downtime hours from TIMELINE events that took this asset offline (trips)
  const trips = TIMELINE.filter(
    e => e.assetId === assetId && e.eventType === 'trip'
  )
  // Each trip = MTTR hours of downtime. Use asset's derived MTTR or default 4h.
  const asset = ASSETS.find(a => a.id === assetId)
  const mttr = asset?.mttr ?? 4
  const totalDowntime = trips.length * mttr
  const uptime = OBS_HOURS_TOTAL - totalDowntime
  return Math.round((uptime / OBS_HOURS_TOTAL) * 1000) / 1000  // e.g., 0.988
}

export function deriveAssetOEE(asset) {
  const availability = deriveAvailability(asset.id)
  const performance = asset.assumedPerformance
  const quality = asset.assumedQuality
  return Math.round(availability * performance * quality * 1000) / 10  // percentage
}

// Plant OEE = weighted sum of asset OEE values.
// PLANT.oee = sum(asset.oee * asset.productionWeight) for all assets.
// Weights sum to 1.0 (verified in ASSETS definitions above).
// Note: PLANT.oee retains the measured plant-level value (76.3) because these
// 10 assets are a scope subset of Baytown's 168 total assets.

export function derivePlantOEE(assets) {
  return Math.round(
    assets.reduce((sum, a) => sum + (a.oee * a.productionWeight), 0) * 10
  ) / 10
}

// getActiveIncident: returns the highest-priority active incident.
// Active = status 'investigating' or 'open'.
// Sort: severity (critical > high > medium > low), then by recency (most recently opened first).

const SEVERITY_ORDER = { critical: 4, high: 3, medium: 2, low: 1 }

export function getActiveIncident(incidents = INCIDENTS) {
  const active = incidents.filter(
    i => i.status === 'investigating' || i.status === 'open'
  )
  if (active.length === 0) return null
  active.sort((a, b) => {
    const sevDiff = (SEVERITY_ORDER[b.severity] ?? 0) - (SEVERITY_ORDER[a.severity] ?? 0)
    if (sevDiff !== 0) return sevDiff
    // Secondary sort: opened time -- today timestamps sorted as-is (string compare is fine for AM/PM here)
    return (b.opened > a.opened) ? 1 : -1
  })
  return active[0]
}

// ── Computed: event, WO, investigation counts + reliability metrics ──────────
// All counts derived from TIMELINE, WORK_ORDERS, and INVESTIGATIONS.
// mtbf, mttr, and rul are derived from source data via the functions above.
// Assets with insufficient TIMELINE data fall back to the source-of-truth values
// declared on the asset (annotated with a comment on the asset itself).
ASSETS.forEach(a => {
  const events = TIMELINE.filter(e => e.assetId === a.id)
  a.newEvents = events.filter(e => e.status === 'new').length
  a.inProgressEvents = events.filter(e => e.status === 'in-progress').length
  a.closedEvents = events.filter(e => e.status === 'closed').length
  a.falsePositives = events.filter(e => e.status === 'false-positive').length
  a.activeEvents = a.newEvents + a.inProgressEvents
  a.totalEvents = events.length
  a.workOrders = WORK_ORDERS.filter(wo => wo.assetId === a.id).length
  a.investigations = INVESTIGATIONS.filter(c => c.assetId === a.id).length

  // Derive mtbf from TIMELINE failure events. Falls back to hardcoded value if < 1 failure found.
  const computedMtbf = deriveMTBF(a.id, events)
  if (computedMtbf !== null) {
    a.mtbf = computedMtbf
  }
  // else: a.mtbf retains the value declared in ASSETS (source-of-truth for data-sparse assets)

  // Derive mttr from completed WOs for this asset.
  const computedMttr = deriveMTTR(a.id, WORK_ORDERS)
  if (computedMttr !== null) {
    a.mttr = computedMttr
  }
  // else: a.mttr retains the value declared in ASSETS

  // Derive rul from rulTrend. deriveRUL never returns null for valid trend arrays.
  a.rul = deriveRUL(a.rulTrend) ?? a.rul

  // Derive OEE from availability x assumed performance x assumed quality
  a.oee = deriveAssetOEE(a)
})

// ── Notifications (most recent first) ────────────────────────────────────────
// Derived from TIMELINE events with a `time` field (recent/today events only).
// Historical events (date field only) are excluded from the notification panel.
// Each notification carries its full metadata so EventDetails can render directly.

const recentEvents = TIMELINE.filter(evt => evt.time)
export const NOTIFICATIONS = recentEvents.slice().reverse().map((evt, i) => ({
  id: i + 1,
  eventId: evt.id,
  severity: evt.severity,
  eventType: evt.eventType,
  asset: evt.asset,
  assetId: evt.assetId,
  subAsset: evt.subAsset,
  subAssetId: evt.subAssetId,
  message: evt.event,
  time: evt.time,
  timeNote: evt.timeNote || null,
  name: evt.name,
  status: evt.status,
  incidentId: evt.incidentId,
  relationships: evt.relationships,
  cause: evt.cause,
  consequence: evt.consequence,
  recommendation: evt.recommendation,
  kpiImpact: evt.kpiImpact,
  workOrderIds: evt.workOrderIds,
  investigationIds: evt.investigationIds,
}))

// ── K-101 Degradation Timeline (30-day) ──────────────────────────────────────
// For the Trends screen. Shows the slow buildup preceding the trip.
// Oil pressure degrades first (root cause). Bearing temp responds next.
// Vibration lags slightly. Surge margin erodes as bearing roughness
// degrades compressor performance. Acceleration is nonlinear.

export const K101_DEGRADATION = [
  { day: 1,  vibration: 1.8, bearingTemp: 68,  oilPressure: 2.1, surgeMargin: 22, status: 'normal' },
  { day: 4,  vibration: 1.9, bearingTemp: 69,  oilPressure: 2.1, surgeMargin: 22, status: 'normal' },
  { day: 7,  vibration: 2.1, bearingTemp: 71,  oilPressure: 2.0, surgeMargin: 21, status: 'normal' },
  { day: 10, vibration: 2.4, bearingTemp: 73,  oilPressure: 1.9, surgeMargin: 20, status: 'normal' },
  { day: 14, vibration: 2.8, bearingTemp: 76,  oilPressure: 1.8, surgeMargin: 19, status: 'monitoring' },
  { day: 18, vibration: 3.5, bearingTemp: 82,  oilPressure: 1.6, surgeMargin: 17, status: 'watch' },
  { day: 20, vibration: 3.8, bearingTemp: 85,  oilPressure: 1.5, surgeMargin: 16, status: 'watch' },
  { day: 22, vibration: 4.2, bearingTemp: 89,  oilPressure: 1.4, surgeMargin: 15, status: 'warning' },
  { day: 24, vibration: 4.8, bearingTemp: 93,  oilPressure: 1.3, surgeMargin: 13, status: 'warning' },
  { day: 25, vibration: 5.1, bearingTemp: 96,  oilPressure: 1.2, surgeMargin: 12, status: 'alarm' },
  { day: 26, vibration: 5.8, bearingTemp: 100, oilPressure: 1.1, surgeMargin: 10, status: 'high-alarm' },
  { day: 27, vibration: 6.3, bearingTemp: 104, oilPressure: 1.1, surgeMargin: 9,  status: 'high-alarm' },
  // Day 28: 1:30 AM -- oil pressure alarm, aux pump auto-started
  { day: 28, vibration: 6.9, bearingTemp: 108, oilPressure: 1.0, surgeMargin: 7,  status: 'alarm-oil-pressure' },
  // Day 28: 2:00 AM -- vibration spike, trip imminent
  { day: 28.05, vibration: 7.8, bearingTemp: 112, oilPressure: 0.9, surgeMargin: 6,  status: 'trip-imminent' },
  // Day 28: 2:03 AM -- TRIP
  { day: 28.1,  vibration: 9.2, bearingTemp: 118, oilPressure: 0.7, surgeMargin: 3,  status: 'trip' },
]

// ── K-101 Fault Tree ──────────────────────────────────────────────────────────
// Top event down to root cause. type drives visual styling in components.
// rootCause: true marks the confirmed initiating failure.

export const K101_FAULT_TREE = {
  event: 'High Vibration Trip',
  asset: 'K-101',
  time: '2:03 AM',
  type: 'critical',
  children: [
    {
      event: 'Bearing Failure',
      type: 'critical',
      children: [
        {
          event: 'Vibration Increase',
          value: '7.8 mm/s',
          threshold: '7.1 mm/s',
          type: 'critical',
          attribute: 'vibration',
        },
        {
          event: 'Temperature Rise',
          value: '112 C',
          threshold: '105 C',
          type: 'critical',
          attribute: 'bearingTemp',
        },
      ],
    },
    {
      event: 'Surge Approach',
      type: 'high',
      children: [
        {
          event: 'Surge Margin Drop',
          value: '6%',
          threshold: '10%',
          type: 'high',
          attribute: 'surgeMargin',
        },
      ],
    },
    {
      event: 'Oil System Failure',
      type: 'critical',
      children: [
        {
          event: 'Oil Pressure Drop',
          value: '0.9 bar',
          threshold: '1.0 bar',
          type: 'critical',
          attribute: 'oilPressure',
        },
        {
          event: 'Filter Bypass',
          value: 'Confirmed',
          threshold: null,
          type: 'critical',
          rootCause: true,
        },
      ],
    },
  ],
}


// ── Reliability Metrics (K-101 bar chart) ─────────────────────────────────────

export const RELIABILITY_METRICS = [
  { name: 'Availability', value: 64.2, target: 95 },
  { name: 'Performance',  value: 72.4, target: 92 },
  { name: 'Utilization',  value: 58.1, target: 88 },
]

// ── Downtime by Sub-Asset (K-101 doughnut) ───────────────────────────────────

export const DOWNTIME_BY_SUBASSET = [
  { name: 'Bearings', hours: 48 },
  { name: 'Seals',    hours: 32 },
  { name: 'Impeller', hours: 24 },
  { name: 'Driver',   hours: 18 },
  { name: 'Coupling', hours: 12 },
  { name: 'Valves',   hours: 8  },
]

// ── Maintenance Work Orders summary (K-101 doughnut) ─────────────────────────

export const MAINTENANCE_WORK_ORDERS = {
  open:        2,
  scheduled:   1,
  unscheduled: 3,
  closed:      8,
  onHold:      1,
}

// ── Maintenance KPIs with spark data (K-101) ──────────────────────────────────
// MTBF declining from 420 hrs (6 months ago) -- tells the deterioration story.
// MTTR rising as repairs become more complex.

export const MAINTENANCE_KPIS = [
  {
    label: 'MTBF',
    value: '312 hrs',
    trend: 'down',
    spark: [420, 380, 350, 340, 310, 290, 312],
  },
  {
    label: 'MTTR',
    value: '4.2 hrs',
    trend: 'up',
    spark: [2.1, 2.8, 3.1, 3.5, 3.8, 4.0, 4.2],
  },
  {
    label: 'PM Compliance',
    value: '88%',
    trend: 'stable',
    spark: [92, 90, 89, 87, 88, 87, 88],
  },
]

// ── Performance Attributes (K-101 at time of trip) ───────────────────────────
// Values from STORY-001 "Key attributes at trip" section.
// Thresholds from DESK-RESEARCH-002.
// deviation: percent deviation from expected ((value - expected) / expected * 100)

export const PERFORMANCE_ATTRIBUTES = [
  { attribute: 'Discharge Pressure',  value: 71.0,  expected: 85.0,  unit: 'bar',  deviation: -16.5 },
  { attribute: 'Suction Temperature', value: 98.7,  expected: 95.0,  unit: 'C',    deviation: 3.9   },
  { attribute: 'Bearing Vibration',   value: 7.8,   expected: 2.0,   unit: 'mm/s', deviation: 290.0 },
  { attribute: 'Polytropic Efficiency', value: 72.4, expected: 82.0, unit: '%',    deviation: -11.7 },
  { attribute: 'Surge Margin',        value: 6.0,   expected: 22.0,  unit: '%',    deviation: -72.7 },
  { attribute: 'Shaft Power',         value: 2840,  expected: 2650,  unit: 'kW',   deviation: 7.2   },
  { attribute: 'Oil Pressure',        value: 0.9,   expected: 2.1,   unit: 'bar',  deviation: -57.1 },
  { attribute: 'Bearing Temperature', value: 112,   expected: 68,    unit: 'C',    deviation: 64.7  },
]

// ── Bad Actors (plant level, top 5 by total event count) ─────────────────────
// Computed from ASSETS. Sorted by totalEvents descending, top 5.

export const BAD_ACTORS = ASSETS
  .filter(a => a.totalEvents > 0)
  .map(a => ({ assetId: a.id, name: a.name, events: a.totalEvents, criticality: a.criticality }))
  .sort((a, b) => b.events - a.events)
  .slice(0, 5)

// ── Risk Matrix ───────────────────────────────────────────────────────────────
// Derived from ASSETS (which derives from TIMELINE). Groups by criticality, sums event counts.

export const RISK_MATRIX = ['A', 'B', 'C'].map(crit => {
  const group = ASSETS.filter(a => a.criticality === crit)
  return {
    criticality: crit,
    newEvents: group.reduce((sum, a) => sum + a.newEvents, 0),
    inProgress: group.reduce((sum, a) => sum + a.inProgressEvents, 0),
  }
})

// ── Event Summary (Alarm Quality donut) ───────────────────────────────────────
// Derived from ASSETS (which derives from TIMELINE). Confirmed = inProgress + closed (validated as real).

export const EVENT_SUMMARY = {
  confirmed:      ASSETS.reduce((sum, a) => sum + a.inProgressEvents + a.closedEvents, 0),
  falsePositives: ASSETS.reduce((sum, a) => sum + a.falsePositives, 0),
  newEvents:      ASSETS.reduce((sum, a) => sum + a.newEvents, 0),
  get total() { return this.confirmed + this.falsePositives + this.newEvents },
}
