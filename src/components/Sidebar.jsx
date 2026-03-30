// ── Sidebar ────────────────────────────────────────────────────────────────────
// Desktop: 48px rail, hover to expand 256px overlay.
// Mobile: full-screen drawer with branding header.

import { useState, useEffect, useRef } from 'react'
import { PLANT } from '../data/baytown'
import useFocusTrap from '../hooks/useFocusTrap'

// ── Nav icons (Feather Icons, 24x24 viewBox rendered at 20x20) ──────────────
// Source: https://feathericons.com — stroke-based, consistent weight.

const feather = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

// Plant Overview — Lucide "factory" (same 24x24 stroke conventions as Feather)
const IconPlantOverview = () => (
  <svg {...feather} aria-hidden="true">
    <path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
    <path d="M8 16h.01" />
    <path d="M12 16h.01" />
    <path d="M16 16h.01" />
  </svg>
)

// Events — Feather "list"
const IconEvents = () => (
  <svg {...feather} aria-hidden="true">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
)

// Work Orders — Feather "tool" (wrench)
const IconWorkOrders = () => (
  <svg {...feather} aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

// Investigations — Lucide "file-search" (document with magnifying glass)
const IconInvestigations = () => (
  <svg {...feather} aria-hidden="true">
    <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
    <path d="M14 2v5a1 1 0 0 0 1 1h5" />
    <circle cx="11.5" cy="14.5" r="2.5" />
    <path d="M13.3 16.3 15 18" />
  </svg>
)

// Settings — Feather "settings" (gear)
const IconSettings = () => (
  <svg {...feather} aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

// Chevron for expand/collapse toggle
function ChevronIcon({ expanded }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: `transform var(--motion-moderate) var(--ease-productive)`,
        flexShrink: 0,
      }}
    >
      <path
        d="M6 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── Nav item list ──────────────────────────────────────────────────────────────

// ADR-028: Sidebar shows only plant-level screens.
// Asset-scoped views (Inspection, Fault Tree, Trends) live inside Asset Inspection,
// accessed via Asset Table row click. No dead-end "select an asset" screens.
const NAV_ITEMS = [
  { id: 'overview',        label: 'Plant Overview',   Icon: IconPlantOverview   },
  { id: 'events',          label: 'Events',           Icon: IconEvents          },
  { id: 'workorders',      label: 'Work Orders',      Icon: IconWorkOrders      },
  { id: 'investigations',  label: 'Investigations',   Icon: IconInvestigations  },
]

// ── NavItem ────────────────────────────────────────────────────────────────────

function NavItem({ item, isActive, expanded, onClick }) {
  const { label, Icon } = item

  return (
    <button
      onClick={onClick}
      title={!expanded ? label : undefined}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: 'var(--nav-item-height)',
        paddingLeft: expanded ? 'var(--spacing-16)' : 0,
        paddingRight: expanded ? 'var(--spacing-16)' : 0,
        gap: expanded ? 'var(--spacing-12)' : 0,
        justifyContent: expanded ? 'flex-start' : 'center',
        background: isActive ? 'var(--color-accent-bg)' : 'transparent',
        color: isActive ? 'var(--color-accent)' : 'var(--color-icon-secondary)',
        border: 'none',
        borderLeft: isActive ? '4px solid var(--color-accent)' : '4px solid transparent',
        cursor: 'pointer',
        flexShrink: 0,
        overflow: 'hidden',
        transition: `background var(--motion-fast) var(--ease-productive),
                     color var(--motion-fast) var(--ease-productive),
                     border-color var(--motion-fast) var(--ease-productive)`,
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = 'var(--color-hover-01)'
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = 'transparent'
      }}
    >
      {/* Icon — offset to compensate for border-left on active */}
      <span
        style={{
          display: 'flex',
          flexShrink: 0,
          marginLeft: isActive ? 0 : 0,
        }}
      >
        <Icon />
      </span>

      {/* Label — only when expanded */}
      {expanded && (
        <span
          className="type-body"
          style={{
            color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: isActive ? 600 : 400,
          }}
        >
          {label}
        </span>
      )}
    </button>
  )
}

// ── Sidebar ────────────────────────────────────────────────────────────────────

export default function Sidebar({ view, onNavigate, isMobile, open, onClose }) {
  const [hovered, setHovered] = useState(false)
  const sidebarRef = useRef(null)
  useFocusTrap(sidebarRef, isMobile && open)

  // Escape key closes mobile drawer
  useEffect(() => {
    if (!isMobile || !open) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobile, open, onClose])

  // Desktop: hover-to-expand. Mobile: explicitly toggled drawer.
  const expanded = isMobile ? open : hovered

  const activeView = view

  const handleNav = (id) => {
    onNavigate(id)
  }

  // Mobile: don't render the rail at all when closed
  if (isMobile && !open) return null

  return (
    <>
      <aside
        ref={sidebarRef}
        role="navigation"
        aria-label="Main navigation"
        onMouseEnter={isMobile ? undefined : () => setHovered(true)}
        onMouseLeave={isMobile ? undefined : () => setHovered(false)}
        style={isMobile ? {
          // Mobile: full-screen drawer
          position: 'fixed',
          top: 'var(--header-height)',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          background: 'var(--color-bg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        } : {
          // Desktop: rail + hover overlay
          position: 'fixed',
          top: 'var(--header-height)',
          left: 0,
          bottom: 0,
          zIndex: 9999,
          width: expanded ? 'var(--sidebar-width)' : 'var(--sidebar-rail)',
          background: 'var(--color-bg)',
          borderRight: '1px solid var(--color-border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flexShrink: 0,
          transition: `width var(--motion-moderate) var(--ease-productive)`,
          boxShadow: expanded ? 'var(--shadow-overlay)' : 'none',
        }}
      >
        {/* ── Mobile branding header ─────────────────────────────────────── */}
        {isMobile && (
          <div style={{
            padding: 'var(--spacing-16)',
            borderBottom: '1px solid var(--color-border-subtle)',
            flexShrink: 0,
          }}>
            <span className="type-card-title" style={{ display: 'block' }}>
              Asset Performance Management
            </span>
            <span className="type-meta" style={{ marginTop: 'var(--gap-stack)', display: 'block' }}>
              {PLANT.name}
            </span>
          </div>
        )}

        {/* ── Primary nav items ──────────────────────────────────────────── */}
        <div
          role="list"
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeView === item.id}
              expanded={expanded}
              onClick={() => handleNav(item.id)}
            />
          ))}
        </div>

        {/* ── Separator ──────────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          style={{
            height: '1px',
            background: 'var(--color-border-subtle)',
            flexShrink: 0,
          }}
        />

        {/* ── Bottom section: Settings ───────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <NavItem
            item={{ id: 'settings', label: 'Settings', Icon: IconSettings }}
            isActive={activeView === 'settings'}
            expanded={expanded}
            onClick={() => handleNav('settings')}
          />
        </div>
      </aside>
    </>
  )
}
