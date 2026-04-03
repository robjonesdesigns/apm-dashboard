# APM Dashboard Handoff -- Session 22 End

## START HERE
Navigation architecture rethink. Trends, Fault Tree, and Performance are NOT sections embedded in Asset Inspection. They are their own dedicated pages with multiple entry points (drill-downs from Asset Inspection, Events, or potentially plant-level). Asset Inspection shows preview snapshots of these with contextual links to the full page. Next: hiring manager onboarding, then build this navigation model, then refine Asset Inspection flow.

## Deployed
- **APM Dashboard**: https://apm.designedbyrob.com
- **Portfolio case study**: https://designedbyrob.com/projects/honeywell-apm

## Next session priorities

### 1. Hiring manager onboarding walkthrough
Guided tour for non-engineers landing on the demo. Explains context: "You're a reliability engineer at a refinery. This is your morning view." Turns a confusing demo into a story they can follow.

### 2. Navigation architecture -- drill-down model
**Current (wrong):** Trends, Fault Tree, Performance embedded as scrollable sections in Asset Inspection.

**Correct model:** These are their own pages. Asset Inspection and Events show preview cards with links to drill deeper.

```
Sidebar (plant-level):
  Overview → Asset Table → Asset Inspection
  Events → Event Detail → Fault Tree
  Trends (plant-wide or asset-filtered)
  Performance (plant-wide or asset-filtered)

Cross-links (contextual, not sidebar):
  Asset Inspection → Fault Tree (preview + link)
  Asset Inspection → Trends (preview + link)
  Asset Inspection → Performance (preview + link)
  Event Detail → Fault Tree (for this event's root cause)
```

**Key principles:**
- Sidebar stays plant-scoped
- Deep views are reached by drilling in, not from the sidebar
- Fault Tree is reachable from Asset Inspection OR Events (both lead to root cause)
- Asset Inspection surfaces just enough to answer "should I go deeper?" -- preview cards, not full sections
- Engineers drill down into specific data, they don't look at all trends at once

### 3. Asset Inspection flow review
After extracting deep views, Asset Inspection becomes a narrative:
1. How bad is it right now? (status, criticality, KPIs)
2. What's causing it? (sub-asset tree with problem sensor highlighted)
3. What's already being done? (active work orders, investigations)
4. What happened before? (event history, collapsed)
5. Go deeper: preview cards linking to Trends, Fault Tree, Performance

### 4. Triage heuristic audit (HEURISTIC-AUDIT.md)
24 findings: 0 catastrophic, 4 major, 12 minor, 8 cosmetic.

**The 4 major findings:**
1. No data freshness timestamp -- `PLANT.lastRefreshed` exists in data but never rendered
2. Sidebar icon-only rail forces recall -- native title tooltip has ~500ms delay, too slow
3. No keyboard shortcuts -- daily-use tool with zero accelerators
4. Help button is non-functional -- no onClick handler, no help resources

**Bug found:** NotificationsPanel.jsx line 575 references undefined `filter` variable.

### 5. Potential Tailwind v4 migration
Same pattern as Keytrn: tokens.js -> @theme block in global.css. Could be applied here.

## What was completed this session (21)

### Nielsen Heuristic Audit
- HEURISTICS.md doctrine (547-line reference) added to project root
- HEURISTIC-AUDIT.md written (24 findings)
- CLAUDE.md updated with doctrine pointer
- No code fixes yet -- waiting for triage

### Strongest areas noted in audit
- H2 (domain language alignment) -- ISA-101 terminology correct for reliability engineers
- H5 (error prevention) -- filter design prevents invalid states
- H8 (information architecture) -- five-icon-system differentiation, triage-ordered section layout

## ADRs
28 total. No new ADRs this session.

## Previous sessions
See git log for sessions 1-20. Key milestones:
- Session 13: Plant Overview complete
- Session 17: Data layer overhaul, Asset Inspection research + planning
- Session 18: Asset Inspection header, spacing system (ADR-027)
- Session 19: Asset Inspection full build (9 sections), navigation architecture (ADR-028)
