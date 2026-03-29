// ── Watch List ────────────────────────────────────────────────────────────────
// Pure React horizontal bar chart. No Recharts dependency.
// Assets with recurring events over 30 days, ranked by count.
// Bars color-coded by asset criticality (A=red, B=amber, C=blue).
// Cursor-following tooltip matches dashboard pattern.

import { useState } from 'react'
import { BAD_ACTORS } from '../../data/assets'
import { colors } from '../../styles/tokens'
import Legend from './Legend'
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
      style={{
        position: 'fixed',
        left: x + 12,
        top: y - 8,
        background: 'var(--color-tooltip-bg)',
        borderRadius: 'var(--radius-4)',
        padding: 'var(--spacing-8) var(--spacing-12)',
        boxShadow: 'var(--shadow-tooltip)',
        whiteSpace: 'nowrap',
        zIndex: 100,
        pointerEvents: 'none',
        animation: 'fadeInOnly var(--motion-moderate) var(--ease-productive)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-4)',
      }}
    >
      <span className="type-meta" style={{ color: 'var(--color-tooltip-text)', fontWeight: 600 }}>
        {item.name}
      </span>
      <div style={{ display: 'flex', gap: 'var(--spacing-8)', alignItems: 'center' }}>
        <span className="type-meta" style={{ color: 'var(--color-tooltip-text)' }}>Events (30d)</span>
        <span className="type-meta" style={{ color: 'var(--color-tooltip-text)', fontWeight: 600 }}>{item.events}</span>
      </div>
      <div style={{ display: 'flex', gap: 'var(--spacing-8)', alignItems: 'center' }}>
        <span className="type-meta" style={{ color: 'var(--color-tooltip-text)' }}>Asset Criticality</span>
        <CriticalityIndicator level={item.criticality} inverted />
      </div>
      <span className="type-meta" style={{ color: 'var(--color-tooltip-text)', opacity: 0.6 }}>Click to filter Asset Table</span>
    </div>
  )
}

// ── Bar row ─────────────────────────────────────────────────────────────────

function BarRow({ item, isHovered, isSelected, isDimmed, onHover, onLeave, onClick }) {
  const pct = (item.events / maxEvents) * 100
  const showBorder = isHovered || isSelected

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={() => onClick(item.assetId)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-8)',
        padding: 'var(--spacing-4) var(--spacing-8)',
        cursor: 'pointer',
        opacity: isDimmed ? 0.35 : 1,
        transition: 'all var(--motion-fast) var(--ease-productive)',
        borderRadius: 'var(--radius-4)',
        border: showBorder ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
        background: isSelected ? 'var(--color-accent-bg)' : 'transparent',
      }}
    >
      {/* Asset name */}
      <span
        className="type-meta"
        style={{
          width: 120,
          flexShrink: 0,
          textAlign: 'right',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: 'var(--color-accent)',
        }}
      >
        {item.name}
      </span>

      {/* Bar + count */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
        <div style={{ flex: 1, height: 20, background: 'var(--color-layer-02)', borderRadius: 'var(--radius-4)', overflow: 'hidden' }}>
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: barColor(item.criticality),
              borderRadius: 'var(--radius-4)',
              transition: 'width var(--motion-slow) var(--ease-productive)',
              minWidth: 4,
            }}
          />
        </div>
        <span
          className="type-meta"
          style={{
            width: 24,
            flexShrink: 0,
            textAlign: 'right',
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--color-text-primary)',
          }}
        >
          {item.events}
        </span>
      </div>
    </div>
  )
}

// ── BadActors (Watch List) ──────────────────────────────────────────────────

export default function BadActors({ onAssetClick, selectedAsset, onClearFilter }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const hoveredItem = hoveredIdx !== null ? BAD_ACTORS[hoveredIdx] : null
  const selectedName = selectedAsset ? BAD_ACTORS.find(a => a.assetId === selectedAsset)?.name : null

  return (
    <div
      className="card"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-8)' }}>
        <span className="type-card-title">Watch List</span>
        {selectedAsset ? (
          <FilterChip label={selectedName || selectedAsset} onClear={onClearFilter} />
        ) : (
          <span className="type-meta">Last 30 days</span>
        )}
      </div>

      {/* Bars -- centered vertically in card */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
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
          />
        ))}
      </div>

      {/* Tooltip */}
      <WatchListTooltip item={hoveredItem} x={mousePos.x} y={mousePos.y} />

      {/* Legend */}
      <Legend items={LEGEND_ITEMS} shape="square" title="Asset Criticality" />
    </div>
  )
}
