// ── ImpactStrip ──────────────────────────────────────────────────────────────
// Horizontal timeline between KPIs and Today's Activity.
// Major events (KPI-impacting): large dots, evenly spaced, details below.
// Minor events: small muted dots, temporally positioned, tooltip on hover.
// ADR-012, ADR-013 Layer 1, ADR-014.

import { useState } from 'react'
import { TIMELINE } from '../../data/assets'

// Separate major (KPI impact) and minor events
const majorEvents = TIMELINE.filter(e => e.kpiImpact).slice(0, 3)
const minorEvents = TIMELINE.filter(e => !e.kpiImpact)

// Parse time string to minutes since midnight for positioning
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

// Get severity dot class
function dotClass(type) {
  if (type === 'critical') return 'dot-error'
  if (type === 'warning') return 'dot-warning'
  if (type === 'healthy') return 'dot-success'
  return 'dot-info'
}

// ── Minor dot with tooltip ──────────────────────────────────────────────────

function MinorDot({ event, style }) {
  const [show, setShow] = useState(false)

  return (
    <div
      style={{ position: 'absolute', ...style, zIndex: 2 }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-border-strong)',
          cursor: 'pointer',
          transition: 'background var(--motion-fast) var(--ease-productive)',
          ...(show ? { background: 'var(--color-text-secondary)' } : {}),
        }}
      />
      {show && (
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--color-tooltip-bg)',
            borderRadius: 'var(--radius-4)',
            padding: 'var(--spacing-8) var(--spacing-12)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            whiteSpace: 'nowrap',
            zIndex: 100,
            animation: 'fadeIn var(--motion-fast) var(--ease-productive)',
          }}
        >
          <p className="type-helper" style={{ color: 'var(--color-tooltip-text)', margin: 0 }}>
            {event.asset} · {event.event}
          </p>
          <p className="type-helper" style={{ color: 'var(--color-tooltip-text)', margin: 0, opacity: 0.7 }}>
            {event.time} · See full timeline for details
          </p>
        </div>
      )}
    </div>
  )
}

// ── Desktop horizontal timeline ─────────────────────────────────────────────

function HorizontalTimeline() {
  // Calculate time range for minor dot positioning
  const allTimes = TIMELINE.map(e => timeToMinutes(e.time))
  const minTime = Math.min(...allTimes)
  const maxTime = Math.max(...allTimes)
  const range = maxTime - minTime || 1

  // Evenly space major events
  const majorPositions = majorEvents.map((_, i) => (i / Math.max(majorEvents.length - 1, 1)) * 100)

  return (
    <div style={{ position: 'relative', padding: 'var(--spacing-8) 0 var(--spacing-48) 0' }}>

      {/* Timeline line */}
      <div
        style={{
          position: 'absolute',
          top: 'var(--spacing-8)',
          left: 0,
          right: 0,
          height: '2px',
          background: 'var(--color-border-subtle)',
          zIndex: 1,
        }}
      />

      {/* Minor dots (temporally positioned) */}
      {minorEvents.map((event, i) => {
        const t = timeToMinutes(event.time)
        const pct = ((t - minTime) / range) * 100
        return (
          <MinorDot
            key={`minor-${i}`}
            event={event}
            style={{ left: `${pct}%`, top: '5px', transform: 'translateX(-50%)' }}
          />
        )
      })}

      {/* Major dots (evenly spaced) */}
      {majorEvents.map((event, i) => (
        <div
          key={`major-${i}`}
          style={{
            position: 'absolute',
            left: `${majorPositions[i]}%`,
            top: '0',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 3,
          }}
        >
          {/* Dot */}
          <div
            className={`status-dot ${dotClass(event.type)}`}
            style={{ width: '10px', height: '10px', position: 'relative', zIndex: 3 }}
          />

          {/* Details below */}
          <div style={{ marginTop: 'var(--spacing-8)', textAlign: 'center', maxWidth: '200px' }}>
            <p className="type-helper" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              {event.time}
            </p>
            <p className="type-body-compact" style={{ margin: 0, marginTop: '2px' }}>
              {event.asset}
            </p>
            <p className="type-helper" style={{ margin: 0, marginTop: '2px', color: 'var(--color-text-secondary)' }}>
              {event.event.length > 40 ? event.event.substring(0, 40) + '...' : event.event}
            </p>
            {event.kpiImpact && (
              <span
                className="badge"
                style={{
                  marginTop: 'var(--spacing-4)',
                  display: 'inline-block',
                  background: event.kpiImpact.includes('-') ? 'var(--color-error-bg)' : 'var(--color-success-bg)',
                  color: event.kpiImpact.includes('-') ? 'var(--color-error)' : 'var(--color-success)',
                  border: '1px solid',
                  borderColor: event.kpiImpact.includes('-') ? 'var(--color-error)' : 'var(--color-success)',
                }}
              >
                {event.kpiImpact}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Mobile vertical timeline ────────────────────────────────────────────────

function VerticalTimeline() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
      {majorEvents.map((event, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-12)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '2px' }}>
            <div className={`status-dot ${dotClass(event.type)}`} style={{ width: '10px', height: '10px' }} />
            {i < majorEvents.length - 1 && (
              <div style={{ width: '2px', height: 'var(--spacing-32)', background: 'var(--color-border-subtle)', marginTop: 'var(--spacing-4)' }} />
            )}
          </div>
          <div>
            <p className="type-helper" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{event.time}</p>
            <p className="type-body-compact" style={{ margin: 0, marginTop: '2px' }}>
              <strong>{event.asset}</strong> — {event.event.toLowerCase()}
            </p>
            {event.kpiImpact && (
              <span
                className="badge"
                style={{
                  marginTop: 'var(--spacing-4)',
                  display: 'inline-block',
                  background: event.kpiImpact.includes('-') ? 'var(--color-error-bg)' : 'var(--color-success-bg)',
                  color: event.kpiImpact.includes('-') ? 'var(--color-error)' : 'var(--color-success)',
                  border: '1px solid',
                  borderColor: event.kpiImpact.includes('-') ? 'var(--color-error)' : 'var(--color-success)',
                }}
              >
                {event.kpiImpact}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── ImpactStrip ─────────────────────────────────────────────────────────────

export default function ImpactStrip() {
  if (majorEvents.length === 0) return null

  // Detect mobile via matchMedia (SSR safe)
  const [isMobile, setIsMobile] = useState(false)
  if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(max-width: 671px)')
    if (mq.matches !== isMobile) setIsMobile(mq.matches)
  }

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-16)' }}>
        <p className="section-header" style={{ margin: 0 }}>Key Events</p>
        <span className="type-link">See full timeline &rarr;</span>
      </div>

      <div
        className="card"
        style={{ overflow: 'visible' }}
      >
        {isMobile ? <VerticalTimeline /> : <HorizontalTimeline />}
      </div>
    </section>
  )
}
