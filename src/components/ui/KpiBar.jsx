import { useState } from 'react'
import { PLANT } from '../../data/assets'

// ── KPI descriptions (info tooltip content) ──────────────────────────────────

const KPI_DESCRIPTIONS = {
  oee: 'Overall Equipment Effectiveness. Combines availability, performance, and quality into a single metric showing how well equipment is being utilized.',
  availability: 'The percentage of scheduled time the equipment is available to operate. Downtime from breakdowns and changeovers reduces this number.',
  performance: 'How fast the equipment runs compared to its designed speed. Slow cycles and small stops reduce performance.',
  quality: 'The percentage of output that meets quality standards without rework. Defects and scrap reduce this metric.',
}

// ── KPI card config ─────────────────────────────────────────────────────────

const KPI_CONFIG = [
  { key: 'oee',          label: 'OEE',          value: PLANT.oee,          borderVar: '--color-kpi-oee' },
  { key: 'availability', label: 'Availability',  value: PLANT.availability, borderVar: '--color-kpi-availability' },
  { key: 'performance',  label: 'Performance',   value: PLANT.performance,  borderVar: '--color-kpi-performance' },
  { key: 'quality',      label: 'Quality',       value: PLANT.quality,      borderVar: '--color-kpi-quality' },
]

// ── Info icon ────────────────────────────────────────────────────────────────

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="5" r="0.75" fill="currentColor" />
  </svg>
)

// ── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({ config, onClick }) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <button
      className="card card-interactive"
      onClick={() => onClick(config.key)}
      aria-label={`${config.label}: ${config.value}%. Click to view trend.`}
      style={{
        borderTop: `3px solid var(${config.borderVar})`,
        borderLeft: 'none',
        textAlign: 'left',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Label row with info icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-8)',
        }}
      >
        <span className="type-heading-02">{config.label}</span>
        <span
          style={{
            color: 'var(--color-text-helper)',
            cursor: 'help',
            display: 'flex',
            transition: 'color var(--motion-fast) var(--ease-productive)',
          }}
          onMouseEnter={(e) => {
            e.stopPropagation()
            setShowTooltip(true)
            e.currentTarget.style.color = 'var(--color-text-primary)'
          }}
          onMouseLeave={(e) => {
            setShowTooltip(false)
            e.currentTarget.style.color = 'var(--color-text-helper)'
          }}
          onClick={(e) => {
            e.stopPropagation()
            setShowTooltip(!showTooltip)
          }}
          role="img"
          aria-label={KPI_DESCRIPTIONS[config.key]}
        >
          <InfoIcon />
        </span>
      </div>

      {/* Value */}
      <span className="type-kpi" style={{ display: 'block' }}>
        {config.value}%
      </span>

      {/* Tooltip -- Carbon-style with caret */}
      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--spacing-32)',
            right: '0',
            width: '220px',
            zIndex: 100,
            animation: 'fadeIn var(--motion-fast) var(--ease-productive)',
            pointerEvents: 'none',
          }}
        >
          {/* Caret */}
          <div
            style={{
              width: '8px',
              height: '8px',
              background: 'var(--color-layer-02)',
              border: '1px solid var(--color-border-strong)',
              borderBottom: 'none',
              borderRight: 'none',
              transform: 'rotate(45deg)',
              position: 'absolute',
              top: '-4px',
              right: 'var(--spacing-12)',
              zIndex: 101,
            }}
          />
          {/* Bubble */}
          <div
            style={{
              background: 'var(--color-layer-02)',
              border: '1px solid var(--color-border-strong)',
              borderRadius: 'var(--radius-4)',
              padding: 'var(--spacing-12) var(--spacing-16)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }}
          >
            <p className="type-body-compact" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
              {KPI_DESCRIPTIONS[config.key]}
            </p>
          </div>
        </div>
      )}
    </button>
  )
}

// ── KpiBar ───────────────────────────────────────────────────────────────────

export default function KpiBar({ onKpiClick }) {
  return (
    <div className="kpi-grid">
      {/* 4 KPI cards */}
      {KPI_CONFIG.map((config) => (
        <KpiCard key={config.key} config={config} onClick={onKpiClick} />
      ))}

      {/* Trains */}
      <div className="card" style={{ textAlign: 'left' }}>
        <span className="type-heading-02" style={{ display: 'block', marginBottom: 'var(--spacing-8)' }}>
          Trains
        </span>
        <span className="type-kpi" style={{ display: 'block' }}>
          {PLANT.trains}
        </span>
      </div>

      {/* Active Assets */}
      <div className="card" style={{ textAlign: 'left' }}>
        <span className="type-heading-02" style={{ display: 'block', marginBottom: 'var(--spacing-8)' }}>
          Active Assets
        </span>
        <span style={{ display: 'block' }}>
          <span className="type-kpi" style={{ color: 'var(--color-accent)' }}>
            {PLANT.activeAssets}
          </span>
          <span className="type-kpi" style={{ color: 'var(--color-text-secondary)' }}>
            /{PLANT.totalAssets}
          </span>
        </span>
      </div>
    </div>
  )
}
