# INTERVIEW-001 -- Rob Jones APM Product Walkthrough

**Date:** 2026-03-25
**Status:** Complete
**Interviewee:** Rob Jones (UX Designer, Honeywell APM 2022-2025)

---

## Product Overview

Honeywell's Asset Performance Management platform. Used by reliability and maintenance engineers at industrial operators (oil and gas, chemical manufacturing, power generation). Target customers include companies like Shell.

Rob spent three years on the platform. Owned Asset Health redesign, Asset Details ground-up design, and a compressor performance dashboard for the Performance Suite.

---

## Engineer Workflow (as described by Rob)

### Entry Point
Engineer logs in (authorization), lands on a plant selection page (this was never fully decided). Selects a plant. Lands on Asset Health (or an overview page).

### Asset Health (Plant Overview)

**Top metrics:**
- OEE, Availability, Performance, Quality (all percentages)
- Each is clickable to see trends
- Rob designed affordances: hover changes background color + outline around the card to pique interest. Tested against no-affordance variant.
- Also shows: number of Trains, Active Assets out of Total Assets

**Three analysis cards:**
1. Risk Matrix: Asset Priority (High/Medium/Low) vs Event Status (New/In Progress) and Event Summary showing Asset Criticality (Safety, Major Process, Minor Process, Negligible) vs severity (Critical to Minor)
2. Event Summary: stacked bar graph of Confirmed, False Positives, and New Events with legend and percentages
3. Bad Actors: bar graph showing top assets and number of events per asset

**Asset Summary table:**
- Columns: Status, Priority, OEE, Active Events, Repetitive Events (indicates chattering, may not be real issues), Downtime, Work Orders, Remaining Useful Life
- All metrics were requirements from stakeholders
- Filterable by Risk Matrix selection and Bad Actors
- Can jump to Work Orders or Cases flow through contextualized links
- Drill down to individual asset navigates to Asset Details

**Notifications panel:**
- Opens and filters to events specific to the asset clicked
- Used throughout the app (consistent pattern)

### Asset Details (Single Asset Deep Dive)

Three rows (the three-level IA Rob designed):

**Row 1: Reliability**
- Bar graph: Availability, Performance, Utilization metrics
- Run Status: timeline showing On (top of graph) and Off (bottom of graph)
  - Rob made this more accessible with icons AND colors AND shapes for event types
  - Height of line represents on/off state (position encoding)
- Downtime Event Summary: doughnut chart by sub-asset showing events per sub-asset

**Row 2: Maintenance**
- Bad Actors: same as Asset Health but with sub-assets instead of top-level assets
- Work Orders: doughnut chart (Open, Scheduled, Unscheduled, Closed, On Hold)
- Maintenance KPIs: MTBF, MTTR, PM Compliance, each with spark charts (small line graphs)

**Row 3: Performance**
- Performance table: Attribute Name, Asset Name, Value, Expected Value, Unit of Measure, Deviation
- Asset Specifications: Service, Process Unit, Asset Criticality, Status, Type Name, Class
- Notifications panel for that specific asset

### Navigation
- Tabs across the top (last-minute decision, stakeholders didn't want a left panel)
- Could dive in contextually throughout the app
- Double-tab problem: tabs on top for main navigation + tabs within Asset Details would create confusion

### Trends
- Separate view accessible from Performance card
- Deep dive into asset attributes
- Compare attributes on separate graphs or overlay them on one graph
- Shows what is occurring with specific measurements over time

---

## Stakeholder Dynamics (as described by Rob)

"Stakeholders just wanted a ton of data in a small space when it should have been broken down to tell the full story and deep dive in that way."

"With stakeholders they all want different things and are all rethinking everything so it is complicated and things just get thrown on the board and it gets to the point where you just need to compromise or else you will be doing this balancing act of trying to meet the user needs with research and making everyone happy."

"Research does not really change their minds. They all want something else and it is tunnel vision."

The tab navigation was a last-minute decision because stakeholders didn't want a left side panel. This created the double-tab problem on Asset Details.

---

## Gap Period (2023-2024, ~5-6 months)

Between the APM dashboard work and the Warehouse Operations platform, Rob worked
on an executive-level operations platform. It was designed for leadership above the
plant engineer level to monitor KPIs across multiple plants and facilities. An
eagle-eye view of the entire operation rather than a single plant.

The product never got traction. The team was in between two senior directors during
this period with no clear leadership or direction. Rob describes it as "a blur."
This is not included in the portfolio case study because there is nothing concrete
to show from it, but it is part of the three-year timeline at Honeywell.

---

## Product Tiers

- Asset Health and Asset Details: part of the base APM product
- Compressor Performance dashboard (load analysis, surge detection, efficiency curves): part of a higher tier for more specialized asset monitoring
- Executive operations platform (cross-plant KPI monitoring): never shipped, no traction

---

## Design Decisions Rob Made

1. KPI card affordances (hover state with background + outline) -- tested against no affordance
2. Run Status accessibility (position + color + shape, not color alone)
3. Three-level IA for Asset Details as compromise between tabs and single page
4. Used existing Forge design system cards for the three-level layout
5. More color usage in the redesign (original was mostly red)
6. Reorganized KPI hierarchy in Asset Health
7. Fixed broken affordances in Asset Health redesign
