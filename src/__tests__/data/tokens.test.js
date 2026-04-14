import { describe, it, expect } from 'vitest'
import { colors, tooltipInverse, chartStyle } from '../../styles/tokens'

describe('colors token map', () => {
  it('has all background tokens', () => {
    expect(colors.bg).toBeTruthy()
    expect(colors.layer01).toBeTruthy()
    expect(colors.layer02).toBeTruthy()
  })

  it('has all text tokens', () => {
    expect(colors.textPrimary).toBeTruthy()
    expect(colors.textSecondary).toBeTruthy()
    expect(colors.textHelper).toBeTruthy()
  })

  it('has all status tokens', () => {
    expect(colors.error).toBeTruthy()
    expect(colors.success).toBeTruthy()
    expect(colors.warning).toBeTruthy()
    expect(colors.info).toBeTruthy()
  })

  it('has accent color', () => {
    expect(colors.accent).toBeTruthy()
  })

  it('has at least 8 chart colors', () => {
    for (let i = 1; i <= 8; i++) {
      expect(colors[`chart${i}`]).toBeTruthy()
    }
  })

  it('has KPI identity colors', () => {
    expect(colors.kpiOee).toBeTruthy()
    expect(colors.kpiAvailability).toBeTruthy()
    expect(colors.kpiPerformance).toBeTruthy()
    expect(colors.kpiQuality).toBeTruthy()
  })

  it('no color value is empty string or undefined', () => {
    Object.entries(colors).forEach(([key, value]) => {
      expect(value).toBeTruthy()
    })
  })
})

describe('tooltipInverse', () => {
  it('has bg, text, and shadow properties', () => {
    expect(tooltipInverse.bg).toBeTruthy()
    expect(tooltipInverse.text).toBeTruthy()
    expect(tooltipInverse.shadow).toBeTruthy()
  })
})

describe('chartStyle', () => {
  it('has grid, axis, and tooltip config', () => {
    expect(chartStyle.grid).toBeTruthy()
    expect(chartStyle.axisLine).toBeTruthy()
    expect(chartStyle.axisText).toBeTruthy()
    expect(typeof chartStyle.axisFont).toBe('number')
    expect(chartStyle.tooltipBg).toBeTruthy()
    expect(typeof chartStyle.tooltipRadius).toBe('number')
  })

  it('has animation config', () => {
    expect(typeof chartStyle.animationDuration).toBe('number')
    expect(chartStyle.animationEasing).toBeTruthy()
  })

  it('barRadius is an array of 4 values', () => {
    expect(Array.isArray(chartStyle.barRadius)).toBe(true)
    expect(chartStyle.barRadius).toHaveLength(4)
  })
})
