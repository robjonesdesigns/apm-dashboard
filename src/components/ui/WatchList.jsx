// ── Watch List ────────────────────────────────────────────────────────────────
// Pure React horizontal bar chart. No Recharts dependency.
// Assets with recurring events over 30 days, ranked by count.
// Bars color-coded by asset criticality (A=red, B=amber, C=blue).
// Cursor-following tooltip matches dashboard pattern.

import { useState, useRef, useCallback } from 'react'
import { BAD_ACTORS } from '../../data/baytown'
import { colors } from '../../styles/tokens'
import Legend from './Legend'
import useIsMobile from '../../hooks/useIsMobile'
import CriticalityIndicator from './CriticalityIndicator'
import FilterChip from './FilterChip'

function barColor(criticality) {
  if (criticality === 'A') return colors.error
  if (criticality === 'B') return colors.warning
  return colors.info
}

const LEGEND_ITEMS = [
  { label: 'A (Safety)',      color: colors.error },
  { label: 'B (Production)', color: colors.warning },
  { label: 'C (Support)',    color: colors.info },
]

const maxEvents = Math.max(...BAD_ACTORS.map(a => a.events))

// ── Tooltip (cursor-following, matches dashboard pattern) ───────────────────

function WatchListTooltip({ item, x, y }) {
  if (!item) return null

  return (
    <div
      className="tooltip-fixed"
      style={{ left: Math.min(x + 12, window.innerWidth - 240), top: y - 8 }}
    >
      <div className="tooltip-bubble flex flex-col gap-[var(--gap-stack)] rounded-[var(--radius-4)] py-8 px-12 whitespace-nowrap">
        <span className="type-meta font-semibold">{item.name}</span>
        <div className="flex items-center gap-8">
          <span className="type-meta">Events (30d)</span>
          <span className="type-meta font-semibold">{item.events}</span>
        </div>
        <div className="flex items-center gap-8">
          <span className="type-meta">Asset Criticality</span>
          <CriticalityIndicator level={item.criticality} inverted />
        </div>
        <span className="type-meta opacity-60">Click to filter Asset Table</span>
      </div>
    </div>
  )
}

// ── Bar row ─────────────────────────────────────────────────────────────────

function BarRow({ item, isHovered, isSelected, isDimmed, onHover, onLeave, onClick, onFocusEl, onBlurEl }) {
  const pct = (item.events / maxEvents) * 100
  const showBorder = isHovered || isSelected

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${item.name}: ${item.events} events in 30 days, criticality ${item.criticality}. Click to filter Asset Table`}
      aria-pressed={isSelected}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={(e) => { onFocusEl?.(e.currentTarget); onHover() }}
      onBlur={() => { onBlurEl?.(); onLeave() }}
      onClick={() => onClick(item.assetId)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(item.assetId) } }}
      className="flex items-center gap-8 px-8 py-4 cursor-pointer rounded-[var(--radius-4)]"
      style={{
        opacity: isDimmed ? 0.35 : 1,
        transition: 'all var(--motion-fast) var(--ease-productive)',
        border: isSelected ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
        background: isSelected ? 'var(--color-accent-bg)' : 'transparent',
      }}
    >
      {/* Asset name */}
      <span className="type-meta shrink-0 text-right overflow-hidden text-ellipsis whitespace-nowrap text-[var(--color-accent)]" style={{ width: 120 }}>
        {item.name}
      </span>

      {/* Bar + count */}
      <div className="flex-1 flex items-center gap-8">
        <div className="flex-1 overflow-hidden rounded-[var(--radius-4)] bg-[var(--color-layer-02)]" style={{ height: 20 }}>
          <div
            className="h-full rounded-[var(--radius-4)]"
            style={{
              width: `${pct}%`,
              background: barColor(item.criticality),
              transition: 'width var(--motion-slow) var(--ease-productive)',
              minWidth: 4,
            }}
          />
        </div>
        <span className="type-meta shrink-0 text-right font-semibold tabular-nums text-[var(--color-text-primary)]" style={{ width: 24 }}>
          {item.events}
        </span>
      </div>
    </div>
  )
}

// ── WatchList ───────────────────────────────────────────────────────────────

export default function WatchList({ onAssetClick, selectedAsset, onClearFilter }) {
  const isMobile = useIsMobile()
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const focusedElRef = useRef(null)

  const hoveredItem = hoveredIdx !== null ? BAD_ACTORS[hoveredIdx] : null
  const selectedName = selectedAsset ? BAD_ACTORS.find(a => a.assetId === selectedAsset)?.name : null

  const getTooltipPos = useCallback(() => {
    if (focusedElRef.current) {
      const r = focusedElRef.current.getBoundingClientRect()
      return { x: r.right, y: r.top }
    }
    return mousePos
  }, [mousePos])

  return (
    <div
      className="card flex flex-col gap-16"
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-8">
        <span className="type-card-title">Watch List</span>
        {selectedAsset ? (
          <FilterChip label={selectedName || selectedAsset} onClear={onClearFilter} />
        ) : (
          <span className="type-meta">Last 30 days</span>
        )}
      </div>

      {/* Bars -- centered vertically in card */}
      <div className="flex flex-col flex-1 justify-center">
        {BAD_ACTORS.map((item, i) => (
          <BarRow
            key={item.assetId}
            item={item}
            isHovered={hoveredIdx === i}
            isSelected={selectedAsset === item.assetId}
            isDimmed={(hoveredIdx !== null && hoveredIdx !== i) || (selectedAsset && selectedAsset !== item.assetId)}
            onHover={() => setHoveredIdx(i)}
            onLeave={() => setHoveredIdx(null)}
            onClick={(id) => onAssetClick?.(id)}
            onFocusEl={(el) => { focusedElRef.current = el }}
            onBlurEl={() => { focusedElRef.current = null }}
          />
        ))}
      </div>

      {/* Tooltip (desktop only) */}
      {!isMobile && <WatchListTooltip item={hoveredItem} x={getTooltipPos().x} y={getTooltipPos().y} />}

      {/* Legend */}
      <Legend items={LEGEND_ITEMS} shape="square" title="Asset Criticality" />
    </div>
  )
}
