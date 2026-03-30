import { useState } from 'react'
import { ASSETS, WORK_ORDERS, INVESTIGATIONS, TIMELINE, INCIDENTS } from '../../data/baytown'
import WoPriority from './WoPriority'
import CriticalityIndicator from './CriticalityIndicator'
import useIsMobile from '../../hooks/useIsMobile'

// Lookup asset criticality by assetId
const critByAsset = {}
ASSETS.forEach(a => { critByAsset[a.id] = a.criticality })

function getEventName(eventId) {
  if (!eventId) return null
  const evt = TIMELINE.find(e => e.id === eventId)
  return evt ? evt.name : null
}

function getIncidentName(incidentId) {
  if (!incidentId) return null
  const inc = INCIDENTS.find(i => i.id === incidentId)
  return inc ? inc.name : null
}

function getIncidentForEvent(eventId) {
  if (!eventId) return null
  const inc = INCIDENTS.find(i => i.eventIds.includes(eventId))
  return inc ? inc.name : null
}


// ── Summary builders ────────────────────────────────────────────────────────

function buildWoSummary(orders) {
  const counts = { emergency: 0, urgent: 0, scheduled: 0 }
  orders.forEach((wo) => { counts[wo.urgency] = (counts[wo.urgency] || 0) + 1 })
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
    cursor: 'default',
    transition: [
      'background var(--motion-fast) var(--ease-productive)',
      'border-left-color var(--motion-fast) var(--ease-productive)',
      'border-radius var(--motion-fast) var(--ease-productive)',
    ].join(', '),
  }
}

// ── Shared column widths for cross-card alignment ───────────────────────────
const RIGHT_COL = { minWidth: 100, width: 100, textAlign: 'right', flexShrink: 0 }

// ── Investigation status icons (right-pointing triangles = progress) ─────────

function InvestigatingIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 1.5L10 6 3 10.5z" fill="currentColor" />
    </svg>
  )
}

function OpenIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 1.5L10 6 3 10.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function InvestigationStatus({ status }) {
  const isInvestigating = status === 'investigating'
  const Icon = isInvestigating ? InvestigatingIcon : OpenIcon
  const label = isInvestigating ? 'Investigating' : 'Open'

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-4)', color: 'var(--color-text-secondary)' }}>
      <Icon />
      <span className="type-label" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
    </span>
  )
}

// ── WO summary line ─────────────────────────────────────────────────────────

function WoSummaryLine({ summary }) {
  const parts = []
  if (summary.emergency > 0) parts.push({ count: summary.emergency, urgency: 'emergency' })
  if (summary.urgent > 0)    parts.push({ count: summary.urgent,    urgency: 'urgent' })
  if (summary.scheduled > 0) parts.push({ count: summary.scheduled, urgency: 'scheduled' })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-16)', flexWrap: 'wrap' }}>
      {parts.map((p, i) => (
        <span key={p.urgency} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <span className="type-body" style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{p.count}</span>
          <WoPriority urgency={p.urgency} />
          {i < parts.length - 1 && (
            <span className="type-label" style={{ marginLeft: 'var(--spacing-4)' }}>·</span>
          )}
        </span>
      ))}
    </div>
  )
}

// ── Case summary line ───────────────────────────────────────────────────────

function CaseSummaryLine({ summary }) {
  const parts = []
  if (summary.investigating > 0) parts.push({ count: summary.investigating, status: 'investigating' })
  if (summary.open > 0)          parts.push({ count: summary.open,          status: 'open' })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-16)', flexWrap: 'wrap' }}>
      {parts.map((p, i) => (
        <span key={p.status} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <span className="type-body" style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{p.count}</span>
          <InvestigationStatus status={p.status} />
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
  const isMobile = useIsMobile()
  const summary = buildWoSummary(WORK_ORDERS)

  // Show top 5, sorted by urgency (emergency first)
  const urgencyOrder = { emergency: 0, urgent: 1, scheduled: 2 }
  const visible = [...WORK_ORDERS]
    .sort((a, b) => (urgencyOrder[a.urgency] ?? 9) - (urgencyOrder[b.urgency] ?? 9))
    .slice(0, 5)

  return (
    <div className="card col-half" style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-8)' }}>
        <span className="type-card-title">Work Orders</span>
        <span className="type-label">{WORK_ORDERS.length} Total</span>
      </div>

      {/* Summary */}
      <WoSummaryLine summary={summary} />

      {/* Rows (max 5, no internal scroll) */}
      <div style={{ flex: 1 }}>
        {visible.map((wo) => (
          <div
            key={wo.id}
            aria-label={`${wo.id}: ${wo.task}, ${wo.asset}, ${wo.urgency}`}
            style={rowBaseStyle(hoveredId === wo.id)}
            onMouseEnter={isMobile ? undefined : () => setHoveredId(wo.id)}
            onMouseLeave={isMobile ? undefined : () => setHoveredId(null)}
          >
            {isMobile ? (
              <>
                {/* Mobile Line 1: WO ID + task (truncated) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <span className="type-meta" style={{ color: 'var(--color-text-helper)', flexShrink: 0 }}>{wo.id}</span>
                  <span className="type-meta" style={{ color: 'var(--color-text-helper)', flexShrink: 0 }}>·</span>
                  <span className="type-body" style={{ color: 'var(--color-accent)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wo.task}</span>
                </div>
                {/* Mobile Line 2: asset + criticality + urgency */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-8)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', minWidth: 0 }}>
                    <span className="type-meta" style={{ color: 'var(--color-text-secondary)' }}>{wo.asset}</span>
                    {critByAsset[wo.assetId] && <CriticalityIndicator level={critByAsset[wo.assetId]} />}
                  </div>
                  <WoPriority urgency={wo.urgency} />
                </div>
              </>
            ) : (
              <>
                {/* Line 1: WO ID + task | urgency */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-8)' }}>
                  <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-accent)' }}>
                    <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>{wo.id}</span>
                    <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}> · </span>
                    <span className="type-body" style={{ color: 'inherit' }}>{wo.task}</span>
                  </div>
                  <div style={RIGHT_COL}>
                    <WoPriority urgency={wo.urgency} />
                  </div>
                </div>

                {/* Line 2: asset + criticality | assignee */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-8)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', minWidth: 0 }}>
                    <span className="type-body" style={{ color: 'var(--color-text-secondary)' }}>
                      {wo.asset}
                    </span>
                    {critByAsset[wo.assetId] && <CriticalityIndicator level={critByAsset[wo.assetId]} />}
                  </div>
                  <span className="type-label" style={{ ...RIGHT_COL, color: wo.assignee ? 'var(--color-text-secondary)' : 'var(--color-text-helper)' }}>
                    {wo.assignee || 'Unassigned'}
                  </span>
                </div>

                {/* Line 3: event + incident | timestamp */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-8)' }}>
                  <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>
                    {wo.eventId && getEventName(wo.eventId) ? (
                      <>
                        {getEventName(wo.eventId)}
                        {getIncidentForEvent(wo.eventId) && ` · ${getIncidentForEvent(wo.eventId)}`}
                      </>
                    ) : (
                      'Routine maintenance'
                    )}
                  </span>
                  <span className="type-meta" style={{ ...RIGHT_COL, color: 'var(--color-text-helper)' }}>
                    {wo.created}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Footer -- pinned to bottom, right-aligned */}
      <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-16)', textAlign: 'right' }}>
        <span className="type-link">Go to Work Orders &rarr;</span>
      </div>
    </div>
  )
}

// ── Investigations card ─────────────────────────────────────────────────────

function InvestigationsCard() {
  const [hoveredId, setHoveredId] = useState(null)
  const isMobile = useIsMobile()
  const summary = buildCaseSummary(INVESTIGATIONS)

  const visible = INVESTIGATIONS.slice(0, 5)

  return (
    <div className="card col-half" style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-8)' }}>
        <span className="type-card-title">Investigations</span>
        <span className="type-label">{INVESTIGATIONS.length} Total</span>
      </div>

      {/* Summary */}
      <CaseSummaryLine summary={summary} />

      {/* Rows (max 5, no internal scroll) */}
      <div style={{ flex: 1 }}>
        {visible.map((c) => (
          <div
            key={c.id}
            aria-label={`${c.id}: ${c.description}, ${c.asset}, ${c.status}`}
            style={rowBaseStyle(hoveredId === c.id)}
            onMouseEnter={isMobile ? undefined : () => setHoveredId(c.id)}
            onMouseLeave={isMobile ? undefined : () => setHoveredId(null)}
          >
            {isMobile ? (
              <>
                {/* Mobile Line 1: Case ID + description (truncated) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <span className="type-meta" style={{ color: 'var(--color-text-helper)', flexShrink: 0 }}>{c.id}</span>
                  <span className="type-meta" style={{ color: 'var(--color-text-helper)', flexShrink: 0 }}>·</span>
                  <span className="type-body" style={{ color: 'var(--color-accent)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description}</span>
                </div>
                {/* Mobile Line 2: asset + criticality + status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-8)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', minWidth: 0 }}>
                    <span className="type-meta" style={{ color: 'var(--color-text-secondary)' }}>{c.asset}</span>
                    {critByAsset[c.assetId] && <CriticalityIndicator level={critByAsset[c.assetId]} />}
                  </div>
                  <InvestigationStatus status={c.status} />
                </div>
              </>
            ) : (
              <>
                {/* Line 1: Investigation ID + description | status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-8)' }}>
                  <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-accent)' }}>
                    <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>{c.id}</span>
                    <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}> · </span>
                    <span className="type-body" style={{ color: 'inherit' }}>{c.description}</span>
                  </div>
                  <div style={RIGHT_COL}>
                    <InvestigationStatus status={c.status} />
                  </div>
                </div>

                {/* Line 2: asset + criticality | assignee */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-8)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', minWidth: 0 }}>
                    <span className="type-body" style={{ color: 'var(--color-text-secondary)' }}>
                      {c.asset}
                    </span>
                    {critByAsset[c.assetId] && <CriticalityIndicator level={critByAsset[c.assetId]} />}
                  </div>
                  <span className="type-label" style={{ ...RIGHT_COL, color: c.assignee ? 'var(--color-text-secondary)' : 'var(--color-text-helper)' }}>
                    {c.assignee || 'Unassigned'}
                  </span>
                </div>

                {/* Line 3: scope (events + WOs) | timestamp */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-8)' }}>
                  <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>
                    {[
                      `${c.linkedEvents.length} event${c.linkedEvents.length !== 1 ? 's' : ''}`,
                      `${c.linkedWorkOrders.length} WO${c.linkedWorkOrders.length !== 1 ? 's' : ''}`,
                    ].join(' · ')}
                  </span>
                  <span className="type-meta" style={{ ...RIGHT_COL, color: 'var(--color-text-helper)' }}>
                    {c.opened}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Footer -- pinned to bottom, right-aligned */}
      <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-16)', textAlign: 'right' }}>
        <span className="type-link">Go to Investigations &rarr;</span>
      </div>
    </div>
  )
}

// ── InProgress ──────────────────────────────────────────────────────────────

export default function InProgress() {
  return (
    <div className="grid-12">
      <WorkOrdersCard />
      <InvestigationsCard />
    </div>
  )
}
