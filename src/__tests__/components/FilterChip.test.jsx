import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FilterChip from '../../components/ui/FilterChip'

describe('FilterChip', () => {
  it('renders the label text', () => {
    render(<FilterChip label="Critical" onClear={() => {}} />)
    expect(screen.getByText('Critical')).toBeInTheDocument()
  })

  it('renders dismiss button with correct aria-label', () => {
    render(<FilterChip label="Critical" onClear={() => {}} />)
    expect(screen.getByLabelText('Clear filter: Critical')).toBeInTheDocument()
  })

  it('calls onClear when clicked', () => {
    const onClear = vi.fn()
    render(<FilterChip label="Critical" onClear={onClear} />)
    fireEvent.click(screen.getByLabelText('Clear filter: Critical'))
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('renders the times symbol for dismiss', () => {
    const { container } = render(<FilterChip label="Test" onClear={() => {}} />)
    // The times symbol is rendered as the second span child
    expect(container.textContent).toContain('\u00d7')
  })
})
