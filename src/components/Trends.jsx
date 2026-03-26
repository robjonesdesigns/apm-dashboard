// ── Trends (stub) ─────────────────────────────────────────────────────────────
// Placeholder while PlantOverview is rebuilt. Full rebuild coming next.

export default function Trends({ selectedAttribute }) {
  return (
    <div className="section-gap">
      <div className="card">
        <h1 className="type-h1">Trends</h1>
        <p className="type-body-secondary" style={{ marginTop: 'var(--spacing-8)' }}>
          Trends screen is being rebuilt. K-101 30-day degradation analysis
          with overlay/separate modes will be here.
        </p>
        {selectedAttribute && (
          <p className="type-body" style={{ marginTop: 'var(--spacing-8)' }}>
            Pre-selected attribute: <strong>{selectedAttribute}</strong>
          </p>
        )}
      </div>
    </div>
  )
}
