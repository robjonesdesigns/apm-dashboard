# DESK-RESEARCH-010: Analysis Cards (Risk Matrix, Event Summary, Bad Actors)

**Date:** 2026-03-27
**Scope:** Whether the three analysis cards on Plant Overview serve the 7 AM engineer workflow, and how to improve or replace them.

---

## Current State

Three cards sit in the "Assets Requiring Attention" section:

1. **Risk Matrix** -- colored grid (criticality x priority) with asset counts per cell. Click a cell to filter the Asset Table.
2. **Event Summary** -- stacked bar chart of events by type + large callout number.
3. **Bad Actors** -- horizontal bar chart of top 5 assets by event count.

## Research Findings

### Risk Matrix

**Problem:** A 4x4 or 5x5 colored grid with numbers in cells creates inattentional blindness. The engineer reads the red cell, ignores the rest. The count ("3 assets in critical/high") doesn't tell them *which* 3 assets. They have to click to find out.

**What engineers actually do at 7 AM:** They want a sorted list of "which assets need me today, in what order." Not a matrix. The matrix was designed for risk assessment workshops, not morning triage.

**Industry pattern:** Grafana, Datadog, and Splunk all use sorted tables or ranked lists for triage. The risk matrix pattern appears in safety engineering tools (Bow-Tie, HAZOP) but not in operational dashboards.

**Recommendation:** Replace with a per-asset status grid or ranked triage list. Each row = one asset, showing: status indicator, asset name, priority, last event, and a one-line summary. This is effectively a compact version of the Asset Table with only the "needs attention" rows. The filter interaction (click to drill) still works -- click a row to navigate to Asset Inspection.

**Alternative:** Keep the matrix visual but add inline expansion. Click a cell and the assets expand below the matrix in a mini-list. This preserves the portfolio demo value of the matrix interaction while solving the "which assets?" problem.

### Event Summary

**Problem:** A stacked bar of event types (alarm, warning, info) is visually interesting but doesn't answer a question Carlos would ask. "I had 47 events" doesn't help him prioritize. The total count is also redundant with the badge count on the notifications bell.

**What matters at 7 AM:** Not "how many events" but "how many were real problems vs noise." The confirmed-to-false-positive ratio is the alarm quality signal. If 40 of 47 events were false positives, that's a systemic issue worth surfacing.

**Industry pattern:** ISA-18.2 (alarm management) recommends tracking alarm metrics: standing alarm count, alarm rate (per hour), and confirmed/false-positive ratio. Honeywell's own Alarm Management module shows these.

**Recommendation:** Rename to "Alarm Quality." Show:
- Confirmed vs false positive ratio (simple donut or stacked bar)
- Alarm rate trend (sparkline, last 7 days)
- Standing alarm count (how many are currently active)

This reframes the card from "what happened" (redundant) to "how healthy is our alarm system" (unique insight).

### Bad Actors

**Problem:** A horizontal bar chart of "top 5 assets by event count" is redundant with the Asset Table, which shows the same data sortable by any column. The chart adds visual weight without adding insight.

**What matters:** Not "which asset had the most events today" but "which asset keeps causing problems repeatedly." A pump that trips once is different from a pump that trips every week. Repetitive events signal a systemic issue that maintenance hasn't resolved.

**Industry pattern:** "Repeat offender" or "chronic bad actor" analysis is a standard reliability engineering practice. It looks at a 30-day window, not today's events.

**Recommendation:** Replace with "Repeat Offenders." Show assets with the highest repetitive event count over 30 days, not today. Each row shows: asset name, repetitive event count (30 days), trend direction (getting worse or better), and last occurrence. This is genuinely different from the Asset Table and provides a reliability insight that doesn't exist elsewhere on the dashboard.

### Asset Table

**Current columns:** Status, Asset, Priority, OEE, Active Events, Repetitive Events, Downtime, Work Orders, RUL

**Problem:** Too many columns. At 7 AM, Carlos doesn't need Repetitive Events (that's what the Repeat Offenders card is for), Downtime (available on Asset Inspection), or Work Orders count (available in Today's Activity).

**Recommendation:** Trim to 7 columns:
1. Status (dot indicator)
2. Asset (name + type)
3. Priority (badge)
4. OEE (%)
5. Active Events (count)
6. Last Event (time + one-line description)
7. RUL (remaining useful life)

"Last Event" is new -- it answers "what happened most recently to this asset?" without requiring Carlos to open the notification panel.

### Impact Strip Enhancement (deferred)

**Recommendation:** Add a "+N" badge on major dots when there are downstream events. Click expands a mini-chain below showing the causal sequence. This connects the timeline to the analysis cards conceptually. Deferred to a future session.

---

## Summary

| Card | Current | Recommendation | Rationale |
|------|---------|----------------|-----------|
| Risk Matrix | Count grid | Per-asset triage list or inline expansion | Engineers need names, not counts |
| Event Summary | Stacked bar + total | Alarm Quality (confirmed/false ratio) | Reframe from "what happened" to "alarm health" |
| Bad Actors | Bar chart (today) | Repeat Offenders (30-day) | Chronic problems, not today's noise |
| Asset Table | 9 columns | 7 columns + "Last Event" | Remove redundant, add actionable |
