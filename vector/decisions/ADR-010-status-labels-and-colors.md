# ADR-010: Status Labels and Colors

**Date:** 2026-03-26
**Status:** accepted
**Deciders:** Rob Jones

## Context
The dashboard needs to communicate KPI health states clearly without conflicting with asset criticality terminology (A/B/C/D) and without relying on color alone (WCAG SC 1.4.1).

## Decision

### Labels (action-oriented)
- **Normal:** No label. ISA-101 dark and quiet. Absence of indicator = healthy.
- **Warning:** "Monitor" -- tells the engineer to watch this, don't ignore it.
- **Critical:** "Action Required" -- tells the engineer to intervene now.

### Icons (distinct shapes, no directional confusion)
- **Warning:** Solid inverted triangle ▼ (amber)
- **Critical:** Solid diamond ◆ (red)
- Both are filled geometric shapes from the same family. Different from delta arrows (which have tails).

### Colors (Pairing 1)
- **Error/Critical:** #f47174 (coral-red, warm, urgent but not neon)
- **Warning:** #e8914f (true amber, caution not alarm, distinct hue from red)
- **Success:** #42be65 (Carbon default, unchanged)
- **Normal values:** White (text-primary)

### Value coloring
- Normal: white
- Warning: amber (--color-warning)
- Critical: red (--color-error)
- The icon + text label ensures color is never the sole channel.

### Delta
- Always text-secondary (neutral). Delta answers "what changed" not "is this good or bad."
- The health indicator handles judgment. Avoids doubling alarm colors.

## Consequences
- "Monitor" and "Action Required" tell engineers what to do, not just what's wrong
- No conflict with asset criticality A/B/C/D terminology
- Three visual channels per status: icon shape + color + text label
- Colors are warm and professional on dark backgrounds
- Normal state is visually quiet, problems pop
