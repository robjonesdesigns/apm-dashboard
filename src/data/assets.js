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
  oee: 81.5,
  availability: 82.1,
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
  // March: K-101 trip at 2:03 AM drops availability from 94.2 to 82.1
  { month: 'Mar', oee: 81.5, availability: 82.1, performance: 93.8, quality: 99.1 },
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
    priority: 'high',
    oee: 64.2,
    activeEvents: 8,
    repetitiveEvents: 3,
    downtime: '5h',
    workOrders: 2,
    rul: '0 days',
    mtbf: 312,
    mttr: 4.2,
    pmCompliance: 88,
  },
  {
    id: 'P-203',
    name: 'Pump P-203',
    type: 'Centrifugal Pump',
    service: 'Hydrocracker feed pump',
    processUnit: 'Hydrocracker',
    criticality: 'B',
    status: 'degraded',
    priority: 'high',
    oee: 78.4,
    activeEvents: 4,
    repetitiveEvents: 2,
    downtime: '0h',
    workOrders: 1,
    rul: '45 days',
    mtbf: 1820,
    mttr: 6.1,
    pmCompliance: 94,
  },
  {
    id: 'C-201',
    name: 'Cooler C-201',
    type: 'Air Fin Cooler',
    service: 'Compressor interstage cooling',
    processUnit: 'Hydrocracker',
    criticality: 'B',
    status: 'degraded',
    priority: 'medium',
    oee: 82.1,
    activeEvents: 3,
    repetitiveEvents: 1,
    downtime: '0h',
    workOrders: 0,
    rul: '110 days',
    mtbf: 3200,
    mttr: 8.4,
    pmCompliance: 91,
  },
  {
    id: 'T-401',
    name: 'Turbine T-401',
    type: 'Gas Turbine',
    service: 'Power generation turbine',
    processUnit: 'Utilities',
    criticality: 'B',
    status: 'planned-outage',
    priority: 'low',
    oee: 88.1,
    activeEvents: 1,
    repetitiveEvents: 0,
    downtime: '8h',
    workOrders: 1,
    rul: '180 days',
    mtbf: 2800,
    mttr: 96,
    pmCompliance: 100,
  },
  {
    id: 'E-105',
    name: 'Heat Exchanger E-105',
    type: 'Shell and Tube Heat Exchanger',
    service: 'Feed/effluent heat exchange',
    processUnit: 'Hydrocracker',
    criticality: 'C',
    status: 'running',
    priority: 'low',
    oee: 93.7,
    activeEvents: 1,
    repetitiveEvents: 0,
    downtime: '0h',
    workOrders: 0,
    rul: '240 days',
    mtbf: 4800,
    mttr: 12.0,
    pmCompliance: 97,
  },
  {
    id: 'R-301',
    name: 'Reactor R-301',
    type: 'Fixed-Bed Reactor',
    service: 'Hydrocracker reactor',
    processUnit: 'Hydrocracker',
    criticality: 'A',
    status: 'running',
    priority: 'low',
    oee: 95.2,
    activeEvents: 0,
    repetitiveEvents: 0,
    downtime: '0h',
    workOrders: 0,
    rul: '365 days',
    mtbf: 8760,
    mttr: 168,
    pmCompliance: 99,
  },
  {
    id: 'V-501',
    name: 'Vessel V-501',
    type: 'Pressure Vessel',
    service: 'High-pressure separator',
    processUnit: 'Hydrocracker',
    criticality: 'C',
    status: 'running',
    priority: 'low',
    oee: 94.8,
    activeEvents: 0,
    repetitiveEvents: 0,
    downtime: '0h',
    workOrders: 0,
    rul: '300 days',
    mtbf: 6500,
    mttr: 24,
    pmCompliance: 98,
  },
  {
    id: 'P-102',
    name: 'Pump P-102',
    type: 'Centrifugal Pump',
    service: 'Reflux pump',
    processUnit: 'Fractionation',
    criticality: 'C',
    status: 'running',
    priority: 'low',
    oee: 96.1,
    activeEvents: 0,
    repetitiveEvents: 0,
    downtime: '0h',
    workOrders: 0,
    rul: '280 days',
    mtbf: 2400,
    mttr: 5.2,
    pmCompliance: 96,
  },
  {
    id: 'K-302',
    name: 'Compressor K-302',
    type: 'Centrifugal Compressor',
    service: 'Wet gas compressor',
    processUnit: 'FCC',
    criticality: 'A',
    status: 'degraded',
    priority: 'medium',
    oee: 79.3,
    activeEvents: 3,
    repetitiveEvents: 3,
    downtime: '0h',
    workOrders: 0,
    rul: '95 days',
    mtbf: 980,
    mttr: 3.8,
    pmCompliance: 87,
  },
  {
    id: 'T-102',
    name: 'Turbine T-102',
    type: 'Power Recovery Turbine',
    service: 'FCC power recovery turbine',
    processUnit: 'FCC',
    criticality: 'B',
    status: 'running',
    priority: 'low',
    oee: 91.4,
    activeEvents: 1,
    repetitiveEvents: 0,
    downtime: '0h',
    workOrders: 0,
    rul: '200 days',
    mtbf: 2200,
    mttr: 14.0,
    pmCompliance: 95,
  },
]

// ── Timeline of Events (last 24 hours) ───────────────────────────────────────
// Matches STORY-001 table exactly. Most recent last.

export const TIMELINE = [
  {
    time: '1:30 AM',
    type: 'warning',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    event: 'Oil pressure dropped to 1.2 bar, aux pump auto-started',
    kpiImpact: null,
  },
  {
    time: '1:45 AM',
    type: 'critical',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    event: 'Oil pressure alarm: 1.0 bar',
    kpiImpact: null,
  },
  {
    time: '2:00 AM',
    type: 'critical',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    event: 'Vibration spike: 7.8 mm/s (threshold 7.1)',
    kpiImpact: null,
  },
  {
    time: '2:03 AM',
    type: 'critical',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    event: 'COMPRESSOR TRIP on high vibration',
    kpiImpact: 'Availability -12.1%',
  },
  {
    time: '2:10 AM',
    type: 'info',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    event: 'Emergency shutdown sequence completed',
    kpiImpact: 'OEE -5.9%',
  },
  {
    time: '2:15 AM',
    type: 'info',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    event: 'Work order opened: bearing inspection',
    kpiImpact: null,
  },
  {
    time: '2:30 AM',
    type: 'info',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    event: 'Work order opened: lube system flush',
    kpiImpact: null,
  },
  {
    time: '3:00 AM',
    type: 'info',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    event: 'Case opened: root cause analysis',
    kpiImpact: null,
  },
  {
    time: '4:30 AM',
    type: 'warning',
    asset: 'Pump P-203',
    assetId: 'P-203',
    event: 'Discharge pressure 8% below normal',
    kpiImpact: null,
  },
  {
    time: '5:00 AM',
    type: 'info',
    asset: 'Pump P-203',
    assetId: 'P-203',
    event: 'Work order opened: seal inspection',
    kpiImpact: null,
  },
  {
    time: '6:00 AM',
    type: 'info',
    asset: 'Turbine T-401',
    assetId: 'T-401',
    event: 'Planned maintenance window started',
    kpiImpact: null,
  },
  {
    time: '6:45 AM',
    type: 'healthy',
    asset: 'Heat Exchanger E-105',
    assetId: 'E-105',
    event: 'Performance restored after recalibration',
    kpiImpact: 'OEE +0.8%',
  },
]

// ── Work Orders (active at 7:00 AM) ──────────────────────────────────────────

export const WORK_ORDERS = [
  {
    id: 'WO-4481',
    assetId: 'K-101',
    asset: 'Compressor K-101',
    task: 'Bearing inspection and assessment',
    priority: 'critical',
    assignee: 'Sarah Chen',
    status: 'in-progress',
    created: '2:15 AM',
  },
  {
    id: 'WO-4482',
    assetId: 'K-101',
    asset: 'Compressor K-101',
    task: 'Lube oil system flush and filter replacement',
    priority: 'critical',
    assignee: null,
    status: 'open',
    created: '2:30 AM',
  },
  {
    id: 'WO-4483',
    assetId: 'P-203',
    asset: 'Pump P-203',
    task: 'Mechanical seal inspection, discharge side',
    priority: 'high',
    assignee: 'Fred Martinez',
    status: 'in-progress',
    created: '5:00 AM',
  },
  {
    id: 'WO-4484',
    assetId: 'T-401',
    asset: 'Turbine T-401',
    task: 'Combustion inspection (12,000 hr interval)',
    priority: 'medium',
    assignee: 'Mike Torres',
    status: 'in-progress',
    created: '6:00 AM',
  },
]

// ── Cases (active at 7:00 AM) ─────────────────────────────────────────────────

export const CASES = [
  {
    id: 'CS-0891',
    assetId: 'K-101',
    asset: 'Compressor K-101',
    description: 'Root cause analysis: recurring bearing degradation. Vibration alerts ignored for 3 days. Oil filter bypass suspected. Threshold review needed.',
    status: 'investigating',
    linkedWorkOrders: ['WO-4481', 'WO-4482'],
    opened: '3:00 AM',
  },
  {
    id: 'CS-0892',
    assetId: 'C-201',
    asset: 'Cooler C-201',
    description: 'Vibration anomaly on intake valve. Determine if related to K-101 trip transient or independent issue.',
    status: 'open',
    linkedWorkOrders: [],
    opened: '11:00 PM',
  },
]

// ── Notifications (most recent first) ────────────────────────────────────────

export const NOTIFICATIONS = [
  {
    id: 1,
    type: 'healthy',
    asset: 'Heat Exchanger E-105',
    assetId: 'E-105',
    message: 'Performance restored after recalibration',
    time: '6:45 AM',
  },
  {
    id: 2,
    type: 'info',
    asset: 'Turbine T-401',
    assetId: 'T-401',
    message: 'Planned maintenance window started (combustion inspection)',
    time: '6:00 AM',
  },
  {
    id: 3,
    type: 'info',
    asset: 'Pump P-203',
    assetId: 'P-203',
    message: 'Work order WO-4483 opened: mechanical seal inspection',
    time: '5:00 AM',
  },
  {
    id: 4,
    type: 'warning',
    asset: 'Pump P-203',
    assetId: 'P-203',
    message: 'Discharge pressure 8% below normal -- seal wear suspected',
    time: '4:30 AM',
  },
  {
    id: 5,
    type: 'info',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    message: 'Case CS-0891 opened: root cause analysis, recurring bearing degradation',
    time: '3:00 AM',
  },
  {
    id: 6,
    type: 'info',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    message: 'Work order WO-4482 opened: lube oil system flush and filter replacement',
    time: '2:30 AM',
  },
  {
    id: 7,
    type: 'info',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    message: 'Work order WO-4481 opened: bearing inspection and assessment',
    time: '2:15 AM',
  },
  {
    id: 8,
    type: 'info',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    message: 'Emergency shutdown sequence completed',
    time: '2:10 AM',
  },
  {
    id: 9,
    type: 'critical',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    message: 'COMPRESSOR TRIP on high vibration -- Availability -12.1%',
    time: '2:03 AM',
  },
  {
    id: 10,
    type: 'critical',
    asset: 'Compressor K-101',
    assetId: 'K-101',
    message: 'Vibration spike: 7.8 mm/s exceeded trip threshold of 7.1 mm/s',
    time: '2:00 AM',
  },
]

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
      type: 'warning',
      children: [
        {
          event: 'Surge Margin Drop',
          value: '6%',
          threshold: '10%',
          type: 'warning',
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
  { priority: 'High',   newEvents: 2, inProgress: 3 },
  { priority: 'Medium', newEvents: 4, inProgress: 5 },
  { priority: 'Low',    newEvents: 1, inProgress: 2 },
]

// ── Event Summary ─────────────────────────────────────────────────────────────

export const EVENT_SUMMARY = {
  confirmed:      28,
  falsePositives: 6,
  newEvents:      8,
  total:          42,
}
