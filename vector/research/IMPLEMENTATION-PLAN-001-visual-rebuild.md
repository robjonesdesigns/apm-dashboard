# IMPLEMENTATION-PLAN-001 -- Visual Rebuild

**Date:** 2026-03-25 (updated 2026-03-26)
**Status:** In progress
**Goal:** Make this look like a real polished enterprise dashboard. Not a recreation of what shipped, but a vision of what could have been.

---

## Completed

- [x] Project scaffold (React + Recharts + Tailwind + Vite)
- [x] Investiture doctrine (VECTOR.md, CLAUDE.md, ARCHITECTURE.md, 9 ADRs, desk research, 2 interviews, Figma gap analysis, interaction spec)
- [x] Three screens built (Plant Overview, Asset Inspection, Trends) -- need full rewrite
- [x] Shell components (Sidebar, TopBar, NotificationsPanel) -- need updates
- [x] Desaturated chart colors (ADR-002)
- [x] KPI sparklines + period-over-period context
- [x] Section headers between rows
- [x] Collapsible sidebar with labels (ADR-005)
- [x] Notifications panel: push behavior (compresses viewport)
- [x] Responsive card stacking
- [x] Figma gap analysis (FIGMA-REVIEW-001)
- [x] Engineer decision flow interview (INTERVIEW-002, 10-step chain)
- [x] Token system: semantic typography, fluid clamp(), even numbers, utility classes
- [x] Interaction spec (INTERACTION-SPEC-001, all screens)
- [x] Fault tree decision (ADR-007)
- [x] Fluid typography decision (ADR-006)
- [x] Screen naming decision (ADR-008: Plant Overview, Asset Inspection, Root Cause Analysis, etc.)
- [x] Sidebar/notifications mutual exclusion (ADR-009)
- [x] Logo + "ASSET PERFORMANCE MANAGEMENT" in top bar
- [x] 12-column grid system defined in global.css
- [x] Architecture audit run (health: POOR -- tokens defined but not adopted)
- [x] Portfolio case study updated with new screen names

---

## Next Session -- START HERE

### Step 0: Full rebuild from audit findings

The architecture audit found 100+ violations. The token system and grid are
well-defined but barely used. Every component needs to be rewritten against
the audit checklist. This is the priority before any new features.

**Audit-driven rebuild order:**

#### 0a. Rename files to match CLAUDE.md
- `AssetHealth.jsx` → `PlantOverview.jsx`
- `AssetDetails.jsx` → `AssetInspection.jsx`
- Update all imports in App.jsx

#### 0b. Fix data layer: move colors out of assets.js
- Remove all hardcoded hex colors from `src/data/assets.js`
- Colors belong in tokens.js/global.css, not data files
- Data files should contain only data (numbers, strings, structure)

#### 0c. Rebuild PlantOverview.jsx (was AssetHealth)
- Break into sub-components (currently 1101 lines, limit is 400):
  - `PlantOverview.jsx` -- orchestrator (~100 lines)
  - `ui/KpiBar.jsx` -- the 4 KPI cards + trains/active
  - `ui/TodaysActivity.jsx` -- work orders + cases
  - `ui/WhatChanged.jsx` -- overnight timeline
  - `ui/RiskMatrix.jsx` -- interactive grid
  - `ui/EventSummary.jsx` -- stacked bar + callout
  - `ui/BadActors.jsx` -- horizontal bar chart
  - `ui/AssetTable.jsx` -- full asset summary table
- All sub-components use:
  - `grid-12` and `col-*` classes for layout
  - Type composition classes (type-h1 through type-meta) -- no inline font styles
  - Token variables for all colors, spacing, radius -- no hardcoded hex
  - Even pixel values only
  - `card` class for card surfaces
  - `section-header` class for section labels

#### 0d. Rebuild AssetInspection.jsx (was AssetDetails)
- Break into sub-components (currently 765 lines):
  - `AssetInspection.jsx` -- orchestrator with tab bar
  - `ui/ReliabilityRow.jsx`
  - `ui/MaintenanceRow.jsx`
  - `ui/PerformanceRow.jsx`
  - `ui/RunStatusTimeline.jsx`
- Same token/grid/type rules as PlantOverview

#### 0e. Rebuild Trends.jsx
- Currently 571 lines, break into:
  - `Trends.jsx` -- orchestrator
  - `ui/TrendChart.jsx` -- the chart component
  - `ui/AttributeSelector.jsx` -- toggle buttons
- Fix undefined CSS variables (--spacing-sm, etc. don't exist)
- Use actual token variables

#### 0f. Build missing screens
- `RootCauseAnalysis.jsx` -- fault tree (ADR-007)
- `WorkOrders.jsx` -- task dashboard
- `Investigations.jsx` -- case/investigation dashboard

#### 0g. Rebuild Sidebar.jsx
- Match ADR-009: 64px collapsed, 320px expanded
- Correct icons per CLAUDE.md (factory, gear, node tree, line graph, checklist, briefcase)
- Mutual exclusion with notifications panel
- Full width top bar (no sidebar cutting into it)

#### 0h. Rebuild TopBar.jsx
- Avatar for account (settings, management)
- Help menu (KBAs, FAQs, Ask a Question)
- Date range selector
- "Last refreshed" timestamp
- Full padding, spans entire width

---

### Step 1-10: Feature polish (AFTER audit is clean)

Only proceed to these after the audit passes clean.

1. KPI cards: colored left borders, sparklines, period-over-period
2. Risk Matrix: interactive grid, priority gradient bar, filters Asset Summary
3. Event Summary: callout number, Event/Case toggle
4. Asset Summary table: rich rows with types, timestamps, contextual links
5. Notifications: time filters, severity badges, structured cards
6. Top bar: date selector, last refreshed, help, avatar
7. Asset Inspection header: running status, duration, tab bar
8. Asset Inspection visual polish per Figma
9. Trends polish: chart styling, brush, thresholds
10. Root Cause Analysis: interactive fault tree
11. Work Orders dashboard
12. Investigations dashboard
13. Mobile responsive: 4-column grid, simplified views
14. Case order creation modal (mobile-friendly)

---

## Design Direction

This is NOT a 1:1 recreation of what shipped at Honeywell. This is Rob's
vision of what the dashboard should have been: storytelling over data density,
clear hierarchy, breathing room, and guided analytical flow from overview to
insight to action.

The Figma frames are reference for layout and interactions. The visual
language (dark theme, teal accent, desaturated palette, Inter font) is new.

The engineer's 10-step decision chain (INTERVIEW-002) drives the layout.
Every card earns its place by answering a specific question in the chain:
Orient > Plan > Detect > Correlate > Identify > Investigate > Trace >
Deep Dive > Act > Verify.
