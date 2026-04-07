# APM Dashboard -- Claude Context

Portfolio demo. Rob's APM platform built from first principles. Dark theme only.

**Path:** `~/Documents/Dev/apm-dashboard/`
**Dev:** `npx vite` (port 5173)
**Stack:** React 19 + Recharts (Watch List removed) + Tailwind v4 + Vite
**Data:** `src/data/baytown.js` -- Baytown Refinery, 10 assets, 36 events in TIMELINE
**Tokens:** `src/styles/global.css` @theme block. `src/styles/tokens.js` for Recharts.
**Figma:** https://www.figma.com/design/5CBDKKR3S9zTmCNWqJzSYK/Asset-Health

**Doctrine:** `VECTOR.md`, `HANDOFF.md`, `HEURISTICS.md` (Nielsen's 10 heuristic evaluation reference)
**Direction:** Rob's APM platform built from first principles with Honeywell domain expertise (not a recreation).

---

## Key Rules

- No Honeywell branding. No inline color values. All colors reference tokens.
- No inline font-size overrides. All typography from 10 type classes (ADR-018).
- No inline rgba/hex. Shadows tokenized (--shadow-tooltip, --shadow-overlay).
- 12-column grid. Card radius 10px, padding 24px. Titles: `type-card-title`.
- **Spacing system (ADR-027):** Use `var(--gap-stack)` for vertical stacking between text lines (8px normal, 4px dense). Use `var(--gap-intra)` for intra-card grouping (12px normal, 8px dense). Never use raw `--spacing-4` for vertical stacking. Always place a 1px x 12px divider (`--color-border-strong`) between adjacent inline indicators.
- Status: coral-red + amber (ADR-010). Icon + color + text (never color alone, WCAG SC 1.4.1).
- Event severity badges: shared SeverityBadge.jsx (tally + fill hierarchy, ADR-016). Critical=solid red, High=red outline, Medium=amber outline, Low=blue outline.
- Asset criticality: shared CriticalityIndicator.jsx (A/B/C/D letter grade, `inverted` prop for light tooltip bg).
- ISA-101 "dark and quiet". Tooltips: inverted (white bg), cursor-following where possible. Transitions: --motion-fast --ease-productive.
- Chart legends: shared Legend.jsx (swatch + label + value). No gradient bars.
- Nav icons: Feather/Lucide library (24x24 viewBox, shared `feather` base object).
- Route Figma MCP calls through Agent subagents to save tokens.

## Typography Scale (ADR-018)

| Class | Size | Weight | Role |
|-------|------|--------|------|
| `section-header` | 14px | 500 | Uppercase section labels |
| `type-heading` | 24px | 600 | Modal titles, panel headers |
| `type-card-title` | 14px | 600 | Card headers |
| `type-table-header` | 14px | 600 | Column headers |
| `type-body` | 14px | 400 | General text, table data |
| `type-meta` | 12px | 400 | Timestamps, helper text |
| `type-label` | 12px | 500 | Legend items, chips |
| `type-kpi` | 28px | 700 | KPI values |
| `type-kpi-hero` | 32px | 700 | Donut center, large callouts |
| `type-link` | 14px | 400 | Teal links |

## Shell

- **TopBar.jsx**: 56px fixed. Title: "Asset Performance Management".
- **Sidebar.jsx**: 48px rail, hover-to-expand 256px overlay (no toggle button, no content push). Shadow: --shadow-overlay.
- **NotificationsPanel.jsx**: 320px push panel (Event Feed), two-panel drill-in. Filter: shared FilterButton (severity multi-select). ADR-009 mutual exclusion with sidebar. Escape key closes. Focus managed on open/close (ADR-024). CriticalityIndicator badge on notification cards and event details.
- **Dense mode**: Segmented control in TopBar (grid/list icons, 36x32 buttons). Toggles `.dense` class on root. localStorage persisted. Reduces card padding, section gaps, grid gaps, stack gaps (8->4px), intra-card gaps (12->8px) (ADR-026, ADR-027).

## Screens

**Sidebar (plant-level):** Plant Overview | Events | Work Orders | Investigations
**Asset-scoped (inside Asset Inspection):** Reached via Asset Table row click, not sidebar. See ADR-028.

### Asset Inspection Layout (grouped by question)
- **Group A (full width):** Header + KPI Strip (OEE/RUL/Downtime with sparklines)
- **Group B (two-col desktop):** Active Events | Sub-Asset Tree
- **Group C (two-col desktop):** Work Orders | Investigations
- **Group D (collapsible):** Event Timeline (collapsed by default)
- **Group E (K-101 only):** Degradation Trends + Performance Attributes (two-col) | Fault Tree (full width)

### Other Screens
- **DesignSystem.jsx**: Token reference screen. Shows colors, typography, spacing, and component examples.
- **HelpPanel.jsx**: Contextual help overlay.
- **ErrorBoundary.jsx**: React error boundary wrapper. Catches render errors gracefully.
- **WhatChanged.jsx** (ui/): Currently unused/dead code. Not imported by any screen.

## Plant Overview Sections (ADR-020)

1. System Health -- KPI bar (6 cards, ADR-010). Health indicators: triangle (warning), diamond (critical).
2. What Happened -- Incident-driven ImpactStrip. "Go to Events" links to Events screen.
3. In Progress -- WOs (WoPriority urgency icons) + Investigations (triangle status icons). CriticalityIndicator on asset names. Cross-card 100px right column alignment (ADR-026).
4. Needs Action -- Event Triage + Alarm Quality + Watch List (ADR-020, ADR-023). Mobile: swipeable carousel with dot indicators (ADR-025).
5. Assets -- data table with drill-down (ADR-019). Compact severity Badge in Events column.

## Asset Table (ADR-019)

9 columns (desktop): Status | Asset | Criticality | OEE | Events | Downtime | Work Orders | Investigations | Remaining Life

- Events column: compact severity Badge (tally only) + count. Worst severity derived from TIMELINE.
- Work Orders and Investigations derived from WORK_ORDERS/INVESTIGATIONS data (not hardcoded)
- Toolbar: filter chips (left) + smart search with autocomplete + shared FilterButton (right)
- Sortable column headers with always-visible up/down arrows
- Event Triage filter: chip in both Event Triage card and table toolbar, smooth scroll on apply
- Pagination: 10 rows per page, fixed height (measures actual row height)
- Column dividers (--color-border-divider), 16px cell padding
- Mobile (ADR-025): stacked rows (status+name, type, criticality+severity+events). Filter/sort drawer (bottom sheet). Search fills width. Sort by Status/Name/Criticality.
- Asset row navigation disabled until Asset Inspection ships (`onAssetClick={null}`)

## Watch List

Pure React horizontal bars (no Recharts). Cursor-following tooltip with CriticalityIndicator (inverted). "Last 30 days" subtitle. Asset names always teal. Bars color-coded by criticality.

## WO Urgency (ADR-022)

Three levels: Emergency (filled circle) / Urgent (hollow circle) / Scheduled (clock icon)
- WoPriority.jsx: neutral gray icons + text, no color coding, no pills
- Data field: `urgency` (not `priority`). Emergency/Urgent/Scheduled.

## Five Icon Systems (ADR-022)

| System | Shape | Color | Component |
|--------|-------|-------|-----------|
| Event severity | Tally bars in pill | Red/amber/blue | SeverityBadge.jsx |
| Investigation status | Right triangles | Neutral gray | InProgress |
| WO urgency | Circles + clock | Neutral gray | WoPriority.jsx |
| Asset criticality | Letter grade pill | Status colors | CriticalityIndicator.jsx |
| Asset status | Small dots + text | Status colors | StatusIndicator.jsx |

## ADR Index

001 Dark theme + teal | 002 Color system (Carbon g100) | 003 Superseded | 004 Storytelling density | 005 Collapsible sidebar | 006 Fluid type | 007 Fault tree | 008 Screen names | 009 Sidebar/notif exclusion | 010 Status labels/icons/colors | 011 Priority badges | 012 Impact Strip + section order | 013 Three-layer event context | 014 Timeline visual design | 015 Risk Matrix redesign | 016 Badge system + asset criticality | 017 Alarm Quality card | 018 Typography system | 019 Asset Table redesign | 020 Section + card naming | 021 Data reconciliation | 022 WO urgency + icon system | 023 Unified Needs Action filter | 024 Accessibility standards (WCAG 2.1 AA) | 025 Mobile responsive design | 026 Dense mode + cross-card alignment | 027 Spacing system + semantic tokens | 028 Navigation architecture (plant sidebar, asset drill-down)

**Pending ADRs (to be written when building):**
029 Role-based toggle (Reliability/Maintenance view switching) | 030 AI assistant architecture (Claude Haiku, Cloudflare Worker, system prompt) | 031 Data model expansion (sensors, PdM, PM compliance calculations)

## Desk Research Index

001 Dashboard design | 002 Engineering data | 003 User roles | 004 Carbon design system | 005 Typography | 006 KPI card anatomy | 007 Work order cards | 008 Event context | 009 Timeline labels | 010 Analysis cards | 011 Chart legend accessibility | 012 Event assignment status + view switching | 013 Asset criticality vs priority | 014 Event summary visualization | 015 Urgency iconography | 016 Accessibility audit (WCAG 2.1 AA) | 017 APM asset detail page patterns | 018 Maintenance manager decision flow (Diane persona) | 019 Information density by role/scope + PdM/PM compliance calculations | 020 Comprehensive competitive analysis (full IA, all page types, 6 tools) | 020b Competitor page deep dive (exhaustive detail, pending) | 021 AI assistant competitive landscape + implementation plan

## Story Index

STORY-001 Baytown Refinery (K-101 24-hour timeline, 10 assets, KPI data)
STORY-002 Asset narratives (all 10 assets with sub-assets, sensors, thresholds, failure stories)

## Shared Components

- `SeverityBadge.jsx` -- event severity (tally + fill hierarchy). `severity` prop (critical/high/medium/low). `compact` prop for tally-only (no text). Events, notifications, and Asset Table.
- `CriticalityIndicator.jsx` -- asset criticality (A/B/C/D letter grade). `inverted` prop for tooltip contexts. Used in Asset Table, Event Feed, InProgress rows.
- `StatusIndicator.jsx` -- asset status (dot + label). `compact` prop for dot-only. Used in Asset Table, Asset Inspection. Exports `statusLabel()` for aria/filter use.
- `WoPriority.jsx` -- WO urgency indicator (circle icons + text).
- `Legend.jsx` -- chart legend (swatch + label + value).
- `FilterChip.jsx` -- dismissable filter tag (Event Triage + Asset Table). `whiteSpace: nowrap`, `flexShrink: 0`.
- `FilterButton.jsx` -- filter button + checkbox dropdown (Asset Table desktop + Notifications).

## Handoff

See `HANDOFF.md` for session 23 end state. Deployed to https://apm.designedbyrob.com. 28 ADRs (3 pending), 21 desk research docs, 2 interviews, 2 personas, 2 stories.

## Hooks

- `useIsMobile.js` -- responsive breakpoint hook (671px). Shared across components.
- `useFocusTrap.js` -- Tab/Shift+Tab wrapping for modals (NotificationsPanel, Sidebar).

## Mobile Patterns (ADR-025)

- Breakpoint: 671px (JS) / 672px (CSS)
- `.hide-mobile` utility (display:none !important, flex at 672px+)
- `.hide-scrollbar` utility (webkit + Firefox + IE)
- `.carousel-slide` (flex stretch for equal-height carousel cards)
- `slideUp` keyframe for bottom-sheet drawers
- Tooltips suppressed on mobile (all chart components)
- Filter/sort: full-screen bottom drawer pattern (not dropdown)
