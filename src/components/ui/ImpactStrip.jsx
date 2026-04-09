// ── ImpactStrip ──────────────────────────────────────────────────────────────
// Three-act narrative derived from the primary INCIDENT:
//   Trigger → Consequence → Confirmation
// Each act is a card. Horizontal on desktop (grid-thirds), vertical on mobile.
// ADR-012, ADR-013 Layer 1, ADR-014.
//
// In a real system, the ML auto-correlates events into incidents and
// identifies the trigger, cascade consequences, and inspection findings.
// The three-act structure answers "What affected System Health?"

import { TIMELINE, INCIDENTS } from '../../data/baytown'

// Severity ranking for picking the most significant consequence
const SEVERITY_RANK = { critical: 0, high: 1, medium: 2, low: 3 }

function buildNarrative(incident) {
  if (!incident) return []

  const eventMap = {}
  TIMELINE.forEach(e => { eventMap[e.id] = e })

  const acts = []

  // Act 1: Trigger -- the event that started the cascade
  const trigger = eventMap[incident.triggerEventId]
  if (trigger) {
    acts.push({ label: 'Trigger', event: trigger })
  }

  // Act 2: Consequence -- highest-severity event caused_by the trigger
  const consequences = incident.eventIds
    .map(id => eventMap[id])
    .filter(e => e && e.relationships?.some(r => r.type === 'caused_by' && r.eventId === incident.triggerEventId))
    .sort((a, b) => (SEVERITY_RANK[a.severity] ?? 9) - (SEVERITY_RANK[b.severity] ?? 9))

  if (consequences.length > 0) {
    acts.push({ label: 'Consequence', event: consequences[0] })
  }

  // Act 3: Confirmation -- the inspection-type event in the incident
  const confirmation = incident.eventIds
    .map(id => eventMap[id])
    .filter(e => e && e.eventType === 'inspection')
    .pop()

  if (confirmation) {
    acts.push({ label: 'Confirmation', event: confirmation })
  }

  return acts
}

function EventCard({ label, event }) {
  return (
    <div className="card flex flex-col gap-[var(--gap-stack)]">
      <span className="type-card-title">{label}</span>
      <p className="type-meta">{event.time}</p>
      <p className="type-body">{event.name}</p>
      <p className="type-meta">{event.asset}</p>
      <p className="type-meta">{event.event}</p>
      {event.kpiImpact && (
        <p className="type-label">{event.kpiImpact}</p>
      )}
    </div>
  )
}

export default function ImpactStrip() {
  // Build narratives for all incidents
  const narratives = INCIDENTS
    .map(inc => ({ incident: inc, acts: buildNarrative(inc) }))
    .filter(n => n.acts.length > 0)

  if (narratives.length === 0) return null

  return (
    <section>
      <p className="section-header">What Happened?</p>

      {narratives.map(({ incident, acts }) => (
        <div key={incident.id} className={narratives.length > 1 ? 'mb-16' : ''}>
          {/* Incident label -- only show when multiple incidents */}
          {narratives.length > 1 && (
            <p className="type-label mb-[var(--gap-stack)] text-[var(--color-text-secondary)]">
              {incident.name}
            </p>
          )}

          <div className="grid-thirds">
            {acts.map((act) => (
              <EventCard
                key={act.label}
                label={act.label}
                event={act.event}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-[var(--gap-stack)] text-right">
        <span className="type-link">Go to Events &rarr;</span>
      </div>
    </section>
  )
}
