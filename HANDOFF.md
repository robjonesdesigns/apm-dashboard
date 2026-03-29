# APM Dashboard Handoff -- Session 14 End

## START HERE
Massive session. Data model fully connected. Needs Action unified filter pattern (ADR-023). KPI sparkline with inline dropdown. Donut chart with rounded arc paths. Investigation IDs renamed CS- to IN-. Next session: accessibility sweep across the full dashboard, then ADR update pass.

## Deployed
- **APM Dashboard**: https://apm-dashboard-eosin.vercel.app
- **Portfolio case study**: https://designedbyrob.com/projects/honeywell-apm

## Next session priorities

### 1. Accessibility sweep (full dashboard)
Systematic WCAG audit across all interactive elements:
- Color contrast (3:1 non-text, 4.5:1 text) on all data viz, badges, indicators
- aria-labels on all interactive SVG charts (donut, risk matrix, watch list, sparkline)
- Keyboard navigation for all clickable elements (filter cards, table rows, notification items)
- Screen reader support (role attributes, live regions for filter updates)
- Color independence (SC 1.4.1) -- no meaning conveyed by color alone
- prefers-reduced-motion support for animations
- Desk research doc needed: DESK-RESEARCH-016-accessibility-audit.md

### 2. ADR update pass
Go through all 23 ADRs and update stale decisions. Known stale items:
- Section names changed (Plant Health -> System Health, etc.)
- Screen names changed (Root Cause -> Fault Tree)
- Event model restructured (9 events, 5 types, provenance, incidents)
- Notification panel -> Event Feed
- CS- -> IN- prefix
- CASES -> INVESTIGATIONS
- Filter pattern (ADR-023 exists but other ADRs may reference old patterns)
- ImpactStrip now incident-driven
- KPI sparkline dropdown added
- Donut chart rounded arcs
- Legend component has title prop
- Risk Matrix stronger bg tokens

### 3. Then: Asset Inspection screen

## What was completed this session

### Data model -- fully connected
- 65 sub-assets with sensors, thresholds, statuses, narratives, lessons
- eventHistory on assets with events outside 24-hour TIMELINE
- Event lifecycle: newEvents, inProgressEvents, closedEvents, falsePositives
- activeEvents, totalEvents, workOrders, investigations all computed
- RISK_MATRIX, EVENT_SUMMARY, BAD_ACTORS all computed from ASSETS
- NOTIFICATIONS derived from TIMELINE
- CS- renamed to IN-, CASES renamed to INVESTIGATIONS
- V-501 event counts fixed, IN-0895/IN-0896 linked to historical events

### Event model -- 9 events, 5 types
- alert, alarm, trip, anomaly, inspection
- Provenance (source, confidence, updatedBy, status) on cause/consequence/recommendation
- Relationships (caused_by, cascaded_to, related_to)
- INCIDENTS (INC-001: K-101 cascade)
- Bidirectional linkages across all entities

### What Happened? (ImpactStrip) -- incident-driven
- Derives from INCIDENTS structure, not kpiImpact filter
- Supports multiple incidents
- "Go to Events" link (consistent copy)

### Needs Action -- unified filter pattern (ADR-023)
- All three cards filter Asset Table on click (stackable AND filters)
- Consistent teal hover/selected affordance
- Filter chips + "Clear all" in Asset Table toolbar
- Cursor-following tooltips with "Click to filter Asset Table" hint
- Risk Matrix: tooltip with CriticalityIndicator + count, stronger cell bg tokens
- Donut: rounded arc paths (describeRoundedArc with quadratic bezier corners, 2px radius, 2.5 degree gaps)
- Watch List: teal border hover/selected on bar rows
- All legends use shared Legend component with title prop

### KPI sparkline dropdown
- Inline dropdown popover (4px gap, overlay, shadow)
- 24-hour sparkline (KPI_24H data, not 12-month OEE_TREND)
- Subtle reference band for normal range (above warning threshold)
- Event marker (dashed vertical line at 2:03 AM)
- Before/After comparison + "K-101 Trip 2:03 AM" in time range row
- aria-label for screen readers
- "Go to Trends" link
- Desk research: sparkline best practices (Tufte, Few, WCAG)

### In Progress section
- Three-line balanced layout for WO and Investigation rows
- WO rows show event name + incident name (context, not links)
- Investigation rows show scope counts (X events, Y WOs)

### Naming updates
- Section headers: System Health, What Happened?, In Progress, Needs Action, Assets
- Fault Tree (was Root Cause)
- Event Feed (was Notifications)
- Quick Access: Asset Inspection, Trends, Fault Tree
- "Go to Events" (was "See full timeline")

### New tokens
- --color-error-bg-strong, --color-warning-bg-strong, --color-info-bg-strong (0.24 opacity)

### ADRs
- ADR-023: Unified Needs Action filter pattern

## Key files modified
- `src/data/assets.js` -- full data model overhaul
- `src/components/ui/KpiBar.jsx` -- sparkline dropdown
- `src/components/ui/ImpactStrip.jsx` -- incident-driven narrative
- `src/components/ui/AlarmQuality.jsx` -- rounded arcs, click-to-filter, shared Legend
- `src/components/ui/RiskMatrix.jsx` -- tooltip, stronger bg, shared Legend
- `src/components/ui/BadActors.jsx` -- click-to-filter, teal hover/selected
- `src/components/ui/AssetTable.jsx` -- alarm/actor filters, clear all
- `src/components/ui/TodaysActivity.jsx` -- three-line rows, INVESTIGATIONS rename
- `src/components/ui/Legend.jsx` -- title prop
- `src/components/NotificationsPanel.jsx` -- Event Feed, provenance, relationships
- `src/components/PlantOverview.jsx` -- filter state, section renames
- `src/components/TopBar.jsx` -- Fault Tree
- `src/components/Sidebar.jsx` -- Fault Tree
- `src/styles/global.css` -- *-bg-strong tokens
- `vector/decisions/ADR-023-needs-action-filter-pattern.md`
