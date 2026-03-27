// ── PlantOverview ─────────────────────────────────────────────────────────────
// Plant-wide overview. The engineer's morning dashboard.
// Section order per ADR-012/013:
//   1. Plant Health (KPIs) → "something is wrong"
//   2. Impact Strip → "this is what caused it"
//   3. Today's Activity → "is anyone handling it?"
//   4. Assets Requiring Attention → risk, bad actors
//   5. All Assets → drill-down table
//
// "What Changed" full timeline lives on a separate Event Log page
// accessed via "See full timeline →" on the Impact Strip (ADR-013).

import KpiBar from './ui/KpiBar'
import ImpactStrip from './ui/ImpactStrip'
import TodaysActivity from './ui/TodaysActivity'
import RiskMatrix from './ui/RiskMatrix'
import EventSummary from './ui/EventSummary'
import BadActors from './ui/BadActors'
import AssetTable from './ui/AssetTable'

export default function PlantOverview({ onNavigate }) {
  const handleAssetClick = (assetIdOrObj) => {
    const asset = typeof assetIdOrObj === 'string'
      ? { id: assetIdOrObj }
      : assetIdOrObj
    onNavigate('details', { asset })
  }

  return (
    <div className="section-gap">

      {/* 1. Plant Health — "How's my plant?" */}
      <section>
        <p className="section-header">Plant Health</p>
        <KpiBar onKpiClick={(metric) => console.log('KPI clicked:', metric)} />
      </section>

      {/* 2. Impact Strip — "This is what caused it" (ADR-013 Layer 1) */}
      <ImpactStrip />

      {/* 3. Today's Activity — "Is anyone handling it?" */}
      <section>
        <p className="section-header">Today's Activity</p>
        <TodaysActivity />
      </section>

      {/* 4. Assets Requiring Attention — risk, events, bad actors */}
      <section>
        <p className="section-header">Assets Requiring Attention</p>
        <div className="grid-thirds">
          <RiskMatrix onCellClick={(cell) => console.log('Risk cell:', cell)} />
          <EventSummary />
          <BadActors onAssetClick={handleAssetClick} />
        </div>
      </section>

      {/* 5. All Assets — drill-down to Asset Inspection */}
      <section>
        <p className="section-header">All Assets</p>
        <AssetTable onAssetClick={(asset) => onNavigate('details', { asset })} />
      </section>

    </div>
  )
}
