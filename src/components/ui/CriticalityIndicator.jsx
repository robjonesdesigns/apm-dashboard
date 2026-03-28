// ── CriticalityIndicator ──────────────────────────────────────────────────────
// Asset criticality per ADR-016.
// Static engineering classification (A/B/C/D), visually distinct from event badges.
//
// Usage:
//   <CriticalityIndicator level="A" />   → [A (Safety)]
//   <CriticalityIndicator level="B" />   → [B (Production)]
//   <CriticalityIndicator level="C" />   → [C (Support)]

const LEVELS = {
  A: { label: 'Safety',     bg: 'var(--color-error-bg)',   border: 'var(--color-error)' },
  B: { label: 'Production', bg: 'var(--color-warning-bg)', border: 'var(--color-warning)' },
  C: { label: 'Support',    bg: 'var(--color-info-bg)',    border: 'var(--color-info)' },
  D: { label: 'General',    bg: 'transparent',             border: 'var(--color-border-strong)' },
}

export default function CriticalityIndicator({ level }) {
  const config = LEVELS[level] || LEVELS.D

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--spacing-4)',
        padding: '4px 8px',
        borderRadius: 'var(--radius-4)',
        border: `1px solid ${config.border}`,
        background: config.bg,
        color: 'var(--color-text-primary)',
        fontSize: 'var(--text-12)',
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {level} ({config.label})
    </span>
  )
}
