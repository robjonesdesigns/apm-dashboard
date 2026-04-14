import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import KpiBar from '../../components/ui/KpiBar'

describe('KpiBar', () => {
  it('renders without crashing', () => {
    render(<KpiBar />)
  })

  it('renders all four KPI cards', () => {
    render(<KpiBar />)
    expect(screen.getByText('OEE')).toBeInTheDocument()
    expect(screen.getByText('Availability')).toBeInTheDocument()
    expect(screen.getByText('Performance')).toBeInTheDocument()
    expect(screen.getByText('Quality')).toBeInTheDocument()
  })

  it('renders Trains and Active Assets cards', () => {
    render(<KpiBar />)
    expect(screen.getByText('Trains')).toBeInTheDocument()
    expect(screen.getByText('Active Assets')).toBeInTheDocument()
  })

  it('displays KPI percentage values', () => {
    render(<KpiBar />)
    // OEE value
    expect(screen.getByText('76.3%')).toBeInTheDocument()
  })

  it('calls onKpiClick when a KPI card is clicked', () => {
    const onKpiClick = vi.fn()
    render(<KpiBar onKpiClick={onKpiClick} />)
    // Click the OEE card
    fireEvent.click(screen.getByLabelText(/OEE:/))
    expect(onKpiClick).toHaveBeenCalledWith('oee')
  })

  it('shows health indicator for KPIs below threshold', () => {
    render(<KpiBar />)
    // OEE at 76.3 is below warning threshold of 85
    // Availability at 78.4 is below critical of 80
    expect(screen.getAllByText('Action Required').length).toBeGreaterThan(0)
  })
})
