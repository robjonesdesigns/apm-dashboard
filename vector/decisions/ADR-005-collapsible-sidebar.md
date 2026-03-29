# ADR-005: Collapsible Sidebar Navigation

**Date:** 2026-03-25
**Status:** accepted
**Deciders:** Rob Jones

## Context
The original Honeywell product used tabs across the top, which was a last-minute stakeholder decision. This created a double-tab problem on Asset Details (top nav tabs + Asset Details section tabs). An icon-only sidebar (64px) solves the double-tab problem but creates a new one: the icons alone are not recognizable without labels. Rob could not identify what the icons meant.

## Decision
48px icon-only rail that expands to 256px on hover (overlay, no content push). No toggle button -- hover-to-expand is faster and avoids a persistent UI element. The expanded overlay shows icon + label text. Shadow on expand signals the overlay nature.

The sidebar replaces the top-level tab navigation entirely. Seven screens: Plant Overview, Events, Asset Inspection, Fault Tree, Trends, Work Orders, Investigations. Settings at the bottom, separated by a divider.

On mobile: full-screen drawer triggered by hamburger menu in TopBar. Escape key closes it.

## Consequences
- No double-tab problem
- Engineers see labels on hover, saving horizontal space by default
- Overlay approach means content never shifts or reflowx
- Mobile drawer provides full navigation without competing for space
- Hover-to-expand does not work on touch -- mobile drawer handles this

## Alternatives Considered
- Icon-only sidebar with tooltips: faster but tooltips require hover (not mobile friendly)
- Top tabs (original): creates double-tab problem on Asset Details
- Left panel always expanded: wastes horizontal space on data-dense dashboards
