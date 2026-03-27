# APM Dashboard -- Claude Context

Portfolio demo project. Unbranded recreation of Honeywell APM dashboards.
Not a production app. Not Honeywell's actual product.

**Path:** `~/Documents/Dev/apm-dashboard/`
**Dev server:** `npx vite` or `npm run dev` (port 5173)
**Stack:** React 19 + Recharts + Tailwind CSS v4 + Vite
**Font:** Inter (Google Fonts CDN)

---

## Screens

| Screen | Component | Nav label | Purpose |
|--------|-----------|-----------|---------|
| Plant Overview | PlantOverview.jsx | Plant Overview | KPIs, Today's Activity, What Changed, Risk/Bad Actors, Asset Summary |
| Asset Inspection | AssetInspection.jsx | Asset Inspection | Single asset deep dive: Reliability, Maintenance, Performance rows + tab bar |
| Root Cause Analysis | RootCauseAnalysis.jsx | Root Cause | Causal chain from top event to root causes. Leaf nodes link to Trends. |
| Trends | Trends.jsx | Trends | Attribute trend analysis with overlay/separate modes |
| Work Orders | WorkOrders.jsx | Work Orders | Task management dashboard |
| Investigations | Investigations.jsx | Investigations | Case/investigation management dashboard |

## Shell Components

| Component | Purpose |
|-----------|---------|
| Sidebar.jsx | Collapsible sidebar (48px rail / 256px expanded). Carbon UI Shell pattern. Mutually exclusive with NotificationsPanel (ADR-009). |
| TopBar.jsx | 48px fixed header. Logo + "APM" + divider + breadcrumb. Right: Help + Avatar + Bell. Z-index 10000. |
| NotificationsPanel.jsx | Push panel (320px), compresses viewport. Filterable by asset. Mutually exclusive with Sidebar. |

## Sidebar Icons

| Screen | Icon description |
|--------|-----------------|
| Plant Overview | Factory/plant building |
| Asset Inspection | Machine/gear |
| Root Cause | Node tree (branching) |
| Trends | Line graph |
| Work Orders | Checklist with checkboxes |
| Investigations | Briefcase |

## Navigation Flow (10-step engineer decision chain)

```
1. ORIENT      Plant Overview > KPIs at a glance
2. PLAN        Plant Overview > Today's Activity (work orders, cases)
3. DETECT      Plant Overview > What Changed (overnight events timeline)
4. CORRELATE   Plant Overview > KPI trend overlaid with asset events
5. IDENTIFY    Plant Overview > Asset Summary table > click row
6. INVESTIGATE Asset Inspection > three-level deep dive
7. TRACE       Root Cause Analysis > causal chain from event to root cause
8. DEEP DIVE   Trends > attribute data over time
9. ACT         Create investigation or work order (contextual modal)
10. VERIFY     Asset running without anomalies, investigation closed
```

See INTERVIEW-002 and INTERACTION-SPEC-001 for full details.
Notifications panel available on all screens via bell icon.
Breadcrumbs in TopBar allow back-navigation.

---

## Styling

**Tailwind + CSS custom properties.** Tokens defined in `src/styles/global.css`
under `@theme` block. Available as standard Tailwind classes.

**Dark theme only.** No light mode. Enterprise monitoring context.

**Token naming:** `--color-*`, `--spacing-*`, `--radius-*`, `--font-*`

**No inline color values.** All colors reference tokens.

---

## Data

All sample data in `src/data/assets.js`. Realistic industrial names and values.
Plant: Baytown Refinery. Primary asset: Compressor K-101 (centrifugal compressor,
H2 Recycle Gas service, API 617 class).

---

## Key Rules

- No Honeywell branding or Forge design system references
- 12-column grid layout (grid-12 class)
- Status colors: coral-red #f47174 (error) + amber #e8914f (warning) (ADR-010)
- Status indicators use icon shape + color + text (never color alone, WCAG SC 1.4.1)
- ISA-101 "dark and quiet": normal state = no indicator, no green everywhere
- KPI cards: value + delta (vs yesterday) + health indicator (Monitor/Action Required)
- Card titles: type-heading-02 in --color-card-title (dimmed, data is the hero)
- Card radius: 10px
- Card padding: 24px (--spacing-24)
- Tooltips: inverted (white bg, dark text), caret tracks icon position
- All transitions: var(--motion-fast) var(--ease-productive) (110ms Carbon productive)
- No inline border/color styles -- use CSS classes (card, card-accent-top, card-interactive)

---

## KPI Bar Spec (completed)

6 cards in kpi-grid (responsive 2/3/6 columns):
- 4 KPI cards (OEE, Availability, Performance, Quality) + Trains + Active Assets
- Teal accent top stripe on KPI cards (card-accent-top class)
- Info icon on all 6 cards with inverted tooltip explaining the metric
- Delta: "+/-X.X% vs yesterday" with directional arrow (↗/↘), always neutral color
- Health: warning = amber ▼ "Monitor", critical = red ◆ "Action Required", normal = no indicator
- Value color: white (normal), amber (warning), red (critical)
- Thresholds: OEE warn <85% crit <75%, Availability warn <90% crit <80%
- Current story: OEE 76.3% (warning), Availability 78.4% (critical)

---

## ADR Index

| ADR | Decision |
|-----|----------|
| 001 | Dark theme with teal accent |
| 002 | Desaturated chart colors for dark mode |
| 003 | Superseded: uniform teal top stripe, no per-metric identity colors |
| 004 | Storytelling over raw data density |
| 005 | Collapsible sidebar (48px rail / 256px expanded) |
| 006 | Fluid typography with clamp() |
| 007 | Interactive fault tree in investigation flow |
| 008 | Portfolio-friendly screen names |
| 009 | Sidebar/notifications mutual exclusion |
| 010 | Status labels (Monitor/Action Required), icons (triangle/diamond), colors (coral/amber) |

---

## Figma Reference

Three original Figma frames are on Rob's desktop:
- `Asset-Health.svg` (light theme)
- `Asset-Health-Dark-Theme.svg` (dark theme)
- `Asset-Details.svg` (light theme)

Figma URL: https://www.figma.com/design/5CBDKKR3S9zTmCNWqJzSYK/Asset-Health

The recreation adapts the layout and interactions from these frames
using the dark Carbon theme tokens. See FIGMA-REVIEW-001 for gap analysis.
