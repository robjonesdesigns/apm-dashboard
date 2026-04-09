import { useState, useRef, useCallback } from 'react'
import { EVENT_SUMMARY } from '../../data/baytown'
import FilterChip from './FilterChip'
import Legend from './Legend'
import useIsMobile from '../../hooks/useIsMobile'

// ── Segment config ──────────────────────────────────────────────────────────

const BAR_COLORS = {
  confirmed:      'var(--color-chart-donut-1)',
  falsePositives: 'var(--color-chart-donut-2)',
  newEvents:      'var(--color-chart-donut-3)',
}

const ALARM_SEGMENTS = [
  { key: 'confirmed',      label: 'Confirmed',      value: EVENT_SUMMARY.confirmed,      color: BAR_COLORS.confirmed },
  { key: 'falsePositives', label: 'False Positives', value: EVENT_SUMMARY.falsePositives, color: BAR_COLORS.falsePositives },
  { key: 'newEvents',      label: 'New',             value: EVENT_SUMMARY.newEvents,      color: BAR_COLORS.newEvents },
]

const SEGMENT_LABELS = {
  confirmed: 'Confirmed',
  falsePositives: 'False Positives',
  newEvents: 'New',
}

const maxValue = Math.max(...ALARM_SEGMENTS.map(s => s.value))

// ── Tooltip (cursor-following, matches Watch List / Risk Matrix) ────────────

function AlarmTooltip({ segment, total, x, y }) {
  if (!segment) return null
  const pct = Math.round((segment.value / total) * 100)

  return (
    <div
      className="tooltip-fixed"
      style={{ left: Math.min(x + 12, window.innerWidth - 240), top: y - 8 }}
    >
      <div className="tooltip-bubble flex flex-col gap-[var(--gap-stack)] rounded-[var(--radius-4)] py-8 px-12 whitespace-nowrap">
        <div className="flex items-center gap-8">
          <div className="shrink-0 rounded-sm" style={{ width: 10, height: 10, background: segment.color }} />
          <span className="type-meta">{segment.label}</span>
          <span className="type-meta font-semibold">{segment.value} ({pct}%)</span>
        </div>
        <span className="type-meta opacity-60">Click to filter Asset Table</span>
      </div>
    </div>
  )
}

// ── Bar row (matches Watch List hover affordance) ───────────────────────────

function BarRow({ segment, isHovered, isSelected, isDimmed, onHover, onLeave, onClick, onFocusEl, onBlurEl }) {
  const pct = (segment.value / maxValue) * 100

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${segment.label}: ${segment.value} events. Click to filter Asset Table`}
      aria-pressed={isSelected}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={(e) => { onFocusEl?.(e.currentTarget); onHover() }}
      onBlur={() => { onBlurEl?.(); onLeave() }}
      onClick={() => onClick?.(segment.key)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(segment.key) } }}
      className="flex items-center gap-8 px-8 py-4 cursor-pointer rounded-[var(--radius-4)]"
      style={{
        opacity: isDimmed ? 0.35 : 1,
        transition: 'all var(--motion-fast) var(--ease-productive)',
        border: isSelected ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
        background: isSelected ? 'var(--color-accent-bg)' : 'transparent',
      }}
    >
      {/* Label */}
      <span className="type-meta shrink-0 text-right overflow-hidden text-ellipsis whitespace-nowrap" style={{ width: 100 }}>
        {segment.label}
      </span>

      {/* Bar + count */}
      <div className="flex-1 flex items-center gap-8">
        <div className="flex-1 overflow-hidden rounded-[var(--radius-4)] bg-[var(--color-layer-02)]" style={{ height: 20 }}>
          <div
            className="h-full rounded-[var(--radius-4)]"
            style={{
              width: `${pct}%`,
              background: segment.color,
              transition: 'width var(--motion-slow) var(--ease-productive)',
              minWidth: 4,
            }}
          />
        </div>
        <span className="type-meta shrink-0 text-right font-semibold tabular-nums text-[var(--color-text-primary)]" style={{ width: 24 }}>
          {segment.value}
        </span>
      </div>
    </div>
  )
}

// ── AlarmQuality card ───────────────────────────────────────────────────────

export default function AlarmQuality({ selectedSegment, onSegmentClick, onClearFilter }) {
  const isMobile = useIsMobile()
  const [hoveredKey, setHoveredKey] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const focusedElRef = useRef(null)
  const total = EVENT_SUMMARY.total

  const hoveredSegment = hoveredKey ? ALARM_SEGMENTS.find(s => s.key === hoveredKey) : null

  const getTooltipPos = useCallback(() => {
    if (focusedElRef.current) {
      const r = focusedElRef.current.getBoundingClientRect()
      return { x: r.right, y: r.top }
    }
    return mousePos
  }, [mousePos])

  const legendItems = ALARM_SEGMENTS.map(seg => ({
    label: seg.label,
    color: seg.color,
    value: `${seg.value} (${Math.round((seg.value / total) * 100)}%)`,
  }))

  return (
    <div
      className="card flex flex-col gap-16"
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      {/* Tooltip (desktop only) */}
      {!isMobile && <AlarmTooltip segment={hoveredSegment} total={total} x={getTooltipPos().x} y={getTooltipPos().y} />}

      {/* Header */}
      <div className="flex items-center justify-between gap-8">
        <span className="type-card-title">Alarm Quality</span>
        {selectedSegment && (
          <FilterChip
            label={SEGMENT_LABELS[selectedSegment] || selectedSegment}
            onClear={onClearFilter}
          />
        )}
      </div>

      {/* Total callout */}
      <div className="flex flex-col gap-[var(--gap-stack)]">
        <span className="type-kpi-hero">{total}</span>
        <span className="type-label">Active Events</span>
      </div>

      {/* Bars */}
      <div className="flex flex-col flex-1 justify-center">
        {ALARM_SEGMENTS.map(seg => (
          <BarRow
            key={seg.key}
            segment={seg}
            isHovered={hoveredKey === seg.key}
            isSelected={selectedSegment === seg.key}
            isDimmed={(hoveredKey !== null && hoveredKey !== seg.key) || (selectedSegment && selectedSegment !== seg.key)}
            onHover={() => setHoveredKey(seg.key)}
            onLeave={() => setHoveredKey(null)}
            onClick={onSegmentClick}
            onFocusEl={(el) => { focusedElRef.current = el }}
            onBlurEl={() => { focusedElRef.current = null }}
          />
        ))}
      </div>

      {/* Legend */}
      <Legend items={legendItems} shape="square" title="Event Status" />
    </div>
  )
}
