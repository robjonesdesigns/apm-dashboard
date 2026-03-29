import { useState, useRef } from 'react'
import { PLANT, KPI_24H } from '../../data/assets'

// ── KPI descriptions (info tooltip content) ──────────────────────────────────

const KPI_DESCRIPTIONS = {
  oee: 'Overall Equipment Effectiveness. Combines availability, performance, and quality into a single metric showing how well equipment is being utilized.',
  availability: 'The percentage of scheduled time the equipment is available to operate. Downtime from breakdowns and changeovers reduces this number.',
  performance: 'How fast the equipment runs compared to its designed speed. Slow cycles and small stops reduce performance.',
  quality: 'The percentage of output that meets quality standards without rework. Defects and scrap reduce this metric.',
  trains: 'A train is a parallel processing line within the plant. Each train can operate independently. More trains running means more capacity.',
  activeAssets: 'The count of assets currently in an operational state out of all registered assets. Includes running and standby equipment.',
}

// ── Thresholds (from DESK-RESEARCH-006) ──────────────────────────────────────

const THRESHOLDS = {
  oee:          { warning: 85, critical: 75 },
  availability: { warning: 90, critical: 80 },
  performance:  { warning: 92, critical: 85 },
  quality:      { warning: 98, critical: 95 },
}

function getHealthState(key, value) {
  const t = THRESHOLDS[key]
  if (!t) return 'normal'
  if (value < t.critical) return 'critical'
  if (value < t.warning) return 'warning'
  return 'normal'
}

// ── KPI card config ─────────────────────────────────────────────────────────

const KPI_CONFIG = [
  { key: 'oee',          label: 'OEE',          value: PLANT.oee,          previous: PLANT.previousOee },
  { key: 'availability', label: 'Availability',  value: PLANT.availability, previous: PLANT.previousAvailability },
  { key: 'performance',  label: 'Performance',   value: PLANT.performance,  previous: PLANT.previousPerformance },
  { key: 'quality',      label: 'Quality',       value: PLANT.quality,      previous: PLANT.previousQuality },
]

// ── Icons ────────────────────────────────────────────────────────────────────

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="5" r="0.75" fill="currentColor" />
  </svg>
)

// Warning: solid inverted triangle (amber) -- "attention, declining"
// Same geometric family as the critical diamond. No directional
// confusion with delta arrows (which have tails).
const WarningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 14L1 3h14L8 14z" fill="currentColor" />
  </svg>
)

// Critical: solid filled diamond (red) -- "act now, threshold crossed"
// Diamond has no directional confusion with chevron (warning) or delta arrows.
// ISA-101 highest severity shape. Reads as "stop and look."
const CriticalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 1L15 8L8 15L1 8Z" fill="currentColor" />
  </svg>
)

// ── Tooltip (inverted, follows icon) ─────────────────────────────────────────

function Tooltip({ show, pos, children }) {
  if (!show) return null
  return (
    <div
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width: '220px',
        zIndex: 10001,
        animation: 'fadeIn var(--motion-fast) var(--ease-productive)',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: 'var(--color-tooltip-bg)',
          borderRadius: 'var(--radius-4)',
          padding: 'var(--spacing-12) var(--spacing-16)',
          boxShadow: 'var(--shadow-tooltip)',
        }}
      >
        <p className="type-body" style={{ color: 'var(--color-tooltip-text)', margin: 0 }}>
          {children}
        </p>
      </div>
    </div>
  )
}

// ── Info icon with tooltip trigger ───────────────────────────────────────────

function InfoButton({ description }) {
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const ref = useRef(null)

  const updatePos = () => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const tooltipWidth = 220
    const iconCenter = r.left + r.width / 2
    const centered = iconCenter - tooltipWidth / 2
    const rightEdge = window.innerWidth - tooltipWidth - 8
    const bubbleLeft = Math.max(8, Math.min(centered, rightEdge))
    // Caret offset: how far the icon center is from the bubble's left edge
    const caretLeft = iconCenter - bubbleLeft
    setPos({ top: r.bottom + 8, left: bubbleLeft, caretLeft })
  }

  return (
    <>
      <span
        ref={ref}
        style={{
          color: 'var(--color-text-helper)',
          cursor: 'help',
          display: 'flex',
          transition: 'color var(--motion-fast) var(--ease-productive)',
        }}
        onMouseEnter={(e) => { e.stopPropagation(); updatePos(); setShow(true); e.currentTarget.style.color = 'var(--color-text-primary)' }}
        onMouseLeave={(e) => { setShow(false); e.currentTarget.style.color = 'var(--color-text-helper)' }}
        onClick={(e) => { e.stopPropagation(); updatePos(); setShow(!show) }}
        role="img"
        aria-label={description}
      >
        <InfoIcon />
      </span>
      <Tooltip show={show} pos={pos}>{description}</Tooltip>
    </>
  )
}

// ── Health indicator ─────────────────────────────────────────────────────────

function HealthIndicator({ state, thresholdLabel }) {
  if (state === 'normal') return null

  const isWarning = state === 'warning'
  const color = isWarning ? 'var(--color-warning)' : 'var(--color-error)'
  const Icon = isWarning ? WarningIcon : CriticalIcon
  const label = isWarning ? 'Monitor' : 'Action Required'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-4)',
        color,
      }}
      aria-label={`${label}: ${thresholdLabel}`}
    >
      <Icon />
      <span className="type-meta" style={{ color }}>
        {label}
      </span>
    </div>
  )
}

// ── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({ config, onClick, isSelected }) {
  const health = getHealthState(config.key, config.value)
  const delta = config.value - config.previous
  const deltaSign = delta >= 0 ? '+' : ''
  const deltaColor = 'var(--color-text-secondary)'
  const valueColor = 'var(--color-text-primary)'

  const threshold = THRESHOLDS[config.key]
  const thresholdLabel = health === 'critical'
    ? `Below ${threshold.critical}%`
    : `Below ${threshold.warning}%`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <button
        className="card card-accent-top card-interactive"
        onClick={() => onClick(config.key)}
        aria-label={`${config.label}: ${config.value}%. ${health !== 'normal' ? health + '.' : ''} Click to view trend.`}
        aria-expanded={isSelected}
        style={{
          textAlign: 'left',
          width: '100%',
        }}
      >
        {/* Label + info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-8)' }}>
          <span className="type-card-title">{config.label}</span>
          <InfoButton description={KPI_DESCRIPTIONS[config.key]} />
        </div>

        {/* Value + health indicator inline */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-8)', flexWrap: 'wrap' }}>
          <span className="type-kpi" style={{ color: valueColor }}>
            {config.value}%
          </span>
          <HealthIndicator state={health} thresholdLabel={thresholdLabel} />
        </div>

        {/* Delta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
          <span className="type-meta" style={{ color: deltaColor }}>
            {deltaSign}{delta.toFixed(1)}% vs yesterday
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            {delta >= 0
              ? <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: deltaColor }} />
              : <path d="M2 2L10 10M10 10H4M10 10V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: deltaColor }} />
            }
          </svg>
        </div>
      </button>

      {/* Dropdown popover */}
      {isSelected && (
        <div
          className="card"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 10,
            padding: 'var(--spacing-12) var(--spacing-16)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-8)',
            animation: 'fadeIn var(--motion-fast) var(--ease-productive)',
            boxShadow: 'var(--shadow-overlay)',
          }}
        >
          {/* Sparkline with threshold -- last 24 hours */}
          <Sparkline
            data={KPI_24H}
            dataKey={config.key}
            threshold={THRESHOLDS[config.key]?.warning}
          />

          {/* Time range */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>{KPI_24H[0].time}</span>
            <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>{KPI_24H[KPI_24H.length - 1].time}</span>
          </div>

          {/* Before / After */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing-8)' }}>
            <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>
              Before: <strong style={{ color: 'var(--color-text-primary)' }}>{config.previous}%</strong>
            </span>
            <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>
              After: <strong style={{ color: 'var(--color-text-primary)' }}>{config.value}%</strong>
            </span>
          </div>

          {/* Go to Trends */}
          <div style={{ textAlign: 'right', paddingTop: 'var(--spacing-4)' }}>
            <span className="type-link" style={{ cursor: 'pointer', fontSize: 'var(--text-12)' }}>Go to Trends &rarr;</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sparkline (pure SVG, 12-month trend) ─────────────────────────────────────

function Sparkline({ data, dataKey, threshold }) {
  if (!data || data.length === 0) return null

  const vbWidth = 280
  const vbHeight = 56
  const values = data.map(d => d[dataKey])
  const allValues = threshold ? [...values, threshold] : values
  const min = Math.min(...allValues) - 2
  const max = Math.max(...allValues) + 2
  const range = max - min || 1
  const px = 4
  const py = 6
  const rightPad = 36
  const chartWidth = vbWidth - px - rightPad
  const stepX = chartWidth / (values.length - 1)

  const toY = (v) => py + (1 - (v - min) / range) * (vbHeight - py * 2)

  const points = values.map((v, i) => {
    const x = px + i * stepX
    const y = toY(v)
    return `${x},${y}`
  }).join(' ')

  const lastX = px + (values.length - 1) * stepX
  const lastY = toY(values[values.length - 1])
  const lastValue = values[values.length - 1]

  const thresholdY = threshold ? toY(threshold) : null

  return (
    <svg
      viewBox={`0 0 ${vbWidth} ${vbHeight}`}
      preserveAspectRatio="none"
      style={{ display: 'block', width: '100%', height: 56 }}
    >
      {/* Threshold line */}
      {threshold && (
        <>
          <line
            x1={px}
            y1={thresholdY}
            x2={px + chartWidth}
            y2={thresholdY}
            stroke="var(--color-text-helper)"
            strokeWidth={1}
            strokeDasharray="3 3"
            opacity={0.5}
          />
          <text
            x={px + chartWidth + 4}
            y={thresholdY + 3}
            className="type-meta"
            fill="var(--color-text-helper)"
            fontSize={10}
          >
            {threshold}%
          </text>
        </>
      )}

      {/* Trend line */}
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Current value dot + label */}
      <circle cx={lastX} cy={lastY} r={3} fill="var(--color-accent)" />
      <text
        x={lastX + 6}
        y={lastY + 3}
        fill="var(--color-accent)"
        fontSize={10}
        fontWeight={600}
      >
        {lastValue}%
      </text>
    </svg>
  )
}

// ── KpiBar ───────────────────────────────────────────────────────────────────

export default function KpiBar({ onKpiClick }) {
  const [selectedKpi, setSelectedKpi] = useState(null)

  function handleKpiClick(key) {
    setSelectedKpi(prev => prev === key ? null : key)
    onKpiClick?.(key)
  }

  return (
    <div>
    <div className="kpi-grid">
      {KPI_CONFIG.map((config) => (
        <KpiCard key={config.key} config={config} onClick={handleKpiClick} isSelected={selectedKpi === config.key} />
      ))}

      {/* Trains */}
      <div className="card" style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-8)' }}>
          <span className="type-card-title">Trains</span>
          <InfoButton description={KPI_DESCRIPTIONS.trains} />
        </div>
        <span className="type-kpi" style={{ display: 'block' }}>
          {PLANT.trains}
        </span>
      </div>

      {/* Active Assets */}
      <div className="card" style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-8)' }}>
          <span className="type-card-title">Active Assets</span>
          <InfoButton description={KPI_DESCRIPTIONS.activeAssets} />
        </div>
        <span style={{ display: 'block' }}>
          <span className="type-kpi">{PLANT.activeAssets}</span>
          <span className="type-kpi" style={{ color: 'var(--color-text-secondary)' }}>/{PLANT.totalAssets}</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
          <span className="type-meta" style={{ color: 'var(--color-text-secondary)' }}>
            -4 vs yesterday
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path d="M2 2L10 10M10 10H4M10 10V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-secondary)' }} />
          </svg>
        </div>
      </div>
    </div>

    </div>
  )
}
