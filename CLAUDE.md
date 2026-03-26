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
| Sidebar.jsx | Collapsible sidebar (64px collapsed / 320px expanded with labels). Push, not overlay. Mutually exclusive with NotificationsPanel (ADR-009). |
| TopBar.jsx | Logo + "ASSET PERFORMANCE MANAGEMENT" + breadcrumb + help + settings avatar + notification bell. 60px height, full width. |
| NotificationsPanel.jsx | Push panel (320px), compresses viewport. Filterable by asset, severity badges. Mutually exclusive with Sidebar. |

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
- All chart colors desaturated for dark mode
- Status indicators use color + shape + position (never color alone)
- KPI cards must show: value, label, sparkline, period-over-period context
- Every interactive element needs hover + focus states with transitions
- 4px grid spacing, no arbitrary pixel values outside the grid

---

## Figma Reference

Three original Figma frames are on Rob's desktop:
- `Asset-Health.svg` (light theme)
- `Asset-Health-Dark-Theme.svg` (dark theme)
- `Asset-Details.svg` (light theme)

The recreation should match the layout and interactions from these frames
while using the dark theme tokens and unbranded styling. See
`vector/research/FIGMA-REVIEW-001-gap-analysis.md` for the full gap analysis.

### Key patterns from Figma to match:
- KPI cards: colored left borders per metric
- Risk Matrix: interactive grid cells, priority gradient bar below
- Event Summary: large callout count + Event/Case toggle
- Asset Summary table: asset type subtitle, event timestamps, link-styled names
- Notifications: time range filters, severity badges, structured cards
- Asset Details header: running status, duration, last shutdown, tab bar
