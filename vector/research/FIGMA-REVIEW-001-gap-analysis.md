# FIGMA-REVIEW-001 -- Gap Analysis: Figma Frames vs Current Build

**Date:** 2026-03-25
**Status:** Complete
**Scope:** Comparing Rob's actual Honeywell APM Figma designs against the React recreation to identify missing patterns, interactions, and visual details.

---

## Screens Reviewed

1. Asset Health (light theme)
2. Asset Health (dark theme)
3. Asset Details (light theme)

---

## Gaps Found

### Asset Health -- KPI Cards

**Figma:** Each KPI card (OEE, Availability, Performance, Quality) has a distinct colored left border (OEE=blue, Availability=red, Performance=orange, Quality=teal). The color gives each metric its own identity at a glance.

**Current build:** Cards have hover outlines but no colored left border. All cards look identical until hovered.

**Fix:** Add a 3px left border to each KPI card using a per-metric accent color. Keep the hover outline interaction on top of this.

---

### Asset Health -- Risk Matrix

**Figma:** A proper grid with colored cells (red gradient for High priority, orange for Medium, green for Low). Cells are interactive squares with numbers inside. Has "View" and "Asset Priority" controls above. A gradient priority bar below (High to Low with colored segments).

**Current build:** A basic HTML table with colored backgrounds. Missing the priority bar below. Missing interactive click behavior to filter the Asset Summary table.

**Fix:** Rebuild as a clickable grid. Add the priority gradient bar below. Wire click to filter Asset Summary. Add hover state on cells.

---

### Asset Health -- Event Summary

**Figma:** Has a prominent "Active Events: 100" large number callout next to the chart. Radio toggle between "Event Summary" and "Case Summary" views. Stacked bar with colored legend showing count and percentage per segment.

**Current build:** Has the stacked bar and legend but no large callout number and no view toggle.

**Fix:** Add the Active Events count prominently. Add the Event Summary / Case Summary toggle (even if Case Summary is a placeholder).

---

### Asset Health -- Bad Actors

**Figma:** Horizontal bar chart with a colored priority gradient bar below (High to Low). Bar colors differentiate by priority. "Asset Name" x-axis label visible.

**Current build:** Has the bar chart but missing the priority gradient bar. Bar colors use criticality but not exactly matching.

**Fix:** Add the priority gradient bar below. Match the color scheme.

---

### Asset Health -- Asset Summary Table

**Figma:** Rich rows showing: Asset Name (blue clickable link), Asset Type below the name, status badge (Critical with red, Warning), priority label, OEE percentage, Active Events count + "Latest active event 2 mins ago" timestamp, Repetitive Events count + timestamp, Downtime hours, Work Orders count, RUL value. Much more information density per row.

**Current build:** Simpler rows with just the core metrics. Missing asset type subtitle, missing timestamps on events, missing the link styling on asset names.

**Fix:** Add asset type subtitle under name. Add "Latest active event X ago" timestamps. Style asset name as a teal link. Add chevron or arrow icon to indicate clickability.

---

### Asset Health -- Notifications Panel

**Figma:** Full panel with: filter chips (Day/Week/Month/Year), status filter checkboxes, severity badges with colored dots and counts (Critical: X, Warning: X, etc.). Each notification card has a title (bold), body text, badge type, timestamp. "Go to Event Log" link at top.

**Current build:** Basic notification list with dot + text. Missing time range filters, status filters, severity badges, and structured card layout.

**Fix:** Add time range filter chips. Add severity type badges with counts at the top. Structure notification cards with title + body.

---

### Asset Health -- Top Bar

**Figma:** Shows "HONEYWELL FORGE | Asset Reliability" branding (we replace with unbranded). Has a "Date: Today" selector with dropdown. "Last Refreshed at 01/18/2024 at 02:17 PM EST" with refresh icon. Active Assets "90/92" with colored denominator.

**Current build:** Has plant name and breadcrumb but missing date selector, last refreshed timestamp, and the formatted active assets display.

**Fix:** Add date range selector (even if non-functional). Add "Last refreshed" timestamp. Format Active Assets prominently.

---

### Asset Details -- Header

**Figma:** Shows asset ID "C-1655B" with a red "CRITICAL" badge, "Running" status with green dot, "Running: 12h 56m" duration, "Last Shutdown: 10/04/2024 02:00:29 PM EST" timestamp. Tab navigation across top: Asset Status, HMI Graphic, Fault Tree, Performance View, Trends, Attribute Overview, Event Management, More.

**Current build:** Basic header with asset name and type. Missing the running status, duration, last shutdown, and full tab navigation.

**Fix:** Add running status with duration. Add last shutdown timestamp. Add the tab bar (Asset Status is the active view we show, others can be placeholder or navigable).

---

### Asset Details -- Reliability Row

**Figma:** Bar chart showing Availability, Performance, Utilization with colored bars and values. Labeled "Reliability" section. Uses green/orange/red bars.

**Current build:** Has this but may need color matching.

**Fix:** Match colors to Figma. Ensure the chart header matches.

---

### Asset Details -- Run Status

**Figma:** Timeline chart labeled "RUN STATUS (AUG '24)" with date labels across top (Aug 5, Aug 9, Aug 13, Aug 17, Aug 21, Aug 27). Legend shows Event Types: Breakdown (red), Error (orange), Planned (blue), Standby (yellow), News (gray), Run Status (green line). Clear visual separation between running and not-running states.

**Current build:** Has a run status timeline but with different visual treatment. May need color and label updates.

**Fix:** Match the timeline labeling and legend to Figma. Add date labels across the top.

---

### Asset Details -- Downtime Events Summary

**Figma:** Doughnut chart with large "17" center count. Legend shows Count (%) and Time (%) columns. Uses distinct colors per sub-asset.

**Current build:** Has doughnut but may need the dual-column legend format.

**Fix:** Add Count and Time percentage columns to the legend.

---

### Asset Details -- Work Orders

**Figma:** Large "124" center count in the doughnut. Legend shows: Open-Scheduled, Open-Unscheduled, Closed, On Hold with counts and percentages. Has "Status" and "Type" tab toggle.

**Current build:** Has doughnut and legend. Missing the Status/Type toggle.

**Fix:** Add Status/Type toggle.

---

### Asset Details -- Maintenance KPIs

**Figma:** Three spark line charts: MTBF, MTTR, PM Compliance. Each with date labels on X axis (Mar '24, Jun '24, Sep '24, Dec '24). Clear trend lines.

**Current build:** Has spark charts but much smaller. May need better sizing and date labels.

**Fix:** Size up the spark charts. Add date labels.

---

### Asset Details -- Performance Table

**Figma:** Columns: Attribute Name, Asset Name, Actual Value, Expected Value, UOM, Deviation. Has "Performance View" link in the header. Deviation column shows colored values.

**Current build:** Has this table. May need the Performance View link.

**Fix:** Add "Performance View" link that navigates to Trends.

---

### Asset Details -- Asset Specifications

**Figma:** Card with "Generic Information" dropdown selector. Shows: Service, Process Units, Asset Criticality (with colored badge), Asset Status (with colored badge), Asset Type Name, Asset Class, Driver Type Name, FMEA BP Version.

**Current build:** Has the key-value list but missing the dropdown selector and colored badges.

**Fix:** Add colored badges for criticality and status. Add the dropdown selector.

---

## Priority Order for Fixes

1. KPI card colored left borders (quick, high visual impact)
2. Asset Summary table enrichment (asset type, timestamps, link styling)
3. Risk Matrix as interactive grid with priority bar
4. Event Summary large callout + toggle
5. Notifications panel with filters and severity badges
6. Asset Details header (running status, tabs)
7. Date selector and last refreshed in top bar
8. Run Status timeline refinement
9. Work Orders Status/Type toggle
10. Asset Specifications badges and dropdown
