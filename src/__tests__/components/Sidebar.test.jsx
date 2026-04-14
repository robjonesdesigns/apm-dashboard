import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Sidebar from '../../components/Sidebar'

describe('Sidebar', () => {
  const defaultProps = {
    view: 'overview',
    onNavigate: vi.fn(),
    isMobile: false,
    open: false,
    onClose: vi.fn(),
  }

  it('renders navigation landmark with correct aria-label', () => {
    render(<Sidebar {...defaultProps} />)
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
  })

  it('renders all four nav items as buttons', () => {
    render(<Sidebar {...defaultProps} />)
    expect(screen.getByLabelText('Plant Overview')).toBeInTheDocument()
    expect(screen.getByLabelText('Events')).toBeInTheDocument()
    expect(screen.getByLabelText('Work Orders')).toBeInTheDocument()
    expect(screen.getByLabelText('Investigations')).toBeInTheDocument()
  })

  it('renders settings button', () => {
    render(<Sidebar {...defaultProps} />)
    expect(screen.getByLabelText('Settings')).toBeInTheDocument()
  })

  it('marks the active view with aria-current', () => {
    render(<Sidebar {...defaultProps} view="events" />)
    const eventsBtn = screen.getByLabelText('Events')
    expect(eventsBtn.getAttribute('aria-current')).toBe('page')

    const overviewBtn = screen.getByLabelText('Plant Overview')
    expect(overviewBtn.getAttribute('aria-current')).toBeNull()
  })

  it('calls onNavigate when a nav item is clicked', () => {
    const onNavigate = vi.fn()
    render(<Sidebar {...defaultProps} onNavigate={onNavigate} />)
    fireEvent.click(screen.getByLabelText('Events'))
    expect(onNavigate).toHaveBeenCalledWith('events')
  })

  it('returns null on mobile when not open', () => {
    const { container } = render(<Sidebar {...defaultProps} isMobile open={false} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders on mobile when open', () => {
    render(<Sidebar {...defaultProps} isMobile open />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('shows plant name in mobile header', () => {
    render(<Sidebar {...defaultProps} isMobile open />)
    expect(screen.getByText('Baytown Refinery')).toBeInTheDocument()
  })
})
