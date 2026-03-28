# DESK-RESEARCH-014: Event Summary Card Visualization

**Date:** 2026-03-28
**Status:** Complete
**Scope:** How to visualize alarm quality (confirmed/false positive/new) and case workflow (assigned/in progress) in a small dark-theme card. Supports Event Summary card redesign.

---

## Key Findings

### Replace the stacked bar
A single horizontal stacked bar is the weakest option for a small card with one group and 2-3 categories. Industry tools (DynAMo, Yokogawa CAMS, Exida, PAS) use either donut charts or KPI number tiles for alarm quality summaries. Stacked bars only appear in analytical detail views comparing across multiple groups.

### Event Quality view: donut or KPI numbers
- ISA-18.2 / EEMUA 191 favor headline numbers with thresholds, not complex charts
- Yokogawa CAMS and PAS PlantState use donut charts for alarm classification breakdown
- Donut works at 300px width (minimum ~140px diameter for 3 segments)
- Alternative: 3 KPI numbers with thin proportional micro-bars beneath each

### Case Status view: KPI numbers, not a chart
- Only 2-3 categories (Assigned / In Progress / possibly Resolved)
- ITSM tools (ServiceNow, PagerDuty, Jira) use KPI number tiles for this
- 2 categories doesn't justify a chart -- just show the numbers
- Colored status indicators (dots or left-border accents) differentiate categories

### Two views should use different chart types
- Event quality is proportional (part-of-whole) -- donut is appropriate
- Case status is counts -- numbers are appropriate
- Carbon Design System: "Choose chart types based on the data relationship, not visual consistency"

### View switching: segmented control
- Carbon "content switcher" pattern
- Not radio buttons (too form-like) or tabs (implies different content, not different views)
- Two options: "Event Quality" and "Case Status" (or "Alarm Quality" per DESK-RESEARCH-010)

### Dark theme at 300px
- Carbon guidance: prefer legibility in small containers. Show numbers when the user needs numbers.
- Donut works with saturated high-contrast colors on dark backgrounds
- Total count in donut center is the standard pattern

## Sources
ISA-18.2 Section 11, EEMUA 191, Carbon Design System chart guidance, Honeywell DynAMo, Yokogawa CAMS, Exida, PAS PlantState, ServiceNow, PagerDuty, Stephen Few "Show Me the Numbers", Kosara & Skau 2016 IEEE VIS.
