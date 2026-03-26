# ADR-003: Colored Left Borders on KPI Cards

**Date:** 2026-03-25
**Status:** accepted
**Deciders:** Rob Jones

## Context
The original Figma designs use a distinct colored left border on each KPI card (OEE=blue, Availability=red, Performance=orange, Quality=teal). This gives each metric a visual identity at a glance without reading the label.

## Decision
Add a 3px left border to each KPI card using a per-metric accent color. This is in addition to the hover outline interaction (accent border on hover).

## Consequences
- Engineers can identify metrics by position AND color, reducing cognitive load
- The color becomes a consistent identifier that can be referenced in other parts of the dashboard
- Must choose 4 distinguishable colors that work on both light and dark backgrounds

## Alternatives Considered
- No border (current build): cards look identical until hovered, no at-a-glance identity
- Top border instead of left: less prominent, doesn't create the "card tab" feel
