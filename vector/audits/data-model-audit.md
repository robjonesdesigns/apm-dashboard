# Data Model Audit -- baytown.js
Date: 2026-03-31
File: `src/data/baytown.js`

---

## 1. Field Naming Consistency

Searched for all four deprecated field names: `linkedWOs`, `linkedInvestigations`, `linkedWorkOrders`, `linkedEvents`.

**Result: No matches found.** Zero occurrences in baytown.js or any .jsx file under src/components/.

Current naming is fully migrated:
- Single entity references: `eventId`, `assetId`, `incidentId`
- Array references: `workOrderIds`, `investigationIds`, `eventIds`, `investigationIds`

---

## 2. Derivation Integrity

### deriveMTBF

**Formula:** `Math.round(obsHours / failures.length)` where failures = TIMELINE events with `eventType === 'trip'` OR `status === 'closed'` for the given asset.

**BUG -- K-101 MTBF is significantly wrong.**

K-101 events in TIMELINE by status:
- Closed (4): EVT-K101-H4 (quarterly vibration baseline inspection), EVT-K101-H7 (anti-surge valve cycling, resolved), EVT-K101-H6 (filter DP alert, no action), EVT-K101-H5 (oil sample results, acceptable)
- Trip (1): EVT-005

deriveMTBF counts all 4 closed events + 1 trip = 5 "failures".
`672 / 5 = 134` -- this overwrites the hardcoded `mttr: 312` on the K-101 asset.

**The problem:** Closed events include routine inspections (quarterly vibration baseline, oil sample) and alerts that were monitored and closed without a repair. These are not failures. Using `status === 'closed'` as a failure proxy conflates "validated and closed out" with "asset failed." Only trips and fault events (alarm/alert that resulted in repair) should count.

Consequence: The derived MTBF (134h) is drastically lower than the narrative-backed value (312h trending down from 420h in MAINTENANCE_KPIS). MAINTENANCE_KPIS is a separate static export so it still shows 312 -- the two sources are now inconsistent in the rendered UI.

**Recommended fix:** Filter for `eventType === 'trip'` only, or add an explicit `isFailure: true` flag to events that represent actual failures requiring repair, and filter on that.

### deriveMTTR -- WO-4481

WO-4481: `created: '2:15 AM'`, `completedAt: '6:45 AM'`

parseTimeToHours:
- `'2:15 AM'` → h=2, m=15 → `2 + 15/60 = 2.25`
- `'6:45 AM'` → h=6, m=45 → `6 + 45/60 = 6.75`

`end (6.75) >= start (2.25)` → duration = `6.75 - 2.25 = 4.5h`

**Correct. WO-4481 produces exactly 4.5h.** K-101 has only one completed WO, so deriveMTTR returns 4.5 and the asset's `mttr` is updated from 4.2 to 4.5.

Note: This 4.5h mttr feeds directly into deriveAvailability (via `asset.mttr`) because the forEach updates mttr before calling deriveAssetOEE. The sequence is correct.

### deriveRUL -- K-101

`rulTrend: [42, 35, 28, 21, 14, 9, 5]`
- last = 5, prev = 9
- slope = 5 - 9 = -4 (declining)
- weeksToZero = 5 / 4 = 1.25
- daysToZero = Math.round(1.25 * 7) = Math.round(8.75) = 9
- return `Math.min(9, 5)` = **5 days** ✓

Matches the hardcoded `rul: '5 days'` on the asset. The cap at `last` is the correct behavior here -- the last reading IS the physical constraint.

### deriveAvailability -- K-101

At the time deriveAssetOEE is called in the forEach, `a.mttr` has already been updated to 4.5 (from deriveMTTR).

- Trips in TIMELINE for K-101: EVT-005 (eventType: 'trip') = 1 trip
- totalDowntime = 1 * 4.5 = 4.5h
- uptime = 4320 - 4.5 = 4315.5
- availability = 4315.5 / 4320 = 0.998958... → `Math.round(0.998958 * 1000) / 1000` = **0.999**

**Reasonable.** One trip with 4.5h downtime over a 6-month (4320h) observation window gives 99.9% availability for the period. The 64.2% OEE is driven by the degraded assumedPerformance (0.649), not availability, which is narratively correct -- K-101 ran degraded for weeks before tripping.

### deriveAssetOEE -- K-101

`availability (0.999) * assumedPerformance (0.649) * assumedQuality (0.990)`
= `0.999 * 0.649 * 0.990`
= `0.999 * 0.64251`
= `0.64186...`
→ `Math.round(0.64186 * 1000) / 10` = `Math.round(641.86) / 10` = `642 / 10` = **64.2%** ✓

Matches `oee: 64.2` exactly.

### derivePlantOEE

Using the static oee values from ASSETS (which are overwritten by deriveAssetOEE during forEach):

| Asset | OEE | Weight | Contribution |
|-------|-----|--------|-------------|
| K-101 | 64.2 | 0.20 | 12.840 |
| P-203 | 78.4 | 0.12 | 9.408 |
| C-201 | 82.1 | 0.08 | 6.568 |
| T-401 | 88.1 | 0.15 | 13.215 |
| E-105 | 93.7 | 0.06 | 5.622 |
| R-301 | 95.2 | 0.18 | 17.136 |
| V-501 | 94.8 | 0.05 | 4.740 |
| P-102 | 96.1 | 0.04 | 3.844 |
| K-302 | 79.3 | 0.07 | 5.551 |
| T-102 | 91.4 | 0.05 | 4.570 |
| **Sum** | | **1.00** | **83.494** |

`Math.round(83.494 * 10) / 10` = **83.5%**

Production weights sum to exactly 1.00. **Plant OEE of 83.5% is reasonable** for these 10 assets in partial scope. Consistent with the PLANT comment: "derivePlantOEE(ASSETS) returns ~83.5 from just these 10 assets -- correct formula, partial scope. 76.3 is the full-plant measurement."

Note: The derived OEE values (post-forEach) will differ slightly from these static values for assets where availability or performance is computed differently, but for all assets with no TIMELINE trips and stable assumedPerformance, the derived OEE matches the static value.

---

## 3. Cross-Reference Integrity

Three events traced in full.

### EVT-005 (High Vibration Trip, K-101, 2:03 AM)

**workOrderIds: ['WO-4481', 'WO-4482']**
- WO-4481.eventId = 'EVT-005' ✓
- WO-4482.eventId = 'EVT-005' ✓

**investigationIds: ['IN-0891', 'IN-0897']**
- IN-0891.eventIds = ['EVT-002', 'EVT-003', 'EVT-004', 'EVT-005', 'EVT-011'] -- EVT-005 present ✓
- IN-0897.eventIds = ['EVT-005'] ✓

**incidentId: 'INC-001'**
- INC-001.eventIds = ['EVT-002', 'EVT-003', 'EVT-004', 'EVT-005', 'EVT-006', 'EVT-007', 'EVT-011'] -- EVT-005 present ✓

All cross-references bidirectional and consistent.

### EVT-006 (Pressure Transient, V-501, 2:04 AM)

**workOrderIds: []** -- no WOs, nothing to check.

**investigationIds: ['IN-0898']**
- IN-0898.eventIds = ['EVT-006'] ✓

**incidentId: 'INC-001'**
- INC-001.eventIds includes EVT-006 ✓

All consistent.

### EVT-007 (Fan Vibration Anomaly, C-201, 2:05 AM)

**workOrderIds: ['WO-4498']**
- WO-4498.eventId = 'EVT-007' ✓

**investigationIds: ['IN-0892']**
- IN-0892.eventIds = ['EVT-007'] ✓

**incidentId: 'INC-001'**
- INC-001.eventIds includes EVT-007 ✓

All consistent.

**Overall cross-reference integrity: clean.** No orphaned references found across the three sampled events.

---

## 4. Component References to Old Field Names

Searched all .jsx files under src/components/ for: `linkedWOs`, `linkedInvestigations`, `linkedWorkOrders`, `linkedEvents`.

**Result: No matches found.** Components are fully migrated to the new field names.

---

## 5. getActiveIncident

```js
const active = incidents.filter(i => i.status === 'investigating' || i.status === 'open')
```

INCIDENTS contains one entry: INC-001 with `status: 'investigating'`. Passes the filter.

`active.sort(...)` on a single-element array is a no-op.

Returns `active[0]` = **INC-001** ✓

If called with default `incidents = INCIDENTS`, correctly returns INC-001.

---

## 6. assumedPerformance / assumedQuality

All 10 assets verified present with both fields:

| Asset | Status | assumedPerformance | assumedQuality | Sensible? |
|-------|--------|-------------------|----------------|-----------|
| K-101 | tripped | 0.649 | 0.990 | Yes -- severely degraded performance |
| P-203 | degraded | 0.793 | 0.989 | Yes -- degraded |
| C-201 | degraded | 0.831 | 0.988 | Yes -- degraded |
| T-401 | running | 0.890 | 0.990 | Yes -- healthy |
| E-105 | running | 0.946 | 0.990 | Yes -- healthy |
| R-301 | running | 0.960 | 0.992 | Yes -- most stable asset |
| V-501 | running | 0.957 | 0.991 | Yes -- healthy |
| P-102 | running | 0.970 | 0.991 | Yes -- healthy |
| K-302 | degraded | 0.802 | 0.989 | Yes -- fouling causing efficiency loss |
| T-102 | running | 0.924 | 0.989 | Yes -- slight degradation (nozzle coking) |

All 10 present. Gradient is correct: tripped/degraded assets cluster at 0.649-0.831, running assets at 0.890-0.970. K-302 at 0.802 correctly reflects the impeller fouling narrative. T-102 at 0.924 correctly reflects early-stage nozzle coking (not yet alarming).

---

## Summary

| Check | Result |
|-------|--------|
| Old field names in data file | Clean -- none found |
| Old field names in components | Clean -- none found |
| deriveMTTR (WO-4481) | Correct -- 4.5h |
| deriveRUL (K-101) | Correct -- 5 days |
| deriveAvailability (K-101) | Correct -- 0.999 |
| deriveAssetOEE (K-101) | Correct -- 64.2% |
| derivePlantOEE | Correct -- ~83.5% |
| Cross-references (3 events) | All bidirectional links verified clean |
| getActiveIncident | Returns INC-001 correctly |
| assumedPerformance/Quality on all 10 | Present and values are sensible |
| **deriveMTBF (K-101)** | **BUG -- see below** |

---

## Bug Report

**deriveMTBF inflates failure count by including closed non-failure events.**

Location: `deriveMTBF()` function, ~line 2434.

The failure filter `e.eventType === 'trip' || e.status === 'closed'` treats all closed events as failures. For K-101, four closed events are routine inspections and managed alerts (not equipment failures). This produces:

- Derived MTBF: **134h** (672 obs hours / 5 "failures")
- Correct narrative MTBF: **312h** (from MAINTENANCE_KPIS and asset declaration)

The overwrite in the forEach loop (`a.mtbf = computedMtbf`) silently replaces 312 with 134 at runtime. MAINTENANCE_KPIS is a separate static export that retains 312, creating a contradiction between two data sources that are both visible in the UI.

**Recommended fix options:**

Option A -- Filter on trip only (strictest):
```js
const failures = timelineEvents.filter(e => e.eventType === 'trip')
```

Option B -- Add explicit failure flag to relevant events and filter on it:
```js
// On event: isFailure: true
const failures = timelineEvents.filter(e => e.isFailure === true)
```

Option C -- Exclude inspection and routine-closure event types:
```js
const failures = timelineEvents.filter(
  e => e.eventType === 'trip' || 
       (e.status === 'closed' && e.eventType !== 'inspection')
)
```

Option A is simplest for the current data model. MTBF = observation hours per trip event is the standard reliability definition and matches the K-101 narrative (one trip in 28 days = 672h MTBF, which is reasonable for a compressor with a catastrophic bearing failure chain).

For assets with no trips and only closed alert events (like T-401), deriveMTBF would return null under Option A, and the hardcoded fallback (2800h) would be retained -- which is the correct behavior per the comment on those assets.
