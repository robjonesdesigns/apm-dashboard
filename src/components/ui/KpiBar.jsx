import { AreaChart, Area } from 'recharts'
import { PLANT, OEE_TREND } from '../../data/assets'
import { colors } from '../../styles/tokens'

// ── KPI identity config ──────────────────────────────────────────────────────

const KPI_CONFIG = [
  {
    key: 'oee',
    label: 'OEE',
    current: PLANT.oee,
    previous: PLANT.previousOee,
    unit: '%',
    colorVar: '--color-kpi-oee',
    colorHex: colors.kpiOee,
    dataKey: 'oee',
  },
  {
    key: 'availability',
    label: 'Availability',
    current: PLANT.availability,
    previous: PLANT.previousAvailability,
    unit: '%',
    colorVar: '--color-kpi-availability',
    colorHex: colors.kpiAvailability,
    dataKey: 'availability',
  },
  {
    key: 'performance',
    label: 'Performance',
    current: PLANT.performance,
    previous: PLANT.previousPerformance,
    unit: '%',
    colorVar: '--color-kpi-performance',
    colorHex: colors.kpiPerformance,
    dataKey: 'performance',
  },
  {
    key: 'quality',
    label: 'Quality',
    current: PLANT.quality,
    previous: PLANT.previousQuality,
    unit: '%',
    colorVar: '--color-kpi-quality',
    colorHex: colors.kpiQuality,
    dataKey: 'quality',
  },
]

// ── Delta calculation ────────────────────────────────────────────────────────

function calcDelta(current, previous) {
  const diff = current - previous
  const pct = ((diff / previous) * 100).toFixed(1)
  return { diff, pct: parseFloat(pct) }
}

// ── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ dataKey, colorHex }) {
  const gradientId = `spark-grad-${dataKey}`
  return (
    <AreaChart
      width={60}
      height={24}
      data={OEE_TREND}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={colorHex} stopOpacity={0.2} />
          <stop offset="95%" stopColor={colorHex} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey={dataKey}
        stroke={colorHex}
        strokeWidth={1.5}
        fill={`url(#${gradientId})`}
        dot={false}
        isAnimationActive={false}
      />
    </AreaChart>
  )
}

// ── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({ config, onClick }) {
  const { pct } = calcDelta(config.current, config.previous)
  const isPositive = pct >= 0
  const changeColor = isPositive
    ? 'var(--color-healthy)'
    : 'var(--color-critical)'
  const sign = isPositive ? '+' : ''

  return (
    <div
      className="card card-interactive col-kpi"
      style={{ borderLeft: `3px solid var(${config.colorVar})` }}
      onClick={() => onClick(config.key)}
    >
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <span className="type-label">{config.label}</span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 'var(--spacing-8)',
          marginBottom: 'var(--spacing-8)',
        }}
      >
        <span className="type-kpi">
          {config.current}{config.unit}
        </span>
        <Sparkline dataKey={config.dataKey} colorHex={config.colorHex} />
      </div>

      <div>
        <span className="type-body-sm" style={{ color: changeColor }}>
          {sign}{pct}% vs last month
        </span>
      </div>
    </div>
  )
}

// ── Trains / active assets card ───────────────────────────────────────────────

function TrainsCard() {
  return (
    <div
      className="card"
      style={{
        gridColumn: 'span 4',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 'var(--spacing-8)',
      }}
    >
      <div>
        <span className="type-label">Plant Status</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-16)' }}>
        <span className="type-kpi-lg">{PLANT.trains} Trains</span>
      </div>
      <div>
        <span className="type-body-secondary">Active assets: </span>
        <span
          className="type-body"
          style={{ color: 'var(--color-accent)' }}
        >
          {PLANT.activeAssets}
        </span>
        <span className="type-body-secondary"> / {PLANT.totalAssets}</span>
      </div>
      <div>
        <span className="type-meta">Last refreshed {PLANT.lastRefreshed}</span>
      </div>
    </div>
  )
}

// ── KpiBar ───────────────────────────────────────────────────────────────────

export default function KpiBar({ onKpiClick }) {
  return (
    <div>
      <div className="section-header">Plant Health</div>
      <div className="grid-12">
        {KPI_CONFIG.map((config) => (
          <KpiCard key={config.key} config={config} onClick={onKpiClick} />
        ))}
        <TrainsCard />
      </div>
    </div>
  )
}
