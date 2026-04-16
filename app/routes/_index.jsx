import { data, useOutletContext, useLoaderData, isRouteErrorResponse, useRouteError } from 'react-router'
import PlantOverview from '../../src/components/PlantOverview'
import useAutoRevalidate from '../../src/hooks/useAutoRevalidate'
import { requireAuth } from '../lib/auth.server'
import { getSql } from '../lib/db.server'

export const meta = () => [{ title: 'Plant Overview — APM' }]

export async function loader({ request }) {
  const auth = await requireAuth(request)
  const sql = getSql()

  const [assetRow] = await sql`
    select
      count(*)                                                 as total_assets,
      count(*) filter (where status in ('running','degraded')) as active_assets,
      count(*) filter (where status = 'down')                  as down_assets,
      count(*) filter (where status = 'degraded')              as degraded_assets,
      count(*) filter (where status = 'standby')               as standby_assets
    from assets
    where org_id = ${auth.orgId}
  `

  const [plantRow] = await sql`
    select count(*) as plant_count
    from plants
    where org_id = ${auth.orgId}
  `

  // Plant-level OEE from plant_kpi_hourly view (ADR-032). Latest row +
  // ~24h earlier row for the "vs yesterday" delta. Nulls flow through
  // when upstream data is missing; the UI renders em-dashes in those slots.
  const [latest] = await sql`
    select pk.hour, pk.availability, pk.performance, pk.quality, pk.oee
    from plant_kpi_hourly pk
    join plants p on p.id = pk.plant_id
    where p.org_id = ${auth.orgId}
    order by pk.hour desc
    limit 1
  `

  let prev = null
  if (latest) {
    ;[prev] = await sql`
      select pk.availability, pk.performance, pk.quality, pk.oee
      from plant_kpi_hourly pk
      join plants p on p.id = pk.plant_id
      where p.org_id = ${auth.orgId}
        and pk.hour <= ${latest.hour}::timestamptz - interval '24 hours'
      order by pk.hour desc
      limit 1
    `
  }

  const toPct = (v) => (v == null ? null : Number((Number(v) * 100).toFixed(1)))

  const kpis = {
    activeAssets: Number(assetRow?.active_assets ?? 0),
    totalAssets: Number(assetRow?.total_assets ?? 0),
    downAssets: Number(assetRow?.down_assets ?? 0),
    degradedAssets: Number(assetRow?.degraded_assets ?? 0),
    standbyAssets: Number(assetRow?.standby_assets ?? 0),
    trains: Number(plantRow?.plant_count ?? 0),

    oee: toPct(latest?.oee),
    availability: toPct(latest?.availability),
    performance: toPct(latest?.performance),
    quality: toPct(latest?.quality),
    previousOee: toPct(prev?.oee),
    previousAvailability: toPct(prev?.availability),
    previousPerformance: toPct(prev?.performance),
    previousQuality: toPct(prev?.quality),

    thresholds: {
      oee:          { warning: 85, critical: 75 },
      availability: { warning: 90, critical: 80 },
      performance:  { warning: 92, critical: 85 },
      quality:      { warning: 98, critical: 95 },
    },

    lastRefreshed: new Date().toISOString(),
  }

  return data({ kpis }, { headers: auth.headers })
}

export default function PlantOverviewRoute() {
  const { onNavigate } = useOutletContext()
  const { kpis } = useLoaderData()
  useAutoRevalidate(120_000)
  return <PlantOverview onNavigate={onNavigate} kpis={kpis} />
}

export function ErrorBoundary() {
  const error = useRouteError()
  const isResponse = isRouteErrorResponse(error)
  const status = isResponse ? error.status : 500
  const body = isResponse
    ? error.data || error.statusText
    : error?.message || 'Something went wrong loading Plant Overview.'

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <p className="type-meta" style={{ color: 'var(--color-text-helper)' }}>{status}</p>
      <h1 className="type-heading" style={{ marginTop: 'var(--spacing-8)' }}>
        Couldn't load Plant Overview
      </h1>
      <p className="type-body" style={{ marginTop: 'var(--spacing-16)', color: 'var(--color-text-secondary)' }}>
        {body}
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        style={{
          marginTop: 'var(--spacing-16)',
          padding: '8px 14px',
          background: 'var(--color-accent)',
          color: 'var(--color-text-inverse)',
          border: 'none',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Retry
      </button>
    </div>
  )
}
