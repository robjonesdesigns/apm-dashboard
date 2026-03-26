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
| Asset Health | AssetHealth.jsx | Plant-wide overview: KPIs, Risk Matrix, Event Summary, Bad Actors, Asset Summary table |
| Asset Details | AssetDetails.jsx | Single asset deep dive: Reliability, Maintenance, Performance rows |
| Trends | Trends.jsx | Attribute trend analysis with overlay/separate modes |

## Shell Components

| Component | Purpose |
|-----------|---------|
| Sidebar.jsx | 64px icon-only navigation |
| TopBar.jsx | Breadcrumb navigation + notification bell |
| NotificationsPanel.jsx | Slide-out notification list, filterable by asset |

## Navigation Flow

Asset Health > click asset row > Asset Details > click performance attribute > Trends
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
