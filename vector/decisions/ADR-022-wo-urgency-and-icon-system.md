# ADR-022: Work Order Urgency System and Icon Differentiation

**Status:** Accepted
**Date:** 2026-03-28

## Context

Badge.jsx used Critical/High/Medium/Low for both event severity and work order priority. Same component, same colors, same labels. Engineers couldn't distinguish event severity from WO priority at a glance.

Additionally, investigation status (Investigating/Open) used filled/hollow circle dots inside neutral badge pills, which created visual overlap with other indicators.

## Decision

### Work Order Urgency (replaces WO priority)

Three urgency levels with distinct terminology from event severity:

| Urgency | Meaning | Data mapping |
|---------|---------|-------------|
| Emergency | Drop everything, safety/production risk | Was: critical |
| Urgent | Schedule within this shift | Was: high |
| Scheduled | Planned maintenance window | Was: medium + low (collapsed) |

**Rationale for collapsing medium + low:** On Plant Overview, the maintenance manager doesn't distinguish "routine" from "planned." Both mean "has a window, not reactive." The distinction matters on the Work Orders detail screen, not here.

**Rationale for different vocabulary:** "Emergency/Urgent/Scheduled" is standard CMMS language that communicates scheduling urgency. "Critical/High/Medium/Low" communicates danger level. Using different words prevents conflation even when seen out of context.

### Data change

WO field renamed from `priority` (critical/high/medium/low) to `urgency` (emergency/urgent/scheduled).

### Five-system icon language

| System | Component | Shape | Color | Context |
|--------|-----------|-------|-------|---------|
| Event severity | Badge.jsx | Tally bars in colored pill | Red/amber/blue | Events, notifications |
| Investigation status | InvestigationStatus (TodaysActivity) | Right-pointing triangles, filled/hollow | Neutral gray | Investigations card |
| WO urgency | WoPriority.jsx | Circles: filled/hollow/clock | Neutral gray | Work Orders card |
| Asset criticality | CriticalityIndicator.jsx | Letter grade pill (A/B/C/D) | Status colors | Asset Table, Inspection |
| Asset status | Inline (AssetTable) | Small colored dots + text | Status colors | Asset Table |

### WoPriority visual treatment

Icon + neutral text. No pill, no tally bars, no color coding.
- Emergency: filled circle ● + "Emergency" in --color-text-secondary
- Urgent: hollow circle ○ + "Urgent" in --color-text-secondary
- Scheduled: clock icon ◷ + "Scheduled" in --color-text-secondary

Fill hierarchy communicates urgency through visual weight alone (ISA-101 compliant, WCAG SC 1.4.1 compliant).

### Investigation status visual treatment

Icon + neutral text. No badge pill.
- Investigating: filled right-pointing triangle ▸ + "Investigating" in --color-text-secondary
- Open: hollow right-pointing triangle ▹ + "Open" in --color-text-secondary

Triangle direction (right-pointing) signals forward progress. Filled = active, hollow = waiting.

### Summary line pattern

Both cards use the same layout: count outside, indicator next to it.
- Work Orders: `2 ● Emergency . 1 ○ Urgent . 22 ◷ Scheduled`
- Investigations: `3 ▸ Investigating . 5 ▹ Open`

## Alternatives considered

### Chevrons (>> / > / —)
Rejected. Research found chevrons mean navigation/expand in enterprise UI, movement direction in military symbology. No CMMS precedent. Hard to distinguish at 12px. See DESK-RESEARCH-015.

### Color-coded WO badges (same as events but muted)
Rejected. Even with different saturation, color creates semantic overlap with event severity.

### P1/P2/P3 numeric labels
Rejected. Adds a translation layer. "Emergency" is immediately understood; "P1" requires knowing the scale.

## Research

See DESK-RESEARCH-015 for full iconography research including military, logistics, CMMS, and ISA-101 sources.
