# APM Dashboard Handoff -- Session 14 End

## START HERE
Massive session across data architecture and UI polish. Data model is fully connected -- every aggregate derives from source data. Needs Action cards have unified filter pattern with ADR-023. Donut chart has custom rounded arc paths. Next: event data audit (check prose for consistency), then Asset Inspection screen.

## Deployed
- **APM Dashboard**: https://apm-dashboard-eosin.vercel.app
- **Portfolio case study**: https://designedbyrob.com/projects/honeywell-apm

## What was completed this session

### Data model -- fully connected
- All 10 assets have subAssets (65 total), narrative, lesson, eventHistory
- Event lifecycle: newEvents, inProgressEvents, closedEvents, falsePositives, repetitiveEvents
- activeEvents and totalEvents computed (not stored)
- workOrders and investigations counts computed from WORK_ORDERS and INVESTIGATIONS arrays
- RISK_MATRIX, EVENT_SUMMARY, BAD_ACTORS all computed from ASSETS
- NOTIFICATIONS derived from TIMELINE
- CS- prefix renamed to IN- across all data. CASES export renamed to INVESTIGATIONS.

### Event model -- 9 events, 5 types
- Trimmed from 12 to 9. Removed: WO/case system actions, Shutdown Complete (folded into trip), Maintenance Window (moved to WO-4484 note)
- 5 event types: alert, alarm, trip, anomaly, inspection
- EVT-005 renamed to High Vibration Trip, sub-asset removed (trip is asset-level)
- EVT-011 renamed to Bearing Damage Detected (detection, not confirmation)
- Provenance on cause/consequence/recommendation (source, confidence, updatedBy, status)
- Relationships (caused_by, cascaded_to, related_to)
- INCIDENTS export (INC-001: K-101 cascade, 7 events)
- Bidirectional linkages: WOs have eventId + linkedInvestigations, Investigations have linkedEvents + incidentId

### What Happened? (ImpactStrip) -- incident-driven
- Rewired from kpiImpact filter to INCIDENTS structure
- Trigger = incident.triggerEventId, Consequence = highest-severity caused_by event, Confirmation = inspection-type event
- Supports multiple incidents (each gets own row of three cards)
- Cards show event name as title, asset below

### Needs Action -- unified filter pattern (ADR-023)
- All three cards (Risk Matrix, Alarm Quality, Watch List) filter the Asset Table on click
- Filters stack as AND (click Risk Matrix + Alarm Quality narrows results through both)
- Consistent teal hover border + teal bg on selected
- Filter chips in card headers AND Asset Table toolbar (independently clearable)
- Risk Matrix chips split into two (criticality + status)
- "Clear all" link in Asset Table toolbar when 2+ filters active
- Cursor-following tooltips on all three cards with "Click to filter Asset Table" hint
- Risk Matrix tooltip: event count, CriticalityIndicator badge, hint
- All legends use shared Legend component with title prop

### Donut chart
- Custom describeRoundedArc function with quadratic bezier corners (2px radius)
- 2.5 degree gap between segments
- Hover: expand 3px + teal outline ring
- Selected: expand 3px + teal outline ring (full opacity)

### In Progress section (WOs + Investigations)
- Three-line balanced layout: task/description | urgency/status, asset | assignee, context | timestamp
- WO rows show triggering event name + incident name (context text, not links)
- Investigation rows show scope counts (X events, Y WOs)
- Row is the clickable target (teal task name), context is informational

### Naming updates
- Section headers: System Health, What Happened?, In Progress, Needs Action, Assets
- Sidebar/TopBar: Root Cause -> Fault Tree
- Event Feed (was Notifications)
- Quick Access links: Asset Inspection, Trends, Fault Tree
- Risk Matrix cell opacity bumped (--color-*-bg-strong tokens at 0.24)

### New ADR
- ADR-023: Unified Needs Action filter pattern

## Still to do

### Event data audit
- Check all 9 events' cause/consequence/recommendation prose for consistency
- Verify each event name reads well on notification card (no redundancy with asset)
- eventType field not yet rendered in UI (could show as subtle tag)

### Plant Overview polish
- Risk Matrix cell opacity might need more tuning
- WhatChanged component exists but is orphaned (not rendered on Plant Overview -- lives on future Events screen)

### Next major build
- Asset Inspection screen -- sub-asset data is ready, event data is ready

### Doctrine updates needed
- CLAUDE.md ADR index needs ADR-023
- CLAUDE.md shared components needs Legend title prop documented
- CLAUDE.md screen names: Root Cause -> Fault Tree

### Parking lot
- /design-system route on portfolio
- CSP hash script-src on portfolio
- Game/training concept (see memory: project_apm_game_concept.md)

## Key files modified this session
- `src/data/assets.js` -- sub-assets, eventHistory, event model, provenance, relationships, incidents, computed aggregates, IN- rename
- `src/components/ui/ImpactStrip.jsx` -- incident-driven three-act narrative
- `src/components/ui/AlarmQuality.jsx` -- click-to-filter, rounded arc donut, shared Legend
- `src/components/ui/RiskMatrix.jsx` -- tooltip, stronger cell bg, shared Legend
- `src/components/ui/BadActors.jsx` -- click-to-filter, teal hover/selected, shared Legend
- `src/components/ui/AssetTable.jsx` -- alarm/actor filters, clear all, INVESTIGATIONS rename
- `src/components/ui/TodaysActivity.jsx` -- three-line rows, event/incident context, INVESTIGATIONS rename
- `src/components/ui/Legend.jsx` -- title prop
- `src/components/PlantOverview.jsx` -- independent filter state, section renames
- `src/components/NotificationsPanel.jsx` -- Event Feed, card restructure, provenance, relationships
- `src/components/TopBar.jsx` -- Fault Tree rename
- `src/components/Sidebar.jsx` -- Fault Tree rename
- `src/styles/global.css` -- *-bg-strong tokens
- `vector/decisions/ADR-023-needs-action-filter-pattern.md`
