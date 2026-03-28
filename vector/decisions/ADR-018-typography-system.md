# ADR-018: Typography System Consolidation

**Status:** Accepted
**Date:** 2026-03-28
**Supersedes:** Previous ad-hoc type classes (type-heading-01 through 04, type-body-01, type-body-02, type-body-compact, type-helper, type-label-semibold, type-kpi-lg, type-callout)

## Context

The dashboard accumulated 13 type classes over sessions 1-12, with 4 unused, 3 near-duplicates, and 15+ inline fontSize overrides that contradicted their own class definitions. This made typography inconsistent and hard to maintain.

## Decision

Consolidate to a 9-class type system. No inline font-size overrides allowed. Weight overrides (fontWeight: 600) are permitted for emphasis on data values.

| Class | Size | Weight | Role |
|-------|------|--------|------|
| `section-header` | 14px | 500 | Uppercase section labels |
| `type-card-title` | 14px | 600 | Card headers (--color-card-title) |
| `type-table-header` | 14px | 600 | Column headers (--color-text-secondary) |
| `type-body` | 14px | 400 | General text, table data |
| `type-meta` | 12px | 400 | Timestamps, helper text |
| `type-label` | 12px | 500 | Legend items, chips, form labels |
| `type-kpi` | 28px | 700 | KPI card values |
| `type-kpi-hero` | 32px | 700 | Donut center, large callouts |
| `type-link` | 14px | 400 | Teal interactive links |

## Rationale

- On dark backgrounds, weight contrast reads stronger than size contrast
- 14px bold vs 14px regular is more distinct than 16px regular vs 14px regular
- Section headers differentiate through uppercase + letter-spacing, not size
- Card titles use dimmed color (--color-card-title) for hierarchy without size change
- Table headers are bold (600) for scannability, matching Carbon data table pattern

## Removed Classes

type-heading-01, type-heading-02, type-heading-03, type-heading-04, type-body-01, type-body-02, type-body-compact, type-helper, type-label-semibold, type-kpi-lg, type-callout

## Self-contained Components

FilterChip.jsx and CriticalityIndicator.jsx use inline fontSize in their style objects since they are entirely inline-styled. This is acceptable -- the rule prohibits inline overrides on elements that already have a type class.
