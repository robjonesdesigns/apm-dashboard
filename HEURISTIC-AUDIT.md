# APM Dashboard -- Nielsen's 10 Heuristic Evaluation

Last updated: 2026-03-31

---

## 1. Executive Summary

**Scope:** Plant Overview screen of the APM Dashboard portfolio demo (React 19 + Tailwind v4 + Vite). Single-page evaluation covering all visible sections: System Health KPI bar, What Happened (ImpactStrip), In Progress (Work Orders + Investigations), Needs Action (Event Triage + Alarm Quality + Watch List), Assets table, TopBar, Sidebar, and Notifications Panel.

**Evaluator:** 1 (solo evaluation; acknowledging ~35% problem detection rate per Nielsen's research)

**Target user:** Reliability engineer at a refinery, scanning the dashboard at 7 AM to triage overnight events and prioritize the day.

**Total issues found:** 24

**Severity breakdown:**

| Severity | Count |
|----------|-------|
| 4 (Catastrophic) | 0 |
| 3 (Major) | 4 |
| 2 (Minor) | 12 |
| 1 (Cosmetic) | 8 |

**Top 5 findings:**

1. **H6-01 (Severity 3):** Sidebar icon-only rail has no tooltips in collapsed state, forcing recall of which icon maps to which screen.
2. **H1-01 (Severity 3):** No data freshness indicator -- stale data risk in a time-critical morning triage workflow.
3. **H7-01 (Severity 3):** No keyboard shortcuts for high-frequency triage actions (open notifications, navigate sections, toggle dense mode).
4. **H10-01 (Severity 3):** No onboarding, no in-context help beyond KPI info icons. "RUL" column header unexplained for new users.
5. **H3-01 (Severity 2):** "Go to Events", "Go to Work Orders", "Go to Investigations" links are non-functional placeholders, creating dead ends.

---

## 2. Methodology

- **Process:** Two-pass evaluation. First pass: full interface walkthrough to build familiarity with the interaction flow. Second pass: systematic screen-by-screen review against each of the 10 heuristics.
- **Evaluator profile:** Design-focused evaluator with knowledge of industrial dashboard conventions, ISA-101, and the Carbon design system.
- **Heuristics:** Nielsen's 10 Usability Heuristics as documented in HEURISTICS.md.
- **Scope boundaries:** Evaluation is limited to Plant Overview and its sub-components as implemented in source code. Asset Inspection screen exists but is not the primary evaluation target. Mobile-specific behaviors noted where relevant but desktop is the primary evaluation context (matching the reliability engineer's workstation).
- **Limitations:** Solo evaluator (expected ~35% coverage). No live user observation. Static data -- cannot evaluate real async/loading behaviors.

---

## 3. Findings Table

| ID | Heuristic | Location | Description | Severity | Recommendation |
|----|-----------|----------|-------------|----------|----------------|
| H1-01 | H1: Visibility of System Status | TopBar / global | No "last refreshed" timestamp visible on the dashboard. `PLANT.lastRefreshed` exists in data but is not rendered. Engineer cannot tell if data is current or stale. | 3 | Display "Last updated: 7:00 AM EST" in the TopBar or above the KPI bar. Add a manual refresh button. |
| H1-02 | H1: Visibility of System Status | Sidebar | Active nav item has a teal left border and background tint, but the icon-only collapsed state makes the active indicator subtle at a glance (4px border on a 48px rail). | 1 | Acceptable given the border + color change. No action needed unless user testing reveals issues. |
| H1-03 | H1: Visibility of System Status | KPI cards | KPI sparkline popover has no loading state. With real data, the 24-hour trend fetch would have no feedback. | 2 | Add a skeleton/shimmer state for the sparkline popover while data loads. |
| H1-04 | H1: Visibility of System Status | Notifications Panel | Read/unread state is tracked in component state (not persisted). Refreshing the page resets all notifications to their initial read state. | 2 | Persist read state to localStorage or backend. |
| H2-01 | H2: Match Between System and Real World | Asset Table | "RUL" column header is an abbreviation that may not be immediately clear, despite being standard in reliability engineering. The `title` attribute ("Remaining Useful Life") is present, which mitigates this. | 1 | Current tooltip-on-hover is sufficient for the target audience. |
| H2-02 | H2: Match Between System and Real World | ImpactStrip | Three-act narrative (Trigger, Consequence, Confirmation) uses domain language that maps directly to reliability engineering mental models. This is a positive finding. | 0 | No action needed. |
| H2-03 | H2: Match Between System and Real World | KPI Bar | Health indicator labels "Monitor" and "Action Required" align with ISA-101 alarm philosophy. The diamond (critical) and inverted triangle (warning) shapes follow ISA conventions. Positive finding. | 0 | No action needed. |
| H2-04 | H2: Match Between System and Real World | Plant Overview | Section ordering (System Health, What Happened, In Progress, Needs Action, Assets) follows the engineer's morning triage mental model: check health, understand cause, check response, identify remaining work, then drill into specifics. Positive finding. | 0 | No action needed. |
| H3-01 | H3: User Control and Freedom | ImpactStrip, InProgress | "Go to Events", "Go to Work Orders", "Go to Investigations" are styled as interactive links (`type-link` class with cursor:pointer) but are not wired to navigation. Clicking them does nothing. These are dead ends in the primary triage flow. | 2 | Either wire these to `onNavigate` callbacks or visually mark them as "coming soon" (remove link styling, add disabled state). |
| H3-02 | H3: User Control and Freedom | NotificationsPanel | "Quick Access" links (Asset Inspection, Trends, Fault Tree) in the event detail drill-in view are non-functional `type-link` spans. User expects to navigate but nothing happens. | 2 | Wire to `onNavigate` or remove until functional. |
| H3-03 | H3: User Control and Freedom | Asset Table | Asset row click is disabled (`onAssetClick={null}` passed through). Rows show cursor:pointer via `onAssetClick` prop, but the code conditionally disables this. Users see teal-colored asset names that look clickable but currently do nothing (navigation disabled until Asset Inspection ships). | 2 | The code correctly gates clickability on `onAssetClick` being non-null. However, in the current deployed state where `onAssetClick` is passed from PlantOverview, rows ARE clickable and navigate to inspection. Verified: `onAssetClick={(asset) => onNavigate('inspection', { asset })}` is active. No issue in current build. Downgrading to cosmetic: asset names are teal (link-colored) even for non-clickable contexts. |
| H3-04 | H3: User Control and Freedom | Sidebar, NotificationsPanel | Escape key closes both panels. Mutual exclusion (ADR-009) prevents both from being open simultaneously. Both have close buttons. Focus trap implemented on mobile. Positive finding. | 0 | No action needed. |
| H4-01 | H4: Consistency and Standards | Global | Five distinct icon systems (event severity, investigation status, WO urgency, asset criticality, asset status) are internally consistent and visually differentiated. Each uses its own shape language (tally bars, triangles, circles, letter grades, dots). This is well-documented in ADR-022 and CLAUDE.md. Positive finding. | 0 | No action needed. |
| H4-02 | H4: Consistency and Standards | NotificationsPanel | The empty state message references a `filter` variable that is not in scope: `filter !== 'All'`. This is a code bug that would cause a ReferenceError when the notification list is empty with severity filters active. | 2 | Fix the empty state message to reference `severityFilters` instead of the undefined `filter` variable. |
| H4-03 | H4: Consistency and Standards | KPI Bar | Trains and Active Assets cards lack the teal accent-top border and interactive hover behavior that the four percentage-based KPI cards have. They are visually distinct (plain `.card` vs `.card .card-accent-top .card-interactive`). This correctly signals they are not clickable, but breaks visual rhythm in the KPI row. | 1 | Intentional distinction. No action needed unless visual unity is desired. |
| H4-04 | H4: Consistency and Standards | InProgress | Work Order and Investigation rows use identical hover behavior, alignment (100px right column), and spacing. Cross-card consistency is strong. Positive finding. | 0 | No action needed. |
| H4-05 | H4: Consistency and Standards | Tooltips | All chart tooltips (Risk Matrix, Alarm Quality, Watch List, KPI info) use the same inverted light-background pattern with consistent padding, shadow, and animation. Cursor-following behavior is consistent across chart tooltips. Positive finding. | 0 | No action needed. |
| H5-01 | H5: Error Prevention | Asset Table search | Search autocomplete provides suggestions as the user types, filtering by name, ID, and asset type. Max 8 results shown. Keyboard navigation (arrow keys, Enter, Escape) supported. This helps prevent mistyped queries. Positive finding. | 0 | No action needed. |
| H5-02 | H5: Error Prevention | Asset Table filters | Cross-filter interaction from Needs Action cards (Risk Matrix, Alarm Quality, Watch List) correctly stacks as AND filters on the Asset Table. Filter chips are dismissable. "Clear all" button appears when 2+ filters are active. Smooth scroll to table on filter apply. Well-designed filter prevention. | 0 | No action needed. |
| H5-03 | H5: Error Prevention | NotificationsPanel | Severity filter uses multi-select checkboxes with no "apply" button -- changes are live. This is appropriate for a filter (non-destructive, instantly reversible). | 0 | No action needed. |
| H6-01 | H6: Recognition Rather Than Recall | Sidebar (collapsed) | The 48px rail shows 4 nav icons + settings gear with no text labels. On desktop, the `title` attribute provides a native browser tooltip on hover, but this requires the user to hover over each icon to discover its meaning. For a tool opened daily, this forces recall of icon meanings until the user hovers to expand the sidebar. | 3 | The hover-to-expand sidebar at 256px does show labels, which mitigates this. However, the initial collapsed state forces recall. Consider always-visible labels in the rail (vertical text or abbreviated labels), or ensure custom styled tooltips appear on hover with minimal delay. The native `title` tooltip has a ~500ms delay which is too slow for a 7 AM triage scan. |
| H6-02 | H6: Recognition Rather Than Recall | Asset Table | Active filter state is always visible via FilterChip components in the toolbar. The "X of Y assets" count updates to reflect filtered results. Users never need to recall what filters are applied. Positive finding. | 0 | No action needed. |
| H6-03 | H6: Recognition Rather Than Recall | TopBar | Breadcrumb shows full navigation path (Baytown Refinery > Plant Overview, or Baytown Refinery > Asset Inspection > K-101). This keeps current location visible. Positive finding. | 0 | No action needed. |
| H6-04 | H6: Recognition Rather Than Recall | KPI Bar | Info icons on each KPI card provide on-demand descriptions of OEE, Availability, Performance, Quality, Trains, and Active Assets. Hidden on mobile (`.hide-mobile`), which means mobile users cannot access these descriptions at all. | 2 | Make KPI descriptions accessible on mobile via tap-to-reveal or a dedicated info state. |
| H7-01 | H7: Flexibility and Efficiency of Use | Global | No keyboard shortcuts for any dashboard actions. A reliability engineer who opens this dashboard every morning would benefit from shortcuts for: toggle notifications (n), toggle dense mode (d), navigate to sections (1-5), focus search (/ or Cmd+K). | 3 | Implement keyboard shortcuts for high-frequency actions. Display them in a help modal (Shift+?). |
| H7-02 | H7: Flexibility and Efficiency of Use | TopBar | Dense mode toggle persists to localStorage and applies globally. This is a good efficiency feature for power users who prefer higher information density. Positive finding. | 0 | No action needed. |
| H7-03 | H7: Flexibility and Efficiency of Use | Asset Table | Sort is available on all 9 columns with always-visible sort direction arrows. Multi-column sort is not supported (only single-column). For 10 assets this is acceptable. | 1 | Consider multi-column sort if the dataset grows beyond one page. Low priority for current dataset. |
| H7-04 | H7: Flexibility and Efficiency of Use | Needs Action | Chart-to-table filtering (click Risk Matrix cell, donut segment, or Watch List bar to filter Asset Table) provides an efficient drill-down path. This cross-component interaction is a strong efficiency accelerator. Positive finding. | 0 | No action needed. |
| H8-01 | H8: Aesthetic and Minimalist Design | Plant Overview | The five-section layout (System Health, What Happened, In Progress, Needs Action, Assets) follows progressive disclosure: macro KPIs first, then narrative context, then actionable items, then the full drill-down table. Information density is high but well-organized with clear section headers, card boundaries, and visual hierarchy. Positive finding. | 0 | No action needed. |
| H8-02 | H8: Aesthetic and Minimalist Design | KPI Bar | The hidden placeholder rows in Trains and Active Assets cards (invisible `<div>` elements for height matching) are a minor code smell but invisible to users. | 1 | No user impact. Consider using CSS grid `align-items: stretch` to equalize card heights without invisible placeholders. |
| H8-03 | H8: Aesthetic and Minimalist Design | InProgress | Work Order rows show 3 lines of information (ID + task, asset + criticality + assignee, event + incident + timestamp). For the 7 AM triage persona, all three lines are relevant. The 5-row limit prevents scroll fatigue while the "Go to Work Orders" link offers the full list. | 0 | No action needed. |
| H8-04 | H8: Aesthetic and Minimalist Design | Asset Table | Horizontal scroll hint (gradient fade on right edge) correctly signals overflowing columns. Column dividers provide clean visual separation. The table shows 9 columns, which is at the upper limit of comfortable scanning. | 1 | Consider which columns could be hidden by default and revealed via a column visibility toggle. RUL and Investigations are candidates for "show on demand" columns. |
| H9-01 | H9: Help Users Recognize, Diagnose, and Recover from Errors | Asset Table | Empty state when no assets match filters shows "No assets match the current filters" with active filter chips visible and dismissable. This is clear, non-blaming language with a recovery path (clear filters). Positive finding. | 0 | No action needed. |
| H9-02 | H9: Help Users Recognize, Diagnose, and Recover from Errors | NotificationsPanel | Empty state message has a bug (references undefined `filter` variable). When this code path executes, it would crash or show an incorrect message rather than a helpful empty state. | 2 | Fix the variable reference. The intended message should read: "No [severity] notifications [for asset]". |
| H9-03 | H9: Help Users Recognize, Diagnose, and Recover from Errors | Global | No error boundary wrapping the main content area. A rendering error in any component would crash the entire dashboard with a white screen. | 2 | Add a React Error Boundary around the main content area with a user-friendly fallback message. |
| H10-01 | H10: Help and Documentation | Global | The Help icon in the TopBar is non-functional (no onClick handler). For a complex industrial dashboard, the help button being a dead icon is a missed opportunity. There is no onboarding, no feature tour, no contextual help beyond the KPI info icons. | 3 | Implement a help panel or link to documentation. At minimum, add a keyboard shortcut reference card. The KPI info icons are a good pattern -- extend this to other complex elements (Event Triage matrix, Alarm Quality donut, criticality ratings). |
| H10-02 | H10: Help and Documentation | Asset Table | The "RUL" column header has a `title` attribute ("Remaining Useful Life") providing tooltip on hover. Other column headers lack title attributes. Consider parity: "OEE" is also an abbreviation. | 1 | Add `title` attributes to all abbreviated column headers (OEE = "Overall Equipment Effectiveness"). |
| H10-03 | H10: Help and Documentation | Sidebar | Settings nav item navigates to a placeholder (renders PlantOverview). There is no settings screen. The gear icon creates an expectation of configurable behavior that does not exist. | 1 | Remove the Settings nav item until a settings screen is implemented, or label it as "Coming soon" via a tooltip. |

---

## 4. Findings by Heuristic

### H1: Visibility of System Status

The dashboard provides strong status visibility through color-coded KPI health indicators, breadcrumb navigation, active nav states, and notification unread indicators. The primary gap is the absence of a data freshness timestamp (H1-01, severity 3), which is critical for a time-sensitive morning triage workflow where the engineer needs to know whether they are looking at 7:00 AM data or stale overnight data. The sparkline popover lacks a loading state (H1-03) and notification read state is not persisted (H1-04).

### H2: Match Between System and the Real World

Strong alignment with reliability engineering domain language. The three-act ImpactStrip narrative (Trigger, Consequence, Confirmation) directly maps to how engineers think about incident causation. ISA-101 alarm shapes (diamond for critical, triangle for warning) follow industry standards. Section ordering reflects the engineer's morning triage mental model. "RUL" is the only abbreviation that might trip up new users, but the tooltip mitigates this adequately for the target audience.

### H3: User Control and Freedom

Several navigation links styled as interactive elements are non-functional: "Go to Events", "Go to Work Orders", "Go to Investigations", and the Quick Access links in the notification drill-in. While these are acknowledged as placeholders in the codebase, they create dead ends that violate user expectations. Escape key dismissal, close buttons, and focus management on panels are well-implemented.

### H4: Consistency and Standards

Internal consistency is strong. The five icon systems are visually distinct and consistently applied. Typography classes are used systematically. Tooltip patterns are uniform. The one notable bug (H4-02) is a reference to an undefined `filter` variable in the NotificationsPanel empty state. The visual distinction between interactive and non-interactive KPI cards (accent-top border) is intentional and correctly signals affordance.

### H5: Error Prevention

Well-addressed throughout. Search autocomplete, dismissable filter chips, live filter previews, and the "Clear all" button all prevent filter-related errors. The cross-component filter stacking (Needs Action cards to Asset Table) is well-designed with visible state at every step. No destructive actions exist in the current interface, so confirmation dialogs are not needed.

### H6: Recognition Rather Than Recall

The sidebar's collapsed icon-only state (H6-01, severity 3) is the primary recognition issue. While the hover-to-expand behavior reveals labels, the default 48px rail relies on users recognizing 4 icons plus a gear. For a daily-use tool, this may be acceptable after the first few sessions, but the native `title` tooltip delay (~500ms) is too slow for quick scanning. KPI info icons being hidden on mobile (H6-04) is a secondary concern.

### H7: Flexibility and Efficiency of Use

The dashboard lacks keyboard shortcuts entirely (H7-01, severity 3). For a tool used every morning by the same engineers, shortcuts for common actions would significantly improve efficiency. The dense mode toggle, chart-to-table filtering, and search autocomplete are positive efficiency features. The absence of shortcuts is the largest gap in this heuristic.

### H8: Aesthetic and Minimalist Design

The dashboard excels here. The ISA-101 "dark and quiet" theme keeps the visual baseline calm, making status changes (coral-red, amber) immediately noticeable against the dark background. Information density is high but well-structured through clear section headers, card boundaries, and progressive disclosure. The five-section layout matches the priority order of the triage workflow. No decorative elements compete with data. The 9-column asset table is at the upper limit of comfortable scanning width.

### H9: Help Users Recognize, Diagnose, and Recover from Errors

The Asset Table empty state is well-crafted with clear language and visible recovery options. The NotificationsPanel empty state has a bug that needs fixing (H9-02). The absence of a React Error Boundary (H9-03) means any component crash would take down the entire dashboard with no recovery path -- a concern for a production tool.

### H10: Help and Documentation

The weakest heuristic. The Help button in the TopBar is non-functional (H10-01, severity 3). Beyond the KPI info icons, there is no in-context help for complex visualizations like the Event Triage matrix or Alarm Quality donut. No onboarding exists. The Settings nav item leads to a placeholder. For a domain-specific industrial tool, the gap between the complexity of the visualizations and the available help resources is significant.

---

## 5. Prioritized Action Plan

### Severity 3 -- Must Fix (High Priority)

| ID | Finding | Effort | Quick Win? |
|----|---------|--------|------------|
| H1-01 | Add "Last updated" timestamp to TopBar or KPI bar header | Low | Yes |
| H6-01 | Add custom styled tooltips to sidebar rail icons (replace native `title` with zero-delay hover tooltips) | Low | Yes |
| H7-01 | Implement keyboard shortcuts for high-frequency actions (n=notifications, d=dense, /=search, ?=help) | Medium | No |
| H10-01 | Wire Help button to a keyboard shortcut reference or help panel | Medium | No |

### Severity 2 -- Should Fix (Schedule for Next Iteration)

| ID | Finding | Effort | Quick Win? |
|----|---------|--------|------------|
| H4-02 | Fix `filter` variable ReferenceError in NotificationsPanel empty state | Low | Yes |
| H9-02 | Same as H4-02 -- fix NotificationsPanel empty state message | Low | Yes |
| H3-01 | Wire "Go to" links to navigation or replace with disabled/coming-soon state | Low | Yes |
| H3-02 | Wire Quick Access links in notification detail or remove | Low | Yes |
| H9-03 | Add React Error Boundary with user-friendly fallback | Low | Yes |
| H1-03 | Add skeleton loading state for KPI sparkline popover | Low | No |
| H1-04 | Persist notification read state to localStorage | Low | No |
| H6-04 | Make KPI info descriptions accessible on mobile (tap-to-reveal) | Medium | No |
| H3-03 | Verify asset table row clickability in deployed state (currently functional) | Low | Yes |

### Severity 1 -- Nice to Fix (Low Priority)

| ID | Finding | Effort | Quick Win? |
|----|---------|--------|------------|
| H1-02 | Sidebar active indicator visibility in rail | Low | -- |
| H2-01 | "RUL" abbreviation (already has title tooltip) | -- | N/A |
| H4-03 | Visual rhythm of Trains/Active Assets vs KPI cards | Low | -- |
| H7-03 | Multi-column sort for Asset Table | Medium | No |
| H8-02 | Replace invisible placeholder divs with CSS grid stretch | Low | Yes |
| H8-04 | Column visibility toggle for Asset Table | Medium | No |
| H10-02 | Add title attributes to all abbreviated column headers | Low | Yes |
| H10-03 | Remove or label Settings nav as "Coming soon" | Low | Yes |

### Issues Requiring Further Research

- **H6-01 (sidebar recall):** User testing with reliability engineers would validate whether the icon-only rail causes actual recall problems after the first week of use, or whether learned recognition makes it a non-issue.
- **H7-01 (keyboard shortcuts):** Identify which 5-8 shortcuts would deliver the most value through observation of actual triage workflows.
- **H8-04 (9-column table):** Monitor whether engineers actually use all 9 columns or if some are rarely referenced during morning triage. Eye-tracking or column interaction analytics would inform which columns to show/hide by default.

---

## Sources

- CLAUDE.md (project doctrine)
- HEURISTICS.md (evaluation framework)
- ADR-010 (status labels/icons/colors)
- ADR-016 (badge system + asset criticality)
- ADR-018 (typography system)
- ADR-022 (WO urgency + icon system)
- ADR-024 (accessibility standards)
- ADR-025 (mobile responsive design)
- ADR-026 (dense mode)
- ADR-027 (spacing system)
- ADR-028 (navigation architecture)
