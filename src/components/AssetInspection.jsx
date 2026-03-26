// ── AssetInspection (stub) ────────────────────────────────────────────────────
// Placeholder while PlantOverview is rebuilt. Full rebuild coming next.

export default function AssetInspection({ selectedAsset }) {
  const name = selectedAsset?.name || selectedAsset?.id || 'Unknown Asset'

  return (
    <div className="section-gap">
      <div className="card">
        <h1 className="type-h1">{name}</h1>
        <p className="type-body-secondary" style={{ marginTop: 'var(--spacing-8)' }}>
          Asset Inspection screen is being rebuilt. The three-level deep dive
          (Reliability, Maintenance, Performance) will be here.
        </p>
      </div>
    </div>
  )
}
