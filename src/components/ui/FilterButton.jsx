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
    function handleKeyDown(e) {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        ref.current?.querySelector('button')?.focus()
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        className={`filter-btn${activeCount > 0 ? ' filter-btn-active' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        aria-label="Filter"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <FilterIcon />
        <span>Filter</span>
        {activeCount > 0 && (
          <span className="count-badge">{activeCount}</span>
        )}
      </button>
      {open && (
        <div className="filter-dropdown">
          {categories.map(cat => (
            <div key={cat.key} className="px-16 py-8">
              <span className="type-label block mb-4">
                {cat.label}
              </span>
              {cat.options.map(opt => {
                const isChecked = filters[cat.key]?.includes(opt) || false
                return (
                  <label
                    key={opt}
                    className="flex items-center gap-8 py-1 cursor-pointer text-12 text-[var(--color-text-secondary)]"
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
