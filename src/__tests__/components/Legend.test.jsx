import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Legend from '../../components/ui/Legend'

const ITEMS = [
  { label: 'Alpha', color: '#ff0000', value: 42 },
  { label: 'Beta',  color: '#00ff00', value: 18 },
  { label: 'Gamma', color: '#0000ff' },
]

describe('Legend', () => {
  it('renders all item labels', () => {
    render(<Legend items={ITEMS} />)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
  })

  it('renders values when provided', () => {
    render(<Legend items={ITEMS} />)
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('18')).toBeInTheDocument()
  })

  it('does not render value for items without value', () => {
    render(<Legend items={[{ label: 'NoVal', color: '#000' }]} />)
    const container = screen.getByText('NoVal').closest('div')
    // Should only have label and swatch, no value span
    expect(container.children).toHaveLength(2)
  })

  it('renders title when provided', () => {
    render(<Legend items={ITEMS} title="Test Legend" />)
    expect(screen.getByText('Test Legend')).toBeInTheDocument()
  })

  it('renders buttons when interactive', () => {
    const onClick = vi.fn()
    render(<Legend items={ITEMS} interactive onItemClick={onClick} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(ITEMS.length)
  })

  it('calls onItemClick with label when interactive item clicked', () => {
    const onClick = vi.fn()
    render(<Legend items={ITEMS} interactive onItemClick={onClick} />)
    fireEvent.click(screen.getByText('Alpha'))
    expect(onClick).toHaveBeenCalledWith('Alpha')
  })

  it('dims non-active items when activeItem is set', () => {
    const { container } = render(<Legend items={ITEMS} activeItem="Alpha" />)
    const itemElements = container.querySelectorAll('.flex.items-center.gap-8')
    // Alpha should have opacity 1, others 0.35
    const alphaEl = Array.from(itemElements).find(el => el.textContent.includes('Alpha'))
    const betaEl = Array.from(itemElements).find(el => el.textContent.includes('Beta'))
    expect(alphaEl.style.opacity).toBe('1')
    expect(betaEl.style.opacity).toBe('0.35')
  })

  it('uses group role when interactive', () => {
    render(<Legend items={ITEMS} interactive />)
    expect(screen.getByRole('group')).toBeInTheDocument()
  })
})
