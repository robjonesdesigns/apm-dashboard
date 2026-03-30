# APM Dashboard Handoff -- Session 18 End

## START HERE
Asset Inspection build started. Header section complete. Major platform-wide spacing and component consistency pass.

## Deployed
- **APM Dashboard**: https://apm-dashboard-eosin.vercel.app
- **Portfolio case study**: https://designedbyrob.com/projects/honeywell-apm

## What was completed this session (18)

### Asset Inspection -- Header (Section 1 of 9)
- `AssetInspection.jsx` rebuilt from stub. Single scrollable page structure in place.
- **Header:** Back link ("Plant Overview" with chevron-left), asset name as `section-header`, StatusIndicator + divider + CriticalityIndicator, specs row (type | service | processUnit with vertical dividers). No card wrapper -- page-level header like Plant Overview sections.
- Narrative removed from header -- it was portfolio storytelling prose, not operational data. The data sections below will tell the story.
- Navigation wired: Asset Table rows now clickable, navigate to `inspection` route with asset object. Back button returns to `health` (Plant Overview).
- `ASSET_SPECS` export removed from baytown.js (was K-101 only hardcoded duplicate of asset fields).

### StatusIndicator.jsx (new shared component)
- Asset status dot + label, matching the pattern of Badge/CriticalityIndicator/WoPriority.
- `compact` prop for dot-only (used in mobile Asset Table rows).
- Exports `statusLabel()` for aria-labels and filter drawer use.
- Replaced duplicated inline helpers in AssetInspection.jsx and AssetTable.jsx.
- Five Icon Systems table and Shared Components section in CLAUDE.md updated.

### Spacing System (ADR-027)
- Two semantic tokens: `--gap-stack` (8px normal, 4px dense) and `--gap-intra` (12px normal, 8px dense).
- Defined in `:root`, overridden in `.dense` selector.
- Applied across 14 component files (~50 instances replaced from raw `--spacing-8`/`--spacing-12`).
- Dense mode now compresses content-level spacing, not just card padding and section gaps.
- Rules: 8px default for vertical stacking, 4px only for tight inline (icon+label). 1px x 12px divider between adjacent inline indicators.

### Divider rule applied platform-wide
- 7 violations fixed: NotificationsPanel (2), AssetTable mobile (1), InProgress WO+Investigation (4).
- All instances of asset name + CriticalityIndicator now have dividers.

### Dense toggle enlarged
- Buttons: 28x24 -> 36x32. Padding: 2px -> 3px.
- TopBar header height: 48px -> 56px for breathing room.

### Vertical stacking audit
- 19 violations fixed across 8 files where 4px was used for vertical stacking (should be 8px).
- NotificationsPanel, Sidebar, InProgress, AssetTable, KpiBar, EventSummary, AlarmQuality.

## Next session: KPI Strip + Sub-Asset Tree

### KPI Strip (Section 2) -- "How urgent is this?"
Asset-level KPIs in a card row below the header. Data available on every asset:
- OEE, RUL, MTBF, MTTR, PM Compliance, Downtime
- K-101 also has MAINTENANCE_KPIS with sparkline data
- Follow KpiBar pattern but asset-scoped, not plant-scoped

### Sub-Asset Tree (Section 3) -- "Where exactly is the problem?"
- Expandable inline tree per ISO 14224 hierarchy
- 7 sub-assets for K-101, 2-8 for other assets
- Each with sensors, thresholds, alarm states
- New file: `src/components/ui/SubAssetTree.jsx`

### Remaining sections (Phase 2-3)
4. Active Events -- filtered TIMELINE
5. Event Timeline -- full history
6. Work Orders & Investigations -- filtered WO/INV
7. Degradation Trends -- K-101 only (conditional)
8. Fault Tree -- K-101 only (conditional)
9. Performance Attributes -- K-101 only (conditional)

### Key constraint
Go section by section with Rob. Don't build ahead.

## ADRs
27 total. New this session:
- **ADR-027**: Spacing system + semantic tokens (--gap-stack, --gap-intra, divider rule, dense overrides)

## Previous sessions
See git log for sessions 1-17. Key milestones:
- Session 13: Plant Overview complete, APM case study live
- Session 14: Data enrichment, event model restructure
- Session 15: WCAG 2.1 AA accessibility sweep
- Session 16: Mobile responsive pass, dense mode
- Session 17: Data layer overhaul, Asset Inspection research + planning
