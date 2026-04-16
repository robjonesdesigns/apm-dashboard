# ADR-032: Production Tracking and OEE Computation

**Status:** Accepted
**Date:** 2026-04-16

## Context

Plant Overview's KPI bar currently hardcodes OEE, Availability, Performance, and Quality in the route loader. The commercial product cannot ship with hardcoded KPIs — midmarket buyers will check these numbers against their expectations and the demo fails the moment the values don't move. Track A wired Plant Overview to live data for asset counts. The next step is to extend that wiring to the OEE family of KPIs.

The Timescale schema (migration 001) has sensors, alarm events, failure records, RUL predictions, insights, and work orders. It does **not** have:
- Asset runtime state transitions (when an asset moves between running / degraded / down)
- Production throughput (units produced per asset per hour)
- Quality counts (good vs defective production)
- Plant-level KPI rollups

Without these, OEE is unavailable. This ADR defines the data model that fills the gap.

## Research

**DESK-RESEARCH-024 (SMRP KPI formulas):** Authoritative formulas for OEE, Availability, Performance, Quality, MTBF, MTTR, and PM Compliance. Benchmarks for refinery-tier continuous process (85-93% world-class OEE, 96%+ mechanical availability). The availability formula excludes planned downtime from the denominator because you measure reliability against *expected* run time.

**DESK-RESEARCH-019 (information density and PdM calculations):** Plant KPIs must update at least hourly; assets typically hourly; sensor attributes per-minute or faster. Specifies which computations happen at which tier (plant/asset/sub-asset/sensor).

**DESK-RESEARCH-025 (historian + CMMS integration):** In production, OEE inputs come from MES (SAP PM, AspenOne MES, Wonderware MES) via PI Historian tags. APM consumes precomputed KPIs; it does not replace MES. The simulator plays the role of MES in our development environment.

**ISO 22400-2 (key performance indicators for manufacturing operations):** Defines OEE, Availability, Effectiveness, Quality ratio, and production planning indicators. Our formulas follow ISO 22400 conventions with SMRP terminology.

**STORY-002 (asset narratives):** Each asset has a design capacity (K-101 H₂ recycle rate, P-203 flow rate, etc.) and a failure story (K-101 4-stage bearing failure, P-203 seal wear, E-105 asphaltene fouling). Design capacity is the denominator of Performance; failure stories drive Availability drops.

## Decision

### Entity Model

```
Asset                                 (existing)
├─ design_throughput_rate             (new column: units/hour at 100% performance)
├─ design_throughput_unit             (new column: 'Nm3/h', 'bbl/h', 'kg/h', etc.)
└─ production_weight                  (new column: 0-1, fraction of plant OEE this asset contributes)

AssetRuntimeState                     (new hypertable)
├─ asset_id, ts, state                (running | degraded | down | standby | out_of_service)
├─ reason_code                        (optional -- ISO 14224 failure code when state=down)
└─ is_planned                         (boolean -- distinguishes planned maintenance from unplanned failures)

ProductionLog                         (new hypertable)
├─ asset_id, hour                     (partition on hour timestamptz, top of hour)
├─ units_produced                     (numeric, actual output)
├─ units_theoretical                  (numeric, design_rate * run_hours)
├─ units_defective                    (numeric, off-spec or scrap)
└─ run_seconds                        (integer, time in running/degraded state this hour)

AssetKpiHourly                        (continuous aggregate over AssetRuntimeState + ProductionLog)
├─ asset_id, hour
├─ availability, performance, quality, oee
└─ All computed per SMRP formulas (see below)

PlantKpiHourly                        (continuous aggregate rolling up AssetKpiHourly)
├─ plant_id, hour
└─ availability, performance, quality, oee (production-weighted by asset.production_weight)
```

### Formulas

Per SMRP 6.0 / ISO 22400:

**Per-asset, per-hour:**
```
run_seconds        = seconds in ('running','degraded') state this hour
planned_seconds    = 3600 - seconds in 'out_of_service' (planned outage) state
unplanned_down     = seconds in 'down' state (not planned)

availability       = run_seconds / planned_seconds
performance        = units_produced / units_theoretical
quality            = (units_produced - units_defective) / units_produced
oee                = availability * performance * quality
```

Guards: if `planned_seconds = 0`, availability = null (asset not expected to run). If `units_produced = 0`, performance and quality = null (no basis for calculation).

**Plant rollup (production-weighted):**
```
plant_metric       = Σ(asset_metric_i * asset.production_weight_i)
                     where asset_metric_i IS NOT NULL
```

Null asset metrics are excluded from the rollup, and weights are re-normalized over contributing assets. This handles assets in planned outage without distorting the plant average.

### Calculation Placement

| Computation | Where | Why |
|---|---|---|
| Runtime state transitions | Written by simulator (MES sim) / MES in prod | Source of truth for when an asset was running |
| Production counts | Written by simulator / MES | MES owns production data |
| Asset KPI hourly | `AssetKpiHourly` continuous aggregate | Aggregates the source tables, refreshed every 15 min |
| Plant KPI hourly | `PlantKpiHourly` continuous aggregate | Rolls up `AssetKpiHourly` with weights |
| Dashboard queries | Route loader reads `PlantKpiHourly` | Cheap point query, no heavy compute at request time |
| Delta (vs yesterday) | Two point queries (now + 24h ago) | Simpler than `LAG` window functions, readable |

### Planned vs unplanned downtime

The `AssetRuntimeState.is_planned` flag distinguishes:
- Planned downtime (`is_planned=true`, state typically `out_of_service`): excluded from availability denominator
- Unplanned downtime (`is_planned=false`, state=`down`): counted against availability

Per SMRP, only unplanned downtime hurts availability. Planned maintenance *improves* reliability metrics (MTBF) because you're catching failures before they happen.

### Data retention

Hourly rollups: retain indefinitely (small, ~8,760 rows per asset per year).
Raw `AssetRuntimeState`: compress after 30 days, keep 2 years.
Raw `ProductionLog`: 1-hour granularity keeps volume small (~8,760 rows per asset per year).

### MES integration seam (future)

When a real customer arrives, `AssetRuntimeState` and `ProductionLog` become ingestion targets for their MES:
- SAP PM → notifications webhook → upsert into these tables
- Wonderware / AspenOne MES → equivalent integration per vendor
- The continuous aggregates and loader queries are unchanged — only the write path differs

This is why the simulator fills these tables instead of computing OEE directly: the simulator is a stand-in for MES, and the downstream architecture is production-accurate.

## Implementation

### Migration 002 — `commercial/supabase/migrations/002_production_tracking.sql`

- Alter `assets`: add `design_throughput_rate`, `design_throughput_unit`, `production_weight`
- Create `asset_runtime_states` (hypertable, 1-day chunks)
- Create `production_log` (hypertable, 7-day chunks — hourly granularity so chunks stay small)
- Create `asset_kpi_hourly` continuous aggregate over the two source tables
- Create `plant_kpi_hourly` continuous aggregate rolling up `asset_kpi_hourly` with weights
- Refresh policies: 15 minutes
- Retention policies as above

### Simulator extension — `commercial/scripts/seed.mjs`

- Per-asset design rates from STORY-002 / ADR-031 (reference data table)
- Hourly state derivation from the existing physics pipeline:
  - K-101: running days 1-27, degraded day 27 hours 0-2, down day 27 hour 2 through day 27 hour 7, running after
  - P-203: degraded from day 14 onward (linear seal wear), trips day 32
  - E-105: degraded from day 20 (asphaltene fouling), continues to run at reduced rate
  - Everything else: normal run with minor fluctuation
- Throughput = design_rate × state_efficiency × hours_in_state
  - Running: 100% of design
  - Degraded: 65-85% depending on asset physics
  - Down / out_of_service: 0%
- Quality = baseline 0.998 × state_quality_factor
  - Running: 1.00
  - Degraded: 0.96-0.99
  - Recovery after failure: 0.90-0.95 for the first run hour

### Loader update — `app/routes/_index.jsx`

Replace hardcoded OEE/Availability/Performance/Quality with a `plant_kpi_hourly` query:
```sql
WITH latest AS (
  SELECT availability, performance, quality, oee
  FROM plant_kpi_hourly
  WHERE plant_id = $1
  ORDER BY hour DESC
  LIMIT 1
),
prev AS (
  SELECT availability AS prev_availability, performance AS prev_performance,
         quality AS prev_quality, oee AS prev_oee
  FROM plant_kpi_hourly
  WHERE plant_id = $1 AND hour <= now() - interval '24 hours'
  ORDER BY hour DESC
  LIMIT 1
)
SELECT * FROM latest CROSS JOIN prev
```

### UI — remove hardcoded fallbacks

`KpiBar.jsx` currently accepts `kpis` with a fallback to `PLANT` from baytown.js. After this ADR:
- KpiBar requires `kpis` as a required prop
- If a field is null (asset has no planned production time, etc.), show `—` in that slot
- If no data exists yet (fresh DB, seeder hasn't run), route shows an empty state with "No KPI data yet — run the simulator"

## Consequences

**Positive:**
- Plant Overview shows real, demo-accurate OEE that moves with the K-101 failure story
- Data model matches how real MES feeds an APM, so customer integration is a write-path swap
- All four KPIs (OEE family) share the same source-of-truth pipeline
- SMRP/ISO 22400 conformance is a selling point for midmarket buyers accustomed to audited KPIs

**Negative:**
- Schema complexity: 2 new hypertables, 2 new continuous aggregates
- Simulator complexity: state transitions + throughput + quality per asset per hour over the 28-day window
- Refresh latency: continuous aggregates update every 15 minutes, so "real-time" is actually "up to 15 min stale"

**Mitigations:**
- Hypertables are cheap at this scale (<10 MB for 500 assets × 2 years)
- Simulator is one-time work; real MES integration is per-customer and normal cost of sale
- 15-min refresh is fine for KPI dashboards; real-time is reserved for sensor attribute screens (Trends), not plant rollups

## References

- SMRP 6.0 Best Practices Guide (OEE formulas, benchmarks)
- ISO 22400-2:2014 (key performance indicators for manufacturing operations management)
- DESK-RESEARCH-019 (information density and PdM calculations)
- DESK-RESEARCH-024 (SMRP KPI formulas, tier benchmarks)
- DESK-RESEARCH-025 (historian + CMMS integration for MES seam)
- STORY-002 (asset narratives and failure stories that drive the simulator)
- Migration 001 (base schema)
