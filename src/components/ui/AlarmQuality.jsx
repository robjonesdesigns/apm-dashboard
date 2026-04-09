import { useState, useRef, useCallback } from 'react'
import { EVENT_SUMMARY } from '../../data/baytown'
import FilterChip from './FilterChip'
import Legend from './Legend'
import useIsMobile from '../../hooks/useIsMobile'

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

// ── Rounded arc path helper ──────────────────────────────────────────────────
// Quadratic bezier at each corner gives a true soft radius on all four corners.

function describeRoundedArc(cx, cy, innerR, outerR, startAngle, endAngle, cornerR = 2) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const cos = Math.cos
  const sin = Math.sin

  const outerCornerDeg = (cornerR / outerR) * (180 / Math.PI)
  const innerCornerDeg = (cornerR / innerR) * (180 / Math.PI)

  const s = toRad(startAngle)
  const e = toRad(endAngle)
  const sO = toRad(startAngle + outerCornerDeg)
  const eO = toRad(endAngle - outerCornerDeg)
  const sI = toRad(startAngle + innerCornerDeg)
  const eI = toRad(endAngle - innerCornerDeg)

  const sweepOuter = endAngle - startAngle - 2 * outerCornerDeg
  const sweepInner = endAngle - startAngle - 2 * innerCornerDeg
  const largeOuter = sweepOuter > 180 ? 1 : 0
  const largeInner = sweepInner > 180 ? 1 : 0

  return [
    `M ${cx + outerR * cos(sO)} ${cy + outerR * sin(sO)}`,
    `A ${outerR} ${outerR} 0 ${largeOuter} 1 ${cx + outerR * cos(eO)} ${cy + outerR * sin(eO)}`,
    `Q ${cx + outerR * cos(e)} ${cy + outerR * sin(e)} ${cx + (outerR - cornerR) * cos(e)} ${cy + (outerR - cornerR) * sin(e)}`,
    `L ${cx + (innerR + cornerR) * cos(e)} ${cy + (innerR + cornerR) * sin(e)}`,
    `Q ${cx + innerR * cos(e)} ${cy + innerR * sin(e)} ${cx + innerR * cos(eI)} ${cy + innerR * sin(eI)}`,
    `A ${innerR} ${innerR} 0 ${largeInner} 0 ${cx + innerR * cos(sI)} ${cy + innerR * sin(sI)}`,
    `Q ${cx + innerR * cos(s)} ${cy + innerR * sin(s)} ${cx + (innerR + cornerR) * cos(s)} ${cy + (innerR + cornerR) * sin(s)}`,
    `L ${cx + (outerR - cornerR) * cos(s)} ${cy + (outerR - cornerR) * sin(s)}`,
    `Q ${cx + outerR * cos(s)} ${cy + outerR * sin(s)} ${cx + outerR * cos(sO)} ${cy + outerR * sin(sO)}`,
    'Z',
  ].join(' ')
}

// ── Donut (filled arcs with rounded corners via SVG filter) ──────────────────

function DonutTooltip({ segment, total, x, y }) {
  if (!segment) return null
  const pct = Math.round((segment.value / total) * 100)

  return (
    <div
      className="tooltip-fixed"
      style={{ left: x + 12, top: y - 8 }}
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

function handleKeyDown(e, callback) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    callback()
  }
}

function Donut({ segments, total, size = 160, ringWidth = 18, hoveredKey, selectedKey, onHover, onLeave, onClick, onFocusSegment, onBlurSegment }) {
  const center = size / 2
  const outerR = size / 2 - 2
  const innerR = outerR - ringWidth
  const svgSize = size + 20
  const gapDeg = 2.5
  const cornerR = 2

  // Build angle map
  const segmentAngles = []
  let angle = -90 // start at top
  segments.forEach(seg => {
    const sweep = (seg.value / total) * 360
    segmentAngles.push({ ...seg, startAngle: angle + gapDeg / 2, endAngle: angle + sweep - gapDeg / 2, sweep })
    angle += sweep
  })

  return (
    <div className="relative mx-auto" style={{ width: svgSize, height: svgSize }}>
      <svg width={svgSize} height={svgSize} role="group" aria-label="Alarm quality donut chart">
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
            const path = describeRoundedArc(center, center, innerR - expand, outerR + expand, seg.startAngle, seg.endAngle, cornerR)

            return (
              <g key={seg.key}>
                {/* Teal selection ring */}
                {isSelected && (
                  <path
                    d={describeRoundedArc(center, center, innerR - 5, outerR + 5, seg.startAngle, seg.endAngle, 3)}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                  />
                )}
                {/* Teal hover ring */}
                {isHovered && !isSelected && (
                  <path
                    d={describeRoundedArc(center, center, innerR - 5, outerR + 5, seg.startAngle, seg.endAngle, 3)}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth={1.5}
                    opacity={0.5}
                  />
                )}
                <path
                  d={path}
                  fill={seg.color}
                  tabIndex={0}
                  role="button"
                  aria-label={`${seg.label}: ${seg.value} events (${Math.round((seg.value / total) * 100)}%). Click to filter Asset Table`}
                  aria-pressed={isSelected}
                  style={{
                    transition: 'opacity var(--motion-fast) var(--ease-productive)',
                    opacity: (hoveredKey || selectedKey) && !isHovered && !isSelected ? 0.35 : 1,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => onHover(seg.key)}
                  onMouseLeave={onLeave}
                  onFocus={(e) => onFocusSegment ? onFocusSegment(seg.key, e.currentTarget) : onHover(seg.key)}
                  onBlur={() => onBlurSegment ? onBlurSegment() : onLeave()}
                  onClick={() => onClick?.(seg.key)}
                  onKeyDown={(e) => handleKeyDown(e, () => onClick?.(seg.key))}
                />
              </g>
            )
          })}
        </g>
      </svg>

      {/* Center label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="type-kpi-hero leading-none">{total}</span>
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
  const isMobile = useIsMobile()
  const total = EVENT_SUMMARY.total
  const [hoveredKey, setHoveredKey] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const focusedElRef = useRef(null)

  const hoveredSegment = hoveredKey ? ALARM_SEGMENTS.find(s => s.key === hoveredKey) : null

  const getTooltipPos = useCallback(() => {
    if (focusedElRef.current) {
      const r = focusedElRef.current.getBoundingClientRect()
      return { x: r.right, y: r.top }
    }
    return mousePos
  }, [mousePos])

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
          onFocusSegment={(key, el) => { focusedElRef.current = el; setHoveredKey(key) }}
          onBlurSegment={() => { focusedElRef.current = null; setHoveredKey(null) }}
        />
        {!isMobile && <DonutTooltip segment={hoveredSegment} total={total} x={getTooltipPos().x} y={getTooltipPos().y} />}
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
    <div className="card flex flex-col gap-16">
      <div className="flex items-center justify-between gap-8">
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
