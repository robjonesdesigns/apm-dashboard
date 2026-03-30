# ADR-026: Dense Mode and Cross-Card Alignment

**Status:** Accepted
**Date:** 2026-03-29

## Context

Industrial reliability engineers often work on large monitors with dozens of assets. The default 24px card padding and 48px section gaps provide comfortable reading, but power users want maximum data density to see more correlations without scrolling. Separately, the In Progress section has WO and Investigation cards side by side, but their internal columns don't align, forcing the eye to re-anchor when scanning across cards.

## Decisions

### Dense mode toggle

A segmented control in the TopBar with grid (comfortable) and list (compact) icons. Both icons always visible -- the active state fills teal, inactive is subtle. Available on desktop and mobile.

Dense mode applies a `.dense` CSS class to the root `<div>` that overrides:
- Card padding: 24px to 12px
- Section gaps: 48px to 24px
- Grid gaps (kpi-grid, grid-thirds, grid-12): to 12px
- Page padding: 32px to 16px
- Section header bottom margin: tightened

State persists in localStorage (`apm-dense` key) so it survives page refreshes and sessions.

### Cross-card alignment (In Progress)

WO and Investigation rows share a fixed 100px right column (`RIGHT_COL` constant) for:
- Line 1: urgency indicator (WO) / status indicator (Investigation)
- Line 2: assignee name
- Line 3: timestamp

Both cards use the same constant, so the right-side data aligns vertically when the cards sit side by side in the grid. An engineer scanning "who's assigned?" reads straight down at the same x-position in both cards. This reduces saccadic eye movement during triage.

## Rationale

Dense mode is a power-user feature that shows understanding of how industrial engineers actually work -- they customize their workspace for maximum throughput. The segmented control makes the option discoverable without hiding it in a settings menu. Cross-card alignment is a subtle detail that improves scanning speed, following the same principle as tabular-nums in data columns: consistent positioning lets the eye extract information faster.
