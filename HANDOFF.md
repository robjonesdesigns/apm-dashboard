# APM Dashboard Handoff -- Session 13 End

## START HERE
Plant Overview is complete and deployed. Asset stories and sub-asset data documented in STORY-002. Next session: finish enriching event metadata, then build the data into assets.js, then start Asset Inspection screen.

## Deployed
- **APM Dashboard**: https://apm-dashboard-eosin.vercel.app
- **Portfolio case study**: https://designedbyrob.com/projects/honeywell-apm

## In Progress: Event Metadata Enrichment

We were going through all 11 events adding structured metadata (name, description, cause, consequence, recommendation). Completed Event 1, started on structure for all 11.

### Key decision: Events vs System Actions
Work order creation and investigation opening are NOT events. They're system actions in response to events. The event timeline should only contain things that happened to equipment. WOs and investigations are already tracked in their own arrays.

### 11 Real Events (from STORY-002 narratives)

| # | Time | Asset | Event Name | Severity | Status |
|---|---|---|---|---|---|
| 1 | 1:30 AM | K-101 | Oil Pressure Drop | High | Metadata DONE |
| 2 | 1:45 AM | K-101 | Oil Pressure Alarm | Critical | Needs metadata |
| 3 | 2:00 AM | K-101 | Vibration Exceedance | Critical | Needs metadata |
| 4 | 2:03 AM | K-101 | Compressor Trip | Critical | Needs metadata |
| 5 | 2:04 AM | V-501 | Pressure Transient | Medium | Needs metadata |
| 6 | 2:05 AM | C-201 | Fan Vibration Anomaly | Medium | Needs metadata |
| 7 | 2:10 AM | K-101 | Shutdown Complete | Low | Needs metadata |
| 8 | 4:30 AM | P-203 | Discharge Pressure Low | High | Needs metadata |
| 9 | 6:00 AM | T-401 | Maintenance Window Opened | Low | Needs metadata |
| 10 | 6:45 AM | K-101 | Bearing Damage Confirmed | Critical | Needs metadata |
| 11 | 11:00 PM (prev) | K-302 | Discharge Temperature Oscillation | Medium | Needs metadata |

### Event 1 Metadata (completed)

```
Name: Oil Pressure Drop
Time: 1:30 AM
Asset: Compressor K-101
Sub-Asset: Lube Oil System (K-101-LOS)
Severity: High
Status: Confirmed
Description: Lube oil pressure dropped to 1.2 bar on the drive end bearing supply. Auxiliary oil pump auto-started to maintain minimum lubrication.
Cause: Oil filter bypass valve opened due to excessive differential pressure across the primary filter. Contaminated lubricant entering bearing housing over the past 14 days increased system resistance.
Consequence: Primary lube oil supply has failed. Auxiliary pump is a backup, not a permanent solution. Bearing is operating on reduced oil film thickness. Continued operation risks bearing surface damage and potential compressor trip.
Recommendation: Investigate filter condition. Sample oil for particle contamination. Monitor bearing temperature and vibration for acceleration.
KPI Impact: None (auxiliary pump compensating)
```

### Event metadata structure (for all events)
Each event needs: name, time, asset, assetId, subAsset, subAssetId, severity, status (new/confirmed/false-positive), description, cause, consequence, recommendation, kpiImpact, linkedWOs[], linkedInvestigations[]

### After metadata is complete
1. Rebuild TIMELINE array in assets.js with full metadata per event
2. Remove the string-matching `getEventDetails()` function from NotificationsPanel.jsx
3. Derive NOTIFICATIONS from TIMELINE (they're the same events, different format)
4. Update EVENT_SUMMARY and RISK_MATRIX to derive from the enriched event data

## What was completed this session

### Plant Overview (complete)
- Naming: Requires Attention, Event Triage, Watch List, Alarm Quality
- Data reconciliation: 21 events, newEvents/inProgressEvents per asset
- Asset Table: 9 columns, smart search, pagination, sortable headers, shared FilterButton, Event Triage filter, fixed height, horizontal scroll with fade gradient hint
- Typography: 13 classes to 9, zero inline font-size overrides
- Color audit: zero inline hex/rgba, all tokenized
- WO urgency: Emergency/Urgent/Scheduled (WoPriority.jsx)
- Five icon systems: events, investigations, WO urgency, criticality, asset status
- Impact Strip: three cards (Trigger/Consequence/Confirmation)
- Watch List: pure React bars, cursor-following tooltip, CriticalityIndicator inverted prop
- Notifications: shared FilterButton, count badge removed

### Shell
- Sidebar: hover-to-expand (desktop), full-screen drawer with branding (mobile)
- TopBar: "Asset Performance Management", hamburger on mobile
- NotificationsPanel: 320px push (desktop), full-screen overlay (mobile)
- All Feather/Lucide icons
- Responsive: useIsMobile hook at 671px breakpoint

### Asset stories (STORY-002)
All 10 assets with complete narratives, sub-asset trees, sensor data, thresholds:
- K-101: bearing failure from oil contamination (7 sub-assets)
- P-203: recurring seal failure from shaft misalignment (6 sub-assets)
- K-302: polymer fouling misdiagnosed as controls (7 sub-assets)
- C-201: fan belt loosened by K-101 trip cascade (5 sub-assets)
- T-401: planned inspection pending morning huddle (7 sub-assets, status changed to Running)
- E-105: accelerated fouling from crude slate change (6 sub-assets)
- T-102: fuel nozzle coking, exhaust spread widening (7 sub-assets)
- V-501: pressure transient verification (7 sub-assets)
- R-301: healthy reactor, catalyst performing (7 sub-assets)
- P-102: healthy support pump (6 sub-assets)

### T-401 Status Change
Changed from "planned-outage" to "running". The inspection was scheduled weeks ago but K-101 tripped overnight. The maintenance team is waiting for the morning huddle to decide whether to proceed or defer. The turbine is healthy and generating 18.4 MW of power the plant needs.

### Portfolio updates
- APM live URL, 3 videos, before/after, research images
- Affinity map with reliability engineer data (Miro AI)
- Usability session screenshot with screen share
- Five-icon-system design decision
- Structured process content (paragraphs + bullets)
- Branded mobile card colors (APM teal, Keytrn navy)
- Alternating mobile card positions
- Orientation note: built in React, sourced from IBM's Carbon Design System
- APM year corrected to 2024-2025, duration 1 year

### Plant context
Baytown Refinery. Petroleum refinery producing gasoline, diesel, jet fuel, petrochemical feedstocks. Hydrocracker unit + FCC unit + Utilities.

## Next session priorities

### 1. Finish event metadata (events 2-11)
Continue from where we stopped. Each event needs: description, cause, consequence, recommendation. Use the STORY-002 narratives as the source.

### 2. Rebuild data
- TIMELINE with full metadata
- Remove getEventDetails() string matching
- Derive NOTIFICATIONS from TIMELINE
- Update T-401 status to "running" in assets.js
- Add missing events (C-201, V-501, K-302) to timeline

### 3. Asset Inspection screen
- Sub-asset data is ready in STORY-002
- Three-level IA: Reliability / Maintenance / Performance
- Drill-down from Asset Table and Watch List

### 4. Events screen
- Full timeline with all events
- Event detail with metadata
- Filtering by asset, severity, time range

### 5. Remaining screens
- Root Cause, Trends, Work Orders, Investigations, Settings (placeholders)

## Doctrine inventory
- 22 ADRs (001-022)
- 15 desk research docs
- 2 stories (STORY-001 timeline, STORY-002 asset narratives)
- 2 interviews, 2 personas

## Shared components
- Badge.jsx -- event severity (tally + fill hierarchy)
- CriticalityIndicator.jsx -- asset criticality (A/B/C/D, inverted prop)
- Legend.jsx -- chart legend (swatch + label + value)
- FilterChip.jsx -- dismissable filter tag
- FilterButton.jsx -- filter button + checkbox dropdown
- WoPriority.jsx -- WO urgency (circle icons + text)
