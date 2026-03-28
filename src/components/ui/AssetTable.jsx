import { useState, useRef, useEffect } from 'react'
import { ASSETS, WORK_ORDERS, CASES } from '../../data/assets'
import CriticalityIndicator from './CriticalityIndicator'
import FilterChip from './FilterChip'

// Status dot variant from asset status
function statusDotVariant(status) {
  if (status === 'tripped')        return 'status-dot dot-tripped'
  if (status === 'degraded')       return 'status-dot dot-degraded'
  if (status === 'planned-outage') return 'status-dot dot-planned-outage'
  return 'status-dot dot-running'
}

function statusLabel(status) {
  if (status === 'tripped')        return 'Tripped'
  if (status === 'degraded')       return 'Degraded'
  if (status === 'planned-outage') return 'Planned'
  return 'Running'
}

// ── Derived per-asset counts (single source of truth) ───────────────────────

const woCountByAsset = {}
WORK_ORDERS.forEach(wo => { woCountByAsset[wo.assetId] = (woCountByAsset[wo.assetId] || 0) + 1 })

const invCountByAsset = {}
CASES.forEach(c => { invCountByAsset[c.assetId] = (invCountByAsset[c.assetId] || 0) + 1 })

const COL_DIVIDER = '1px solid rgba(57, 57, 57, 0.5)'
const cellBase = {
  flexShrink: 0,
  flexGrow: 0,
  padding: '0 var(--spacing-16)',
  borderRight: COL_DIVIDER,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
}
const cellNum = { ...cellBase, justifyContent: 'flex-end', fontVariantNumeric: 'tabular-nums' }

const COL_STYLES = {
  status:     { ...cellBase, minWidth: 120, width: 120 },
  asset:      { ...cellBase, minWidth: 200, flex: '1 1 200px' },
  priority:   { ...cellBase, minWidth: 148, width: 148 },
  oee:        { ...cellNum,  minWidth: 96,  width: 96 },
  events:     { ...cellNum,  minWidth: 100, width: 100 },
  downtime:   { ...cellNum,  minWidth: 112, width: 112 },
  workOrders: { ...cellNum,  minWidth: 140, width: 140 },
  invs:       { ...cellNum,  minWidth: 148, width: 148 },
  rul:        { ...cellNum,  minWidth: 152, width: 152, borderRight: 'none' },
}

const ROW_STYLE = {
  display:       'flex',
  alignItems:    'center',
  gap:           0,
  padding:       'var(--spacing-12) var(--spacing-12)',
  cursor:        'pointer',
  transition:    'all var(--motion-fast) var(--ease-productive)',
  borderBottom:  '1px solid var(--color-border-subtle)',
  borderLeft:    '2px solid transparent',
}

function AssetRow({ asset, onAssetClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={() => onAssetClick && onAssetClick(asset)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...ROW_STYLE,
        background:  hovered ? 'var(--color-hover-01)' : 'transparent',
        borderLeft:  hovered ? '2px solid var(--color-accent)' : '2px solid transparent',
      }}
    >
      {/* Status */}
      <div style={{ ...COL_STYLES.status, display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
        <span className={statusDotVariant(asset.status)} />
        <span className="type-body">{statusLabel(asset.status)}</span>
      </div>

      {/* Asset name + type */}
      <div style={{ ...COL_STYLES.asset, flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        <div
          className="type-body"
          style={{
            color: 'var(--color-accent)',
          }}
        >
          {asset.name}
        </div>
        <div className="type-meta">{asset.type}</div>
      </div>

      {/* Criticality */}
      <div style={COL_STYLES.priority}>
        <CriticalityIndicator level={asset.criticality} />
      </div>

      {/* OEE */}
      <div className="type-body" style={COL_STYLES.oee}>
        {asset.oee}%
      </div>

      {/* Events */}
      <div className="type-body" style={COL_STYLES.events}>
        {asset.activeEvents}
      </div>

      {/* Downtime */}
      <div className="type-body" style={COL_STYLES.downtime}>
        {asset.downtime}
      </div>

      {/* Work Orders (derived from WORK_ORDERS) */}
      <div className="type-body" style={COL_STYLES.workOrders}>
        {woCountByAsset[asset.id] || 0}
      </div>

      {/* Investigations (derived from CASES) */}
      <div className="type-body" style={COL_STYLES.invs}>
        {invCountByAsset[asset.id] || 0}
      </div>

      {/* RUL */}
      <div className="type-body" style={COL_STYLES.rul}>
        {asset.rul}
      </div>
    </div>
  )
}

// ── Filter infrastructure ───────────────────────────────────────────────────

const CRIT_LABELS = { A: 'A (Safety)', B: 'B (Production)', C: 'C (Support)' }
const CRIT_OPTIONS = ['A', 'B', 'C']
const STATUS_OPTIONS = ['tripped', 'degraded', 'planned-outage', 'running']
const UNIT_OPTIONS = [...new Set(ASSETS.map(a => a.processUnit))].sort()

const FILTER_CATEGORIES = [
  { key: 'criticality', label: 'Criticality', options: CRIT_OPTIONS, labelFn: v => CRIT_LABELS[v] || v },
  { key: 'status',      label: 'Status',      options: STATUS_OPTIONS, labelFn: statusLabel },
  { key: 'processUnit', label: 'Process Unit', options: UNIT_OPTIONS, labelFn: v => v },
]

// ── Sort helpers ────────────────────────────────────────────────────────────

const STATUS_SORT_ORDER = { tripped: 0, degraded: 1, 'planned-outage': 2, running: 3 }
const CRIT_SORT_ORDER = { A: 0, B: 1, C: 2, D: 3 }

function parseDowntime(val) {
  if (!val) return 0
  return parseFloat(val) || 0
}

function parseRul(val) {
  if (!val) return Infinity
  return parseFloat(val) || Infinity
}

function getSortValue(asset, key) {
  switch (key) {
    case 'status':      return STATUS_SORT_ORDER[asset.status] ?? 99
    case 'name':        return asset.name.toLowerCase()
    case 'criticality': return CRIT_SORT_ORDER[asset.criticality] ?? 99
    case 'oee':         return asset.oee
    case 'events':      return asset.activeEvents
    case 'downtime':    return parseDowntime(asset.downtime)
    case 'workOrders':  return woCountByAsset[asset.id] || 0
    case 'investigations': return invCountByAsset[asset.id] || 0
    case 'rul':         return parseRul(asset.rul)
    default:            return 0
  }
}

function sortAssets(assets, sortKey, sortDir) {
  if (!sortKey) return assets
  return [...assets].sort((a, b) => {
    const aVal = getSortValue(a, sortKey)
    const bVal = getSortValue(b, sortKey)
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
    return 0
  })
}

function SortIndicator({ isActive, direction }) {
  const activeUp = isActive && direction === 'asc'
  const activeDown = isActive && direction === 'desc'

  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 0, marginLeft: 2, gap: 1 }}>
      <svg width="8" height="5" viewBox="0 0 8 5" style={{ opacity: activeUp ? 1 : 0.3 }}>
        <path d="M4 0L8 5H0z" fill={activeUp ? 'var(--color-accent)' : 'var(--color-text-helper)'} />
      </svg>
      <svg width="8" height="5" viewBox="0 0 8 5" style={{ opacity: activeDown ? 1 : 0.3 }}>
        <path d="M4 5L0 0h8z" fill={activeDown ? 'var(--color-accent)' : 'var(--color-text-helper)'} />
      </svg>
    </span>
  )
}

function SortableHeader({ label, sortKey, activeSort, activeDir, onSort, style }) {
  const isActive = activeSort === sortKey
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="type-table-header"
      onClick={() => onSort(sortKey)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...style,
        cursor: 'pointer',
        userSelect: 'none',
        gap: 2,
        whiteSpace: 'nowrap',
        color: isActive ? 'var(--color-accent)' : hovered ? 'var(--color-text-primary)' : undefined,
        transition: 'color var(--motion-fast) var(--ease-productive)',
      }}
    >
      {label}
      <SortIndicator isActive={isActive} direction={activeDir} />
    </div>
  )
}

// ── Filter dropdown panel ───────────────────────────────────────────────────

function FilterDropdown({ filters, onToggle, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 4,
        width: 240,
        background: 'var(--color-layer-01)',
        border: '1px solid var(--color-border-strong)',
        borderRadius: 'var(--radius-8)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        zIndex: 20,
        padding: 'var(--spacing-8) 0',
        animation: 'fadeInOnly var(--motion-fast) var(--ease-productive)',
      }}
    >
      {FILTER_CATEGORIES.map(cat => (
        <div key={cat.key} style={{ padding: 'var(--spacing-8) var(--spacing-16)' }}>
          <span className="type-label" style={{ color: 'var(--color-text-helper)', marginBottom: 4, display: 'block' }}>
            {cat.label}
          </span>
          {cat.options.map(opt => {
            const isChecked = filters[cat.key]?.includes(opt) || false
            return (
              <label
                key={opt}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-8)',
                  padding: '4px 0',
                  cursor: 'pointer',
                  fontSize: 'var(--text-12)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(cat.key, opt)}
                  style={{ accentColor: 'var(--color-accent)' }}
                />
                {cat.labelFn(opt)}
              </label>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ── Filter icon (funnel SVG) ────────────────────────────────────────────────

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 2h13l-5 6v4.5l-3 1.5V8z" />
    </svg>
  )
}

// ── AssetTable ──────────────────────────────────────────────────────────────

export default function AssetTable({ onAssetClick, riskFilter, onClearFilter }) {
  const [filters, setFilters] = useState({ criticality: [], status: [], processUnit: [] })
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const searchLower = search.toLowerCase()

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function toggleFilter(category, value) {
    setFilters(prev => {
      const arr = prev[category]
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
      return { ...prev, [category]: next }
    })
  }

  function removeFilter(category, value) {
    setFilters(prev => ({ ...prev, [category]: prev[category].filter(v => v !== value) }))
  }

  const filteredAssets = ASSETS.filter(a => {
    // Event Triage filter (from Risk Matrix click)
    if (riskFilter) {
      if (a.criticality !== riskFilter.criticality) return false
      if (riskFilter.status === 'New' && a.newEvents <= 0) return false
      if (riskFilter.status === 'In Progress' && a.inProgressEvents <= 0) return false
    }
    // Toolbar filters (multi-select: asset must match ANY checked value in each active category)
    if (filters.criticality.length && !filters.criticality.includes(a.criticality)) return false
    if (filters.status.length && !filters.status.includes(a.status)) return false
    if (filters.processUnit.length && !filters.processUnit.includes(a.processUnit)) return false
    if (searchLower && !a.name.toLowerCase().includes(searchLower) && !a.id.toLowerCase().includes(searchLower)) return false
    return true
  })

  const sortedAssets = sortAssets(filteredAssets, sortKey, sortDir)
  const activeChipCount = filters.criticality.length + filters.status.length + filters.processUnit.length
  const hasAnyFilter = riskFilter || activeChipCount > 0 || search

  return (
    <div className="grid-12">
      <div className="card col-full">
        {/* Card header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 'var(--spacing-12)', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <span className="type-card-title">All Assets</span>
          {hasAnyFilter && (
            <span className="type-label" style={{ color: 'var(--color-text-helper)' }}>
              {filteredAssets.length} of {ASSETS.length} assets
            </span>
          )}
        </div>

        {/* Toolbar: chips left, search + filter button right */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--spacing-12)',
          padding: 'var(--spacing-12) 0',
        }}>
          {/* Left: active filter chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', flexWrap: 'wrap', flex: 1, minHeight: 28 }}>
            {riskFilter && (
              <FilterChip
                label={`${CRIT_LABELS[riskFilter.criticality] || riskFilter.criticality} / ${riskFilter.status}`}
                onClear={onClearFilter}
              />
            )}
            {FILTER_CATEGORIES.map(cat =>
              filters[cat.key].map(val => (
                <FilterChip key={`${cat.key}-${val}`} label={cat.labelFn(val)} onClear={() => removeFilter(cat.key, val)} />
              ))
            )}
          </div>

          {/* Right: search + filter button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', flexShrink: 0 }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search assets..."
              style={{
                background: 'var(--color-layer-02)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-4)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--text-12)',
                padding: '0 var(--spacing-12)',
                height: 32,
                width: 200,
              }}
            />
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                aria-label="Filter assets"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-4)',
                  padding: '0 var(--spacing-12)',
                  height: 32,
                  borderRadius: 'var(--radius-4)',
                  border: `1px solid ${activeChipCount > 0 ? 'var(--color-accent)' : 'var(--color-border-subtle)'}`,
                  background: activeChipCount > 0 ? 'var(--color-accent-bg)' : 'var(--color-layer-02)',
                  color: activeChipCount > 0 ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  fontSize: 'var(--text-12)',
                  cursor: 'pointer',
                  transition: 'all var(--motion-fast) var(--ease-productive)',
                }}
              >
                <FilterIcon />
                <span>Filter</span>
                {activeChipCount > 0 && (
                  <span style={{
                    background: 'var(--color-accent)',
                    color: 'var(--color-text-inverse)',
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 600,
                  }}>
                    {activeChipCount}
                  </span>
                )}
              </button>
              {dropdownOpen && (
                <FilterDropdown
                  filters={filters}
                  onToggle={toggleFilter}
                  onClose={() => setDropdownOpen(false)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Scrollable table area — pull to card edges with negative margin */}
        <div style={{ overflowX: 'auto', margin: '0 calc(-1 * var(--spacing-24))' }}>
          {/* Sticky header */}
          <div
            style={{
              display:         'flex',
              alignItems:      'center',
              gap:             0,
              padding:         'var(--spacing-8) var(--spacing-12)',
              background:      'var(--color-layer-02)',
              borderTop:       '1px solid var(--color-border-subtle)',
              borderBottom:    '1px solid var(--color-border-subtle)',
              borderLeft:      '2px solid transparent',
              position:        'sticky',
              top:             0,
              zIndex:          1,
              minWidth:        700,
            }}
          >
            <SortableHeader label="Status"         sortKey="status"           activeSort={sortKey} activeDir={sortDir} onSort={handleSort} style={COL_STYLES.status} />
            <SortableHeader label="Asset"          sortKey="name"             activeSort={sortKey} activeDir={sortDir} onSort={handleSort} style={COL_STYLES.asset} />
            <SortableHeader label="Criticality"    sortKey="criticality"      activeSort={sortKey} activeDir={sortDir} onSort={handleSort} style={COL_STYLES.priority} />
            <SortableHeader label="OEE"            sortKey="oee"              activeSort={sortKey} activeDir={sortDir} onSort={handleSort} style={COL_STYLES.oee} />
            <SortableHeader label="Events"         sortKey="events"           activeSort={sortKey} activeDir={sortDir} onSort={handleSort} style={COL_STYLES.events} />
            <SortableHeader label="Downtime"       sortKey="downtime"         activeSort={sortKey} activeDir={sortDir} onSort={handleSort} style={COL_STYLES.downtime} />
            <SortableHeader label="Work Orders"    sortKey="workOrders"       activeSort={sortKey} activeDir={sortDir} onSort={handleSort} style={COL_STYLES.workOrders} />
            <SortableHeader label="Investigations" sortKey="investigations"   activeSort={sortKey} activeDir={sortDir} onSort={handleSort} style={COL_STYLES.invs} />
            <SortableHeader label="Remaining Life" sortKey="rul"              activeSort={sortKey} activeDir={sortDir} onSort={handleSort} style={COL_STYLES.rul} />
          </div>

          {/* Rows */}
          <div style={{ minWidth: 700 }}>
            {sortedAssets.map(asset => (
              <AssetRow
                key={asset.id}
                asset={asset}
                onAssetClick={onAssetClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
