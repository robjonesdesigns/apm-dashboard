// ── APM Dashboard Design Tokens ──────────────────────────────────────────────
// Dark theme enterprise monitoring dashboard.
// Teal/cyan accent. Blue reserved for informational states.

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

  // Primary accent (teal/cyan)
  accent: '#2dd4bf',
  accentMuted: 'rgba(45, 212, 191, 0.15)',
  accentSubtle: 'rgba(45, 212, 191, 0.08)',

  // Semantic status
  critical: '#ef4444',
  criticalBg: 'rgba(239, 68, 68, 0.12)',
  warning: '#f59e0b',
  warningBg: 'rgba(245, 158, 11, 0.12)',
  healthy: '#22c55e',
  healthyBg: 'rgba(34, 197, 94, 0.12)',
  info: '#3b82f6',
  infoBg: 'rgba(59, 130, 246, 0.12)',

  // Chart palette (accessible on dark, distinguishable)
  chart1: '#2dd4bf', // teal (primary)
  chart2: '#3b82f6', // blue
  chart3: '#a78bfa', // purple
  chart4: '#f59e0b', // amber
  chart5: '#ef4444', // red
  chart6: '#ec4899', // pink
  chart7: '#22c55e', // green
  chart8: '#6366f1', // indigo
}

export const fonts = {
  sans: "'Inter', system-ui, sans-serif",
}

export const typeScale = {
  xs: '11px',
  sm: '12px',
  base: '13px',   // slightly smaller base for data-dense dashboards
  md: '14px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
}

export const radius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
}

export const shadow = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 12px rgba(0, 0, 0, 0.4)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
}

// Shared card style
export const card = {
  background: colors.surface,
  borderRadius: radius.xl,
  border: `1px solid ${colors.border}`,
  padding: '20px',
}

// KPI metric card (top bar)
export const kpiCard = {
  background: colors.surface,
  borderRadius: radius.lg,
  border: `1px solid ${colors.border}`,
  padding: '16px 20px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
}

export const kpiCardHover = {
  background: colors.surfaceHover,
  border: `1px solid ${colors.accent}`,
}
