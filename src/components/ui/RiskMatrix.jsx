import { useState } from 'react'
import { RISK_MATRIX } from '../../data/assets'

const ROW_CONFIG = [
  {
    priority: 'High',
    bg: 'var(--color-error-bg)',
    color: 'var(--color-error)',
    border: 'var(--color-error)',
  },
  {
    priority: 'Medium',
    bg: 'var(--color-warning-bg)',
    color: 'var(--color-warning)',
    border: 'var(--color-warning)',
  },
  {
    priority: 'Low',
    bg: 'var(--color-success-bg)',
    color: 'var(--color-success)',
    border: 'var(--color-success)',
  },
]

function MatrixCell({ count, bg, color, isHovered, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background: bg,
        borderRadius: 'var(--radius-8)',
        padding: 'var(--spacing-12)',
        border: `1px solid ${isHovered ? 'var(--color-accent)' : 'transparent'}`,
        cursor: 'pointer',
        transition: 'all var(--motion-fast) var(--ease-productive)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <span className="type-heading-02" style={{ color, fontVariantNumeric: 'tabular-nums' }}>
        {count}
      </span>
    </button>
  )
}

export default function RiskMatrix({ onCellClick }) {
  const [hoveredCell, setHoveredCell] = useState(null)

  const handleCellClick = (priority, status) => {
    if (onCellClick) onCellClick({ priority, status })
  }

  const handleMouseEnter = (priority, status) => {
    setHoveredCell(`${priority}-${status}`)
  }

  const handleMouseLeave = () => {
    setHoveredCell(null)
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
      {/* Header */}
      <span className="type-heading-02" style={{ color: 'var(--color-card-title)' }}>Risk Matrix</span>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr 1fr',
          gap: 'var(--spacing-8)',
          alignItems: 'center',
        }}
      >
        {/* Top-left empty cell */}
        <div />

        {/* Column headers */}
        <span className="type-label" style={{ textAlign: 'center' }}>New</span>
        <span className="type-label" style={{ textAlign: 'center' }}>In Progress</span>

        {/* Rows */}
        {RISK_MATRIX.map((row) => {
          const config = ROW_CONFIG.find((c) => c.priority === row.priority)
          return (
            <>
              {/* Row label */}
              <span
                key={`label-${row.priority}`}
                className="type-body-01"
                style={{ fontWeight: 600, color: config.color }}
              >
                {row.priority}
              </span>

              {/* New cell */}
              <MatrixCell
                key={`${row.priority}-new`}
                count={row.newEvents}
                bg={config.bg}
                color={config.color}
                isHovered={hoveredCell === `${row.priority}-New`}
                onClick={() => handleCellClick(row.priority, 'New')}
                onMouseEnter={() => handleMouseEnter(row.priority, 'New')}
                onMouseLeave={handleMouseLeave}
              />

              {/* In Progress cell */}
              <MatrixCell
                key={`${row.priority}-inprogress`}
                count={row.inProgress}
                bg={config.bg}
                color={config.color}
                isHovered={hoveredCell === `${row.priority}-In Progress`}
                onClick={() => handleCellClick(row.priority, 'In Progress')}
                onMouseEnter={() => handleMouseEnter(row.priority, 'In Progress')}
                onMouseLeave={handleMouseLeave}
              />
            </>
          )
        })}
      </div>

      {/* Priority gradient bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div
          style={{
            display: 'flex',
            height: '4px',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}
        >
          <div style={{ flex: 1, background: 'var(--color-error)' }} />
          <div style={{ flex: 1, background: 'var(--color-warning)' }} />
          <div style={{ flex: 1, background: 'var(--color-success)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="type-helper">High</span>
          <span className="type-helper">Medium</span>
          <span className="type-helper">Low</span>
        </div>
      </div>
    </div>
  )
}
