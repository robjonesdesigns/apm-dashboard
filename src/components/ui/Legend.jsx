// ── Legend ────────────────────────────────────────────────────────────────────
// Shared chart legend component. Horizontal layout, bottom of card.
// Satisfies WCAG SC 1.4.1 (color + text label), SC 1.4.11 (3:1 contrast).
// Carbon pattern: swatch + label + optional count/value.
// DESK-RESEARCH-011.

// shape: 'square' (bar charts) | 'circle' (donut/scatter) | 'line' (line charts)

function Swatch({ color, shape = 'square' }) {
  const size = 12
  const style = {
    width: `${size}px`,
    height: shape === 'line' ? '3px' : `${size}px`,
    borderRadius: shape === 'circle' ? 'var(--radius-full)' : shape === 'line' ? '1px' : '2px',
    background: color,
    flexShrink: 0,
  }
  return <div style={style} />
}

// items: [{ label, color, value?, shape? }]
// interactive: if true, clicking an item calls onItemClick(label)
// activeItem: the currently selected label (highlighted, others dimmed)

export default function Legend({ items, shape = 'square', interactive = false, onItemClick, activeItem, title }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-8)', marginTop: 'auto', paddingTop: 'var(--spacing-16)' }}>
      {title && (
        <span className="type-body" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{title}</span>
      )}
      <div
        role={interactive ? 'group' : undefined}
        aria-label={interactive ? 'Chart legend' : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--spacing-16)',
          flexWrap: 'wrap',
        }}
      >
      {items.map((item) => {
        const dimmed = activeItem && activeItem !== item.label
        const Tag = interactive ? 'button' : 'div'
        return (
          <Tag
            key={item.label}
            onClick={interactive ? () => onItemClick?.(item.label) : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-8)',
              opacity: dimmed ? 0.35 : 1,
              transition: 'opacity var(--motion-fast) var(--ease-productive)',
              cursor: interactive ? 'pointer' : 'default',
              // Reset button styles
              ...(interactive ? {
                background: 'none',
                border: 'none',
                padding: '4px 0',
                color: 'inherit',
                font: 'inherit',
              } : {}),
            }}
          >
            <Swatch color={item.color} shape={item.shape || shape} />
            <span className="type-label" style={{ letterSpacing: '0.2px' }}>
              {item.label}
            </span>
            {item.value !== undefined && (
              <span className="type-label" style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                {item.value}
              </span>
            )}
          </Tag>
        )
      })}
      </div>
    </div>
  )
}
