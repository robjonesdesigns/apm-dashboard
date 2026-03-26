# DESK-RESEARCH-005 -- Typography Hierarchy and Card Patterns

**Date:** 2026-03-26
**Status:** Complete
**Scope:** How to fix the visual hierarchy and card padding issues.

---

## Key Findings

### 1. Card titles should be 16px, not 14px
Carbon uses heading-02 (16px/600) for card titles in dashboards, not heading-01 (14px/600).
At 14px, card titles are the same size as body text and only differ by weight. This violates the
rule: change at least 2 of 3 properties (size, weight, color) between adjacent hierarchy levels.

FIX: All card titles use type-heading-02 (16px/600) instead of type-heading-01 (14px/600).

### 2. Charts bleed to card inner edges
Card title area keeps the full 24px padding. Charts start at the left edge of the content box
and extend to the bottom edge. Recharts margin: { top: 8, right: 16, bottom: 0, left: 0 }.
The card's 24px padding provides the outer frame.

### 3. Section gap should be 48px (2:1 ratio)
Current 32px section gap vs 24px card gap = 1.33:1 ratio. Minimum for Gestalt proximity.
48px would give 2:1, making section boundaries unmistakable.

### 4. AssetTable overrides card padding to 0
This breaks H4 (Consistency). The table card must use the .card class 24px padding.
Table content sits within the padded area. Table itself can have 0 internal padding
but the card wrapper must not be overridden.

### 5. The 5-level type hierarchy
| Level | Role | Token | Size | Weight | Color |
|-------|------|-------|------|--------|-------|
| 1 | Page title | type-heading-03 | 20px | 400 | text-primary |
| 2 | Section label | section-header | 12px | 600 | text-helper + uppercase |
| 3 | Card title | type-heading-02 | 16px | 600 | text-primary |
| 4 | Data values | type-kpi | 28px | 400 | text-primary |
| 5 | Labels/meta | type-label | 12px | 400 | text-helper |

KPI values (28px) are the LARGEST on the page, larger than the page title.
Data is the hero. Structural hierarchy uses weight, color, and spacing, not size.

### 6. Nielsen's H4 applied
- All cards: identical 24px padding via .card class. No inline overrides.
- All section headers: .section-header class. No variations.
- All card titles: type-heading-02. No mixing heading-01 and heading-02.
- All chart axes: 12px, text-helper color. Consistent across all charts.
- All status colors: exact token values, no one-off colors.
