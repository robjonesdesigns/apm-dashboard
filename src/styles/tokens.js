// ── APM Dashboard Tokens (JS) ────────────────────────────────────────────────
// Based on IBM Carbon g100 dark theme, adapted.
// Use CSS classes when possible. Use these only for Recharts inline styles.
// See: vector/research/DESK-RESEARCH-004-carbon-design-system.md

export const colors = {
  // Backgrounds
  bg: '#161616',
  layer01: '#262626',
  layer02: '#393939',
  layer03: '#525252',
  hover01: '#333333',
  hover02: '#474747',

  // Text
  textPrimary: '#f4f4f4',
  textSecondary: '#c6c6c6',
  textHelper: '#a8a8a8',

  // Borders
  borderSubtle: '#393939',
  borderStrong: '#525252',

  // Accent
  accent: '#2dd4bf',

  // Status (Pairing 1: coral-red + true amber)
  error: '#f47174',
  success: '#42be65',
  warning: '#e8914f',
  info: '#4589ff',
  caution: '#ff832b',

  // Chart palette (Carbon dark categorical, adapted)
  chart1: '#2dd4bf', // teal (accent)
  chart2: '#4589ff', // blue
  chart3: '#a56eff', // purple
  chart4: '#f1c21b', // yellow
  chart5: '#f47174', // red
  chart6: '#ff7eb6', // pink
  chart7: '#42be65', // green
  chart8: '#33b1ff', // cyan

  // KPI identity
  kpiOee: '#4589ff',
  kpiAvailability: '#f47174',
  kpiPerformance: '#f1c21b',
  kpiQuality: '#2dd4bf',
}

// Inverted tooltip (light on dark, stands out against dashboard)
export const tooltipInverse = {
  bg: 'var(--color-tooltip-bg)',
  text: 'var(--color-tooltip-text)',
  shadow: '0 4px 12px rgba(0,0,0,0.4)',
}

// Recharts-specific styling (can't use CSS vars)
export const chartStyle = {
  grid: '#393939',
  axisLine: '#525252',
  axisText: '#c6c6c6',
  axisFont: 12,
  tooltipBg: '#f4f4f4',
  tooltipBorder: '#e0e0e0',
  tooltipText: '#161616',
  tooltipLabel: '#525252',
  tooltipRadius: 4,
  tooltipPadding: 16,
  tooltipShadow: '0 4px 12px rgba(0,0,0,0.4)',
  lineWidth: 2,
  barRadius: [4, 4, 0, 0],
  animationDuration: 300,
  animationEasing: 'ease-out',
}
