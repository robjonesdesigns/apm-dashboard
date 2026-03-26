// ── APM Dashboard Design Tokens (JS reference) ─────────────────────────────
// Mirrors the CSS custom properties in global.css.
// Use CSS classes (type-h1, card, badge-critical) when possible.
// Use these JS tokens only when Recharts or inline styles require them.
// All numbers are even. 4px spacing grid.

export const colors = {
  // Backgrounds
  bg: '#0f1117',
  surface: '#1a1d27',
  surfaceRaised: '#252830',
  surfaceHover: '#2e313b',

  // Text
  textPrimary: '#e8eaf0',
  textSecondary: '#9ba1b0',
  textMuted: '#6b7280',
  textDisabled: '#4a4f5c',

  // Borders
  border: 'rgba(255, 255, 255, 0.06)',
  borderStrong: 'rgba(255, 255, 255, 0.12)',

  // Accent (teal/cyan)
  accent: '#2dd4bf',
  accentMuted: 'rgba(45, 212, 191, 0.15)',
  accentSubtle: 'rgba(45, 212, 191, 0.06)',

  // Semantic status (desaturated for dark mode, ADR-002)
  critical: '#E57373',
  criticalBg: 'rgba(229, 115, 115, 0.10)',
  warning: '#FFB74D',
  warningBg: 'rgba(255, 183, 77, 0.10)',
  healthy: '#81C784',
  healthyBg: 'rgba(129, 199, 132, 0.10)',
  info: '#64B5F6',
  infoBg: 'rgba(100, 181, 246, 0.10)',

  // Chart palette (desaturated, ADR-002)
  chart1: '#2dd4bf', // teal (accent)
  chart2: '#64B5F6', // blue
  chart3: '#B39DDB', // purple
  chart4: '#FFB74D', // amber
  chart5: '#E57373', // red
  chart6: '#F48FB1', // pink
  chart7: '#81C784', // green
  chart8: '#7986CB', // indigo

  // KPI identity (left border per metric, ADR-003)
  kpiOee: '#64B5F6',
  kpiAvailability: '#E57373',
  kpiPerformance: '#FFB74D',
  kpiQuality: '#2dd4bf',
}

// Only used for Recharts inline styles that can't read CSS vars
export const chartStyle = {
  grid: 'rgba(255, 255, 255, 0.04)',
  axisText: '#6b7280',
  axisFont: 12,
  tooltipBg: '#252830',
  tooltipBorder: 'rgba(255, 255, 255, 0.12)',
  tooltipText: '#e8eaf0',
  tooltipLabel: '#9ba1b0',
  lineWidth: 2,
  barRadius: [4, 4, 0, 0],
}

// Spacing (only needed for Recharts margins/padding)
export const spacing = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
}
