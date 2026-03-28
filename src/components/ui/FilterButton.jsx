// ── FilterButton ─────────────────────────────────────────────────────────────
// Shared filter button with multi-select checkbox dropdown.
// Used by Asset Table and Notifications Panel.
//
// Usage:
//   <FilterButton
//     categories={[
//       { key: 'severity', label: 'Severity', options: ['critical','high'], labelFn: v => v }
//     ]}
//     filters={{ severity: ['critical'] }}
//     onToggle={(categoryKey, value) => ...}
//   />

import { useState, useRef, useEffect } from 'react'

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 2h13l-5 6v4.5l-3 1.5V8z" />
    </svg>
  )
}

export default function FilterButton({ categories, filters, onToggle }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const activeCount = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label="Filter"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--spacing-4)',
          padding: '0 var(--spacing-12)',
          height: 32,
          borderRadius: 'var(--radius-4)',
          border: `1px solid ${activeCount > 0 ? 'var(--color-accent)' : 'var(--color-border-subtle)'}`,
          background: activeCount > 0 ? 'var(--color-accent-bg)' : 'var(--color-layer-02)',
          color: activeCount > 0 ? 'var(--color-accent)' : 'var(--color-text-secondary)',
          fontSize: 'var(--text-12)',
          cursor: 'pointer',
          transition: 'all var(--motion-fast) var(--ease-productive)',
        }}
      >
        <FilterIcon />
        <span>Filter</span>
        {activeCount > 0 && (
          <span style={{
            background: 'var(--color-accent)',
            color: 'var(--color-text-inverse)',
            borderRadius: '50%',
            width: 16,
            height: 16,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 600,
          }}>
            {activeCount}
          </span>
        )}
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: 4,
          width: 240,
          background: 'var(--color-layer-01)',
          border: '1px solid var(--color-border-strong)',
          borderRadius: 'var(--radius-8)',
          boxShadow: 'var(--shadow-tooltip)',
          zIndex: 20,
          padding: 'var(--spacing-8) 0',
          animation: 'fadeInOnly var(--motion-fast) var(--ease-productive)',
        }}>
          {categories.map(cat => (
            <div key={cat.key} style={{ padding: 'var(--spacing-8) var(--spacing-16)' }}>
              <span className="type-label" style={{ color: 'var(--color-text-helper)', marginBottom: 4, display: 'block' }}>
                {cat.label}
              </span>
              {cat.options.map(opt => {
                const isChecked = filters[cat.key]?.includes(opt) || false
                return (
                  <label
                    key={opt}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-8)',
                      padding: '4px 0',
                      cursor: 'pointer',
                      fontSize: 'var(--text-12)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggle(cat.key, opt)}
                      style={{ accentColor: 'var(--color-accent)' }}
                    />
                    {cat.labelFn ? cat.labelFn(opt) : opt}
                  </label>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
