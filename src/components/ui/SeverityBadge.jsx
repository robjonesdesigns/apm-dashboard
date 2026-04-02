// ── SeverityBadge ─────────────────────────────────────────────────────────────
// Shared badge component for event severity.
// Uses tally + fill hierarchy per ADR-016.
//
// Usage:
//   <SeverityBadge severity="critical" />       → |||| Critical (solid red)
//   <SeverityBadge severity="high" />           → ||| High (red outline)
//   <SeverityBadge severity="medium" />         → || Medium (amber outline)
//   <SeverityBadge severity="low" />            → | Low (blue outline)

const LEVELS = {
  critical: { className: 'badge badge-critical', bars: 4, label: 'Critical' },
  high:     { className: 'badge badge-high',     bars: 3, label: 'High' },
  medium:   { className: 'badge badge-medium',   bars: 2, label: 'Medium' },
  low:      { className: 'badge badge-low',      bars: 1, label: 'Low' },
}

const BAR_STYLE = {
  width: 2,
  height: 10,
  borderRadius: 1,
  background: 'currentColor',
}

function Tally({ count }) {
  return (
    <span className="badge-tally" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={BAR_STYLE} />
      ))}
    </span>
  )
}

export default function SeverityBadge({ severity, compact }) {
  const config = LEVELS[severity]
  if (!config) return null

  return (
    <span className={config.className} aria-label={config.label}>
      <Tally count={config.bars} />
      {!compact && config.label}
    </span>
  )
}
