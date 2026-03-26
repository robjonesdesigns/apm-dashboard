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

  // Status
  error: '#fa4d56',
  success: '#42be65',
  warning: '#f1c21b',
  info: '#4589ff',
  caution: '#ff832b',

  // Chart palette (Carbon dark categorical, adapted)
  chart1: '#2dd4bf', // teal (accent)
  chart2: '#4589ff', // blue
  chart3: '#a56eff', // purple
  chart4: '#f1c21b', // yellow
  chart5: '#fa4d56', // red
  chart6: '#ff7eb6', // pink
  chart7: '#42be65', // green
  chart8: '#33b1ff', // cyan

  // KPI identity
  kpiOee: '#4589ff',
  kpiAvailability: '#fa4d56',
  kpiPerformance: '#f1c21b',
  kpiQuality: '#2dd4bf',
}

// Recharts-specific styling (can't use CSS vars)
export const chartStyle = {
  grid: '#393939',
  axisLine: '#525252',
  axisText: '#c6c6c6',
  axisFont: 12,
  tooltipBg: '#393939',
  tooltipBorder: '#525252',
  tooltipText: '#f4f4f4',
  tooltipLabel: '#c6c6c6',
  tooltipRadius: 2,
  tooltipPadding: 16,
  tooltipShadow: '0 2px 6px rgba(0,0,0,0.3)',
  lineWidth: 2,
  barRadius: [4, 4, 0, 0],
  animationDuration: 300,
  animationEasing: 'ease-out',
}
