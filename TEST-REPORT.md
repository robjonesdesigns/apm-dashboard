# Test Report

**Last run:** 2026-04-14
**Runner:** Vitest 4.1.4
**Result:** 146 tests passed, 0 failed

## Summary

| Category | Files | Tests | Status |
|---|---|---|---|
| Data layer | 2 | 71 | Pass |
| UI components | 12 | 75 | Pass |
| **Total** | **14** | **146** | **Pass** |

## Data Layer Tests

### baytown.test.js (71 tests)
- PLANT: KPI fields, previous values for delta, health thresholds, activeAssets constraint
- OEE_TREND: 12 months, all values 0-100, required fields
- KPI_24H: 13 hourly snapshots, K-101 trip drop verified (OEE drops after 2 AM)
- ASSETS: 10 assets, unique IDs, required fields, criticality A-D, status values, OEE/RUL/downtime trends, derived event counts, production weights sum to 1.0, K-101 is tripped with criticality A
- TIMELINE: referential integrity (every event references valid asset ID), severity and status enums
- WORK_ORDERS: required fields, urgency enum (emergency/urgent/scheduled)
- INVESTIGATIONS: required fields, referential integrity
- INCIDENTS: event ID cross-references valid TIMELINE events
- NOTIFICATIONS: derived from TIMELINE with required fields
- BAD_ACTORS: max 5 entries, sorted by events descending
- RISK_MATRIX: criticality A/B/C, non-negative counts
- EVENT_SUMMARY: confirmed + falsePositives + newEvents = total
- K101_DEGRADATION: sensor fields, ends in trip status
- K101_FAULT_TREE: top-level event, root cause = Filter Bypass
- PERFORMANCE_ATTRIBUTES: attribute/value/expected/unit/deviation fields
- Utility functions: deriveEventSeverity, deriveMTBF, deriveMTTR, deriveRUL, deriveAvailability, deriveAssetOEE, derivePlantOEE, getActiveIncident

### tokens.test.js
- Color tokens: backgrounds, text, status, accent, 8 chart colors, KPI identity
- tooltipInverse, chartStyle exports

## UI Component Tests

| Component | Tests | What's verified |
|---|---|---|
| SeverityBadge | 4 severities, compact mode, tally bar counts |
| CriticalityIndicator | A/B/C/D labels, unknown fallback, inverted prop |
| StatusIndicator | 4 statuses, compact dot mode, CSS classes, statusLabel helper |
| WoPriority | emergency/urgent/scheduled, null for invalid, aria-hidden SVGs |
| Legend | labels, values, title, interactive mode, activeItem dimming |
| FilterChip | label, aria-label, onClear callback |
| FilterButton | dropdown open/close, active count, checkbox toggle, Escape key |
| ErrorBoundary | renders children, catches errors, shows reload button |
| Sidebar | navigation landmark, 4 nav items, aria-current, mobile states |
| TopBar | banner, breadcrumb, notification bell, density toggle, hamburger |
| ImpactStrip | section header, Trigger/Consequence/Confirmation cards |
| KpiBar | 4 KPI cards, percentage values, onKpiClick, health indicators |

## Bugs Found

None.

## Build Verification

- `npx vite build`: Clean (214ms, 0 errors)
- Output: 450.25 kB JS (122.67 kB gzipped), 30.58 kB CSS (6.71 kB gzipped)
