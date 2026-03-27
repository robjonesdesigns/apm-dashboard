// ── ImpactStrip ──────────────────────────────────────────────────────────────
// Horizontal timeline on page background (not in a card).
// Major events: large dots, evenly spaced, left-aligned details below.
// Minor events: small muted dots, temporally positioned, tooltip on hover.
// ADR-012, ADR-013 Layer 1, ADR-014.

import { useState } from 'react'
import { TIMELINE } from '../../data/assets'

const majorEvents = TIMELINE.filter(e => e.kpiImpact).slice(0, 3)
const minorEvents = TIMELINE.filter(e => !e.kpiImpact)

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

function dotClass(type) {
  if (type === 'critical') return 'dot-error'
  if (type === 'warning') return 'dot-warning'
  if (type === 'healthy') return 'dot-success'
  return 'dot-info'
}

function impactColor(impact) {
  if (!impact) return 'var(--color-text-secondary)'
  return impact.includes('-') ? 'var(--color-error)' : 'var(--color-success)'
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
          <p style={{ margin: 0, fontSize: 'var(--text-12)', color: 'var(--color-tooltip-text)', opacity: 0.6 }}>
            {event.time}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 'var(--text-12)', color: 'var(--color-tooltip-text)', fontWeight: 600 }}>
            {event.asset}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 'var(--text-12)', color: 'var(--color-tooltip-text)', opacity: 0.8 }}>
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

  return (
    <div style={{ position: 'relative' }}>

      {/* Timeline track -- dots are vertically centered on the line */}
      <div style={{ position: 'relative', height: '10px' }}>

        {/* The line itself, centered vertically */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '2px',
          background: 'var(--color-border-subtle)',
          transform: 'translateY(-50%)',
          zIndex: 1,
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

            // Major dots are evenly spaced, so segment j occupies:
            // startPct to endPct of the visual timeline
            const startPct = (segStart / (majorEvents.length - 1)) * 100
            const endPct = (segEnd / (majorEvents.length - 1)) * 100

            // Position within the segment proportional to time
            const segTimeStart = majorTimes[segStart]
            const segTimeEnd = majorTimes[segEnd]
            const segTimeRange = segTimeEnd - segTimeStart || 1
            const ratio = (t - segTimeStart) / segTimeRange

            const pct = startPct + ratio * (endPct - startPct)
            const clampedPct = Math.max(3, Math.min(97, pct))

            return (
              <MinorDot
                key={`minor-${i}`}
                event={event}
                style={{ left: `${clampedPct}%`, top: '50%' }}
              />
            )
          })
        }

        {/* Major dots -- centered on the line, focusable, ring matches dot color */}
        {majorEvents.map((event, i) => {
          const pct = majorEvents.length === 1 ? 50 : (i / (majorEvents.length - 1)) * 100
          const ringColor = event.type === 'critical' ? 'var(--color-error)' :
                           event.type === 'warning' ? 'var(--color-warning)' :
                           event.type === 'healthy' ? 'var(--color-success)' : 'var(--color-info)'
          const ring = `0 0 0 3px var(--color-bg), 0 0 0 5px ${ringColor}`
          return (
            <button
              key={`dot-${i}`}
              tabIndex={0}
              aria-label={`${event.time}: ${event.asset} - ${event.event}. ${event.kpiImpact}`}
              style={{
                position: 'absolute',
                left: `${pct}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 3,
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                outline: 'none',
              }}
              onFocus={(e) => { e.currentTarget.firstChild.style.boxShadow = ring }}
              onBlur={(e) => { e.currentTarget.firstChild.style.boxShadow = 'none' }}
              onMouseEnter={(e) => { e.currentTarget.firstChild.style.boxShadow = ring }}
              onMouseLeave={(e) => { e.currentTarget.firstChild.style.boxShadow = 'none' }}
            >
              <div
                className={`status-dot ${dotClass(event.type)}`}
                style={{ width: '10px', height: '10px', transition: 'box-shadow var(--motion-fast) var(--ease-productive)' }}
              />
            </button>
          )
        })}
      </div>

      {/* Major event details below the track */}
      {/* First = left-aligned, middle = centered, last = right-aligned */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-12)' }}>
        {majorEvents.map((event, i) => {
          const isFirst = i === 0
          const isLast = i === majorEvents.length - 1
          const alignment = isFirst ? 'left' : isLast ? 'right' : 'center'

          return (
            <div
              key={`detail-${i}`}
              style={{
                flex: '1 1 0',
                textAlign: alignment,
              }}
            >
              <p className="type-helper" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                {event.time}
              </p>
              <p className="type-body-compact" style={{ margin: '2px 0 0', color: 'var(--color-text-primary)' }}>
                {event.asset}
              </p>
              <p className="type-helper" style={{ margin: '2px 0 0', color: 'var(--color-text-secondary)' }}>
                {event.event.length > 50 ? event.event.substring(0, 50) + '...' : event.event}
              </p>
              <p className="type-label" style={{ margin: '4px 0 0', color: impactColor(event.kpiImpact) }}>
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
      {majorEvents.map((event, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-12)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '2px' }}>
            <div className={`status-dot ${dotClass(event.type)}`} style={{ width: '10px', height: '10px' }} />
            {i < majorEvents.length - 1 && (
              <div style={{ width: '2px', height: 'var(--spacing-24)', background: 'var(--color-border-subtle)', marginTop: 'var(--spacing-4)' }} />
            )}
          </div>
          <div>
            <p className="type-helper" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{event.time}</p>
            <p className="type-body-compact" style={{ margin: '2px 0 0' }}>
              {event.asset}
            </p>
            <p className="type-helper" style={{ margin: '2px 0 0', color: 'var(--color-text-secondary)' }}>
              {event.event.toLowerCase()}
            </p>
            <p className="type-label" style={{ margin: '4px 0 0', color: impactColor(event.kpiImpact) }}>
              {event.kpiImpact}
            </p>
          </div>
        </div>
      ))}
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
      <p className="section-header">Key Events</p>

      <div className="card" style={{ overflow: 'visible' }}>
        {isMobile ? <VerticalTimeline /> : <HorizontalTimeline />}

        {/* Link at bottom of card, right-aligned */}
        <div style={{ marginTop: 'var(--spacing-16)', textAlign: 'right' }}>
          <span className="type-link">See full timeline &rarr;</span>
        </div>
      </div>
    </section>
  )
}
