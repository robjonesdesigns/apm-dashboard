import {
  BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, LabelList,
} from 'recharts'
import {
  ASSET_DETAIL, RELIABILITY, MAINTENANCE,
  PERFORMANCE_ATTRIBUTES, ASSET_SPECS,
} from '../data/assets'

// ── Shared Tooltip ──────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-raised border border-border-strong rounded-lg px-3 py-2 shadow-lg text-xs font-sans">
      {label && <p className="text-text-muted mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color || entry.fill || '#e8eaf0' }}>
          {entry.name && <span className="text-text-secondary">{entry.name}: </span>}
          <span className="font-semibold">
            {formatter ? formatter(entry.value) : entry.value}
          </span>
        </p>
      ))}
    </div>
  )
}

// ── Section Label ───────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p className="text-xs uppercase tracking-widest font-semibold text-text-muted mb-3">
      {children}
    </p>
  )
}

// ── Card ────────────────────────────────────────────────────────────────────

function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface rounded-xl border border-border p-lg ${className}`}>
      {children}
    </div>
  )
}

function CardTitle({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-4">
      {children}
    </p>
  )
}

// ── Row 1, Card 1: Availability / Performance / Utilization Bar Chart ───────

const METRIC_COLORS = ['#2dd4bf', '#3b82f6', '#a78bfa']

function AvailBarChart() {
  const data = RELIABILITY.metrics

  const CustomLabel = (props) => {
    const { x, y, width, value } = props
    return (
      <text
        x={x + width / 2}
        y={y - 6}
        fill="#9ba1b0"
        fontSize={11}
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
      >
        {value}%
      </text>
    )
  }

  return (
    <Card className="flex-1">
      <CardTitle>Availability / Performance / Utilization</CardTitle>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 20, right: 8, left: -24, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'Inter, system-ui, sans-serif' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'Inter, system-ui, sans-serif' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip active={active} payload={payload} label={label} formatter={(v) => `${v}%`} />
            )}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          {data.map((entry) => (
            <ReferenceLine
              key={`ref-${entry.name}`}
              y={entry.target}
              stroke="rgba(255,255,255,0.25)"
              strokeDasharray="4 3"
              strokeWidth={1}
            />
          ))}
          <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={48}>
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={METRIC_COLORS[i]} />
            ))}
            <LabelList content={<CustomLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3">
        {data.map((entry, i) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ background: METRIC_COLORS[i] }}
            />
            <span className="text-xs text-text-secondary">{entry.name}</span>
            <span className="text-xs text-text-muted">target {entry.target}%</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Row 1, Card 2: Run Status Timeline ─────────────────────────────────────

const EVENT_STYLES = {
  trip: {
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.15)',
    label: 'Trip',
    shape: 'circle',    // circle = differentiated by shape
  },
  warning: {
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.15)',
    label: 'Warning',
    shape: 'triangle',  // triangle
  },
  shutdown: {
    color: '#6b7280',
    bgColor: 'rgba(107,114,128,0.15)',
    label: 'Shutdown',
    shape: 'square',    // square
  },
}

// SVG icons — different shapes for accessibility (color + shape + position)
function EventIcon({ type, size = 14 }) {
  const style = EVENT_STYLES[type]
  if (!style) return null

  if (style.shape === 'circle') {
    // Red circle with ! — trip
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 14 14"
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        <circle cx="7" cy="7" r="6" fill={style.color} />
        <text x="7" y="11" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fff" fontFamily="Inter, sans-serif">!</text>
      </svg>
    )
  }
  if (style.shape === 'triangle') {
    // Amber triangle — warning
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 14 14"
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        <polygon points="7,1 13,13 1,13" fill={style.color} />
        <text x="7" y="12" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff" fontFamily="Inter, sans-serif">!</text>
      </svg>
    )
  }
  // Square — shutdown
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <rect x="1" y="1" width="12" height="12" rx="2" fill={style.color} />
      <rect x="4" y="4" width="6" height="6" rx="1" fill="#fff" opacity="0.6" />
    </svg>
  )
}

function RunStatusTimeline() {
  const blocks = RELIABILITY.runStatus
  // Group into 7 days
  const days = Array.from({ length: 7 }, (_, d) => ({
    day: d,
    label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d],
    hours: blocks.filter((b) => b.day === d),
  }))

  // Collect distinct events (deduplicate consecutive same-type)
  const eventBlocks = blocks.filter((b) => b.event !== null)

  return (
    <Card className="flex-1">
      <CardTitle>Run Status — Last 7 Days</CardTitle>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm inline-block" style={{ background: '#22c55e' }} />
          <span className="text-xs text-text-secondary">Running</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm inline-block" style={{ background: '#2e313b' }} />
          <span className="text-xs text-text-secondary">Off</span>
        </div>
        {Object.entries(EVENT_STYLES).map(([type, s]) => (
          <div key={type} className="flex items-center gap-1.5">
            <EventIcon type={type} size={12} />
            <span className="text-xs text-text-secondary">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Timeline grid */}
      <div className="space-y-1.5" role="img" aria-label="Run status timeline for last 7 days">
        {days.map(({ day, label, hours }) => (
          <div key={day} className="flex items-center gap-2">
            <span className="text-xs text-text-muted w-7 shrink-0">{label}</span>
            <div className="flex gap-px flex-1 items-center">
              {hours.map((block) => {
                const isEvent = block.event !== null
                const isRunning = block.running
                const eventStyle = isEvent ? EVENT_STYLES[block.event.type] : null

                // Height/position differentiation:
                // Running = taller block at top; Off = shorter block at bottom; event overrides
                return (
                  <div key={block.hour} className="relative flex-1 flex flex-col justify-end" style={{ height: 20 }}>
                    {/* Base block */}
                    <div
                      className="absolute inset-x-0 rounded-sm"
                      style={{
                        height: isRunning ? 16 : 8,
                        bottom: isRunning ? 2 : 0,
                        background: isEvent
                          ? eventStyle.bgColor
                          : isRunning
                          ? 'rgba(34,197,94,0.55)'
                          : '#2e313b',
                      }}
                      title={
                        block.event
                          ? `Hour ${block.hour}: ${block.event.label} (${block.event.type})`
                          : `Hour ${block.hour}: ${isRunning ? 'Running' : 'Off'}`
                      }
                    />
                    {/* Event icon overlaid on the block */}
                    {isEvent && (
                      <div
                        className="absolute inset-x-0 flex items-center justify-center"
                        style={{ bottom: isRunning ? 2 : 0, height: isRunning ? 16 : 8 }}
                        aria-label={`${block.event.type}: ${block.event.label}`}
                      >
                        <EventIcon type={block.event.type} size={8} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Event log summary */}
      <div className="mt-4 pt-4 border-t border-border space-y-1.5">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Events</p>
        {eventBlocks
          .filter((b, i, arr) => arr.findIndex((x) => x.event?.label === b.event?.label) === i)
          .map((block) => {
            const s = EVENT_STYLES[block.event.type]
            const dayLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][block.day]
            const hourInDay = block.hour % 24
            return (
              <div key={block.hour} className="flex items-center gap-2">
                <EventIcon type={block.event.type} size={12} />
                <span className="text-xs" style={{ color: s.color }}>
                  {block.event.label}
                </span>
                <span className="text-xs text-text-muted ml-auto">
                  {dayLabel} {String(hourInDay).padStart(2, '0')}:00
                </span>
              </div>
            )
          })}
      </div>
    </Card>
  )
}

// ── Row 1, Card 3: Downtime Doughnut ───────────────────────────────────────

function DowntimeDoughnut() {
  const data = RELIABILITY.downtimeBySubAsset
  const total = data.reduce((s, d) => s + d.hours, 0)

  const CenterLabel = ({ viewBox }) => {
    if (!viewBox) return null
    const { cx, cy } = viewBox
    return (
      <>
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fill="#e8eaf0"
          fontSize={22}
          fontWeight="700"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {total}h
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill="#6b7280"
          fontSize={10}
          fontFamily="Inter, system-ui, sans-serif"
        >
          total downtime
        </text>
      </>
    )
  }

  return (
    <Card className="flex-1">
      <CardTitle>Downtime by Sub-Asset</CardTitle>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            dataKey="hours"
            nameKey="name"
            innerRadius={52}
            outerRadius={78}
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
            <CenterLabel />
          </Pie>
          <Tooltip
            content={({ active, payload }) => (
              <ChartTooltip
                active={active}
                payload={payload?.map((p) => ({
                  ...p,
                  color: p.payload.color,
                  name: p.name,
                }))}
                formatter={(v) => `${v}h`}
              />
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: entry.color }}
            />
            <span className="text-xs text-text-secondary flex-1 truncate">{entry.name}</span>
            <span className="text-xs font-semibold text-text-primary">{entry.hours}h</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Row 2, Card 1: Bad Actors Horizontal Bar ────────────────────────────────

function BadActorsBar() {
  const data = [...MAINTENANCE.badActors].sort((a, b) => b.events - a.events)
  const max = data[0]?.events || 1

  return (
    <Card className="flex-1">
      <CardTitle>Bad Actors (Sub-Asset)</CardTitle>
      <div className="space-y-3">
        {data.map((item) => {
          const pct = (item.events / max) * 100
          return (
            <div key={item.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-text-secondary">{item.name}</span>
                <span className="text-xs font-semibold text-critical">{item.events}</span>
              </div>
              <div className="h-2 rounded-full bg-surface-raised overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: '#ef4444' }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ── Row 2, Card 2: Work Orders Doughnut ────────────────────────────────────

const WO_COLORS = {
  open: '#ef4444',
  scheduled: '#2dd4bf',
  unscheduled: '#f59e0b',
  closed: '#22c55e',
  onHold: '#a78bfa',
}

const WO_LABELS = {
  open: 'Open',
  scheduled: 'Scheduled',
  unscheduled: 'Unscheduled',
  closed: 'Closed',
  onHold: 'On Hold',
}

function WorkOrdersDoughnut() {
  const wo = MAINTENANCE.workOrders
  const data = Object.entries(wo).map(([key, value]) => ({
    name: WO_LABELS[key],
    value,
    color: WO_COLORS[key],
  }))
  const total = data.reduce((s, d) => s + d.value, 0)

  const CenterLabel = ({ viewBox }) => {
    if (!viewBox) return null
    const { cx, cy } = viewBox
    return (
      <>
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fill="#e8eaf0"
          fontSize={22}
          fontWeight="700"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill="#6b7280"
          fontSize={10}
          fontFamily="Inter, system-ui, sans-serif"
        >
          work orders
        </text>
      </>
    )
  }

  return (
    <Card className="flex-1">
      <CardTitle>Work Orders</CardTitle>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={52}
            outerRadius={78}
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
            <CenterLabel />
          </Pie>
          <Tooltip
            content={({ active, payload }) => (
              <ChartTooltip
                active={active}
                payload={payload?.map((p) => ({
                  ...p,
                  color: p.payload.color,
                }))}
              />
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: entry.color }}
            />
            <span className="text-xs text-text-secondary flex-1">{entry.name}</span>
            <span className="text-xs font-semibold text-text-primary">{entry.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Row 2, Card 3: Maintenance KPIs ────────────────────────────────────────

function SparkLine({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={36}>
      <LineChart data={data.map((v, i) => ({ v, i }))} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function MaintenanceKPIs() {
  const kpis = MAINTENANCE.kpis

  const sparkColor = (kpi) => {
    if (kpi.label === 'MTBF') return kpi.trend === 'down' ? '#ef4444' : '#22c55e'
    if (kpi.label === 'MTTR') return kpi.trend === 'up' ? '#ef4444' : '#22c55e'
    return '#9ba1b0' // stable / neutral
  }

  return (
    <Card className="flex-1 flex flex-col gap-3">
      <CardTitle>Maintenance KPIs</CardTitle>
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-surface-raised rounded-lg p-md flex items-center gap-4"
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-muted mb-0.5">{kpi.label}</p>
            <p className="text-xl font-bold text-text-primary leading-tight">{kpi.value}</p>
          </div>
          <div className="w-28 shrink-0">
            <SparkLine data={kpi.spark} color={sparkColor(kpi)} />
          </div>
        </div>
      ))}
    </Card>
  )
}

// ── Row 3, Card 1: Performance Attributes Table ─────────────────────────────

function deviationColor(deviation) {
  const abs = Math.abs(deviation)
  if (abs > 10) return '#ef4444'
  if (abs > 3) return '#f59e0b'
  return '#22c55e'
}

function deviationLabel(deviation) {
  return deviation >= 0 ? `+${deviation}%` : `${deviation}%`
}

function PerformanceTable({ onNavigate }) {
  return (
    <Card className="flex-[2]">
      <CardTitle>Performance Attributes</CardTitle>
      <div className="overflow-x-auto -mx-lg">
        <table className="w-full text-xs" style={{ minWidth: 520 }}>
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-text-muted font-semibold px-lg py-2 whitespace-nowrap">Attribute</th>
              <th className="text-left text-text-muted font-semibold px-3 py-2">Asset</th>
              <th className="text-right text-text-muted font-semibold px-3 py-2">Value</th>
              <th className="text-right text-text-muted font-semibold px-3 py-2">Expected</th>
              <th className="text-left text-text-muted font-semibold px-3 py-2">Unit</th>
              <th className="text-right text-text-muted font-semibold px-lg py-2">Deviation</th>
            </tr>
          </thead>
          <tbody>
            {PERFORMANCE_ATTRIBUTES.map((row, i) => (
              <tr
                key={row.attribute}
                className="border-b border-border cursor-pointer transition-colors duration-100 hover:bg-surface-hover"
                onClick={() => onNavigate?.('trends', { attribute: row.attribute })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onNavigate?.('trends', { attribute: row.attribute })
                  }
                }}
                aria-label={`View trends for ${row.attribute}`}
              >
                <td className="px-lg py-2.5 text-text-primary font-medium whitespace-nowrap">{row.attribute}</td>
                <td className="px-3 py-2.5 text-text-muted">{row.asset}</td>
                <td className="px-3 py-2.5 text-right text-text-primary font-semibold tabular-nums">{row.value}</td>
                <td className="px-3 py-2.5 text-right text-text-muted tabular-nums">{row.expected}</td>
                <td className="px-3 py-2.5 text-text-muted">{row.unit}</td>
                <td className="px-lg py-2.5 text-right">
                  <span
                    className="font-semibold tabular-nums"
                    style={{ color: deviationColor(row.deviation) }}
                  >
                    {deviationLabel(row.deviation)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ── Row 3, Card 2: Asset Specifications ────────────────────────────────────

function AssetSpecifications() {
  return (
    <Card className="flex-1">
      <CardTitle>Asset Specifications</CardTitle>
      <div>
        {ASSET_SPECS.map((spec, i) => (
          <div
            key={spec.label}
            className={`flex justify-between items-start gap-4 py-2.5 ${
              i < ASSET_SPECS.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <span className="text-xs text-text-muted">{spec.label}</span>
            <span className="text-xs font-medium text-text-primary text-right">{spec.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Asset Header ────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  Critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  Warning:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  Healthy:  { color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
}

function AssetHeader({ asset }) {
  const status = asset.status || 'Healthy'
  const s = STATUS_STYLES[status] || STATUS_STYLES.Healthy
  return (
    <div className="flex items-center justify-between mb-xl pb-lg border-b border-border">
      <div>
        <h2 className="text-xl font-bold text-text-primary leading-tight">{asset.name}</h2>
        <p className="text-xs text-text-muted mt-0.5">
          {asset.type} &middot; {asset.processUnit} &middot; {asset.service}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ color: s.color, background: s.bg }}
        >
          {status}
        </span>
        <span
          className="text-xs px-2 py-1 rounded font-medium"
          style={{ color: '#9ba1b0', background: 'rgba(255,255,255,0.05)' }}
        >
          {asset.criticality}
        </span>
      </div>
    </div>
  )
}

// ── Root Component ──────────────────────────────────────────────────────────

export default function AssetDetails({ onNavigate, selectedAsset }) {
  const asset = selectedAsset || ASSET_DETAIL

  return (
    <div className="space-y-xl">

      {/* Asset Header */}
      <AssetHeader asset={asset} />

      {/* Row 1: Reliability */}
      <section aria-labelledby="reliability-heading">
        <SectionLabel id="reliability-heading">Reliability</SectionLabel>
        <div className="flex gap-lg items-stretch">
          <AvailBarChart />
          <RunStatusTimeline />
          <DowntimeDoughnut />
        </div>
      </section>

      {/* Row 2: Maintenance */}
      <section aria-labelledby="maintenance-heading">
        <SectionLabel id="maintenance-heading">Maintenance</SectionLabel>
        <div className="flex gap-lg items-stretch">
          <BadActorsBar />
          <WorkOrdersDoughnut />
          <MaintenanceKPIs />
        </div>
      </section>

      {/* Row 3: Performance */}
      <section aria-labelledby="performance-heading">
        <SectionLabel id="performance-heading">Performance</SectionLabel>
        <div className="flex gap-lg items-stretch">
          <PerformanceTable onNavigate={onNavigate} />
          <AssetSpecifications />
        </div>
      </section>

    </div>
  )
}
