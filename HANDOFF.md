# APM Dashboard Handoff -- Session 19 End

## START HERE
Asset Inspection fully scaffolded (all 9 sections rendering). Layout grouped by question. Architecture audit resolved. Navigation architecture documented (ADR-028). **Rob needs to review the page holistically and decide how data is surfaced before iterating further.**

## Deployed
- **APM Dashboard**: https://apm-dashboard-eosin.vercel.app
- **Portfolio case study**: https://designedbyrob.com/projects/honeywell-apm

## What was completed this session (19)

### Asset Inspection -- All 9 Sections Built
Full single-page Asset Inspection with grouped layout:

**Group A: Identity + Urgency** (full width)
1. Header -- name, status + criticality, specs row
2. KPI Strip -- 3 cards (OEE, RUL, Downtime) with 7-point sparklines, hover tooltips, health indicators. Stacks value above sparkline at <1056px.

**Group B: What's happening?** (two-col desktop)
3. Active Events -- single card, rows with severity badge, sub-asset, time, status. Filtered TIMELINE (new + in-progress only).
4. Sub-Asset Tree -- expandable rows per ISO 14224 hierarchy. Status dot + name + sensor count. Expand to see sensor values, thresholds, alarm states.

**Group C: What's being done?** (two-col desktop)
6. Work Orders & Investigations -- single card per type, rows inside. WOs show urgency icon + task + assignee + status. Investigations show ID + status + description.

**Group D: History** (full width, collapsible)
5. Event Timeline -- collapsed by default. Chevron to expand. Full chronological history (newest first) with severity badge, status coloring, event type labels.

**Group E: Deep Analysis** (K-101 only)
7. Degradation Trends -- 30-day normalized SVG multi-line chart (vibration, bearing temp, oil pressure, surge margin) with legend.
8. Performance Attributes -- table with value/expected/deviation, color-coded by severity.
9. Fault Tree -- recursive tree with border-left severity coloring, root cause highlighted.

Sections 7-9 only render for K-101 (conditional on data). Healthy assets show a short, calm page.

### Data Layer: Trend Arrays
All 10 assets now have:
- `oeeTrend` -- 7-point OEE history (matches asset narrative arc)
- `rulTrend` -- 7-point RUL burn-down in days
- `downtimeTrend` -- 7-point cumulative downtime hours

### Navigation Architecture (ADR-028)
Sidebar reduced from 7 to 4 items (plant-level only):
- Plant Overview, Events, Work Orders, Investigations
- Asset Inspection, Fault Tree, Trends removed from sidebar
- Asset-scoped views live inside Asset Inspection, accessed via Asset Table row click
- Dead icon components removed from Sidebar.jsx

### View Keys Migrated
Legacy `health`/`details` keys replaced with `overview`/`inspection` across App.jsx, TopBar.jsx, Sidebar.jsx, AssetInspection.jsx. All legacy aliases removed.

### HMR Stability
View and selected asset persisted in sessionStorage. Hot reloads stay on current page.

### Architecture Audit -- All Violations Resolved
- Zero hardcoded hex/rgba in components
- Zero inline fontSize number values
- Zero legacy view keys
- Architecture health: Good (was Poor)
- Audit doc rewritten: `vector/audits/invest-architecture.md`

### KPI Strip Sparkline Improvements
- Hover tooltip (cursor-following, inverted style) showing week label + value
- Vertical marker line + hover dot on sparkline
- Suppressed on mobile
- `unit` prop for formatting (%, days, h)

### Cross-Project Audit
- **Keytrn**: .env.example added, architecture audit written (Good), .gitattributes for language detection
- **Portfolio**: 8 unused dev deps removed (React/Storybook era), ESLint config rewritten, architecture audit rewritten (Excellent), .gitattributes for Astro detection
- **All 3 repos**: GitHub descriptions updated, language detection configured

## Next session: Design review

### Rob's open questions
- How should data be surfaced within each section? Current layout groups by question but information density and hierarchy need work.
- The page is functional but hard to parse quickly. Need to apply the same design thinking that went into Plant Overview.
- Think about: what does the engineer see first in each card? What's the visual hierarchy within a row? What earns screen real estate?

### Key constraint
Review holistically before iterating. Don't optimize individual sections in isolation -- the page needs to work as a flow.

## ADRs
28 total. New this session:
- **ADR-028**: Navigation architecture (plant sidebar, asset drill-down)

## Previous sessions
See git log for sessions 1-18. Key milestones:
- Session 13: Plant Overview complete, APM case study live
- Session 14: Data enrichment, event model restructure
- Session 15: WCAG 2.1 AA accessibility sweep
- Session 16: Mobile responsive pass, dense mode
- Session 17: Data layer overhaul, Asset Inspection research + planning
- Session 18: Asset Inspection header, spacing system (ADR-027)
