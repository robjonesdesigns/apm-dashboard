import { useState, useRef } from 'react'
import { PLANT } from '../../data/assets'

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

// Warning: trending down arrow (amber) -- "this is declining, monitor it"
const TrendingDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 5l5 6 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Critical: exclamation triangle (red) -- "act now, threshold crossed"
const ExclamationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 1.5L1 14h14L8 1.5z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="12" r="0.75" fill="currentColor" />
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
          width: '8px',
          height: '8px',
          background: '#f4f4f4',
          transform: 'rotate(45deg)',
          position: 'absolute',
          top: '-4px',
          left: '50%',
          marginLeft: '-4px',
          zIndex: 10002,
        }}
      />
      <div
        style={{
          background: '#f4f4f4',
          borderRadius: 'var(--radius-4)',
          padding: 'var(--spacing-12) var(--spacing-16)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        <p className="type-body-compact" style={{ color: 'var(--color-bg)', margin: 0 }}>
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
    setPos({ top: r.bottom + 8, left: Math.max(8, r.left + r.width / 2 - 110) })
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
  const Icon = isWarning ? TrendingDownIcon : ExclamationIcon
  const label = isWarning ? 'Below target' : 'Critical'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-4)',
        color,
        marginTop: 'var(--spacing-4)',
      }}
      aria-label={`${label}: ${thresholdLabel}`}
    >
      <Icon />
      <span className="type-label" style={{ color, textTransform: 'none', letterSpacing: 0 }}>
        {label}
      </span>
    </div>
  )
}

// ── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({ config, onClick }) {
  const health = getHealthState(config.key, config.value)
  const delta = config.value - config.previous
  const deltaSign = delta >= 0 ? '+' : ''
  const deltaColor = delta >= 0 ? 'var(--color-success)' : 'var(--color-error)'

  const valueColor =
    health === 'critical' ? 'var(--color-error)' :
    health === 'warning' ? 'var(--color-warning)' :
    'var(--color-text-primary)'

  const threshold = THRESHOLDS[config.key]
  const thresholdLabel = health === 'critical'
    ? `Below ${threshold.critical}%`
    : `Below ${threshold.warning}%`

  return (
    <button
      className="card card-interactive"
      onClick={() => onClick(config.key)}
      aria-label={`${config.label}: ${config.value}%. ${health !== 'normal' ? health + '.' : ''} Click to view trend.`}
      style={{
        borderTop: '3px solid var(--color-accent)',
        borderLeft: 'none',
        textAlign: 'left',
        width: '100%',
      }}
    >
      {/* Label + info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-8)' }}>
        <span className="type-heading-02" style={{ color: 'var(--color-text-secondary)' }}>{config.label}</span>
        <InfoButton description={KPI_DESCRIPTIONS[config.key]} />
      </div>

      {/* Value */}
      <span className="type-kpi" style={{ display: 'block', color: valueColor }}>
        {config.value}%
      </span>

      {/* Delta */}
      <div style={{ marginTop: 'var(--spacing-4)' }}>
        <span className="type-label" style={{ color: deltaColor, textTransform: 'none', letterSpacing: 0 }}>
          {deltaSign}{delta.toFixed(1)}% vs yesterday
        </span>
      </div>

      {/* Health indicator (only shows for warning/critical) */}
      <HealthIndicator state={health} thresholdLabel={thresholdLabel} />
    </button>
  )
}

// ── KpiBar ───────────────────────────────────────────────────────────────────

export default function KpiBar({ onKpiClick }) {
  return (
    <div className="kpi-grid">
      {KPI_CONFIG.map((config) => (
        <KpiCard key={config.key} config={config} onClick={onKpiClick} />
      ))}

      {/* Trains */}
      <div className="card" style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-8)' }}>
          <span className="type-heading-02" style={{ color: 'var(--color-text-secondary)' }}>Trains</span>
          <InfoButton description={KPI_DESCRIPTIONS.trains} />
        </div>
        <span className="type-kpi" style={{ display: 'block' }}>
          {PLANT.trains}
        </span>
      </div>

      {/* Active Assets */}
      <div className="card" style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-8)' }}>
          <span className="type-heading-02" style={{ color: 'var(--color-text-secondary)' }}>Active Assets</span>
          <InfoButton description={KPI_DESCRIPTIONS.activeAssets} />
        </div>
        <span style={{ display: 'block' }}>
          <span className="type-kpi">{PLANT.activeAssets}</span>
          <span className="type-kpi" style={{ color: 'var(--color-text-secondary)' }}>/{PLANT.totalAssets}</span>
        </span>
      </div>
    </div>
  )
}
