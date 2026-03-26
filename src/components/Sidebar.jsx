// ── Sidebar ───────────────────────────────────────────────────────────────────
// Collapsible navigation. Collapsed: 64px icons only. Expanded: 200px icon + label.

import { useState } from 'react'

const NAV_ITEMS = [
  {
    id: 'health',
    label: 'Asset Health',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'details',
    label: 'Asset Details',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="16" height="3.5" rx="1.5" fill="currentColor" opacity="0.5" />
        <rect x="2" y="8.25" width="16" height="3.5" rx="1.5" fill="currentColor" opacity="0.75" />
        <rect x="2" y="14.5" width="16" height="3.5" rx="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'trends',
    label: 'Trends',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline
          points="2,15 6,10 9,12 13,6 18,4"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="14,4 18,4 18,8"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.75" />
    <path
      d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.1 4.1l1.06 1.06M14.84 14.84l1.06 1.06M15.9 4.1l-1.06 1.06M5.16 14.84l-1.06 1.06"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
)

// Chevron pointing right (collapsed state) or left (expanded state)
function ChevronIcon({ expanded }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transition: 'transform 0.2s ease', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <path
        d="M6 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Sidebar({ view, onNavigate }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <aside
      className="flex flex-col bg-[var(--color-bg)] border-r border-[var(--color-border)] shrink-0 h-full py-4"
      role="navigation"
      aria-label="Main navigation"
      style={{
        width: expanded ? '200px' : '64px',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center shrink-0 mb-6 px-3"
        style={{ height: '36px' }}
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-accent-muted)] shrink-0">
          <span
            className="text-[var(--color-accent)] font-semibold leading-none"
            style={{ fontSize: '10px', letterSpacing: '0.04em' }}
          >
            APM
          </span>
        </div>
        {expanded && (
          <span
            className="text-[var(--color-text-secondary)] font-semibold ml-3 whitespace-nowrap"
            style={{ fontSize: '13px' }}
          >
            APM Dashboard
          </span>
        )}
      </div>

      {/* Primary nav items */}
      <nav className="flex flex-col gap-1 w-full px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = view === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={!expanded ? item.label : undefined}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'flex items-center h-10 rounded-[var(--radius-md)] transition-colors duration-150 cursor-pointer',
                expanded ? 'px-3 gap-3 w-full' : 'justify-center w-10',
                isActive
                  ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-secondary)]',
              ].join(' ')}
            >
              <span className="shrink-0">{item.icon}</span>
              {expanded && (
                <span
                  className="whitespace-nowrap overflow-hidden"
                  style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400 }}
                >
                  {item.label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings at bottom */}
      <div className="flex flex-col gap-1 w-full px-2">
        <button
          onClick={() => onNavigate('settings')}
          title={!expanded ? 'Settings' : undefined}
          aria-label="Settings"
          aria-current={view === 'settings' ? 'page' : undefined}
          className={[
            'flex items-center h-10 rounded-[var(--radius-md)] transition-colors duration-150 cursor-pointer',
            expanded ? 'px-3 gap-3 w-full' : 'justify-center w-10',
            view === 'settings'
              ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]'
              : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-secondary)]',
          ].join(' ')}
        >
          <span className="shrink-0"><SettingsIcon /></span>
          {expanded && (
            <span
              className="whitespace-nowrap overflow-hidden"
              style={{ fontSize: '13px', fontWeight: view === 'settings' ? 600 : 400 }}
            >
              Settings
            </span>
          )}
        </button>

        {/* Toggle button */}
        <button
          onClick={() => setExpanded((prev) => !prev)}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          className={[
            'flex items-center justify-center h-10 rounded-[var(--radius-md)] transition-colors duration-150 cursor-pointer',
            expanded ? 'px-3 w-full' : 'w-10',
            'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-secondary)]',
          ].join(' ')}
        >
          <ChevronIcon expanded={expanded} />
        </button>
      </div>
    </aside>
  )
}
