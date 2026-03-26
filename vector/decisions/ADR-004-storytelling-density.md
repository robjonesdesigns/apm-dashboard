# ADR-004: Storytelling Over Raw Data Density

**Date:** 2026-03-25
**Status:** accepted
**Deciders:** Rob Jones

## Context
Stakeholders at Honeywell pushed for maximum data density. Every metric they wanted got added to the dashboard. The result was information-rich but story-poor: an engineer could see every number but had to do the mental work of connecting them into meaning.

The portfolio recreation is an opportunity to show what the dashboard could have been with a storytelling approach: guiding the engineer's attention from overview to insight to action.

## Decision
Prioritize storytelling elements in the recreation:
- Large callout numbers that answer "how many?" before showing the breakdown
- Period-over-period context on KPIs ("compared to what?")
- Timestamps on events ("how recent?")
- Priority gradient bars that create visual hierarchy
- Interactive filtering that connects Risk Matrix to Asset Summary (cause to effect)

## Consequences
- The dashboard tells a story: "Here is your plant health. Here is what needs attention. Here is the specific asset. Here is what to do about it."
- Engineers get insight at a glance rather than just data at a glance
- The recreation shows Rob's design vision beyond what shipped (portfolio value)
- Some data density is traded for clarity. This is intentional.

## Alternatives Considered
- Match the shipped product exactly: accurate but misses the portfolio opportunity to show the vision
- Remove stakeholder additions entirely: dishonest about what the real product contained
