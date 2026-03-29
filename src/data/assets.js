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

// ── Assets (all 10) ───────────────────────────────────────────────────────────
// criticality: A=Safety/Critical, B=High, C=Medium, D=Low
// status: running | tripped | degraded | planned-outage
// priority: high | medium | low

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
    activeEvents: 8,
    newEvents: 2,
    inProgressEvents: 6,
    repetitiveEvents: 3,
    downtime: '5h',
    workOrders: 2,
    rul: '5 days',
    mtbf: 312,
    mttr: 4.2,
    pmCompliance: 88,
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
    activeEvents: 4,
    newEvents: 1,
    inProgressEvents: 3,
    repetitiveEvents: 2,
    downtime: '0h',
    workOrders: 1,
    rul: '45 days',
    mtbf: 1820,
    mttr: 6.1,
    pmCompliance: 94,
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
    activeEvents: 3,
    newEvents: 2,
    inProgressEvents: 1,
    repetitiveEvents: 1,
    downtime: '0h',
    workOrders: 0,
    rul: '110 days',
    mtbf: 3200,
    mttr: 8.4,
    pmCompliance: 91,
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
    activeEvents: 1,
    newEvents: 0,
    inProgressEvents: 1,
    repetitiveEvents: 0,
    downtime: '0h',
    workOrders: 1,
    rul: '180 days',
    mtbf: 2800,
    mttr: 96,
    pmCompliance: 100,
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
    activeEvents: 1,
    newEvents: 1,
    inProgressEvents: 0,
    repetitiveEvents: 0,
    downtime: '0h',
    workOrders: 0,
    rul: '240 days',
    mtbf: 4800,
    mttr: 12.0,
    pmCompliance: 97,
    narrative: 'E-105 preheats hydrocracker feed using hot reactor effluent. Two months ago the refinery shifted to a heavier crude slate. Heavier feed produces more asphaltene precursors that deposit on tube surfaces faster than the fouling model predicted. Feed outlet temperature is 6C lower than expected. Model predicted this fouling at month 8; happened at month 4. Investigation CS-0896 checking whether accelerated fouling is purely from feed change or if there is a tube leak. Lab results pending. Exchanger still running, fired heater downstream compensates but burns more fuel.',
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
    activeEvents: 0,
    newEvents: 0,
    inProgressEvents: 0,
    repetitiveEvents: 0,
    downtime: '0h',
    workOrders: 0,
    rul: '365 days',
    mtbf: 8760,
    mttr: 168,
    pmCompliance: 99,
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
    activeEvents: 0,
    newEvents: 0,
    inProgressEvents: 0,
    repetitiveEvents: 0,
    downtime: '0h',
    workOrders: 0,
    rul: '300 days',
    mtbf: 6500,
    mttr: 24,
    pmCompliance: 98,
    narrative: 'V-501 separates hydrogen-rich gas from liquid product downstream of reactor. When K-101 tripped, sudden loss of recycle gas compression caused pressure transient. V-501 saw brief spike from 152 bar to 161 bar over 90 seconds before control systems stabilized it. Design pressure is 180 bar. Relief valve did not lift. No damage. Operations flagged because any unexpected pressure excursion on a high-pressure hydrogen vessel gets documented. Investigation CS-0898 is verification: confirm no damage, review pressure trace, close it out.',
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
    activeEvents: 0,
    newEvents: 0,
    inProgressEvents: 0,
    repetitiveEvents: 0,
    downtime: '0h',
    workOrders: 0,
    rul: '280 days',
    mtbf: 2400,
    mttr: 5.2,
    pmCompliance: 96,
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
    activeEvents: 3,
    newEvents: 1,
    inProgressEvents: 2,
    repetitiveEvents: 3,
    downtime: '0h',
    workOrders: 0,
    rul: '95 days',
    mtbf: 980,
    mttr: 3.8,
    pmCompliance: 87,
    narrative: 'Operations noticed discharge temperature swinging by 8-10C every few minutes. Control room initially blamed the anti-surge control valve (hunting). WO-4494 opened to stroke-test the valve. Investigation CS-0893 started as a controls issue. Root cause: polymer fouling on the first-stage impeller blades. FCC wet gas carries heavy hydrocarbons that polymerize on blade surfaces. Buildup is uneven, so compressor oscillates between restricted flow (fouled) and partial break-off (cleaner). Control valve is responding correctly to the oscillation, not causing it.',
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
    activeEvents: 1,
    newEvents: 1,
    inProgressEvents: 0,
    repetitiveEvents: 0,
    downtime: '0h',
    workOrders: 0,
    rul: '200 days',
    mtbf: 2200,
    mttr: 14.0,
    pmCompliance: 95,
    narrative: 'T-102 recovers energy from FCC flue gas. Running 14 months since last overhaul. Exhaust temperature spread widening over three weeks: 12C three weeks ago, now 22C. Alarm threshold is 30C. Root cause: two of eight fuel nozzles developing coke deposits. Coking restricts fuel flow, those nozzles run lean, other six compensate rich. Uneven combustion creates hot spots near clean nozzles, cool spots near coked ones. At current rate, spread hits 30C alarm in about two weeks, triggering forced outage. Investigation CS-0895 monitoring to decide whether to schedule cleaning now or wait.',
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
  },
]

// ── Timeline of Events (last 24 hours) ───────────────────────────────────────
// 11 real equipment events. Chronological (earliest first).
// WO creation and case opening are system actions, tracked in WORK_ORDERS/CASES.
// Each event has full metadata with provenance (source, confidence, status) and relationships.

export const TIMELINE = [
  {
    id: 'EVT-001',
    name: 'Discharge Temperature Oscillation',
    time: '11:00 PM',
    timeNote: 'previous day',
    type: 'medium',
    asset: 'Compressor K-302',
    assetId: 'K-302',
    subAsset: 'First-Stage Impeller',
    subAssetId: 'K-302-IMP1',
    event: 'Discharge temperature oscillating +/-8C every few minutes',
    status: 'confirmed',
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
    linkedWOs: ['WO-4494'],
    linkedInvestigations: ['CS-0893'],
  },
  {
    id: 'EVT-002',
    name: 'Oil Pressure Drop',
    time: '1:30 AM',
    type: 'high',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Lube Oil System',
    subAssetId: 'K-101-LOS',
    event: 'Oil pressure dropped to 1.2 bar, aux pump auto-started',
    status: 'confirmed',
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
    linkedWOs: [],
    linkedInvestigations: [],
  },
  {
    id: 'EVT-003',
    name: 'Oil Pressure Alarm',
    time: '1:45 AM',
    type: 'critical',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Lube Oil System',
    subAssetId: 'K-101-LOS',
    event: 'Oil pressure alarm: 1.0 bar (threshold 1.5 bar)',
    status: 'confirmed',
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
    linkedWOs: [],
    linkedInvestigations: [],
  },
  {
    id: 'EVT-004',
    name: 'Vibration Exceedance',
    time: '2:00 AM',
    type: 'critical',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Drive End Bearing',
    subAssetId: 'K-101-DE',
    event: 'Vibration spike: 7.8 mm/s (trip threshold 7.1 mm/s)',
    status: 'confirmed',
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
    linkedWOs: [],
    linkedInvestigations: [],
  },
  {
    id: 'EVT-005',
    name: 'Compressor Trip',
    time: '2:03 AM',
    type: 'critical',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Drive End Bearing',
    subAssetId: 'K-101-DE',
    event: 'COMPRESSOR TRIP on high vibration',
    status: 'confirmed',
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
      text: 'Compressor isolated and depressured. Plant availability dropped 12.1%, OEE dropped 5.9%. Recycle gas flow to hydrocracker lost -- standby compressor picking up duty but slowly, causing temporary throughput reduction. Downstream cascade: V-501 saw pressure transient to 161 bar (EVT-006), C-201 fan belt shifted from piping transient (EVT-007). Two emergency work orders and two investigations opened immediately.',
      source: 'system',
      confidence: null,
      updatedBy: 'KPI Engine',
      updatedAt: '2:03 AM',
      status: 'confirmed',
    },
    recommendation: {
      text: 'Complete bearing inspection (WO-4481). Flush and replace lube oil system filters (WO-4482). Initiate formal root cause analysis (CS-0891) with focus on: why did vibration alerts go unaddressed for 3 days? Why was filter DP alarm threshold set too high to catch the bypass? Review alarm threshold adequacy across all critical compressors (CS-0897).',
      source: 'human',
      confidence: null,
      updatedBy: 'Carlos Mendez',
      updatedAt: '6:55 AM',
      status: 'confirmed',
    },
    kpiImpact: 'Availability -12.1%, OEE -5.9%',
    linkedWOs: ['WO-4481', 'WO-4482'],
    linkedInvestigations: ['CS-0891', 'CS-0897'],
  },
  {
    id: 'EVT-006',
    name: 'Pressure Transient',
    time: '2:04 AM',
    type: 'medium',
    asset: 'Vessel V-501',
    assetId: 'V-501',
    subAsset: 'Vessel Shell',
    subAssetId: 'V-501-SHL',
    event: 'Pressure spike to 161 bar (design 180 bar) during K-101 trip',
    status: 'confirmed',
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
      text: 'Pull the pressure trace from the historian and confirm no sustained overpressure above 165 bar (alarm threshold). Verify vessel integrity per API 510 standard protocol. Review whether control system response time was adequate or if a faster depressure path is needed. Close investigation CS-0898 once documentation is complete.',
      source: 'human',
      confidence: null,
      updatedBy: 'Carlos Mendez',
      updatedAt: '6:55 AM',
      status: 'confirmed',
    },
    kpiImpact: 'Pressure excursion to 161 bar',
    linkedWOs: [],
    linkedInvestigations: ['CS-0898'],
  },
  {
    id: 'EVT-007',
    name: 'Fan Vibration Anomaly',
    time: '2:05 AM',
    type: 'medium',
    asset: 'Cooler C-201',
    assetId: 'C-201',
    subAsset: 'Fan Assembly',
    subAssetId: 'C-201-FAN',
    event: 'Fan vibration spiking to 4.8 mm/s during belt slip events',
    status: 'confirmed',
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
      text: 'Cooler process side is completely unaffected -- tubes are clean, fouling factor normal at 0.0003 m2K/W, heat transfer performance is fine. This is purely a mechanical issue on the air side. The investigation question (CS-0892) is whether this was triggered by the K-101 trip or was developing independently. Answer: both. The belt was already degrading; the transient accelerated the failure. If belt tension drops below 75%, the fan could stall entirely and interstage cooling would be lost, forcing a compression limit.',
      source: 'human',
      confidence: null,
      updatedBy: 'Carlos Mendez',
      updatedAt: '6:55 AM',
      status: 'confirmed',
    },
    recommendation: {
      text: 'Schedule belt tension adjustment or replacement (WO-4498 already open). Inspect sheave alignment while belt is off. Determine whether belt replacement interval needs shortening based on condition found. Close investigation CS-0892 with finding: pre-existing degradation accelerated by trip transient -- both causes contributed.',
      source: 'human',
      confidence: null,
      updatedBy: 'Carlos Mendez',
      updatedAt: '6:55 AM',
      status: 'confirmed',
    },
    kpiImpact: null,
    linkedWOs: ['WO-4498'],
    linkedInvestigations: ['CS-0892'],
  },
  {
    id: 'EVT-008',
    name: 'Shutdown Complete',
    time: '2:10 AM',
    type: 'low',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Anti-Surge Valve',
    subAssetId: 'K-101-ASV',
    event: 'Emergency shutdown sequence completed safely',
    status: 'confirmed',
    incidentId: 'INC-001',
    relationships: [
      { type: 'caused_by', eventId: 'EVT-005' },
    ],
    cause: {
      text: 'Automatic emergency shutdown sequence initiated 7 minutes after compressor trip (EVT-005). Anti-surge valve opened fully to depressure the casing. Suction and discharge isolation valves closed in sequence. Seal gas system maintained pressure during depressurization to prevent process gas ingress. Lube oil system continued running on auxiliary pump to cool bearings during coastdown.',
      source: 'system',
      confidence: null,
      updatedBy: 'Protection System',
      updatedAt: '2:10 AM',
      status: 'confirmed',
    },
    consequence: {
      text: 'Compressor fully isolated and depressured within 7 minutes. No secondary damage to mechanical seal (seal gas DP held at 3.2 bar), coupling (alignment unchanged at 0.05 mm), or rotor (axial displacement stable at 0.12 mm). The protection system worked as designed -- the problem was not the shutdown response, it was the 3 days of missed signals before it.',
      source: 'system',
      confidence: null,
      updatedBy: 'Auto-detection',
      updatedAt: '2:10 AM',
      status: 'confirmed',
    },
    recommendation: {
      text: 'Verify all isolation valves are in correct locked-out position. Confirm zero residual pressure in casing. Maintain lube oil circulation for bearing cooldown. Do not attempt restart until bearing inspection (WO-4481) and lube oil flush (WO-4482) are complete. Document shutdown sequence timing for CS-0891 root cause analysis.',
      source: 'human',
      confidence: null,
      updatedBy: 'Carlos Mendez',
      updatedAt: '6:55 AM',
      status: 'confirmed',
    },
    kpiImpact: null,
    linkedWOs: ['WO-4481', 'WO-4482'],
    linkedInvestigations: ['CS-0891'],
  },
  {
    id: 'EVT-009',
    name: 'Discharge Pressure Low',
    time: '4:30 AM',
    type: 'high',
    asset: 'Pump P-203',
    assetId: 'P-203',
    subAsset: 'Mechanical Seal (Discharge)',
    subAssetId: 'P-203-SEAL',
    event: 'Discharge pressure 8% below normal, seal leakage at 4.2 L/hr',
    status: 'confirmed',
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
      text: 'Complete seal inspection (WO-4483) but do not just replace the seal again. Investigate shaft runout and coupling alignment as root cause (CS-0894). Measure alignment offset before and after any seal work. If alignment exceeds 0.10 mm, correct it before installing the new seal. Review maintenance records for the second seal replacement to determine when alignment was last verified.',
      source: 'human',
      confidence: null,
      updatedBy: 'Sarah Chen',
      updatedAt: '5:15 AM',
      status: 'confirmed',
    },
    kpiImpact: null,
    linkedWOs: ['WO-4483'],
    linkedInvestigations: ['CS-0894'],
  },
  {
    id: 'EVT-010',
    name: 'Maintenance Window Opened',
    time: '6:00 AM',
    type: 'low',
    asset: 'Turbine T-401',
    assetId: 'T-401',
    subAsset: 'Combustion Section',
    subAssetId: 'T-401-CMB',
    event: 'Planned 12,000-hour combustion inspection window opened',
    status: 'confirmed',
    incidentId: null,
    relationships: [],
    cause: {
      text: 'Scheduled preventive maintenance at the 12,000-hour combustion inspection interval. This inspection was planned weeks ago. Maintenance crew, external contractors, replacement parts, and scaffolding are all staged and ready. Previous inspections at 6,000 and 9,000 hours found only minor coating wear within expected limits. The turbine is healthy -- exhaust temperature spread at 18C (alarm 25C), all flames detected, vibration nominal.',
      source: 'system',
      confidence: null,
      updatedBy: 'Maintenance Scheduler',
      updatedAt: '6:00 AM',
      status: 'confirmed',
    },
    consequence: {
      text: 'The turbine is still running. The inspection has not started. K-101 tripped at 2:03 AM, and the plant is now operating with reduced availability and the standby compressor under load. Shutting down T-401 for inspection removes 18.4 MW of generation capacity during a period when the plant is already stressed. Deferring the inspection means releasing the contractor crew on standby fees and pushing the schedule by at least a week, which risks overlapping with other planned outages. The morning huddle needs to weigh current power margin against maintenance backlog risk.',
      source: 'human',
      confidence: null,
      updatedBy: 'Mike Torres',
      updatedAt: '6:15 AM',
      status: 'confirmed',
    },
    recommendation: {
      text: 'Assess current plant power margin with K-101 down and standby compressor running. Calculate whether losing T-401 output (18.4 MW) would stress the grid or force load shedding. If margin is tight, defer inspection one week and release contractors with standby agreement. If margin is adequate, proceed as scheduled to avoid accumulating maintenance backlog. Document the decision rationale either way.',
      source: 'human',
      confidence: null,
      updatedBy: 'Mike Torres',
      updatedAt: '6:15 AM',
      status: 'confirmed',
    },
    kpiImpact: null,
    linkedWOs: ['WO-4484'],
    linkedInvestigations: [],
  },
  {
    id: 'EVT-011',
    name: 'Bearing Damage Confirmed',
    time: '6:45 AM',
    type: 'critical',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    subAsset: 'Drive End Bearing',
    subAssetId: 'K-101-DE',
    event: 'Manual inspection confirmed bearing damage, RUL revised to 5 days',
    status: 'confirmed',
    incidentId: 'INC-001',
    relationships: [
      { type: 'related_to', eventId: 'EVT-005' },
      { type: 'related_to', eventId: 'EVT-002' },
    ],
    cause: {
      text: 'Morning shift inspection of drive end bearing confirmed mechanical damage consistent with contaminated lubrication over an extended period. Babbitt surface shows scoring and wiping on the loaded zone. Journal surface has visible wear tracks from particulate contamination in the oil film. Oil sample from the bearing drain shows elevated particle count (22/19/16 ISO 4406) and metallic debris consistent with babbitt material. Damage pattern matches the vibration signature recorded over the past 3 days -- the bearing was failing progressively, not suddenly.',
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
      text: 'Expedite bearing procurement -- confirm lead time and availability of replacement journal bearing set. Schedule replacement coordinated with lube oil system flush (WO-4482) so both are completed before restart attempt. Photograph bearing damage for CS-0891 root cause report. Continue alarm threshold review (CS-0897) -- the filter DP alarm was set too high to catch the bypass, and vibration alerts were generated but not acted on for 3 days. Both failures in the alert system need to be addressed before this compressor returns to service.',
      source: 'human',
      confidence: null,
      updatedBy: 'Sarah Chen',
      updatedAt: '6:45 AM',
      status: 'confirmed',
    },
    kpiImpact: 'RUL revised to 5 days',
    linkedWOs: ['WO-4481', 'WO-4482'],
    linkedInvestigations: ['CS-0891', 'CS-0897'],
  },
]

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
    eventIds: ['EVT-002', 'EVT-003', 'EVT-004', 'EVT-005', 'EVT-006', 'EVT-007', 'EVT-008', 'EVT-011'],
    linkedWOs: ['WO-4481', 'WO-4482', 'WO-4498'],
    linkedInvestigations: ['CS-0891', 'CS-0892', 'CS-0897', 'CS-0898'],
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
    status: 'in-progress',
    created: '2:15 AM',
    eventId: 'EVT-005',
    linkedInvestigations: ['CS-0891'],
  },
  {
    id: 'WO-4482',
    assetId: 'K-101',
    asset: 'Compressor K-101',
    task: 'Lube oil system flush and filter replacement',
    urgency: 'emergency',
    assignee: null,
    status: 'open',
    created: '2:30 AM',
    eventId: 'EVT-005',
    linkedInvestigations: ['CS-0891'],
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
    eventId: 'EVT-009',
    linkedInvestigations: ['CS-0894'],
  },
  {
    id: 'WO-4484',
    assetId: 'T-401',
    asset: 'Turbine T-401',
    task: 'Combustion inspection (12,000 hr interval)',
    urgency: 'scheduled',
    assignee: 'Mike Torres',
    status: 'in-progress',
    created: '6:00 AM',
    eventId: 'EVT-010',
    linkedInvestigations: [],
  },
  // Additional work orders -- eventId null for routine/preventive WOs not triggered by an acute event
  { id: 'WO-4485', assetId: 'P-102', asset: 'Pump P-102', task: 'Quarterly vibration baseline measurement', urgency: 'scheduled', assignee: 'James Park', status: 'in-progress', created: 'Yesterday', eventId: null, linkedInvestigations: [] },
  { id: 'WO-4486', assetId: 'V-501', asset: 'Vessel V-501', task: 'Pressure relief valve test and recertification', urgency: 'scheduled', assignee: 'Sarah Chen', status: 'open', created: 'Yesterday', eventId: null, linkedInvestigations: [] },
  { id: 'WO-4487', assetId: 'E-105', asset: 'Heat Exchanger E-105', task: 'Tube bundle fouling assessment', urgency: 'scheduled', assignee: null, status: 'open', created: '2 days ago', eventId: null, linkedInvestigations: ['CS-0896'] },
  { id: 'WO-4488', assetId: 'T-102', asset: 'Turbine T-102', task: 'Borescope inspection preparation', urgency: 'scheduled', assignee: 'Mike Torres', status: 'open', created: '2 days ago', eventId: null, linkedInvestigations: ['CS-0895'] },
  { id: 'WO-4489', assetId: 'R-301', asset: 'Reactor R-301', task: 'Catalyst bed thermocouple calibration', urgency: 'scheduled', assignee: null, status: 'open', created: '3 days ago', eventId: null, linkedInvestigations: [] },
  { id: 'WO-4490', assetId: 'K-302', asset: 'Compressor K-302', task: 'Discharge temperature sensor replacement', urgency: 'scheduled', assignee: 'Fred Martinez', status: 'open', created: '3 days ago', eventId: null, linkedInvestigations: ['CS-0893'] },
  { id: 'WO-4491', assetId: 'P-102', asset: 'Pump P-102', task: 'Coupling alignment check', urgency: 'scheduled', assignee: null, status: 'open', created: '4 days ago', eventId: null, linkedInvestigations: [] },
  { id: 'WO-4492', assetId: 'E-105', asset: 'Heat Exchanger E-105', task: 'Shell-side UT thickness survey', urgency: 'scheduled', assignee: null, status: 'open', created: '4 days ago', eventId: null, linkedInvestigations: [] },
  { id: 'WO-4493', assetId: 'V-501', asset: 'Vessel V-501', task: 'Level transmitter recalibration', urgency: 'scheduled', assignee: null, status: 'open', created: '5 days ago', eventId: null, linkedInvestigations: [] },
  { id: 'WO-4494', assetId: 'K-302', asset: 'Compressor K-302', task: 'Anti-surge valve stroke test', urgency: 'scheduled', assignee: null, status: 'open', created: '5 days ago', eventId: 'EVT-001', linkedInvestigations: ['CS-0893'] },
  { id: 'WO-4495', assetId: 'T-102', asset: 'Turbine T-102', task: 'Exhaust temperature profile review', urgency: 'scheduled', assignee: null, status: 'open', created: '6 days ago', eventId: null, linkedInvestigations: ['CS-0895'] },
  { id: 'WO-4496', assetId: 'P-203', asset: 'Pump P-203', task: 'Suction strainer cleaning', urgency: 'scheduled', assignee: null, status: 'open', created: '1 week ago', eventId: null, linkedInvestigations: [] },
  { id: 'WO-4497', assetId: 'R-301', asset: 'Reactor R-301', task: 'Hydrogen analyzer calibration', urgency: 'scheduled', assignee: 'Sarah Chen', status: 'open', created: '1 week ago', eventId: null, linkedInvestigations: [] },
  { id: 'WO-4498', assetId: 'C-201', asset: 'Cooler C-201', task: 'Fan belt tension check', urgency: 'scheduled', assignee: null, status: 'open', created: '1 week ago', eventId: 'EVT-007', linkedInvestigations: ['CS-0892'] },
  { id: 'WO-4499', assetId: 'E-105', asset: 'Heat Exchanger E-105', task: 'Gasket inventory verification', urgency: 'scheduled', assignee: null, status: 'open', created: '1 week ago', eventId: null, linkedInvestigations: [] },
  { id: 'WO-4500', assetId: 'K-302', asset: 'Compressor K-302', task: 'Lube oil sample and analysis', urgency: 'scheduled', assignee: 'Fred Martinez', status: 'open', created: '1 week ago', eventId: null, linkedInvestigations: [] },
  { id: 'WO-4501', assetId: 'T-401', asset: 'Turbine T-401', task: 'Inlet air filter differential pressure check', urgency: 'scheduled', assignee: null, status: 'open', created: '2 weeks ago', eventId: null, linkedInvestigations: [] },
  { id: 'WO-4502', assetId: 'V-501', asset: 'Vessel V-501', task: 'Corrosion coupon retrieval and analysis', urgency: 'scheduled', assignee: null, status: 'open', created: '2 weeks ago', eventId: null, linkedInvestigations: [] },
  { id: 'WO-4503', assetId: 'P-102', asset: 'Pump P-102', task: 'Motor insulation resistance test', urgency: 'scheduled', assignee: null, status: 'open', created: '2 weeks ago', eventId: null, linkedInvestigations: [] },
  { id: 'WO-4504', assetId: 'R-301', asset: 'Reactor R-301', task: 'Safety valve inspection scheduling', urgency: 'scheduled', assignee: null, status: 'open', created: '2 weeks ago', eventId: null, linkedInvestigations: [] },
  { id: 'WO-4505', assetId: 'K-101', asset: 'Compressor K-101', task: 'Vibration probe gap voltage verification', urgency: 'scheduled', assignee: null, status: 'open', created: '3 weeks ago', eventId: null, linkedInvestigations: [] },
]

// ── Cases (active at 7:00 AM) ─────────────────────────────────────────────────

export const CASES = [
  {
    id: 'CS-0891',
    assetId: 'K-101',
    asset: 'Compressor K-101',
    description: 'Root cause analysis: recurring bearing degradation. Vibration alerts ignored for 3 days. Oil filter bypass suspected. Threshold review needed.',
    status: 'investigating',
    assignee: 'Carlos Mendez',
    linkedWorkOrders: ['WO-4481', 'WO-4482'],
    linkedEvents: ['EVT-002', 'EVT-003', 'EVT-004', 'EVT-005', 'EVT-008', 'EVT-011'],
    incidentId: 'INC-001',
    opened: '3:00 AM',
  },
  {
    id: 'CS-0892',
    assetId: 'C-201',
    asset: 'Cooler C-201',
    description: 'Vibration anomaly on fan assembly. Determine if related to K-101 trip transient or independent belt degradation.',
    status: 'open',
    assignee: null,
    linkedWorkOrders: ['WO-4498'],
    linkedEvents: ['EVT-007'],
    incidentId: 'INC-001',
    opened: '2:15 AM',
  },
  { id: 'CS-0893', assetId: 'K-302', asset: 'Compressor K-302', description: 'Discharge temperature oscillation pattern. Determine if control valve hunting or early-stage fouling.', status: 'open', assignee: null, linkedWorkOrders: ['WO-4494'], linkedEvents: ['EVT-001'], incidentId: null, opened: '2 days ago' },
  { id: 'CS-0894', assetId: 'P-203', asset: 'Pump P-203', description: 'Recurring seal leakage. Third seal replacement in 6 months. Investigate shaft runout or alignment root cause.', status: 'investigating', assignee: 'Sarah Chen', linkedWorkOrders: ['WO-4483'], linkedEvents: ['EVT-009'], incidentId: null, opened: '4 days ago' },
  { id: 'CS-0895', assetId: 'T-102', asset: 'Turbine T-102', description: 'Gradual exhaust temperature spread widening. Monitor for combustion liner degradation.', status: 'open', assignee: null, linkedWorkOrders: ['WO-4488', 'WO-4495'], linkedEvents: [], incidentId: null, opened: '1 week ago' },
  { id: 'CS-0896', assetId: 'E-105', asset: 'Heat Exchanger E-105', description: 'Heat duty declining faster than fouling model predicts. Investigate potential tube leak.', status: 'open', assignee: null, linkedWorkOrders: ['WO-4487'], linkedEvents: [], incidentId: null, opened: '1 week ago' },
  { id: 'CS-0897', assetId: 'K-101', asset: 'Compressor K-101', description: 'Historical review: alarm threshold adequacy across all critical compressors. Initiated after K-101 trip.', status: 'open', assignee: null, linkedWorkOrders: [], linkedEvents: ['EVT-005'], incidentId: 'INC-001', opened: '3:30 AM' },
  { id: 'CS-0898', assetId: 'V-501', asset: 'Vessel V-501', description: 'Unexpected pressure fluctuation during K-101 trip transient. Confirm vessel integrity.', status: 'open', assignee: null, linkedWorkOrders: [], linkedEvents: ['EVT-006'], incidentId: 'INC-001', opened: '2:10 AM' },
]

// ── Notifications (most recent first) ────────────────────────────────────────
// Derived from TIMELINE events. Same data, reverse chronological for the panel.
// Each notification carries its full metadata so EventDetails can render directly.

export const NOTIFICATIONS = TIMELINE.slice().reverse().map((evt, i) => ({
  id: i + 1,
  eventId: evt.id,
  type: evt.type,
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
  linkedWOs: evt.linkedWOs,
  linkedInvestigations: evt.linkedInvestigations,
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
  event: 'Compressor Trip',
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

// ── Asset Specs (K-101 header panel) ─────────────────────────────────────────

export const ASSET_SPECS = [
  { label: 'Service',       value: 'H2 Recycle Gas' },
  { label: 'Process Unit',  value: 'Hydrocracker' },
  { label: 'Criticality',   value: 'A (Safety)' },
  { label: 'Status',        value: 'Tripped' },
  { label: 'Type',          value: 'Centrifugal Compressor' },
  { label: 'Class',         value: 'API 617' },
  { label: 'Manufacturer',  value: 'Elliott Group' },
  { label: 'Installed',     value: '2018' },
]

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

// ── Bad Actors (plant level, top 5 by event count) ───────────────────────────

export const BAD_ACTORS = [
  { assetId: 'K-101', name: 'Compressor K-101',    events: 18, criticality: 'A' },
  { assetId: 'P-203', name: 'Pump P-203',          events: 8,  criticality: 'B' },
  { assetId: 'K-302', name: 'Compressor K-302',    events: 6,  criticality: 'A' },
  { assetId: 'C-201', name: 'Cooler C-201',        events: 4,  criticality: 'B' },
  { assetId: 'T-401', name: 'Turbine T-401',       events: 2,  criticality: 'B' },
]

// ── Risk Matrix ───────────────────────────────────────────────────────────────

export const RISK_MATRIX = [
  { criticality: 'A', newEvents: 3, inProgress: 8 },
  { criticality: 'B', newEvents: 4, inProgress: 5 },
  { criticality: 'C', newEvents: 1, inProgress: 0 },
]

// ── Event Summary (Alarm Quality donut) ───────────────────────────────────────
// "New" here = unvalidated signal (different from "New" in RISK_MATRIX = unassigned)

export const EVENT_SUMMARY = {
  confirmed:      13,
  falsePositives: 3,
  newEvents:      5,
  total:          21,
}
