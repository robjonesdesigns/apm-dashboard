import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FilterButton from '../../components/ui/FilterButton'

const CATEGORIES = [
  {
    key: 'severity',
    label: 'Severity',
    options: ['critical', 'high', 'medium'],
    labelFn: (v) => v.charAt(0).toUpperCase() + v.slice(1),
  },
]

const EMPTY_FILTERS = { severity: [] }
const ACTIVE_FILTERS = { severity: ['critical'] }

describe('FilterButton', () => {
  it('renders with Filter text', () => {
    render(<FilterButton categories={CATEGORIES} filters={EMPTY_FILTERS} onToggle={() => {}} />)
    expect(screen.getByText('Filter')).toBeInTheDocument()
  })

  it('has correct aria attributes', () => {
    render(<FilterButton categories={CATEGORIES} filters={EMPTY_FILTERS} onToggle={() => {}} />)
    const btn = screen.getByLabelText('Filter')
    expect(btn.getAttribute('aria-expanded')).toBe('false')
    expect(btn.getAttribute('aria-haspopup')).toBe('listbox')
  })

  it('opens dropdown when clicked', () => {
    render(<FilterButton categories={CATEGORIES} filters={EMPTY_FILTERS} onToggle={() => {}} />)
    fireEvent.click(screen.getByLabelText('Filter'))
    expect(screen.getByText('Severity')).toBeInTheDocument()
    expect(screen.getByText('Critical')).toBeInTheDocument()
  })

  it('shows active count badge when filters are active', () => {
    render(<FilterButton categories={CATEGORIES} filters={ACTIVE_FILTERS} onToggle={() => {}} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('does not show count badge when no filters active', () => {
    render(<FilterButton categories={CATEGORIES} filters={EMPTY_FILTERS} onToggle={() => {}} />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = vi.fn()
    render(<FilterButton categories={CATEGORIES} filters={EMPTY_FILTERS} onToggle={onToggle} />)
    fireEvent.click(screen.getByLabelText('Filter'))
    const checkbox = screen.getByRole('checkbox', { name: /Critical/i })
    fireEvent.click(checkbox)
    expect(onToggle).toHaveBeenCalledWith('severity', 'critical')
  })

  it('closes dropdown on Escape key', () => {
    render(<FilterButton categories={CATEGORIES} filters={EMPTY_FILTERS} onToggle={() => {}} />)
    fireEvent.click(screen.getByLabelText('Filter'))
    expect(screen.getByText('Severity')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('Severity')).not.toBeInTheDocument()
  })
})
