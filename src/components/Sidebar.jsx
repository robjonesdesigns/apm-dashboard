// ── Sidebar ────────────────────────────────────────────────────────────────────
// Fixed left sidebar. Rail: 48px icons only. Expanded: 256px icons + labels.
// Props: view, onNavigate, expanded, onToggle

// ── Nav icons (20x20 inline SVG) ──────────────────────────────────────────────

// 1. Plant Overview — factory building with chimney
const IconPlantOverview = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    {/* Main building */}
    <rect x="3" y="9" width="14" height="9" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    {/* Chimney left */}
    <rect x="5" y="5" width="3" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    {/* Chimney right */}
    <rect x="12" y="3" width="3" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    {/* Door */}
    <rect x="8.5" y="13" width="3" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.25" />
  </svg>
)

// 2. Asset Inspection — gear
const IconAssetInspection = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="2.75" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 2.5v1.75M10 15.75V17.5M2.5 10h1.75M15.75 10H17.5M4.7 4.7l1.24 1.24M14.06 14.06l1.24 1.24M15.3 4.7l-1.24 1.24M5.94 14.06l-1.24 1.24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

// 3. Root Cause — branching node tree
const IconRootCause = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    {/* Root node */}
    <circle cx="10" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
    {/* Left child */}
    <circle cx="4"  cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
    {/* Right child */}
    <circle cx="16" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
    {/* Connecting lines */}
    <path d="M10 6v2.5L4 12M10 6v2.5L16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// 4. Trends — trending line chart (up and to the right)
const IconTrends = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <polyline
      points="2,15 6,10 9.5,12.5 14,6 18,4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Arrow tip */}
    <polyline
      points="14,4 18,4 18,8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// 5. Work Orders — checklist with checkbox marks
const IconWorkOrders = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    {/* Page outline */}
    <rect x="3" y="2" width="14" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
    {/* Checkbox row 1 */}
    <rect x="6" y="6" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.25" />
    <line x1="11" y1="7.5" x2="15" y2="7.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    {/* Checkbox row 2 — checked */}
    <rect x="6" y="11" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.25" />
    <path d="M6.75 12.5l0.75 0.75 1.5-1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="11" y1="12.5" x2="15" y2="12.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
)

// 6. Investigations — briefcase
const IconInvestigations = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    {/* Case body */}
    <rect x="2" y="7" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    {/* Handle */}
    <path
      d="M7 7V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 13 5.5V7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Center clasp line */}
    <line x1="2" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1.25" />
  </svg>
)

// Settings — gear (for bottom section)
const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="2.75" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 2.5v1.75M10 15.75V17.5M2.5 10h1.75M15.75 10H17.5M4.7 4.7l1.24 1.24M14.06 14.06l1.24 1.24M15.3 4.7l-1.24 1.24M5.94 14.06l-1.24 1.24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
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

const NAV_ITEMS = [
  { id: 'overview',        label: 'Plant Overview',   Icon: IconPlantOverview   },
  { id: 'inspection',      label: 'Asset Inspection', Icon: IconAssetInspection },
  { id: 'rootcause',       label: 'Root Cause',       Icon: IconRootCause       },
  { id: 'trends',          label: 'Trends',           Icon: IconTrends          },
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

export default function Sidebar({ view, onNavigate, expanded, onToggle }) {
  // Normalize legacy view IDs (App.jsx uses 'health'/'details')
  const normalizeView = (v) => {
    if (v === 'health')   return 'overview'
    if (v === 'details')  return 'inspection'
    return v
  }
  const activeView = normalizeView(view)

  // Resolve nav click — translate back to whatever ID App.jsx expects
  const handleNav = (id) => {
    // Pass through directly; App.jsx will need to support new IDs as screens are added
    onNavigate(id)
  }

  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      style={{
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
      }}
    >
      {/* ── Primary nav items ────────────────────────────────────────────── */}
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

      {/* ── Separator ────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          height: '1px',
          background: 'var(--color-border-subtle)',
          flexShrink: 0,
          margin: '0 0',
        }}
      />

      {/* ── Bottom section: Settings + Toggle ────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

        {/* Settings */}
        <NavItem
          item={{ id: 'settings', label: 'Settings', Icon: IconSettings }}
          isActive={activeView === 'settings'}
          expanded={expanded}
          onClick={() => handleNav('settings')}
        />

        {/* Expand / Collapse toggle */}
        <button
          onClick={onToggle}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          title={expanded ? 'Collapse' : 'Expand'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: expanded ? 'flex-end' : 'center',
            width: '100%',
            height: 'var(--nav-item-height)',
            paddingLeft: expanded ? 'var(--spacing-16)' : 0,
            paddingRight: expanded ? 'var(--spacing-16)' : 0,
            background: 'transparent',
            color: 'var(--color-icon-secondary)',
            border: 'none',
            borderLeft: '4px solid transparent',
            cursor: 'pointer',
            flexShrink: 0,
            transition: `background var(--motion-fast) var(--ease-productive),
                         color var(--motion-fast) var(--ease-productive)`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-hover-01)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <ChevronIcon expanded={expanded} />
        </button>
      </div>
    </aside>
  )
}
