// ── TopBar ─────────────────────────────────────────────────────────────────────
// 48px fixed top bar. Spans full width above the sidebar.
// Props: view, selectedAsset, onNavigate, onToggleNotifications, notificationsOpen, onToggleSidebar

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { PLANT, NOTIFICATIONS } from '../data/baytown.js'
import { useAuth } from '../contexts/AuthContext'

// Maps view ID → human-readable label
const VIEW_LABELS = {
  overview:       'Plant Overview',
  events:         'Events',
  inspection:     'Asset Inspection',
  trends:         'Trends',
  workorders:     'Work Orders',
  investigations: 'Investigations',
  settings:       'Settings',
}

// ── Icons ──────────────────────────────────────────────────────────────────────

const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect width="24" height="24" rx="4" fill="var(--color-accent)" />
    <rect x="5"  y="13" width="4" height="6" fill="var(--color-bg)" />
    <rect x="10" y="9"  width="4" height="10" fill="var(--color-bg)" />
    <rect x="15" y="5"  width="4" height="14" fill="var(--color-bg)" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M4.5 2.5L7.5 6l-3 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7.5 7.5a2.5 2.5 0 0 1 4.9.833C12.4 9.666 10 10.5 10 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="14" r="0.75" fill="currentColor" />
  </svg>
)

const AvatarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4.5 16.5a6 6 0 0 1 11 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 2.5a5.5 5.5 0 0 0-5.5 5.5v3L3 13h14l-1.5-2V8A5.5 5.5 0 0 0 10 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8.5 15.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

// ── Icon button ───────────────────────────────────────────────────────────────

function IconButton({ onClick, ariaLabel, ariaExpanded, active, children }) {
  return (
    <button
      className={`icon-btn${active ? ' icon-btn-active' : ''}`}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
    >
      {children}
    </button>
  )
}

function UserMenu() {
  const { user, supabase } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    function handleEsc(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open])

  async function handleSignOut() {
    setOpen(false)
    await supabase.auth.signOut()
    navigate('/signin', { replace: true })
  }

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <IconButton
        onClick={() => setOpen((p) => !p)}
        ariaLabel="User menu"
        ariaExpanded={open}
        active={open}
      >
        <AvatarIcon />
      </IconButton>
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            right: 0,
            minWidth: 200,
            maxWidth: 360,
            background: 'var(--color-layer-01)',
            border: '1px solid var(--color-border-subtle, #3e3e3e)',
            borderRadius: 8,
            boxShadow: 'var(--shadow-overlay)',
            padding: 'var(--spacing-8)',
            zIndex: 100,
            whiteSpace: 'nowrap',
          }}
        >
          <div
            className="type-meta"
            style={{
              padding: '6px 10px',
              color: 'var(--color-text-helper)',
              borderBottom: '1px solid var(--color-border-subtle, #3e3e3e)',
              marginBottom: 'var(--spacing-4)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user?.email || 'Signed in'}
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '8px 10px',
              background: 'transparent',
              color: 'var(--color-text-primary)',
              border: 'none',
              borderRadius: 4,
              fontSize: 13,
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-hover-01)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

// ── Density toggle ────────────────────────────────────────────────────────────

const GridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
)

const ListIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
)

function DensityToggle({ dense, onToggle }) {
  return (
    <div className="segmented-control" role="radiogroup" aria-label="View density">
      <button
        role="radio"
        aria-checked={!dense}
        aria-label="Comfortable view"
        onClick={() => dense && onToggle()}
        className={!dense ? 'active' : ''}
        style={{ width: 36, height: 32 }}
      >
        <GridIcon />
      </button>
      <button
        role="radio"
        aria-checked={dense}
        aria-label="Compact view"
        onClick={() => !dense && onToggle()}
        className={dense ? 'active' : ''}
        style={{ width: 36, height: 32 }}
      >
        <ListIcon />
      </button>
    </div>
  )
}

// ── TopBar ─────────────────────────────────────────────────────────────────────

export default function TopBar({
  view, selectedAsset, onNavigate, onToggleNotifications, notificationsOpen,
  onToggleHelp, helpOpen, onToggleSidebar, isMobile, dense, onToggleDense,
}) {
  const hasNotifications = NOTIFICATIONS.length > 0
  const viewLabel = VIEW_LABELS[view] ?? view
  const isAssetDetail = view === 'inspection' && selectedAsset

  return (
    <header
      role="banner"
      className="fixed top-0 left-0 right-0 flex items-center justify-between shrink-0 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg)]"
      style={{ height: 'var(--header-height)', zIndex: 10000 }}
    >
      {/* Left: logo/hamburger + title + breadcrumb */}
      <div className="flex items-center h-full">
        {isMobile ? (
          <IconButton onClick={onToggleSidebar} ariaLabel="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </IconButton>
        ) : (
          <div className="flex items-center justify-center shrink-0 h-full" style={{ width: 'var(--sidebar-rail)' }}>
            <LogoIcon />
          </div>
        )}

        {!isMobile && (
          <span className="type-card-title pr-16 whitespace-nowrap">
            Asset Performance Management
          </span>
        )}

        {!isMobile && <span className="divider-v mr-16" style={{ height: 24 }} />}

        {!isMobile && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-16">
            <ol className="flex items-center gap-8 list-none m-0 p-0">
              <li>
                <button className="breadcrumb-link type-body" onClick={() => onNavigate('overview')}>
                  {PLANT.name}
                </button>
              </li>

              {view && (
                <>
                  <li aria-hidden="true" className="flex text-[var(--color-text-helper)]"><ChevronRightIcon /></li>

                  {isAssetDetail ? (
                    <>
                      <li>
                        <button className="breadcrumb-link type-body" onClick={() => onNavigate('overview')}>
                          {VIEW_LABELS['inspection']}
                        </button>
                      </li>
                      <li aria-hidden="true" className="flex text-[var(--color-text-helper)]"><ChevronRightIcon /></li>
                      <li>
                        <span className="type-body" aria-current="page">
                          {typeof selectedAsset === 'object' ? selectedAsset?.name ?? selectedAsset : selectedAsset}
                        </span>
                      </li>
                    </>
                  ) : (
                    <li><span className="type-body" aria-current="page">{viewLabel}</span></li>
                  )}
                </>
              )}
            </ol>
          </nav>
        )}
      </div>

      {/* Right: icon buttons */}
      <div className="flex items-center h-full">
        <div className="flex items-center px-4">
          <DensityToggle dense={dense} onToggle={onToggleDense} />
        </div>

        {!isMobile && (
          <IconButton onClick={onToggleHelp} ariaLabel="Help" ariaExpanded={helpOpen} active={helpOpen}>
            <HelpIcon />
          </IconButton>
        )}

        {!isMobile && <UserMenu />}

        <IconButton
          onClick={onToggleNotifications}
          ariaLabel={`Notifications${hasNotifications ? `, ${NOTIFICATIONS.length} alerts` : ''}`}
          ariaExpanded={notificationsOpen}
          active={notificationsOpen}
        >
          <BellIcon />
          {hasNotifications && !notificationsOpen && (
            <span
              className="absolute rounded-full bg-[var(--color-error)]"
              aria-hidden="true"
              style={{ top: 10, right: 10, width: 7, height: 7, border: '1.5px solid var(--color-bg)' }}
            />
          )}
        </IconButton>
      </div>
    </header>
  )
}
