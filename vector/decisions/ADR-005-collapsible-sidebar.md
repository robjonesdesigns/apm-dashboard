# ADR-005: Collapsible Sidebar Navigation

**Date:** 2026-03-25
**Status:** accepted
**Deciders:** Rob Jones

## Context
The original Honeywell product used tabs across the top, which was a last-minute stakeholder decision. This created a double-tab problem on Asset Details (top nav tabs + Asset Details section tabs). An icon-only sidebar (64px) solves the double-tab problem but creates a new one: the icons alone are not recognizable without labels. Rob could not identify what the icons meant.

## Decision
Collapsible sidebar that starts at 64px (icons only) with a toggle button to expand to ~200px showing icon + label. The expanded state lets the user confirm what each icon means. The collapsed state preserves screen real estate for the dashboard content.

The sidebar replaces the top-level tab navigation entirely. Asset Details keeps its own tab row (Asset Status, HMI Graphic, Fault Tree, Performance View, Trends, Attribute Overview, Event Management) as the only tab bar in the interface.

## Consequences
- No double-tab problem
- Engineers can learn the icons, then collapse for more space
- The toggle button must be obvious (not hidden)
- Icons need to be intuitive enough that most users only expand once to confirm
- Sidebar state should persist (remember collapsed/expanded)
- On mobile/narrow screens, sidebar collapses to icons automatically

## Alternatives Considered
- Icon-only sidebar with tooltips: faster but tooltips require hover (not mobile friendly)
- Top tabs (original): creates double-tab problem on Asset Details
- Left panel always expanded: wastes horizontal space on data-dense dashboards
