import { useOutletContext } from 'react-router'

export const meta = ({ params }) => [{ title: `${params.id} · Fault Tree — APM` }]

export default function FaultTreeRoute() {
  const { selectedAsset } = useOutletContext()
  return (
    <div className="card">
      <h1 className="type-heading">Fault Tree</h1>
      <p className="type-body" style={{ marginTop: 'var(--spacing-16)', color: 'var(--color-text-secondary)' }}>
        Asset: {selectedAsset?.name || 'Unknown'}. React Flow implementation pending. See VECTOR.md "Screen Architecture" section.
      </p>
    </div>
  )
}
