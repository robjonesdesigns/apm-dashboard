# ADR-016: Badge System, Asset Criticality, and Visual Separation

**Date:** 2026-03-28
**Status:** Accepted
**Relates to:** ADR-010, ADR-011, ADR-015, DESK-RESEARCH-012, DESK-RESEARCH-013

---

## Context

The dashboard used the same colored badge component for both asset priority and event severity. "High" on an asset badge and "High" on a work order badge looked identical but meant different things. Additionally, badges used colored text on faint colored backgrounds with poor readability.

Per DESK-RESEARCH-013: asset criticality is a static engineering classification (ISA 14224, NORSOK Z-008). Event/alarm severity is a dynamic operational state (ISA-18.2). ISA-101 and EEMUA 201 recommend different visual encodings for different semantic categories.

## Decisions

### 1. Two distinct visual components

**Event severity badges** (Critical/High/Medium/Low) -- for events, alarms, work orders:
- Fill hierarchy communicates urgency through visual weight
- Tallies (vertical bars) as non-color severity indicator (WCAG SC 1.4.1)
- Used in: Work Orders, Investigations, Notifications, anywhere event urgency is shown

| Level | Tallies | Fill | Text | Border |
|-------|---------|------|------|--------|
| Critical | `\|\|\|\|` | Solid red (#f47174) | Near-black #161616 | Solid red |
| High | `\|\|\|` | Transparent red (16%) | White #f4f4f4 | 1px red |
| Medium | `\|\|` | Transparent amber (16%) | White #f4f4f4 | 1px amber |
| Low | `\|` | Transparent blue (16%) | White #f4f4f4 | 1px blue |

**Asset criticality indicators** (A/B/C/D) -- for assets only:
- Letter grade in a muted treatment -- visually distinct from event badges
- Understated because criticality is a stable background property, not an urgent signal
- Used in: Asset Table, Asset Inspection header, anywhere an asset's importance is shown
- Visual: outlined pill with letter, neutral/muted palette

### 2. Risk Matrix axis is "Asset Criticality" not "Asset Priority"

Per DESK-RESEARCH-013: the matrix crosses a static input (criticality) with a dynamic state (event status). Using "priority" would be circular since the matrix produces priority.

- X-axis columns: A / B / C (asset criticality, left to right by importance)
- Y-axis rows: New / In Progress (event status)
- Legend label: "Asset Criticality"

### 3. Counts separated from badges

Numbers (event counts, work order counts) are separate from the badge. The badge communicates *what kind*. The number communicates *how many*. Two different elements:
- `3` then `||| High` (number as its own element, badge next to it)
- Not `3 ||| High` inside one pill

### 4. Three colors, consistent across event severity

| Color | Token | Event Level |
|-------|-------|-------------|
| Red #f47174 | --color-error | Critical (solid fill), High (outline) |
| Amber #e8914f | --color-warning | Medium |
| Blue #4589ff | --color-info | Low |

Critical and High both use red but differ by fill weight (solid vs outline) and tally count (4 vs 3).

### 5. Contrast ratios (verified)

| Combination | Ratio | Passes |
|-------------|-------|--------|
| #161616 on #f47174 (Critical badge) | 6.43:1 | AA text |
| #f4f4f4 on #262626 (High/Med/Low badge on card) | 13.76:1 | AAA text |
| #f47174 border on #262626 (red outline) | 5.38:1 | AA non-text |
| #e8914f border on #262626 (amber outline) | 6.19:1 | AA non-text |
| #4589ff border on #262626 (blue outline) | 4.52:1 | AA non-text |

## Consequences

- Asset Table must show criticality as A/B/C letter indicator, not colored priority badge
- Risk Matrix data and labels change from "High/Medium/Low" to "A/B/C"
- All event/work order badges migrate to tally + fill hierarchy system
- NotificationsPanel, TodaysActivity need badge migration
- New CSS classes: `.badge-critical`, `.badge-high`, `.badge-medium`, `.badge-low` (event severity) and `.criticality-indicator` (asset criticality)
