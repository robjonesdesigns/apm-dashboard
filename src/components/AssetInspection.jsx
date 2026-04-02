// ── AssetInspection ──────────────────────────────────────────────────────────
// Single scrollable page. Sections render conditionally based on available data.
// See HANDOFF.md for section order and design decisions.

import { useState, useRef, useCallback } from 'react'
import CriticalityIndicator from './ui/CriticalityIndicator'
import StatusIndicator from './ui/StatusIndicator'
import SeverityBadge from './ui/SeverityBadge'
import WoPriority from './ui/WoPriority'
import useIsMobile from '../hooks/useIsMobile'
import { TIMELINE, WORK_ORDERS, INVESTIGATIONS, K101_DEGRADATION, K101_FAULT_TREE, PERFORMANCE_ATTRIBUTES } from '../data/baytown'

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

// ── Sparkline (pure SVG, 7-point trend, hover tooltip) ───────────────────────

function Sparkline({ data, threshold, label, unit, isMobile }) {
  const [hover, setHover] = useState(null)
  const containerRef = useRef(null)

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

  const WEEK_LABELS = ['6w', '5w', '4w', '3w', '2w', '1w', 'Now']

  const handleMouseMove = useCallback((e) => {
    if (isMobile) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const pct = x / rect.width
    const idx = Math.round(pct * (data.length - 1))
    const clamped = Math.max(0, Math.min(data.length - 1, idx))
    setHover({ idx: clamped, x: e.clientX, y: rect.top })
  }, [data, isMobile])

  const ariaText = label
    ? `${label} trend: ${data[0]} to ${data[data.length - 1]}${threshold ? `, threshold at ${threshold}` : ''}`
    : undefined

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: 40 }}
      role="img"
      aria-label={ariaText}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHover(null)}
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
        {/* Hover vertical marker */}
        {hover != null && (
          <line
            x1={px + hover.idx * stepX}
            y1={0}
            x2={px + hover.idx * stepX}
            y2={vbHeight}
            stroke="var(--color-text-helper)"
            strokeWidth={1}
            opacity={0.4}
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
      {/* Current value dot (hidden when hovering a different point) */}
      {(hover == null || hover.idx === data.length - 1) && (
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
      )}
      {/* Hover dot */}
      {hover != null && hover.idx !== data.length - 1 && (
        <span
          style={{
            position: 'absolute',
            left: `${((px + hover.idx * stepX) / vbWidth) * 100}%`,
            top: `${(toY(data[hover.idx]) / vbHeight) * 100}%`,
            transform: 'translate(-3px, -3px)',
            width: 6,
            height: 6,
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-accent)',
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Tooltip */}
      {hover != null && (
        <div
          style={{
            position: 'fixed',
            top: hover.y - 36,
            left: hover.x,
            transform: 'translateX(-50%)',
            background: 'var(--color-tooltip-bg)',
            color: 'var(--color-tooltip-text)',
            borderRadius: 'var(--radius-4)',
            padding: '4px 8px',
            boxShadow: 'var(--shadow-tooltip)',
            pointerEvents: 'none',
            zIndex: 10001,
            whiteSpace: 'nowrap',
            animation: 'fadeIn var(--motion-fast) var(--ease-productive)',
          }}
        >
          <span className="type-meta" style={{ color: 'var(--color-tooltip-text)' }}>
            {WEEK_LABELS[hover.idx]}: <strong>{data[hover.idx]}{unit || ''}</strong>
          </span>
        </div>
      )}
    </div>
  )
}

// ── KPI Strip ────────────────────────────────────────────────────────────────
// Three cards: OEE (with sparkline + health indicator), RUL, Downtime.
// Answers "How urgent is this?" at a glance.

// ── KPI Card (shared layout for all three KPI cards) ─────────────────────────

function KpiCard({ title, value, subtitle, trend, threshold, unit, label, health, isMobile }) {
  // Stack value above sparkline when cards are narrow (mobile or tablet 3-col)
  // At 1056px+ the sidebar + 3-col gives enough room for side-by-side
  const isCompact = useIsMobile(1055)

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <span className="type-card-title" style={{ marginBottom: 'var(--gap-stack)' }}>
        {title}
      </span>
      <div style={{
        display: 'flex',
        flexDirection: isCompact ? 'column' : 'row',
        alignItems: isCompact ? 'flex-start' : 'center',
        gap: isCompact ? 'var(--gap-intra)' : 'var(--spacing-16)',
      }}>
        <div style={{ flexShrink: 0 }}>
          <span className="type-kpi" style={{ display: 'block' }}>
            {value}
          </span>
          {/* Health indicator or subtitle */}
          {health ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-4)',
                marginTop: 'var(--spacing-4)',
                color: health.hasAlert ? health.color : undefined,
                visibility: health.hasAlert ? 'visible' : 'hidden',
              }}
              aria-label={health.hasAlert ? `${health.label}: ${title}` : undefined}
              aria-hidden={!health.hasAlert || undefined}
            >
              {health.hasAlert && <health.Icon />}
              <span className="type-meta" style={{ color: health.hasAlert ? health.color : undefined }}>
                {health.hasAlert ? health.label : '\u00A0'}
              </span>
            </div>
          ) : (
            <span className="type-meta" style={{ color: 'var(--color-text-helper)', marginTop: 'var(--spacing-4)', display: 'block' }}>
              {subtitle}
            </span>
          )}
        </div>
        {trend && (
          <div style={{ flex: 1, minWidth: 0, width: isCompact ? '100%' : undefined }}>
            <Sparkline
              data={trend}
              threshold={threshold}
              label={label}
              unit={unit}
              isMobile={isMobile}
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

  const oeeHealth = hasAlert ? {
    hasAlert: true,
    color: isWarning ? 'var(--color-warning)' : 'var(--color-error)',
    label: isWarning ? 'Monitor' : 'Action Required',
    Icon: isWarning ? WarningIcon : CriticalIcon,
  } : { hasAlert: false }

  return (
    <div>
      <p className="section-header">Asset KPIs</p>
      <div className="grid-thirds">
        <KpiCard
          title="OEE"
          value={`${asset.oee}%`}
          trend={asset.oeeTrend}
          threshold={OEE_THRESHOLD.warning}
          unit="%"
          label="OEE"
          health={oeeHealth}
          isMobile={isMobile}
        />
        <KpiCard
          title="Remaining Useful Life"
          value={asset.rul}
          subtitle="Estimated"
          trend={asset.rulTrend}
          unit=" days"
          label="Remaining Useful Life"
          isMobile={isMobile}
        />
        <KpiCard
          title="Downtime"
          value={asset.downtime}
          subtitle="Last 24 hours"
          trend={asset.downtimeTrend}
          unit="h"
          label="Downtime"
          isMobile={isMobile}
        />
      </div>
    </div>
  )
}

// ── Chevron icon for expand/collapse ─────────────────────────────────────────

const ChevronRight = ({ expanded }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={{
      transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
      transition: `transform var(--motion-fast) var(--ease-productive)`,
      flexShrink: 0,
    }}
  >
    <path
      d="M6 3l5 5-5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// ── Sensor status color mapping ──────────────────────────────────────────────

function sensorStatusColor(status) {
  switch (status) {
    case 'alarm':    return 'var(--color-error)'
    case 'elevated': return 'var(--color-warning)'
    case 'degraded': return 'var(--color-warning)'
    default:         return 'var(--color-text-helper)'
  }
}

function sensorStatusDot(status) {
  switch (status) {
    case 'alarm':    return 'status-dot dot-tripped'
    case 'elevated': return 'status-dot dot-degraded'
    case 'degraded': return 'status-dot dot-degraded'
    default:         return 'status-dot dot-running'
  }
}

// ── Sensor Row ───────────────────────────────────────────────────────────────

function SensorRow({ sensor, isMobile }) {
  const isAlert = sensor.status === 'alarm' || sensor.status === 'elevated' || sensor.status === 'degraded'
  const valueColor = isAlert ? sensorStatusColor(sensor.status) : 'var(--color-text-primary)'

  return (
    <div style={{
      display: 'flex',
      alignItems: isMobile ? 'flex-start' : 'center',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? 'var(--spacing-2)' : 'var(--spacing-8)',
      padding: `var(--spacing-4) 0`,
    }}>
      {/* Sensor name */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-8)',
        minWidth: isMobile ? undefined : 180,
        flexShrink: 0,
      }}>
        <span className={sensorStatusDot(sensor.status)} />
        <span className="type-body" style={{ color: 'var(--color-text-secondary)' }}>
          {sensor.name}
        </span>
      </div>

      {/* Value + unit */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-8)',
        marginLeft: isMobile ? 'var(--spacing-16)' : 0,
      }}>
        <span className="type-body" style={{ color: valueColor, fontWeight: 600 }}>
          {sensor.value}{sensor.unit ? ` ${sensor.unit}` : ''}
        </span>

        {/* Alarm threshold */}
        {sensor.alarm != null && (
          <>
            <span style={{
              width: 1,
              height: 12,
              background: 'var(--color-border-strong)',
              flexShrink: 0,
            }} />
            <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>
              Alarm: {sensor.alarm}{sensor.unit ? ` ${sensor.unit}` : ''}
            </span>
          </>
        )}

        {/* Note */}
        {sensor.note && (
          <>
            <span style={{
              width: 1,
              height: 12,
              background: 'var(--color-border-strong)',
              flexShrink: 0,
            }} />
            <span className="type-meta" style={{ color: 'var(--color-text-helper)', fontStyle: 'italic' }}>
              {sensor.note}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

// ── Sub-Asset Row ────────────────────────────────────────────────────────────

function SubAssetRow({ subAsset, isMobile }) {
  const [expanded, setExpanded] = useState(false)
  const alertCount = subAsset.sensors.filter(s =>
    s.status === 'alarm' || s.status === 'elevated' || s.status === 'degraded'
  ).length
  const isDegraded = subAsset.status === 'degraded'

  return (
    <div style={{
      borderBottom: '1px solid var(--color-border-subtle)',
    }}>
      {/* Collapsed row: chevron + status dot + name + sensor count */}
      <button
        onClick={() => setExpanded(prev => !prev)}
        aria-expanded={expanded}
        aria-label={`${subAsset.name}: ${subAsset.status}. ${subAsset.sensors.length} sensors${alertCount ? `, ${alertCount} in alarm` : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-8)',
          width: '100%',
          padding: `var(--spacing-12) 0`,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-primary)',
          transition: `background var(--motion-fast) var(--ease-productive)`,
        }}
      >
        <ChevronRight expanded={expanded} />
        <span className={`status-dot ${isDegraded ? 'dot-degraded' : 'dot-running'}`} />
        <span className="type-body" style={{ fontWeight: isDegraded ? 600 : 400 }}>
          {subAsset.name}
        </span>

        {/* Sensor count + alert count */}
        <span className="type-meta" style={{
          color: alertCount ? 'var(--color-warning)' : 'var(--color-text-helper)',
          marginLeft: 'auto',
        }}>
          {subAsset.sensors.length} sensor{subAsset.sensors.length !== 1 ? 's' : ''}
          {alertCount > 0 && ` · ${alertCount} alert${alertCount !== 1 ? 's' : ''}`}
        </span>
      </button>

      {/* Expanded: sensor rows */}
      {expanded && (
        <div style={{
          paddingLeft: 'var(--spacing-24)',
          paddingBottom: 'var(--spacing-12)',
          animation: 'fadeIn var(--motion-fast) var(--ease-productive)',
        }}>
          {subAsset.sensors.map((sensor, i) => (
            <SensorRow key={i} sensor={sensor} isMobile={isMobile} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Sub-Asset Tree ───────────────────────────────────────────────────────────
// Expandable inline tree per ISO 14224 hierarchy.
// Each sub-asset expands to show its sensors with values, thresholds, and status.

function SubAssetTree({ asset, isMobile }) {
  if (!asset.subAssets || asset.subAssets.length === 0) return null

  const totalAlerts = asset.subAssets.reduce((sum, sa) =>
    sum + sa.sensors.filter(s => s.status === 'alarm' || s.status === 'elevated' || s.status === 'degraded').length
  , 0)

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-8)',
        marginBottom: 'var(--spacing-16)',
      }}>
        <p className="section-header" style={{ marginBottom: 0 }}>Sub-Assets</p>
        {totalAlerts > 0 && (
          <span className="type-meta" style={{ color: 'var(--color-warning)' }}>
            {totalAlerts} alert{totalAlerts !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className="card" style={{ padding: `0 var(--spacing-24)` }}>
        {asset.subAssets.map(sa => (
          <SubAssetRow key={sa.id} subAsset={sa} isMobile={isMobile} />
        ))}
      </div>
    </div>
  )
}

// ── Active Events (Section 3) ────────────────────────────────────────────────
// Filtered TIMELINE for this asset, status = new or in-progress.
// "What's happening right now?"

function ActiveEvents({ asset, isMobile }) {
  const events = TIMELINE.filter(e => e.assetId === asset.id && (e.status === 'new' || e.status === 'in-progress'))
  if (events.length === 0) return null

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-16)' }}>
        <p className="section-header" style={{ marginBottom: 0 }}>Active Events</p>
        <span className="type-meta" style={{ color: 'var(--color-warning)' }}>
          {events.length} active
        </span>
      </div>
      <div className="card" style={{ padding: 0 }}>
        {events.map((evt, i) => (
          <div key={evt.id} style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 'var(--spacing-4)' : 'var(--spacing-8)',
            padding: 'var(--spacing-12) var(--spacing-24)',
            borderBottom: i < events.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', flexShrink: 0 }}>
              <SeverityBadge severity={evt.severity} compact />
              <span className="type-body" style={{ fontWeight: 600 }}>{evt.name}</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-8)',
              marginLeft: isMobile ? 0 : 'auto',
            }}>
              {evt.subAsset && (
                <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>{evt.subAsset}</span>
              )}
              <span style={{ width: 1, height: 12, background: 'var(--color-border-strong)', flexShrink: 0 }} />
              <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>
                {evt.time || evt.date}
              </span>
              <span style={{ width: 1, height: 12, background: 'var(--color-border-strong)', flexShrink: 0 }} />
              <span className="type-meta" style={{
                color: evt.status === 'new' ? 'var(--color-accent)' : 'var(--color-text-helper)',
                fontWeight: evt.status === 'new' ? 600 : 400,
              }}>
                {evt.status === 'new' ? 'New' : 'In Progress'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Event Timeline (Section 5) ───────────────────────────────────────────────
// Full chronological history for this asset. "What happened and when?"

function EventTimeline({ asset, isMobile }) {
  const events = TIMELINE.filter(e => e.assetId === asset.id)
  if (events.length === 0) return null

  const statusColor = (s) => {
    switch (s) {
      case 'new':            return 'var(--color-accent)'
      case 'in-progress':    return 'var(--color-warning)'
      case 'closed':         return 'var(--color-text-helper)'
      case 'false-positive': return 'var(--color-text-disabled)'
      default:               return 'var(--color-text-helper)'
    }
  }
  const statusLabel = (s) => {
    switch (s) {
      case 'new':            return 'New'
      case 'in-progress':    return 'In Progress'
      case 'closed':         return 'Closed'
      case 'false-positive': return 'False Positive'
      default:               return s
    }
  }

  return (
    <div>
      <div className="card" style={{ padding: 0 }}>
        {events.slice().reverse().map((evt, i) => (
          <div key={evt.id} style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 'var(--spacing-4)' : 'var(--spacing-8)',
            padding: 'var(--spacing-12) var(--spacing-24)',
            borderBottom: i < events.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', flexShrink: 0 }}>
              <SeverityBadge severity={evt.severity} compact />
              <span className="type-body">{evt.name}</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-8)',
              marginLeft: isMobile ? 0 : 'auto',
            }}>
              <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>
                {evt.time || evt.date}
              </span>
              <span style={{ width: 1, height: 12, background: 'var(--color-border-strong)', flexShrink: 0 }} />
              <span className="type-meta" style={{ color: statusColor(evt.status) }}>
                {statusLabel(evt.status)}
              </span>
              <span style={{ width: 1, height: 12, background: 'var(--color-border-strong)', flexShrink: 0 }} />
              <span className="type-label">{evt.eventType}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Work Orders & Investigations (Section 6) ─────────────────────────────────
// "What's being done about it?"

function WorkOrdersSection({ asset, isMobile }) {
  const wos = WORK_ORDERS.filter(wo => wo.assetId === asset.id)
  const invs = INVESTIGATIONS.filter(inv => inv.assetId === asset.id)
  if (wos.length === 0 && invs.length === 0) return null

  return (
    <div>
      <p className="section-header">Work Orders & Investigations</p>
      <div className={isMobile ? '' : 'grid-12'} style={isMobile ? { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-24)' } : undefined}>
        {/* Work Orders */}
        {wos.length > 0 && (
          <div className={isMobile ? '' : 'col-half'}>
            <p className="type-card-title" style={{ marginBottom: 'var(--gap-stack)' }}>
              Work Orders ({wos.length})
            </p>
            <div className="card" style={{ padding: 0 }}>
              {wos.map((wo, i) => (
                <div key={wo.id} style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: isMobile ? 'var(--spacing-4)' : 'var(--spacing-8)',
                  padding: 'var(--spacing-12) var(--spacing-24)',
                  borderBottom: i < wos.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', flex: 1, minWidth: 0 }}>
                    <WoPriority urgency={wo.urgency} />
                    <span className="type-body" style={{ fontWeight: 500 }}>{wo.task}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-8)',
                    marginLeft: isMobile ? 0 : 'auto',
                    flexShrink: 0,
                  }}>
                    <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>{wo.id}</span>
                    <span style={{ width: 1, height: 12, background: 'var(--color-border-strong)', flexShrink: 0 }} />
                    <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>
                      {wo.assignee || 'Unassigned'}
                    </span>
                    <span style={{ width: 1, height: 12, background: 'var(--color-border-strong)', flexShrink: 0 }} />
                    <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>{wo.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Investigations */}
        {invs.length > 0 && (
          <div className={isMobile ? '' : 'col-half'}>
            <p className="type-card-title" style={{ marginBottom: 'var(--gap-stack)' }}>
              Investigations ({invs.length})
            </p>
            <div className="card" style={{ padding: 0 }}>
              {invs.map((inv, i) => (
                <div key={inv.id} style={{
                  padding: 'var(--spacing-12) var(--spacing-24)',
                  borderBottom: i < invs.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: 'var(--spacing-8)',
                    flexDirection: isMobile ? 'column' : 'row',
                  }}>
                    <span className="type-body" style={{ fontWeight: 500 }}>{inv.id}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginLeft: isMobile ? 0 : 'auto' }}>
                      <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>
                        {inv.assignee || 'Unassigned'}
                      </span>
                      <span style={{ width: 1, height: 12, background: 'var(--color-border-strong)', flexShrink: 0 }} />
                      <span className="type-meta" style={{ color: inv.status === 'investigating' ? 'var(--color-warning)' : 'var(--color-text-helper)' }}>
                        {inv.status === 'investigating' ? 'Investigating' : 'Open'}
                      </span>
                    </div>
                  </div>
                  <p className="type-body" style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-4)' }}>
                    {inv.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Degradation Trends (Section 7, K-101 only) ──────────────────────────────
// 30-day degradation data. Pure SVG multi-line chart.

function DegradationTrends({ asset }) {
  if (asset.id !== 'K-101') return null

  const data = K101_DEGRADATION
  const vbWidth = 400
  const vbHeight = 160
  const px = 40
  const py = 16
  const chartW = vbWidth - px * 2
  const chartH = vbHeight - py * 2

  const metrics = [
    { key: 'vibration',    label: 'Vibration (mm/s)',   color: 'var(--color-error)',   threshold: 7.1 },
    { key: 'bearingTemp',  label: 'Bearing Temp (C)',   color: 'var(--color-warning)', threshold: 95 },
    { key: 'oilPressure',  label: 'Oil Pressure (bar)', color: 'var(--color-info)',    threshold: 1.5 },
    { key: 'surgeMargin',  label: 'Surge Margin (%)',   color: 'var(--color-accent)',  threshold: 10 },
  ]

  function normalize(values) {
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    return values.map(v => (v - min) / range)
  }

  function toPoints(normalized) {
    return normalized.map((v, i) => {
      const x = px + (i / (normalized.length - 1)) * chartW
      const y = py + (1 - v) * chartH
      return `${x},${y}`
    }).join(' ')
  }

  return (
    <div>
      <p className="section-header">Degradation Trends</p>
      <div className="card">
        <p className="type-meta" style={{ color: 'var(--color-text-helper)', marginBottom: 'var(--gap-intra)' }}>
          30-day normalized view. Each metric scaled to its own range.
        </p>
        <div style={{ position: 'relative', width: '100%', height: 180 }} role="img" aria-label="K-101 degradation trends over 30 days">
          <svg
            viewBox={`0 0 ${vbWidth} ${vbHeight}`}
            preserveAspectRatio="none"
            style={{ display: 'block', width: '100%', height: '100%' }}
            aria-hidden="true"
          >
            {metrics.map(m => (
              <polyline
                key={m.key}
                points={toPoints(normalize(data.map(d => d[m.key])))}
                fill="none"
                stroke={m.color}
                strokeWidth={1.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-16)', marginTop: 'var(--gap-stack)' }}>
          {metrics.map(m => (
            <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
              <span style={{ width: 12, height: 2, background: m.color, borderRadius: 1, flexShrink: 0 }} />
              <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Fault Tree (Section 8, K-101 only) ───────────────────────────────────────
// Recursive tree rendering. Top event down to root cause.

function FaultTreeNode({ node, depth = 0 }) {
  const isRoot = node.rootCause
  const borderColor = node.type === 'critical' ? 'var(--color-error)' : node.type === 'high' ? 'var(--color-warning)' : 'var(--color-border-subtle)'

  return (
    <div style={{ marginLeft: depth > 0 ? 'var(--spacing-24)' : 0 }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-2)',
        padding: 'var(--spacing-8) var(--spacing-12)',
        borderLeft: `3px solid ${borderColor}`,
        background: isRoot ? 'var(--color-error-bg)' : 'transparent',
        borderRadius: isRoot ? 'var(--radius-4)' : 0,
        marginBottom: 'var(--spacing-4)',
      }}>
        <span className="type-body" style={{ fontWeight: isRoot ? 700 : 400 }}>
          {node.event}
          {isRoot && <span className="type-meta" style={{ color: 'var(--color-error)', marginLeft: 'var(--spacing-8)' }}>ROOT CAUSE</span>}
        </span>
        {node.value && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
            <span className="type-meta" style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>{node.value}</span>
            {node.threshold && (
              <>
                <span style={{ width: 1, height: 12, background: 'var(--color-border-strong)', flexShrink: 0 }} />
                <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>Threshold: {node.threshold}</span>
              </>
            )}
          </div>
        )}
      </div>
      {node.children?.map((child, i) => (
        <FaultTreeNode key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  )
}

function FaultTree({ asset }) {
  if (asset.id !== 'K-101') return null

  return (
    <div>
      <p className="section-header">Fault Tree</p>
      <div className="card">
        <FaultTreeNode node={K101_FAULT_TREE} />
      </div>
    </div>
  )
}

// ── Performance Attributes (Section 9, K-101 only) ───────────────────────────
// Table: attribute, value, expected, deviation.

function PerformanceAttrs({ asset, isMobile }) {
  if (asset.id !== 'K-101') return null

  function deviationColor(dev) {
    const abs = Math.abs(dev)
    if (abs > 50) return 'var(--color-error)'
    if (abs > 10) return 'var(--color-warning)'
    return 'var(--color-text-secondary)'
  }

  return (
    <div>
      <p className="section-header">Performance Attributes</p>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
              <th className="type-table-header" style={{ textAlign: 'left', padding: 'var(--spacing-12) var(--spacing-16)' }}>Attribute</th>
              <th className="type-table-header" style={{ textAlign: 'right', padding: 'var(--spacing-12) var(--spacing-16)' }}>Value</th>
              <th className="type-table-header" style={{ textAlign: 'right', padding: 'var(--spacing-12) var(--spacing-16)' }}>Expected</th>
              <th className="type-table-header" style={{ textAlign: 'right', padding: 'var(--spacing-12) var(--spacing-16)' }}>Deviation</th>
            </tr>
          </thead>
          <tbody>
            {PERFORMANCE_ATTRIBUTES.map((row, i) => (
              <tr key={i} style={{ borderBottom: i < PERFORMANCE_ATTRIBUTES.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                <td className="type-body" style={{ padding: 'var(--spacing-8) var(--spacing-16)' }}>{row.attribute}</td>
                <td className="type-body" style={{ padding: 'var(--spacing-8) var(--spacing-16)', textAlign: 'right', fontWeight: 600 }}>
                  {row.value} {row.unit}
                </td>
                <td className="type-meta" style={{ padding: 'var(--spacing-8) var(--spacing-16)', textAlign: 'right', color: 'var(--color-text-helper)' }}>
                  {row.expected} {row.unit}
                </td>
                <td className="type-body" style={{
                  padding: 'var(--spacing-8) var(--spacing-16)',
                  textAlign: 'right',
                  fontWeight: 600,
                  color: deviationColor(row.deviation),
                }}>
                  {row.deviation > 0 ? '+' : ''}{row.deviation.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Collapsible Section ──────────────────────────────────────────────────────
// Section with header that collapses/expands its content.

function CollapsibleSection({ title, count, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  if (!children) return null

  return (
    <div>
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-8)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          marginBottom: open ? 'var(--spacing-16)' : 0,
          width: '100%',
        }}
      >
        <ChevronRight expanded={open} />
        <span className="section-header" style={{ marginBottom: 0 }}>{title}</span>
        {count != null && (
          <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>{count}</span>
        )}
      </button>
      {open && (
        <div style={{ animation: 'fadeIn var(--motion-fast) var(--ease-productive)' }}>
          {children}
        </div>
      )}
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

  const assetEvents = TIMELINE.filter(e => e.assetId === selectedAsset.id)
  const activeEvents = assetEvents.filter(e => e.status === 'new' || e.status === 'in-progress')
  const assetWOs = WORK_ORDERS.filter(wo => wo.assetId === selectedAsset.id)
  const assetInvs = INVESTIGATIONS.filter(inv => inv.assetId === selectedAsset.id)
  const hasDeepAnalysis = selectedAsset.id === 'K-101'

  return (
    <div className="section-gap">
      {/* ── Group A: Identity + Urgency ──────────────────────────────── */}
      <AssetHeader
        asset={selectedAsset}
        onBack={() => onNavigate('overview')}
        isMobile={isMobile}
      />
      <KpiStrip asset={selectedAsset} isMobile={isMobile} />

      {/* ── Group B: What's happening? (two-col desktop) ─────────────── */}
      {(activeEvents.length > 0 || (selectedAsset.subAssets && selectedAsset.subAssets.length > 0)) && (
        <div>
          <div className={isMobile ? '' : 'grid-12'}>
            {activeEvents.length > 0 && (
              <div className={isMobile ? '' : 'col-half'} style={{ marginBottom: isMobile ? 'var(--spacing-24)' : 0 }}>
                <ActiveEvents asset={selectedAsset} isMobile={isMobile} />
              </div>
            )}
            {selectedAsset.subAssets && selectedAsset.subAssets.length > 0 && (
              <div className={isMobile ? '' : (activeEvents.length > 0 ? 'col-half' : 'col-full')}>
                <SubAssetTree asset={selectedAsset} isMobile={isMobile} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Group C: What's being done? (two-col desktop) ────────────── */}
      {(assetWOs.length > 0 || assetInvs.length > 0) && (
        <WorkOrdersSection asset={selectedAsset} isMobile={isMobile} />
      )}

      {/* ── Group D: History (collapsible) ───────────────────────────── */}
      {assetEvents.length > 0 && (
        <CollapsibleSection
          title="Event Timeline"
          count={`${assetEvents.length} event${assetEvents.length !== 1 ? 's' : ''}`}
        >
          <EventTimeline asset={selectedAsset} isMobile={isMobile} />
        </CollapsibleSection>
      )}

      {/* ── Group E: Deep Analysis (K-101 only, two-col + full) ──────── */}
      {hasDeepAnalysis && (
        <>
          <div className={isMobile ? '' : 'grid-12'}>
            <div className={isMobile ? '' : 'col-half'} style={{ marginBottom: isMobile ? 'var(--spacing-24)' : 0 }}>
              <DegradationTrends asset={selectedAsset} />
            </div>
            <div className={isMobile ? '' : 'col-half'}>
              <PerformanceAttrs asset={selectedAsset} isMobile={isMobile} />
            </div>
          </div>
          <FaultTree asset={selectedAsset} />
        </>
      )}
    </div>
  )
}
