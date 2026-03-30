// ── StatusIndicator ──────────────────────────────────────────────────────────
// Asset status indicator. Dot + label for asset operational state.
// Visually distinct from event severity (Badge) and criticality (CriticalityIndicator).
//
// Usage:
//   <StatusIndicator status="tripped" />          → ● Tripped
//   <StatusIndicator status="degraded" />         → ● Degraded
//   <StatusIndicator status="running" />          → ● Running
//   <StatusIndicator status="planned-outage" />   → ● Planned
//   <StatusIndicator status="tripped" compact />  → ● (dot only)

export const STATUSES = {
  tripped:         { label: 'Tripped',  dotClass: 'status-dot dot-tripped' },
  degraded:        { label: 'Degraded', dotClass: 'status-dot dot-degraded' },
  'planned-outage': { label: 'Planned', dotClass: 'status-dot dot-planned-outage' },
  running:         { label: 'Running',  dotClass: 'status-dot dot-running' },
}

export function statusLabel(status) {
  return (STATUSES[status] || STATUSES.running).label
}

export default function StatusIndicator({ status, compact }) {
  const config = STATUSES[status] || STATUSES.running

  if (compact) {
    return <span className={config.dotClass} aria-label={config.label} />
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--spacing-8)',
      }}
    >
      <span className={config.dotClass} aria-hidden="true" />
      <span className="type-body">{config.label}</span>
    </span>
  )
}
