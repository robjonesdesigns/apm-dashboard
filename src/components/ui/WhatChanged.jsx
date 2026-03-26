import { useState } from 'react'
import { TIMELINE } from '../../data/assets'

// Map event type to status-dot variant
function dotVariant(type) {
  if (type === 'critical') return 'status-dot-critical'
  if (type === 'warning')  return 'status-dot-warning'
  if (type === 'healthy')  return 'status-dot-healthy'
  return 'status-dot-info'
}

// KPI impact pill — negative = critical-bg, positive = healthy-bg
function KpiPill({ impact }) {
  if (!impact) return null
  const isNegative = impact.includes('-')
  const bg  = isNegative ? 'var(--color-critical-bg)' : 'var(--color-healthy-bg)'
  const col = isNegative ? 'var(--color-critical)'    : 'var(--color-healthy)'
  return (
    <span
      className="type-meta"
      style={{
        background:   bg,
        color:        col,
        padding:      '2px var(--spacing-6)',
        borderRadius: 'var(--radius-4)',
        whiteSpace:   'nowrap',
        flexShrink:   0,
      }}
    >
      {impact}
    </span>
  )
}

function TimelineRow({ event, onAssetClick, onEventClick }) {
  const [hovered, setHovered] = useState(false)

  function handleClick() {
    if (onEventClick) onEventClick(event)
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:         'flex',
        alignItems:      'flex-start',
        gap:             'var(--spacing-12)',
        padding:         'var(--spacing-8) var(--spacing-12)',
        borderRadius:    'var(--radius-6)',
        background:      hovered ? 'var(--color-surface-hover)' : 'transparent',
        transition:      'background 0.15s ease',
        cursor:          onEventClick ? 'pointer' : 'default',
        position:        'relative',
      }}
    >
      {/* Timestamp */}
      <span
        className="type-body-sm"
        style={{
          width:      60,
          flexShrink: 0,
          paddingTop: 2,
        }}
      >
        {event.time}
      </span>

      {/* Dot + line column */}
      <div
        style={{
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          flexShrink:     0,
          paddingTop:     6,
        }}
      >
        <span className={`status-dot ${dotVariant(event.type)}`} />
      </div>

      {/* Event text */}
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 'var(--spacing-6)' }}>
        <span className="type-body">
          {event.event}{' '}
          <span
            className="type-body"
            onClick={e => { e.stopPropagation(); onAssetClick && onAssetClick(event.assetId) }}
            style={{
              color:  'var(--color-accent)',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {event.asset}
          </span>
        </span>
        <KpiPill impact={event.kpiImpact} />
      </div>
    </div>
  )
}

export default function WhatChanged({ onAssetClick, onEventClick }) {
  // Most recent at top
  const reversed = [...TIMELINE].reverse()

  return (
    <div className="grid-12">
      <div className="card col-full">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-16)' }}>
          <span className="type-h4">What Changed</span>
          <span className="type-body-sm">Last 24 hours</span>
        </div>

        {/* Vertical timeline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div
            style={{
              position:        'absolute',
              top:             14,
              // align with center of dot: timestamp(60) + gap(12) + half-dot(4) + padding(12) = 88
              left:            88,
              width:           2,
              bottom:          14,
              background:      'var(--color-border-strong)',
              borderRadius:    'var(--radius-4)',
              pointerEvents:   'none',
            }}
          />

          {reversed.map((event, i) => (
            <TimelineRow
              key={i}
              event={event}
              onAssetClick={onAssetClick}
              onEventClick={onEventClick}
            />
          ))}
        </div>

        {/* Correlation note */}
        <div
          style={{
            marginTop:    'var(--spacing-16)',
            background:   'var(--color-accent-subtle)',
            borderRadius: 'var(--radius-8)',
            padding:      'var(--spacing-12) var(--spacing-16)',
          }}
        >
          <span className="type-body-sm">
            Availability dropped 12.1% at 2:03 AM, correlating with K-101 compressor trip
          </span>
        </div>
      </div>
    </div>
  )
}
