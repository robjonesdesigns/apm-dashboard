# ADR-001: Dark Theme for APM Dashboard

**Date:** 2026-03-25
**Status:** accepted
**Deciders:** Rob Jones

## Context
The dashboard recreation needed a visual direction distinct from Honeywell's branded product. Enterprise monitoring dashboards are viewed for hours per shift by engineers.

## Decision
Dark theme with teal/cyan accent. Blue reserved for informational semantic states.

## Consequences
- Reduced eye strain for extended viewing (aligns with real-world use case)
- Data visualizations have higher contrast and visual impact on dark backgrounds
- Differentiates visually from Keytrn (light theme) in the portfolio
- Chart colors must be desaturated to prevent bleeding on dark surfaces
- Requires careful attention to text contrast ratios

## Alternatives Considered
- Light theme: safer but generic, doesn't differentiate from Keytrn in portfolio
- Match Honeywell's theme: NDA prevents using their exact visual language
