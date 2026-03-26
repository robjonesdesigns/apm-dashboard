# ADR-006: Fluid Typography with clamp()

**Date:** 2026-03-26
**Status:** accepted
**Deciders:** Rob Jones

## Context
Fixed font sizes snap between breakpoints. Dashboard content needs to scale smoothly across desktop monitors, tablets, and mobile. KPI numbers must remain scannable at any size. Body text must stay readable without being too tight on small screens.

## Decision
Use CSS clamp() for all type tokens larger than 14px. Fixed sizes for body-sm, labels, and meta (already small, don't benefit from scaling). Mobile minimums bumped above the mechanical minimum to keep data-critical elements scannable.

Bumped minimums:
- body: 13px min (12px was too tight)
- kpi: 24px min (must be scannable on mobile)
- kpi-lg: 30px min
- callout: 26px min

## Consequences
- Text scales fluidly without breakpoint snaps
- KPI values remain scannable on mobile
- Body text stays readable at all viewport widths
- Portfolio recordings (desktop) show full-size type
- Mobile case order view is viable with these minimums

## Alternatives Considered
- Fixed sizes with media query steps: works but creates visible snapping
- Viewport units (vw) without clamp: uncontrolled, can get too small or too large
- Fixed sizes only: simpler but doesn't demonstrate responsive thinking in portfolio
