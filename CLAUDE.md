# APM Dashboard -- Claude Context

Portfolio demo. Unbranded Honeywell APM recreation. Dark theme only.

**Path:** `~/Documents/Dev/apm-dashboard/`
**Dev:** `npx vite` (port 5173)
**Stack:** React 19 + Recharts (Watch List removed) + Tailwind v4 + Vite
**Data:** `src/data/assets.js` -- Baytown Refinery, K-101 centrifugal compressor story (21 events)
**Tokens:** `src/styles/global.css` @theme block. `src/styles/tokens.js` for Recharts.
**Figma:** https://www.figma.com/design/5CBDKKR3S9zTmCNWqJzSYK/Asset-Health

---

## Key Rules

- No Honeywell branding. No inline color values. All colors reference tokens.
- No inline font-size overrides. All typography from 9 type classes (ADR-018).
- No inline rgba/hex. Shadows tokenized (--shadow-tooltip, --shadow-overlay).
- 12-column grid. Card radius 10px, padding 24px. Titles: `type-card-title`.
- Status: coral-red + amber (ADR-010). Icon + color + text (never color alone, WCAG SC 1.4.1).
- Event severity badges: shared Badge.jsx (tally + fill hierarchy, ADR-016). Critical=solid red, High=red outline, Medium=amber outline, Low=blue outline.
- Asset criticality: shared CriticalityIndicator.jsx (A/B/C/D letter grade, `inverted` prop for light tooltip bg).
- ISA-101 "dark and quiet". Tooltips: inverted (white bg), cursor-following where possible. Transitions: --motion-fast --ease-productive.
- Chart legends: shared Legend.jsx (swatch + label + value). No gradient bars.
- Nav icons: Feather/Lucide library (24x24 viewBox, shared `feather` base object).
- Route Figma MCP calls through Agent subagents to save tokens.

## Typography Scale (ADR-018)

| Class | Size | Weight | Role |
|-------|------|--------|------|
| `section-header` | 14px | 500 | Uppercase section labels |
| `type-card-title` | 14px | 600 | Card headers |
| `type-table-header` | 14px | 600 | Column headers |
| `type-body` | 14px | 400 | General text, table data |
| `type-meta` | 12px | 400 | Timestamps, helper text |
| `type-label` | 12px | 500 | Legend items, chips |
| `type-kpi` | 28px | 700 | KPI values |
| `type-kpi-hero` | 32px | 700 | Donut center, large callouts |
| `type-link` | 14px | 400 | Teal links |

## Shell

- **TopBar.jsx**: 48px fixed. Title: "Asset Performance Management".
- **Sidebar.jsx**: 48px rail, hover-to-expand 256px overlay (no toggle button, no content push). Shadow: --shadow-overlay.
- **NotificationsPanel.jsx**: 320px push, two-panel drill-in. Filter: shared FilterButton (severity multi-select). ADR-009 mutual exclusion with sidebar.

## Screens

Plant Overview | Events | Asset Inspection | Root Cause | Trends | Work Orders | Investigations

## Plant Overview Sections (ADR-020)

1. Plant Health -- KPI bar (6 cards, ADR-010). Health indicators: triangle (warning), diamond (critical).
2. What Happened -- Three cards in grid-thirds: Trigger / Consequence / Confirmation. "See full timeline" links to Events screen.
3. Current Response -- WOs (WoPriority urgency icons) + Investigations (triangle status icons).
4. Requires Attention -- Event Triage + Alarm Quality + Watch List (ADR-020).
5. Assets -- data table with drill-down (ADR-019).

## Asset Table (ADR-019)

9 columns: Status | Asset | Criticality | OEE | Events | Downtime | Work Orders | Investigations | Remaining Life

- Work Orders and Investigations derived from WORK_ORDERS/CASES data (not hardcoded)
- Toolbar: filter chips (left) + smart search with autocomplete + shared FilterButton (right)
- Sortable column headers with always-visible up/down arrows
- Event Triage filter: chip in both Event Triage card and table toolbar, smooth scroll on apply
- Pagination: 10 rows per page, fixed height (measures actual row height)
- Column dividers (--color-border-divider), 16px cell padding

## Watch List

Pure React horizontal bars (no Recharts). Cursor-following tooltip with CriticalityIndicator (inverted). "Last 30 days" subtitle. Asset names always teal. Bars color-coded by criticality.

## WO Urgency (ADR-022)

Three levels: Emergency (filled circle) / Urgent (hollow circle) / Scheduled (clock icon)
- WoPriority.jsx: neutral gray icons + text, no color coding, no pills
- Data field: `urgency` (not `priority`). Emergency/Urgent/Scheduled.

## Five Icon Systems (ADR-022)

| System | Shape | Color | Component |
|--------|-------|-------|-----------|
| Event severity | Tally bars in pill | Red/amber/blue | Badge.jsx |
| Investigation status | Right triangles | Neutral gray | TodaysActivity |
| WO urgency | Circles + clock | Neutral gray | WoPriority.jsx |
| Asset criticality | Letter grade pill | Status colors | CriticalityIndicator.jsx |
| Asset status | Small dots + text | Status colors | AssetTable inline |

## ADR Index

001 Dark theme + teal | 002 Color system (Carbon g100) | 003 Superseded | 004 Storytelling density | 005 Collapsible sidebar | 006 Fluid type | 007 Fault tree | 008 Screen names | 009 Sidebar/notif exclusion | 010 Status labels/icons/colors | 011 Priority badges | 012 Impact Strip + section order | 013 Three-layer event context | 014 Timeline visual design | 015 Risk Matrix redesign | 016 Badge system + asset criticality | 017 Alarm Quality card | 018 Typography system | 019 Asset Table redesign | 020 Section + card naming | 021 Data reconciliation | 022 WO urgency + icon system

## Desk Research Index

001 Dashboard design | 002 Engineering data | 003 User roles | 004 Carbon design system | 005 Typography | 006 KPI card anatomy | 007 Work order cards | 008 Event context | 009 Timeline labels | 010 Analysis cards | 011 Chart legend accessibility | 012 Event assignment status + view switching | 013 Asset criticality vs priority | 014 Event summary visualization | 015 Urgency iconography

## Story Index

STORY-001 Baytown Refinery (K-101 24-hour timeline, 10 assets, KPI data)
STORY-002 Asset narratives (all 10 assets with sub-assets, sensors, thresholds, failure stories)

## Shared Components

- `Badge.jsx` -- event severity (tally + fill hierarchy). Events and notifications only.
- `CriticalityIndicator.jsx` -- asset criticality (A/B/C/D letter grade). `inverted` prop for tooltip contexts.
- `Legend.jsx` -- chart legend (swatch + label + value).
- `FilterChip.jsx` -- dismissable filter tag (Event Triage + Asset Table).
- `FilterButton.jsx` -- filter button + checkbox dropdown (Asset Table + Notifications).
- `WoPriority.jsx` -- WO urgency indicator (circle icons + text).

## Handoff

See `HANDOFF.md` for session 13 end state. Deployed to https://apm-dashboard-eosin.vercel.app. 22 ADRs, 15 desk research docs, 2 stories. Next: finish event metadata enrichment (events 2-11), rebuild data, then Asset Inspection screen.
