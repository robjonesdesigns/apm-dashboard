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

// ── Arc path helper ─────────────────────────────────────────────────────────

function describeArc(cx, cy, innerR, outerR, startAngle, endAngle) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const s = toRad(startAngle)
  const e = toRad(endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${cx + outerR * Math.cos(s)} ${cy + outerR * Math.sin(s)}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${cx + outerR * Math.cos(e)} ${cy + outerR * Math.sin(e)}`,
    `L ${cx + innerR * Math.cos(e)} ${cy + innerR * Math.sin(e)}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${cx + innerR * Math.cos(s)} ${cy + innerR * Math.sin(s)}`,
    'Z',
  ].join(' ')
}

// ── Donut (filled arcs with rounded corners via SVG filter) ──────────────────

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
  const center = size / 2
  const outerR = size / 2 - 2
  const innerR = outerR - ringWidth
  const svgSize = size + 20
  const gapDeg = 1.5
  const cornerRadius = 2 // px -- subtle squircle effect

  // Build angle map
  const segmentAngles = []
  let angle = -90 // start at top
  segments.forEach(seg => {
    const sweep = (seg.value / total) * 360
    segmentAngles.push({ ...seg, startAngle: angle + gapDeg / 2, endAngle: angle + sweep - gapDeg / 2, sweep })
    angle += sweep
  })

  return (
    <div style={{ position: 'relative', width: svgSize, height: svgSize, margin: '0 auto' }}>
      <svg width={svgSize} height={svgSize}>
        {/* SVG filter for subtle corner rounding */}
        <defs>
          <filter id="donut-round" x="-5%" y="-5%" width="110%" height="110%">
            <feMorphology operator="erode" radius={cornerRadius} in="SourceGraphic" result="eroded" />
            <feMorphology operator="dilate" radius={cornerRadius} in="eroded" result="rounded" />
            <feComposite in="SourceGraphic" in2="rounded" operator="in" />
          </filter>
        </defs>

        <g transform={`translate(${(svgSize - size) / 2}, ${(svgSize - size) / 2})`}>
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={(outerR + innerR) / 2}
            fill="none"
            stroke="var(--color-layer-02)"
            strokeWidth={ringWidth}
          />

          {/* Segments -- filled arcs with rounded corners */}
          {segmentAngles.map(seg => {
            const isHovered = hoveredKey === seg.key
            const isSelected = selectedKey === seg.key
            const expand = isHovered || isSelected ? 3 : 0
            const path = describeArc(center, center, innerR - expand, outerR + expand, seg.startAngle, seg.endAngle)

            return (
              <g key={seg.key}>
                {/* Teal selection ring */}
                {isSelected && (
                  <path
                    d={describeArc(center, center, innerR - 5, outerR + 5, seg.startAngle, seg.endAngle)}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                    filter="url(#donut-round)"
                  />
                )}
                {/* Teal hover ring */}
                {isHovered && !isSelected && (
                  <path
                    d={describeArc(center, center, innerR - 5, outerR + 5, seg.startAngle, seg.endAngle)}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth={1.5}
                    opacity={0.5}
                    filter="url(#donut-round)"
                  />
                )}
                <path
                  d={path}
                  fill={seg.color}
                  filter="url(#donut-round)"
                  style={{
                    transition: 'opacity var(--motion-fast) var(--ease-productive)',
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
        </g>
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
