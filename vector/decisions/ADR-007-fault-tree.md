# ADR-007: Interactive Fault Tree in the Investigation Flow

**Date:** 2026-03-26
**Status:** accepted
**Deciders:** Rob Jones

## Context
Engineers use fault tree analysis to trace events through the asset hierarchy. The fault tree sits between Asset Details ("this asset is critical") and Trends ("show me the data"). It answers "why did this happen?" by showing the causal chain from top event down to root causes.

From INTERVIEW-002: "There is a fault tree that the engineers look at to see where the events and what they were based on the assets sub-assets, temperature, volume, vibration discrepancies."

## Decision
Build a simplified interactive fault tree as a React component. Top event node (asset trip) branches down through intermediate causes to root cause leaf nodes. Leaf nodes are clickable and navigate to Trends with the relevant attribute pre-selected and time range set around the event.

Structure:
- Top node: the triggering event (e.g., "Compressor Trip, K-101, 2:00AM")
- Intermediate nodes: failure modes (Bearing Failure, Surge Event, Oil Pressure Drop)
- Leaf nodes: specific attribute deviations (Vibration 4.2mm/s, Temp +12F, Surge Margin 8.3%)

Color coding:
- Critical nodes: critical color with glow
- Warning nodes: warning color
- Normal nodes: muted

Interactions:
- Hover node: border brightens to accent, connected path lines highlight
- Click leaf node: navigate to Trends for that attribute
- Expand/collapse branches (optional for cleaner initial view)

## Consequences
- Completes the investigation flow: Asset Details > Fault Tree > Trends
- Shows causal thinking, not just data display
- Engineers can visually trace from symptom to root cause
- Leaf nodes are contextual links into Trends (pre-filled attribute + time range)
- Mobile: tree scrolls horizontally or collapses to an indented list view

## Alternatives Considered
- Skip fault tree entirely: saves build time but misses a key investigation tool
- Static image: doesn't demonstrate interaction design
- Third-party tree library (D3, react-flow): heavy dependency for a portfolio demo
