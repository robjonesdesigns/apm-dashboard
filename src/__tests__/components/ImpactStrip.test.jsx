import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ImpactStrip from '../../components/ui/ImpactStrip'

describe('ImpactStrip', () => {
  it('renders without crashing', () => {
    render(<ImpactStrip />)
  })

  it('shows the "What Happened?" section header', () => {
    render(<ImpactStrip />)
    expect(screen.getByText('What Happened?')).toBeInTheDocument()
  })

  it('renders Trigger, Consequence, and Confirmation cards', () => {
    render(<ImpactStrip />)
    expect(screen.getByText('Trigger')).toBeInTheDocument()
    expect(screen.getByText('Consequence')).toBeInTheDocument()
    expect(screen.getByText('Confirmation')).toBeInTheDocument()
  })

  it('renders "Go to Events" link', () => {
    render(<ImpactStrip />)
    expect(screen.getByText(/Go to Events/)).toBeInTheDocument()
  })
})
