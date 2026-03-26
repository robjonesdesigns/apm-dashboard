# DESK-RESEARCH-004 -- IBM Carbon Design System Specs for Dark Dashboard

**Date:** 2026-03-26
**Status:** Complete
**Scope:** Exact specs from IBM Carbon Design System (g100 dark theme) to use as the foundation for the APM dashboard. We will adapt these specs, not copy them exactly.

---

## Adopted from Carbon (with modifications)

### Colors (g100 dark theme, adapted)
| Use | Carbon token | Hex | Our adaptation |
|-----|-------------|-----|----------------|
| Page bg | background | #161616 | Use as-is |
| Card bg | layer-01 | #262626 | Use as-is |
| Card-on-card | layer-02 | #393939 | Use for tooltips, dropdowns |
| Hover bg | layer-hover-01 | #333333 | Use as-is |
| Text primary | text-primary | #f4f4f4 | Use as-is |
| Text secondary | text-secondary | #c6c6c6 | Use as-is |
| Text helper | text-helper | #a8a8a8 | Use for labels/meta |
| Text disabled | text-disabled | rgba(244,244,244,0.25) | Use as-is |
| Border subtle | border-subtle-01 | #525252 | Use for card borders |
| Border strong | border-strong-01 | #6f6f6f | Use for dividers |
| Interactive/accent | interactive | #4589ff | CHANGE to our teal #2dd4bf |
| Link | link-primary | #78a9ff | Keep blue for links |
| Error | support-error | #fa4d56 | Use as-is |
| Success | support-success | #42be65 | Use as-is |
| Warning | support-warning | #f1c21b | Use as-is |
| Info | support-info | #4589ff | Use as-is |
| Chart grid | border-subtle-00 | #393939 | Use as-is |

### Typography (Inter, adapted from Carbon scale)
| Style | Size | Weight | Line Height | Letter Spacing | Use |
|-------|------|--------|-------------|----------------|-----|
| heading-01 | 14px | 600 | 18px | 0.16px | Card titles |
| heading-02 | 16px | 600 | 22px | 0px | Section headings |
| heading-03 | 20px | 400 | 28px | 0px | Page section titles |
| heading-04 | 28px | 400 | 36px | 0px | KPI values |
| body-01 | 14px | 400 | 20px | 0.16px | Body text |
| body-compact-01 | 14px | 400 | 18px | 0.16px | Table/data text |
| label-01 | 12px | 400 | 16px | 0.32px | Labels, axis text, captions |
| helper-01 | 12px | 400 | 16px | 0.32px | Helper/meta text |

### Spacing (Carbon scale)
2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96px

### Grid
| Breakpoint | Columns | Gutter | Margin |
|-----------|---------|--------|--------|
| sm (320px) | 4 | 32px | 16px |
| md (672px) | 8 | 32px | 16px |
| lg (1056px) | 16 | 32px | 16px |

NOTE: Carbon uses 16 columns at desktop, not 12. Consider adopting.

### Navigation
- Header: 48px tall, fixed, z-index 10000
- Sidebar expanded: 256px
- Sidebar collapsed (rail): 48px
- Nav item height: 48px
- Content: padding-top 48px, margin-left varies with sidebar state

### Cards
- Padding: 16px (Carbon default). We use 24px for dashboard readability.
- Border: 1px solid #525252
- Border radius: 0px (Carbon). We may add slight radius (4px) for warmth.
- Background: #262626 on #161616 page

### Motion
- Fast-01: 110ms (hover transitions)
- Fast-02: 150ms (state changes)
- Productive curve: cubic-bezier(0.2, 0, 0.38, 0.9)
- Expressive curve: cubic-bezier(0.4, 0.14, 0.3, 1)

### Data Visualization
- Tooltip bg: #393939, border #525252, radius 2px, padding 16px
- Grid lines: #393939
- Axis text: #c6c6c6, 12px
- Chart entrance: 300-500ms productive curve

---

## What We Keep Different from Carbon

1. **Accent color**: teal #2dd4bf instead of Carbon's blue #4589ff
2. **Font**: Inter instead of IBM Plex Sans (we don't have Plex license concerns)
3. **Card padding**: 24px for dashboard readability (Carbon's 16px is tight for data)
4. **Border radius**: 4px slight radius (Carbon's 0px is too harsh)
5. **Grid**: Start with 16 columns (Carbon default) instead of our previous 12
6. **Sidebar width**: 256px expanded / 48px collapsed (Carbon standard)
7. **Header height**: 48px (Carbon standard, down from our 60px)
8. **Header contents**: Logo + "APM" + divider + breadcrumb | Help + Avatar + Bell

---

## Sources
- @carbon/themes g100 package
- @carbon/type, @carbon/layout, @carbon/colors packages
- carbondesignsystem.com documentation
