import { useState } from 'react'
import { EVENT_SUMMARY } from '../../data/baytown'
import FilterChip from './FilterChip'
import Legend from './Legend'

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

// ── Bar row (matches Watch List hover affordance) ───────────────────────────

function BarRow({ segment, isHovered, isSelected, isDimmed, onHover, onLeave, onClick }) {
  const pct = (segment.value / maxValue) * 100
  const showBorder = isHovered || isSelected

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${segment.label}: ${segment.value} events. Click to filter Asset Table`}
      aria-pressed={isSelected}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
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
  const [hoveredKey, setHoveredKey] = useState(null)
  const total = EVENT_SUMMARY.total

  const legendItems = ALARM_SEGMENTS.map(seg => ({
    label: seg.label,
    color: seg.color,
    value: `${seg.value} (${Math.round((seg.value / total) * 100)}%)`,
  }))

  return (
    <div className="card flex flex-col gap-16">
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
          />
        ))}
      </div>

      {/* Legend -- matches Risk Matrix and Watch List */}
      <Legend items={legendItems} shape="square" title="Event Status" />
    </div>
  )
}
