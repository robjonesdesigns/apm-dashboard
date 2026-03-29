# ADR-023: Unified Needs Action Filter Pattern

## Status
Accepted

## Context
The Needs Action section contains three cards: Event Triage (Risk Matrix), Alarm Quality (donut chart), and Watch List (Bad Actors). Each had a different interaction pattern:

- **Risk Matrix**: clicked cells filtered the Asset Table with a chip and smooth scroll
- **Alarm Quality**: donut segments showed a tooltip on hover but did nothing on click
- **Watch List**: clicking a bar row navigated to Asset Inspection, leaving the page

Three cards side by side with three different interactions is confusing. The user expects consistency -- if one card filters the table, they all should.

## Decision
All three Needs Action cards use the same interaction pattern:

1. **Click to filter the Asset Table** (not navigate, not tooltip-only)
2. **Toggle behavior**: click the same element again to deselect
3. **Teal border on hover**, teal border + background on selected (consistent affordance)
4. **Filter chip in the card header** showing the active selection with an X to clear
5. **Filter chips in the Asset Table toolbar** matching the card header chips
6. **Smooth scroll to Asset Table** when a filter is applied
7. **Filters stack as AND**: clicking Risk Matrix + Alarm Quality + Watch List narrows results through all three simultaneously

### Filter logic per card

**Event Triage (Risk Matrix)**
- Two variables: criticality (A/B/C) and status (New/In Progress)
- Two separate filter chips, one for each variable
- Filters assets by criticality match AND event status

**Alarm Quality (donut)**
- Three segments: Confirmed, False Positives, New
- Confirmed -> assets with activeEvents > 0
- False Positives -> assets with repetitiveEvents > 0
- New -> assets with newEvents > 0

**Watch List (Bad Actors)**
- Bar rows filter to a single asset by assetId
- Replaces the previous navigate-to-inspection behavior

### Stacking example
Clicking "A + New" in Risk Matrix, then "False Positives" in Alarm Quality, then "K-101" in Watch List produces three filter chips that AND together: show only Criticality A assets with new events that have repetitive/false positive patterns and are specifically K-101.

## Consequences
- Consistent mental model: every card in Needs Action works the same way
- The Asset Table becomes the single source of truth for "what matches"
- Watch List no longer navigates -- users must click through the Asset Table row to reach Asset Inspection (one extra click, but consistent with the filter pattern)
- Filter chips are independently clearable, giving fine-grained control
