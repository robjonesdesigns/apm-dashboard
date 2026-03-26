// ── Trends ────────────────────────────────────────────────────────────────────
// Attribute trend analysis view. Engineers compare multiple attributes over
// time to identify correlations and anomalies.

import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
  Legend,
} from 'recharts'
import { TRENDS_DATA, TREND_ATTRIBUTES } from '../data/assets'

// ── Helpers ───────────────────────────────────────────────────────────────────

const TIME_RANGES = [
  { label: '24h', hours: 24 },
  { label: '48h', hours: 48 },
  { label: '7d', hours: 168 },
  { label: '30d', hours: 720 },
]

function getStatus(deviationPct) {
  const abs = Math.abs(deviationPct)
  if (abs >= 15) return 'critical'
  if (abs >= 8) return 'warning'
  return 'healthy'
}

function StatusDot({ status }) {
  const colorMap = {
    critical: 'bg-[var(--color-critical)]',
    warning: 'bg-[var(--color-warning)]',
    healthy: 'bg-[var(--color-healthy)]',
  }
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full shrink-0 ${colorMap[status]}`}
      aria-label={status}
    />
  )
}

// ── Custom tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label, selectedAttrs }) {
  if (!active || !payload || !payload.length) return null

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] p-[var(--spacing-sm)]"
      style={{ background: '#1e2130', minWidth: 200, fontSize: 12 }}
    >
      <p className="text-[var(--color-text-muted)] mb-[var(--spacing-sm)]" style={{ fontSize: 11 }}>
        {label}
      </p>
      {payload.map((entry) => {
        const attr = TREND_ATTRIBUTES.find((a) => a.key === entry.dataKey)
        if (!attr) return null
        // Calculate expected as baseline (first value approximation using attribute threshold context)
        const expected = attr.threshold
        const deviation = expected !== 0 ? ((entry.value - expected) / expected) * 100 : 0
        return (
          <div key={entry.dataKey} className="flex flex-col gap-0.5 mb-[var(--spacing-xs)] last:mb-0">
            <div className="flex items-center gap-[var(--spacing-xs)]">
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ background: attr.color }}
              />
              <span className="text-[var(--color-text-secondary)] font-medium">{attr.label}</span>
            </div>
            <div className="pl-[calc(var(--spacing-xs)+8px)] flex flex-col gap-0.5" style={{ fontSize: 11 }}>
              <div className="flex justify-between gap-[var(--spacing-md)]">
                <span className="text-[var(--color-text-muted)]">Value</span>
                <span className="text-[var(--color-text-primary)] font-semibold tabular-nums">
                  {entry.value.toFixed(2)} {attr.unit}
                </span>
              </div>
              <div className="flex justify-between gap-[var(--spacing-md)]">
                <span className="text-[var(--color-text-muted)]">Threshold</span>
                <span className="text-[var(--color-text-secondary)] tabular-nums">
                  {expected} {attr.unit}
                </span>
              </div>
              <div className="flex justify-between gap-[var(--spacing-md)]">
                <span className="text-[var(--color-text-muted)]">Deviation</span>
                <span
                  className="tabular-nums font-medium"
                  style={{
                    color:
                      Math.abs(deviation) >= 15
                        ? 'var(--color-critical)'
                        : Math.abs(deviation) >= 8
                        ? 'var(--color-warning)'
                        : 'var(--color-healthy)',
                  }}
                >
                  {deviation > 0 ? '+' : ''}
                  {deviation.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Single chart (used in Separate mode) ─────────────────────────────────────

function SingleChart({ attr, data, height = 220 }) {
  const latest = data[data.length - 1]
  const currentVal = latest ? latest[attr.key] : null
  const deviation =
    currentVal !== null && attr.threshold !== 0
      ? ((currentVal - attr.threshold) / attr.threshold) * 100
      : 0
  const status = getStatus(deviation)

  const statusColorMap = {
    critical: 'var(--color-critical)',
    warning: 'var(--color-warning)',
    healthy: 'var(--color-healthy)',
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-[var(--spacing-md)]">
      {/* Card header */}
      <div className="flex items-start justify-between mb-[var(--spacing-md)]">
        <div className="flex items-center gap-[var(--spacing-sm)]">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: attr.color }}
          />
          <span className="text-[var(--color-text-primary)] font-semibold" style={{ fontSize: 13 }}>
            {attr.label}
          </span>
        </div>
        <StatusDot status={status} />
      </div>

      {/* Metrics row */}
      <div className="flex gap-[var(--spacing-lg)] mb-[var(--spacing-md)]">
        <div>
          <p className="text-[var(--color-text-muted)] mb-0.5" style={{ fontSize: 11 }}>
            Current
          </p>
          <p className="text-[var(--color-text-primary)] font-semibold tabular-nums" style={{ fontSize: 14 }}>
            {currentVal !== null ? currentVal.toFixed(2) : '—'}
            <span className="text-[var(--color-text-muted)] font-normal" style={{ fontSize: 11 }}>
              {' '}
              {attr.unit}
            </span>
          </p>
        </div>
        <div>
          <p className="text-[var(--color-text-muted)] mb-0.5" style={{ fontSize: 11 }}>
            Threshold
          </p>
          <p className="text-[var(--color-text-secondary)] tabular-nums" style={{ fontSize: 14 }}>
            {attr.threshold}
            <span className="text-[var(--color-text-muted)] font-normal" style={{ fontSize: 11 }}>
              {' '}
              {attr.unit}
            </span>
          </p>
        </div>
        <div>
          <p className="text-[var(--color-text-muted)] mb-0.5" style={{ fontSize: 11 }}>
            Deviation
          </p>
          <p
            className="font-semibold tabular-nums"
            style={{ fontSize: 14, color: statusColorMap[status] }}
          >
            {deviation > 0 ? '+' : ''}
            {deviation.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={Math.floor(data.length / 6)}
            tickFormatter={(v) => {
              const parts = v.split(' ')
              return parts.length === 2 ? parts[0] + ' ' + parts[1] : v
            }}
          />
          <YAxis
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
            width={44}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }}
          />
          <ReferenceLine
            y={attr.threshold}
            stroke="rgba(239,68,68,0.35)"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          <Line
            type="monotone"
            dataKey={attr.key}
            stroke={attr.color}
            strokeWidth={1.75}
            dot={false}
            activeDot={{ r: 4, fill: attr.color, strokeWidth: 0 }}
          />
          <Brush
            dataKey="time"
            height={20}
            stroke="var(--color-border-strong)"
            fill="var(--color-surface-raised)"
            travellerWidth={6}
            startIndex={Math.max(0, data.length - 48)}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Trends({ selectedAttribute }) {
  const [selected, setSelected] = useState(
    selectedAttribute ? [selectedAttribute] : ['dischargePressure', 'bearingVibration']
  )
  const [timeRange, setTimeRange] = useState('7d')
  const [mode, setMode] = useState('overlay') // 'overlay' | 'separate'

  // Filter data to selected time range
  const filteredData = useMemo(() => {
    const hours = TIME_RANGES.find((r) => r.label === timeRange)?.hours ?? 168
    return TRENDS_DATA.slice(-Math.min(hours, TRENDS_DATA.length))
  }, [timeRange])

  // Selected attribute definitions
  const selectedAttrs = useMemo(
    () => TREND_ATTRIBUTES.filter((a) => selected.includes(a.key)),
    [selected]
  )

  function toggleAttr(key) {
    setSelected((prev) =>
      prev.includes(key)
        ? prev.length > 1
          ? prev.filter((k) => k !== key)
          : prev // keep at least one selected
        : [...prev, key]
    )
  }

  // Summary table rows
  const summaryRows = useMemo(() => {
    const latest = filteredData[filteredData.length - 1]
    if (!latest) return []
    return selectedAttrs.map((attr) => {
      const current = latest[attr.key] ?? null
      const threshold = attr.threshold
      const deviation =
        current !== null && threshold !== 0 ? ((current - threshold) / threshold) * 100 : 0
      return { attr, current, threshold, deviation, status: getStatus(deviation) }
    })
  }, [filteredData, selectedAttrs])

  const statusColorMap = {
    critical: 'var(--color-critical)',
    warning: 'var(--color-warning)',
    healthy: 'var(--color-healthy)',
  }

  const separateCols = selectedAttrs.length === 1 ? 1 : 2

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)]">

      {/* ── Attribute selector ───────────────────────────────────────────── */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-[var(--spacing-lg)]">
        <p
          className="text-[var(--color-text-muted)] uppercase tracking-widest mb-[var(--spacing-md)]"
          style={{ fontSize: 11, letterSpacing: '0.08em' }}
        >
          Attributes
        </p>
        <div className="flex flex-wrap gap-[var(--spacing-sm)]">
          {TREND_ATTRIBUTES.map((attr) => {
            const isActive = selected.includes(attr.key)
            return (
              <button
                key={attr.key}
                onClick={() => toggleAttr(attr.key)}
                className={[
                  'flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] rounded-[var(--radius-md)] border transition-colors duration-150 cursor-pointer',
                  isActive
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-text-primary)]'
                    : 'border-[var(--color-border-strong)] bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]',
                ].join(' ')}
                style={{ height: 34, fontSize: 13 }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ background: attr.color }}
                />
                {attr.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Chart controls ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-[var(--spacing-md)]">
        {/* Time range pills */}
        <div className="flex items-center gap-[var(--spacing-xs)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-[var(--spacing-xs)]">
          {TIME_RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setTimeRange(r.label)}
              className={[
                'px-[var(--spacing-md)] rounded-[var(--radius-md)] transition-colors duration-150 cursor-pointer font-medium',
                timeRange === r.label
                  ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
              ].join(' ')}
              style={{ height: 30, fontSize: 12 }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Overlay / Separate toggle */}
        <div className="flex items-center gap-[var(--spacing-xs)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-[var(--spacing-xs)]">
          {['overlay', 'separate'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={[
                'px-[var(--spacing-md)] rounded-[var(--radius-md)] transition-colors duration-150 cursor-pointer font-medium capitalize',
                mode === m
                  ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
              ].join(' ')}
              style={{ height: 30, fontSize: 12 }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* ── Charts ───────────────────────────────────────────────────────── */}
      {mode === 'overlay' ? (
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-[var(--spacing-lg)]">
          <div className="flex items-center justify-between mb-[var(--spacing-lg)]">
            <h2 className="text-[var(--color-text-primary)] font-semibold" style={{ fontSize: 14 }}>
              Overlay View
            </h2>
            <p className="text-[var(--color-text-muted)]" style={{ fontSize: 12 }}>
              {selectedAttrs.length} attribute{selectedAttrs.length !== 1 ? 's' : ''} selected
            </p>
          </div>
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={filteredData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={Math.floor(filteredData.length / 8)}
                tickFormatter={(v) => {
                  const parts = v.split(' ')
                  return parts.length === 2 ? parts[0] + '\n' + parts[1] : v
                }}
              />
              {selectedAttrs.map((attr, i) => (
                <YAxis
                  key={attr.key}
                  yAxisId={attr.key}
                  orientation={i % 2 === 0 ? 'left' : 'right'}
                  tick={{ fill: attr.color, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={42}
                  tickFormatter={(v) => `${v.toFixed(0)}`}
                />
              ))}
              <Tooltip
                content={<CustomTooltip selectedAttrs={selectedAttrs} />}
                cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(value) => {
                  const attr = TREND_ATTRIBUTES.find((a) => a.key === value)
                  return (
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      {attr ? attr.label : value}
                    </span>
                  )
                }}
              />
              {selectedAttrs.map((attr) => (
                <ReferenceLine
                  key={`ref-${attr.key}`}
                  yAxisId={attr.key}
                  y={attr.threshold}
                  stroke={attr.color}
                  strokeOpacity={0.25}
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
              ))}
              {selectedAttrs.map((attr) => (
                <Line
                  key={attr.key}
                  yAxisId={attr.key}
                  type="monotone"
                  dataKey={attr.key}
                  stroke={attr.color}
                  strokeWidth={1.75}
                  dot={false}
                  activeDot={{ r: 4, fill: attr.color, strokeWidth: 0 }}
                />
              ))}
              <Brush
                dataKey="time"
                height={20}
                stroke="var(--color-border-strong)"
                fill="var(--color-surface-raised)"
                travellerWidth={6}
                startIndex={Math.max(0, filteredData.length - 48)}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div
          className={[
            'grid gap-[var(--spacing-lg)]',
            separateCols === 1 ? 'grid-cols-1' : 'grid-cols-2',
          ].join(' ')}
        >
          {selectedAttrs.map((attr) => (
            <SingleChart
              key={attr.key}
              attr={attr}
              data={filteredData}
              height={220}
            />
          ))}
        </div>
      )}

      {/* ── Attribute details table ──────────────────────────────────────── */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-[var(--spacing-lg)]">
        <h2
          className="text-[var(--color-text-primary)] font-semibold mb-[var(--spacing-md)]"
          style={{ fontSize: 14 }}
        >
          Current Readings
        </h2>
        <table className="w-full" style={{ fontSize: 13, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['Attribute', 'Current Value', 'Threshold', 'Deviation', 'Status'].map((col) => (
                <th
                  key={col}
                  className="text-left text-[var(--color-text-muted)] font-medium pb-[var(--spacing-sm)]"
                  style={{ fontSize: 11, letterSpacing: '0.04em', paddingRight: 20 }}
                >
                  {col.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {summaryRows.map(({ attr, current, threshold, deviation, status }) => (
              <tr
                key={attr.key}
                style={{ borderBottom: '1px solid var(--color-border)' }}
                className="hover:bg-[var(--color-surface-hover)] transition-colors duration-100"
              >
                {/* Attribute */}
                <td className="py-[var(--spacing-sm)]" style={{ paddingRight: 20 }}>
                  <div className="flex items-center gap-[var(--spacing-sm)]">
                    <span
                      className="inline-block w-2 h-2 rounded-full shrink-0"
                      style={{ background: attr.color }}
                    />
                    <span className="text-[var(--color-text-primary)]">{attr.label}</span>
                  </div>
                </td>
                {/* Current */}
                <td
                  className="py-[var(--spacing-sm)] text-[var(--color-text-primary)] font-semibold tabular-nums"
                  style={{ paddingRight: 20 }}
                >
                  {current !== null ? current.toFixed(2) : '—'}{' '}
                  <span className="text-[var(--color-text-muted)] font-normal" style={{ fontSize: 11 }}>
                    {attr.unit}
                  </span>
                </td>
                {/* Threshold */}
                <td
                  className="py-[var(--spacing-sm)] text-[var(--color-text-secondary)] tabular-nums"
                  style={{ paddingRight: 20 }}
                >
                  {threshold}{' '}
                  <span className="text-[var(--color-text-muted)]" style={{ fontSize: 11 }}>
                    {attr.unit}
                  </span>
                </td>
                {/* Deviation */}
                <td
                  className="py-[var(--spacing-sm)] font-semibold tabular-nums"
                  style={{ paddingRight: 20, color: statusColorMap[status] }}
                >
                  {deviation > 0 ? '+' : ''}
                  {deviation.toFixed(1)}%
                </td>
                {/* Status */}
                <td className="py-[var(--spacing-sm)]">
                  <div className="flex items-center gap-[var(--spacing-sm)]">
                    <StatusDot status={status} />
                    <span
                      className="capitalize"
                      style={{ color: statusColorMap[status], fontSize: 12 }}
                    >
                      {status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
