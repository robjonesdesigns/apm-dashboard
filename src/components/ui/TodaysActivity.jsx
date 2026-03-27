import { useState } from 'react'
import { WORK_ORDERS, CASES } from '../../data/assets'

// ── Badge maps (ADR-011) ─────────────────────────────────────────────────────
// Critical=red, High=amber, Medium=blue, Low=gray (visual intensity decreases)

const PRIORITY_BADGE = {
  critical: 'badge badge-error',
  high:     'badge badge-warning',
  medium:   'badge badge-info',
}
// Low uses neutral gray (same as investigation statuses)
const NEUTRAL_BADGE_STYLE = {
  background: 'var(--color-border-subtle)',
  color: 'var(--color-text-secondary)',
}

// ── Summary builders ────────────────────────────────────────────────────────

function buildWoSummary(orders) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 }
  orders.forEach((wo) => { counts[wo.priority] = (counts[wo.priority] || 0) + 1 })
  return counts
}

function buildCaseSummary(cases) {
  const counts = {}
  cases.forEach((c) => { counts[c.status] = (counts[c.status] || 0) + 1 })
  return counts
}

// ── Row hover styles ────────────────────────────────────────────────────────

function rowBaseStyle(isHovered) {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
    padding: 'var(--spacing-12) var(--spacing-12) var(--spacing-12) var(--spacing-8)',
    margin: '0 calc(-1 * var(--spacing-4))',
    borderBottom: '1px solid var(--color-border-subtle)',
    borderLeft: isHovered ? '2px solid var(--color-accent)' : '2px solid transparent',
    borderRadius: isHovered ? 'var(--radius-4)' : '0',
    background: isHovered ? 'var(--color-hover-01)' : 'transparent',
    cursor: 'pointer',
    transition: [
      'background var(--motion-fast) var(--ease-productive)',
      'border-left-color var(--motion-fast) var(--ease-productive)',
      'border-radius var(--motion-fast) var(--ease-productive)',
    ].join(', '),
  }
}

// ── Status dot (filled = active, hollow = waiting) ──────────────────────────

function StatusDot({ filled }) {
  return (
    <span
      style={{
        width: '8px',
        height: '8px',
        borderRadius: 'var(--radius-full)',
        border: '1.5px solid var(--color-text-secondary)',
        background: filled ? 'var(--color-text-secondary)' : 'transparent',
        flexShrink: 0,
        display: 'inline-block',
      }}
    />
  )
}

// ── WO summary line ─────────────────────────────────────────────────────────

function WoSummaryLine({ summary }) {
  const parts = []
  if (summary.critical > 0) parts.push({ label: `${summary.critical} Critical`, cls: 'badge badge-error' })
  if (summary.high > 0)     parts.push({ label: `${summary.high} High`,     cls: 'badge badge-warning' })
  if (summary.medium > 0)   parts.push({ label: `${summary.medium} Medium`, cls: 'badge badge-info' })
  if (summary.low > 0)      parts.push({ label: `${summary.low} Low`,      neutral: true })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-16)', flexWrap: 'wrap' }}>
      {parts.map((p, i) => (
        <span key={p.label}>
          <span
            className={p.neutral ? 'badge' : p.cls}
            style={p.neutral ? NEUTRAL_BADGE_STYLE : undefined}
          >
            {p.label}
          </span>
          {i < parts.length - 1 && (
            <span className="type-label" style={{ marginLeft: 'var(--spacing-8)' }}>·</span>
          )}
        </span>
      ))}
    </div>
  )
}

// ── Case summary line ───────────────────────────────────────────────────────

function CaseSummaryLine({ summary }) {
  const parts = []
  if (summary.investigating > 0) parts.push({ label: `${summary.investigating} Investigating`, filled: true })
  if (summary.open > 0)          parts.push({ label: `${summary.open} Open`, filled: false })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-16)', flexWrap: 'wrap' }}>
      {parts.map((p, i) => (
        <span key={p.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <span className="badge" style={{ ...NEUTRAL_BADGE_STYLE, display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
            <StatusDot filled={p.filled} />
            {p.label}
          </span>
          {i < parts.length - 1 && (
            <span className="type-label" style={{ marginLeft: 'var(--spacing-4)' }}>·</span>
          )}
        </span>
      ))}
    </div>
  )
}

// ── Work Orders card ────────────────────────────────────────────────────────

function WorkOrdersCard() {
  const [hoveredId, setHoveredId] = useState(null)
  const summary = buildWoSummary(WORK_ORDERS)

  // Show top 5, sorted by priority (critical first)
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
  const visible = [...WORK_ORDERS]
    .sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9))
    .slice(0, 5)

  return (
    <div className="card col-half" style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-8)' }}>
        <span className="type-heading-02" style={{ color: 'var(--color-card-title)' }}>Work Orders</span>
        <span className="type-label">{WORK_ORDERS.length} Total</span>
      </div>

      {/* Summary */}
      <WoSummaryLine summary={summary} />

      {/* Rows (max 5, no internal scroll) */}
      <div style={{ flex: 1 }}>
        {visible.map((wo) => (
          <div
            key={wo.id}
            style={rowBaseStyle(hoveredId === wo.id)}
            onMouseEnter={() => setHoveredId(wo.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Line 1: WO ID + task (clickable) | priority pill */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-8)' }}>
              <div style={{ minWidth: 0 }}>
                <span className="type-helper">{wo.id}</span>
                <span className="type-helper"> · </span>
                <span className="type-body-01" style={{ color: 'var(--color-accent)' }}>{wo.task}</span>
              </div>
              <div style={{ flexShrink: 0 }}>
                <span
                  className={PRIORITY_BADGE[wo.priority] || 'badge'}
                  style={!PRIORITY_BADGE[wo.priority] ? { ...NEUTRAL_BADGE_STYLE, textTransform: 'capitalize' } : { textTransform: 'capitalize' }}
                >
                  {wo.priority}
                </span>
              </div>
            </div>

            {/* Line 2: asset name | assignee + timestamp */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-8)' }}>
              <span className="type-body-01" style={{ color: 'var(--color-text-secondary)' }}>
                {wo.asset}
              </span>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                {wo.assignee ? (
                  <span className="type-label">{wo.assignee}</span>
                ) : (
                  <span className="type-label" style={{ color: 'var(--color-text-helper)' }}>Unassigned</span>
                )}
                <div>
                  <span className="type-helper">{wo.created}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer -- pinned to bottom */}
      <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-16)' }}>
        <span className="type-link">Go to Work Orders &rarr;</span>
      </div>
    </div>
  )
}

// ── Investigations card ─────────────────────────────────────────────────────

function InvestigationsCard() {
  const [hoveredId, setHoveredId] = useState(null)
  const summary = buildCaseSummary(CASES)

  const visible = CASES.slice(0, 5)

  return (
    <div className="card col-half" style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-8)' }}>
        <span className="type-heading-02" style={{ color: 'var(--color-card-title)' }}>Investigations</span>
        <span className="type-label">{CASES.length} Total</span>
      </div>

      {/* Summary */}
      <CaseSummaryLine summary={summary} />

      {/* Rows (max 5, no internal scroll) */}
      <div style={{ flex: 1 }}>
        {visible.map((c) => (
          <div
            key={c.id}
            style={rowBaseStyle(hoveredId === c.id)}
            onMouseEnter={() => setHoveredId(c.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Line 1: Case ID + description (clickable) | status badge with dot */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-8)' }}>
              <div style={{ minWidth: 0 }}>
                <span className="type-helper">{c.id}</span>
                <span className="type-helper"> · </span>
                <span className="type-body-01" style={{ color: 'var(--color-accent)' }}>{c.description}</span>
              </div>
              <div style={{ flexShrink: 0 }}>
                <span
                  className="badge"
                  style={{ ...NEUTRAL_BADGE_STYLE, textTransform: 'capitalize', display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-4)' }}
                >
                  <StatusDot filled={c.status === 'investigating'} />
                  {c.status}
                </span>
              </div>
            </div>

            {/* Line 2: asset name | linked WOs · timestamp (single line right side) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-8)' }}>
              <span className="type-body-01" style={{ color: 'var(--color-text-secondary)' }}>
                {c.asset}
              </span>
              <span className="type-helper" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                {c.linkedWorkOrders.length > 0
                  ? `${c.linkedWorkOrders.length} linked WO${c.linkedWorkOrders.length !== 1 ? 's' : ''}`
                  : 'No linked WOs'}
                {' · '}
                {c.opened}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer -- pinned to bottom */}
      <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-16)' }}>
        <span className="type-link">Go to Investigations &rarr;</span>
      </div>
    </div>
  )
}

// ── TodaysActivity ──────────────────────────────────────────────────────────

export default function TodaysActivity() {
  return (
    <div className="grid-12">
      <WorkOrdersCard />
      <InvestigationsCard />
    </div>
  )
}
