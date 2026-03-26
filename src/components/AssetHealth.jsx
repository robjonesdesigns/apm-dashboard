import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, ResponsiveContainer, AreaChart, Area,
} from 'recharts'
import { PLANT, RISK_MATRIX, EVENT_SUMMARY, BAD_ACTORS, ASSET_SUMMARY, OEE_TREND } from '../data/assets'
import { colors, chartStyle } from '../styles/tokens'

// ── Local sample data (not in assets.js) ──────────────────────────────────────

const WORK_ORDERS = [
  { id: 1, asset: 'Compressor K-101', task: 'Bearing inspection and replacement', priority: 'critical', assignee: 'Fred Martinez', time: '2h ago' },
  { id: 2, asset: 'Pump P-203',       task: 'Seal replacement on discharge side', priority: 'warning',  assignee: 'Sarah Chen',    time: '4h ago' },
  { id: 3, asset: 'Cooler C-201',     task: 'Coolant flow sensor recalibration',  priority: 'warning',  assignee: null,            time: '6h ago' },
  { id: 4, asset: 'Turbine T-401',    task: 'Scheduled vibration analysis',       priority: 'info',     assignee: 'Mike Torres',   time: '1d ago' },
]

const CASES = [
  { id: 1, asset: 'Compressor K-101', description: 'Root cause analysis: recurring bearing failures', status: 'investigating', workOrders: 2, time: '3h ago' },
  { id: 2, asset: 'Cooler C-201',     description: 'Vibration anomaly on intake valve',               status: 'opened',        workOrders: 0, time: '8h ago' },
]

const TIMELINE = [
  { time: '2:00 AM', type: 'critical', asset: 'Compressor K-101',   event: 'Compressor trip: bearing vibration exceeded threshold', kpiImpact: 'Availability -10.1%' },
  { time: '2:15 AM', type: 'info',     asset: 'Compressor K-101',   event: 'Work order opened: bearing inspection',                  kpiImpact: null },
  { time: '4:30 AM', type: 'warning',  asset: 'Pump P-203',         event: 'Discharge pressure trending below normal range',          kpiImpact: null },
  { time: '6:00 AM', type: 'info',     asset: 'Turbine T-401',      event: 'Scheduled maintenance window begins',                    kpiImpact: null },
  { time: '6:45 AM', type: 'healthy',  asset: 'Heat Exchanger E-105', event: 'Performance restored after overnight recalibration',   kpiImpact: 'OEE +0.8%' },
]

// ── Shared dark tooltip ────────────────────────────────────────────────────────

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: colors.surfaceRaised,
      border: `1px solid ${colors.borderStrong}`,
      borderRadius: 8,
      padding: '8px 12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      maxWidth: 240,
    }}>
      {label && (
        <p className="type-body-sm" style={{ marginBottom: 4 }}>{label}</p>
      )}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color || colors.textPrimary, fontSize: 13, fontWeight: 600 }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

// ── KPI sparklines ────────────────────────────────────────────────────────────

const TREND_CURRENT  = OEE_TREND[OEE_TREND.length - 1]
const TREND_PREVIOUS = OEE_TREND[OEE_TREND.length - 2]

function calcChange(current, previous) {
  return parseFloat((current - previous).toFixed(1))
}

const KPI_CONFIG = [
  {
    label: 'OEE',
    value: PLANT.oee,
    unit: '%',
    field: 'oee',
    color: colors.kpiOee,
    cssVar: 'var(--color-kpi-oee)',
    change: calcChange(TREND_CURRENT.oee, TREND_PREVIOUS.oee),
  },
  {
    label: 'Availability',
    value: PLANT.availability,
    unit: '%',
    field: 'availability',
    color: colors.kpiAvailability,
    cssVar: 'var(--color-kpi-availability)',
    change: calcChange(TREND_CURRENT.availability, TREND_PREVIOUS.availability),
  },
  {
    label: 'Performance',
    value: PLANT.performance,
    unit: '%',
    field: 'performance',
    color: colors.kpiPerformance,
    cssVar: 'var(--color-kpi-performance)',
    change: calcChange(TREND_CURRENT.performance, TREND_PREVIOUS.performance),
  },
  {
    label: 'Quality',
    value: PLANT.quality,
    unit: '%',
    field: 'quality',
    color: colors.kpiQuality,
    cssVar: 'var(--color-kpi-quality)',
    change: calcChange(TREND_CURRENT.quality, TREND_PREVIOUS.quality),
  },
]

function sparkData(field) {
  return OEE_TREND.map((row) => ({ v: row[field] }))
}

// ── KPI Card ──────────────────────────────────────────────────────────────────

function KpiCard({ label, value, unit, field, color, cssVar, change }) {
  const [hovered, setHovered] = useState(false)
  const data = sparkData(field)
  const isPositive = change >= 0
  const changeColor = isPositive ? 'var(--color-healthy)' : 'var(--color-critical)'
  const gradientId = `spark-grad-${label.toLowerCase().replace(/\s/g, '-')}`

  return (
    <div
      className="card card-interactive"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => console.log('KPI trend modal:', label)}
      style={{
        borderLeft: `3px solid ${cssVar}`,
        cursor: 'pointer',
      }}
    >
      <p className="type-label" style={{ marginBottom: 'var(--spacing-8)' }}>{label}</p>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--spacing-8)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-4)' }}>
            <span className="type-kpi">{value}</span>
            <span className="type-body-sm">{unit}</span>
          </div>
          <p className="type-body-sm" style={{ color: changeColor, marginTop: 'var(--spacing-4)' }}>
            {isPositive ? '+' : ''}{change}% vs last month
          </p>
        </div>

        <div style={{ width: 60, height: 24, flexShrink: 0 }}>
          <AreaChart
            width={60}
            height={24}
            data={data}
            margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#${gradientId})`}
              dot={false}
              isAnimationActive={true}
              animationDuration={300}
            />
          </AreaChart>
        </div>
      </div>
    </div>
  )
}

// ── Trains / Active Assets card ────────────────────────────────────────────────

function TrainsCard() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 'var(--spacing-12)' }}>
      <div>
        <p className="type-label" style={{ marginBottom: 'var(--spacing-4)' }}>Trains</p>
        <span className="type-kpi">{PLANT.trains}</span>
      </div>
      <div>
        <p className="type-label" style={{ marginBottom: 'var(--spacing-4)' }}>Active Assets</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-4)' }}>
          <span className="type-kpi" style={{ color: 'var(--color-accent)' }}>{PLANT.activeAssets}</span>
          <span className="type-body-sm">/ {PLANT.totalAssets}</span>
        </div>
      </div>
    </div>
  )
}

// ── Plant Health (Section 1) ───────────────────────────────────────────────────

function PlantHealth() {
  return (
    <section>
      <p className="section-header">Plant Health</p>
      <div className="grid grid-cols-2 lg:grid-cols-5" style={{ gap: 'var(--spacing-8)' }}>
        {KPI_CONFIG.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
        <TrainsCard />
      </div>
    </section>
  )
}

// ── Work Orders Card ──────────────────────────────────────────────────────────

const PRIORITY_BADGE = {
  critical: 'badge badge-critical',
  warning:  'badge badge-warning',
  info:     'badge badge-info',
  healthy:  'badge badge-healthy',
}

const STATUS_LABEL = {
  critical: 'Critical',
  warning:  'Warning',
  info:     'Scheduled',
  healthy:  'Resolved',
}

const STATUS_DOT_CLASS = {
  critical: 'status-dot status-dot-critical',
  warning:  'status-dot status-dot-warning',
  info:     'status-dot status-dot-info',
  healthy:  'status-dot status-dot-healthy',
}

function WorkOrderRow({ wo }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => console.log('Work order asset:', wo.asset)}
      style={{
        padding: 'var(--spacing-12)',
        borderRadius: 'var(--radius-8)',
        background: hovered ? 'var(--color-surface-hover)' : 'transparent',
        borderLeft: `2px solid ${hovered ? 'var(--color-accent)' : 'transparent'}`,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        marginLeft: '-2px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-4)' }}>
        <span className="type-body" style={{ color: 'var(--color-accent)', fontWeight: 500 }}>{wo.asset}</span>
        <span className={PRIORITY_BADGE[wo.priority]}>{STATUS_LABEL[wo.priority]}</span>
      </div>
      <p className="type-body-secondary" style={{ marginBottom: 'var(--spacing-4)' }}>{wo.task}</p>
      <p className="type-body-sm">
        {wo.assignee ? wo.assignee : <span style={{ color: 'var(--color-text-muted)' }}>Unassigned</span>}
        <span style={{ color: 'var(--color-text-muted)' }}> · {wo.time}</span>
      </p>
    </div>
  )
}

function WorkOrdersCard() {
  const criticalCount = WORK_ORDERS.filter((w) => w.priority === 'critical').length
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-8)' }}>
        <h4 className="type-h4">Work Orders</h4>
        <span className="badge badge-critical">{WORK_ORDERS.length}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-12)', marginBottom: 'var(--spacing-16)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-6)' }}>
          <span className="status-dot status-dot-warning" />
          <span className="type-body-sm">{WORK_ORDERS.length} Open</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-6)' }}>
          <span className="status-dot status-dot-critical" />
          <span className="type-body-sm">{criticalCount} Critical</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', flex: 1 }}>
        {WORK_ORDERS.map((wo) => (
          <WorkOrderRow key={wo.id} wo={wo} />
        ))}
      </div>

      <div style={{ marginTop: 'var(--spacing-16)', paddingTop: 'var(--spacing-12)', borderTop: '1px solid var(--color-border)' }}>
        <span className="type-link" onClick={() => console.log('View all work orders')}>
          View all work orders
        </span>
      </div>
    </div>
  )
}

// ── Cases Card ────────────────────────────────────────────────────────────────

const CASE_STATUS_LABEL = {
  opened:        'Opened',
  investigating: 'Investigating',
  awaiting:      'Awaiting Work Orders',
}

const CASE_STATUS_BADGE = {
  opened:        'badge badge-warning',
  investigating: 'badge badge-info',
  awaiting:      'badge badge-critical',
}

function CaseRow({ c }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => console.log('Case asset:', c.asset)}
      style={{
        padding: 'var(--spacing-12)',
        borderRadius: 'var(--radius-8)',
        background: hovered ? 'var(--color-surface-hover)' : 'transparent',
        borderLeft: `2px solid ${hovered ? 'var(--color-accent)' : 'transparent'}`,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        marginLeft: '-2px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-4)' }}>
        <span className="type-body" style={{ color: 'var(--color-accent)', fontWeight: 500 }}>{c.asset}</span>
        <span className={CASE_STATUS_BADGE[c.status]}>{CASE_STATUS_LABEL[c.status]}</span>
      </div>
      <p className="type-body-secondary" style={{ marginBottom: 'var(--spacing-4)' }}>{c.description}</p>
      <p className="type-body-sm">
        {c.workOrders > 0
          ? <>{c.workOrders} linked work order{c.workOrders !== 1 ? 's' : ''}</>
          : <span style={{ color: 'var(--color-text-muted)' }}>No work orders yet</span>
        }
        <span style={{ color: 'var(--color-text-muted)' }}> · {c.time}</span>
      </p>
    </div>
  )
}

function CasesCard() {
  const investigatingCount = CASES.filter((c) => c.status === 'investigating').length
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-8)' }}>
        <h4 className="type-h4">Cases</h4>
        <span className="badge badge-info">{CASES.length}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-12)', marginBottom: 'var(--spacing-16)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-6)' }}>
          <span className="status-dot status-dot-warning" />
          <span className="type-body-sm">{CASES.length} Open</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-6)' }}>
          <span className="status-dot status-dot-info" />
          <span className="type-body-sm">{investigatingCount} Under Investigation</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', flex: 1 }}>
        {CASES.map((c) => (
          <CaseRow key={c.id} c={c} />
        ))}
      </div>

      <div style={{ marginTop: 'var(--spacing-16)', paddingTop: 'var(--spacing-12)', borderTop: '1px solid var(--color-border)' }}>
        <span className="type-link" onClick={() => console.log('View all cases')}>
          View all cases
        </span>
      </div>
    </div>
  )
}

// ── Today's Activity (Section 2) ──────────────────────────────────────────────

function TodaysActivity() {
  return (
    <section>
      <p className="section-header">Today's Activity</p>
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--spacing-8)' }}>
        <WorkOrdersCard />
        <CasesCard />
      </div>
    </section>
  )
}

// ── What Changed (Section 3) ──────────────────────────────────────────────────

const TYPE_DOT_CLASS = {
  critical: 'status-dot status-dot-critical',
  warning:  'status-dot status-dot-warning',
  info:     'status-dot status-dot-info',
  healthy:  'status-dot status-dot-healthy',
}

function TimelineEvent({ entry }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => console.log('Timeline event, navigate to asset:', entry.asset)}
      style={{
        display: 'flex',
        gap: 'var(--spacing-16)',
        padding: `var(--spacing-8) var(--spacing-12)`,
        borderRadius: 'var(--radius-8)',
        background: hovered ? 'var(--color-surface-hover)' : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        position: 'relative',
      }}
    >
      {/* Timestamp */}
      <span className="type-body-sm" style={{ flexShrink: 0, width: 52, paddingTop: 2 }}>
        {entry.time}
      </span>

      {/* Dot column (sits on the timeline line) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <span
          className={TYPE_DOT_CLASS[entry.type]}
          style={{
            transform: hovered ? 'scale(1.2)' : 'scale(1)',
            transition: 'transform 0.15s ease',
            marginTop: 5,
          }}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="type-body" style={{ marginBottom: 2 }}>{entry.event}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', flexWrap: 'wrap' }}>
          <span className="type-body-sm" style={{ color: 'var(--color-accent)' }}>{entry.asset}</span>
          {entry.kpiImpact && (
            <span
              className="type-body-sm"
              style={{
                background: 'var(--color-accent-subtle)',
                color: 'var(--color-accent)',
                padding: '1px 6px',
                borderRadius: 'var(--radius-4)',
              }}
            >
              {entry.kpiImpact}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function WhatChanged() {
  return (
    <section>
      <p className="section-header">What Changed</p>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--spacing-20)' }}>
          <h4 className="type-h4">What Changed</h4>
          <span className="type-body-sm">Last 24 hours</span>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: 'calc(52px + var(--spacing-16) + 3px)',
            top: 8,
            bottom: 8,
            width: 2,
            background: 'var(--color-border)',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            {TIMELINE.map((entry, i) => (
              <TimelineEvent key={i} entry={entry} />
            ))}
          </div>
        </div>

        {/* Correlation note */}
        <div style={{
          marginTop: 'var(--spacing-20)',
          padding: 'var(--spacing-12)',
          background: 'var(--color-accent-subtle)',
          borderRadius: 'var(--radius-8)',
          borderLeft: '3px solid var(--color-accent)',
        }}>
          <p className="type-body-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Availability dropped 10.1% at 2:00 AM, correlating with the K-101 compressor trip.
            Three prior bearing vibration warnings logged over the preceding 4 hours.
          </p>
        </div>
      </div>
    </section>
  )
}

// ── Risk Matrix Card ──────────────────────────────────────────────────────────

function riskCellStyle(priority) {
  if (priority === 'High')   return { bg: 'var(--color-critical-bg)', text: 'var(--color-critical)', border: colors.critical }
  if (priority === 'Medium') return { bg: 'var(--color-warning-bg)',  text: 'var(--color-warning)',  border: colors.warning }
  return                            { bg: 'var(--color-healthy-bg)',  text: 'var(--color-healthy)',  border: colors.healthy }
}

function RiskMatrixCard({ onCellClick }) {
  const [hoveredCell, setHoveredCell] = useState(null)
  const colHeaders = ['New', 'In Progress']

  return (
    <div className="card">
      <div style={{ marginBottom: 'var(--spacing-16)' }}>
        <h4 className="type-h4" style={{ marginBottom: 'var(--spacing-4)' }}>Risk Matrix</h4>
        <p className="type-body-sm">Events by priority and status</p>
      </div>

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
        <div />
        {colHeaders.map((h) => (
          <div key={h} style={{ textAlign: 'center' }}>
            <span className="type-label">{h}</span>
          </div>
        ))}
      </div>

      {/* Grid rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {RISK_MATRIX.map((row) => {
          const style = riskCellStyle(row.priority)
          const cells = [row.newEvents, row.inProgress]
          const colKeys = ['new', 'inProgress']
          return (
            <div key={row.priority} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 'var(--spacing-4)', alignItems: 'center' }}>
              <span className="type-body-sm" style={{ fontWeight: 500 }}>{row.priority}</span>
              {cells.map((val, ci) => {
                const cellKey = `${row.priority}-${colKeys[ci]}`
                const isHovered = hoveredCell === cellKey
                return (
                  <div
                    key={ci}
                    onMouseEnter={() => setHoveredCell(cellKey)}
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() => {
                      console.log('Risk matrix filter:', row.priority, colHeaders[ci])
                      onCellClick && onCellClick({ priority: row.priority, status: colHeaders[ci] })
                    }}
                    style={{
                      background: style.bg,
                      borderRadius: 'var(--radius-6)',
                      padding: 'var(--spacing-12) 0',
                      textAlign: 'center',
                      fontSize: 20,
                      fontWeight: 700,
                      color: style.text,
                      lineHeight: 1,
                      cursor: 'pointer',
                      border: `1px solid ${isHovered ? style.border : 'transparent'}`,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {val}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Priority gradient bar */}
      <div style={{ marginTop: 'var(--spacing-20)' }}>
        <div style={{ display: 'flex', height: 6, borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{ flex: 1, background: 'var(--color-critical)' }} />
          <div style={{ flex: 1, background: 'var(--color-warning)' }} />
          <div style={{ flex: 1, background: 'var(--color-healthy)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-4)' }}>
          <span className="type-meta">High</span>
          <span className="type-meta">Medium</span>
          <span className="type-meta">Low</span>
        </div>
      </div>
    </div>
  )
}

// ── Event Summary Card ────────────────────────────────────────────────────────

const CASES_SUMMARY = {
  open: 2,
  investigating: 1,
  awaitingWorkOrders: 1,
}

const EVENT_CHART_DATA = [
  {
    name: 'Events',
    confirmed:      EVENT_SUMMARY.confirmed,
    falsePositives: EVENT_SUMMARY.falsePositives,
    newEvents:      EVENT_SUMMARY.newEvents,
  },
]

const CASES_CHART_DATA = [
  {
    name: 'Cases',
    open:               CASES_SUMMARY.open,
    investigating:      CASES_SUMMARY.investigating,
    awaitingWorkOrders: CASES_SUMMARY.awaitingWorkOrders,
  },
]

const EVENT_SEGMENTS = [
  { key: 'confirmed',      label: 'Confirmed',      color: colors.chart1 },
  { key: 'falsePositives', label: 'False Positives', color: colors.chart4 },
  { key: 'newEvents',      label: 'New',             color: colors.chart2 },
]

const CASES_SEGMENTS = [
  { key: 'open',               label: 'Open',                color: colors.warning },
  { key: 'investigating',      label: 'Investigating',        color: colors.info },
  { key: 'awaitingWorkOrders', label: 'Awaiting Work Orders', color: colors.chart3 },
]

function EventSummaryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: colors.surfaceRaised,
      border: `1px solid ${colors.borderStrong}`,
      borderRadius: 8,
      padding: '8px 12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    }}>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.fill, fontSize: 12, marginBottom: 2 }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

function EventSummaryCard() {
  const [mode, setMode] = useState('events') // 'events' | 'cases'
  const isEvents = mode === 'events'
  const total = isEvents ? EVENT_SUMMARY.total : CASES_SUMMARY.open + CASES_SUMMARY.investigating + CASES_SUMMARY.awaitingWorkOrders
  const chartData = isEvents ? EVENT_CHART_DATA : CASES_CHART_DATA
  const segments = isEvents ? EVENT_SEGMENTS : CASES_SEGMENTS
  const summaryMap = isEvents
    ? { confirmed: EVENT_SUMMARY.confirmed, falsePositives: EVENT_SUMMARY.falsePositives, newEvents: EVENT_SUMMARY.newEvents }
    : { open: CASES_SUMMARY.open, investigating: CASES_SUMMARY.investigating, awaitingWorkOrders: CASES_SUMMARY.awaitingWorkOrders }

  return (
    <div className="card">
      {/* Header + toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-16)' }}>
        <h4 className="type-h4">Event Summary</h4>
        <div style={{
          display: 'flex',
          background: 'var(--color-surface-raised)',
          borderRadius: 'var(--radius-full)',
          padding: 'var(--spacing-2)',
        }}>
          {['events', 'cases'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 500,
                transition: 'all 0.15s ease',
                background: mode === m ? 'var(--color-accent)' : 'transparent',
                color: mode === m ? 'var(--color-bg)' : 'var(--color-text-secondary)',
              }}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Callout number */}
      <div style={{ marginBottom: 'var(--spacing-16)' }}>
        <p className="type-label" style={{ marginBottom: 'var(--spacing-4)' }}>
          {isEvents ? 'Active Events' : 'Active Cases'}
        </p>
        <span className="type-callout">{total}</span>
      </div>

      {/* Stacked bar */}
      <ResponsiveContainer width="100%" height={48}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <CartesianGrid horizontal={false} stroke={chartStyle.grid} />
          <XAxis type="number" hide tick={{ fill: chartStyle.axisText, fontSize: chartStyle.axisFont }} />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip content={<EventSummaryTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          {segments.map(({ key, label, color }) => (
            <Bar
              key={key}
              dataKey={key}
              name={label}
              stackId="a"
              fill={color}
              radius={0}
              isAnimationActive={true}
              animationDuration={300}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-8)',
        marginTop: 'var(--spacing-16)',
        paddingTop: 'var(--spacing-12)',
        borderTop: '1px solid var(--color-border)',
        flexWrap: 'wrap',
      }}>
        {segments.map(({ key, label, color }) => {
          const val = summaryMap[key] ?? 0
          const pct = total > 0 ? ((val / total) * 100).toFixed(0) : 0
          return (
            <div
              key={key}
              style={{
                flex: 1,
                minWidth: 72,
                background: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-6)',
                padding: 'var(--spacing-8) var(--spacing-12)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-4)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span className="type-meta">{label}</span>
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>{val}</p>
              <p className="type-meta" style={{ marginTop: 2 }}>{pct}%</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Bad Actors Card ───────────────────────────────────────────────────────────

const CRIT_COLOR = {
  critical: colors.critical,
  warning:  colors.warning,
  healthy:  colors.healthy,
}

function BadActorTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: colors.surfaceRaised,
      border: `1px solid ${colors.borderStrong}`,
      borderRadius: 8,
      padding: '8px 12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    }}>
      <p className="type-h4" style={{ marginBottom: 4, color: colors.textPrimary }}>{label}</p>
      <p style={{ color: payload[0].fill, fontSize: 13, fontWeight: 600 }}>
        {payload[0].value} events
      </p>
    </div>
  )
}

function BadActorsCard({ onNavigate }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div className="card">
      <div style={{ marginBottom: 'var(--spacing-16)' }}>
        <h4 className="type-h4" style={{ marginBottom: 'var(--spacing-4)' }}>Bad Actors</h4>
        <p className="type-body-sm">Assets with highest event count</p>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={BAD_ACTORS}
          layout="vertical"
          margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
        >
          <CartesianGrid vertical horizontal={false} stroke={chartStyle.grid} />
          <XAxis
            type="number"
            tick={{ fill: chartStyle.axisText, fontSize: chartStyle.axisFont }}
            tickLine={false}
            axisLine={{ stroke: colors.border }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fill: chartStyle.axisText, fontSize: chartStyle.axisFont }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<BadActorTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar
            dataKey="events"
            radius={[0, 4, 4, 0]}
            isAnimationActive={true}
            animationDuration={300}
            label={{
              position: 'right',
              fill: chartStyle.axisText,
              fontSize: chartStyle.axisFont,
            }}
          >
            {BAD_ACTORS.map((entry, i) => (
              <Cell
                key={`cell-${i}`}
                fill={CRIT_COLOR[entry.criticality]}
                opacity={hoveredIndex === null || hoveredIndex === i ? 1 : 0.4}
                style={{ cursor: 'pointer', transition: 'opacity 0.15s ease' }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  console.log('Navigate to asset:', entry.name)
                  onNavigate && onNavigate('details', { asset: { name: entry.name } })
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Priority gradient bar */}
      <div style={{ marginTop: 'var(--spacing-16)' }}>
        <div style={{ display: 'flex', height: 6, borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{ flex: 1, background: 'var(--color-critical)' }} />
          <div style={{ flex: 1, background: 'var(--color-warning)' }} />
          <div style={{ flex: 1, background: 'var(--color-healthy)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-4)' }}>
          <span className="type-meta">Critical</span>
          <span className="type-meta">Warning</span>
          <span className="type-meta">Healthy</span>
        </div>
      </div>
    </div>
  )
}

// ── Assets Requiring Attention (Section 4) ────────────────────────────────────

function AssetsRequiringAttention({ onNavigate }) {
  return (
    <section>
      <p className="section-header">Assets Requiring Attention</p>
      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 'var(--spacing-8)' }}>
        <RiskMatrixCard onCellClick={(filter) => console.log('Filter asset table:', filter)} />
        <EventSummaryCard />
        <BadActorsCard onNavigate={onNavigate} />
      </div>
    </section>
  )
}

// ── Asset Summary Table (Section 5) ───────────────────────────────────────────

const STATUS_DOT_MAP = {
  Critical: 'status-dot status-dot-critical',
  Warning:  'status-dot status-dot-warning',
  Healthy:  'status-dot status-dot-healthy',
}

const PRIORITY_BADGE_MAP = {
  High:   'badge badge-critical',
  Medium: 'badge badge-warning',
  Low:    'badge badge-healthy',
}

const ASSET_TYPE_MAP = {
  'K-101': 'Centrifugal Compressor',
  'P-203': 'Centrifugal Pump',
  'T-401': 'Steam Turbine',
  'E-105': 'Shell & Tube Heat Exchanger',
  'R-301': 'Fixed Bed Reactor',
  'V-501': 'Pressure Vessel',
  'P-102': 'Centrifugal Pump',
  'C-201': 'Air Cooler',
  'T-102': 'Steam Turbine',
  'K-302': 'Reciprocating Compressor',
}

const TABLE_COLS = [
  { key: 'asset',            label: 'Asset',           width: 'auto' },
  { key: 'priority',         label: 'Priority',        width: 90 },
  { key: 'oee',              label: 'OEE',             width: 72 },
  { key: 'activeEvents',     label: 'Active Events',   width: 100 },
  { key: 'repetitive',       label: 'Repetitive',      width: 90 },
  { key: 'downtime',         label: 'Downtime',        width: 84 },
  { key: 'workOrders',       label: 'Work Orders',     width: 90 },
  { key: 'rul',              label: 'RUL',             width: 100 },
]

function OeeValue({ value }) {
  const color =
    value >= 85 ? 'var(--color-healthy)' :
    value >= 70 ? 'var(--color-warning)' :
                  'var(--color-critical)'
  return <span style={{ color, fontWeight: 600 }}>{value}%</span>
}

function AssetRow({ asset, onNavigate }) {
  const [hovered, setHovered] = useState(false)
  const assetType = ASSET_TYPE_MAP[asset.id] || 'Asset'

  return (
    <tr
      onClick={() => onNavigate && onNavigate('details', { asset })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--color-surface-hover)' : 'transparent',
        borderBottom: '1px solid var(--color-border)',
        borderLeft: `2px solid ${hovered ? 'var(--color-accent)' : 'transparent'}`,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Asset name + type */}
      <td style={{ padding: 'var(--spacing-12)', paddingLeft: 'var(--spacing-16)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
          <span className={STATUS_DOT_MAP[asset.status] || 'status-dot'} />
          <div>
            <p
              className="type-body"
              style={{
                color: hovered ? 'var(--color-accent)' : 'var(--color-text-primary)',
                fontWeight: 500,
                transition: 'color 0.15s ease',
                lineHeight: 1.3,
              }}
            >
              {asset.name}
            </p>
            <p className="type-body-sm">{assetType}</p>
          </div>
        </div>
      </td>

      {/* Priority */}
      <td style={{ padding: 'var(--spacing-12)' }}>
        <span className={PRIORITY_BADGE_MAP[asset.priority] || 'badge'}>{asset.priority}</span>
      </td>

      {/* OEE */}
      <td style={{ padding: 'var(--spacing-12)', textAlign: 'right' }}>
        <OeeValue value={asset.oee} />
      </td>

      {/* Active Events */}
      <td style={{ padding: 'var(--spacing-12)', textAlign: 'right' }}>
        <p
          className="type-body"
          style={{
            fontWeight: asset.activeEvents > 0 ? 700 : 400,
            color: asset.activeEvents > 0 ? 'var(--color-critical)' : 'var(--color-text-muted)',
          }}
        >
          {asset.activeEvents}
        </p>
        {asset.activeEvents > 0 && (
          <p className="type-meta">Latest 2m ago</p>
        )}
      </td>

      {/* Repetitive Events */}
      <td style={{ padding: 'var(--spacing-12)', textAlign: 'right' }}>
        <p
          title={asset.repetitiveEvents > 0 ? 'Chattering: repetitive non-critical events. Confirm these are noise before ignoring.' : undefined}
          className="type-body"
          style={{
            fontWeight: asset.repetitiveEvents > 0 ? 600 : 400,
            color: asset.repetitiveEvents > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)',
            cursor: asset.repetitiveEvents > 0 ? 'help' : 'default',
          }}
        >
          {asset.repetitiveEvents}
        </p>
      </td>

      {/* Downtime */}
      <td style={{ padding: 'var(--spacing-12)', textAlign: 'right' }}>
        <span className="type-body-secondary">{asset.downtime}</span>
      </td>

      {/* Work Orders */}
      <td style={{ padding: 'var(--spacing-12)', textAlign: 'right' }}>
        <span className="type-body-secondary">{asset.workOrders}</span>
      </td>

      {/* RUL */}
      <td style={{ padding: 'var(--spacing-12)', paddingRight: 'var(--spacing-16)', textAlign: 'right' }}>
        <span className="type-body-sm">{asset.rul}</span>
      </td>
    </tr>
  )
}

function AllAssets({ onNavigate }) {
  return (
    <section>
      <p className="section-header">All Assets</p>
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-12)',
        overflow: 'hidden',
      }}>
        {/* Card header */}
        <div style={{
          padding: 'var(--spacing-16) var(--spacing-20)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'baseline',
          gap: 'var(--spacing-8)',
        }}>
          <h4 className="type-h4">Asset Summary</h4>
          <span className="type-body-sm">{ASSET_SUMMARY.length} assets</span>
        </div>

        {/* Scrollable table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr>
                {TABLE_COLS.map((col) => (
                  <th
                    key={col.key}
                    className="type-label"
                    style={{
                      padding: 'var(--spacing-8) var(--spacing-12)',
                      textAlign: col.key === 'asset' ? 'left' : 'right',
                      paddingLeft: col.key === 'asset' ? 'var(--spacing-16)' : undefined,
                      paddingRight: col.key === 'rul' ? 'var(--spacing-16)' : undefined,
                      width: col.width !== 'auto' ? col.width : undefined,
                      background: 'var(--color-surface-raised)',
                      position: 'sticky',
                      top: 0,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ASSET_SUMMARY.map((asset) => (
                <AssetRow key={asset.id} asset={asset} onNavigate={onNavigate} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// ── Root component ─────────────────────────────────────────────────────────────

export default function AssetHealth({ onNavigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-24)' }}>
      <PlantHealth />
      <TodaysActivity />
      <WhatChanged />
      <AssetsRequiringAttention onNavigate={onNavigate} />
      <AllAssets onNavigate={onNavigate} />
    </div>
  )
}
