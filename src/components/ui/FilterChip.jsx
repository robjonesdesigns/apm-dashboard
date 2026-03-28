export default function FilterChip({ label, onClear }) {
  return (
    <button
      onClick={onClear}
      aria-label={`Clear filter: ${label}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--spacing-4)',
        padding: '0 var(--spacing-8)',
        height: 26,
        borderRadius: 'var(--radius-4)',
        border: '1px solid var(--color-accent)',
        background: 'var(--color-accent-bg)',
        color: 'var(--color-accent)',
        fontSize: 'var(--text-12)',
        cursor: 'pointer',
        transition: 'background var(--motion-fast) var(--ease-productive)',
      }}
    >
      <span>{label}</span>
      <span style={{ fontSize: 14, lineHeight: 1 }}>&times;</span>
    </button>
  )
}
