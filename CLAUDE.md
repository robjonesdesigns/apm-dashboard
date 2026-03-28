# APM Dashboard -- Claude Context

Portfolio demo. Unbranded Honeywell APM recreation. Dark theme only.

**Path:** `~/Documents/Dev/apm-dashboard/`
**Dev:** `npx vite` (port 5173)
**Stack:** React 19 + Recharts + Tailwind v4 + Vite
**Data:** `src/data/assets.js` -- Baytown Refinery, K-101 centrifugal compressor story (21 events)
**Tokens:** `src/styles/global.css` @theme block. `src/styles/tokens.js` for Recharts.
**Figma:** https://www.figma.com/design/5CBDKKR3S9zTmCNWqJzSYK/Asset-Health

---

## Key Rules

- No Honeywell branding. No inline color values. All colors reference tokens.
- No inline font-size overrides. All typography from 9 type classes (ADR-018).
- 12-column grid. Card radius 10px, padding 24px. Titles: `type-card-title`.
- Status: coral-red + amber (ADR-010). Icon + color + text (never color alone, WCAG SC 1.4.1).
- Event severity badges: shared Badge.jsx (tally + fill hierarchy, ADR-016). Critical=solid red, High=red outline, Medium=amber outline, Low=blue outline.
- Asset criticality: shared CriticalityIndicator.jsx (A/B/C/D letter grade). Visually distinct from event badges.
- ISA-101 "dark and quiet". Tooltips: inverted (white bg). Transitions: --motion-fast --ease-productive.
- Chart legends: shared Legend.jsx (swatch + label + value). No gradient bars.
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

## Screens

Plant Overview | Asset Inspection | Root Cause | Trends | Work Orders | Investigations

Shell: Sidebar.jsx (48px rail / 256px), TopBar.jsx (48px fixed), NotificationsPanel.jsx (320px push, two-panel drill-in, ADR-009 mutual exclusion with sidebar)

## Plant Overview Sections (ADR-020)

1. Plant Health -- KPI bar (6 cards, ADR-010)
2. What Happened -- Timeline card (ADR-014: 82% track, dashed continuation, white dots, left-aligned labels, three-act narrative)
3. Current Response -- WOs + Investigations (ADR-011)
4. Requires Attention -- Event Triage + Alarm Quality + Watch List (ADR-020)
5. Assets -- data table with drill-down (ADR-019)

## Asset Table (ADR-019)

9 columns: Status | Asset | Criticality | OEE | Events | Downtime | Work Orders | Investigations | Remaining Life

- Work Orders and Investigations derived from WORK_ORDERS/CASES data (not hardcoded)
- Toolbar: filter chips (left) + search + Filter button with dropdown (right)
- Sortable column headers with always-visible up/down arrows
- Event Triage filter: chip in both Event Triage card and table toolbar, smooth scroll on apply
- Shared FilterChip.jsx component

## ADR Index

001 Dark theme + teal | 002 Desaturated charts | 003 Superseded | 004 Storytelling density | 005 Collapsible sidebar | 006 Fluid type | 007 Fault tree | 008 Screen names | 009 Sidebar/notif exclusion | 010 Status labels/icons/colors | 011 Priority badges | 012 Impact Strip + section order | 013 Three-layer event context | 014 Timeline visual design | 015 Risk Matrix redesign | 016 Badge system + asset criticality | 017 Alarm Quality card | 018 Typography system | 019 Asset Table redesign | 020 Section + card naming | 021 Data reconciliation

## Desk Research Index

001 Dashboard design | 002 Engineering data | 003 User roles | 004 Carbon design system | 005 Typography | 006 KPI card anatomy | 007 Work order cards | 008 Event context | 009 Timeline labels | 010 Analysis cards | 011 Chart legend accessibility | 012 Event assignment status + view switching | 013 Asset criticality vs priority | 014 Event summary visualization

## Shared Components

- `Badge.jsx` -- event severity (tally + fill hierarchy). Use for all event/work order/notification badges.
- `CriticalityIndicator.jsx` -- asset criticality (A/B/C/D letter grade). Use for all asset criticality display.
- `Legend.jsx` -- chart legend (swatch + label + value). Use on all chart cards.
- `FilterChip.jsx` -- dismissable filter tag. Use in Event Triage and Asset Table.

## Handoff

See `HANDOFF.md` for session 13 priorities. 21 ADRs, 14 desk research docs.
