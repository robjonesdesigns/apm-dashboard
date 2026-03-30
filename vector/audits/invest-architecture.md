# Architecture Audit

**Scope:** src/
**Date:** 2026-03-30 (rewritten -- original audit 2026-03-26)
**Files scanned:** 29

## Summary

Architecture health: **Good**

The token system in global.css is comprehensive and fully adopted. All components use CSS variables for colors, spacing, and typography. UI primitives are extracted to src/components/ui/. Screen filenames match CLAUDE.md. Navigation architecture is documented in ADR-028. The only remaining work items are size (two large files) and placeholder screens.

## Violations

### SIZE -- Medium

| File | Lines | Limit | Notes |
|------|-------|-------|-------|
| src/components/ui/AssetTable.jsx | 1100 | 400 | Largest component. Contains mobile drawer, search, pagination, filter integration. Candidate for extraction but complexity is interconnected. |
| src/components/NotificationsPanel.jsx | 602 | 400 | Two-panel drill-in with event details. Focus management, filter state. Could extract EventDetails sub-component. |
| src/components/ui/KpiBar.jsx | 467 | 400 | Contains Sparkline, InfoButton, Tooltip, HealthIndicator, KpiCard. Could extract Sparkline to shared. |

All other files are under 400 lines. PlantOverview.jsx is 235 lines (was 1101 as AssetHealth.jsx).

### PLACEHOLDER SCREENS -- Low

App.jsx maps four sidebar routes to PlantOverview as placeholders:
- `events` -- needs dedicated Events screen
- `workorders` -- needs dedicated Work Orders screen
- `investigations` -- needs dedicated Investigations screen
- `settings` -- needs Settings screen

These are intentional placeholders per ADR-028. Asset-scoped screens (Fault Tree, Trends, Performance) are sections within Asset Inspection, not standalone routes.

## Resolved (from 2026-03-26 audit)

### NAMING -- FIXED
- AssetHealth.jsx renamed to PlantOverview.jsx
- AssetDetails.jsx renamed to AssetInspection.jsx
- App.jsx view keys migrated from `health`/`details` to `overview`/`inspection`
- Sidebar nav labels match CLAUDE.md screen names
- All legacy aliases removed from App.jsx, TopBar.jsx, Sidebar.jsx

### TOKENS (hardcoded hex colors) -- FIXED
- Zero hardcoded hex colors in src/components/ or src/data/
- Zero hardcoded rgba values in src/components/
- All colors reference CSS variables (--color-*, --shadow-*)
- Data file (baytown.js) contains no color values

### TOKENS (inline font styles) -- FIXED
- Zero inline fontSize number values in any component
- All font sizes use var(--text-*) tokens or typography classes
- 9 type classes defined in global.css, consistently used

### TOKENS (undefined CSS variables) -- FIXED
- Zero references to --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl, --spacing-xs
- All spacing uses standardized numeric tokens (--spacing-2 through --spacing-96)
- Semantic tokens --gap-stack and --gap-intra used for dense-responsive spacing (ADR-027)

### TOKENS (odd pixel values) -- FIXED
- Zero instances of 9px, 13px, or non-grid-aligned values
- All values on 4px/8px base grid

### LAYER -- FIXED
- 16 shared components extracted to src/components/ui/
- No inline UI primitive definitions in screen components
- Data file imports nothing and contains no presentation logic

### LAYOUT -- FIXED
- Zero ad-hoc grid-cols-* Tailwind classes
- Layout uses grid-12, grid-thirds, kpi-grid CSS classes and flexbox
- Semantic layout classes defined in global.css

### IMPORT -- Clean
- All import directions correct (Screens -> UI + Data, Shell -> Data)
- No reverse imports
- Shared hooks in src/hooks/ (useIsMobile, useFocusTrap)

## File inventory

### Screens (src/components/)
| File | Lines | Role |
|------|-------|------|
| PlantOverview.jsx | 235 | Plant-level dashboard (composes ui/ components) |
| AssetInspection.jsx | 376 | Asset drill-down (header, KPI strip with sparklines) |
| NotificationsPanel.jsx | 602 | Event feed push panel with drill-in |
| Trends.jsx | 21 | Placeholder |
| Sidebar.jsx | 299 | 4-item nav rail (ADR-028) |
| TopBar.jsx | 419 | Header with breadcrumbs, dense toggle, notifications |

### UI primitives (src/components/ui/)
| File | Lines | Role |
|------|-------|------|
| AssetTable.jsx | 1100 | Data table with search, pagination, mobile drawer |
| KpiBar.jsx | 467 | Plant KPI cards with sparkline popovers |
| InProgress.jsx | 362 | WO + Investigation cards |
| AlarmQuality.jsx | 279 | Alarm metrics |
| RiskMatrix.jsx | 221 | Severity/criticality matrix |
| WatchList.jsx | 208 | Horizontal bar chart |
| WhatChanged.jsx | 165 | Incident impact cards |
| FilterButton.jsx | 140 | Filter dropdown |
| ImpactStrip.jsx | 118 | KPI impact cards |
| EventSummary.jsx | 108 | Event detail panel |
| Legend.jsx | 81 | Chart legend |
| WoPriority.jsx | 61 | WO urgency icons |
| Badge.jsx | 45 | Severity badges |
| StatusIndicator.jsx | 42 | Asset status dot + label |
| CriticalityIndicator.jsx | 40 | A/B/C/D letter grade |
| FilterChip.jsx | 27 | Dismissable filter tag |

### Data + Styles
| File | Role |
|------|------|
| src/data/baytown.js | All data (10 assets, 36 events, WOs, investigations, KPI trends) |
| src/styles/global.css | Design tokens, typography, layout, dense mode, accessibility |
| src/styles/tokens.js | Recharts color/style tokens |

### Hooks
| File | Role |
|------|------|
| src/hooks/useIsMobile.js | Responsive breakpoint (671px) |
| src/hooks/useFocusTrap.js | Tab wrapping for modals |
