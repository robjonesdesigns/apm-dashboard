# ADR-002: Color System (Carbon g100 Dark Theme)

**Date:** 2026-03-25 (original), 2026-03-28 (updated)
**Status:** Accepted (revised)
**Deciders:** Rob Jones

## Context

Original decision was to desaturate Tailwind colors for dark mode. This was superseded when the project adopted IBM Carbon g100 dark theme tokens (DESK-RESEARCH-004). The Carbon palette is designed for dark backgrounds and doesn't need manual desaturation.

## Decision

All colors derive from Carbon g100 dark theme, adapted with teal accent (replacing Carbon's blue interactive color) and coral-red/amber status pairing (ADR-010).

### Status colors

| Token | Value | Use |
|-------|-------|-----|
| `--color-error` | #f47174 | Critical events, emergency WOs |
| `--color-error-bg` | rgba(244, 113, 116, 0.16) | Critical badge/cell background |
| `--color-success` | #42be65 | Healthy state |
| `--color-success-bg` | rgba(66, 190, 101, 0.16) | Success background |
| `--color-warning` | #e8914f | High events, amber status |
| `--color-warning-bg` | rgba(232, 145, 79, 0.16) | Warning background |
| `--color-info` | #4589ff | Low events, informational |
| `--color-info-bg` | rgba(69, 137, 255, 0.16) | Info background |

### Chart palette (Carbon categorical, 8 colors)

| Token | Value |
|-------|-------|
| `--color-chart-1` | #2dd4bf (teal) |
| `--color-chart-2` | #4589ff (blue) |
| `--color-chart-3` | #a56eff (purple) |
| `--color-chart-4` | #f1c21b (yellow) |
| `--color-chart-5` | #fa4d56 (red) |
| `--color-chart-6` | #ff7eb6 (pink) |
| `--color-chart-7` | #42be65 (green) |
| `--color-chart-8` | #33b1ff (cyan) |

### Donut palette (desaturated for dark-and-quiet, ADR-017)

| Token | Value | Use |
|-------|-------|-----|
| `--color-chart-donut-1` | #24a898 | Confirmed events |
| `--color-chart-donut-2` | #c9a640 | False positives |
| `--color-chart-donut-3` | #3d72cc | New/unvalidated |

### Accent

| Token | Value | Use |
|-------|-------|-----|
| `--color-accent` | #2dd4bf | Primary interactive (teal) |
| `--color-accent-hover` | #5de0cf | Hover state |
| `--color-accent-bg` | rgba(45, 212, 191, 0.16) | Active selection background |
| `--color-accent-bg-strong` | rgba(45, 212, 191, 0.12) | Notification hover + new |
| `--color-accent-bg-subtle` | rgba(45, 212, 191, 0.06) | Notification new (unhovered) |

### KPI identity colors

| Token | Value | Metric |
|-------|-------|--------|
| `--color-kpi-oee` | #4589ff | OEE |
| `--color-kpi-availability` | #fa4d56 | Availability |
| `--color-kpi-performance` | #f1c21b | Performance |
| `--color-kpi-quality` | #2dd4bf | Quality |

### Utility tokens

| Token | Value | Use |
|-------|-------|-----|
| `--color-border-divider` | rgba(57, 57, 57, 0.5) | Table column dividers (50% of row divider) |
| `--color-hover-cursor` | rgba(255, 255, 255, 0.03) | Recharts bar hover cursor |
| `--shadow-tooltip` | 0 4px 12px rgba(0, 0, 0, 0.4) | All tooltip drop shadows |

## Consequences

- All colors tokenized in global.css @theme block. Zero hardcoded hex/rgba in components.
- Chart palette designed for dark backgrounds -- no manual desaturation needed.
- Donut uses intentionally muted variants for dark-and-quiet aesthetic.
- tokens.js mirrors CSS tokens as hex values for Recharts (which can't consume CSS vars).

## Supersedes

Original ADR-002 referenced Tailwind desaturated colors (#E57373, #81C784, #64B5F6, #FFB74D) that were never implemented. Carbon g100 replaced them entirely.
