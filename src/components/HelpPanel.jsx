// ── HelpModal ─────────────────────────────────────────────────────────────────
// Reference modal opened from Help icon in TopBar.
// Carbon-inspired modal pattern with project radii (10px).
// Escape to close, click backdrop to close.

import { useEffect, useRef } from 'react'

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

const SECTIONS = [
  { name: 'System Health', description: 'Plant-level KPIs -- OEE, availability, performance, quality, trains, and active assets. Color and shape indicate which metrics need attention.' },
  { name: 'What Happened', description: 'Three-act incident narrative showing the trigger, consequence, and confirmation of the most recent event cascade.' },
  { name: 'In Progress', description: 'Active work orders and ongoing investigations across the plant. Sorted by urgency.' },
  { name: 'Needs Action', description: 'Event triage queue grouped by asset criticality, alarm quality breakdown, and a watch list of top event-producing assets.' },
  { name: 'Assets', description: 'Sortable asset table with status, criticality, OEE, events, downtime, work orders, investigations, and remaining useful life. Click any row to inspect.' },
]

export default function HelpModal({ open, onClose }) {
  const modalRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => modalRef.current?.focus(), 50)
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-overlay)',
        animation: 'help-fade-in var(--motion-fast) var(--ease-productive)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-label="About this dashboard"
        aria-modal="true"
        tabIndex={-1}
        style={{
          background: 'var(--color-layer-01)',
          borderRadius: 'var(--radius-10)',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          margin: 'var(--spacing-16)',
          animation: 'help-slide-up var(--motion-moderate) var(--ease-productive)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--spacing-24)',
          borderBottom: '1px solid var(--color-border-subtle)',
          flexShrink: 0,
        }}>
          <h2 className="type-card-title" style={{ margin: 0 }}>
            About this dashboard
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
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
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-24)' }}>
          <p className="type-body" style={{ margin: '0 0 var(--spacing-24) 0', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Plant Overview for Baytown Refinery. Designed for reliability engineers to triage overnight events, check asset health, and prioritize the day's work. Sections are ordered by the morning workflow: check health, understand cause, check response, identify remaining work, then drill into specifics.
          </p>

          {/* Section guide */}
          <p className="type-label" style={{ margin: '0 0 var(--spacing-16) 0', color: 'var(--color-text-helper)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 'var(--type-body-compact-01)' }}>
            Section guide
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-24)' }}>
            {SECTIONS.map((section) => (
              <div key={section.name} style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--spacing-24)' }}>
                <p className="type-body" style={{ margin: '0 0 var(--gap-stack) 0', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {section.name}
                </p>
                <p className="type-body" style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  {section.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
