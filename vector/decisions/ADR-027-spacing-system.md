# ADR-027: Spacing System and Semantic Tokens

**Status:** Accepted
**Date:** 2026-03-30

## Context

Spacing across the dashboard was inconsistent -- some vertical stacking used 4px, some 8px, some 12px. Dense mode (ADR-026) only compressed card padding and section gaps, missing the opportunity to compress content-level spacing. Adjacent inline indicators (badges, status labels, criticality pills) had no visual separation.

## Decision

### Spacing Scale (8px base grid)

| Token | px | Use |
|-------|-----|-----|
| `--spacing-2` | 2px | Micro adjustments (border offsets, sub-pixel nudges) |
| `--spacing-4` | 4px | Tight inline: icon-to-label within a single unit, internal badge padding, checkbox-to-text |
| `--spacing-8` | 8px | Default vertical stacking, default inline gap between indicators |
| `--spacing-12` | 12px | Intra-card grouping: between logical blocks within a card |
| `--spacing-16` | 16px | Cell padding, mobile card padding, page gutter (mobile) |
| `--spacing-24` | 24px | Card padding (desktop), page top/bottom padding |
| `--spacing-32` | 32px | Page gutter (desktop) |
| `--spacing-48` | 48px | Section gap (between major page sections) |

### Semantic Tokens (dense-responsive)

Two semantic tokens respond to dense mode:

| Token | Normal | Dense | Use |
|-------|--------|-------|-----|
| `--gap-stack` | 8px | 4px | Between stacked text lines, metadata rows, label-to-value pairs |
| `--gap-intra` | 12px | 8px | Between logical groups inside a card (header to content, content to footer) |

Components reference `var(--gap-stack)` and `var(--gap-intra)` in inline styles instead of raw `var(--spacing-8)` or `var(--spacing-12)` for vertical stacking. Dense mode overrides them globally via CSS.

### Rules

1. **Vertical stacking default is 8px.** Any time 2+ lines of text/metadata stack vertically, use `--gap-stack`. Never use 4px for vertical stacking in normal mode.

2. **4px is the tight exception.** Only for horizontal inline gaps within the same visual unit (icon + label, checkbox + text). Never for vertical stacking.

3. **Divider between competing indicators.** When two or more badges, status labels, or inline indicators sit adjacent in a row, insert a 1px x 12px vertical divider (`--color-border-strong`) between them.

4. **Dense mode compresses content, not just containers.** Dense overrides: card padding 12px, section gap 24px, grid gaps 12px, stack gap 4px, intra-card gap 8px.

### Dense Mode Overrides (complete)

```css
.dense .card { padding: var(--spacing-12); }
.dense .section-gap { gap: var(--spacing-24); }
.dense .kpi-grid { gap: var(--spacing-12); }
.dense .grid-thirds { gap: var(--spacing-12); }
.dense .grid-12 { gap: var(--spacing-12); }
.dense .page-padding { padding: 0 var(--spacing-16); }
.dense .section-header { margin-bottom: var(--spacing-4); }
.dense { --gap-stack: var(--spacing-4); --gap-intra: var(--spacing-8); }
```

## Consequences

- Every vertical spacing value traces to a token -- no magic numbers
- Dense mode provides meaningful data density (not just smaller padding)
- New components use `--gap-stack` and `--gap-intra` for vertical spacing
- Divider rule prevents visual ambiguity between adjacent indicators
- Consistent rhythm across all cards and sections
