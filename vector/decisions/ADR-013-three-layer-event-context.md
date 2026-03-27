# ADR-013: Three-Layer Event Context System

**Date:** 2026-03-27
**Status:** accepted
**Deciders:** Rob Jones

## Context
The engineer needs to understand "why did my KPI drop?" at three different depths depending on the moment. No single UI element serves all three needs.

## Decision

### Layer 1: Impact Strip (glanceable, <1 second)
- Sits between KPI bar and Today's Activity on Plant Overview
- Full 12 columns, subtle background banner (not a card)
- Shows only events that moved KPIs (2-3 max)
- "K-101 tripped at 2:03 AM · Availability -12.1%"
- "See full timeline →" link navigates to dedicated Event Log page
- Ambient awareness: the engineer sees the cause without scrolling

### Layer 2: KPI Trend Modal (investigative, 10-30 seconds)
- Triggered by clicking any KPI card on the Plant Overview
- Modal shows the metric's trend line (24h or 7d)
- Event markers (dots) overlaid on the trend at exact timestamps
- Hover a dot → tooltip shows event details ("K-101 tripped · 2:03 AM")
- The engineer sees the value drop AND the cause on the same chart
- Similar to Grafana annotations but focused and contextual

### Layer 3: Event Log Page (full investigation, 1-5 minutes)
- Dedicated page/screen (not on Plant Overview)
- Accessed via "See full timeline →" link on the Impact Strip
- Full chronological event list with filtering by severity, type, asset, time range
- Serves as the shift handover summary (unsolved industry gap per DESK-RESEARCH-008)
- Shows ALL events: trips, alerts, work orders opened, maintenance windows, recalibrations

## Consequences
- Plant Overview is cleaner: no full timeline card taking a row
- Three depths match three cognitive modes: glance, investigate, deep dive
- The Impact Strip is a differentiator (no product does inline KPI-to-event linking)
- The KPI modal with event dots is a differentiator (Grafana-like but focused)
- The Event Log page can be as detailed as needed without bloating the overview
- "What Changed" section removed from Plant Overview, replaced by Impact Strip

### Revised Plant Overview Sections
1. Plant Health (KPIs)
2. Impact Strip (why KPIs changed)
3. Today's Activity (Work Orders + Investigations)
4. Assets Requiring Attention (Risk Matrix, Event Summary, Bad Actors)
5. All Assets (table)

## Alternatives Considered
- Full timeline on Plant Overview: too much scroll depth, redundant with strip + modal
- Events only in KPI modal: engineer has to click to discover what happened (violates glanceability)
- Events only on strip: not enough detail for investigation
