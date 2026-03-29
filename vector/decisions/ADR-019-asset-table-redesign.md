# ADR-019: Asset Table Redesign

**Status:** Accepted
**Date:** 2026-03-28

## Context

The Asset Table had 9 columns with inconsistent data sourcing. Work order counts were hardcoded per asset and didn't match the WORK_ORDERS dataset. There was no filtering, searching, or sorting. Column headers were truncated and lacked sort affordance.

## Decision

### Columns (9 total)

Status | Asset | Criticality | OEE | Events | Downtime | Work Orders | Investigations | RUL

- **Events**: single `activeEvents` count (was three columns: New/In Progress/Repetitive)
- **Work Orders**: derived from `WORK_ORDERS` by `assetId` (was hardcoded `asset.workOrders`)
- **Investigations**: new column, derived from `INVESTIGATIONS` by `assetId`
- **RUL**: industry acronym for Remaining Useful Life. Header shows "RUL" with native tooltip for the full term.

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

### Unified Needs Action Filter Integration (ADR-023)

All three Needs Action cards filter the Asset Table on click (stackable AND filters):
- **Event Triage**: clicking a cell filters by criticality + status (New = `newEvents > 0`, In Progress = `inProgressEvents > 0`)
- **Alarm Quality**: clicking a donut segment filters by event validation status
- **Watch List**: clicking a bar row filters to that specific asset

Filter chips appear in both the source card header and Asset Table toolbar. Clearable from either location. "Clear all" link appears when 2+ filter sources are active.

### Layout

- Column dividers: `rgba(57, 57, 57, 0.5)` -- 50% opacity of row dividers
- Cell padding: 16px horizontal each side
- Row padding: 12px vertical
- Asset column is flexible (`flex: 1`) to fill available width
- Header and data cells share identical layout via `COL_STYLES` (single source of truth)
- Header row has matching 2px transparent borderLeft for alignment with data rows

## Rationale

- Three event sub-columns (New/In Progress/Repetitive) were confusing without a group header. "New" could mean work orders or investigations. Collapsed to single Events count (activeEvents = newEvents + inProgressEvents per ADR-021) -- the Event Triage filter handles the breakdown.
- Derived counts from WORK_ORDERS and INVESTIGATIONS ensure numbers match the card summaries.
- Always-visible sort arrows follow Carbon/Ant pattern -- engineers don't have time to hover-discover affordances.
- Inattentional blindness: filter chip in both locations + smooth scroll ensures the user sees the effect of clicking Event Triage.
