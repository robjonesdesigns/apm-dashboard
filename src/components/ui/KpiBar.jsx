import { PLANT } from '../../data/assets'

// ── KPI card config ─────────────────────────────────────────────────────────

const KPI_CONFIG = [
  { key: 'oee',          label: 'OEE',          value: PLANT.oee,          borderVar: '--color-kpi-oee' },
  { key: 'availability', label: 'Availability',  value: PLANT.availability, borderVar: '--color-kpi-availability' },
  { key: 'performance',  label: 'Performance',   value: PLANT.performance,  borderVar: '--color-kpi-performance' },
  { key: 'quality',      label: 'Quality',       value: PLANT.quality,      borderVar: '--color-kpi-quality' },
]

// ── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({ config, onClick }) {
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
      }}
    >
      <span className="type-label" style={{ display: 'block', marginBottom: 'var(--spacing-8)' }}>
        {config.label}
      </span>
      <span className="type-kpi" style={{ display: 'block' }}>
        {config.value}%
      </span>
    </button>
  )
}

// ── KpiBar ───────────────────────────────────────────────────────────────────

export default function KpiBar({ onKpiClick }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--spacing-24)',
      }}
      className="kpi-grid"
    >
      {/* 4 KPI cards */}
      {KPI_CONFIG.map((config) => (
        <KpiCard key={config.key} config={config} onClick={onKpiClick} />
      ))}

      {/* Trains */}
      <div className="card" style={{ textAlign: 'left' }}>
        <span className="type-label" style={{ display: 'block', marginBottom: 'var(--spacing-8)' }}>
          Trains
        </span>
        <span className="type-kpi" style={{ display: 'block' }}>
          {PLANT.trains}
        </span>
      </div>

      {/* Active Assets */}
      <div className="card" style={{ textAlign: 'left' }}>
        <span className="type-label" style={{ display: 'block', marginBottom: 'var(--spacing-8)' }}>
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
