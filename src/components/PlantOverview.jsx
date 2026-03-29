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

import { useState, useRef, useCallback } from 'react'
import KpiBar from './ui/KpiBar'
import ImpactStrip from './ui/ImpactStrip'
import TodaysActivity from './ui/TodaysActivity'
import RiskMatrix from './ui/RiskMatrix'
import AlarmQuality from './ui/AlarmQuality'
import BadActors from './ui/BadActors'
import AssetTable from './ui/AssetTable'

export default function PlantOverview({ onNavigate }) {
  // Independent filter states -- stack as AND filters on the Asset Table
  const [riskFilter, setRiskFilter] = useState(null)        // { criticality, status }
  const [alarmFilter, setAlarmFilter] = useState(null)       // 'confirmed' | 'falsePositives' | 'newEvents'
  const [actorFilter, setActorFilter] = useState(null)       // assetId string
  const assetTableRef = useRef(null)

  const scrollToTable = () => {
    requestAnimationFrame(() => {
      assetTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const clearRiskFilter = useCallback(() => setRiskFilter(null), [])
  const clearAlarmFilter = useCallback(() => setAlarmFilter(null), [])
  const clearActorFilter = useCallback(() => setActorFilter(null), [])
  const clearAllFilters = useCallback(() => {
    setRiskFilter(null)
    setAlarmFilter(null)
    setActorFilter(null)
  }, [])

  // Risk Matrix: toggle criticality + status
  const handleRiskCellClick = (cell) => {
    if (!cell) { setRiskFilter(null); return }
    setRiskFilter(prev => {
      if (prev?.criticality === cell.criticality && prev?.status === cell.status) return null
      scrollToTable()
      return cell
    })
  }

  // Alarm Quality: toggle event validation status
  const handleAlarmClick = (segmentKey) => {
    if (!segmentKey) { setAlarmFilter(null); return }
    setAlarmFilter(prev => {
      if (prev === segmentKey) return null
      scrollToTable()
      return segmentKey
    })
  }

  // Bad Actors: toggle specific asset
  const handleBadActorClick = (assetId) => {
    if (!assetId) { setActorFilter(null); return }
    setActorFilter(prev => {
      if (prev === assetId) return null
      scrollToTable()
      return assetId
    })
  }

  return (
    <div className="section-gap">

      {/* 1. System Health — "How's my plant?" */}
      <section>
        <p className="section-header">System Health</p>
        <KpiBar onKpiClick={(metric) => console.log('KPI clicked:', metric)} />
      </section>

      {/* 2. What Happened — "What caused the KPI change?" (ADR-013 Layer 1) */}
      <ImpactStrip />

      {/* 3. In Progress — "Is anyone handling it?" */}
      <section>
        <p className="section-header">In Progress</p>
        <TodaysActivity />
      </section>

      {/* 4. Needs Action — "What do I need to figure out?" */}
      <section>
        <p className="section-header">Needs Action</p>
        <div className="grid-thirds">
          <RiskMatrix
            selectedCell={riskFilter}
            onCellClick={handleRiskCellClick}
            onClearFilter={clearRiskFilter}
          />
          <AlarmQuality
            selectedSegment={alarmFilter}
            onSegmentClick={handleAlarmClick}
            onClearFilter={clearAlarmFilter}
          />
          <BadActors
            selectedAsset={actorFilter}
            onAssetClick={handleBadActorClick}
            onClearFilter={clearActorFilter}
          />
        </div>
      </section>

      {/* 5. Assets — drill-down to Asset Inspection */}
      <section ref={assetTableRef}>
        <p className="section-header">Assets</p>
        <AssetTable
          riskFilter={riskFilter}
          alarmFilter={alarmFilter}
          actorFilter={actorFilter}
          onClearRiskFilter={clearRiskFilter}
          onClearAlarmFilter={clearAlarmFilter}
          onClearActorFilter={clearActorFilter}
          onClearAllFilters={clearAllFilters}
          onAssetClick={(asset) => onNavigate('details', { asset })}
        />
      </section>

    </div>
  )
}
