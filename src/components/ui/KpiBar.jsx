import { useState, useRef, useEffect } from 'react'
import { PLANT, KPI_24H } from '../../data/baytown'

// ── KPI descriptions (info tooltip content) ──────────────────────────────────

const KPI_DESCRIPTIONS = {
  oee: 'Overall Equipment Effectiveness. Combines availability, performance, and quality into a single metric showing how well equipment is being utilized.',
  availability: 'The percentage of scheduled time the equipment is available to operate. Downtime from breakdowns and changeovers reduces this number.',
  performance: 'How fast the equipment runs compared to its designed speed. Slow cycles and small stops reduce performance.',
  quality: 'The percentage of output that meets quality standards without rework. Defects and scrap reduce this metric.',
  trains: 'A train is a parallel processing line within the plant. Each train can operate independently. More trains running means more capacity.',
  activeAssets: 'The count of assets currently in an operational state out of all registered assets. Includes running and standby equipment.',
}

// ── Thresholds from PLANT data (configurable per plant) ─────────────────────

function getHealthState(key, value) {
  const t = PLANT.thresholds?.[key]
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

const WarningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 14L1 3h14L8 14z" fill="currentColor" />
  </svg>
)

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
      className="tooltip-fixed"
      style={{ top: pos.top, left: pos.left, width: 220 }}
    >
      <div className="tooltip-bubble rounded-[var(--radius-4)]">
        <p className="type-body">{children}</p>
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
    setPos({ top: r.bottom + 8, left: bubbleLeft })
  }

  return (
    <>
      <span
        ref={ref}
        className="flex cursor-help text-[var(--color-text-helper)] hover:text-[var(--color-text-primary)]"
        style={{ transition: 'color var(--motion-fast) var(--ease-productive)' }}
        onMouseEnter={() => { updatePos(); setShow(true) }}
        onMouseLeave={() => setShow(false)}
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
  const isNormal = state === 'normal'
  const isWarning = state === 'warning'
  const color = isWarning ? 'var(--color-warning)' : 'var(--color-error)'
  const Icon = isWarning ? WarningIcon : CriticalIcon
  const label = isWarning ? 'Monitor' : 'Action Required'

  return (
    <div
      className="flex items-center gap-4"
      style={{
        color: isNormal ? undefined : color,
        visibility: isNormal ? 'hidden' : 'visible',
      }}
      aria-label={isNormal ? undefined : `${label}: ${thresholdLabel}`}
      aria-hidden={isNormal ? true : undefined}
    >
      <Icon />
      <span className="type-meta" style={{ color: isNormal ? undefined : 'inherit' }}>
        {isNormal ? '\u00A0' : label}
      </span>
    </div>
  )
}

// ── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({ config, onClick, isSelected }) {
  const health = getHealthState(config.key, config.value)
  const delta = config.value - config.previous
  const deltaSign = delta >= 0 ? '+' : ''

  const threshold = PLANT.thresholds?.[config.key]
  const thresholdLabel = health === 'critical'
    ? `Below ${threshold.critical}%`
    : `Below ${threshold.warning}%`

  return (
    <div className="flex flex-col relative">
      <button
        className="card card-interactive text-left w-full flex-1 flex flex-col"
        onClick={() => onClick(config.key)}
        aria-label={`${config.label}: ${config.value}%. ${health !== 'normal' ? health + '.' : ''} Click to view trend.`}
        aria-expanded={isSelected}
      >
        <div className="flex items-center justify-between mb-[var(--gap-stack)]">
          <span className="type-card-title">{config.label}</span>
          <InfoButton description={KPI_DESCRIPTIONS[config.key]} />
        </div>

        <span className="type-kpi block">{config.value}%</span>

        <HealthIndicator state={health} thresholdLabel={thresholdLabel} />

        <div className="hide-mobile flex items-center justify-between gap-4 mt-[var(--gap-stack)]">
          <div className="flex items-center gap-4">
            <span className="type-meta text-[var(--color-text-secondary)]">
              {deltaSign}{delta.toFixed(1)}% vs yesterday
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0">
              {delta >= 0
                ? <path d="M2 10L10 2M10 2H4M10 2v6" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                : <path d="M2 2L10 10M10 10H4M10 10V4" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              }
            </svg>
          </div>
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
            className="shrink-0"
            style={{
              transform: isSelected ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform var(--motion-fast) var(--ease-productive)',
            }}
          >
            <path d="M2.5 4.5L6 8l3.5-3.5" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Dropdown popover */}
      {isSelected && (
        <div
          className="card absolute left-0 right-0 flex flex-col gap-[var(--gap-stack)]"
          style={{
            top: 'calc(100% + 4px)',
            zIndex: 10,
            padding: 'var(--spacing-12) var(--spacing-16)',
            animation: 'fadeIn var(--motion-fast) var(--ease-productive)',
            boxShadow: 'var(--shadow-overlay)',
          }}
        >
          <Sparkline
            data={KPI_24H}
            dataKey={config.key}
            threshold={PLANT.thresholds?.[config.key]?.warning}
            eventIndex={7}
            label={config.label}
          />

          <div className="flex justify-between items-center">
            <span className="type-meta text-[var(--color-text-helper)]">{KPI_24H[0].time}</span>
            <span className="type-meta text-[var(--color-text-secondary)]">K-101 Trip 2:03 AM</span>
            <span className="type-meta text-[var(--color-text-helper)]">{KPI_24H[KPI_24H.length - 1].time}</span>
          </div>

          <div className="flex justify-between gap-8">
            <span className="type-meta text-[var(--color-text-helper)]">
              Before: <strong className="text-[var(--color-text-primary)]">{config.previous}%</strong>
            </span>
            <span className="type-meta text-[var(--color-text-helper)]">
              After: <strong className="text-[var(--color-text-primary)]">{config.value}%</strong>
            </span>
          </div>

          <div className="text-right pt-4">
            <span className="type-link text-12">Go to Trends &rarr;</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sparkline (pure SVG, 24-hour trend) ─────────────────────────────────────

function Sparkline({ data, dataKey, threshold, eventIndex, label }) {
  if (!data || data.length === 0) return null

  const vbWidth = 280
  const vbHeight = 56
  const values = data.map(d => d[dataKey])
  const allValues = threshold ? [...values, threshold] : values
  const min = Math.min(...allValues) - 2
  const max = Math.max(...allValues) + 2
  const range = max - min || 1
  const px = 2
  const py = 6
  const chartWidth = vbWidth - px * 2
  const stepX = chartWidth / (values.length - 1)

  const toY = (v) => py + (1 - (v - min) / range) * (vbHeight - py * 2)

  const points = values.map((v, i) => `${px + i * stepX},${toY(v)}`).join(' ')

  const lastX = px + (values.length - 1) * stepX
  const lastY = toY(values[values.length - 1])
  const lastValue = values[values.length - 1]
  const lastDotLeftPct = (lastX / vbWidth) * 100
  const lastDotTopPct = (lastY / vbHeight) * 100

  const ariaText = label
    ? `${label} trend: ${values[0]}% to ${lastValue}%${threshold ? `, warning threshold at ${threshold}%` : ''}`
    : undefined

  return (
    <div
      className="relative w-full"
      style={{ height: 56 }}
      role="img"
      aria-label={ariaText}
    >
      <svg
        viewBox={`0 0 ${vbWidth} ${vbHeight}`}
        preserveAspectRatio="none"
        className="block w-full h-full"
        aria-hidden="true"
      >
        {/* Top + threshold dotted reference lines */}
        <line
          x1={0} y1={py} x2={vbWidth} y2={py}
          stroke="var(--color-border-subtle)" strokeWidth={1} strokeDasharray="3 3" vectorEffect="non-scaling-stroke"
        />
        {threshold && (
          <line
            x1={0} y1={toY(threshold)} x2={vbWidth} y2={toY(threshold)}
            stroke="var(--color-border-subtle)" strokeWidth={1} strokeDasharray="3 3" vectorEffect="non-scaling-stroke"
          />
        )}
        {eventIndex != null && (
          <line
            x1={px + eventIndex * stepX} y1={0}
            x2={px + eventIndex * stepX} y2={vbHeight}
            stroke="var(--color-text-helper)" strokeWidth={1} strokeDasharray="2 2" opacity={0.3} vectorEffect="non-scaling-stroke"
          />
        )}
        <polyline
          points={points}
          fill="none" stroke="var(--color-accent)" strokeWidth={1.5}
          strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"
        />
      </svg>

      <span
        className="absolute rounded-full bg-[var(--color-accent)] pointer-events-none"
        style={{
          left: `${lastDotLeftPct}%`,
          top: `${lastDotTopPct}%`,
          transform: 'translate(-3px, -3px)',
          width: 6,
          height: 6,
        }}
      />
    </div>
  )
}

// ── KpiBar ───────────────────────────────────────────────────────────────────

export default function KpiBar({ onKpiClick }) {
  const [selectedKpi, setSelectedKpi] = useState(null)
  const barRef = useRef(null)

  function handleKpiClick(key) {
    setSelectedKpi(prev => prev === key ? null : key)
    onKpiClick?.(key)
  }

  useEffect(() => {
    if (!selectedKpi) return
    function handleClick(e) {
      if (barRef.current && !barRef.current.contains(e.target)) setSelectedKpi(null)
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setSelectedKpi(null)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedKpi])

  return (
    <div ref={barRef}>
      <div className="kpi-grid">
        {KPI_CONFIG.map((config) => (
          <KpiCard key={config.key} config={config} onClick={handleKpiClick} isSelected={selectedKpi === config.key} />
        ))}

        {/* Trains */}
        <div className="card text-left flex flex-col">
          <div className="flex items-center justify-between mb-[var(--gap-stack)]">
            <span className="type-card-title">Trains</span>
            <span className="hide-mobile"><InfoButton description={KPI_DESCRIPTIONS.trains} /></span>
          </div>
          <span className="type-kpi block">{PLANT.trains}</span>
          <div className="hide-mobile invisible" aria-hidden="true">
            <div className="items-center gap-4"><span className="type-meta">&nbsp;</span></div>
            <div className="items-center gap-4 mt-[var(--gap-stack)]"><span className="type-meta">&nbsp;</span></div>
          </div>
        </div>

        {/* Active Assets */}
        <div className="card text-left flex flex-col">
          <div className="flex items-center justify-between mb-[var(--gap-stack)]">
            <span className="type-card-title">Active Assets</span>
            <span className="hide-mobile"><InfoButton description={KPI_DESCRIPTIONS.activeAssets} /></span>
          </div>
          <span className="block">
            <span className="type-kpi">{PLANT.activeAssets}</span>
            <span className="type-kpi text-[var(--color-text-secondary)]">/{PLANT.totalAssets}</span>
          </span>
          <div className="hide-mobile invisible" aria-hidden="true">
            <span className="type-meta">&nbsp;</span>
          </div>
          <div className="hide-mobile items-center gap-4 mt-[var(--gap-stack)]">
            <span className="type-meta text-[var(--color-text-secondary)]">-4 vs yesterday</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0">
              <path d="M2 2L10 10M10 10H4M10 10V4" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
