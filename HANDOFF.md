# APM Dashboard Handoff -- Session 28 End

## START HERE

Full design system overhaul. ~170 static inline styles eliminated across 20 files. 14 reusable CSS component classes added. JS hover migrated to CSS :hover in 4 components. Tufte-informed visual refinements: donut replaced with horizontal bars, card borders removed (background elevation only), KPI accent-top border removed, dense mode defaults to on, unified hover pattern across Needs Action cards, Risk Matrix cells now solid fills. Tooltip text fixed (type classes inherit inverted color inside tooltip-bubble).

## Deployed
- **APM Dashboard**: https://apm.designedbyrob.com
- **Portfolio case study**: https://designedbyrob.com/projects/honeywell-apm

## Session 28 Changes

### Design System Overhaul
- **14 CSS component classes** in global.css: btn-reset, divider-v, row-hover, tooltip-fixed, tooltip-bubble, filter-chip, filter-btn, filter-dropdown, count-badge, icon-btn, modal-overlay, breadcrumb-link, col-right-100, notification-item
- **Base reset moved to @layer base** so Tailwind utilities override correctly
- **--spacing: 1px** base multiplier added so numeric Tailwind utilities (gap-8, p-16, etc.) map to project pixel tokens
- **WhatChanged.jsx deleted** (dead code)
- **JS bundle -20KB** (468 -> 448), **CSS +5KB** (26 -> 31, new classes)

### Tufte-Informed Refinements
- **Alarm Quality:** donut chart replaced with horizontal bar chart (matches Watch List pattern). Stacked bar removed in favor of individual bars per segment.
- **Card borders removed:** .card uses border: none, relies on background elevation (layer-01 on bg) + whitespace. Borders restored in forced-colors mode for accessibility.
- **KPI accent-top border removed:** card-accent-top no longer applied to KPI cards. Hover state already signals interactivity.
- **Dense mode defaults to on:** localStorage check flipped from === 'true' to !== 'false'. Engineers want density.
- **Unified hover pattern (Needs Action):** All three cards (Risk Matrix, Alarm Quality, Watch List) use the same interaction: hover dims siblings to 0.35, no accent border on hover. Accent border + accent-bg only on selected/pressed state.
- **Risk Matrix cells:** solid status color fills (100% opacity) with dark text. Previously 24% alpha.
- **Tooltip text fix:** .tooltip-bubble overrides all type classes (type-body, type-meta, etc.) to use --color-tooltip-text. No more invisible light text on white tooltip backgrounds.

### File Size Results
| File | Before | After |
|------|--------|-------|
| AssetInspection | 1148 | 994 |
| AssetTable | 1100 | 1016 |
| NotificationsPanel | 613 | 384 |
| KpiBar | 460 | 367 |
| TopBar | 419 | 227 |
| InProgress | 362 | 293 |
| Sidebar | 302 | 185 |
| HelpPanel | 140 | 96 |

### What Remains (not structural, polish)
- **AssetInspection (994 lines)** and **AssetTable (1016 lines)** still over 400-line limit. Sub-component extraction deferred.
- **DesignSystem.jsx (524 lines)** -- token showcase, low priority.
- **Inline sparklines** -- Tufte critique suggested showing sparklines inline beneath KPI values instead of behind a click. Deferred (mobile layout concern).
- **PlantOverview.jsx** -- 6 remaining inline styles in MobileCardCarousel (carousel mechanics).

## Architecture Notes

### CSS Layer Order
Tailwind v4 layers: `@layer theme` -> `@layer base` -> `@layer components` -> `@layer utilities`. The global reset (`* { margin: 0; padding: 0 }`) MUST be in `@layer base` or it overrides all Tailwind utilities (unlayered CSS wins over layered).

### Spacing System
`--spacing: 1px` in @theme means Tailwind numeric utilities map 1:1 to pixels: `gap-8` = 8px, `p-24` = 24px. Named tokens (`--spacing-24: 24px`) are used by `var()` references in CSS classes; the numeric utilities use the base multiplier.

### Hover Pattern (Needs Action Cards)
All three cards use opacity dimming for hover focus:
- **Rest:** full opacity, no border
- **Hover:** hovered element full opacity, siblings 0.35
- **Selected:** accent border + accent-bg, siblings 0.35

## Pending (from Session 23, unchanged)
- ADR-029 Role-based toggle
- ADR-030 AI assistant architecture
- ADR-031 Data model expansion
- Full platform page structure for both personas
