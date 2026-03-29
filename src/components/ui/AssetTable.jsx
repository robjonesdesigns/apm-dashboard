import { useState, useRef, useEffect } from 'react'
import { ASSETS, WORK_ORDERS, CASES } from '../../data/assets'
import CriticalityIndicator from './CriticalityIndicator'
import FilterChip from './FilterChip'
import FilterButton from './FilterButton'

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

const COL_DIVIDER = '1px solid var(--color-border-divider)'
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
      data-row
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


// ── Search icon ─────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11l3.5 3.5" />
    </svg>
  )
}

// ── Asset search with autocomplete ──────────────────────────────────────────

function AssetSearch({ value, onChange, onAssetClick }) {
  const [focused, setFocused] = useState(false)
  const [highlightIdx, setHighlightIdx] = useState(-1)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const query = value.toLowerCase()
  const suggestions = query.length > 0
    ? ASSETS.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.id.toLowerCase().includes(query) ||
        a.type.toLowerCase().includes(query)
      ).slice(0, 8)
    : []

  const showDropdown = focused && suggestions.length > 0

  function handleSelect(asset) {
    onChange('')
    onAssetClick?.(asset)
    inputRef.current?.blur()
  }

  function handleKeyDown(e) {
    if (!showDropdown) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIdx(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIdx(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      setFocused(false)
    } else if (e.key === 'Escape') {
      inputRef.current?.blur()
    }
  }

  // Reset highlight when suggestions change
  useEffect(() => { setHighlightIdx(-1) }, [value])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (listRef.current && !listRef.current.contains(e.target) && e.target !== inputRef.current) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute',
          left: 'var(--spacing-8)',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-helper)',
          pointerEvents: 'none',
          display: 'flex',
        }}>
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search assets..."
          style={{
            background: 'var(--color-layer-02)',
            border: `1px solid ${focused ? 'var(--color-border-interactive)' : 'var(--color-border-subtle)'}`,
            borderRadius: 'var(--radius-4)',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--text-12)',
            padding: '0 var(--spacing-12) 0 var(--spacing-32)',
            height: 32,
            width: 220,
            outline: 'none',
            transition: 'border-color var(--motion-fast) var(--ease-productive)',
          }}
        />
      </div>
      {showDropdown && (
        <div
          ref={listRef}
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: 'var(--color-layer-01)',
            border: '1px solid var(--color-border-strong)',
            borderRadius: 'var(--radius-8)',
            boxShadow: 'var(--shadow-tooltip)',
            zIndex: 20,
            overflow: 'hidden',
            animation: 'fadeInOnly var(--motion-fast) var(--ease-productive)',
          }}
        >
          {suggestions.map((asset, i) => {
            const isHighlighted = i === highlightIdx
            return (
              <div
                key={asset.id}
                role="option"
                aria-selected={isHighlighted}
                onMouseEnter={() => setHighlightIdx(i)}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(asset) }}
                style={{
                  padding: 'var(--spacing-8) var(--spacing-12)',
                  cursor: 'pointer',
                  background: isHighlighted ? 'var(--color-accent-bg)' : 'transparent',
                  borderLeft: isHighlighted ? '2px solid var(--color-accent)' : '2px solid transparent',
                  transition: 'background var(--motion-fast) var(--ease-productive)',
                }}
              >
                <div className="type-body" style={{ color: 'var(--color-accent)' }}>{asset.name}</div>
                <div className="type-meta">{asset.id} -- {asset.type}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── AssetTable ──────────────────────────────────────────────────────────────

const ALARM_LABELS = {
  confirmed: 'Confirmed Events',
  falsePositives: 'False Positives',
  newEvents: 'New Events',
}

export default function AssetTable({ onAssetClick, riskFilter, alarmFilter, actorFilter, onClearRiskFilter, onClearAlarmFilter, onClearActorFilter, onClearAllFilters }) {
  const [filters, setFilters] = useState({ criticality: [], status: [], processUnit: [] })
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(0)
  const [rowHeight, setRowHeight] = useState(0)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const rowsRef = useRef(null)
  const scrollRef = useRef(null)
  const rowsPerPage = 10

  // Check if table overflows and show/hide scroll hint
  function handleScroll() {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowScrollHint(scrollLeft < scrollWidth - clientWidth - 8)
  }

  useEffect(() => {
    if (!scrollRef.current) return
    const { scrollWidth, clientWidth } = scrollRef.current
    setShowScrollHint(scrollWidth > clientWidth + 8)
  })

  // Measure actual row height on first render
  useEffect(() => {
    if (rowsRef.current && rowHeight === 0) {
      const firstRow = rowsRef.current.querySelector('[data-row]')
      if (firstRow) setRowHeight(firstRow.getBoundingClientRect().height)
    }
  })

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
    setPage(0)
    setFilters(prev => {
      const arr = prev[category]
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
      return { ...prev, [category]: next }
    })
  }

  function removeFilter(category, value) {
    setPage(0)
    setFilters(prev => ({ ...prev, [category]: prev[category].filter(v => v !== value) }))
  }

  const filteredAssets = ASSETS.filter(a => {
    // Event Triage filter (from Risk Matrix click)
    if (riskFilter) {
      if (a.criticality !== riskFilter.criticality) return false
      if (riskFilter.status === 'New' && a.newEvents <= 0) return false
      if (riskFilter.status === 'In Progress' && a.inProgressEvents <= 0) return false
    }
    // Alarm Quality filter (from donut segment click)
    if (alarmFilter) {
      if (alarmFilter === 'confirmed' && a.activeEvents <= 0) return false
      if (alarmFilter === 'falsePositives' && a.repetitiveEvents <= 0) return false
      if (alarmFilter === 'newEvents' && a.newEvents <= 0) return false
    }
    // Bad Actors filter (from bar row click)
    if (actorFilter) {
      if (a.id !== actorFilter) return false
    }
    // Toolbar filters (multi-select: asset must match ANY checked value in each active category)
    if (filters.criticality.length && !filters.criticality.includes(a.criticality)) return false
    if (filters.status.length && !filters.status.includes(a.status)) return false
    if (filters.processUnit.length && !filters.processUnit.includes(a.processUnit)) return false
    if (searchLower && !a.name.toLowerCase().includes(searchLower) && !a.id.toLowerCase().includes(searchLower) && !a.type.toLowerCase().includes(searchLower)) return false
    return true
  })

  const sortedAssets = sortAssets(filteredAssets, sortKey, sortDir)
  const totalRows = sortedAssets.length
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage))
  const safePage = Math.min(page, totalPages - 1)
  const startIdx = safePage * rowsPerPage
  const pageAssets = sortedAssets.slice(startIdx, startIdx + rowsPerPage)

  const activeChipCount = filters.criticality.length + filters.status.length + filters.processUnit.length
  const hasAnyFilter = riskFilter || alarmFilter || actorFilter || activeChipCount > 0 || search

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
              <>
                <FilterChip
                  label={CRIT_LABELS[riskFilter.criticality] || riskFilter.criticality}
                  onClear={onClearRiskFilter}
                />
                <FilterChip
                  label={riskFilter.status}
                  onClear={onClearRiskFilter}
                />
              </>
            )}
            {alarmFilter && (
              <FilterChip
                label={ALARM_LABELS[alarmFilter] || alarmFilter}
                onClear={onClearAlarmFilter}
              />
            )}
            {actorFilter && (
              <FilterChip
                label={ASSETS.find(a => a.id === actorFilter)?.name || actorFilter}
                onClear={onClearActorFilter}
              />
            )}
            {FILTER_CATEGORIES.map(cat =>
              filters[cat.key].map(val => (
                <FilterChip key={`${cat.key}-${val}`} label={cat.labelFn(val)} onClear={() => removeFilter(cat.key, val)} />
              ))
            )}
            {/* Clear all -- show when 2+ filter sources are active */}
            {[riskFilter, alarmFilter, actorFilter].filter(Boolean).length + activeChipCount >= 2 && (
              <button
                onClick={() => {
                  onClearAllFilters?.()
                  setFilters({ criticality: [], status: [], processUnit: [] })
                  setSearch('')
                  setPage(0)
                }}
                className="type-link"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  font: 'inherit',
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Right: search + filter button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', flexShrink: 0 }}>
            <AssetSearch
              value={search}
              onChange={val => { setSearch(val); setPage(0) }}
              onAssetClick={onAssetClick}
            />
            <FilterButton
              categories={FILTER_CATEGORIES}
              filters={filters}
              onToggle={toggleFilter}
            />
          </div>
        </div>

        {/* Table area — horizontal scroll within card padding */}
        <div style={{ position: 'relative' }}>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
        >
          {/* Fixed header */}
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
              width:           'max-content',
              minWidth:        '100%',
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

          {/* Rows — paginated, always 10 row slots */}
          <div ref={rowsRef} style={{ width: 'max-content', minWidth: '100%', minHeight: rowHeight > 0 ? rowHeight * rowsPerPage : undefined }}>
            {pageAssets.map(asset => (
              <AssetRow
                key={asset.id}
                asset={asset}
                onAssetClick={onAssetClick}
              />
            ))}
            {totalRows === 0 && (
              <div style={{ padding: 'var(--spacing-32) var(--spacing-16)', textAlign: 'center' }}>
                <span className="type-meta">No assets match the current filters</span>
              </div>
            )}
          </div>
        </div>
        {/* Scroll fade hint — visible when table overflows right */}
        {showScrollHint && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: 48,
              background: 'linear-gradient(to right, transparent, var(--color-layer-01))',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        )}
        </div>

        {/* Pagination */}
        {totalRows > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 'var(--spacing-12)',
            marginTop: 'var(--spacing-4)',
          }}>
            <span className="type-meta">
              {startIdx + 1}--{Math.min(startIdx + rowsPerPage, totalRows)} of {totalRows} assets
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={safePage === 0}
                aria-label="Previous page"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-4)',
                  border: '1px solid var(--color-border-subtle)',
                  background: 'var(--color-layer-02)',
                  color: safePage === 0 ? 'var(--color-text-disabled)' : 'var(--color-text-secondary)',
                  cursor: safePage === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all var(--motion-fast) var(--ease-productive)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 4L6 8l4 4" />
                </svg>
              </button>
              <span className="type-body" style={{ fontVariantNumeric: 'tabular-nums', minWidth: 48, textAlign: 'center' }}>
                {safePage + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={safePage >= totalPages - 1}
                aria-label="Next page"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-4)',
                  border: '1px solid var(--color-border-subtle)',
                  background: 'var(--color-layer-02)',
                  color: safePage >= totalPages - 1 ? 'var(--color-text-disabled)' : 'var(--color-text-secondary)',
                  cursor: safePage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                  transition: 'all var(--motion-fast) var(--ease-productive)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
