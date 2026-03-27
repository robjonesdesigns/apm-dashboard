// ── ImpactStrip ──────────────────────────────────────────────────────────────
// Contextual banner between KPIs and Today's Activity.
// Shows only events that moved KPIs. Bridges "something is wrong" to "this
// is what caused it." No product does this inline (DESK-RESEARCH-008).
// Not a card. A subtle banner. ADR-012, ADR-013 Layer 1.

import { TIMELINE } from '../../data/assets'

// Only show events that have a KPI impact
const impactEvents = TIMELINE.filter(e => e.kpiImpact)

// Icon for the event type
function EventIcon({ type }) {
  if (type === 'critical') return <span className="status-dot dot-error" />
  if (type === 'warning') return <span className="status-dot dot-warning" />
  if (type === 'healthy') return <span className="status-dot dot-success" />
  return <span className="status-dot dot-info" />
}

export default function ImpactStrip() {
  if (impactEvents.length === 0) return null

  return (
    <div
      style={{
        background: 'var(--color-error-bg)',
        borderRadius: '10px',
        padding: 'var(--spacing-12) var(--spacing-24)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--spacing-16)',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-16)', flexWrap: 'wrap', flex: 1 }}>
        {impactEvents.map((event, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-8)',
            }}
          >
            <EventIcon type={event.type} />
            <span className="type-body-compact">
              <strong style={{ color: 'var(--color-text-primary)' }}>{event.asset}</strong>
              <span style={{ color: 'var(--color-text-secondary)' }}> {event.event.toLowerCase()} at {event.time}</span>
            </span>
            <span
              className="badge"
              style={{
                background: event.kpiImpact.startsWith('-') || event.kpiImpact.includes('-') ? 'var(--color-error-bg)' : 'var(--color-success-bg)',
                color: event.kpiImpact.startsWith('-') || event.kpiImpact.includes('-') ? 'var(--color-error)' : 'var(--color-success)',
                border: '1px solid',
                borderColor: event.kpiImpact.startsWith('-') || event.kpiImpact.includes('-') ? 'var(--color-error)' : 'var(--color-success)',
              }}
            >
              {event.kpiImpact}
            </span>
            {i < impactEvents.length - 1 && (
              <span style={{ color: 'var(--color-border-strong)', margin: '0 var(--spacing-4)' }}>|</span>
            )}
          </div>
        ))}
      </div>

      <span className="type-link" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
        See full timeline &rarr;
      </span>
    </div>
  )
}
