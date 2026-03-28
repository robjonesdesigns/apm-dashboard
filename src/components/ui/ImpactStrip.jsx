// ── ImpactStrip ──────────────────────────────────────────────────────────────
// Horizontal timeline on page background (not in a card).
// Major events: large dots, evenly spaced, left-aligned details below.
// Minor events: small muted dots, temporally positioned, tooltip on hover.
// ADR-012, ADR-013 Layer 1, ADR-014.

import { useState } from 'react'
import { TIMELINE } from '../../data/assets'

const majorEvents = TIMELINE.filter(e => e.kpiImpact).slice(0, 3)
const minorEvents = TIMELINE.filter(e => !e.kpiImpact)

// Three-act narrative labels per ADR-014
const ACT_LABELS = ['Trigger', 'Consequence', 'Confirmation']
// If confirmation hasn't happened yet, last dot is pending
function getActLabel(index, total) {
  if (total === 1) return 'Trigger'
  if (total === 2) return index === 0 ? 'Trigger' : 'Consequence'
  return ACT_LABELS[index] || ''
}

function timeToMinutes(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return 0
  let hours = parseInt(match[1])
  const mins = parseInt(match[2])
  const period = match[3].toUpperCase()
  if (period === 'AM' && hours === 12) hours = 0
  if (period === 'PM' && hours !== 12) hours += 12
  return hours * 60 + mins
}

function impactColor() {
  // All impact text is neutral. The timeline dots and labels
  // communicate severity. Colored text would double the signal.
  return 'var(--color-text-secondary)'
}

// ── Minor dot with tooltip ──────────────────────────────────────────────────

function MinorDot({ event, style }) {
  const [show, setShow] = useState(false)

  return (
    <div
      style={{
        position: 'absolute',
        ...style,
        zIndex: 2,
        // Visual dot is 6px, but hit area is 30px for accessibility
        width: '30px',
        height: '30px',
        // Center the 30px hit area on the dot position
        marginLeft: '-15px',
        marginTop: '-15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      <button
        tabIndex={0}
        aria-label={`${event.time}: ${event.asset} - ${event.event}`}
        style={{
          width: '6px',
          height: '6px',
          display: 'block',
          borderRadius: 'var(--radius-full)',
          background: show ? 'var(--color-text-secondary)' : 'var(--color-border-strong)',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          transition: 'all var(--motion-fast) var(--ease-productive)',
          outline: 'none',
          boxShadow: show ? '0 0 0 3px var(--color-bg), 0 0 0 5px var(--color-border-strong)' : 'none',
        }}
      />
      {show && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--color-tooltip-bg)',
            borderRadius: 'var(--radius-4)',
            padding: 'var(--spacing-8) var(--spacing-12)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            whiteSpace: 'nowrap',
            zIndex: 100,
            pointerEvents: 'none',
            animation: 'fadeInOnly var(--motion-moderate) var(--ease-productive)',
          }}
        >
          <p className="type-meta" style={{ margin: 0, color: 'var(--color-tooltip-text)', opacity: 0.6 }}>
            {event.time}
          </p>
          <p className="type-meta" style={{ margin: '2px 0 0', color: 'var(--color-tooltip-text)', fontWeight: 600 }}>
            {event.asset}
          </p>
          <p className="type-meta" style={{ margin: '2px 0 0', color: 'var(--color-tooltip-text)', opacity: 0.8 }}>
            {event.event}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Desktop horizontal timeline ─────────────────────────────────────────────

function HorizontalTimeline() {
  // Minor dots are positioned temporally between the first and last major events.
  // This prevents dots from appearing outside the timeline's visual range.
  const majorTimes = majorEvents.map(e => timeToMinutes(e.time))
  const timeStart = Math.min(...majorTimes)
  const timeEnd = Math.max(...majorTimes)
  const timeRange = timeEnd - timeStart || 1

  // Track spans ~82% of card width so the last dot's text fills to the card
  // padding edge. Dashed continuation line runs from last dot to right edge.
  const trackWidthPct = 82

  return (
    <div style={{ position: 'relative', paddingTop: 'var(--spacing-24)' }}>

      {/* Timeline track + continuation line */}
      <div style={{ position: 'relative', height: '10px' }}>

        {/* Solid line spanning the track (0% to trackWidthPct%) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: `${trackWidthPct}%`,
          height: '2px',
          background: 'var(--color-border-subtle)',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }} />

        {/* Dashed continuation line from last dot to right edge */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: `${trackWidthPct}%`,
          right: 0,
          height: '2px',
          borderTop: '2px dashed var(--color-border-subtle)',
          transform: 'translateY(-50%)',
          zIndex: 1,
          opacity: 0.5,
        }} />

        {/* Minor dots -- positioned relative to the segment between the two
            major events they fall between, proportional to actual time gaps */}
        {minorEvents
          .filter(e => {
            const t = timeToMinutes(e.time)
            return t >= timeStart && t <= timeEnd
          })
          .map((event, i) => {
            const t = timeToMinutes(event.time)

            // Find which two major events this minor falls between
            let segStart = 0, segEnd = majorEvents.length - 1
            for (let j = 0; j < majorTimes.length - 1; j++) {
              if (t >= majorTimes[j] && t <= majorTimes[j + 1]) {
                segStart = j
                segEnd = j + 1
                break
              }
            }

            // Major dots are evenly spaced within the track width, so segment j
            // occupies startPct to endPct of the track (not full container)
            const startPct = (segStart / (majorEvents.length - 1)) * trackWidthPct
            const endPct = (segEnd / (majorEvents.length - 1)) * trackWidthPct

            // Position within the segment proportional to time
            const segTimeStart = majorTimes[segStart]
            const segTimeEnd = majorTimes[segEnd]
            const segTimeRange = segTimeEnd - segTimeStart || 1
            const ratio = (t - segTimeStart) / segTimeRange

            const pct = startPct + ratio * (endPct - startPct)
            const clampedPct = Math.max(1, Math.min(trackWidthPct - 1, pct))

            return (
              <MinorDot
                key={`minor-${i}`}
                event={event}
                style={{ left: `${clampedPct}%`, top: '50%' }}
              />
            )
          })
        }

        {/* Act labels above dots -- left edge aligned with dot left edge */}
        {majorEvents.map((event, i) => {
          const pct = majorEvents.length === 1 ? 0 : (i / (majorEvents.length - 1)) * trackWidthPct
          const actLabel = getActLabel(i, majorEvents.length)
          return (
            <span
              key={`label-${i}`}
              className="type-card-title"
              style={{
                position: 'absolute',
                left: `calc(${pct}% - 5px)`,
                bottom: '100%',
                marginBottom: 'var(--spacing-8)',
                whiteSpace: 'nowrap',
                color: 'var(--color-card-title)',
              }}
            >
              {actLabel}
            </span>
          )
        })}

        {/* Major dots -- focusable buttons (ADR-014) */}
        {majorEvents.map((event, i) => {
          const pct = majorEvents.length === 1 ? 0 : (i / (majorEvents.length - 1)) * trackWidthPct
          const actLabel = getActLabel(i, majorEvents.length)
          return (
            <button
              key={`dot-${i}`}
              tabIndex={0}
              aria-label={`${actLabel}: ${event.asset} - ${event.event}`}
              style={{
                position: 'absolute',
                left: `${pct}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 3,
                width: '10px',
                height: '10px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-text-primary)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'box-shadow var(--motion-fast) var(--ease-productive)',
              }}
              onFocus={(e) => { e.target.style.boxShadow = '0 0 0 3px var(--color-bg), 0 0 0 5px var(--color-text-secondary)' }}
              onBlur={(e) => { e.target.style.boxShadow = 'none' }}
            />
          )
        })}
      </div>

      {/* Major event details -- absolutely positioned under their dots */}
      <div style={{ position: 'relative', marginTop: 'var(--spacing-12)', minHeight: '72px' }}>
        {majorEvents.map((event, i) => {
          const left = majorEvents.length === 1 ? 0 : (i / (majorEvents.length - 1)) * trackWidthPct
          const nextLeft = i < majorEvents.length - 1
            ? ((i + 1) / (majorEvents.length - 1)) * trackWidthPct
            : 100
          const width = nextLeft - left

          return (
            <div
              key={`detail-${i}`}
              style={{
                position: 'absolute',
                left: `${left}%`,
                width: `${width}%`,
                textAlign: 'left',
              }}
            >
              <p className="type-meta" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                {event.time}
              </p>
              <p className="type-body" style={{ margin: '2px 0 0', color: 'var(--color-text-primary)' }}>
                {event.asset}
              </p>
              <p className="type-meta" style={{ margin: '2px 0 0', color: 'var(--color-text-secondary)' }}>
                {event.event.length > 50 ? event.event.substring(0, 50) + '...' : event.event}
              </p>
              <p className="type-label" style={{ margin: '4px 0 0', color: impactColor(event.type) }}>
                {event.kpiImpact}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Mobile vertical timeline ────────────────────────────────────────────────

function VerticalTimeline() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      {majorEvents.map((event, i) => {
        const actLabel = getActLabel(i, majorEvents.length)
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-12)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '2px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: 'var(--radius-full)', background: 'var(--color-text-primary)' }} />
              {i < majorEvents.length - 1 && (
                <div style={{ width: '2px', height: 'var(--spacing-24)', background: 'var(--color-border-subtle)', marginTop: 'var(--spacing-4)' }} />
              )}
            </div>
            <div>
              <p className="type-card-title" style={{ margin: 0, color: 'var(--color-card-title)' }}>{actLabel}</p>
              <p className="type-meta" style={{ margin: '2px 0 0', color: 'var(--color-text-secondary)' }}>{event.time}</p>
              <p className="type-body" style={{ margin: '2px 0 0' }}>
                {event.asset}
              </p>
              <p className="type-meta" style={{ margin: '2px 0 0', color: 'var(--color-text-secondary)' }}>
                {event.event.toLowerCase()}
              </p>
              <p className="type-label" style={{ margin: '4px 0 0', color: impactColor(event.type) }}>
                {event.kpiImpact}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── ImpactStrip ─────────────────────────────────────────────────────────────

export default function ImpactStrip() {
  if (majorEvents.length === 0) return null

  const [isMobile, setIsMobile] = useState(false)
  if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(max-width: 671px)')
    if (mq.matches !== isMobile) setIsMobile(mq.matches)
  }

  return (
    <section>
      <p className="section-header">What Happened</p>

      <div className="card" style={{ overflow: 'visible' }}>
        {isMobile ? <VerticalTimeline /> : <HorizontalTimeline />}

        {/* Link right-aligned, anchored under the dashed continuation line */}
        <div style={{ marginTop: 'var(--spacing-16)', textAlign: 'right' }}>
          <button
            className="type-link"
            onClick={() => console.log('Navigate to Event Log')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
          >
            See full timeline &rarr;
          </button>
        </div>
      </div>
    </section>
  )
}
