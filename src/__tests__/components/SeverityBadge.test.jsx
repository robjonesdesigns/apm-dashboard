import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SeverityBadge from '../../components/ui/SeverityBadge'

describe('SeverityBadge', () => {
  it('renders critical badge with label', () => {
    render(<SeverityBadge severity="critical" />)
    expect(screen.getByLabelText('Critical')).toBeInTheDocument()
    expect(screen.getByText('Critical')).toBeInTheDocument()
  })

  it('renders high badge with label', () => {
    render(<SeverityBadge severity="high" />)
    expect(screen.getByLabelText('High')).toBeInTheDocument()
  })

  it('renders medium badge with label', () => {
    render(<SeverityBadge severity="medium" />)
    expect(screen.getByLabelText('Medium')).toBeInTheDocument()
  })

  it('renders low badge with label', () => {
    render(<SeverityBadge severity="low" />)
    expect(screen.getByLabelText('Low')).toBeInTheDocument()
  })

  it('renders compact mode without text label', () => {
    render(<SeverityBadge severity="critical" compact />)
    expect(screen.getByLabelText('Critical')).toBeInTheDocument()
    expect(screen.queryByText('Critical')).not.toBeInTheDocument()
  })

  it('returns null for invalid severity', () => {
    const { container } = render(<SeverityBadge severity="invalid" />)
    expect(container.innerHTML).toBe('')
  })

  it('renders correct number of tally bars', () => {
    const { container } = render(<SeverityBadge severity="critical" />)
    const tally = container.querySelector('.badge-tally')
    expect(tally.children).toHaveLength(4)
  })

  it('renders 3 tally bars for high', () => {
    const { container } = render(<SeverityBadge severity="high" />)
    const tally = container.querySelector('.badge-tally')
    expect(tally.children).toHaveLength(3)
  })

  it('renders 2 tally bars for medium', () => {
    const { container } = render(<SeverityBadge severity="medium" />)
    const tally = container.querySelector('.badge-tally')
    expect(tally.children).toHaveLength(2)
  })

  it('renders 1 tally bar for low', () => {
    const { container } = render(<SeverityBadge severity="low" />)
    const tally = container.querySelector('.badge-tally')
    expect(tally.children).toHaveLength(1)
  })
})
