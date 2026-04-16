import { useOutletContext } from 'react-router'
import AssetInspection from '../../src/components/AssetInspection'

export const meta = ({ params }) => [{ title: `Asset ${params.id} — APM` }]

export default function AssetInspectionRoute() {
  const { onNavigate, selectedAsset } = useOutletContext()
  return <AssetInspection onNavigate={onNavigate} selectedAsset={selectedAsset} />
}
