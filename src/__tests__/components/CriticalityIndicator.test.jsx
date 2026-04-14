import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CriticalityIndicator from '../../components/ui/CriticalityIndicator'

describe('CriticalityIndicator', () => {
  it('renders level A with Safety label', () => {
    render(<CriticalityIndicator level="A" />)
    expect(screen.getByText('A (Safety)')).toBeInTheDocument()
  })

  it('renders level B with Production label', () => {
    render(<CriticalityIndicator level="B" />)
    expect(screen.getByText('B (Production)')).toBeInTheDocument()
  })

  it('renders level C with Support label', () => {
    render(<CriticalityIndicator level="C" />)
    expect(screen.getByText('C (Support)')).toBeInTheDocument()
  })

  it('renders level D with General label', () => {
    render(<CriticalityIndicator level="D" />)
    expect(screen.getByText('D (General)')).toBeInTheDocument()
  })

  it('falls back to D config for unknown level', () => {
    render(<CriticalityIndicator level="Z" />)
    expect(screen.getByText('Z (General)')).toBeInTheDocument()
  })

  it('applies inverted color when inverted prop is true', () => {
    const { container } = render(<CriticalityIndicator level="A" inverted />)
    const span = container.firstChild
    expect(span.style.color).toBe('var(--color-text-inverse)')
  })

  it('applies primary color when not inverted', () => {
    const { container } = render(<CriticalityIndicator level="A" />)
    const span = container.firstChild
    expect(span.style.color).toBe('var(--color-text-primary)')
  })
})
