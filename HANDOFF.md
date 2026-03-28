# APM Dashboard Handoff -- Session 13

## START HERE
Plant Overview is complete pending mobile gate and donut color review. Next: deploy or Asset Inspection.

## Completed this session

### Section and card naming (ADR-020)
- "Event Analysis" renamed to "Requires Attention"
- Risk Matrix card: "Event Triage". Bad Actors: "Watch List". Alarm Quality: dropped Case Status.
- Section order: Plant Health > What Happened > Current Response > Requires Attention > Assets

### Data reconciliation (ADR-021)
- newEvents + inProgressEvents on every asset (sum = activeEvents, total 21)
- RISK_MATRIX and EVENT_SUMMARY scaled to 21. CASE_SUMMARY removed.

### Asset Table redesign (ADR-019)
- 9 columns with derived WO/Investigation counts
- Smart search with autocomplete (name, ID, type). Enter filters, click navigates.
- Shared FilterButton with multi-select checkbox dropdown
- Sortable headers with always-visible stacked arrows
- Event Triage integration: filter chip in both locations, smooth scroll
- Pagination: 10 rows/page, fixed height (measured), page resets on filter/search
- Column dividers, 16px cell padding, flexible asset column

### Typography system (ADR-018)
- 13 classes consolidated to 9. ~15 inline fontSize overrides swept.

### Color audit
- All inline rgba/hex tokenized. Zero hardcoded colors in components.
- ADR-002 updated to reflect Carbon g100 values. tokens.js synced.
- New tokens: donut palette, border-divider, accent-bg variants, hover-cursor, shadow-tooltip, shadow-overlay.

### WO urgency system (ADR-022)
- Emergency / Urgent / Scheduled (replaces Critical/High/Medium/Low on WOs)
- WoPriority.jsx: circle fill hierarchy + neutral text. No color coding.
- Five distinct icon systems documented: events (tallies), investigations (triangles), WO urgency (circles), criticality (letter pills), asset status (dots).

### Impact Strip redesign
- Replaced timeline visualization (361 lines) with three cards: Trigger / Consequence / Confirmation
- grid-thirds layout, stateless component, 64 lines
- "See full timeline" links to Events screen
- Events added to sidebar navigation

### Watch List (BadActors) rewrite
- Pure React horizontal bars (no Recharts). Cursor-following tooltip with fadeInOnly.
- CriticalityIndicator with inverted prop for light tooltip bg.
- "Last 30 days" subtitle. Asset names always teal. Bars 20px, vertically centered.

### Notification filter
- Chip filters replaced with shared FilterButton (multi-select severity checkboxes)
- Count badge removed (redundant when panel is open)
- Same component as Asset Table filter

### Sidebar overhaul
- Hover-to-expand overlay (no toggle button, no content push, shadow overlay)
- All icons replaced with Feather/Lucide: factory, list, gauge, git-branch, trending-up, tool, file-search, settings
- Shared feather base object for consistent stroke weight

### TopBar
- "APM" spelled out to "Asset Performance Management"

### App.jsx cleanup
- sidebarExpanded state removed. Content locked to rail width.
- Events added to VIEWS map (placeholder).

## Next session priorities

### 1. Mobile gate
- Message on screens under 1024px before deploying to portfolio

### 2. Donut color review
- Desaturated Carbon palette may need adjustment
- Compare against rest of dashboard charts

### 3. Deploy preparation
- Final visual QA pass
- Screenshot/video capture for portfolio
- GitHub README

### 4. Asset Inspection screen
- Three-level IA: Reliability / Maintenance / Performance
- Drill-down from Asset Table and Watch List

## Doctrine inventory
- 22 ADRs (001-022)
- 15 desk research docs
- 2 interviews, 2 personas, 1 story

## Shared components inventory
- Badge.jsx -- event severity (tally + fill hierarchy)
- CriticalityIndicator.jsx -- asset criticality (A/B/C/D, inverted prop)
- Legend.jsx -- chart legend (swatch + label + value)
- FilterChip.jsx -- dismissable filter tag
- FilterButton.jsx -- filter button + checkbox dropdown
- WoPriority.jsx -- WO urgency (circle icons + text)
