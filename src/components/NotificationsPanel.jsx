// ── NotificationsPanel ────────────────────────────────────────────────────────
// Push panel (320px). Compresses the content viewport when open.
// Two-panel drill-in: notification list → event details.
// Adapted from Forge Right Rail documentation for Carbon g100 dark theme.
// ADR-009: mutually exclusive with expanded sidebar.

import { useState } from 'react'
import { NOTIFICATIONS, INCIDENTS, TIMELINE } from '../data/assets.js'
import Badge from './ui/Badge'
import FilterButton from './ui/FilterButton'

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



// Event types now match badge levels directly (ADR-016)
// critical → critical, high → high, medium → medium, low → low

const TYPE_DOT_CLASS = {
  critical: 'status-dot dot-critical',
  high:     'status-dot dot-high',
  medium:   'status-dot dot-medium',
  low:      'status-dot dot-low',
}

// ── Filter chips ─────────────────────────────────────────────────────────────

const SEVERITY_OPTIONS = ['critical', 'high', 'medium', 'low']
const SEVERITY_LABELS = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' }

// ── Notification row ─────────────────────────────────────────────────────────

function NotificationItem({ notification, isNew, onSelect }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={() => onSelect(notification)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--spacing-12)',
        padding: 'var(--spacing-16)',
        borderBottom: '1px solid var(--color-border-subtle)',
        borderLeft: hovered ? '2px solid var(--color-accent)' : '2px solid transparent',
        borderRadius: hovered ? 'var(--radius-4)' : '0',
        background: isNew
          ? (hovered ? 'var(--color-accent-bg-strong)' : 'var(--color-accent-bg-subtle)')
          : (hovered ? 'var(--color-hover-01)' : 'transparent'),
        cursor: 'pointer',
        transition: `all var(--motion-fast) var(--ease-productive)`,
        width: '100%',
        textAlign: 'left',
        border: 'none',
        borderBottom: '1px solid var(--color-border-subtle)',
        borderLeft: hovered ? '2px solid var(--color-accent)' : '2px solid transparent',
        color: 'inherit',
        font: 'inherit',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Unread indicator -- always present for consistent alignment */}
      <div style={{ paddingTop: '6px', flexShrink: 0, width: '8px' }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: 'var(--radius-full)',
          background: isNew ? 'var(--color-accent)' : 'transparent',
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)', minWidth: 0, flex: 1 }}>
        {/* Row 1: severity badge + timestamp */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-8)' }}>
          <Badge level={notification.type} />
          <span className="type-meta" style={{ flexShrink: 0 }}>{notification.time}</span>
        </div>

        {/* Row 2: event name */}
        <span
          className="type-card-title"
          style={{
            lineHeight: 1.3,
            fontWeight: isNew ? 700 : 600,
          }}
        >
          {notification.name}
        </span>

        {/* Row 3: asset name */}
        <span className="type-label" style={{ color: 'var(--color-accent)' }}>
          {notification.asset}
        </span>

        {/* Row 4: description (preview, max 2 lines) */}
        <span
          className="type-body"
          style={{
            color: 'var(--color-text-secondary)',
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

// ── Event Details (2nd panel drill-in) ───────────────────────────────────────

function EventDetails({ notification, onBack, onClose }) {
  // Derive cause/consequence/recommendation from the event type and message
  const details = getEventDetails(notification)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header: Back + Close */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-16)',
        borderBottom: '1px solid var(--color-border-subtle)',
        flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-4)',
            background: 'none',
            border: 'none',
            color: 'var(--color-accent)',
            cursor: 'pointer',
            font: 'inherit',
            fontSize: 'var(--text-14)',
            fontWeight: 600,
          }}
        >
          <BackIcon />
          Back
        </button>
        <button
          onClick={onClose}
          aria-label="Close notifications"
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
          }}
        >
          <CloseIcon />
        </button>
      </div>

      {/* Notification summary (repeated from list for identification) */}
      <div style={{ padding: 'var(--spacing-16)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-8)' }}>
          <Badge level={notification.type} />
          <span className="type-meta">{notification.time}</span>
        </div>
        <p className="type-card-title" style={{ margin: 0, marginBottom: 'var(--spacing-4)' }}>
          {notification.name}
        </p>
        <p className="type-label" style={{ margin: '0 0 var(--spacing-8) 0', color: 'var(--color-accent)' }}>
          {notification.asset}
        </p>
        <p className="type-body" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
          {notification.message}
        </p>
      </div>

      {/* Event details */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-16)' }}>
        <p className="type-card-title" style={{ margin: '0 0 var(--spacing-16) 0' }}>Event Details</p>

        {details.map((section) => (
          <div key={section.label} style={{ marginBottom: 'var(--spacing-24)' }}>
            <p className="type-label" style={{ margin: '0 0 var(--spacing-4) 0', textTransform: 'uppercase' }}>
              {section.label}
            </p>
            <p className="type-body" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              {section.value}
            </p>
            <ProvenanceLine provenance={section.provenance} />
          </div>
        ))}

        {/* Incident membership */}
        {notification.incidentId && (
          <div style={{
            marginBottom: 'var(--spacing-16)',
            padding: 'var(--spacing-8) var(--spacing-12)',
            background: 'var(--color-accent-bg-subtle)',
            borderRadius: 'var(--radius-4)',
          }}>
            <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>
              Part of{' '}
              <span
                className="type-link"
                style={{ cursor: 'pointer', fontSize: 'var(--text-12)' }}
                onClick={() => console.log('Navigate to incident', notification.incidentId)}
              >
                {getIncidentName(notification.incidentId)}
              </span>
              {' '}incident
            </span>
          </div>
        )}

        {/* Related Events */}
        {notification.relationships && notification.relationships.length > 0 && (
          <div style={{ marginBottom: 'var(--spacing-16)' }}>
            <p className="type-label" style={{ margin: '0 0 var(--spacing-4) 0', textTransform: 'uppercase' }}>
              Related Events
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              {notification.relationships.map((rel) => (
                <span key={`${rel.type}-${rel.eventId}`} className="type-meta" style={{ color: 'var(--color-text-helper)' }}>
                  {REL_LABELS[rel.type] || rel.type}:{' '}
                  <span
                    className="type-link"
                    style={{ cursor: 'pointer', fontSize: 'var(--text-12)' }}
                    onClick={() => console.log('Navigate to event', rel.eventId)}
                  >
                    {rel.eventId} {getEventName(rel.eventId)}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Linked Work Orders */}
        {notification.linkedWOs && notification.linkedWOs.length > 0 && (
          <div style={{ marginBottom: 'var(--spacing-16)' }}>
            <p className="type-label" style={{ margin: '0 0 var(--spacing-4) 0', textTransform: 'uppercase' }}>
              Linked Work Orders
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              {notification.linkedWOs.map((wo) => (
                <span
                  key={wo}
                  className="type-link"
                  style={{ cursor: 'pointer' }}
                  onClick={() => console.log('Navigate to', wo)}
                >
                  {wo}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Linked Investigations */}
        {notification.linkedInvestigations && notification.linkedInvestigations.length > 0 && (
          <div style={{ marginBottom: 'var(--spacing-16)' }}>
            <p className="type-label" style={{ margin: '0 0 var(--spacing-4) 0', textTransform: 'uppercase' }}>
              Linked Investigations
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              {notification.linkedInvestigations.map((inv) => (
                <span
                  key={inv}
                  className="type-link"
                  style={{ cursor: 'pointer' }}
                  onClick={() => console.log('Navigate to', inv)}
                >
                  {inv}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--color-border-subtle)', margin: 'var(--spacing-16) 0' }} />

        {/* Quick Access links */}
        <p className="type-card-title" style={{ margin: '0 0 var(--spacing-8) 0' }}>Quick Access</p>
        {['Asset Inspection', 'Trends', 'Fault Tree'].map((link) => (
          <p key={link} style={{ margin: '0 0 var(--spacing-8) 0' }}>
            <span className="type-link" style={{ cursor: 'pointer' }}>{link}</span>
          </p>
        ))}
      </div>
    </div>
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

// ── Provenance line (subtle annotation under each metadata section) ──────────

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
    <span
      className="type-meta"
      style={{
        display: 'block',
        marginTop: 'var(--spacing-4)',
        color: 'var(--color-text-helper)',
        fontStyle: 'italic',
      }}
    >
      {label}
    </span>
  )
}

// ── Event detail content (reads structured metadata from notification) ────────

function getEventDetails(notification) {
  const details = []

  details.push({ label: 'Description', value: notification.message })

  if (notification.subAsset) {
    details.push({ label: 'Sub-Asset', value: `${notification.subAsset} (${notification.subAssetId})` })
  }

  if (notification.cause) {
    details.push({ label: 'Cause', value: notification.cause.text, provenance: notification.cause })
  }
  if (notification.consequence) {
    details.push({ label: 'Consequence', value: notification.consequence.text, provenance: notification.consequence })
  }
  if (notification.recommendation) {
    details.push({ label: 'Recommendation', value: notification.recommendation.text, provenance: notification.recommendation })
  }

  return details
}

// ── Panel header ─────────────────────────────────────────────────────────────

const NOTIF_FILTER_CATEGORIES = [
  { key: 'severity', label: 'Severity', options: SEVERITY_OPTIONS, labelFn: v => SEVERITY_LABELS[v] },
]

function PanelHeader({ onClose, activeFilters, onToggleFilter }) {
  const filtersObj = { severity: activeFilters }

  function handleToggle(_key, value) {
    onToggleFilter(value)
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--spacing-12) var(--spacing-16)',
      borderBottom: '1px solid var(--color-border-subtle)',
      flexShrink: 0,
    }}>
      <span className="section-header" style={{ margin: 0 }}>
        Notifications
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
        <FilterButton
          categories={NOTIF_FILTER_CATEGORIES}
          filters={filtersObj}
          onToggle={handleToggle}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close notifications"
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
    </div>
  )
}

// ── Main panel ───────────────────────────────────────────────────────────────

export default function NotificationsPanel({ open, onClose, assetFilter, isMobile }) {
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [severityFilters, setSeverityFilters] = useState([])

  function toggleSeverity(level) {
    setSeverityFilters(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    )
  }

  // Apply asset filter (from Asset Inspection screen)
  let notifications = assetFilter
    ? NOTIFICATIONS.filter(n => n.asset === assetFilter)
    : NOTIFICATIONS

  // Apply severity filter (multi-select: show any checked levels, empty = all)
  if (severityFilters.length > 0) {
    notifications = notifications.filter(n => severityFilters.includes(n.type))
  }

  // Track read state -- first 3 start as unread, clicking marks as read
  const [readIds, setReadIds] = useState(new Set())
  const initialNewIds = new Set(NOTIFICATIONS.slice(0, 3).map(n => n.id))

  function handleSelect(notification) {
    setReadIds(prev => new Set([...prev, notification.id]))
    setSelectedNotification(notification)
  }

  const newIds = new Set([...initialNewIds].filter(id => !readIds.has(id)))

  return (
    <div
      role="dialog"
      aria-label="Notifications"
      style={isMobile ? {
        // Mobile: full-screen overlay
        position: 'fixed',
        top: 'var(--header-height)',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9998,
        background: 'var(--color-layer-01)',
        display: open ? 'flex' : 'none',
        flexDirection: 'column',
      } : {
        // Desktop: 320px push panel
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
      {selectedNotification ? (
        <EventDetails
          notification={selectedNotification}
          onBack={() => setSelectedNotification(null)}
          onClose={onClose}
        />
      ) : (
        <>
          <PanelHeader
            onClose={onClose}
            activeFilters={severityFilters}
            onToggleFilter={toggleSeverity}
          />

          {/* Asset filter indicator */}
          {assetFilter && (
            <div style={{
              padding: 'var(--spacing-8) var(--spacing-16)',
              background: 'var(--color-accent-bg)',
              borderBottom: '1px solid var(--color-border-subtle)',
              flexShrink: 0,
            }}>
              <span className="type-label">
                Filtered to <strong style={{ color: 'var(--color-accent)' }}>{assetFilter}</strong>
              </span>
            </div>
          )}

          {/* Notification list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: 'var(--spacing-24)',
              }}>
                <span className="type-body" style={{ color: 'var(--color-text-secondary)' }}>
                  No {filter !== 'All' ? filter.toLowerCase() + ' ' : ''}notifications{assetFilter ? ` for ${assetFilter}` : ''}
                </span>
              </div>
            ) : (
              notifications.map(n => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  isNew={newIds.has(n.id)}
                  onSelect={handleSelect}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: 'var(--spacing-12) var(--spacing-16)',
            borderTop: '1px solid var(--color-border-subtle)',
            textAlign: 'right',
            flexShrink: 0,
          }}>
            <span className="type-link" style={{ cursor: 'pointer' }}>Go to Event Log &rarr;</span>
          </div>
        </>
      )}
    </div>
  )
}
