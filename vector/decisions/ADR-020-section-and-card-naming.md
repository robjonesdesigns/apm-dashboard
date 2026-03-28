# ADR-020: Section and Card Naming (Requires Attention)

**Status:** Accepted
**Date:** 2026-03-28
**Supersedes:** ADR-012 section naming for section 4 ("Assets Requiring Attention" -> "Event Analysis" -> "Requires Attention")

## Context

Session 12 named section 4 "Event Analysis" as an umbrella for Risk Matrix, Alarm Quality, and Bad Actors. Session 13 revisited: "Analysis" was a stretch for triage, and the card names created redundancy and ambiguity.

## Decision

### Section 4: Requires Attention

Replaces "Event Analysis". Matches the original ADR-012 intent ("Assets Requiring Attention") and the 7 AM engineer workflow: "what needs me today?"

### Card names under Requires Attention

1. **Event Triage** (was Risk Matrix, then Event Triage under "Event Analysis")
   - Grid: criticality (A/B/C) x investigation status (New/In Progress)
   - Clickable cells filter Asset Table

2. **Alarm Quality** (unchanged)
   - SVG donut: confirmed / false positive / new (unvalidated)
   - Segmented control and Case Status view removed (Case Status was duplicate of Investigations card data)
   - "New" in donut = unvalidated signal (different from "New" in Event Triage = unassigned investigation)

3. **Watch List** (was Bad Actors)
   - Assets with recurring failures over 30 days
   - "Bad Actors" is an industry term but reads negatively out of context
   - "Watch List" matches the reliability manager's mental model

### Full section order

1. Plant Health
2. What Happened
3. Current Response
4. Requires Attention
5. Assets

## Rationale

- "Requires Attention" is action-oriented, matching what the reliability manager thinks at 7 AM
- "Event Triage" is no longer redundant under a non-Event umbrella
- Alarm Quality is a recognized ISA-18.2 term that reliability engineers know
- Case Status was removed because Investigations card in Current Response already covers open/investigating counts with correct terminology
