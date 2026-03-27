# DESK-RESEARCH-007 -- Work Order and Case Card Patterns

**Date:** 2026-03-26
**Status:** Complete
**Scope:** How enterprise CMMS/APM dashboards display work order and investigation lists on overview dashboards.

---

## Key Findings

### Row layout
Two-line rows at 64-72px height. Line 1: WO ID (muted) + task description (bold). Line 2: asset, assignee, timestamp in muted text. Status pill right-aligned.

### Priority communication
Left-edge color stripe is the enterprise standard (ServiceNow, Maximo). Pills with text labels are the modern CMMS pattern (UpKeep, MaintainX). We use pills for accessibility (text label > color alone).

### Unassigned
NOT a warning state. It's normal workflow. Show as muted gray text or placeholder avatar. Only becomes urgent when combined with high priority + overdue. Changed from our original approach (amber warning).

### WO ID
Secondary to the task description. Show as small muted prefix: "WO-4481 · Bearing inspection"

### Cases vs work orders
Cases show: root cause status (Open/In Analysis/Root Cause Identified), linked work order count, severity (not priority), failure mode. Taller cards than work orders. Different icon (magnifying glass or folder).

### Summary header
Count in the card header: "Work Orders (4)". Optional segmented count below: "2 Critical · 1 High · 1 Medium"

### Hover
Subtle background tint + left accent border. Enterprise standard is restrained (4% opacity overlay).

### List length
Dashboard widgets show 4-6 items with "View All" link. Not the full list.

---

## Applied Decisions

| Element | Decision | Rationale |
|---------|----------|-----------|
| Priority | Pills with text (badge-error, badge-warning, badge-info) | Accessible, text label visible |
| Unassigned | Muted gray text, not amber warning | Normal workflow state per research |
| WO ID | Muted prefix before task description | Secondary info, not the hero |
| Row hover | Background tint + 2px left accent border | Consistent with Asset Summary table |
| Row height | ~64-72px, two-line layout | Standard enterprise density |
| Click | Asset name is clickable (teal), row itself is not | Clear affordance on the link |
| Header | Card title + count badge + segmented summary | "Work Orders" + (4) badge |

## Sources
- IBM Maximo Start Center patterns
- ServiceNow dashboard widgets
- SAP Fiori List Report pattern
- UpKeep, MaintainX, Fiix modern CMMS patterns
