// ── NotificationsPanel ────────────────────────────────────────────────────────
// Slide-out panel (320px). Absolutely positioned over content area, right side.

import { NOTIFICATIONS } from '../data/assets.js'

const TYPE_DOT_COLORS = {
  critical: 'var(--color-critical)',
  warning: 'var(--color-warning)',
  info: 'var(--color-info)',
  healthy: 'var(--color-healthy)',
}

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 3l10 10M13 3L3 13"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
)

function NotificationItem({ notification }) {
  const dotColor = TYPE_DOT_COLORS[notification.type] ?? TYPE_DOT_COLORS.info

  return (
    <div
      className="flex gap-3 px-4 py-3 border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors duration-100"
    >
      {/* Status dot */}
      <div className="flex items-start pt-[3px] shrink-0">
        <span
          className="inline-block rounded-full shrink-0"
          style={{ width: '8px', height: '8px', background: dotColor }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className="font-semibold text-[var(--color-text-primary)] truncate"
          style={{ fontSize: '12px' }}
        >
          {notification.asset}
        </span>
        <span
          className="text-[var(--color-text-secondary)] leading-snug"
          style={{ fontSize: '12px' }}
        >
          {notification.message}
        </span>
        <span
          className="text-[var(--color-text-muted)] mt-0.5"
          style={{ fontSize: '11px' }}
        >
          {notification.time}
        </span>
      </div>
    </div>
  )
}

export default function NotificationsPanel({ open, onClose, assetFilter }) {
  const notifications = assetFilter
    ? NOTIFICATIONS.filter((n) => n.asset === assetFilter)
    : NOTIFICATIONS

  return (
    <>
      {/* Backdrop — transparent, just captures outside clicks */}
      {open && (
        <div
          className="fixed inset-0 z-10"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        role="dialog"
        aria-label="Notifications"
        aria-modal="false"
        className={[
          'fixed right-0 z-20 flex flex-col',
          'bg-[var(--color-surface)] border-l border-[var(--color-border)]',
          'transition-transform duration-200 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        style={{ width: '320px', top: '56px', height: 'calc(100vh - 56px)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 border-b border-[var(--color-border)] shrink-0"
          style={{ height: '48px' }}
        >
          <div className="flex items-center gap-2">
            <span
              className="font-semibold text-[var(--color-text-primary)]"
              style={{ fontSize: '13px' }}
            >
              Notifications
            </span>
            {notifications.length > 0 && (
              <span
                className="flex items-center justify-center bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] rounded-full font-medium"
                style={{ minWidth: '20px', height: '20px', padding: '0 6px', fontSize: '11px' }}
              >
                {notifications.length}
              </span>
            )}
            {assetFilter && (
              <span
                className="text-[var(--color-text-muted)] truncate max-w-[120px]"
                style={{ fontSize: '11px' }}
                title={assetFilter}
              >
                &mdash; {assetFilter}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close notifications"
            className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-secondary)] transition-colors duration-150 cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 px-6 text-center">
              <span
                className="text-[var(--color-text-muted)]"
                style={{ fontSize: '13px' }}
              >
                No notifications
                {assetFilter ? ` for ${assetFilter}` : ''}
              </span>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          )}
        </div>
      </div>
    </>
  )
}
