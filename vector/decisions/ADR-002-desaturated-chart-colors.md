# ADR-002: Desaturated Chart Colors for Dark Mode

**Date:** 2026-03-25
**Status:** accepted
**Deciders:** Rob Jones

## Context
Raw Tailwind colors (#ef4444, #22c55e, #3b82f6) at full saturation bleed on dark backgrounds. They create visual noise and reduce readability. Professional dark dashboards (Grafana, Datadog) desaturate their palettes.

## Decision
Shift chart colors to desaturated variants for dark mode:
- Red: #ef4444 to #E57373
- Green: #22c55e to #81C784
- Blue: #3b82f6 to #64B5F6
- Amber: #f59e0b to #FFB74D
- Teal (accent): #2dd4bf stays (already appropriate saturation)

## Consequences
- Charts are easier to read against dark surfaces
- Colors still distinguishable from each other
- Semantic meaning preserved (red=critical, green=healthy)
- Must update tokens.js and global.css with new values

## Alternatives Considered
- Keep saturated colors: looks harsh and unprofessional on dark backgrounds
- Use only grays with accent: loses semantic color meaning for status
