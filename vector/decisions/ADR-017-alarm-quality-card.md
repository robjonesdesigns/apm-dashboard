# ADR-017: Alarm Quality Card Redesign

**Date:** 2026-03-28
**Status:** Accepted
**Relates to:** ADR-012 (section order), DESK-RESEARCH-010 (analysis cards), DESK-RESEARCH-014 (event summary visualization)

---

## Context

The Event Summary card used a stacked horizontal bar chart to show Confirmed/False Positives/New events. DESK-RESEARCH-014 found this is the weakest visualization for a small card with one group and 2-3 categories. The card sits in the "Event Analysis" section alongside Event Triage and Bad Actors.

The card serves two purposes:
1. Alarm quality -- "Can I trust the alarms?" (Confirmed vs False Positives vs New)
2. Case workflow -- "Is the team acting on confirmed events?" (Assigned vs In Progress)

## Decisions

### Rename to "Alarm Quality"
Per DESK-RESEARCH-010 recommendation. "Event Summary" is vague. "Alarm Quality" tells the engineer exactly what this card measures.

### Alarm Quality view: donut chart
- 3 segments: Confirmed, False Positives, New
- Total count centered in the donut
- Matches Yokogawa CAMS and PAS PlantState patterns for alarm classification
- Donut is readable at 300px card width (minimum ~140px diameter for 3 segments)
- Part-of-whole ratio is the primary message, which donut communicates better than bars

### Case Status view: KPI number tiles
- Only 2 categories (Assigned / In Progress) -- doesn't justify a chart
- Large numbers with colored status indicators
- Matches ITSM conventions (ServiceNow, PagerDuty)
- Per DESK-RESEARCH-014: "2 categories almost never worth a chart"

### Different chart types for each view
- Per Carbon Design System: "Choose chart types based on the data relationship, not visual consistency"
- Alarm Quality is proportional (part-of-whole) -- donut
- Case Status is counts -- numbers

### Segmented control for view switching
- Per Carbon "content switcher" pattern
- Two options: "Alarm Quality" / "Case Status"
- Not chips (those are non-interactive labels elsewhere) or radio buttons (too form-like)

## Consequences

- EventSummary.jsx renamed/rewritten
- Recharts BarChart replaced with donut (Recharts PieChart or custom SVG)
- Cases data needed in assets.js
- Segmented control CSS already exists in global.css
