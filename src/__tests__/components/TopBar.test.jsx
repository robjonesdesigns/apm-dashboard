import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TopBar from '../../components/TopBar'

describe('TopBar', () => {
  const defaultProps = {
    view: 'overview',
    selectedAsset: null,
    onNavigate: vi.fn(),
    onToggleNotifications: vi.fn(),
    notificationsOpen: false,
    onToggleHelp: vi.fn(),
    helpOpen: false,
    onToggleSidebar: vi.fn(),
    isMobile: false,
    dense: true,
    onToggleDense: vi.fn(),
  }

  it('renders as a banner landmark', () => {
    render(<TopBar {...defaultProps} />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders the app title on desktop', () => {
    render(<TopBar {...defaultProps} />)
    expect(screen.getByText('Asset Performance Management')).toBeInTheDocument()
  })

  it('renders breadcrumb with plant name', () => {
    render(<TopBar {...defaultProps} />)
    expect(screen.getByText('Baytown Refinery')).toBeInTheDocument()
  })

  it('renders notification bell button', () => {
    render(<TopBar {...defaultProps} />)
    // aria-label includes alert count, e.g. "Notifications, 11 alerts"
    const btn = screen.getByLabelText(/^Notifications/)
    expect(btn).toBeInTheDocument()
  })

  it('calls onToggleNotifications when bell clicked', () => {
    const onToggleNotifications = vi.fn()
    render(<TopBar {...defaultProps} onToggleNotifications={onToggleNotifications} />)
    fireEvent.click(screen.getByLabelText(/^Notifications/))
    expect(onToggleNotifications).toHaveBeenCalledTimes(1)
  })

  it('renders density toggle as a radiogroup', () => {
    render(<TopBar {...defaultProps} />)
    expect(screen.getByRole('radiogroup', { name: 'View density' })).toBeInTheDocument()
  })

  it('shows Comfortable view as checked when not dense', () => {
    render(<TopBar {...defaultProps} dense={false} />)
    const comfortable = screen.getByLabelText('Comfortable view')
    expect(comfortable.getAttribute('aria-checked')).toBe('true')
  })

  it('shows Compact view as checked when dense', () => {
    render(<TopBar {...defaultProps} dense={true} />)
    const compact = screen.getByLabelText('Compact view')
    expect(compact.getAttribute('aria-checked')).toBe('true')
  })

  it('calls onToggleDense when density button clicked', () => {
    const onToggleDense = vi.fn()
    render(<TopBar {...defaultProps} dense={false} onToggleDense={onToggleDense} />)
    fireEvent.click(screen.getByLabelText('Compact view'))
    expect(onToggleDense).toHaveBeenCalledTimes(1)
  })

  it('shows hamburger menu on mobile instead of logo', () => {
    render(<TopBar {...defaultProps} isMobile />)
    expect(screen.getByLabelText('Menu')).toBeInTheDocument()
  })

  it('shows breadcrumb with asset name for inspection view', () => {
    render(<TopBar {...defaultProps} view="inspection" selectedAsset={{ name: 'Compressor K-101' }} />)
    expect(screen.getByText('Compressor K-101')).toBeInTheDocument()
  })
})
