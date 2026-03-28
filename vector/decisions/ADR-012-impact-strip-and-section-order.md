# ADR-012: Impact Strip and Revised Section Order

**Date:** 2026-03-27
**Status:** accepted
**Deciders:** Rob Jones

## Context
The engineer sees Availability at 78.4% (Action Required) but has no way to know WHY from the KPI card alone. They have to scroll past Today's Activity to find the timeline, mentally connect the K-101 trip to the KPI drop, then scroll back to check if someone is working on it.

No mainstream product (Grafana, Datadog, Honeywell Experion) shows "why this KPI changed" inline. ISA-101 recommends a persistent alarm banner but does not link it to KPI tiles. This is a genuine design gap.

## Decision

### Impact Strip
A timeline card between the KPI bar and Today's Activity. Full 12 columns. Rendered in a standard `.card` container (consistent with all other dashboard sections per Nielsen H4). Shows only events that moved KPIs as major dots, with minor events as connective tissue between them.

Section title: "Key Events"

- 2-3 major events maximum, telling a narrative arc (trigger, consequence, confirmation)
- "See full timeline →" link at bottom right

This bridges the gap: KPI → why → who's working on it.

### Revised Section Order
1. Plant Health (KPIs) → "something is wrong"
2. Impact Strip → "this is what caused it"
3. Today's Activity (WOs + Investigations) → "is anyone handling it?"
4. What Changed (full timeline) → investigation, shift handover log
5. Assets Requiring Attention → risk matrix, bad actors
6. All Assets → drill-down table

### Summary Strip + Full Timeline: NOT Redundant
Per ISA-101 and every industrial HMI system, these serve different moments:
- Strip: ambient awareness, <1 second glance
- Timeline: investigation, 30-60 seconds of analysis

## Consequences
- The engineer's mental flow matches the section order
- KPI drops are connected to causes without scrolling
- Today's Activity has context before the engineer reads it
- The "What Changed" timeline serves as a shift handover summary (unsolved industry gap)
- The Impact Strip is a portfolio differentiator (no product does this inline)

## Alternatives Considered
- Moving "What Changed" above Today's Activity: takes too much space as a full card
- Adding "caused by K-101" text to the KPI card: too much information for a small card
- Removing the full timeline (redundant with strip): ISA-101 says keep both, different purposes
