// ── ImpactStrip ──────────────────────────────────────────────────────────────
// Three-act narrative: Trigger, Consequence, Confirmation.
// Each act is a card. Horizontal on desktop (grid-thirds), vertical on mobile.
// ADR-012, ADR-013 Layer 1, ADR-014.

import { TIMELINE } from '../../data/assets'

const majorEvents = TIMELINE.filter(e => e.kpiImpact).slice(0, 3)

const ACT_LABELS = ['Trigger', 'Consequence', 'Confirmation']
function getActLabel(index, total) {
  if (total === 1) return 'Trigger'
  if (total === 2) return index === 0 ? 'Trigger' : 'Consequence'
  return ACT_LABELS[index] || ''
}

function EventCard({ label, event }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
      <span className="type-card-title" style={{ color: 'var(--color-card-title)' }}>
        {label}
      </span>
      <p className="type-meta" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
        {event.time}
      </p>
      <p className="type-body" style={{ margin: 0, color: 'var(--color-text-primary)' }}>
        {event.asset}
      </p>
      <p className="type-meta" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
        {event.event}
      </p>
      <p className="type-label" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
        {event.kpiImpact}
      </p>
    </div>
  )
}

export default function ImpactStrip() {
  if (majorEvents.length === 0) return null

  return (
    <section>
      <p className="section-header">What Happened?</p>

      <div className="grid-thirds">
        {majorEvents.map((event, i) => (
          <EventCard
            key={i}
            label={getActLabel(i, majorEvents.length)}
            event={event}
          />
        ))}
      </div>

      <div style={{ marginTop: 'var(--spacing-8)', textAlign: 'right' }}>
        <button
          className="type-link"
          onClick={() => console.log('Navigate to Event Log')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
        >
          See full timeline &rarr;
        </button>
      </div>
    </section>
  )
}
