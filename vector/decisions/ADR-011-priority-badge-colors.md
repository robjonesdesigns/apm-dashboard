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

### Investigation Status Icons
Superseded in part by ADR-022 (WO Urgency and Icon System). Investigation status uses right-pointing triangles in neutral gray (not circles, not colored):
- Investigating: filled triangle -- someone is actively working
- Open: hollow triangle -- waiting, nobody started

The fill state communicates progress without relying on color. See ADR-022 for the full five-icon-system taxonomy.

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
