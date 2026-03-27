# ADR-011: Priority Badge Color Hierarchy

**Date:** 2026-03-27
**Status:** accepted
**Deciders:** Rob Jones

## Context
Work order and investigation cards show priority as badge pills. The color hierarchy needs to match the severity without overusing alarm colors. Low priority items should not compete visually with critical ones.

## Decision

### Work Order Priority Badges
| Priority | Badge color | Rationale |
|----------|-------------|-----------|
| Critical | Red (badge-error) | Earned alarm state. Tied to K-101 trip. |
| High | Amber (badge-warning) | Urgent but not emergency. |
| Medium | Blue (badge-info) | Scheduled, not urgent. |
| Low | Gray (neutral) | Routine. Does not need attention now. |

Visual intensity decreases with each step: red screams, gray whispers.

### Investigation/Case Status Badges
All investigation statuses use neutral gray badges regardless of status (Investigating, Open, Closed). The status is a workflow state, not a severity. The ASSET criticality provides the semantic context, not the case status.

### Investigation Status Dots
- Investigating: filled dot (solid) -- someone is actively working
- Open: unfilled dot (hollow circle) -- waiting, nobody started

The fill state communicates progress without relying on color.

## Consequences
- Low priority visually quiet (ISA-101 "dark and quiet")
- Alarm colors reserved for actual urgency (ADR-010)
- Gray badges for Low and Investigation statuses are consistent
- The filled/unfilled dot pattern adds a progress channel without color
- One click target per work order row: the WO ID/task navigates to WO detail page
- Asset navigation happens from within the WO detail page, not the overview card

## Alternatives Considered
- All priorities in semantic colors: Low in green felt like "good" not "low priority"
- Lines/bars inside badges: too small at 12px to distinguish 3 from 4 segments
- Two click targets per row (WO + asset): competing affordances, confusing
