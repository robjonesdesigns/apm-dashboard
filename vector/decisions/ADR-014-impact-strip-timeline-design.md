# ADR-014: Impact Strip Timeline Visual Design

**Date:** 2026-03-27
**Status:** accepted
**Deciders:** Rob Jones

## Context
The Impact Strip (ADR-012/013 Layer 1) needs to look like a timeline, not just a text banner. It shows KPI-impacting events prominently and non-impacting events as subtle markers.

## Decision

### Major events (KPI-impacting)
- Large dots (8-10px), colored by severity (error/warning/success)
- Evenly spaced along the timeline (timestamps provide temporal context)
- Details visible below each dot: asset name, event description, KPI impact badge
- Top 3 by impact magnitude

### Minor events (non-impacting)
- Small dots (4-6px), muted gray
- Temporally positioned between the major events they fall between
- Proportional to actual time gaps (shows clustering)
- Tooltip on hover: event name + time + "See full timeline for details"
- No visible details below (only on hover)

### Timeline line
- Thin horizontal line connecting all dots
- Color: border-subtle
- Desktop: horizontal
- Mobile (<672px): vertical stack (same data, list format)

### Spacing
- Major events: evenly spaced (readable rhythm)
- Minor events: temporal position between adjacent major events (density signal)

### Responsive
- Desktop (>1056px): horizontal, 3 major events
- Tablet (672-1056px): horizontal, 2 major events (third in "See full timeline")
- Mobile (<672px): vertical timeline, all events stacked

### "See full timeline →" link
- Always visible at the end of the timeline
- Navigates to the Event Log page

## Consequences
- The strip visually reads as a timeline, not a text block
- Major events create the readable rhythm
- Minor dots show "a lot happened here" without cluttering
- Temporal clustering between major events is visible at a glance
- The engineer sees the key events AND senses the surrounding activity
- Mobile gracefully degrades to vertical stack
