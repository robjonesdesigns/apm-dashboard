# ADR-003: KPI Card Top Stripe (Superseded)

**Date:** 2026-03-25 (superseded 2026-03-26)
**Status:** superseded
**Deciders:** Rob Jones

## Original Decision
Distinct colored left border per KPI card (OEE=blue, Availability=red, Performance=orange, Quality=teal) for at-a-glance identity.

## Why Superseded
Using red (#fa4d56) and yellow (#f1c21b) as identity colors conflicts with their semantic meaning as alarm colors. In a monitoring dashboard, red means "critical" and yellow means "warning." Using them decoratively trains the engineer's eye to ignore them, which is dangerous when a real alarm fires.

From PER-001 (Carlos): "vibration alerts fire but nobody acts on them." Diluting alarm colors with decoration makes this worse.

## New Decision
All KPI cards use the dashboard accent color (teal, --color-accent) as the top stripe. One consistent color communicates "these are all interactive" without burning semantic colors on decoration.

KPI values render in white (text-primary). When a value enters a concerning range, THEN it changes to the appropriate semantic color (error, warning). That's meaningful color, not decorative color.

Card titles across the dashboard use text-secondary (#c6c6c6) to not compete with data values. Still AAA contrast on layer-01 background (~8.5:1).

## Consequences
- Alarm colors are reserved for actual alarms
- KPI cards are visually consistent as a group
- Engineers distinguish metrics by position and label, not by color
- The accent stripe communicates "clickable" (same pattern as hover)
- Simpler color palette, less visual noise
- Titles dimmed across all cards (not just KPIs) for consistent hierarchy

## Alternatives Considered
- Per-metric colored borders: burns alarm colors on decoration
- No stripe at all: cards lose the interactive affordance
- Graduated opacity of teal: unnecessary complexity for the same effect
