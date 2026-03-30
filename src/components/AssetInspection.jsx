// ── AssetInspection ──────────────────────────────────────────────────────────
// Single scrollable page. Sections render conditionally based on available data.
// See HANDOFF.md for section order and design decisions.

import CriticalityIndicator from './ui/CriticalityIndicator'
import StatusIndicator from './ui/StatusIndicator'
import useIsMobile from '../hooks/useIsMobile'

// ── Back arrow icon (Feather chevron-left) ───────────────────────────────────

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

// ── Asset Header ─────────────────────────────────────────────────────────────

function AssetHeader({ asset, onBack, isMobile }) {
  const specs = [asset.type, asset.service, asset.processUnit].filter(Boolean)

  return (
    <div>
      {/* Back link -- flush to page margin */}
      <button
        onClick={onBack}
        className="type-link"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--spacing-4)',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'var(--color-accent)',
          fontSize: 'var(--text-14)',
          marginBottom: 'var(--gap-intra)',
        }}
      >
        <ChevronLeft />
        Plant Overview
      </button>

      {/* Asset name */}
      <p className="section-header" style={{ marginBottom: 0 }}>{asset.name}</p>

      {/* Status + criticality */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--gap-stack)',
        marginTop: 'var(--gap-stack)',
      }}>
        <StatusIndicator status={asset.status} />
        <span style={{
          width: 1,
          height: 12,
          background: 'var(--color-border-strong)',
          flexShrink: 0,
        }} />
        <CriticalityIndicator level={asset.criticality} />
      </div>

      {/* Specs row: type · service · process unit */}
      {specs.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--gap-stack)',
          marginTop: 'var(--gap-stack)',
        }}>
          {specs.map((spec, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
              {i > 0 && (
                <span style={{
                  width: 1,
                  height: 12,
                  background: 'var(--color-border-strong)',
                  flexShrink: 0,
                }} />
              )}
              <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>
                {spec}
              </span>
            </span>
          ))}
        </div>
      )}

    </div>
  )
}

// ── OEE threshold (asset-level) ───────────────────────────────────────────────

const OEE_THRESHOLD = { warning: 85, critical: 75 }

function getOeeHealth(value) {
  if (value < OEE_THRESHOLD.critical) return 'critical'
  if (value < OEE_THRESHOLD.warning) return 'warning'
  return 'normal'
}

// ── Health icons (same as KpiBar: triangle=warning, diamond=critical) ────────

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

// ── Sparkline (pure SVG, 7-point trend) ──────────────────────────────────────

function Sparkline({ data, threshold, label }) {
  if (!data || data.length < 2) return null

  const vbWidth = 120
  const vbHeight = 40
  const px = 2
  const py = 4
  const allValues = threshold ? [...data, threshold] : data
  const min = Math.min(...allValues) - 2
  const max = Math.max(...allValues) + 2
  const range = max - min || 1
  const chartWidth = vbWidth - px * 2
  const stepX = chartWidth / (data.length - 1)

  const toY = (v) => py + (1 - (v - min) / range) * (vbHeight - py * 2)
  const points = data.map((v, i) => `${px + i * stepX},${toY(v)}`).join(' ')

  const lastX = px + (data.length - 1) * stepX
  const lastY = toY(data[data.length - 1])
  const lastDotLeftPct = (lastX / vbWidth) * 100
  const lastDotTopPct = (lastY / vbHeight) * 100

  const ariaText = label
    ? `${label} trend: ${data[0]} to ${data[data.length - 1]}${threshold ? `, threshold at ${threshold}` : ''}`
    : undefined

  return (
    <div
      style={{ position: 'relative', width: '100%', height: 40 }}
      role="img"
      aria-label={ariaText}
    >
      <svg
        viewBox={`0 0 ${vbWidth} ${vbHeight}`}
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '100%' }}
        aria-hidden="true"
      >
        {/* Threshold line */}
        {threshold && (
          <line
            x1={0}
            y1={toY(threshold)}
            x2={vbWidth}
            y2={toY(threshold)}
            stroke="var(--color-text-helper)"
            strokeWidth={1}
            strokeDasharray="3 3"
            opacity={0.3}
            vectorEffect="non-scaling-stroke"
          />
        )}
        {/* Trend line */}
        <polyline
          points={points}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* Current value dot */}
      <span
        style={{
          position: 'absolute',
          left: `${lastDotLeftPct}%`,
          top: `${lastDotTopPct}%`,
          transform: 'translate(-3px, -3px)',
          width: 6,
          height: 6,
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-accent)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

// ── KPI Strip ────────────────────────────────────────────────────────────────
// Three cards: OEE (with sparkline + health indicator), RUL, Downtime.
// Answers "How urgent is this?" at a glance.

function KpiStrip({ asset, isMobile }) {
  const health = getOeeHealth(asset.oee)
  const isWarning = health === 'warning'
  const isCritical = health === 'critical'
  const hasAlert = isWarning || isCritical
  const alertColor = isWarning ? 'var(--color-warning)' : 'var(--color-error)'
  const alertLabel = isWarning ? 'Monitor' : 'Action Required'
  const AlertIcon = isWarning ? WarningIcon : CriticalIcon

  return (
    <div>
      <p className="section-header">Asset KPIs</p>
      <div className="grid-thirds">
        {/* OEE -- primary urgency metric with sparkline */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="type-card-title" style={{ marginBottom: 'var(--gap-stack)' }}>
            OEE
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-16)',
          }}>
            <div style={{ flexShrink: 0 }}>
              <span className="type-kpi" style={{ display: 'block' }}>
                {asset.oee}%
              </span>
              {/* Health indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-4)',
                  marginTop: 'var(--spacing-4)',
                  color: hasAlert ? alertColor : undefined,
                  visibility: hasAlert ? 'visible' : 'hidden',
                }}
                aria-label={hasAlert ? `${alertLabel}: OEE` : undefined}
                aria-hidden={!hasAlert || undefined}
              >
                {hasAlert && <AlertIcon />}
                <span className="type-meta" style={{ color: hasAlert ? alertColor : undefined }}>
                  {hasAlert ? alertLabel : '\u00A0'}
                </span>
              </div>
            </div>
            {/* Sparkline -- fills remaining width */}
            {asset.oeeTrend && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <Sparkline
                  data={asset.oeeTrend}
                  threshold={OEE_THRESHOLD.warning}
                  label="OEE"
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 'var(--spacing-2)',
                }}>
                  <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>6w ago</span>
                  <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>Now</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Remaining Life */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="type-card-title" style={{ marginBottom: 'var(--gap-stack)' }}>
            Remaining Life
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-16)',
          }}>
            <div style={{ flexShrink: 0 }}>
              <span className="type-kpi" style={{ display: 'block' }}>
                {asset.rul}
              </span>
              <span className="type-meta" style={{ color: 'var(--color-text-helper)', marginTop: 'var(--spacing-4)', display: 'block' }}>
                Estimated
              </span>
            </div>
            {asset.rulTrend && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <Sparkline
                  data={asset.rulTrend}
                  label="Remaining Life"
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 'var(--spacing-2)',
                }}>
                  <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>6w ago</span>
                  <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>Now</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Downtime */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="type-card-title" style={{ marginBottom: 'var(--gap-stack)' }}>
            Downtime
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-16)',
          }}>
            <div style={{ flexShrink: 0 }}>
              <span className="type-kpi" style={{ display: 'block' }}>
                {asset.downtime}
              </span>
              <span className="type-meta" style={{ color: 'var(--color-text-helper)', marginTop: 'var(--spacing-4)', display: 'block' }}>
                Last 24 hours
              </span>
            </div>
            {asset.downtimeTrend && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <Sparkline
                  data={asset.downtimeTrend}
                  label="Downtime"
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 'var(--spacing-2)',
                }}>
                  <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>6w ago</span>
                  <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>Now</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function AssetInspection({ selectedAsset, onNavigate }) {
  const isMobile = useIsMobile()

  if (!selectedAsset) {
    return (
      <div className="section-gap">
        <p className="type-body" style={{ color: 'var(--color-text-secondary)' }}>
          No asset selected.
        </p>
      </div>
    )
  }

  return (
    <div className="section-gap">
      <AssetHeader
        asset={selectedAsset}
        onBack={() => onNavigate('health')}
        isMobile={isMobile}
      />
      <KpiStrip asset={selectedAsset} isMobile={isMobile} />
    </div>
  )
}
