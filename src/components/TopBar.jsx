// ── TopBar ─────────────────────────────────────────────────────────────────────
// 48px fixed top bar. Spans full width above the sidebar.
// Props: view, selectedAsset, onNavigate, onToggleNotifications, notificationsOpen, onToggleSidebar

import { PLANT, NOTIFICATIONS } from '../data/assets.js'

// Maps view ID → human-readable label
const VIEW_LABELS = {
  overview:      'Plant Overview',
  inspection:    'Asset Inspection',
  rootcause:     'Fault Tree',
  trends:        'Trends',
  workorders:    'Work Orders',
  investigations: 'Investigations',
  settings:      'Settings',
  // Legacy aliases (App.jsx still uses these)
  health:        'Plant Overview',
  details:       'Asset Inspection',
}

// ── Icons ──────────────────────────────────────────────────────────────────────

const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect width="24" height="24" rx="4" fill="var(--color-accent)" />
    {/* Simple bar chart: three vertical bars */}
    <rect x="5"  y="13" width="4" height="6" fill="var(--color-bg)" />
    <rect x="10" y="9"  width="4" height="10" fill="var(--color-bg)" />
    <rect x="15" y="5"  width="4" height="14" fill="var(--color-bg)" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M4.5 2.5L7.5 6l-3 3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M7.5 7.5a2.5 2.5 0 0 1 4.9.833C12.4 9.666 10 10.5 10 11.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="10" cy="14" r="0.75" fill="currentColor" />
  </svg>
)

const AvatarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M4.5 16.5a6 6 0 0 1 11 0"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M10 2.5a5.5 5.5 0 0 0-5.5 5.5v3L3 13h14l-1.5-2V8A5.5 5.5 0 0 0 10 2.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 15.5a1.5 1.5 0 0 0 3 0"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

// ── Icon button (48x48, hover bg, Carbon motion) ───────────────────────────────

function IconButton({ onClick, ariaLabel, ariaExpanded, active, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      style={{
        width: 'var(--nav-item-height)',
        height: 'var(--nav-item-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: active ? 'var(--color-accent-bg)' : 'transparent',
        color: active ? 'var(--color-accent)' : 'var(--color-icon-secondary)',
        border: 'none',
        cursor: 'pointer',
        flexShrink: 0,
        transition: `background var(--motion-fast) var(--ease-productive),
                     color var(--motion-fast) var(--ease-productive)`,
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = 'var(--color-hover-01)'
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent'
      }}
    >
      {children}
    </button>
  )
}

// ── TopBar ─────────────────────────────────────────────────────────────────────

export default function TopBar({
  view,
  selectedAsset,
  onNavigate,
  onToggleNotifications,
  notificationsOpen,
  onToggleSidebar,
  isMobile,
}) {
  const hasNotifications = NOTIFICATIONS.length > 0
  const viewLabel = VIEW_LABELS[view] ?? view

  // Determine breadcrumb segments
  const isAssetDetail = (view === 'details' || view === 'inspection') && selectedAsset

  return (
    <header
      role="banner"
      style={{
        height: 'var(--header-height)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border-subtle)',
        flexShrink: 0,
      }}
    >
      {/* ── Left: logo/hamburger + title + breadcrumb ────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>

        {isMobile ? (
          /* Mobile: hamburger menu button */
          <IconButton onClick={onToggleSidebar} ariaLabel="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </IconButton>
        ) : (
          /* Desktop: logo block — same 48px width as sidebar rail */
          <div
            style={{
              width: 'var(--sidebar-rail)',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <LogoIcon />
          </div>
        )}

        {/* APM wordmark — hidden on mobile */}
        {!isMobile && (
          <span
            className="type-card-title"
            style={{ paddingRight: 'var(--spacing-16)', whiteSpace: 'nowrap' }}
          >
            Asset Performance Management
          </span>
        )}

        {/* Vertical divider — hidden on mobile */}
        {!isMobile && (
          <div
            aria-hidden="true"
            style={{
              width: '1px',
              height: '24px',
              background: 'var(--color-border-strong)',
              flexShrink: 0,
              marginRight: 'var(--spacing-16)',
            }}
          />
        )}

        {/* Breadcrumb — hidden on mobile */}
        {!isMobile && <nav aria-label="Breadcrumb">
          <ol
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-8)',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {/* Plant name — always present, always clickable back to overview */}
            <li>
              <button
                className="type-body"
                onClick={() => onNavigate('overview')}
                style={{
                  color: 'var(--color-text-secondary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: `color var(--motion-fast) var(--ease-productive)`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
              >
                {PLANT.name}
              </button>
            </li>

            {/* Current view segment */}
            {view && (
              <>
                <li aria-hidden="true" style={{ color: 'var(--color-text-helper)', display: 'flex' }}>
                  <ChevronRightIcon />
                </li>

                {isAssetDetail ? (
                  // Asset detail: "Plant Overview > Asset Inspection > K-101"
                  <>
                    <li>
                      <button
                        className="type-body"
                        onClick={() => onNavigate(view === 'details' ? 'health' : 'inspection')}
                        style={{
                          color: 'var(--color-text-secondary)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          transition: `color var(--motion-fast) var(--ease-productive)`,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                      >
                        {VIEW_LABELS[view === 'details' ? 'details' : 'inspection']}
                      </button>
                    </li>
                    <li aria-hidden="true" style={{ color: 'var(--color-text-helper)', display: 'flex' }}>
                      <ChevronRightIcon />
                    </li>
                    <li>
                      <span
                        className="type-body"
                        style={{ color: 'var(--color-text-primary)' }}
                        aria-current="page"
                      >
                        {typeof selectedAsset === 'object' ? selectedAsset?.name ?? selectedAsset : selectedAsset}
                      </span>
                    </li>
                  </>
                ) : (
                  <li>
                    <span
                      className="type-body"
                      style={{ color: 'var(--color-text-primary)' }}
                      aria-current="page"
                    >
                      {viewLabel}
                    </span>
                  </li>
                )}
              </>
            )}
          </ol>
        </nav>}
      </div>

      {/* ── Right: icon buttons ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>

        {/* Help — hidden on mobile */}
        {!isMobile && (
          <IconButton ariaLabel="Help">
            <HelpIcon />
          </IconButton>
        )}

        {/* Avatar / User profile — hidden on mobile */}
        {!isMobile && (
          <IconButton ariaLabel="User profile">
            <AvatarIcon />
          </IconButton>
        )}

        {/* Notification bell */}
        <IconButton
          onClick={onToggleNotifications}
          ariaLabel={`Notifications${hasNotifications ? `, ${NOTIFICATIONS.length} alerts` : ''}`}
          ariaExpanded={notificationsOpen}
          active={notificationsOpen}
        >
          <BellIcon />
          {hasNotifications && !notificationsOpen && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--color-error)',
                border: '1.5px solid var(--color-bg)',
              }}
            />
          )}
        </IconButton>
      </div>
    </header>
  )
}
