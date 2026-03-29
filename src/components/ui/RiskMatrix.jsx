import { useState } from 'react'
import { RISK_MATRIX } from '../../data/assets'
import FilterChip from './FilterChip'

const CRITICALITY_CONFIG = [
  { key: 'A', label: 'A (Safety)',      color: 'var(--color-error)',   bg: 'var(--color-error-bg)' },
  { key: 'B', label: 'B (Production)', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
  { key: 'C', label: 'C (Support)',    color: 'var(--color-info)',    bg: 'var(--color-info-bg)' },
]

const STATUSES = ['New', 'In Progress']

function cellKey(criticality, status) {
  return `${criticality}-${status}`
}

function MatrixCell({ count, bg, isHovered, isSelected, onClick, onMouseEnter, onMouseLeave, label }) {
  const borderColor = isSelected || isHovered
    ? 'var(--color-accent)'
    : 'transparent'

  const background = isSelected ? 'var(--color-accent-bg)' : bg

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={label}
      aria-pressed={isSelected}
      style={{
        background,
        borderRadius: 'var(--radius-8)',
        padding: 'var(--spacing-12)',
        border: `2px solid ${borderColor}`,
        cursor: 'pointer',
        transition: 'all var(--motion-fast) var(--ease-productive)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
      }}
    >
      <span
        className="type-body"
        style={{
          color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600,
        }}
      >
        {count}
      </span>
    </button>
  )
}

const CRIT_LABELS = { A: 'A (Safety)', B: 'B (Production)', C: 'C (Support)' }

export default function RiskMatrix({ onCellClick, selectedCell, onClearFilter }) {
  const [hoveredCell, setHoveredCell] = useState(null)

  function isSelected(criticality, status) {
    if (!selectedCell) return false
    return selectedCell.criticality === criticality && selectedCell.status === status
  }

  function handleClick(criticality, status) {
    onCellClick?.({ criticality, status })
  }

  // Build data lookup
  const dataByCriticality = {}
  RISK_MATRIX.forEach(row => { dataByCriticality[row.criticality] = row })

  const legendItems = CRITICALITY_CONFIG.map(c => {
    const row = dataByCriticality[c.key]
    const total = row ? row.newEvents + row.inProgress : 0
    return { label: c.label, color: c.color, value: total }
  })

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-8)' }}>
        <span className="type-card-title">Event Triage</span>
        {selectedCell && (
          <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
            <FilterChip
              label={CRIT_LABELS[selectedCell.criticality] || selectedCell.criticality}
              onClear={onClearFilter}
            />
            <FilterChip
              label={selectedCell.status}
              onClear={onClearFilter}
            />
          </div>
        )}
      </div>

      {/* Grid: criticality on x-axis (columns), status on y-axis (rows) */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '90px repeat(3, 1fr)',
            gap: 'var(--spacing-8)',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Rows */}
          {STATUSES.map(status => {
            const statusKey = status === 'New' ? 'newEvents' : 'inProgress'
            return (
              <div key={status} style={{ display: 'contents' }}>
                <span className="type-label" style={{ color: 'var(--color-text-secondary)' }}>
                  {status}
                </span>
                {CRITICALITY_CONFIG.map(c => {
                  const row = dataByCriticality[c.key]
                  const count = row ? row[statusKey] : 0
                  const key = cellKey(c.key, status)
                  return (
                    <MatrixCell
                      key={key}
                      count={count}
                      bg={c.bg}
                      isHovered={hoveredCell === key}
                      isSelected={isSelected(c.key, status)}
                      onClick={() => handleClick(c.key, status)}
                      onMouseEnter={() => setHoveredCell(key)}
                      onMouseLeave={() => setHoveredCell(null)}
                      label={`${count} ${status.toLowerCase()} events on criticality ${c.key} assets`}
                    />
                  )
                })}
              </div>
            )
          })}

          {/* Column labels below grid */}
          <div />
          {CRITICALITY_CONFIG.map(c => (
            <span key={c.key} className="type-label" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              {c.key}
            </span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-8)', marginTop: 'auto', paddingTop: 'var(--spacing-16)' }}>
        <span className="type-body" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Asset Criticality</span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-16)', flexWrap: 'wrap' }}>
          {legendItems.map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color, flexShrink: 0 }} />
              <span className="type-label" style={{ letterSpacing: '0.2px' }}>{item.label}</span>
              <span className="type-label" style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
