# IMPLEMENTATION-PLAN-001 -- Visual Rebuild

**Date:** 2026-03-25
**Status:** In progress
**Goal:** Make this look like a real polished enterprise dashboard. Not a recreation of what shipped, but a vision of what could have been.

---

## Completed

- [x] Project scaffold (React + Recharts + Tailwind + Vite)
- [x] Investiture doctrine (VECTOR.md, CLAUDE.md, 5 ADRs, desk research, interview)
- [x] Three screens built (Asset Health, Asset Details, Trends)
- [x] Shell components (Sidebar, TopBar, NotificationsPanel)
- [x] Desaturated chart colors (ADR-002)
- [x] KPI sparklines + period-over-period context
- [x] Section headers between rows
- [x] Collapsible sidebar with labels (ADR-005)
- [x] Fixed notifications panel (no horizontal scroll)
- [x] Responsive card stacking
- [x] Figma gap analysis (FIGMA-REVIEW-001)

---

## Next Session -- START HERE

### 0. Interview Rob about the engineer's decision flow
Before touching any code, interview Rob about:
- What is the first question an engineer asks when they open the dashboard?
- What makes them decide to drill down vs move on?
- What action do they take when they find a problem?
- What information do they need to make that decision?
- What is the sequence of decisions from "how's my plant?" to "what do I do about it?"

Use the answers to redesign the layout around the decision chain, not around stakeholder metric requests. Every card earns its place by answering a specific question.

THIS MUST HAPPEN BEFORE ANY CODE CHANGES.

---

### 1. KPI cards polish
- Add colored left borders per metric (ADR-003)
- Tighten card sizing and padding
- Ensure sparklines render cleanly

### 2. Risk Matrix rebuild
- Interactive grid cells (not a table)
- Colored cells with hover states
- Priority gradient bar below
- Click to filter Asset Summary

### 3. Event Summary enhancement
- Large "Active Events: 100" callout number
- Event Summary / Case Summary toggle
- Better stacked bar styling

### 4. Asset Summary table enrichment
- Asset type subtitle under name
- Event timestamps ("Latest active event 2 mins ago")
- Teal link styling on asset names
- Left-border accent on hover (done)
- Chevron to indicate drill-down

### 5. Notifications panel rebuild
- Time range filter chips (Day/Week/Month/Year)
- Severity badges with counts at top
- Structured notification cards (title + body)
- "Go to Event Log" link

### 6. Top bar enhancements
- Date range selector
- "Last refreshed at..." timestamp
- Active Assets prominent display

### 7. Asset Details header
- Running status with green dot + duration
- Last shutdown timestamp
- Full tab bar (Asset Status active, others navigable)

### 8. Asset Details visual polish
- Match Figma Reliability/Maintenance/Performance layouts
- Run Status timeline with date labels and proper legend
- Work Orders Status/Type toggle
- Maintenance KPIs sizing
- Asset Specifications badges and dropdown

### 9. Trends screen polish
- Match chart styling to the overall dashboard feel
- Brush/zoom controls
- Threshold line styling

### 10. Overall polish
- Consistent card shadows and borders
- Background gradient refinement
- Micro-interactions and transitions
- Mobile view: simplified metrics for decisions on the go
- Loading/skeleton states

---

## Design Direction

This is NOT a 1:1 recreation of what shipped at Honeywell. This is Rob's
vision of what the dashboard should have been: storytelling over data density,
clear hierarchy, breathing room, and guided analytical flow from overview to
insight to action.

The Figma frames are reference for layout and interactions. The visual
language (dark theme, teal accent, desaturated palette, Inter font) is new.
