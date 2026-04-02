// ── DesignSystem ──────────────────────────────────────────────────────────────
// Internal reference page documenting the APM Dashboard design system.
// Not user-facing. Accessible via ?view=design-system or Ctrl+Shift+D.
// Shows live specimens of all tokens, type classes, and shared components.

import SeverityBadge from './ui/SeverityBadge'
import CriticalityIndicator from './ui/CriticalityIndicator'
import StatusIndicator from './ui/StatusIndicator'
import WoPriority from './ui/WoPriority'
import FilterChip from './ui/FilterChip'
import FilterButton from './ui/FilterButton'

// ── Color token definitions ──────────────────────────────────────────────────

const COLOR_GROUPS = [
  {
    label: 'Backgrounds',
    tokens: [
      { name: '--color-bg',            value: '#161616' },
      { name: '--color-layer-01',      value: '#262626' },
      { name: '--color-layer-02',      value: '#393939' },
      { name: '--color-layer-03',      value: '#525252' },
      { name: '--color-hover-01',      value: '#333333' },
      { name: '--color-hover-02',      value: '#474747' },
      { name: '--color-selected',      value: 'rgba(141,141,141,0.24)' },
      { name: '--color-hover-cursor',  value: 'rgba(255,255,255,0.03)' },
      { name: '--color-overlay',       value: 'rgba(0,0,0,0.6)' },
    ],
  },
  {
    label: 'Text',
    tokens: [
      { name: '--color-text-primary',   value: '#f4f4f4' },
      { name: '--color-text-secondary', value: '#c6c6c6' },
      { name: '--color-text-helper',    value: '#a8a8a8' },
      { name: '--color-text-disabled',  value: 'rgba(244,244,244,0.25)' },
      { name: '--color-text-on-color',  value: '#ffffff' },
      { name: '--color-text-inverse',   value: '#161616' },
      { name: '--color-card-title',     value: '#c6c6c6' },
    ],
  },
  {
    label: 'Status',
    tokens: [
      { name: '--color-error',            value: '#f47174' },
      { name: '--color-error-bg',         value: 'rgba(244,113,116,0.16)' },
      { name: '--color-error-bg-strong',  value: 'rgba(244,113,116,0.24)' },
      { name: '--color-success',          value: '#42be65' },
      { name: '--color-success-bg',       value: 'rgba(66,190,101,0.16)' },
      { name: '--color-warning',          value: '#e8914f' },
      { name: '--color-warning-bg',       value: 'rgba(232,145,79,0.16)' },
      { name: '--color-warning-bg-strong',value: 'rgba(232,145,79,0.24)' },
      { name: '--color-info',             value: '#4589ff' },
      { name: '--color-info-bg',          value: 'rgba(69,137,255,0.16)' },
      { name: '--color-info-bg-strong',   value: 'rgba(69,137,255,0.24)' },
      { name: '--color-caution',          value: '#ff832b' },
    ],
  },
  {
    label: 'Border',
    tokens: [
      { name: '--color-border-subtle',      value: '#393939' },
      { name: '--color-border-strong',      value: '#525252' },
      { name: '--color-border-tile',        value: '#525252' },
      { name: '--color-border-interactive', value: '#2dd4bf' },
      { name: '--color-border-disabled',    value: 'rgba(141,141,141,0.5)' },
      { name: '--color-border-divider',     value: 'rgba(57,57,57,0.5)' },
    ],
  },
  {
    label: 'Accent',
    tokens: [
      { name: '--color-accent',           value: '#2dd4bf' },
      { name: '--color-accent-hover',     value: '#5de0cf' },
      { name: '--color-accent-bg',        value: 'rgba(45,212,191,0.16)' },
      { name: '--color-accent-bg-strong', value: 'rgba(45,212,191,0.12)' },
      { name: '--color-accent-bg-subtle', value: 'rgba(45,212,191,0.06)' },
      { name: '--color-link',             value: '#2dd4bf' },
      { name: '--color-link-hover',       value: '#5de0cf' },
    ],
  },
]

// ── Typography class definitions ─────────────────────────────────────────────

const TYPE_CLASSES = [
  { className: 'section-header', label: 'section-header', spec: '14px / 500, uppercase', sample: 'SECTION HEADER LABEL' },
  { className: 'type-heading',   label: 'type-heading',   spec: '24px / 600',           sample: 'Modal titles, panel headers' },
  { className: 'type-card-title',label: 'type-card-title',spec: '14px / 600, dimmed',    sample: 'Card Header Title' },
  { className: 'type-table-header', label: 'type-table-header', spec: '14px / 600, secondary', sample: 'Column Header' },
  { className: 'type-body',      label: 'type-body',      spec: '14px / 400',           sample: 'General body text used for table data and paragraph content.' },
  { className: 'type-meta',      label: 'type-meta',      spec: '12px / 400',           sample: 'Timestamps, helper text, secondary info' },
  { className: 'type-label',     label: 'type-label',     spec: '12px / 500',           sample: 'Legend items, chips, form labels' },
  { className: 'type-kpi',       label: 'type-kpi',       spec: '28px / 700',           sample: '94.2%' },
  { className: 'type-kpi-hero',  label: 'type-kpi-hero',  spec: '32px / 700',           sample: '87.5%' },
  { className: 'type-link',      label: 'type-link',      spec: '14px / 400, teal',     sample: 'View all events' },
]

// ── Spacing tokens ───────────────────────────────────────────────────────────

const SPACING_TOKENS = [
  { name: '--spacing-2',  value: '2px',  px: 2 },
  { name: '--spacing-4',  value: '4px',  px: 4 },
  { name: '--spacing-8',  value: '8px',  px: 8 },
  { name: '--spacing-12', value: '12px', px: 12 },
  { name: '--spacing-16', value: '16px', px: 16 },
  { name: '--spacing-24', value: '24px', px: 24 },
  { name: '--spacing-32', value: '32px', px: 32 },
  { name: '--spacing-40', value: '40px', px: 40 },
  { name: '--spacing-48', value: '48px', px: 48 },
  { name: '--spacing-64', value: '64px', px: 64 },
  { name: '--spacing-80', value: '80px', px: 80 },
  { name: '--spacing-96', value: '96px', px: 96 },
]

// ── Radius tokens ────────────────────────────────────────────────────────────

const RADIUS_TOKENS = [
  { name: '--radius-0',    value: '0px',    px: 0 },
  { name: '--radius-4',    value: '4px',    px: 4 },
  { name: '--radius-8',    value: '8px',    px: 8 },
  { name: '--radius-10',   value: '10px',   px: 10 },
  { name: '--radius-full', value: '9999px', px: 9999 },
]

// ── Shadow tokens ────────────────────────────────────────────────────────────

const SHADOW_TOKENS = [
  { name: '--shadow-tooltip', value: '0 4px 12px rgba(0,0,0,0.4)' },
  { name: '--shadow-overlay', value: '4px 0 16px rgba(0,0,0,0.3)' },
]

// ── Investigation status icons (duplicated from InProgress for specimens) ────

function InvestigatingIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 1.5L10 6 3 10.5z" fill="currentColor" />
    </svg>
  )
}

function OpenIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 1.5L10 6 3 10.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

// ── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-24)' }}>
      <h2 className="section-header" style={{ marginBottom: 0 }}>{title}</h2>
      {children}
    </section>
  )
}

// ── Swatch card ──────────────────────────────────────────────────────────────

function Swatch({ name, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-12)' }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-4)',
          background: `var(${name})`,
          border: '1px solid var(--color-border-subtle)',
          flexShrink: 0,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <span className="type-label" style={{ color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>{name}</span>
        <span className="type-meta">{value}</span>
      </div>
    </div>
  )
}

// ── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 1,
        height: 12,
        background: 'var(--color-border-strong)',
        flexShrink: 0,
      }}
    />
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function DesignSystem() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-64)' }}>
      {/* Page title */}
      <div>
        <h1 className="type-heading" style={{ marginBottom: 'var(--gap-stack)' }}>
          Design System Reference
        </h1>
        <p className="type-body" style={{ color: 'var(--color-text-secondary)' }}>
          Internal reference for the APM Dashboard design system. Documents all tokens, type classes, and shared components. Not user-facing.
        </p>
      </div>

      {/* ── a) Color Tokens ─────────────────────────────────────────────── */}
      <Section title="Color Tokens">
        {COLOR_GROUPS.map((group) => (
          <div key={group.label} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
            <h3 className="type-card-title">{group.label}</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--spacing-16)',
              }}
            >
              {group.tokens.map((t) => (
                <Swatch key={t.name} name={t.name} value={t.value} />
              ))}
            </div>
          </div>
        ))}
      </Section>

      {/* ── b) Typography Scale ─────────────────────────────────────────── */}
      <Section title="Typography Scale">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-24)' }}>
          {TYPE_CLASSES.map((tc, i) => (
            <div key={tc.className}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-12)', marginBottom: 'var(--gap-stack)' }}>
                <span className="type-label" style={{ color: 'var(--color-accent)', fontFamily: 'monospace' }}>
                  .{tc.label}
                </span>
                <span className="type-meta">{tc.spec}</span>
              </div>
              <span className={tc.className}>{tc.sample}</span>
              {i < TYPE_CLASSES.length - 1 && (
                <div style={{ borderBottom: '1px solid var(--color-border-subtle)', marginTop: 'var(--spacing-24)' }} />
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ── c) Spacing Tokens ───────────────────────────────────────────── */}
      <Section title="Spacing Tokens">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
          <p className="type-meta" style={{ marginBottom: 'var(--spacing-8)' }}>
            8px base grid. Semantic tokens --gap-stack (8px, 4px dense) and --gap-intra (12px, 8px dense) for vertical stacking and intra-card grouping.
          </p>
          {SPACING_TOKENS.map((s) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-16)' }}>
              <span
                className="type-label"
                style={{ width: 120, flexShrink: 0, fontFamily: 'monospace', color: 'var(--color-text-primary)' }}
              >
                {s.name}
              </span>
              <span className="type-meta" style={{ width: 40, flexShrink: 0 }}>{s.value}</span>
              <div
                style={{
                  width: s.px,
                  height: 16,
                  background: 'var(--color-accent)',
                  borderRadius: 'var(--radius-4)',
                  flexShrink: 0,
                  opacity: 0.7,
                }}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ── d) Radius Tokens ────────────────────────────────────────────── */}
      <Section title="Radius Tokens">
        <div className="card">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-24)', alignItems: 'flex-end' }}>
            {RADIUS_TOKENS.map((r) => (
              <div key={r.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--gap-stack)' }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    background: 'var(--color-layer-02)',
                    border: '1px solid var(--color-border-strong)',
                    borderRadius: `var(${r.name})`,
                  }}
                />
                <span className="type-label" style={{ fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>{r.name}</span>
                <span className="type-meta">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── e) Shadow Tokens ────────────────────────────────────────────── */}
      <Section title="Shadow Tokens">
        <div className="card">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-32)' }}>
            {SHADOW_TOKENS.map((s) => (
              <div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--gap-stack)' }}>
                <div
                  style={{
                    width: 120,
                    height: 80,
                    background: 'var(--color-layer-02)',
                    borderRadius: 'var(--radius-10)',
                    boxShadow: `var(${s.name})`,
                  }}
                />
                <span className="type-label" style={{ fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>{s.name}</span>
                <span className="type-meta">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── f) Icon Systems (ADR-022) ───────────────────────────────────── */}
      <Section title="Icon Systems (ADR-022)">
        {/* Event Severity */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
          <h3 className="type-card-title">Event Severity -- Tally Bars (SeverityBadge.jsx)</h3>
          <p className="type-meta">Visual weight communicates severity. Tally bars satisfy WCAG SC 1.4.1 (info not by color alone).</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-16)', alignItems: 'center' }}>
            <SeverityBadge severity="critical" />
            <Divider />
            <SeverityBadge severity="high" />
            <Divider />
            <SeverityBadge severity="medium" />
            <Divider />
            <SeverityBadge severity="low" />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-16)', alignItems: 'center' }}>
            <span className="type-label">Compact (tally only):</span>
            <SeverityBadge severity="critical" compact />
            <Divider />
            <SeverityBadge severity="high" compact />
            <Divider />
            <SeverityBadge severity="medium" compact />
            <Divider />
            <SeverityBadge severity="low" compact />
          </div>
        </div>

        {/* Asset Criticality */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
          <h3 className="type-card-title">Asset Criticality -- Letter Grade Pills (CriticalityIndicator.jsx)</h3>
          <p className="type-meta">Static engineering classification. Visually distinct from event badges.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-16)', alignItems: 'center' }}>
            <CriticalityIndicator level="A" />
            <Divider />
            <CriticalityIndicator level="B" />
            <Divider />
            <CriticalityIndicator level="C" />
          </div>
        </div>

        {/* Asset Status */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
          <h3 className="type-card-title">Asset Status -- Dots (StatusIndicator.jsx)</h3>
          <p className="type-meta">Dot + label for asset operational state.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-16)', alignItems: 'center' }}>
            <StatusIndicator status="tripped" />
            <Divider />
            <StatusIndicator status="degraded" />
            <Divider />
            <StatusIndicator status="planned-outage" />
            <Divider />
            <StatusIndicator status="running" />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-16)', alignItems: 'center' }}>
            <span className="type-label">Compact (dot only):</span>
            <StatusIndicator status="tripped" compact />
            <Divider />
            <StatusIndicator status="degraded" compact />
            <Divider />
            <StatusIndicator status="planned-outage" compact />
            <Divider />
            <StatusIndicator status="running" compact />
          </div>
        </div>

        {/* WO Urgency */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
          <h3 className="type-card-title">WO Urgency -- Circles/Clock (WoPriority.jsx)</h3>
          <p className="type-meta">Neutral gray icons + text. No color coding, no pills.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-16)', alignItems: 'center' }}>
            <WoPriority urgency="emergency" />
            <Divider />
            <WoPriority urgency="urgent" />
            <Divider />
            <WoPriority urgency="scheduled" />
          </div>
        </div>

        {/* Investigation Status */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
          <h3 className="type-card-title">Investigation Status -- Triangles (InProgress.jsx)</h3>
          <p className="type-meta">Right-pointing triangles indicate progress. Filled = active, outlined = open.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-16)', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-4)', color: 'var(--color-text-secondary)' }}>
              <InvestigatingIcon />
              <span className="type-label" style={{ color: 'var(--color-text-secondary)' }}>Investigating</span>
            </span>
            <Divider />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-4)', color: 'var(--color-text-secondary)' }}>
              <OpenIcon />
              <span className="type-label" style={{ color: 'var(--color-text-secondary)' }}>Open</span>
            </span>
          </div>
        </div>
      </Section>

      {/* ── g) Components ───────────────────────────────────────────────── */}
      <Section title="Components">
        {/* SeverityBadge */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
          <h3 className="type-card-title">SeverityBadge</h3>
          <p className="type-meta">
            Props: severity (critical / high / medium / low), compact (boolean). Used in Events, Notifications, Asset Table.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-12)', alignItems: 'center' }}>
            <SeverityBadge severity="critical" />
            <SeverityBadge severity="high" />
            <SeverityBadge severity="medium" />
            <SeverityBadge severity="low" />
          </div>
        </div>

        {/* CriticalityIndicator */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
          <h3 className="type-card-title">CriticalityIndicator</h3>
          <p className="type-meta">
            Props: level (A / B / C / D), inverted (boolean for light tooltip bg). Used in Asset Table, Event Feed, InProgress.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-12)', alignItems: 'center' }}>
            <CriticalityIndicator level="A" />
            <CriticalityIndicator level="B" />
            <CriticalityIndicator level="C" />
            <CriticalityIndicator level="D" />
          </div>
        </div>

        {/* StatusIndicator */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
          <h3 className="type-card-title">StatusIndicator</h3>
          <p className="type-meta">
            Props: status (tripped / degraded / planned-outage / running), compact (boolean for dot-only). Used in Asset Table, Asset Inspection.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-12)', alignItems: 'center' }}>
            <StatusIndicator status="tripped" />
            <StatusIndicator status="degraded" />
            <StatusIndicator status="planned-outage" />
            <StatusIndicator status="running" />
          </div>
        </div>

        {/* WoPriority */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
          <h3 className="type-card-title">WoPriority</h3>
          <p className="type-meta">
            Props: urgency (emergency / urgent / scheduled). Used in In Progress cards, Work Orders.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-12)', alignItems: 'center' }}>
            <WoPriority urgency="emergency" />
            <WoPriority urgency="urgent" />
            <WoPriority urgency="scheduled" />
          </div>
        </div>

        {/* FilterChip */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
          <h3 className="type-card-title">FilterChip</h3>
          <p className="type-meta">
            Props: label (string), onClear (function). Dismissable filter tag used in Event Triage and Asset Table toolbar.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-12)', alignItems: 'center' }}>
            <FilterChip label="Critical" onClear={() => {}} />
            <FilterChip label="High" onClear={() => {}} />
            <FilterChip label="K-101" onClear={() => {}} />
          </div>
        </div>

        {/* FilterButton */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
          <h3 className="type-card-title">FilterButton</h3>
          <p className="type-meta">
            Props: categories (array), filters (object), onToggle (function). Multi-select checkbox dropdown used in Asset Table and Notifications.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-12)', alignItems: 'center' }}>
            <FilterButton
              categories={[
                { key: 'severity', label: 'Severity', options: ['critical', 'high', 'medium', 'low'], labelFn: (v) => v.charAt(0).toUpperCase() + v.slice(1) },
              ]}
              filters={{ severity: [] }}
              onToggle={() => {}}
            />
            <FilterButton
              categories={[
                { key: 'severity', label: 'Severity', options: ['critical', 'high'], labelFn: (v) => v.charAt(0).toUpperCase() + v.slice(1) },
              ]}
              filters={{ severity: ['critical'] }}
              onToggle={() => {}}
            />
          </div>
        </div>
      </Section>
    </div>
  )
}
