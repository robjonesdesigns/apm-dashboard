# APM Dashboard Handoff -- Session 17 End

## START HERE
Data layer overhaul + mobile In Progress fix. TIMELINE expanded from 9 to 36 events -- every per-asset count (newEvents, inProgressEvents, closedEvents, falsePositives) is now derived from real event records, not hardcoded. RISK_MATRIX and EVENT_SUMMARY derive from TIMELINE through ASSETS. Active events enriched to 300-430 words of engineering prose (cause/consequence/recommendation with provenance). `assets.js` renamed to `baytown.js`. In Progress mobile rows simplified to 3 lines. Responsive carousel thresholds extended (Needs Action: 1055px, In Progress: 899px) but In Progress carousel reverted due to clipping issues -- stacks vertically on mobile for now.

## Deployed
- **APM Dashboard**: https://apm-dashboard-eosin.vercel.app
- **Portfolio case study**: https://designedbyrob.com/projects/honeywell-apm

## Next session: Asset Inspection screen

### Design decisions made
- **Single scrollable page, NOT tabs.** Rob's case study argues one-page is better than tabular. Research backs it: Tufte ("no such thing as information overload, only bad design"), Few (fragmenting data into screens is a dashboard mistake), ISA-101 (minimize navigation that distracts from primary task).
- **Not a Figma copy.** Original Honeywell design (Figma file `T9tAHmMPTmbTJnyxmqEmuB`, node `1:66745`) uses tabs, white bg, 3-col card grid. We are rethinking it with our data layer to make something better, like we did with Plant Overview.
- **K-101 first, generic for all 10.** K-101 has the richest data (fault tree, 30-day degradation, performance attributes). Other assets have sub-assets + sensors + events. Sections with no data collapse gracefully.
- **Extension of existing system.** Uses left-panel sidebar nav (not top tabs like Honeywell). Asset Inspection is accessed via asset row click in Asset Table. Existing navigation: `onNavigate('details', { asset })`. AssetInspection.jsx stub already exists in App.jsx VIEWS mapping.
- **Nothing hardcoded.** All data derived from TIMELINE, ASSETS, WORK_ORDERS, INVESTIGATIONS. New data should follow same pattern -- add to baytown.js, derive in computed sections.

### Research-backed section order
Mirrors reliability engineer mental model (from deep research -- see `project_apm_asset_inspection_research.md` in memory):

| # | Section | Engineer question | Data source |
|---|---------|------------------|-------------|
| 1 | Asset Header | "What am I looking at?" | ASSETS fields, ASSET_SPECS |
| 2 | KPI Strip | "How urgent is this?" | Asset fields (rul, oee, mtbf, mttr, pmCompliance), MAINTENANCE_KPIS sparklines |
| 3 | Active Events | "What's happening right now?" | TIMELINE filtered to asset, status new/in-progress |
| 4 | Sub-Asset Tree | "Where exactly is the problem?" | asset.subAssets with sensors, thresholds, status |
| 5 | Event Timeline | "What happened and when?" | TIMELINE filtered to asset, all statuses |
| 6 | Work Orders & Investigations | "What's being done?" | WORK_ORDERS, INVESTIGATIONS filtered to asset |
| 7 | Degradation Trends | "Show me the data." | K101_DEGRADATION (K-101 only, expand for others) |
| 8 | Fault Tree | "What caused what?" | K101_FAULT_TREE (K-101 only, expand for others) |
| 9 | Performance Attributes | "How far off is it?" | PERFORMANCE_ATTRIBUTES (K-101 only, expand for others) |

### Three asset states render differently
- **Tripped (K-101):** Reactive investigation mode. Red header, all sections populated, fault tree and degradation chart prominent.
- **Degrading (P-203):** Proactive planning mode. Trend data and recurring failure patterns visible. Maintenance history matters most.
- **Healthy (R-301):** Verification mode. "Dark and quiet" per ISA-101. Quick status confirmation, most sections collapsed/empty.

### Data layer needs
- ASSET_SPECS currently only exists for K-101. Need to derive specs dynamically from asset fields (type, service, processUnit, criticality, status) for all 10 assets, or add ASSET_SPECS per asset.
- K101_DEGRADATION, K101_FAULT_TREE, PERFORMANCE_ATTRIBUTES are K-101 only. Other assets need equivalent data eventually, but sections should render conditionally (only if data exists).
- Sub-asset tree data is complete for all 10 assets (65 sub-assets with sensors).
- Event data is complete for all 10 assets (36 events in TIMELINE).

### Files to create/modify
**New:**
- `src/components/AssetInspection.jsx` -- replace stub with full page
- `src/components/ui/SubAssetTree.jsx` -- expandable tree with sensor panels
- `src/components/ui/EventTimeline.jsx` -- vertical timeline with expandable details
- `src/components/ui/DegradationChart.jsx` -- multi-line trend (conditional)
- `src/components/ui/FaultTree.jsx` -- hierarchical tree viz (conditional)
- `src/components/ui/PerformanceTable.jsx` -- deviation table (conditional)

**Modified:**
- `src/components/ui/AssetTable.jsx` -- re-enable onAssetClick
- `src/components/PlantOverview.jsx` -- pass onNavigate to AssetTable
- `src/data/baytown.js` -- dynamic ASSET_SPECS, possibly new data exports

**Reuse:**
- Badge.jsx, CriticalityIndicator.jsx, WoPriority.jsx, Legend.jsx
- KpiBar pattern for KPI strip
- InProgress pattern for WO/Investigation cards
- useIsMobile hook for responsive

### Build order
Phase 1: Header + KPI Strip + Sub-Asset Tree + re-enable navigation
Phase 2: Active Events + Event Timeline + WO/Investigations
Phase 3: Degradation Chart + Fault Tree + Performance Table (K-101 conditional sections)

### Key constraint
Go through each section one by one with Rob before building. The section order and content need to make sense for the K-101 story and the game concept. Don't build all at once -- iterate section by section.

## Backlog
- **In Progress mobile tab switching** -- WO/Investigations toggle on mobile instead of stacking. Carousel approach had clipping issues and was reverted. Tab switching (simple state swap, one card visible at a time) is the better pattern.
- **Portfolio updates** -- Replace "coming soon" APM case study assets with Asset Inspection screen videos/images. `/design-system` route.
- **Game/training concept** -- See `project_apm_game_concept.md` in memory. Events arrive as raw signals, player enriches them. 36 events with full provenance make this game-ready.

## What was completed this session (17)

### Data layer overhaul
- TIMELINE expanded from 9 to 36 events (27 new historical/gap-filling events)
- All per-asset counts (newEvents, inProgressEvents, closedEvents, falsePositives) now derived from TIMELINE
- Hardcoded count fields removed from all 10 ASSETS
- eventHistory arrays removed from assets (promoted to TIMELINE)
- RISK_MATRIX and EVENT_SUMMARY derive from ASSETS which derives from TIMELINE
- NOTIFICATIONS filtered to recent events only (time field, not date)
- Single derivation chain: TIMELINE -> ASSETS (computed) -> RISK_MATRIX/EVENT_SUMMARY/BAD_ACTORS

### Event enrichment
- 15 active events (new/in-progress) enriched to 300-430 words each
- Engineering detail: ISO 10816 zones, ISO 4406 particle counts, SARA kinetics, TEMA fouling factors, bearing vibration spectrum analysis, filter bypass valve transient behavior, cross-parameter correlation gaps
- K-101 missed signals story: quarterly baseline (33% increase ignored), marginal oil sample (90th percentile), filter DP (bypass valve cracking open below alarm), 3-day vibration alert escalation
- P-203 recurring seal: alignment drift mechanism, seal chamber pressure progression, bearing temp correlation
- K-302 fouling: polymer deposit-and-shed sawtooth cycle, suction vs discharge diagnostic, online wash vs offline cleaning options
- T-102 nozzle coking: exhaust spread widening rate, nozzle flow distribution, coking vs liner degradation differential
- E-105 accelerated fouling: SARA precipitation kinetics, fouling factor progression, tube leak differential diagnosis
- T-401 scheduling: OEM grace period, contractor mobilization costs, grid capacity trade-off

### File rename
- `src/data/assets.js` renamed to `src/data/baytown.js` -- all 12 component imports updated

### In Progress mobile
- 3-line mobile rows: ID + task, asset + criticality, urgency/status on own line
- Asset-to-criticality gap widened from 4px to 8px (all breakpoints)
- Hover effects suppressed on mobile

### Responsive carousel thresholds
- Needs Action: carousel below 1056px (was 672px)
- In Progress: carousel attempted but reverted due to card clipping issues
- MobileCardCarousel extraction attempted then reverted (PlantOverview keeps its own copy)

## Previous sessions
See git log for sessions 1-16. Key milestones:
- Session 13: Plant Overview complete, APM case study live
- Session 14: Data enrichment, event model restructure, 5 event types
- Session 15: WCAG 2.1 AA accessibility sweep
- Session 16: Mobile responsive pass, dense mode, component renames
