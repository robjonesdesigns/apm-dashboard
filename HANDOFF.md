# APM Dashboard Handoff -- Session 13

## START HERE
Plant Overview is nearly complete. Impact Strip layout and mobile gate remain.

## Completed this session

### Section and card naming (ADR-020)
- "Event Analysis" renamed to "Requires Attention"
- Risk Matrix card renamed to "Event Triage"
- Bad Actors renamed to "Watch List"
- Alarm Quality: removed segmented control + Case Status view

### Data reconciliation (ADR-021)
- Added `newEvents` + `inProgressEvents` to every asset (sum = `activeEvents`)
- RISK_MATRIX and EVENT_SUMMARY scaled to 21 total
- CASE_SUMMARY removed
- Two meanings of "New" documented

### Asset Table redesign (ADR-019)
- 9 columns: Status, Asset, Criticality, OEE, Events, Downtime, Work Orders, Investigations, Remaining Life
- Work Orders + Investigations derived from WORK_ORDERS/CASES data
- Toolbar: filter chips (left) + smart search with autocomplete + shared FilterButton (right)
- Sortable column headers with always-visible stacked arrows
- Event Triage integration: filter chip in both locations, smooth scroll
- Pagination: 10 rows per page, prev/next, page resets on filter/search
- Fixed table height: measures actual row height, locks minHeight to 10 rows
- Column dividers at 50% opacity, 16px cell padding

### Typography system (ADR-018)
- Consolidated 13 classes to 9
- Swept ~15 inline fontSize overrides
- No inline font-size rule established

### Color audit
- Tokenized all inline colors: donut palette, column divider, accent bg variants, hover cursor, tooltip shadow
- Zero hardcoded hex/rgba in components
- ADR-002 updated to reflect actual Carbon g100 values (was referencing unused Tailwind values)
- tokens.js synced with global.css (chart5 and kpiAvailability corrected)

### WO urgency system (ADR-022)
- WO `priority` renamed to `urgency`: Emergency / Urgent / Scheduled
- Medium + Low collapsed into Scheduled
- WoPriority.jsx: circle fill hierarchy (filled/hollow/clock) + neutral text
- No color coding, no pills -- visually distinct from event Badge

### Five-system icon language (ADR-022)
- Events: tally bars in colored pills (Badge.jsx)
- Investigations: right-pointing triangles, filled/hollow (TodaysActivity)
- WO urgency: circles + clock, neutral gray (WoPriority.jsx)
- Asset criticality: letter grade pills (CriticalityIndicator.jsx)
- Asset status: colored dots + text label
- Investigation summary: count outside badge, badge with triangle + label

### Shared components
- FilterButton.jsx: shared filter button + checkbox dropdown (Asset Table + Notifications)
- FilterChip.jsx: shared dismissable filter tag (Event Triage + Asset Table)
- Notification count badge removed (redundant once panel is open)

## Next session priorities

### 1. Impact Strip layout
- Labels use absolute positioning, feels disconnected
- Decision: CSS grid refactor vs fine-tune current layout
- Unconfirmed/pending state (hollow dot)

### 2. Mobile gate
- Message on screens under 1024px before deploying to portfolio

### 3. Recharts tooltip unification
- Watch List chart still uses Recharts default tooltip
- Convert to custom tooltip matching dashboard pattern

### 4. Donut color review
- Desaturated Carbon palette may need adjustment
- Compare against rest of dashboard charts

### 5. Deploy preparation
- Final visual QA pass
- Screenshot capture for portfolio
- GitHub README

## Doctrine inventory
- 22 ADRs (001-022)
- 15 desk research docs
- 2 interviews, 2 personas, 1 story

## Shared components inventory
- Badge.jsx -- event severity (tally + fill hierarchy)
- CriticalityIndicator.jsx -- asset criticality (A/B/C/D letter grade)
- Legend.jsx -- chart legend (swatch + label + value)
- FilterChip.jsx -- dismissable filter tag
- FilterButton.jsx -- filter button + checkbox dropdown
- WoPriority.jsx -- WO urgency (circle icons + text)
