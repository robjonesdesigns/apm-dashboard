# Architecture Audit

**Scope:** src/
**Date:** 2026-03-26
**Files scanned:** 11

---

## Violations

### SIZE -- High

- `src/components/AssetHealth.jsx` -- 1101 lines (limit: 400). Needs extraction of PlantHealth, TodaysActivity, WhatChanged, AssetsRequiringAttention, AllAssets into sub-components.
- `src/components/AssetDetails.jsx` -- 765 lines (limit: 400). Needs extraction of AvailBarChart, RunStatusTimeline, DowntimeDoughnut, BadActorsBar, WorkOrdersDoughnut, MaintenanceKPIs, PerformanceTable, AssetSpecifications.
- `src/components/Trends.jsx` -- 571 lines (limit: 400). Needs extraction of SingleChart and CustomTooltip at minimum.

### NAMING -- High

- `src/components/AssetHealth.jsx` -- CLAUDE.md says this screen should be `PlantOverview.jsx`. Component exports `AssetHealth` but screen name is "Plant Overview."
- `src/components/AssetDetails.jsx` -- CLAUDE.md says this screen should be `AssetInspection.jsx`. Component exports `AssetDetails` but screen name is "Asset Inspection."
- `src/App.jsx:10` -- View keys use `health` and `details` instead of matching the CLAUDE.md screen names (PlantOverview, AssetInspection).
- `src/components/Sidebar.jsx:9` -- Nav item labels say "Asset Health" and "Asset Details" instead of "Plant Overview" and "Asset Inspection" per CLAUDE.md.

### NAMING -- Medium

- `src/components/AssetHealth.jsx` -- Missing screen components: `RootCauseAnalysis.jsx`, `WorkOrders.jsx`, `Investigations.jsx` per CLAUDE.md. Only 3 of 6 screens exist.

### TOKENS (hardcoded hex colors) -- High

- `src/components/AssetDetails.jsx:19` -- `#e8eaf0` in ChartTooltip fallback color (should use token).
- `src/components/AssetDetails.jsx:60` -- `METRIC_COLORS` array uses raw hex `['#2dd4bf', '#3b82f6', '#a78bfa']` instead of `colors.chart1`, `colors.chart2`, `colors.chart3` from tokens.js.
- `src/components/AssetDetails.jsx:71` -- `fill="#9ba1b0"` hardcoded (should be `colors.textSecondary`).
- `src/components/AssetDetails.jsx:89` -- `fill: '#6b7280'` hardcoded twice on XAxis/YAxis (should be `chartStyle.axisText`).
- `src/components/AssetDetails.jsx:95` -- `fill: '#6b7280'` hardcoded on YAxis (same issue).
- `src/components/AssetDetails.jsx:128-133` -- Downtime doughnut data uses hardcoded hex colors in `src/data/assets.js:128-133` (`#ef4444`, `#f59e0b`, `#3b82f6`, `#a78bfa`, `#2dd4bf`, `#22c55e`). These are raw Tailwind colors, not the desaturated tokens. Critical: `#ef4444` vs token `#E57373`.
- `src/components/AssetDetails.jsx:142-158` -- `EVENT_STYLES` uses raw hex: `#ef4444`, `#f59e0b`, `#6b7280` with raw rgba variants. Should use `colors.critical`, `colors.warning`, etc.
- `src/components/AssetDetails.jsx:230-231` -- Legend uses raw `#22c55e` and `#2e313b`. Should use tokens.
- `src/components/AssetDetails.jsx:337-338` -- `fill="#e8eaf0"` and `fill="#6b7280"` in DowntimeDoughnut center label.
- `src/components/AssetDetails.jsx:430` -- `style={{ background: '#ef4444' }}` in BadActorsBar -- should use `colors.critical`.
- `src/components/AssetDetails.jsx:444-448` -- `WO_COLORS` uses raw hex for all 5 colors.
- `src/components/AssetDetails.jsx:472-490` -- WorkOrdersDoughnut center label uses `fill="#e8eaf0"` and `fill="#6b7280"`.
- `src/components/AssetDetails.jsx:570-573` -- `sparkColor` returns raw hex `#ef4444`, `#22c55e`, `#9ba1b0`.
- `src/components/AssetDetails.jsx:600-602` -- `deviationColor` returns raw hex `#ef4444`, `#f59e0b`, `#22c55e`.
- `src/components/AssetDetails.jsx:689-692` -- `STATUS_STYLES` uses raw hex for Critical/Warning/Healthy.
- `src/components/AssetDetails.jsx:714` -- Criticality badge uses raw `#9ba1b0` and `rgba(255,255,255,0.05)`.
- `src/data/assets.js:128-133` -- `downtimeBySubAsset` color values are raw saturated hex, not desaturated tokens. Wrong values for dark mode per ADR-002.
- `src/data/assets.js:209-212` -- `TREND_ATTRIBUTES` uses raw hex colors (`#2dd4bf`, `#ef4444`, `#f59e0b`, `#3b82f6`). These are raw Tailwind, not desaturated.

### TOKENS (inline font styles) -- High

- `src/components/AssetDetails.jsx:68-75` -- Inline `fontSize={11}`, `fontFamily`, `fill` on CustomLabel in AvailBarChart. Should use type composition class or chartStyle tokens.
- `src/components/AssetDetails.jsx:89` -- Inline `fontSize: 11, fontFamily` on XAxis tick.
- `src/components/AssetDetails.jsx:95` -- Inline `fontSize: 11, fontFamily` on YAxis tick.
- `src/components/AssetDetails.jsx:337-353` -- Inline `fontSize={22}`, `fontWeight="700"`, `fontSize={10}` in DowntimeDoughnut center.
- `src/components/AssetDetails.jsx:472-490` -- Inline `fontSize={22}`, `fontWeight="700"`, `fontSize={10}` in WorkOrdersDoughnut center.
- `src/components/AssetDetails.jsx:34` -- SectionLabel uses inline Tailwind classes for font styles instead of `section-header` utility class.
- `src/components/AssetHealth.jsx:48` -- DarkTooltip `fontSize: 13, fontWeight: 600` inline.
- `src/components/AssetHealth.jsx:560` -- Risk matrix cell `fontSize: 20, fontWeight: 700` inline.
- `src/components/AssetHealth.jsx:645` -- EventSummaryTooltip `fontSize: 12` inline.
- `src/components/AssetHealth.jsx:679-684` -- Event/Cases toggle button `fontSize: 12, fontWeight: 500` inline.
- `src/components/AssetHealth.jsx:757` -- Event summary legend value `fontSize: 18, fontWeight: 700` inline.
- `src/components/AssetHealth.jsx:786` -- BadActorTooltip `fontSize: 13, fontWeight: 600` inline.
- `src/components/Sidebar.jsx:110` -- Logo text `fontSize: '10px'` inline.
- `src/components/Sidebar.jsx:119` -- Sidebar title `fontSize: '13px'` inline.
- `src/components/Sidebar.jsx:148-149` -- Nav item label `fontSize: '13px', fontWeight` inline.
- `src/components/Sidebar.jsx:180` -- Settings label `fontSize: '13px', fontWeight` inline.
- `src/components/TopBar.jsx:58` -- APM title `fontSize`, `fontWeight: 700` inline.
- `src/components/TopBar.jsx:88-100` -- Breadcrumb text `fontSize: '13px'` inline (3 instances).
- `src/components/TopBar.jsx:128` -- Notification badge `fontSize: '9px'` inline.
- `src/components/Trends.jsx:58-60` -- CustomTooltip `fontSize: 12` and `fontSize: 11` inline.
- `src/components/Trends.jsx:78` -- `fontSize: 11` inline.
- `src/components/Trends.jsx:142` -- SingleChart label `fontSize: 13` inline.
- `src/components/Trends.jsx:152-167` -- Multiple `fontSize: 11` and `fontSize: 14` inline in SingleChart metrics.
- `src/components/Trends.jsx:306` -- `fontSize: 11` inline on Attributes label.
- `src/components/Trends.jsx:323-324` -- Attribute button `height: 34, fontSize: 13` inline.
- `src/components/Trends.jsx:350-351` -- Time range button `height: 30, fontSize: 12` inline.
- `src/components/Trends.jsx:369-370` -- Mode toggle button `height: 30, fontSize: 12` inline.
- `src/components/Trends.jsx:381` -- Overlay heading `fontSize: 14` inline.
- `src/components/Trends.jsx:384` -- Attribute count `fontSize: 12` inline.
- `src/components/Trends.jsx:489` -- Current Readings heading `fontSize: 14` inline.
- `src/components/Trends.jsx:493` -- Table `fontSize: 13` inline.
- `src/components/Trends.jsx:500` -- Table header `fontSize: 11` inline.
- `src/components/Trends.jsx:530` -- Unit text `fontSize: 11` inline.
- `src/components/Trends.jsx:540` -- Unit text `fontSize: 11` inline.
- `src/components/Trends.jsx:558` -- Status text `fontSize: 12` inline.

### TOKENS (odd pixel values) -- Medium

- `src/components/AssetDetails.jsx:69` -- `y - 6` and `y={y - 6}`: computed value, but base offset is odd-adjacent.
- `src/components/AssetDetails.jsx:114` -- Bar radius `[3, 3, 0, 0]`. ARCHITECTURE.md says `[4, 4, 0, 0]`.
- `src/components/AssetHealth.jsx:419` -- Timeline timestamp width `52` (not on 4px grid, should be 48 or 56).
- `src/components/AssetHealth.jsx:430` -- Status dot `marginTop: 5` -- odd number.
- `src/components/AssetHealth.jsx:437` -- `marginBottom: 2` -- not on 4px grid (use `--spacing-2` or `--spacing-4`).
- `src/components/AssetHealth.jsx:448` -- KPI impact badge `padding: '1px 6px'` -- 1px is odd.
- `src/components/AssetHealth.jsx:757-758` -- Legend value `fontSize: 18` -- valid even, but not in the type scale. `marginTop: 2` inline instead of token.
- `src/components/AssetHealth.jsx:679` -- Toggle padding `4px 14px` -- valid but 14 not on 4px grid.
- `src/components/TopBar.jsx:128` -- `fontSize: '9px'` -- odd number, violates "all numbers must be even."
- `src/components/Trends.jsx:78` -- `pl-[calc(var(--spacing-xs)+8px)]` -- uses `--spacing-xs` which is not defined in global.css.
- `src/components/Trends.jsx:323` -- Button height `34` -- not on 4px grid (should be 32 or 36).

### TOKENS (undefined CSS variables) -- High

- `src/components/AssetDetails.jsx:44` -- `p-lg` Tailwind class references undefined spacing token. No `--spacing-lg` in global.css.
- `src/components/AssetDetails.jsx:581` -- `p-md` Tailwind class references undefined spacing token.
- `src/components/AssetDetails.jsx:613` -- `-mx-lg` references undefined spacing token.
- `src/components/AssetDetails.jsx:617` -- `px-lg` references undefined spacing token (4 instances across the table).
- `src/components/AssetDetails.jsx:698` -- `mb-xl` references undefined spacing token.
- `src/components/AssetDetails.jsx:729` -- `space-y-xl` references undefined spacing token.
- `src/components/AssetDetails.jsx:737` -- `gap-lg` references undefined spacing token (3 instances).
- `src/components/Trends.jsx:57` -- `p-[var(--spacing-sm)]` references undefined `--spacing-sm`.
- `src/components/Trends.jsx:60` -- `mb-[var(--spacing-sm)]` references undefined `--spacing-sm`.
- `src/components/Trends.jsx:70-71` -- `mb-[var(--spacing-xs)]`, `gap-[var(--spacing-xs)]` references undefined `--spacing-xs`.
- `src/components/Trends.jsx:79` -- `gap-[var(--spacing-md)]` references undefined `--spacing-md`.
- `src/components/Trends.jsx:134` -- `p-[var(--spacing-md)]` references undefined `--spacing-md`.
- `src/components/Trends.jsx:136-150` -- Multiple `gap-[var(--spacing-sm)]`, `mb-[var(--spacing-md)]`, `gap-[var(--spacing-lg)]` reference undefined tokens.

### LAYOUT -- Medium

- `src/components/AssetDetails.jsx:737-757` -- Uses `flex gap-lg` for card rows instead of `grid-12` with column spans. All three row sections use ad-hoc flex layout.
- `src/components/AssetHealth.jsx:197` -- Uses `grid grid-cols-2 lg:grid-cols-5` for KPI row instead of `grid-12` with `col-kpi` spans.
- `src/components/AssetHealth.jsx:383` -- Uses `grid grid-cols-1 lg:grid-cols-2` for Today's Activity instead of `grid-12` with `col-half` spans.
- `src/components/AssetHealth.jsx:877` -- Uses `grid grid-cols-1 lg:grid-cols-3` for Assets Requiring Attention instead of `grid-12` with `col-third` spans.
- `src/components/Trends.jsx:469-473` -- Uses `grid grid-cols-2` for separate charts instead of `grid-12` with column spans.

### LAYER -- Medium

- `src/components/AssetDetails.jsx` -- Defines its own `Card`, `CardTitle`, `SectionLabel`, `ChartTooltip` components inline. Per layer rules, stateless UI primitives belong in `src/components/ui/`.
- `src/components/AssetHealth.jsx` -- Defines `DarkTooltip`, `EventSummaryTooltip`, `BadActorTooltip` inline. These are reusable UI primitives.
- `src/components/AssetDetails.jsx` -- `AssetDetails.jsx` does not import from `src/styles/tokens.js`. Uses hardcoded hex instead. Correct import direction, but misses the token source entirely.
- `src/data/assets.js:128-133` -- Data file contains hex color values. ARCHITECTURE.md says data imports nothing and has no logic. Colors are presentation, not data.

### IMPORT -- Low

- `src/components/AssetHealth.jsx:7` -- Imports `colors` and `chartStyle` from tokens.js (correct).
- `src/components/AssetDetails.jsx` -- Does NOT import from tokens.js. Uses hardcoded hex instead. Not a direction violation, but a token coverage gap.
- `src/components/Trends.jsx` -- Does NOT import from tokens.js. All chart styling uses CSS vars via Tailwind bracket syntax, which is acceptable, but SVG/Recharts elements use hardcoded strings.

### IMPORT -- Info

- All import directions are correct (Screens import from Data and Styles, Shell imports from Data). No reverse imports detected.
- No `ui/` directory exists yet, so UI primitive extraction hasn't started.

---

## Summary

| Severity | Count |
|----------|-------|
| High     | 6 categories (size: 3 files, naming: 4 items, hex colors: ~40 instances, inline fonts: ~35 instances, odd pixels: ~11 instances, undefined vars: ~20 instances) |
| Medium   | 3 categories (naming: 1, layout: 5, layer: 4) |
| Low      | 1 category (import: 2) |
| Info     | 1 category (import direction: clean) |

**Architecture health: Poor**

The token system in global.css is well-designed and comprehensive. The problem is adoption: AssetDetails.jsx uses zero tokens, AssetHealth.jsx uses tokens.js for charts but hardcodes everywhere else, and Trends.jsx invented undefined CSS variable names (`--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xs`) that do not exist in global.css. Three of six planned screens are missing. Both existing screen files are 2-3x over the 400-line limit. The grid-12 layout system defined in global.css is not used by any component. Screen filenames do not match the names in CLAUDE.md.

### Recommended priority

1. **Rename files** to match CLAUDE.md: `AssetHealth.jsx` to `PlantOverview.jsx`, `AssetDetails.jsx` to `AssetInspection.jsx`. Update App.jsx, Sidebar.jsx nav items.
2. **Define missing spacing tokens** in global.css (`--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl`, `--spacing-xs`) or replace all references with the existing numeric tokens (`--spacing-8`, `--spacing-16`, `--spacing-24`, `--spacing-32`).
3. **Replace all hardcoded hex** in AssetDetails.jsx and data/assets.js with imports from tokens.js. Use desaturated token values, not raw Tailwind colors.
4. **Replace inline font styles** with type composition classes throughout.
5. **Extract sub-components** from the three oversized screens to get under 400 lines each.
6. **Adopt grid-12** layout system instead of ad-hoc flex and grid-cols patterns.
7. **Fix odd pixel values** (9px, 5px, 1px, 3px bar radius, 34px height).
