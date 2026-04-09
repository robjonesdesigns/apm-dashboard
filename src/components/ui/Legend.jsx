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
    <div className="flex flex-col items-center gap-[var(--gap-stack)] mt-auto pt-4">
      {title && (
        <span className="type-body font-semibold">{title}</span>
      )}
      <div
        role={interactive ? 'group' : undefined}
        aria-label={interactive ? 'Chart legend' : undefined}
        className="flex items-center justify-center gap-16 flex-wrap"
      >
      {items.map((item) => {
        const dimmed = activeItem && activeItem !== item.label
        const Tag = interactive ? 'button' : 'div'
        return (
          <Tag
            key={item.label}
            className={`flex items-center gap-8${interactive ? ' btn-reset py-1' : ''}`}
            onClick={interactive ? () => onItemClick?.(item.label) : undefined}
            style={{
              opacity: dimmed ? 0.35 : 1,
              transition: 'opacity var(--motion-fast) var(--ease-productive)',
            }}
          >
            <Swatch color={item.color} shape={item.shape || shape} />
            <span className="type-label">{item.label}</span>
            {item.value !== undefined && (
              <span className="type-label text-[var(--color-text-primary)] font-semibold">
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
