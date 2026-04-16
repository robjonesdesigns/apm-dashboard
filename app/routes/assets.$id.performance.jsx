import { useOutletContext } from 'react-router'

export const meta = ({ params }) => [{ title: `${params.id} · Performance — APM` }]

export default function PerformanceRoute() {
  const { selectedAsset } = useOutletContext()
  return (
    <div className="card">
      <h1 className="type-heading">Performance</h1>
      <p className="type-body" style={{ marginTop: 'var(--spacing-16)', color: 'var(--color-text-secondary)' }}>
        Asset: {selectedAsset?.name || 'Unknown'}. Screen spec pending. See VECTOR.md "Screen Architecture" section.
      </p>
    </div>
  )
}
