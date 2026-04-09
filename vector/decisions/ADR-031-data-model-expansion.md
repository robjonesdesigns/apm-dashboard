# ADR-031: Data Model Expansion -- Sensors, PdM, PM Compliance

**Status:** Accepted
**Date:** 2026-04-09

## Context

The current data layer (baytown.js, 2,833 lines) is a hand-authored static dataset representing one morning at Baytown Refinery. It serves the portfolio demo well -- 10 assets, 60 sub-assets, ~180 sensor readings, 36 events, 24 work orders, 8 investigations. But the platform is designed for 500+ assets, and the path to a sellable product requires real sensor data, calculated KPIs, and predictive maintenance logic.

The custom data visualizations (sparklines, horizontal bars, fault tree, sub-asset sensor rows, risk matrix) are already data-driven -- they render from arrays and objects. The architecture question is not "can the components handle real data" but "what shape must the data take, where does it live, and what calculations happen where."

## Research

**DESK-RESEARCH-019:** PM compliance formula (SMRP standard), RUL degradation model, P-F intervals by detection method, maintenance KPI formulas (MTBF, MTTR, PMP, backlog). Defines the full data structures needed for calculated KPIs.

**INTERVIEW-002:** The 10-step engineer decision chain. Every step maps to a data query: Orient (plant KPIs), Detect (events), Correlate (KPI trends + event timestamps), Identify (asset table), Investigate (sub-asset sensors), Deep Dive (attribute trends), Act (work order creation). Real data must serve each step.

**STORY-002:** All 10 asset narratives with sub-assets, sensors, thresholds, and failure stories. Establishes the sensor types, alarm thresholds, and degradation patterns that the data model must support.

**Honeywell Asset Details (memory: apm_asset_details_build.md):** Three-row card structure with bar graph clusters (Reliability/Utilization/Availability per month), Run Status timeline, WO donut (Status + Type segments), MTBF/MTTR/PM compliance sparklines, Performance attributes table. These data relationships carry over into the narrative flow -- the visualization components exist, they need richer data behind them.

## Decision

### Entity Model

Five core entities. Current baytown.js entities map directly -- the expansion adds fields, not new entity types.

```
Plant
├── Assets (currently 10, scales to 500+)
│   ├── Sub-Assets (5-7 per asset)
│   │   └── Sensors (2-5 per sub-asset)
│   ├── Events (from TIMELINE)
│   ├── Work Orders
│   └── Investigations
└── Incidents (cross-asset event correlation)
```

### Sensor Record (new fields)

Current: `{ name, value, unit, alarm, status }`

Expanded:
```js
{
  sensorId: 'K-101-DE-VIB',       // hierarchical ID
  assetId: 'K-101',
  subAssetId: 'K-101-DE',
  sensorType: 'vibration',         // vibration | temperature | pressure | flow | current
  unit: 'mm/s',

  // Current state
  currentValue: 7.8,
  normalRange: [0, 4.0],
  alarmThreshold: 7.1,
  tripThreshold: 10.0,
  status: 'alarm',                 // normal | elevated | alarm | trip

  // Historical (powers sparklines, trend charts, RUL)
  trend: [
    { timestamp: '2026-04-08T00:00Z', value: 6.2 },
    { timestamp: '2026-04-08T01:00Z', value: 6.5 },
    // ... hourly or sub-hourly resolution
  ],

  // Predictive (computed by backend)
  predictedRUL_days: 5,
  confidenceLow: 3,
  confidenceHigh: 8,
  degradationModel: 'exponential', // linear | exponential | polynomial
  pfInterval_days: 45,             // P-F interval for this failure mode
  lastInspectionDate: '2026-03-25',
}
```

### Work Order Record (expanded fields)

Current: `{ id, assetId, asset, task, urgency, status, assignee, created, eventId }`

Expanded:
```js
{
  // ... existing fields
  woType: 'CM',                    // PM | PdM | CM (Corrective) | EM (Emergency)
  intervalDays: null,              // for PM: 30, 90, 365. null for non-PM
  scheduledDate: '2026-04-09',
  dueDate: '2026-04-09',
  completionDate: null,
  isCompliant: null,               // computed: completionDate <= dueDate + grace
  complianceWindow: 3,             // days (10% of interval, min 1 day)
  craftType: 'mechanical',         // mechanical | electrical | instrumentation
  estimatedHours: 4,
  actualHours: null,

  // PdM trigger (for condition-based WOs)
  triggerSensorId: 'K-101-DE-VIB',
  triggerValue: 7.8,
  triggerThreshold: 7.1,
  failureMode: 'bearing-degradation',
}
```

### Calculated KPIs (where computation happens)

| KPI | Formula | Scope | Compute Location |
|-----|---------|-------|-----------------|
| OEE | Availability x Performance x Quality | Plant (weighted), Asset | Backend batch (hourly) |
| Availability | (Total hrs - downtime hrs) / Total hrs | Asset | Backend batch |
| MTBF | Operating hrs / Unplanned failure count | Asset | Backend batch (daily) |
| MTTR | Total repair hrs / Repair count | Asset | Backend batch (daily) |
| PM Compliance | Completed PMs in window / Scheduled PMs | Plant, Asset, Criticality tier | Backend batch (daily) |
| PMP | Planned WOs / Total WOs | Plant | Backend batch |
| Backlog | Total backlog hrs / Weekly labor capacity | Plant | Backend batch |
| RUL | Degradation model extrapolation to threshold | Sensor | Backend real-time (on new reading) |
| Emergency WO Rate | Emergency WOs / Total WOs (trailing 30d) | Plant | Backend batch |

**Rule:** The frontend never computes KPIs from raw data. The backend computes and the API returns the result. The frontend renders. This keeps the component layer thin and the calculation logic testable/auditable.

### Data Flow Architecture

```
[Sensors / SCADA / Historian]
        │
        ▼
[Ingestion Service]  ← writes sensor readings, detects threshold crossings
        │
        ▼
[Database]           ← sensor_readings, events, work_orders, investigations
        │
        ├──► [Batch Calculator]  ← hourly/daily: OEE, MTBF, PM compliance
        │         │
        │         ▼
        │    [kpi_snapshots table]
        │
        ├──► [RUL Service]       ← on new reading: fit model, extrapolate
        │         │
        │         ▼
        │    [rul_predictions table]
        │
        ▼
[REST API / WebSocket]
        │
        ▼
[React Frontend]     ← same components, same props, real data
```

### What Changes in the Frontend

Almost nothing. The component props stay the same. What changes:

1. **baytown.js imports become API calls.** `useEffect` + `fetch` or a data hook replaces static imports. Components receive the same shape.

2. **Sparkline `data` arrays get longer.** Currently 7-14 points. Real sensors produce hundreds. The SVG polyline handles any length -- it already uses `viewBox` scaling.

3. **KPI values become live.** Currently `PLANT.oee = 76.3`. Production: `plant.oee` from API response. Same number, different source.

4. **Asset table paginates for real.** Currently 10 rows. Production: 200-500 rows. Pagination, sort, filter already built and tested.

5. **Sub-asset sensor rows update.** Currently static snapshot. Production: sensor values refresh on interval or WebSocket push. The row component re-renders with new props.

### What Does NOT Change

- Component architecture (screens, UI primitives, hooks)
- Visualization logic (sparklines, bars, fault tree, risk matrix)
- CSS design system (tokens, component classes, type scale)
- Navigation architecture (ADR-028)
- Hover/interaction patterns
- Accessibility (WCAG 2.1 AA, multi-channel encoding)

### Storage Strategy (Production)

| Table | Write Frequency | Read Pattern | Retention |
|-------|----------------|--------------|-----------|
| sensor_readings | Per sensor interval (1s-1h) | Time-range queries, latest value | 12 months hot, archive cold |
| events | On threshold cross or manual | By asset, by severity, by time | Indefinite |
| work_orders | On create/update | By asset, by status, by due date | Indefinite |
| investigations | On create/update | By asset, by status | Indefinite |
| kpi_snapshots | Hourly/daily batch | Latest + historical by asset | 24 months |
| rul_predictions | On new sensor reading | Latest by sensor | 6 months |

### Demo vs Production

The demo (baytown.js) remains as-is for the portfolio. The production path layers an API on top. Both serve the same components. The demo is the spec -- it defines the exact data shapes the API must return.

```
Demo:    import { ASSETS } from './data/baytown'
Prod:    const { data: assets } = useQuery('assets', fetchAssets)
```

Same destructured shape. Same component props. Different source.

## Consequences

- ADR-031 defines the target data model. Implementation is incremental -- each entity can be migrated independently.
- The frontend is ready. No component changes needed for real data.
- The backend is the build work: ingestion service, batch calculator, RUL service, API layer.
- The demo dataset (baytown.js) serves as the integration test fixture -- if the API returns the same shapes, the UI works.
- PM compliance, backlog, and emergency WO rate require the expanded work order fields (woType, dueDate, completionDate, craftType).
- RUL confidence intervals require the expanded sensor fields (trend array, degradationModel, pfInterval_days).
