// ── WoPriority ───────────────────────────────────────────────────────────────
// Work order urgency indicator. Visually distinct from event severity badges.
// Shape-based icon + neutral text. No color coding, no pill, no tally bars.
//
// Usage:
//   <WoPriority urgency="emergency" />   → ● Emergency (filled circle)
//   <WoPriority urgency="urgent" />      → ○ Urgent (hollow circle)
//   <WoPriority urgency="scheduled" />   → ◷ Scheduled (clock icon)

function EmergencyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="5" fill="currentColor" />
    </svg>
  )
}

function UrgentIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function ScheduledIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 3.5V6l2 1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const URGENCY = {
  emergency: { label: 'Emergency', Icon: EmergencyIcon },
  urgent:    { label: 'Urgent',    Icon: UrgentIcon },
  scheduled: { label: 'Scheduled', Icon: ScheduledIcon },
}

export default function WoPriority({ urgency }) {
  const config = URGENCY[urgency]
  if (!config) return null
  const { Icon } = config

  return (
    <span className="inline-flex items-center gap-4 text-[var(--color-text-secondary)]">
      <Icon />
      <span className="type-label">{config.label}</span>
    </span>
  )
}
