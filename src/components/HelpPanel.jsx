// ── HelpPanel ─────────────────────────────────────────────────────────────────
// Reference panel opened from Help icon in TopBar.
// Follows NotificationsPanel pattern: push panel, Escape to close.

import { useEffect, useRef } from 'react'

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

const SECTIONS = [
  { name: 'System Health', description: 'Plant-level KPIs -- OEE, availability, performance, quality, trains, and active assets.' },
  { name: 'What Happened', description: 'Incident timeline showing correlated events and their impact on operations.' },
  { name: 'In Progress', description: 'Active work orders and ongoing investigations across the plant.' },
  { name: 'Needs Action', description: 'Event triage queue, alarm quality metrics, and asset watch list.' },
  { name: 'Assets', description: 'Sortable asset table with status, criticality, events, and drill-down to inspection.' },
]

export default function HelpPanel({ open, onClose }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => panelRef.current?.focus(), 50)
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Help"
      tabIndex={-1}
      style={{
        width: open ? '320px' : '0px',
        minWidth: open ? '320px' : '0px',
        overflow: 'hidden',
        transition: `width var(--motion-moderate) var(--ease-productive), min-width var(--motion-moderate) var(--ease-productive)`,
        borderLeft: open ? '1px solid var(--color-border-subtle)' : 'none',
        background: 'var(--color-layer-01)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-12) var(--spacing-16)',
        borderBottom: '1px solid var(--color-border-subtle)',
        flexShrink: 0,
      }}>
        <span className="section-header" style={{ margin: 0 }}>
          Help
        </span>
        <button
          onClick={onClose}
          aria-label="Close help"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-4)',
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-helper)',
            cursor: 'pointer',
            transition: `all var(--motion-fast) var(--ease-productive)`,
          }}
        >
          <CloseIcon />
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-16)' }}>
        {/* About */}
        <p className="type-card-title" style={{ margin: '0 0 var(--gap-stack) 0' }}>
          About this dashboard
        </p>
        <p className="type-body" style={{ margin: '0 0 var(--spacing-24) 0', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          Plant Overview for Baytown Refinery. Designed for reliability engineers to triage overnight events, check asset health, and prioritize the day's work.
        </p>

        {/* Section guide */}
        <p className="type-card-title" style={{ margin: '0 0 var(--spacing-16) 0' }}>
          Section guide
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
          {SECTIONS.map((section) => (
            <div key={section.name}>
              <p className="type-label" style={{ margin: '0 0 var(--gap-stack) 0', color: 'var(--color-text-primary)' }}>
                {section.name}
              </p>
              <p className="type-meta" style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
