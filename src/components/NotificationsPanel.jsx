// ── NotificationsPanel ────────────────────────────────────────────────────────
// Push panel (320px). Compresses the content viewport when open.
// Two-panel drill-in: notification list → event details.
// ADR-009: mutually exclusive with expanded sidebar.

import { useState, useEffect, useRef } from 'react'
import { NOTIFICATIONS, INCIDENTS, TIMELINE, ASSETS } from '../data/baytown.js'
import useFocusTrap from '../hooks/useFocusTrap'
import SeverityBadge from './ui/SeverityBadge'
import CriticalityIndicator from './ui/CriticalityIndicator'
import FilterButton from './ui/FilterButton'

const critByAsset = {}
ASSETS.forEach(a => { critByAsset[a.id] = a.criticality })

// ── Icons ────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TYPE_DOT_CLASS = {
  critical: 'status-dot dot-critical',
  high:     'status-dot dot-high',
  medium:   'status-dot dot-medium',
  low:      'status-dot dot-low',
}

const SEVERITY_OPTIONS = ['critical', 'high', 'medium', 'low']
const SEVERITY_LABELS = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' }

// ── Notification row ─────────────────────────────────────────────────────────

function NotificationItem({ notification, isNew, onSelect }) {
  return (
    <button
      className={`notification-item row-hover btn-reset${isNew ? ' notification-item-new' : ''}`}
      onClick={() => onSelect(notification)}
    >
      {/* Unread indicator */}
      <div className="pt-[6px] shrink-0" style={{ width: 8 }}>
        <div
          className="rounded-full"
          style={{
            width: 6, height: 6,
            background: isNew ? 'var(--color-accent)' : 'transparent',
          }}
        />
      </div>

      <div className="flex flex-col gap-[var(--gap-stack)] min-w-0 flex-1">
        <div className="flex items-center justify-between gap-8">
          <SeverityBadge severity={notification.severity} />
          <span className="type-meta shrink-0">{notification.time}</span>
        </div>

        <span className="type-card-title" style={{ lineHeight: 1.3, fontWeight: isNew ? 700 : 600 }}>
          {notification.name}
        </span>

        <div className="flex items-center gap-8">
          <span className="type-label text-[var(--color-accent)]">{notification.asset}</span>
          {critByAsset[notification.assetId] && (
            <>
              <span className="divider-v" />
              <CriticalityIndicator level={critByAsset[notification.assetId]} />
            </>
          )}
        </div>

        <span
          className="type-body text-[var(--color-text-secondary)]"
          style={{
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {notification.message}
        </span>
      </div>
    </button>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getIncidentName(incidentId) {
  const inc = INCIDENTS.find(i => i.id === incidentId)
  return inc ? inc.name : incidentId
}

function getEventName(eventId) {
  const evt = TIMELINE.find(e => e.id === eventId)
  return evt ? evt.name : ''
}

const REL_LABELS = { caused_by: 'Caused by', cascaded_to: 'Cascaded to', related_to: 'Related to' }

function ProvenanceLine({ provenance }) {
  if (!provenance) return null
  let label
  if (provenance.source === 'human') {
    label = `Confirmed by ${provenance.updatedBy}, ${provenance.updatedAt}`
  } else if (provenance.source === 'model') {
    const conf = provenance.confidence ? `, ${provenance.confidence}% confidence` : ''
    label = provenance.status === 'confirmed'
      ? `ML suggested, confirmed by ${provenance.updatedBy}`
      : `ML suggested${conf}`
  } else {
    label = provenance.status === 'confirmed'
      ? `System detected, ${provenance.updatedAt}`
      : `System detected`
  }
  return (
    <span className="type-meta block mt-[var(--gap-stack)] text-[var(--color-text-helper)] italic">
      {label}
    </span>
  )
}

function getEventDetails(notification) {
  const details = []
  details.push({ label: 'Description', value: notification.message })
  if (notification.subAsset) {
    details.push({ label: 'Sub-Asset', value: `${notification.subAsset} (${notification.subAssetId})` })
  }
  if (notification.cause) details.push({ label: 'Cause', value: notification.cause.text, provenance: notification.cause })
  if (notification.consequence) details.push({ label: 'Consequence', value: notification.consequence.text, provenance: notification.consequence })
  if (notification.recommendation) details.push({ label: 'Recommendation', value: notification.recommendation.text, provenance: notification.recommendation })
  return details
}

// ── Event Details (2nd panel drill-in) ───────────────────────────────────────

function EventDetails({ notification, onBack, onClose }) {
  const details = getEventDetails(notification)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-16 border-b border-[var(--color-border-subtle)] shrink-0">
        <button className="btn-reset flex items-center gap-4 text-[var(--color-accent)] font-semibold" onClick={onBack}>
          <BackIcon /> Back
        </button>
        <button
          className="btn-reset flex items-center justify-center rounded-[var(--radius-4)] text-[var(--color-text-helper)]"
          onClick={onClose}
          aria-label="Close notifications"
          style={{ width: 32, height: 32 }}
        >
          <CloseIcon />
        </button>
      </div>

      {/* Summary */}
      <div className="p-16 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-8 mb-[var(--gap-stack)]">
          <SeverityBadge severity={notification.severity} />
          <span className="type-meta">{notification.time}</span>
        </div>
        <p className="type-card-title mb-[var(--gap-stack)]">{notification.name}</p>
        <div className="flex items-center gap-8 mb-[var(--gap-stack)]">
          <span className="type-label text-[var(--color-accent)]">{notification.asset}</span>
          {critByAsset[notification.assetId] && (
            <>
              <span className="divider-v" />
              <CriticalityIndicator level={critByAsset[notification.assetId]} />
            </>
          )}
        </div>
        <p className="type-body text-[var(--color-text-secondary)]">{notification.message}</p>
      </div>

      {/* Details */}
      <div className="flex-1 overflow-y-auto p-16">
        <p className="type-card-title mb-16">Event Details</p>

        {details.map((section) => (
          <div key={section.label} className="mb-24">
            <p className="type-label mb-[var(--gap-stack)] uppercase">{section.label}</p>
            <p className="type-body text-[var(--color-text-secondary)]">{section.value}</p>
            <ProvenanceLine provenance={section.provenance} />
          </div>
        ))}

        {notification.incidentId && (
          <div className="mb-16 py-8 px-12 bg-[var(--color-accent-bg-subtle)] rounded-[var(--radius-4)]">
            <span className="type-meta text-[var(--color-text-helper)]">
              Part of <span className="type-link text-12">{getIncidentName(notification.incidentId)}</span> incident
            </span>
          </div>
        )}

        {notification.relationships?.length > 0 && (
          <div className="mb-16">
            <p className="type-label mb-[var(--gap-stack)] uppercase">Related Events</p>
            <div className="flex flex-col gap-[var(--gap-stack)]">
              {notification.relationships.map((rel) => (
                <span key={`${rel.type}-${rel.eventId}`} className="type-meta text-[var(--color-text-helper)]">
                  {REL_LABELS[rel.type] || rel.type}: <span className="type-link text-12">{rel.eventId} {getEventName(rel.eventId)}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {notification.workOrderIds?.length > 0 && (
          <div className="mb-16">
            <p className="type-label mb-[var(--gap-stack)] uppercase">Linked Work Orders</p>
            <div className="flex flex-col gap-[var(--gap-stack)]">
              {notification.workOrderIds.map((wo) => <span key={wo} className="type-link">{wo}</span>)}
            </div>
          </div>
        )}

        {notification.investigationIds?.length > 0 && (
          <div className="mb-16">
            <p className="type-label mb-[var(--gap-stack)] uppercase">Linked Investigations</p>
            <div className="flex flex-col gap-[var(--gap-stack)]">
              {notification.investigationIds.map((inv) => <span key={inv} className="type-link">{inv}</span>)}
            </div>
          </div>
        )}

        <div className="h-px bg-[var(--color-border-subtle)] my-16" />

        <p className="type-card-title mb-[var(--gap-stack)]">Quick Access</p>
        {['Asset Inspection', 'Trends', 'Fault Tree'].map((link) => (
          <p key={link} className="mb-[var(--gap-stack)]"><span className="type-link">{link}</span></p>
        ))}
      </div>
    </div>
  )
}

// ── Panel header ─────────────────────────────────────────────────────────────

const NOTIF_FILTER_CATEGORIES = [
  { key: 'severity', label: 'Severity', options: SEVERITY_OPTIONS, labelFn: v => SEVERITY_LABELS[v] },
]

function PanelHeader({ onClose, activeFilters, onToggleFilter }) {
  return (
    <div className="flex items-center justify-between px-16 py-12 border-b border-[var(--color-border-subtle)] shrink-0">
      <span className="section-header" style={{ margin: 0 }}>Event Feed</span>
      <div className="flex items-center gap-8">
        <FilterButton
          categories={NOTIF_FILTER_CATEGORIES}
          filters={{ severity: activeFilters }}
          onToggle={(_key, value) => onToggleFilter(value)}
        />
        <button
          className="btn-reset flex items-center justify-center rounded-[var(--radius-4)] text-[var(--color-text-helper)]"
          onClick={onClose}
          aria-label="Close notifications"
          style={{ width: 28, height: 28 }}
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}

// ── Main panel ───────────────────────────────────────────────────────────────

export default function NotificationsPanel({ open, onClose, assetFilter, isMobile }) {
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [severityFilters, setSeverityFilters] = useState([])
  const panelRef = useRef(null)
  useFocusTrap(panelRef, open && isMobile)

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => panelRef.current?.focus(), 50)
    function handleKeyDown(e) {
      if (e.key === 'Escape') { e.stopPropagation(); onClose() }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => { clearTimeout(timer); document.removeEventListener('keydown', handleKeyDown) }
  }, [open, onClose])

  function toggleSeverity(level) {
    setSeverityFilters(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level])
  }

  let notifications = assetFilter ? NOTIFICATIONS.filter(n => n.asset === assetFilter) : NOTIFICATIONS
  if (severityFilters.length > 0) {
    notifications = notifications.filter(n => severityFilters.includes(n.severity))
  }

  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('apm-notifications-read'))
      return new Set(Array.isArray(stored) ? stored : [])
    } catch { return new Set() }
  })
  const initialNewIds = new Set(NOTIFICATIONS.slice(0, 3).map(n => n.id))

  useEffect(() => {
    localStorage.setItem('apm-notifications-read', JSON.stringify([...readIds]))
  }, [readIds])

  function handleSelect(notification) {
    setReadIds(prev => new Set([...prev, notification.id]))
    setSelectedNotification(notification)
  }

  const newIds = new Set([...initialNewIds].filter(id => !readIds.has(id)))

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Event Feed"
      aria-modal={isMobile ? true : undefined}
      tabIndex={-1}
      className="flex flex-col bg-[var(--color-layer-01)]"
      style={isMobile ? {
        position: 'fixed',
        top: 'var(--header-height)',
        left: 0, right: 0, bottom: 0,
        zIndex: 9998,
        display: open ? 'flex' : 'none',
      } : {
        width: open ? 320 : 0,
        minWidth: open ? 320 : 0,
        overflow: 'hidden',
        transition: `width var(--motion-moderate) var(--ease-productive), min-width var(--motion-moderate) var(--ease-productive)`,
        borderLeft: open ? '1px solid var(--color-border-subtle)' : 'none',
        height: '100%',
      }}
    >
      {selectedNotification ? (
        <EventDetails
          notification={selectedNotification}
          onBack={() => setSelectedNotification(null)}
          onClose={onClose}
        />
      ) : (
        <>
          <PanelHeader onClose={onClose} activeFilters={severityFilters} onToggleFilter={toggleSeverity} />

          {assetFilter && (
            <div className="px-16 py-8 bg-[var(--color-accent-bg)] border-b border-[var(--color-border-subtle)] shrink-0">
              <span className="type-label">
                Filtered to <strong className="text-[var(--color-accent)]">{assetFilter}</strong>
              </span>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex items-center justify-center h-full p-24">
                <span className="type-body text-[var(--color-text-secondary)]">
                  No {severityFilters.length > 0 ? 'matching ' : ''}notifications{assetFilter ? ` for ${assetFilter}` : ''}
                </span>
              </div>
            ) : (
              notifications.map(n => (
                <NotificationItem key={n.id} notification={n} isNew={newIds.has(n.id)} onSelect={handleSelect} />
              ))
            )}
          </div>

          <div className="px-16 py-12 border-t border-[var(--color-border-subtle)] text-right shrink-0">
            <span className="type-link">Go to Event Log &rarr;</span>
          </div>
        </>
      )}
    </div>
  )
}
