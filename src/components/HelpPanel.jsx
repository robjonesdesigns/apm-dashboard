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
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-label="About this dashboard"
        aria-modal="true"
        tabIndex={-1}
        className="flex flex-col w-full overflow-hidden rounded-[var(--radius-10)] border border-[var(--color-border-subtle)] bg-[var(--color-layer-01)] m-16"
        style={{
          maxWidth: 560,
          maxHeight: '80vh',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          animation: 'help-slide-up var(--motion-moderate) var(--ease-productive)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-24 border-b border-[var(--color-border-subtle)] shrink-0">
          <h2 className="type-heading">About this dashboard</h2>
          <button
            className="btn-reset flex items-center justify-center rounded-[var(--radius-4)] text-[var(--color-text-helper)]"
            onClick={onClose}
            aria-label="Close"
            style={{ width: 32, height: 32 }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-24">
          <p className="type-body text-[var(--color-text-secondary)] mb-24" style={{ lineHeight: 1.6 }}>
            Plant Overview for Baytown Refinery. Designed for reliability engineers to triage overnight events, check asset health, and prioritize the day's work. Sections are ordered by the morning workflow: check health, understand cause, check response, identify remaining work, then drill into specifics.
          </p>

          <p className="section-header mb-16">Section guide</p>
          <div className="flex flex-col gap-24">
            {SECTIONS.map((section) => (
              <div key={section.name} className="border-b border-[var(--color-border-subtle)] pb-24">
                <p className="type-body font-semibold mb-[var(--gap-stack)]">{section.name}</p>
                <p className="type-body text-[var(--color-text-secondary)]" style={{ lineHeight: 1.5 }}>{section.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
