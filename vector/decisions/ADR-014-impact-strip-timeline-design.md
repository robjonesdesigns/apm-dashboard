# ADR-014: Impact Strip Timeline Visual Design

**Date:** 2026-03-27 (revised)
**Status:** accepted
**Deciders:** Rob Jones

## Context
The Impact Strip (ADR-012/013 Layer 1) is a horizontal timeline inside a card. It shows KPI-impacting events as major dots with persistent labels, and non-impacting events as minor dots with hover tooltips. The design must be glanceable (<1 second), tell a narrative, and match enterprise dashboard conventions.

## Decision

### Major events (KPI-impacting)
- Large dots (10px), colored by severity (error/warning/success/info)
- Evenly spaced along the solid track
- Top 3 by impact, selected to tell a three-act narrative: trigger, consequence, confirmation
- Details visible below each dot: time, asset name, event description (truncated at 50 chars), KPI impact
- Focusable buttons with aria-labels; focus/hover ring matches dot severity color (3px bg gap + 2px colored ring)

### Three-act narrative structure
Major events are curated to tell a story, not just listed chronologically:
1. **Trigger** -- the initiating event (e.g., K-101 trip, Availability -12.1%)
2. **Consequence** -- the immediate system response (e.g., ESD completed, OEE -5.9%)
3. **Confirmation** -- the moment that changes the engineer's morning plan (e.g., bearing damage confirmed, RUL revised to 5 days)

### Minor events (non-impacting)
- Small dots (6px visual, 30px hit area for accessibility)
- Muted gray, brightens on hover
- Temporally positioned between adjacent major events using segment-relative math
- Tooltip on hover/focus: time, asset name, event description
- Connective tissue -- shows what happened between the major beats without cluttering

### Timeline track layout
- **Solid line**: spans 0% to ~82% of card width, connecting all dots
- **Dashed continuation line**: spans from last major dot (~82%) to card right edge, at 50% opacity
- The dashed line signals "the day continues" and anchors the "See full timeline →" link below it
- All dots (major and minor) are positioned within the solid track width only

### Label alignment
- **All labels left-aligned** under their respective dots
- Each label block is absolutely positioned with `left` matching its dot's percentage
- Each label block's width spans from its dot position to the next dot (last one spans to 100%)
- This supersedes the earlier L/C/R position-aware pattern (DESK-RESEARCH-009) because:
  - The track no longer spans the full card width, so there is no overflow at the right edge
  - Left-alignment is more readable (Ling & van Schaik research, Wexler dashboard guidance)
  - All labels scan consistently without the rightmost label fighting reading flow

### Section title
"Key Events" -- chosen over "Impact Events", "Recent Events", and "Plant Health Events" for clarity and brevity.

### Container
Standard `.card` with `overflow: visible` (tooltips extend beyond card boundary). Consistent with all other dashboard sections per Nielsen H4.

### "See full timeline →" link
- Right-aligned at card bottom, below the dashed continuation line
- Navigates to the Events screen (ADR-013 Layer 3)
- Always visible (not conditional on event count)

### Responsive
- Desktop (>672px): horizontal timeline with 3 major events
- Mobile (<672px): vertical stack, major events only, connector lines between dots

## Consequences
- The timeline reads as a narrative, not just a chronological list
- Left-aligned labels are consistently scannable
- The dashed continuation line communicates "more happened" without adding content
- The 82% track width gives the last label room to breathe
- Minor dots provide density signal without cluttering the headline story
- The engineer sees trigger → consequence → confirmation in one glance
- "See full timeline →" is visually anchored to the continuation line

## Alternatives Considered
- **Full-width track with L/C/R alignment**: right-aligned text on last label fights reading flow
- **Tooltip-only (no persistent labels)**: industry standard but not scannable; defeats the purpose of glanceable context
- **All center-aligned labels**: clips at edges, requires overflow hacks
- **Two major events only**: no narrative arc, too sparse
