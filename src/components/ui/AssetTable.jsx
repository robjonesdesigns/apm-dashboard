import { useState } from 'react'
import { ASSETS } from '../../data/assets'

// Status dot variant from asset status
function statusDotVariant(status) {
  if (status === 'tripped')       return 'status-dot-critical'
  if (status === 'degraded')      return 'status-dot-warning'
  if (status === 'planned-outage') return 'status-dot-info'
  return 'status-dot-healthy'
}

// Priority badge variant
function priorityBadgeVariant(priority) {
  if (priority === 'high')   return 'badge-critical'
  if (priority === 'medium') return 'badge-warning'
  return 'badge-healthy'
}

// OEE color
function oeeColor(oee) {
  if (oee > 85) return 'var(--color-healthy)'
  if (oee > 70) return 'var(--color-warning)'
  return 'var(--color-critical)'
}

const COL_STYLES = {
  status:     { width: 40,  flexShrink: 0, textAlign: 'center' },
  asset:      { flex: 1,    minWidth: 140 },
  priority:   { width: 80,  flexShrink: 0 },
  oee:        { width: 64,  flexShrink: 0, textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  events:     { width: 64,  flexShrink: 0, textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  repetitive: { width: 80,  flexShrink: 0, textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  downtime:   { width: 72,  flexShrink: 0, textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  workOrders: { width: 88,  flexShrink: 0, textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  rul:        { width: 80,  flexShrink: 0, textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
}

const ROW_STYLE = {
  display:       'flex',
  alignItems:    'center',
  gap:           'var(--spacing-16)',
  padding:       'var(--spacing-8) var(--spacing-12)',
  cursor:        'pointer',
  transition:    'all 0.15s ease',
  borderBottom:  '1px solid var(--color-border)',
  borderLeft:    '2px solid transparent',
}

function AssetRow({ asset, onAssetClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={() => onAssetClick && onAssetClick(asset)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...ROW_STYLE,
        background:  hovered ? 'var(--color-surface-hover)' : 'transparent',
        borderLeft:  hovered ? '2px solid var(--color-accent)' : '2px solid transparent',
      }}
    >
      {/* Status */}
      <div style={{ ...COL_STYLES.status, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span className={`status-dot ${statusDotVariant(asset.status)}`} />
      </div>

      {/* Asset name + type */}
      <div style={COL_STYLES.asset}>
        <div
          className="type-body"
          style={{
            color:      hovered ? 'var(--color-accent)' : undefined,
            transition: 'color 0.15s ease',
          }}
        >
          {asset.name}
        </div>
        <div className="type-meta">{asset.type}</div>
      </div>

      {/* Priority */}
      <div style={COL_STYLES.priority}>
        <span className={`badge ${priorityBadgeVariant(asset.priority)}`}>
          {asset.priority}
        </span>
      </div>

      {/* OEE */}
      <div
        className="type-body"
        style={{ ...COL_STYLES.oee, color: oeeColor(asset.oee) }}
      >
        {asset.oee}%
      </div>

      {/* Events */}
      <div
        className="type-body"
        style={{
          ...COL_STYLES.events,
          color: asset.activeEvents > 0 ? 'var(--color-critical)' : undefined,
        }}
      >
        {asset.activeEvents}
      </div>

      {/* Repetitive events */}
      <div
        className="type-body"
        title={asset.repetitiveEvents > 0 ? 'Possible chattering' : undefined}
        style={{
          ...COL_STYLES.repetitive,
          color: asset.repetitiveEvents > 0 ? 'var(--color-warning)' : undefined,
        }}
      >
        {asset.repetitiveEvents}
      </div>

      {/* Downtime */}
      <div className="type-body" style={COL_STYLES.downtime}>
        {asset.downtime}
      </div>

      {/* Work Orders */}
      <div className="type-body" style={COL_STYLES.workOrders}>
        {asset.workOrders}
      </div>

      {/* RUL */}
      <div className="type-body" style={COL_STYLES.rul}>
        {asset.rul}
      </div>
    </div>
  )
}

export default function AssetTable({ onAssetClick }) {
  return (
    <div className="grid-12">
      <div className="card col-full" style={{ padding: 0 }}>
        {/* Card header */}
        <div style={{ padding: 'var(--spacing-16) var(--spacing-24) var(--spacing-12)' }}>
          <span className="type-h4">All Assets</span>
        </div>

        {/* Scrollable table area */}
        <div style={{ overflowX: 'auto' }}>
          {/* Sticky header */}
          <div
            style={{
              display:         'flex',
              alignItems:      'center',
              gap:             'var(--spacing-16)',
              padding:         'var(--spacing-8) var(--spacing-12)',
              background:      'var(--color-surface-raised)',
              borderTop:       '1px solid var(--color-border)',
              borderBottom:    '1px solid var(--color-border)',
              position:        'sticky',
              top:             0,
              zIndex:          1,
              minWidth:        700,
            }}
          >
            <div className="type-label" style={COL_STYLES.status}>St.</div>
            <div className="type-label" style={COL_STYLES.asset}>Asset</div>
            <div className="type-label" style={COL_STYLES.priority}>Priority</div>
            <div className="type-label" style={{ ...COL_STYLES.oee, textAlign: 'right' }}>OEE</div>
            <div className="type-label" style={{ ...COL_STYLES.events, textAlign: 'right' }}>Events</div>
            <div className="type-label" style={{ ...COL_STYLES.repetitive, textAlign: 'right' }}>Repetitive</div>
            <div className="type-label" style={{ ...COL_STYLES.downtime, textAlign: 'right' }}>Downtime</div>
            <div className="type-label" style={{ ...COL_STYLES.workOrders, textAlign: 'right' }}>Work Orders</div>
            <div className="type-label" style={{ ...COL_STYLES.rul, textAlign: 'right' }}>RUL</div>
          </div>

          {/* Rows */}
          <div style={{ minWidth: 700 }}>
            {ASSETS.map(asset => (
              <AssetRow
                key={asset.id}
                asset={asset}
                onAssetClick={onAssetClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
