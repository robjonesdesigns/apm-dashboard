# ADR-008: Portfolio-Friendly Screen Names

**Date:** 2026-03-26
**Status:** accepted
**Deciders:** Rob Jones

## Context
The original Honeywell product uses industry terminology (Asset Health, Asset Details, Fault Tree). A hiring manager reviewing the portfolio may not understand what these screens do from the name alone. The portfolio's primary audience (PER-001) spends 45-90 seconds per case study. Names must be self-explanatory.

## Decision
Rename screens to describe what the user is doing, not the technical diagram type:

| Industry term | Portfolio name | Why |
|--------------|---------------|-----|
| Asset Health | Plant Overview | Says what it shows, not a domain term |
| Asset Details | Asset Inspection | Implies action (inspecting), not just viewing |
| Fault Tree | Root Cause Analysis | Says what you are doing, not the diagram type |
| Trends | Trends | Already clear |
| Work Orders | Work Orders | Already clear |
| Cases | Investigations | Clearer than "Cases" for non-engineers |

## Consequences
- Hiring managers understand every screen's purpose without domain knowledge
- Engineers would still recognize the screens by their layout and content
- Sidebar labels are immediately readable
- Navigation is self-documenting

## Alternatives Considered
- Keep industry terms: accurate but alienates non-engineer portfolio reviewers
- Use both (industry term + plain subtitle): clutters the nav
