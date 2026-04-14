import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusIndicator, { statusLabel, STATUSES } from '../../components/ui/StatusIndicator'

describe('StatusIndicator', () => {
  it('renders tripped status with label', () => {
    render(<StatusIndicator status="tripped" />)
    expect(screen.getByText('Tripped')).toBeInTheDocument()
  })

  it('renders degraded status with label', () => {
    render(<StatusIndicator status="degraded" />)
    expect(screen.getByText('Degraded')).toBeInTheDocument()
  })

  it('renders running status with label', () => {
    render(<StatusIndicator status="running" />)
    expect(screen.getByText('Running')).toBeInTheDocument()
  })

  it('renders planned-outage status with label', () => {
    render(<StatusIndicator status="planned-outage" />)
    expect(screen.getByText('Planned')).toBeInTheDocument()
  })

  it('falls back to running for unknown status', () => {
    render(<StatusIndicator status="unknown" />)
    expect(screen.getByText('Running')).toBeInTheDocument()
  })

  it('renders compact mode as dot only with aria-label', () => {
    render(<StatusIndicator status="tripped" compact />)
    const dot = screen.getByLabelText('Tripped')
    expect(dot).toBeInTheDocument()
    expect(screen.queryByText('Tripped')).not.toBeInTheDocument()
  })

  it('renders dot with correct CSS class', () => {
    const { container } = render(<StatusIndicator status="tripped" />)
    const dot = container.querySelector('.status-dot')
    expect(dot).toBeInTheDocument()
    expect(dot.classList.contains('dot-tripped')).toBe(true)
  })
})

describe('statusLabel', () => {
  it('returns correct label for each status', () => {
    expect(statusLabel('tripped')).toBe('Tripped')
    expect(statusLabel('degraded')).toBe('Degraded')
    expect(statusLabel('running')).toBe('Running')
    expect(statusLabel('planned-outage')).toBe('Planned')
  })

  it('falls back to Running for unknown status', () => {
    expect(statusLabel('unknown')).toBe('Running')
  })
})

describe('STATUSES export', () => {
  it('has all four status entries', () => {
    expect(Object.keys(STATUSES)).toHaveLength(4)
    expect(STATUSES.tripped).toBeDefined()
    expect(STATUSES.degraded).toBeDefined()
    expect(STATUSES.running).toBeDefined()
    expect(STATUSES['planned-outage']).toBeDefined()
  })
})
