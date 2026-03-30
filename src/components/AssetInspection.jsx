// ── AssetInspection ──────────────────────────────────────────────────────────
// Single scrollable page. Sections render conditionally based on available data.
// See HANDOFF.md for section order and design decisions.

import CriticalityIndicator from './ui/CriticalityIndicator'
import StatusIndicator from './ui/StatusIndicator'

// ── Back arrow icon (Feather chevron-left) ───────────────────────────────────

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

// ── Asset Header ─────────────────────────────────────────────────────────────

function AssetHeader({ asset, onBack }) {
  const specs = [asset.type, asset.service, asset.processUnit].filter(Boolean)

  return (
    <div>
      {/* Back link -- flush to page margin */}
      <button
        onClick={onBack}
        className="type-link"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--spacing-4)',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'var(--color-accent)',
          fontSize: 'var(--text-14)',
          marginBottom: 'var(--gap-intra)',
        }}
      >
        <ChevronLeft />
        Plant Overview
      </button>

      {/* Asset name */}
      <p className="section-header" style={{ marginBottom: 0 }}>{asset.name}</p>

      {/* Status + criticality */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--gap-stack)',
        marginTop: 'var(--gap-stack)',
      }}>
        <StatusIndicator status={asset.status} />
        <span style={{
          width: 1,
          height: 12,
          background: 'var(--color-border-strong)',
          flexShrink: 0,
        }} />
        <CriticalityIndicator level={asset.criticality} />
      </div>

      {/* Specs row: type · service · process unit */}
      {specs.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--gap-stack)',
          marginTop: 'var(--gap-stack)',
        }}>
          {specs.map((spec, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
              {i > 0 && (
                <span style={{
                  width: 1,
                  height: 12,
                  background: 'var(--color-border-strong)',
                  flexShrink: 0,
                }} />
              )}
              <span className="type-meta" style={{ color: 'var(--color-text-helper)' }}>
                {spec}
              </span>
            </span>
          ))}
        </div>
      )}

    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function AssetInspection({ selectedAsset, onNavigate }) {
  if (!selectedAsset) {
    return (
      <div className="section-gap">
        <p className="type-body" style={{ color: 'var(--color-text-secondary)' }}>
          No asset selected.
        </p>
      </div>
    )
  }

  return (
    <div className="section-gap">
      <AssetHeader
        asset={selectedAsset}
        onBack={() => onNavigate('health')}
      />
    </div>
  )
}
