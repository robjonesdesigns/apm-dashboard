# ADR-015: Risk Matrix Redesign -- Two Views with Click-to-Filter

**Date:** 2026-03-27
**Status:** Accepted
**Relates to:** ADR-012 (section order), ADR-013 (three-layer event context), DESK-RESEARCH-010 (analysis cards), DESK-RESEARCH-012 (event assignment status)

---

## Context

The Risk Matrix sits in section 4 ("Assets Requiring Attention") after the engineer has seen what happened (Impact Strip) and what's being worked on (Today's Activity). The question at this point: "What else is out there that hasn't been handled, and how do I prioritize it?"

The original Figma showed three views via dropdown: Asset Priority, Event Status, and Event Summary (4x5 Criticality x Severity grid).

## Decisions

### Single Event Status view (revised 2026-03-28)
Originally planned two views (Event Status + Asset Priority) with segmented control. Revised to single Event Status view:
- Asset Priority is redundant with Plant Health KPIs above and is contained within Event Status (sum each column)
- Event Summary (4x5 Criticality x Severity) too sparse with 10 demo assets
- Single view = simpler card, no toggle, less cognitive load

Layout: priority on x-axis (High/Medium/Low, left to right), status on y-axis (New/In Progress, top to bottom). "Asset Priority" label below columns for disambiguation.

### "New / In Progress" over "Assigned / Unassigned"
Per DESK-RESEARCH-012: "New/In Progress" aligns with Splunk ITSI, ServiceNow, and PagerDuty conventions. "Assigned/Unassigned" is not a lifecycle state in any system reviewed -- it's an orthogonal filter attribute on lists. Using it as a matrix axis would conflate the alarm domain with the work management domain.

### No view switcher needed
Single view eliminates the need for any toggle/dropdown/segmented control.

### Click-to-filter interaction
Established pattern in Power BI, Essential ERM, and dashboard best practice. Clicking a cell:
1. Highlights it (teal border + teal-tinted background)
2. Filters the Asset Table below to matching priority
3. Clicking same cell again deselects (clears filter)
4. Single-cell selection only

Affordance: `<button>` elements with pointer cursor + teal border on hover. No hint text needed -- the cursor change + border is sufficient for engineers who expect interactive cells in matrices.

### Switching views clears selection
Prevents stale filter state when the matrix layout changes. The engineer sees fresh data in each view.

## Consequences

- Risk Matrix is now a filter control for the Asset Table, not a standalone visualization
- Asset Table must accept a `riskFilter` prop and filter its rows
- Data model changes: `RISK_MATRIX` export becomes an object with `eventStatus` and `assetPriority` arrays
- The matrix answers "what needs me" (Event Status default) with "how bad is it overall" (Asset Priority) as secondary context
