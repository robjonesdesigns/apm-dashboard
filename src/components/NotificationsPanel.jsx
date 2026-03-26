// ── NotificationsPanel ────────────────────────────────────────────────────────
// Push panel (320px). Compresses the content viewport when open.
// Grid recalculates within the narrower space.

import { NOTIFICATIONS } from '../data/assets.js'

const TYPE_DOT_CLASS = {
  critical: 'status-dot status-dot-critical',
  warning: 'status-dot status-dot-warning',
  info: 'status-dot status-dot-info',
  healthy: 'status-dot status-dot-healthy',
}

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

function NotificationItem({ notification }) {
  return (
    <div
      className="flex items-start"
      style={{
        gap: 'var(--spacing-12)',
        padding: 'var(--spacing-12) var(--spacing-16)',
        borderBottom: '1px solid var(--color-border)',
        transition: 'all 0.15s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-hover)'; e.currentTarget.style.borderLeft = '2px solid var(--color-accent)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeft = '2px solid transparent' }}
    >
      <div style={{ paddingTop: '4px', flexShrink: 0 }}>
        <span className={TYPE_DOT_CLASS[notification.type] || TYPE_DOT_CLASS.info} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', minWidth: 0 }}>
        <span className="type-h4" style={{ lineHeight: 1.3 }}>{notification.asset}</span>
        <span className="type-body-secondary" style={{ lineHeight: 1.4 }}>{notification.message}</span>
        <span className="type-meta">{notification.time}</span>
      </div>
    </div>
  )
}

export default function NotificationsPanel({ open, onClose, assetFilter }) {
  const notifications = assetFilter
    ? NOTIFICATIONS.filter(n => n.asset === assetFilter)
    : NOTIFICATIONS

  return (
    <div
      role="dialog"
      aria-label="Notifications"
      style={{
        width: open ? '320px' : '0px',
        minWidth: open ? '320px' : '0px',
        overflow: 'hidden',
        transition: 'width 0.2s ease, min-width 0.2s ease',
        borderLeft: open ? '1px solid var(--color-border)' : 'none',
        background: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--spacing-16)',
          height: '60px',
          borderBottom: '1px solid var(--color-border)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
          <span className="type-h4">Notifications</span>
          {notifications.length > 0 && (
            <span
              className="badge badge-info"
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              {notifications.length}
            </span>
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
            borderRadius: 'var(--radius-6)',
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-hover)'; e.currentTarget.style.color = 'var(--color-text-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
        >
          <CloseIcon />
        </button>
      </div>

      {/* Filter info */}
      {assetFilter && (
        <div
          style={{
            padding: 'var(--spacing-8) var(--spacing-16)',
            background: 'var(--color-accent-subtle)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <span className="type-body-sm">Filtered to <strong style={{ color: 'var(--color-accent)' }}>{assetFilter}</strong></span>
        </div>
      )}

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 'var(--spacing-24)' }}>
            <span className="type-body-secondary">No notifications{assetFilter ? ` for ${assetFilter}` : ''}</span>
          </div>
        ) : (
          notifications.map(n => <NotificationItem key={n.id} notification={n} />)
        )}
      </div>
    </div>
  )
}
