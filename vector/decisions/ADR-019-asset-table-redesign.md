# ADR-019: Asset Table Redesign

**Status:** Accepted
**Date:** 2026-03-28

## Context

The Asset Table had 9 columns with inconsistent data sourcing. Work order counts were hardcoded per asset and didn't match the WORK_ORDERS dataset. There was no filtering, searching, or sorting. Column headers were truncated and lacked sort affordance.

## Decision

### Columns (9 total)

Status | Asset | Criticality | OEE | Events | Downtime | Work Orders | Investigations | Remaining Life

- **Events**: single `activeEvents` count (was three columns: New/In Progress/Repetitive)
- **Work Orders**: derived from `WORK_ORDERS` by `assetId` (was hardcoded `asset.workOrders`)
- **Investigations**: new column, derived from `CASES` by `assetId`
- **Remaining Life**: renamed from "RUL" (spelled out, not truncated)

### Toolbar

- **Left**: filter chips (Event Triage chip from Risk Matrix + any active dropdown filters)
- **Right**: search field (filters by asset name/ID) + Filter button with dropdown
- Filter dropdown has three categories with multi-select checkboxes: Criticality, Status, Process Unit
- Active selections appear as chips on the left with x to dismiss

### Sorting

- Every column header is sortable (click to sort ascending, click again for descending)
- Always-visible sort affordance: stacked up/down arrows at 30% opacity on every header
- Active sort: direction arrow goes full opacity in teal, header text turns teal
- Hover: header text brightens to primary

### Filter Chip (shared component)

`FilterChip.jsx` -- used in both Event Triage card and Asset Table. 26px height, accent border, x to dismiss.

### Event Triage Integration

- Clicking a cell in Event Triage scrolls to Asset Table and applies filter
- Filter chip appears in both Event Triage header and Asset Table toolbar
- Clearable from either location
- Filters by criticality AND investigation status (New = `newEvents > 0`, In Progress = `inProgressEvents > 0`)

### Layout

- Column dividers: `rgba(57, 57, 57, 0.5)` -- 50% opacity of row dividers
- Cell padding: 16px horizontal each side
- Row padding: 12px vertical
- Asset column is flexible (`flex: 1`) to fill available width
- Header and data cells share identical layout via `COL_STYLES` (single source of truth)
- Header row has matching 2px transparent borderLeft for alignment with data rows

## Rationale

- Three event sub-columns (New/In Progress/Repetitive) were confusing without a group header. "New" could mean work orders or investigations. Collapsed to single Events count -- the Event Triage filter handles the breakdown.
- Derived counts from WORK_ORDERS and CASES ensure numbers match the card summaries.
- Always-visible sort arrows follow Carbon/Ant pattern -- engineers don't have time to hover-discover affordances.
- Inattentional blindness: filter chip in both locations + smooth scroll ensures the user sees the effect of clicking Event Triage.
