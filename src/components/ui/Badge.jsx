// ── Badge ─────────────────────────────────────────────────────────────────────
// Shared badge component for event severity.
// Uses tally + fill hierarchy per ADR-016.
//
// Usage:
//   <Badge level="critical" />       → |||| Critical (solid red)
//   <Badge level="high" />           → ||| High (red outline)
//   <Badge level="medium" />         → || Medium (amber outline)
//   <Badge level="low" />            → | Low (blue outline)

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

export default function Badge({ level }) {
  const config = LEVELS[level]
  if (!config) return null

  return (
    <span className={config.className}>
      <Tally count={config.bars} />
      {config.label}
    </span>
  )
}
