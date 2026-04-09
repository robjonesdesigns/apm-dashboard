import { useState, useRef, useCallback } from 'react'
import { RISK_MATRIX } from '../../data/baytown'
import FilterChip from './FilterChip'
import CriticalityIndicator from './CriticalityIndicator'
import Legend from './Legend'
import useIsMobile from '../../hooks/useIsMobile'

const CRITICALITY_CONFIG = [
  { key: 'A', label: 'A (Safety)',      color: 'var(--color-error)',   bg: 'var(--color-error-bg-strong)' },
  { key: 'B', label: 'B (Production)', color: 'var(--color-warning)', bg: 'var(--color-warning-bg-strong)' },
  { key: 'C', label: 'C (Support)',    color: 'var(--color-info)',    bg: 'var(--color-info-bg-strong)' },
]

const STATUSES = ['New', 'In Progress']

function cellKey(criticality, status) {
  return `${criticality}-${status}`
}

function MatrixCell({ count, bg, isHovered, isSelected, onClick, onMouseEnter, onMouseLeave, onFocus, onBlur, label }) {
  const borderColor = isSelected || isHovered
    ? 'var(--color-accent)'
    : 'transparent'

  const background = isSelected ? 'var(--color-accent-bg)' : bg

  return (
    <button
      className="btn-reset flex items-center justify-center rounded-[var(--radius-8)]"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-label={label}
      aria-pressed={isSelected}
      style={{
        background,
        border: `2px solid ${borderColor}`,
        padding: 'var(--spacing-12)',
        transition: 'all var(--motion-fast) var(--ease-productive)',
        minHeight: 48,
      }}
    >
      <span
        className="type-body font-semibold tabular-nums"
        style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)' }}
      >
        {count}
      </span>
    </button>
  )
}

const CRIT_LABELS = { A: 'A (Safety)', B: 'B (Production)', C: 'C (Support)' }

function MatrixTooltip({ hoveredCell, dataByCriticality, x, y }) {
  if (!hoveredCell) return null

  const [crit, status] = hoveredCell.split('-')
  const statusKey = status === 'New' ? 'newEvents' : 'inProgress'
  const row = dataByCriticality[crit]
  const count = row ? row[statusKey] : 0

  return (
    <div
      className="tooltip-fixed"
      style={{ left: x + 12, top: y - 8 }}
    >
      <div className="tooltip-bubble flex flex-col gap-4 rounded-[var(--radius-4)] py-8 px-12 whitespace-nowrap">
        <div className="flex items-center gap-8">
          <span className="type-meta">{status} Events</span>
          <span className="type-meta font-semibold">{count}</span>
        </div>
        <div className="flex items-center gap-8">
          <span className="type-meta">Asset Criticality</span>
          <CriticalityIndicator level={crit} inverted />
        </div>
        <span className="type-meta opacity-60">Click to filter Asset Table</span>
      </div>
    </div>
  )
}

export default function RiskMatrix({ onCellClick, selectedCell, onClearFilter }) {
  const isMobile = useIsMobile()
  const [hoveredCell, setHoveredCell] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const focusedElRef = useRef(null)

  const getTooltipPos = useCallback(() => {
    if (focusedElRef.current) {
      const r = focusedElRef.current.getBoundingClientRect()
      return { x: r.right, y: r.top }
    }
    return mousePos
  }, [mousePos])

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
    <div
      className="card flex flex-col gap-16"
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      {/* Tooltip (desktop only) */}
      {!isMobile && <MatrixTooltip hoveredCell={hoveredCell} dataByCriticality={dataByCriticality} x={getTooltipPos().x} y={getTooltipPos().y} />}

      {/* Header */}
      <div className="flex items-center justify-between gap-8 flex-wrap">
        <span className="type-card-title">Event Triage</span>
        {selectedCell && (
          <div className="flex gap-4">
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
      <div className="flex-1 flex items-center">
        <div className="grid w-full gap-8 items-center" style={{ gridTemplateColumns: '90px repeat(3, 1fr)' }}>
          {/* Rows */}
          {STATUSES.map(status => {
            const statusKey = status === 'New' ? 'newEvents' : 'inProgress'
            return (
              <div key={status} style={{ display: 'contents' }}>
                <span className="type-label text-[var(--color-text-secondary)]">
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
                      onFocus={(e) => { focusedElRef.current = e.currentTarget; setHoveredCell(key) }}
                      onBlur={() => { focusedElRef.current = null; setHoveredCell(null) }}
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
            <span key={c.key} className="type-label text-center text-[var(--color-text-secondary)]">
              {c.key}
            </span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <Legend items={legendItems} shape="square" title="Asset Criticality" />
    </div>
  )
}
