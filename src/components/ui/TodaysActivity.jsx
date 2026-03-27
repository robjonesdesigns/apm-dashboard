import { useState } from 'react'
import { WORK_ORDERS, CASES } from '../../data/assets'

// ── Badge maps ────────────────────────────────────────────────────────────────

const PRIORITY_BADGE = {
  critical: 'badge badge-error',
  high:     'badge badge-warning',
  medium:   'badge badge-info',
  low:      'badge badge-info',
}

const CASE_STATUS_BADGE = {
  investigating: 'badge badge-error',
  open:          'badge badge-warning',
  closed:        'badge badge-success',
}

// ── Summary builders ──────────────────────────────────────────────────────────

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

// ── Row hover styles ──────────────────────────────────────────────────────────

function rowBaseStyle(isHovered) {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
    padding: 'var(--spacing-12) 0',
    borderBottom: '1px solid var(--color-border-subtle)',
    borderLeft: isHovered ? '2px solid var(--color-accent)' : '2px solid transparent',
    paddingLeft: isHovered ? 'var(--spacing-8)' : 'var(--spacing-8)',
    background: isHovered ? 'var(--color-hover-01)' : 'transparent',
    transition: [
      'background var(--motion-fast) var(--ease-productive)',
      'border-left-color var(--motion-fast) var(--ease-productive)',
    ].join(', '),
  }
}

// ── WO summary line ───────────────────────────────────────────────────────────

function WoSummaryLine({ summary }) {
  const parts = []
  if (summary.critical > 0) parts.push({ label: `${summary.critical} Critical`, cls: 'badge badge-error' })
  if (summary.high > 0)     parts.push({ label: `${summary.high} High`,     cls: 'badge badge-warning' })
  if (summary.medium > 0)   parts.push({ label: `${summary.medium} Medium`, cls: 'badge badge-info' })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-16)', flexWrap: 'wrap' }}>
      {parts.map((p, i) => (
        <span key={p.label}>
          <span className={p.cls}>{p.label}</span>
          {i < parts.length - 1 && (
            <span className="type-label" style={{ marginLeft: 'var(--spacing-8)' }}>·</span>
          )}
        </span>
      ))}
    </div>
  )
}

// ── Case summary line ─────────────────────────────────────────────────────────

function CaseSummaryLine({ summary }) {
  const parts = []
  if (summary.investigating > 0) parts.push({ label: `${summary.investigating} Investigating`, cls: 'badge badge-error' })
  if (summary.open > 0)          parts.push({ label: `${summary.open} Open`,          cls: 'badge badge-warning' })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-16)', flexWrap: 'wrap' }}>
      {parts.map((p, i) => (
        <span key={p.label}>
          <span className={p.cls}>{p.label}</span>
          {i < parts.length - 1 && (
            <span className="type-label" style={{ marginLeft: 'var(--spacing-8)' }}>·</span>
          )}
        </span>
      ))}
    </div>
  )
}

// ── Work Orders card ──────────────────────────────────────────────────────────

function WorkOrdersCard({ onAssetClick }) {
  const [hoveredId, setHoveredId] = useState(null)
  const summary = buildWoSummary(WORK_ORDERS)

  return (
    <div className="card col-half">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
        <span className="type-heading-02" style={{ color: 'var(--color-card-title)' }}>Work Orders</span>
        <span className="badge badge-error">{WORK_ORDERS.length}</span>
      </div>

      {/* Summary */}
      <WoSummaryLine summary={summary} />

      {/* Rows */}
      <div>
        {WORK_ORDERS.map((wo) => (
          <div
            key={wo.id}
            style={rowBaseStyle(hoveredId === wo.id)}
            onMouseEnter={() => setHoveredId(wo.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Line 1: ID + task | priority pill */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-8)' }}>
              <div style={{ minWidth: 0 }}>
                <span className="type-helper">{wo.id}</span>
                <span className="type-helper"> · </span>
                <span className="type-body-01">{wo.task}</span>
              </div>
              <div style={{ flexShrink: 0 }}>
                <span className={PRIORITY_BADGE[wo.priority] || 'badge badge-info'} style={{ textTransform: 'capitalize' }}>
                  {wo.priority}
                </span>
              </div>
            </div>

            {/* Line 2: asset name | assignee + timestamp */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-8)' }}>
              <span
                className="type-body-01"
                style={{ color: 'var(--color-accent)', cursor: 'pointer' }}
                onClick={() => onAssetClick(wo.assetId)}
              >
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

      {/* Footer */}
      <div style={{ marginTop: 'var(--spacing-16)' }}>
        <span className="type-link">View all work orders &rarr;</span>
      </div>
    </div>
  )
}

// ── Investigations card ───────────────────────────────────────────────────────

function InvestigationsCard({ onAssetClick }) {
  const [hoveredId, setHoveredId] = useState(null)
  const summary = buildCaseSummary(CASES)

  return (
    <div className="card col-half">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
        <span className="type-heading-02" style={{ color: 'var(--color-card-title)' }}>Investigations</span>
        <span className="badge badge-warning">{CASES.length}</span>
      </div>

      {/* Summary */}
      <CaseSummaryLine summary={summary} />

      {/* Rows */}
      <div>
        {CASES.map((c) => (
          <div
            key={c.id}
            style={rowBaseStyle(hoveredId === c.id)}
            onMouseEnter={() => setHoveredId(c.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Line 1: Case ID + description | status pill */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-8)' }}>
              <div style={{ minWidth: 0 }}>
                <span className="type-helper">{c.id}</span>
                <span className="type-helper"> · </span>
                <span className="type-body-01">{c.description}</span>
              </div>
              <div style={{ flexShrink: 0 }}>
                <span className={CASE_STATUS_BADGE[c.status] || 'badge badge-info'} style={{ textTransform: 'capitalize' }}>
                  {c.status}
                </span>
              </div>
            </div>

            {/* Line 2: asset name | linked WO count + timestamp */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-8)' }}>
              <span
                className="type-body-01"
                style={{ color: 'var(--color-accent)', cursor: 'pointer' }}
                onClick={() => onAssetClick(c.assetId)}
              >
                {c.asset}
              </span>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div>
                  <span className="type-helper">
                    {c.linkedWorkOrders.length > 0
                      ? `${c.linkedWorkOrders.length} linked WO${c.linkedWorkOrders.length !== 1 ? 's' : ''}`
                      : 'No linked WOs'}
                  </span>
                </div>
                <div>
                  <span className="type-helper">{c.opened}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'var(--spacing-16)' }}>
        <span className="type-link">View all investigations &rarr;</span>
      </div>
    </div>
  )
}

// ── TodaysActivity ────────────────────────────────────────────────────────────

export default function TodaysActivity({ onAssetClick }) {
  return (
    <div className="grid-12">
      <WorkOrdersCard onAssetClick={onAssetClick} />
      <InvestigationsCard onAssetClick={onAssetClick} />
    </div>
  )
}
