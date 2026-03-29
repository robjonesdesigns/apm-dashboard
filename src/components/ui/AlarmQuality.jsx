import { useState } from 'react'
import { EVENT_SUMMARY } from '../../data/assets'
import FilterChip from './FilterChip'
import Legend from './Legend'

// ── Donut palette (Carbon tokens, desaturated for dark-and-quiet) ────────────

const DONUT_COLORS = {
  confirmed:      'var(--color-chart-donut-1)',
  falsePositives: 'var(--color-chart-donut-2)',
  newEvents:      'var(--color-chart-donut-3)',
}

const ALARM_SEGMENTS = [
  { key: 'confirmed',      label: 'Confirmed',      value: EVENT_SUMMARY.confirmed,      color: DONUT_COLORS.confirmed },
  { key: 'falsePositives', label: 'False Positives', value: EVENT_SUMMARY.falsePositives, color: DONUT_COLORS.falsePositives },
  { key: 'newEvents',      label: 'New',             value: EVENT_SUMMARY.newEvents,      color: DONUT_COLORS.newEvents },
]

// ── Donut (stroke-based with rounded linecaps) ──────────────────────────────

function DonutTooltip({ segment, total, x, y }) {
  if (!segment) return null
  const pct = Math.round((segment.value / total) * 100)

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
        <div style={{ width: 10, height: 10, borderRadius: 2, background: segment.color, flexShrink: 0 }} />
        <span className="type-meta" style={{ color: 'var(--color-tooltip-text)' }}>{segment.label}</span>
        <span className="type-meta" style={{ color: 'var(--color-tooltip-text)', fontWeight: 600 }}>{segment.value} ({pct}%)</span>
      </div>
      <span className="type-meta" style={{ color: 'var(--color-tooltip-text)', opacity: 0.6 }}>Click to filter Asset Table</span>
    </div>
  )
}

function Donut({ segments, total, size = 160, ringWidth = 18, hoveredKey, selectedKey, onHover, onLeave, onClick }) {
  const svgSize = size + 20
  const center = svgSize / 2
  const midR = (size / 2 - 2) - ringWidth / 2
  const circumference = 2 * Math.PI * midR
  const gapLength = 3 // px gap between segments -- subtle separation

  // Build stroke-dasharray segments
  const segmentData = []
  let offset = circumference * 0.25 // start at top (90deg rotation via offset)
  segments.forEach(seg => {
    const segLength = (seg.value / total) * circumference - gapLength
    segmentData.push({ ...seg, dashLength: Math.max(segLength, 2), dashOffset: -offset + gapLength / 2 })
    offset += (seg.value / total) * circumference
  })

  return (
    <div style={{ position: 'relative', width: svgSize, height: svgSize, margin: '0 auto' }}>
      <svg width={svgSize} height={svgSize}>
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={midR}
          fill="none"
          stroke="var(--color-layer-02)"
          strokeWidth={ringWidth}
        />

        {/* Segments -- stroke-based with rounded linecaps */}
        {segmentData.map(seg => {
          const isHovered = hoveredKey === seg.key
          const isSelected = selectedKey === seg.key
          const activeWidth = isHovered || isSelected ? ringWidth + 8 : ringWidth

          return (
            <g key={seg.key}>
              {/* Teal selection/hover ring */}
              {(isSelected || isHovered) && (
                <circle
                  cx={center}
                  cy={center}
                  r={midR}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth={activeWidth + 4}
                  strokeLinecap="round"
                  strokeDasharray={`${seg.dashLength + 4} ${circumference - seg.dashLength - 4}`}
                  strokeDashoffset={seg.dashOffset - 2}
                  opacity={isSelected ? 1 : 0.5}
                />
              )}
              <circle
                cx={center}
                cy={center}
                r={midR}
                fill="none"
                stroke={seg.color}
                strokeWidth={activeWidth}
                strokeLinecap="round"
                strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
                strokeDashoffset={seg.dashOffset}
                style={{
                  transition: 'opacity var(--motion-fast) var(--ease-productive), stroke-width var(--motion-fast) var(--ease-productive)',
                  opacity: (hoveredKey || selectedKey) && !isHovered && !isSelected ? 0.35 : 1,
                  cursor: 'pointer',
                }}
                onMouseEnter={() => onHover(seg.key)}
                onMouseLeave={onLeave}
                onClick={() => onClick?.(seg.key)}
              />
            </g>
          )
        })}
      </svg>

      {/* Center label */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <span className="type-kpi-hero" style={{ lineHeight: 1 }}>{total}</span>
        <br />
        <span className="type-meta">Events</span>
      </div>
    </div>
  )
}

// ── Alarm Quality view ──────────────────────────────────────────────────────

const SEGMENT_LABELS = {
  confirmed: 'Confirmed',
  falsePositives: 'False Positives',
  newEvents: 'New',
}

function AlarmQualityView({ selectedSegment, onSegmentClick }) {
  const total = EVENT_SUMMARY.total
  const [hoveredKey, setHoveredKey] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const hoveredSegment = hoveredKey ? ALARM_SEGMENTS.find(s => s.key === hoveredKey) : null

  return (
    <>
      <div
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        <Donut
          segments={ALARM_SEGMENTS}
          total={total}
          hoveredKey={hoveredKey}
          selectedKey={selectedSegment}
          onHover={setHoveredKey}
          onLeave={() => setHoveredKey(null)}
          onClick={onSegmentClick}
        />
        <DonutTooltip segment={hoveredSegment} total={total} x={mousePos.x} y={mousePos.y} />
      </div>

      {/* Legend */}
      <Legend
        title="Event Status"
        shape="square"
        items={ALARM_SEGMENTS.map(seg => ({
          label: seg.label,
          color: seg.color,
          value: `${seg.value} (${Math.round((seg.value / total) * 100)}%)`,
        }))}
      />
    </>
  )
}

// ── AlarmQuality card ───────────────────────────────────────────────────────

export default function AlarmQuality({ selectedSegment, onSegmentClick, onClearFilter }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-8)' }}>
        <span className="type-card-title">Alarm Quality</span>
        {selectedSegment && (
          <FilterChip
            label={SEGMENT_LABELS[selectedSegment] || selectedSegment}
            onClear={onClearFilter}
          />
        )}
      </div>

      <AlarmQualityView selectedSegment={selectedSegment} onSegmentClick={onSegmentClick} />
    </div>
  )
}
