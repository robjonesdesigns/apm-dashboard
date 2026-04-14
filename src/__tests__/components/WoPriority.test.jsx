import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WoPriority from '../../components/ui/WoPriority'

describe('WoPriority', () => {
  it('renders emergency urgency with label', () => {
    render(<WoPriority urgency="emergency" />)
    expect(screen.getByText('Emergency')).toBeInTheDocument()
  })

  it('renders urgent urgency with label', () => {
    render(<WoPriority urgency="urgent" />)
    expect(screen.getByText('Urgent')).toBeInTheDocument()
  })

  it('renders scheduled urgency with label', () => {
    render(<WoPriority urgency="scheduled" />)
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
  })

  it('returns null for invalid urgency', () => {
    const { container } = render(<WoPriority urgency="invalid" />)
    expect(container.innerHTML).toBe('')
  })

  it('renders an SVG icon for each urgency level', () => {
    const { container: c1 } = render(<WoPriority urgency="emergency" />)
    expect(c1.querySelector('svg')).toBeInTheDocument()

    const { container: c2 } = render(<WoPriority urgency="urgent" />)
    expect(c2.querySelector('svg')).toBeInTheDocument()

    const { container: c3 } = render(<WoPriority urgency="scheduled" />)
    expect(c3.querySelector('svg')).toBeInTheDocument()
  })

  it('SVG icons are aria-hidden', () => {
    const { container } = render(<WoPriority urgency="emergency" />)
    const svg = container.querySelector('svg')
    expect(svg.getAttribute('aria-hidden')).toBe('true')
  })
})
