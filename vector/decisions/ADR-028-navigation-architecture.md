# ADR-028: Navigation Architecture -- Plant-Level Sidebar, Asset-Level Drill-Down

**Status:** Accepted
**Date:** 2026-03-30

## Context

The sidebar originally listed seven screens: Plant Overview, Events, Asset Inspection, Fault Tree, Trends, Work Orders, Investigations. Three of these (Asset Inspection, Fault Tree, Trends) are asset-scoped -- they require an asset context to render meaningful content. Clicking these sidebar links with no asset selected creates a dead-end.

The original Honeywell product solved this with a double-sidebar pattern: one sidebar for screens, another for an asset tree (plant > asset > sub-asset). This is clunky -- two navigation columns consuming horizontal space before the engineer sees any data.

## Research

**Engineer decision flow (INTERVIEW-002):** The 10-step decision chain is a linear drill-down: Orient (Plant Overview) > Detect > Identify (Asset Table row click) > Investigate (Asset Inspection) > Deep Dive (Trends, Fault Tree) > Act (Work Orders). The engineer never cold-opens a Fault Tree or Trends view without first identifying a specific asset.

**ISA-101 (ADR-005, research doc):** "Minimize impact of secondary tasks such as display navigation." Asset detail is L3 in the 4-level hierarchy. Navigating between fragmented asset-scoped screens is a secondary task that competes with the primary task of investigation.

**Single-page decision (project research doc):** Tufte ("no such thing as information overload, only bad design"), Few (fragmenting data into separate screens is a common dashboard mistake), Hollifield/HP-HMI (density with hierarchy is good). All support keeping asset-scoped information on a single scrollable page rather than split across sidebar destinations.

**IBM Maximo v9.0:** "A single page from which to conduct an investigation and take an action." Scores at top, then details, then predictions, then timeline, then maintenance history. No separate sidebar links for each section.

## Decision

### Sidebar shows only plant-level screens

The sidebar is reduced to four items:

| Screen | Route ID | Description |
|--------|----------|-------------|
| Plant Overview | `overview` | Plant KPIs, incidents, work in progress, asset table |
| Events | `events` | Full event timeline across all assets |
| Work Orders | `workorders` | All work orders, filterable by asset |
| Investigations | `investigations` | All investigations, filterable by asset |

### Asset-scoped views live inside Asset Inspection

Asset Inspection is a single scrollable page (ADR unchanged) accessed by clicking an asset row in the Asset Table. It contains all asset-scoped sections:

1. Asset Header
2. KPI Strip
3. Active Events (filtered TIMELINE)
4. Sub-Asset Tree
5. Event Timeline (full history)
6. Work Orders and Investigations (filtered)
7. Degradation Trends (conditional, data-dependent)
8. Fault Tree (conditional, data-dependent)
9. Performance Attributes (conditional, data-dependent)

Sections 7-9 render only when data exists (e.g., K-101 has fault tree and degradation data; R-301 does not). This means healthy assets show a calm, short page and troubled assets show a dense, long page -- ISA-101 "dark and quiet" by default, rich when needed.

### Asset Inspection is not in the sidebar

There is no sidebar link for Asset Inspection. The entry point is always a row click in the Asset Table (Plant Overview section 5). This eliminates the "no asset selected" dead-end and matches the engineer's drill-down flow.

If the engineer is on the Asset Inspection page and wants to switch assets, they click the back link to return to Plant Overview and select a different asset row.

### Removed sidebar items

| Removed | Reason |
|---------|--------|
| Asset Inspection | No meaningful plant-level view; always requires asset context |
| Fault Tree | Becomes a section within Asset Inspection; only renders for assets with fault tree data |
| Trends | Becomes a section within Asset Inspection; always tied to a specific asset's sensor history |

## Consequences

- Sidebar is shorter and every link always works regardless of application state
- No dead-end screens, no "select an asset first" placeholder pages
- Asset investigation flow is uninterrupted -- scroll, don't navigate
- Conditional sections mean each asset's page density reflects its health state
- Engineers who want Fault Tree or Trends for a specific asset drill down through the Asset Table, matching their actual workflow
- Work Orders and Investigations remain plant-level screens because engineers need cross-asset views for shift handover and workload planning; these screens can optionally filter to a single asset via URL parameter or filter chip

## Related

- ADR-005: Collapsible sidebar navigation
- ADR-008: Screen naming
- ADR-009: Sidebar and notifications panel mutual exclusion
- ADR-012: Impact Strip and section order
- ADR-013: Three-layer event context
- INTERVIEW-002: Engineer decision flow (10-step chain)
- Project research: Single-page design decision (Tufte, Few, ISA-101, Hollifield)
