import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, ResponsiveContainer, AreaChart, Area,
} from 'recharts'
import { PLANT, RISK_MATRIX, EVENT_SUMMARY, BAD_ACTORS, ASSET_SUMMARY, OEE_TREND } from '../data/assets'

// ── Section header ─────────────────────────────────────────────────────────────

function SectionHeader({ label }) {
  return (
    <p
      style={{
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: '12px',
      }}
    >
      {label}
    </p>
  )
}

// ── Shared tooltip ────────────────────────────────────────────────────────────

function DarkTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border-strong)',
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 12,
        color: 'var(--color-text-primary)',
      }}
    >
      {label && (
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 4, fontSize: 11 }}>
          {label}
        </p>
      )}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color || 'var(--color-text-primary)' }}>
          {formatter ? formatter(entry) : `${entry.name}: ${entry.value}`}
        </p>
      ))}
    </div>
  )
}

// ── KPI sparkline + period-over-period ────────────────────────────────────────

// Derive month-over-month change from OEE_TREND (Mar = current, Feb = previous)
const TREND_CURRENT  = OEE_TREND[OEE_TREND.length - 1]   // Mar
const TREND_PREVIOUS = OEE_TREND[OEE_TREND.length - 2]   // Feb

function calcChange(current, previous) {
  return parseFloat((current - previous).toFixed(1))
}

const KPI_META = {
  OEE:          { field: 'oee',          change: calcChange(TREND_CURRENT.oee,          TREND_PREVIOUS.oee) },
  Availability: { field: 'availability', change: calcChange(TREND_CURRENT.availability, TREND_PREVIOUS.availability) },
  Performance:  { field: 'performance',  change: calcChange(TREND_CURRENT.performance,  TREND_PREVIOUS.performance) },
  Quality:      { field: 'quality',      change: calcChange(TREND_CURRENT.quality,      TREND_PREVIOUS.quality) },
}

// Build sparkline data arrays from OEE_TREND
function sparkData(field) {
  return OEE_TREND.map((row) => ({ v: row[field] }))
}

// ── KPI card ──────────────────────────────────────────────────────────────────

const KPI_ITEMS = [
  { label: 'OEE',          value: PLANT.oee,          unit: '%' },
  { label: 'Availability', value: PLANT.availability,  unit: '%' },
  { label: 'Performance',  value: PLANT.performance,   unit: '%' },
  { label: 'Quality',      value: PLANT.quality,       unit: '%' },
]

function KpiCard({ label, value, unit }) {
  const [hovered, setHovered] = useState(false)
  const meta   = KPI_META[label]
  const change = meta?.change ?? 0
  const data   = sparkData(meta?.field ?? 'oee')

  const changeColor  = change >= 0 ? 'var(--color-healthy)' : 'var(--color-critical)'
  const changePrefix = change >= 0 ? '+' : ''

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--color-surface-hover)' : 'var(--color-surface)',
        border: `1px solid ${hovered ? 'var(--color-accent)' : 'var(--color-border)'}`,
        borderRadius: 8,
        padding: '14px 18px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        flex: 1,
        textAlign: 'left',
        minWidth: 0,
      }}
    >
      {/* Label */}
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          marginBottom: 6,
        }}
      >
        {label}
      </p>

      {/* Value row + sparkline */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div>
          {/* Big number */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1,
              }}
            >
              {value}
            </span>
            <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{unit}</span>
          </div>

          {/* Period-over-period change */}
          <p
            style={{
              fontSize: 11,
              color: changeColor,
              marginTop: 4,
              lineHeight: 1,
              transition: 'all 0.15s ease',
            }}
          >
            {changePrefix}{change}% vs last month
          </p>
        </div>

        {/* Sparkline */}
        <div style={{ width: 60, height: 24, flexShrink: 0 }}>
          <AreaChart
            width={60}
            height={24}
            data={data}
            margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke="var(--color-accent)"
              strokeWidth={1.5}
              fill={`url(#spark-${label})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </div>
      </div>
    </button>
  )
}

function KpiBar() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'stretch' }}>
      {KPI_ITEMS.map((kpi) => (
        <KpiCard key={kpi.label} {...kpi} />
      ))}

      {/* Trains + Active/Total */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          padding: '14px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 10,
          minWidth: 140,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: 4,
            }}
          >
            Trains
          </p>
          <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {PLANT.trains}
          </span>
        </div>
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: 4,
            }}
          >
            Active / Total
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-accent)' }}>
              {PLANT.activeAssets}
            </span>
            <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
              / {PLANT.totalAssets}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Card wrapper ──────────────────────────────────────────────────────────────

function Card({ title, subtitle, children, style }) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 12,
        border: '1px solid var(--color-border)',
        padding: 20,
        ...style,
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            margin: 0,
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            style={{
              fontSize: 11,
              color: 'var(--color-text-muted)',
              marginTop: 2,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}

// ── Risk Matrix ───────────────────────────────────────────────────────────────

function riskCellStyle(priority) {
  if (priority === 'High')   return { bg: 'var(--color-critical-bg)',  text: 'var(--color-critical)' }
  if (priority === 'Medium') return { bg: 'var(--color-warning-bg)',   text: 'var(--color-warning)' }
  return                            { bg: 'var(--color-healthy-bg)',   text: 'var(--color-healthy)' }
}

function RiskMatrixCard() {
  const colHeaders = ['New', 'In Progress']
  return (
    <Card title="Risk Matrix" subtitle="Events by priority and status">
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 4 }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: 'left',
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--color-text-muted)',
                paddingBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Priority
            </th>
            {colHeaders.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'center',
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--color-text-muted)',
                  paddingBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RISK_MATRIX.map((row) => {
            const vals = [row.newEvents, row.inProgress]
            return (
              <tr key={row.priority}>
                <td
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    paddingRight: 8,
                    paddingTop: 4,
                    paddingBottom: 4,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.priority}
                </td>
                {vals.map((val, ci) => {
                  const { bg, text } = riskCellStyle(row.priority, ci)
                  return (
                    <td key={ci} style={{ textAlign: 'center', paddingTop: 4, paddingBottom: 4 }}>
                      <div
                        style={{
                          background: bg,
                          borderRadius: 6,
                          padding: '8px 0',
                          fontSize: 18,
                          fontWeight: 700,
                          color: text,
                          lineHeight: 1,
                        }}
                      >
                        {val}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Summary row */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid var(--color-border)',
        }}
      >
        {[
          { label: 'Total Events', value: RISK_MATRIX.reduce((s, r) => s + r.newEvents + r.inProgress, 0) },
          { label: 'New',          value: RISK_MATRIX.reduce((s, r) => s + r.newEvents, 0) },
          { label: 'In Progress',  value: RISK_MATRIX.reduce((s, r) => s + r.inProgress, 0) },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              flex: 1,
              textAlign: 'center',
              background: 'var(--color-surface-raised)',
              borderRadius: 6,
              padding: '8px 4px',
            }}
          >
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>{label}</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>{value}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Event Summary ─────────────────────────────────────────────────────────────

const EVENT_CHART_DATA = [
  {
    name: 'Events',
    confirmed:      EVENT_SUMMARY.confirmed,
    falsePositives: EVENT_SUMMARY.falsePositives,
    newEvents:      EVENT_SUMMARY.newEvents,
  },
]

const SEGMENT_META = [
  { key: 'confirmed',      label: 'Confirmed',      color: 'var(--color-chart-1)' },
  { key: 'falsePositives', label: 'False Positives', color: 'var(--color-chart-4)' },
  { key: 'newEvents',      label: 'New Events',      color: 'var(--color-chart-2)' },
]

function EventTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border-strong)',
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 12,
      }}
    >
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color, marginBottom: 2 }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

function EventSummaryCard() {
  const total = EVENT_SUMMARY.total
  return (
    <Card title="Event Summary" subtitle={`${total} total events this period`}>
      <ResponsiveContainer width="100%" height={72}>
        <BarChart
          data={EVENT_CHART_DATA}
          layout="vertical"
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            horizontal={false}
            stroke="rgba(255,255,255,0.04)"
          />
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip content={<EventTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          {SEGMENT_META.map(({ key, label, color }) => (
            <Bar key={key} dataKey={key} name={label} stackId="a" fill={color} radius={0} />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* Legend with percentages */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 16,
          paddingTop: 14,
          borderTop: '1px solid var(--color-border)',
          flexWrap: 'wrap',
        }}
      >
        {SEGMENT_META.map(({ key, label, color }) => {
          const val = EVENT_SUMMARY[key]
          const pct = ((val / total) * 100).toFixed(0)
          return (
            <div
              key={key}
              style={{
                flex: 1,
                minWidth: 80,
                background: 'var(--color-surface-raised)',
                borderRadius: 6,
                padding: '10px 12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{label}</span>
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>
                {val}
              </p>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{pct}%</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ── Bad Actors ────────────────────────────────────────────────────────────────

const CRITICALITY_COLOR = {
  critical: 'var(--color-critical)',
  warning:  'var(--color-warning)',
  healthy:  'var(--color-healthy)',
}

function BadActorTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border-strong)',
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 12,
        color: 'var(--color-text-primary)',
      }}
    >
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 4, fontSize: 11 }}>{label}</p>
      <p style={{ color: payload[0].fill }}>Events: {payload[0].value}</p>
    </div>
  )
}

function BadActorsCard() {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <Card title="Bad Actors" subtitle="Assets with highest event count">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={BAD_ACTORS}
          layout="vertical"
          margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            vertical
            horizontal={false}
            stroke="rgba(255,255,255,0.04)"
          />
          <XAxis
            type="number"
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11, fontFamily: 'Inter, system-ui, sans-serif' }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11, fontFamily: 'Inter, system-ui, sans-serif' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<BadActorTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar
            dataKey="events"
            radius={[0, 4, 4, 0]}
            label={{
              position: 'right',
              fill: 'var(--color-text-muted)',
              fontSize: 11,
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {BAD_ACTORS.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CRITICALITY_COLOR[entry.criticality]}
                opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.4}
                style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ── Asset Summary Table ───────────────────────────────────────────────────────

const STATUS_DOT_COLOR = {
  Critical: 'var(--color-critical)',
  Warning:  'var(--color-warning)',
  Healthy:  'var(--color-healthy)',
}

const TABLE_COLS = [
  { key: 'status',            label: 'Status',      width: 72 },
  { key: 'name',              label: 'Asset Name',  width: 'auto' },
  { key: 'priority',          label: 'Priority',    width: 80 },
  { key: 'oee',               label: 'OEE',         width: 72 },
  { key: 'activeEvents',      label: 'Active Ev.',  width: 80 },
  { key: 'repetitiveEvents',  label: 'Repetitive',  width: 80 },
  { key: 'downtime',          label: 'Downtime',    width: 80 },
  { key: 'workOrders',        label: 'WOs',         width: 56 },
  { key: 'rul',               label: 'RUL',         width: 88 },
]

function PriorityBadge({ priority }) {
  const badgeColors = {
    High:   { bg: 'var(--color-critical-bg)',  text: 'var(--color-critical)' },
    Medium: { bg: 'var(--color-warning-bg)',   text: 'var(--color-warning)' },
    Low:    { bg: 'var(--color-healthy-bg)',   text: 'var(--color-healthy)' },
  }
  const { bg, text } = badgeColors[priority] || badgeColors.Low
  return (
    <span
      style={{
        background: bg,
        color: text,
        fontSize: 11,
        fontWeight: 500,
        borderRadius: 4,
        padding: '2px 7px',
        whiteSpace: 'nowrap',
      }}
    >
      {priority}
    </span>
  )
}

function OeeCell({ value }) {
  const color =
    value >= 85 ? 'var(--color-healthy)'  :
    value >= 70 ? 'var(--color-warning)'  :
                  'var(--color-critical)'
  return <span style={{ color, fontWeight: 600 }}>{value}%</span>
}

function AssetRow({ asset, onNavigate }) {
  const [hovered, setHovered] = useState(false)
  return (
    <tr
      onClick={() => onNavigate && onNavigate('asset-detail', asset)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--color-surface-hover)' : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        borderBottom: '1px solid var(--color-border)',
        borderLeft: hovered ? '2px solid var(--color-accent)' : '2px solid transparent',
      }}
    >
      {/* Status */}
      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
        <span
          style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: STATUS_DOT_COLOR[asset.status] || 'var(--color-text-muted)',
            boxShadow: `0 0 6px ${STATUS_DOT_COLOR[asset.status] || 'transparent'}`,
          }}
        />
      </td>
      {/* Name */}
      <td
        style={{
          padding: '10px 12px',
          fontSize: 13,
          fontWeight: 500,
          color: hovered ? 'var(--color-accent)' : 'var(--color-text-primary)',
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
        }}
      >
        {asset.name}
      </td>
      {/* Priority */}
      <td style={{ padding: '10px 12px' }}>
        <PriorityBadge priority={asset.priority} />
      </td>
      {/* OEE */}
      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
        <OeeCell value={asset.oee} />
      </td>
      {/* Active Events */}
      <td
        style={{
          padding: '10px 12px',
          textAlign: 'right',
          color: asset.activeEvents > 0 ? 'var(--color-critical)' : 'var(--color-text-muted)',
          fontWeight: asset.activeEvents > 0 ? 600 : 400,
          fontSize: 13,
        }}
      >
        {asset.activeEvents}
      </td>
      {/* Repetitive Events */}
      <td
        style={{
          padding: '10px 12px',
          textAlign: 'right',
          color: asset.repetitiveEvents > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)',
          fontWeight: asset.repetitiveEvents > 0 ? 600 : 400,
          fontSize: 13,
        }}
      >
        {asset.repetitiveEvents}
      </td>
      {/* Downtime */}
      <td
        style={{
          padding: '10px 12px',
          textAlign: 'right',
          fontSize: 13,
          color: 'var(--color-text-secondary)',
        }}
      >
        {asset.downtime}
      </td>
      {/* Work Orders */}
      <td
        style={{
          padding: '10px 12px',
          textAlign: 'right',
          fontSize: 13,
          color: 'var(--color-text-secondary)',
        }}
      >
        {asset.workOrders}
      </td>
      {/* RUL */}
      <td
        style={{
          padding: '10px 12px',
          textAlign: 'right',
          fontSize: 13,
          color: 'var(--color-text-muted)',
        }}
      >
        {asset.rul}
      </td>
    </tr>
  )
}

function AssetSummaryTable({ onNavigate }) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 12,
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px 12px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
          Asset Summary
        </h3>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          {ASSET_SUMMARY.length} assets
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {TABLE_COLS.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: '8px 12px',
                    textAlign: col.key === 'name' ? 'left' : col.key === 'status' ? 'center' : 'right',
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    width: col.width !== 'auto' ? col.width : undefined,
                    background: 'var(--color-surface-raised)',
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
  )
}

// ── Root component ────────────────────────────────────────────────────────────

export default function AssetHealth({ onNavigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Row 1: KPI Bar */}
      <div>
        <SectionHeader label="Overview" />
        <KpiBar />
      </div>

      {/* Row 2: Three analysis cards */}
      <div>
        <SectionHeader label="Analysis" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          <RiskMatrixCard />
          <EventSummaryCard />
          <BadActorsCard />
        </div>
      </div>

      {/* Row 3: Asset Summary Table */}
      <div>
        <SectionHeader label="Assets" />
        <AssetSummaryTable onNavigate={onNavigate} />
      </div>
    </div>
  )
}
