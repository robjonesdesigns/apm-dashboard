import { useOutletContext, useSearchParams } from 'react-router'
import Trends from '../../src/components/Trends'

export const meta = ({ params }) => [{ title: `${params.id} · Trends — APM` }]

export default function TrendsRoute() {
  const { onNavigate, selectedAsset } = useOutletContext()
  const [searchParams] = useSearchParams()
  const attributeId = searchParams.get('attribute')
  const selectedAttribute = attributeId ? { id: attributeId } : null
  return <Trends onNavigate={onNavigate} selectedAsset={selectedAsset} selectedAttribute={selectedAttribute} />
}
