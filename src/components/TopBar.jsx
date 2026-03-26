// ── TopBar ────────────────────────────────────────────────────────────────────
// 60px top bar. Left: breadcrumb. Right: notification bell with badge.

import { PLANT, NOTIFICATIONS } from '../data/assets.js'

const VIEW_LABELS = {
  health: 'Asset Health',
  details: 'Asset Details',
  trends: 'Trends',
  settings: 'Settings',
}

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 2a6 6 0 0 0-6 6v3l-1.5 2H17.5L16 11V8a6 6 0 0 0-6-6Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 16.5a1.5 1.5 0 0 0 3 0"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
)

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.5 2.5L7.5 6l-3 3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function TopBar({ view, selectedAsset, onNavigate, onToggleNotifications, notificationsOpen }) {
  const notificationCount = NOTIFICATIONS.length

  return (
    <header
      className="flex items-center justify-between px-6 bg-[var(--color-bg)] border-b border-[var(--color-border)] shrink-0"
      style={{ height: '60px' }}
    >
      {/* Left: logo + breadcrumb */}
      <div className="flex items-center" style={{ gap: 'var(--spacing-16)' }}>
        {/* Logo */}
        <div className="flex items-center" style={{ gap: 'var(--spacing-8)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="var(--color-accent)" />
            <path d="M7 12h4v5H7zM13 8h4v9h-4zM10 7h4v3h-4z" fill="var(--color-bg)" />
          </svg>
          <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-text-primary)', textTransform: 'uppercase' }}>
            ASSET PERFORMANCE MANAGEMENT
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', background: 'var(--color-border-strong)' }} />

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 list-none">
            <li>
              <span className="type-body-secondary" style={{ fontWeight: 500 }}>
                {PLANT.name}
              </span>
            </li>

          {/* View breadcrumb */}
          {view && (
            <>
              <li className="text-[var(--color-text-disabled)]" aria-hidden="true">
                <ChevronIcon />
              </li>
              <li>
                {view === 'details' && selectedAsset ? (
                  // Details with nested asset: show "Asset Health > Asset Name"
                  <span className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('health')}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors duration-150 cursor-pointer"
                      style={{ fontSize: '13px' }}
                    >
                      Asset Health
                    </button>
                    <span className="text-[var(--color-text-disabled)]" aria-hidden="true">
                      <ChevronIcon />
                    </span>
                    <span className="text-[var(--color-text-primary)] font-medium" style={{ fontSize: '13px' }}>
                      {selectedAsset}
                    </span>
                  </span>
                ) : (
                  <span className="text-[var(--color-text-primary)] font-medium" style={{ fontSize: '13px' }}>
                    {VIEW_LABELS[view] ?? view}
                  </span>
                )}
              </li>
            </>
          )}
          </ol>
        </nav>
      </div>

      {/* Right: notification bell */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleNotifications}
          aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} alerts` : ''}`}
          aria-expanded={notificationsOpen}
          className={[
            'relative flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)] transition-colors duration-150 cursor-pointer',
            notificationsOpen
              ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]'
              : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-secondary)]',
          ].join(' ')}
        >
          <BellIcon />
          {notificationCount > 0 && (
            <span
              className="absolute top-1 right-1 flex items-center justify-center bg-[var(--color-critical)] text-white rounded-full font-semibold leading-none"
              style={{ width: '16px', height: '16px', fontSize: '9px', transform: 'translate(4px, -4px)' }}
              aria-hidden="true"
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
