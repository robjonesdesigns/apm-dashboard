// ── Sample asset data for APM Dashboard ──────────────────────────────────────
// Realistic industrial asset names and metrics.

export const PLANT = {
  name: 'Baytown Refinery',
  location: 'Baytown, TX',
  oee: 87.4,
  availability: 92.1,
  performance: 94.8,
  quality: 99.2,
  trains: 4,
  activeAssets: 142,
  totalAssets: 168,
}

// OEE trend data (last 12 months)
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
  { month: 'Mar', oee: 87.4, availability: 92.1, performance: 94.8, quality: 99.2 },
]

// Risk Matrix data
export const RISK_MATRIX = [
  { priority: 'High', newEvents: 3, inProgress: 5 },
  { priority: 'Medium', newEvents: 8, inProgress: 12 },
  { priority: 'Low', newEvents: 4, inProgress: 7 },
]

// Event Summary
export const EVENT_SUMMARY = {
  confirmed: 42,
  falsePositives: 18,
  newEvents: 14,
  total: 74,
}

// Bad Actors (top assets by event count)
export const BAD_ACTORS = [
  { name: 'Compressor K-101', events: 18, criticality: 'critical' },
  { name: 'Pump P-203',       events: 14, criticality: 'warning' },
  { name: 'Turbine T-401',    events: 11, criticality: 'warning' },
  { name: 'Heat Exchanger E-105', events: 9, criticality: 'healthy' },
  { name: 'Reactor R-301',    events: 7, criticality: 'healthy' },
]

// Asset Summary table
export const ASSET_SUMMARY = [
  { id: 'K-101', name: 'Compressor K-101', status: 'Critical',  priority: 'High',   oee: 64.2, activeEvents: 8,  repetitiveEvents: 3, downtime: '142h', workOrders: 5,  rul: '45 days' },
  { id: 'P-203', name: 'Pump P-203',       status: 'Warning',   priority: 'High',   oee: 72.8, activeEvents: 6,  repetitiveEvents: 4, downtime: '89h',  workOrders: 3,  rul: '90 days' },
  { id: 'T-401', name: 'Turbine T-401',    status: 'Warning',   priority: 'Medium', oee: 78.4, activeEvents: 5,  repetitiveEvents: 2, downtime: '67h',  workOrders: 4,  rul: '120 days' },
  { id: 'E-105', name: 'Heat Exchanger E-105', status: 'Healthy', priority: 'Medium', oee: 88.1, activeEvents: 3,  repetitiveEvents: 1, downtime: '24h',  workOrders: 2,  rul: '180 days' },
  { id: 'R-301', name: 'Reactor R-301',    status: 'Healthy',   priority: 'Low',    oee: 91.3, activeEvents: 2,  repetitiveEvents: 0, downtime: '12h',  workOrders: 1,  rul: '240 days' },
  { id: 'V-501', name: 'Vessel V-501',     status: 'Healthy',   priority: 'Low',    oee: 93.7, activeEvents: 1,  repetitiveEvents: 0, downtime: '8h',   workOrders: 1,  rul: '300 days' },
  { id: 'P-102', name: 'Pump P-102',       status: 'Healthy',   priority: 'Low',    oee: 95.2, activeEvents: 0,  repetitiveEvents: 0, downtime: '3h',   workOrders: 0,  rul: '365 days' },
  { id: 'C-201', name: 'Cooler C-201',     status: 'Warning',   priority: 'Medium', oee: 76.5, activeEvents: 4,  repetitiveEvents: 2, downtime: '56h',  workOrders: 2,  rul: '110 days' },
  { id: 'T-102', name: 'Turbine T-102',    status: 'Healthy',   priority: 'Low',    oee: 89.9, activeEvents: 1,  repetitiveEvents: 0, downtime: '15h',  workOrders: 1,  rul: '200 days' },
  { id: 'K-302', name: 'Compressor K-302', status: 'Warning',   priority: 'Medium', oee: 74.1, activeEvents: 5,  repetitiveEvents: 3, downtime: '78h',  workOrders: 3,  rul: '95 days' },
]

// Notifications
export const NOTIFICATIONS = [
  { id: 1, type: 'critical', asset: 'Compressor K-101', message: 'Bearing vibration exceeded threshold (4.2mm/s)', time: '2 min ago' },
  { id: 2, type: 'warning',  asset: 'Pump P-203',       message: 'Discharge pressure trending below normal', time: '15 min ago' },
  { id: 3, type: 'critical', asset: 'Compressor K-101', message: 'Temperature anomaly detected on Stage 2', time: '28 min ago' },
  { id: 4, type: 'info',     asset: 'Turbine T-401',    message: 'Scheduled maintenance window in 48 hours', time: '1 hr ago' },
  { id: 5, type: 'warning',  asset: 'Cooler C-201',     message: 'Coolant flow rate deviation detected', time: '2 hr ago' },
  { id: 6, type: 'healthy',  asset: 'Reactor R-301',    message: 'Performance restored after recalibration', time: '3 hr ago' },
  { id: 7, type: 'critical', asset: 'Compressor K-101', message: 'Oil pressure drop below minimum threshold', time: '4 hr ago' },
  { id: 8, type: 'info',     asset: 'Pump P-102',       message: 'Routine inspection completed', time: '5 hr ago' },
]

// ── Asset Details data (for Compressor K-101) ────────────────────────────────

export const ASSET_DETAIL = {
  name: 'Compressor K-101',
  type: 'Centrifugal Compressor',
  criticality: 'Safety',
  status: 'Critical',
  processUnit: 'Hydrogen Recovery Unit',
  service: 'H2 Recycle Gas',
  class: 'API 617',
}

// Reliability row
export const RELIABILITY = {
  // Availability / Performance / Utilization bar chart
  metrics: [
    { name: 'Availability', value: 78.4, target: 95 },
    { name: 'Performance', value: 85.2, target: 92 },
    { name: 'Utilization', value: 71.8, target: 88 },
  ],
  // Run status timeline (last 7 days, hourly blocks)
  runStatus: (() => {
    const statuses = []
    const events = [
      { hour: 12, type: 'trip', label: 'Compressor Trip' },
      { hour: 38, type: 'warning', label: 'High Vibration' },
      { hour: 52, type: 'shutdown', label: 'Planned Shutdown' },
      { hour: 53, type: 'shutdown', label: 'Planned Shutdown' },
      { hour: 54, type: 'shutdown', label: 'Planned Shutdown' },
      { hour: 55, type: 'shutdown', label: 'Planned Shutdown' },
      { hour: 98, type: 'trip', label: 'Surge Event' },
      { hour: 130, type: 'warning', label: 'Bearing Temp High' },
    ]
    for (let h = 0; h < 168; h++) {
      const event = events.find(e => e.hour === h)
      statuses.push({
        hour: h,
        day: Math.floor(h / 24),
        running: !event || event.type === 'warning',
        event: event || null,
      })
    }
    return statuses
  })(),
  // Downtime by sub-asset (doughnut)
  downtimeBySubAsset: [
    { name: 'Bearings', hours: 48, color: '#ef4444' },
    { name: 'Seals', hours: 32, color: '#f59e0b' },
    { name: 'Impeller', hours: 24, color: '#3b82f6' },
    { name: 'Driver', hours: 18, color: '#a78bfa' },
    { name: 'Coupling', hours: 12, color: '#2dd4bf' },
    { name: 'Valves', hours: 8, color: '#22c55e' },
  ],
}

// Maintenance row
export const MAINTENANCE = {
  // Bad actors (sub-asset level)
  badActors: [
    { name: 'Bearings', events: 12 },
    { name: 'Seals', events: 8 },
    { name: 'Impeller', events: 6 },
    { name: 'Driver', events: 4 },
    { name: 'Coupling', events: 3 },
  ],
  // Work orders (doughnut)
  workOrders: {
    open: 3,
    scheduled: 2,
    unscheduled: 4,
    closed: 12,
    onHold: 1,
  },
  // KPIs with spark data
  kpis: [
    { label: 'MTBF', value: '312 hrs', unit: 'hours', trend: 'down',
      spark: [420, 380, 350, 340, 310, 290, 312] },
    { label: 'MTTR', value: '4.2 hrs', unit: 'hours', trend: 'up',
      spark: [2.1, 2.8, 3.1, 3.5, 3.8, 4.0, 4.2] },
    { label: 'PM Compliance', value: '88%', unit: '%', trend: 'stable',
      spark: [92, 90, 89, 87, 88, 87, 88] },
  ],
}

// Performance row
export const PERFORMANCE_ATTRIBUTES = [
  { attribute: 'Discharge Pressure',   asset: 'K-101', value: 142.3,  expected: 150.0, unit: 'psi',  deviation: -5.1 },
  { attribute: 'Suction Temperature',  asset: 'K-101', value: 98.7,   expected: 95.0,  unit: 'F',    deviation: 3.9 },
  { attribute: 'Bearing Vibration',    asset: 'K-101', value: 4.2,    expected: 2.5,   unit: 'mm/s', deviation: 68.0 },
  { attribute: 'Polytropic Efficiency', asset: 'K-101', value: 72.4,  expected: 82.0,  unit: '%',    deviation: -11.7 },
  { attribute: 'Surge Margin',         asset: 'K-101', value: 8.3,    expected: 15.0,  unit: '%',    deviation: -44.7 },
  { attribute: 'Shaft Power',          asset: 'K-101', value: 2840,   expected: 2650,  unit: 'kW',   deviation: 7.2 },
  { attribute: 'Oil Pressure',         asset: 'K-101', value: 28.1,   expected: 35.0,  unit: 'psi',  deviation: -19.7 },
  { attribute: 'Flow Rate',            asset: 'K-101', value: 12400,  expected: 13500, unit: 'ACFM', deviation: -8.1 },
]

export const ASSET_SPECS = [
  { label: 'Service', value: 'H2 Recycle Gas' },
  { label: 'Process Unit', value: 'Hydrogen Recovery' },
  { label: 'Asset Criticality', value: 'Safety' },
  { label: 'Status', value: 'In Service' },
  { label: 'Type', value: 'Centrifugal Compressor' },
  { label: 'Class', value: 'API 617' },
  { label: 'Manufacturer', value: 'Elliott Group' },
  { label: 'Installed', value: '2018' },
]

// ── Trends data ──────────────────────────────────────────────────────────────

export const TRENDS_DATA = (() => {
  const data = []
  const now = Date.now()
  for (let i = 0; i < 168; i++) { // 7 days hourly
    const t = now - (167 - i) * 3600000
    const date = new Date(t)
    data.push({
      time: `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:00`,
      dischargePressure: 150 + Math.sin(i / 12) * 8 - (i > 80 ? (i - 80) * 0.12 : 0) + Math.random() * 2,
      bearingVibration: 2.5 + (i > 80 ? (i - 80) * 0.015 : 0) + Math.random() * 0.3,
      suctionTemp: 95 + Math.sin(i / 24) * 3 + Math.random() * 1.5,
      surgeMargin: 15 - (i > 80 ? (i - 80) * 0.08 : 0) + Math.random() * 1,
    })
  }
  return data
})()

export const TREND_ATTRIBUTES = [
  { key: 'dischargePressure', label: 'Discharge Pressure', unit: 'psi', color: '#2dd4bf', threshold: 140 },
  { key: 'bearingVibration', label: 'Bearing Vibration', unit: 'mm/s', color: '#ef4444', threshold: 4.0 },
  { key: 'suctionTemp', label: 'Suction Temperature', unit: 'F', color: '#f59e0b', threshold: 105 },
  { key: 'surgeMargin', label: 'Surge Margin', unit: '%', color: '#3b82f6', threshold: 10 },
]
