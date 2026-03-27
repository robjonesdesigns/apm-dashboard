# DESK-RESEARCH-008 -- Event Context and Activity Patterns

**Date:** 2026-03-27
**Status:** Complete
**Scope:** How enterprise dashboards connect KPI drops to causes, whether summary + timeline is redundant, and what makes excellent work order cards.

---

## Key Findings

### 1. Summary strip + full timeline is NOT redundant
Every industrial HMI system (Honeywell Experion, Emerson DeltaV, ABB 800xA, Yokogawa) shows BOTH:
- Persistent alarm banner/strip: 1-3 most critical items, always visible, glanceable (<1 second)
- Full alarm list/timeline: complete chronological log, for investigation (30-60 seconds)

ISA-101 codifies this: persistent alarm banner + alarm summary page. Different cognitive needs. The strip catches attention; the log supports investigation.

IT monitoring follows the same pattern: Grafana (alert panel + annotation overlays), Datadog (monitor summary + event stream), Splunk ITSI (swimlane + event table).

**Decision: Keep both. Summary strip below KPIs, full timeline further down.**

### 2. No product shows "why KPI changed" inline -- this is a differentiator
- Grafana: annotations overlay on charts, but no automatic correlation
- Datadog: Watchdog attempts automatic root cause, but shows it in a separate panel
- Industrial HMI: alarm banner has no contextual link to KPI tiles
- OSIsoft PI Vision: event frames bracket time periods on trends, closest to inline context

**Design opportunity:** A context strip below the KPI bar that says "K-101 tripped at 2:03 AM · Availability -12.1%" is ahead of what any mainstream product does. This would be a portfolio differentiator.

### 3. Work order cards should show the triggering event
Maximo, SAP, ServiceNow all bury the "why was this WO created" in the detail screen. No product shows the originating alert/event inline on the work order list card.

**Design opportunity:** Show triggering event as secondary text on each WO row: "WO-4481 · Bearing inspection → triggered by vibration alert at 2:00 AM"

### 4. Separate Work Orders from Investigations
Every enterprise product separates them (Maximo, SAP, ServiceNow). Different record types, different workflows, different status lifecycles. A unified "activity feed" loses workflow context.

**Decision: Keep separate cards. Already implemented correctly.**

### 5. Shift handover is an unsolved industry gap
No mainstream dashboard product has a first-class "what happened last shift" widget. Plants use paper forms, Word docs, or expensive eLogbook products. The Chemical Safety Board has cited shift handover failures in incident investigations.

**Design opportunity:** The "What Changed" timeline IS a shift handover summary. Framing it as such in the case study is a strong talking point.

---

## Revised Section Order

Based on the research, the engineer's flow is:
1. Plant Health (KPIs) → "something is wrong"
2. Impact Strip → "THIS is what caused it" (bridge between KPI and work orders)
3. Today's Activity → "is anyone handling it?" (now has context)
4. What Changed → full event timeline for investigation
5. Assets Requiring Attention → risk matrix, bad actors
6. All Assets → drill-down table

The Impact Strip is the differentiator. It does what no other product does: connects the KPI drop to the specific event inline.

---

## What the Impact Strip Should Show

- Full 12 columns, subtle background (not a card, a contextual banner)
- Only events that moved KPIs (not all events)
- Format: "[asset icon] K-101 tripped at 2:03 AM · Availability -12.1%"
- Maybe 2-3 events max
- "See full timeline →" link at the end
- Visual treatment: subtle error-bg or accent-bg background, no border, no elevation

---

## Sources
- ISA-101.01-2015 (alarm banner recommendations)
- ISA-18.2 (alarm management)
- Honeywell Experion PKS alarm display patterns
- Emerson DeltaV alarm bar + alarm list
- ABB 800xA alarm line pattern
- Grafana annotations + alert panels
- Datadog Watchdog + event overlays
- Splunk ITSI notable events
- IBM Maximo Start Center patterns
- SAP PM notification/work order separation
- ServiceNow activity stream vs task list
- Carbon Design System structured list
