# APM Dashboard -- Claude Context

Portfolio demo project. Unbranded recreation of Honeywell APM dashboards.
Not a production app. Not Honeywell's actual product.

**Path:** `~/Documents/Dev/apm-dashboard/`
**Dev server:** `npx vite` or `npm run dev` (port 5173)
**Stack:** React 19 + Recharts + Tailwind CSS v4 + Vite
**Font:** Inter (Google Fonts CDN)

---

## Screens

| Screen | Component | Purpose |
|--------|-----------|---------|
| Asset Health | AssetHealth.jsx | Plant overview: KPIs, Today's Activity, What Changed, Risk/Bad Actors, Asset Summary |
| Asset Details | AssetDetails.jsx | Single asset deep dive: Reliability, Maintenance, Performance rows + tab bar |
| Fault Tree | FaultTree.jsx | Causal chain from top event to root causes. Leaf nodes link to Trends. |
| Trends | Trends.jsx | Attribute trend analysis with overlay/separate modes |

## Shell Components

| Component | Purpose |
|-----------|---------|
| Sidebar.jsx | Collapsible sidebar (64px icons / 200px with labels) |
| TopBar.jsx | Breadcrumb navigation + notification bell + date selector |
| NotificationsPanel.jsx | Fixed overlay, filterable by asset, severity badges |

## Navigation Flow (10-step engineer decision chain)

```
1. ORIENT      Asset Health > KPIs at a glance
2. PLAN        Asset Health > Today's Activity (work orders, cases)
3. DETECT      Asset Health > What Changed (overnight events timeline)
4. CORRELATE   Asset Health > KPI trend overlaid with asset events
5. IDENTIFY    Asset Health > Asset Summary table > click row
6. INVESTIGATE Asset Details > three-level deep dive
7. TRACE       Fault Tree > causal chain from event to root cause
8. DEEP DIVE   Trends > attribute data over time
9. ACT         Create case or work order (contextual modal)
10. VERIFY     Asset running without anomalies, case closed
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
