// ── NotificationsPanel ────────────────────────────────────────────────────────
// Push panel (320px). Compresses the content viewport when open.
// Two-panel drill-in: notification list → event details.
// Adapted from Forge Right Rail documentation for Carbon g100 dark theme.
// ADR-009: mutually exclusive with expanded sidebar.

import { useState } from 'react'
import { NOTIFICATIONS } from '../data/assets.js'
import Badge from './ui/Badge'

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

const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 2h14M4 8h8M6 14h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
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

const FILTER_OPTIONS = ['All', 'Critical', 'High', 'Medium']

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
          ? (hovered ? 'rgba(45, 212, 191, 0.12)' : 'rgba(45, 212, 191, 0.06)')
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', minWidth: 0, flex: 1 }}>
        {/* Row 1: severity badge + timestamp */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-8)' }}>
          <Badge level={notification.type} />
          <span className="type-meta" style={{ flexShrink: 0 }}>{notification.time}</span>
        </div>

        {/* Row 2: asset name (title) */}
        <span
          className="type-card-title"
          style={{
            lineHeight: 1.3,
            fontWeight: isNew ? 700 : 600,
          }}
        >
          {notification.asset}
        </span>

        {/* Row 3: message (preview, max 2 lines) */}
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
          <div key={section.label} style={{ marginBottom: 'var(--spacing-16)' }}>
            <p className="type-label" style={{ margin: '0 0 var(--spacing-4) 0', textTransform: 'uppercase' }}>
              {section.label}
            </p>
            <p className="type-body" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              {section.value}
            </p>
          </div>
        ))}

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--color-border-subtle)', margin: 'var(--spacing-16) 0' }} />

        {/* Quick Access links */}
        <p className="type-card-title" style={{ margin: '0 0 var(--spacing-8) 0' }}>Quick Access</p>
        {['Asset Details', 'Event Trend', 'Fault Tree'].map((link) => (
          <p key={link} style={{ margin: '0 0 var(--spacing-8) 0' }}>
            <span className="type-link" style={{ cursor: 'pointer' }}>{link}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

// ── Event detail content (derived from notification data + story context) ────

function getEventDetails(notification) {
  const details = []
  const msg = notification.message.toLowerCase()

  // Description is always the message itself
  details.push({
    label: 'Description',
    value: notification.message,
  })

  // Derive cause/consequence/recommendation from message content
  if (msg.includes('trip') || msg.includes('vibration spike')) {
    details.push({ label: 'Cause', value: 'Bearing degradation over 28 days led to progressive vibration increase. Oil filter bypass allowed contaminated lubricant to accelerate wear.' })
    details.push({ label: 'Consequence', value: 'Compressor tripped on high vibration protection. Availability dropped 12.1%. Downstream process disrupted.' })
    details.push({ label: 'Recommendations', value: 'Complete bearing inspection (WO-4481). Flush lube oil system (WO-4482). Review alarm threshold adequacy per CS-0897.' })
  } else if (msg.includes('bearing damage')) {
    details.push({ label: 'Cause', value: 'Manual inspection confirmed mechanical damage to journal bearing surfaces consistent with contaminated lubrication.' })
    details.push({ label: 'Consequence', value: 'Remaining useful life revised to 5 days. Bearing replacement required before restart.' })
    details.push({ label: 'Recommendations', value: 'Expedite bearing procurement. Schedule replacement during planned turnaround window. Root cause analysis in progress (CS-0891).' })
  } else if (msg.includes('oil pressure')) {
    details.push({ label: 'Cause', value: 'Oil filter bypass allowed contaminated lubricant into bearing housing. Pressure decay indicates progressive system failure.' })
    details.push({ label: 'Consequence', value: 'Auxiliary pump auto-started to maintain minimum pressure. Bearing lubrication compromised.' })
    details.push({ label: 'Recommendations', value: 'Replace oil filters. Sample oil for contamination analysis. Inspect filter bypass valve.' })
  } else if (msg.includes('discharge pressure') || msg.includes('seal')) {
    details.push({ label: 'Cause', value: 'Mechanical seal wear causing minor internal leakage. Third seal replacement in 6 months suggests underlying alignment or shaft runout issue.' })
    details.push({ label: 'Consequence', value: 'Discharge pressure 8% below normal. No immediate production impact but degradation will continue.' })
    details.push({ label: 'Recommendations', value: 'Complete seal inspection (WO-4483). Investigate shaft runout and alignment as root cause (CS-0894).' })
  } else if (msg.includes('shutdown') || msg.includes('emergency')) {
    details.push({ label: 'Cause', value: 'Automatic emergency shutdown triggered by vibration protection system at 7.8 mm/s (threshold 7.1 mm/s).' })
    details.push({ label: 'Consequence', value: 'Compressor isolated safely. No secondary damage detected. OEE impact of -5.9%.' })
    details.push({ label: 'Recommendations', value: 'Verify shutdown sequence completed correctly. Check all isolation valves. Do not attempt restart until bearing inspection complete.' })
  } else if (msg.includes('work order')) {
    details.push({ label: 'Cause', value: 'Work order created in response to compressor trip event at 2:03 AM.' })
    details.push({ label: 'Consequence', value: 'Maintenance task queued. Assigned technician notified.' })
    details.push({ label: 'Recommendations', value: 'Prioritize completion before next shift change. Coordinate with reliability team on root cause investigation.' })
  } else if (msg.includes('case') || msg.includes('root cause')) {
    details.push({ label: 'Cause', value: 'Investigation initiated due to recurring bearing degradation pattern. Vibration alerts were present for 3 days prior to trip.' })
    details.push({ label: 'Consequence', value: 'Formal root cause analysis underway. Linked to WO-4481 and WO-4482.' })
    details.push({ label: 'Recommendations', value: 'Review historical alarm data. Assess whether earlier intervention would have prevented the trip. Update alarm thresholds if warranted.' })
  } else if (msg.includes('maintenance') || msg.includes('planned')) {
    details.push({ label: 'Cause', value: 'Scheduled preventive maintenance at 12,000-hour combustion inspection interval.' })
    details.push({ label: 'Consequence', value: 'Turbine T-401 offline for planned duration. No unplanned production impact.' })
    details.push({ label: 'Recommendations', value: 'Follow standard combustion inspection checklist. Document any findings for trend analysis.' })
  } else {
    details.push({ label: 'Cause', value: 'Under investigation.' })
    details.push({ label: 'Consequence', value: 'Impact assessment in progress.' })
    details.push({ label: 'Recommendations', value: 'Monitor and escalate if condition worsens.' })
  }

  return details
}

// ── Panel header ─────────────────────────────────────────────────────────────

function PanelHeader({ count, onClose, activeFilter, onFilterChange }) {
  return (
    <>
      {/* Title row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-12) var(--spacing-16)',
        borderBottom: '1px solid var(--color-border-subtle)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
          <span className="section-header" style={{ margin: 0 }}>
            Notifications
          </span>
          {count > 0 && (
            <span className="badge badge-info">{count}</span>
          )}
        </div>
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
            transition: `all var(--motion-fast) var(--ease-productive)`,
          }}
        >
          <CloseIcon />
        </button>
      </div>

      {/* Filter chips */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-8)',
        padding: 'var(--spacing-8) var(--spacing-16)',
        borderBottom: '1px solid var(--color-border-subtle)',
        flexShrink: 0,
        flexWrap: 'wrap',
      }}>
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            className={`chip ${activeFilter === f ? 'chip-active' : ''}`}
            onClick={() => onFilterChange(f)}
            style={{ padding: '4px 12px', fontSize: 'var(--text-12)' }}
          >
            {f}
          </button>
        ))}
      </div>
    </>
  )
}

// ── Main panel ───────────────────────────────────────────────────────────────

export default function NotificationsPanel({ open, onClose, assetFilter }) {
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [filter, setFilter] = useState('All')

  // Apply asset filter (from Asset Inspection screen)
  let notifications = assetFilter
    ? NOTIFICATIONS.filter(n => n.asset === assetFilter)
    : NOTIFICATIONS

  // Apply severity filter
  if (filter !== 'All') {
    notifications = notifications.filter(n => n.type === filter.toLowerCase())
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
      {selectedNotification ? (
        <EventDetails
          notification={selectedNotification}
          onBack={() => setSelectedNotification(null)}
          onClose={onClose}
        />
      ) : (
        <>
          <PanelHeader
            count={notifications.length}
            onClose={onClose}
            activeFilter={filter}
            onFilterChange={setFilter}
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
