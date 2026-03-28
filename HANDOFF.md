# APM Dashboard Handoff -- Session 13

## START HERE
Color audit next. Then remaining Plant Overview items.

## Completed this session

### Section and card naming (ADR-020)
- "Event Analysis" renamed to "Requires Attention"
- Risk Matrix card renamed to "Event Triage"
- Bad Actors renamed to "Watch List"
- Alarm Quality: removed segmented control + Case Status view (duplicate of Investigations card)
- Full section order: Plant Health > What Happened > Current Response > Requires Attention > Assets

### Data reconciliation (ADR-021)
- Added `newEvents` + `inProgressEvents` to every asset (sum = `activeEvents`)
- RISK_MATRIX scaled to 21 total: A(3/8), B(4/5), C(1/0)
- EVENT_SUMMARY scaled to 21: 13 confirmed, 3 false positives, 5 new
- CASE_SUMMARY removed (duplicate of Investigations)
- Two meanings of "New" documented: unvalidated signal (donut) vs unassigned investigation (matrix)

### Asset Table redesign (ADR-019)
- 9 columns: Status, Asset, Criticality, OEE, Events, Downtime, Work Orders, Investigations, Remaining Life
- Events collapsed from 3 sub-columns (New/In Progress/Repetitive) to single `activeEvents` count
- Work Orders + Investigations derived from WORK_ORDERS/CASES data (not hardcoded)
- Toolbar: filter chips (left) + search field + Filter button with multi-select dropdown (right)
- Sortable column headers: always-visible stacked arrows, teal highlight on active sort
- Event Triage integration: filter chip in both Event Triage card and table, smooth scroll, clearable from either location
- Shared FilterChip.jsx component (used by both RiskMatrix and AssetTable)
- Column dividers at 50% opacity, 16px cell padding, 12px row padding
- Asset column flexible (flex: 1), all columns use shared COL_STYLES for header/data alignment

### Typography system (ADR-018)
- Consolidated 13 classes to 9: section-header, type-card-title, type-table-header, type-body, type-meta, type-label, type-kpi, type-kpi-hero, type-link
- Removed 4 unused classes, 3 near-duplicates
- Swept ~15 inline fontSize overrides
- Column headers bold (type-table-header, 14px/600)
- No inline font-size overrides rule established

## Next session priorities

### 1. Color audit
- Audit all inline color values across components
- Propose tokenized color system and sweep inlines
- Donut palette review (desaturated Carbon colors may need adjustment)

### 2. Work order priority badge design
- Current: Critical/High/Medium/Low badges on work orders use same Badge.jsx as event severity
- Problem: visual overlap creates ambiguity ("Critical" badge on a WO -- is that event severity or WO priority?)
- Decision needed: different visual treatment for WO priority vs event severity

### 3. Impact Strip layout
- Labels use absolute positioning, feels disconnected
- Decision: CSS grid refactor vs fine-tune current layout
- Unconfirmed/pending state (hollow dot)

### 4. Notification filter: segmented control
- Replace chip-styled filters with segmented control

### 5. Mobile gate
- Message on screens under 1024px before deploying to portfolio

### 6. Recharts tooltip unification
- Remaining Recharts default tooltips in BadActors (Watch List) chart
- Convert to custom tooltip matching dashboard pattern

### 7. ADR-002 color values
- Update doc to match Carbon palette

## Doctrine inventory
- 21 ADRs (001-021)
- 14 desk research docs
- 2 interviews, 2 personas, 1 story
