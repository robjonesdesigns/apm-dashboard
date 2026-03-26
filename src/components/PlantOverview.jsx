// ── PlantOverview ─────────────────────────────────────────────────────────────
// Plant-wide overview. The engineer's morning dashboard.
// Follows the 10-step decision chain (INTERVIEW-002):
//   1. Orient (KPIs) → 2. Plan (Activity) → 3. Detect (What Changed)
//   → 4-5. Correlate + Identify (Risk, Bad Actors, Asset Table)

import KpiBar from './ui/KpiBar'
import TodaysActivity from './ui/TodaysActivity'
import WhatChanged from './ui/WhatChanged'
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

      {/* Step 1: Orient — "How's my plant?" */}
      <section>
        <p className="section-header">Plant Health</p>
        <KpiBar onKpiClick={(metric) => console.log('KPI clicked:', metric)} />
      </section>

      {/* Step 2: Plan — "What's on my plate today?" */}
      <section>
        <p className="section-header">Today's Activity</p>
        <TodaysActivity onAssetClick={handleAssetClick} />
      </section>

      {/* Step 3: Detect — "What changed overnight?" */}
      <section>
        <p className="section-header">What Changed</p>
        <WhatChanged
          onAssetClick={handleAssetClick}
          onEventClick={(event) => console.log('Event clicked:', event)}
        />
      </section>

      {/* Steps 4-5: Correlate + Identify — "Which assets need attention?" */}
      <section>
        <p className="section-header">Assets Requiring Attention</p>
        <div className="grid-thirds">
          <RiskMatrix onCellClick={(cell) => console.log('Risk cell:', cell)} />
          <EventSummary />
          <BadActors onAssetClick={handleAssetClick} />
        </div>
      </section>

      {/* Step 5 continued: Identify — entry point to Step 6 (Investigate) */}
      <section>
        <p className="section-header">All Assets</p>
        <AssetTable onAssetClick={(asset) => onNavigate('details', { asset })} />
      </section>

    </div>
  )
}
