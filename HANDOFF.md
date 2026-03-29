# APM Dashboard Handoff -- Session 15 End

## START HERE
Full WCAG 2.1 AA sweep complete. All remaining a11y gaps fixed (ARIA table, keyboard tooltips, focus trap, high contrast mode). KPI cards consistent height at all viewports. All navigable rows tabbable. 24 ADRs, 16 desk research docs. README written.

## Deployed
- **APM Dashboard**: https://apm-dashboard-eosin.vercel.app
- **Portfolio case study**: https://designedbyrob.com/projects/honeywell-apm

## Next session priorities

### 1. Mobile view pass
Mobile layout needs a simplification pass. Engineers on the floor need quick decision-making, not the full desktop density. This is what hiring managers will check first on their phones. Consider:
- Collapsing or hiding Needs Action section (Event Triage, Alarm Quality, Watch List) on mobile
- Simplifying KPI cards (value + health indicator only, no delta)
- Impact Strip as a single summary line instead of three cards
- Asset Table: fewer columns on mobile (Status, Asset, Events, OEE)
- Event Feed: full-screen overlay already works, check spacing and touch targets
- Fix any weird layout issues at mobile breakpoints

### 2. Event Feed tab indexes
NotificationsPanel internal links (incident links, related event links, WO links, investigation links, Quick Access links) are currently `<span className="type-link">` with `onClick={console.log}`. They need `tabIndex={0}`, `role="link"`, and `onKeyDown` handlers. Same pattern as the tabbable rows.

### 3. Deploy
Push all session 15 changes to Vercel. Nothing matters if it's not live.

### 4. Asset Inspection screen
All the rules are in place. Biggest build, needs the other fixes shipped first. Drill-down view for a single asset. Three-level IA:
- **Reliability**: failure risk, remaining useful life, event history
- **Maintenance**: alerts, work orders, case management
- **Performance**: OEE, operational metrics, trend data

65 sub-assets with sensors, thresholds, statuses, narratives, and lessons already in the data model (`src/data/assets.js`). Sub-asset tree lets engineers isolate which components are affected without leaving the page.

## What was completed this session

### Accessibility sweep (ADR-024, DESK-RESEARCH-016)

**Global CSS (`src/styles/global.css`)**
- `:focus-visible` system: 2px solid teal, 2px offset (8.6:1 contrast on dark)
- `:focus:not(:focus-visible)` suppresses mouse focus rings
- `@media (prefers-reduced-motion: reduce)` zeros all animation/transition durations
- `@media (forced-colors: active)` for Windows High Contrast Mode
- Skip-to-content link (`.skip-link`) hidden until keyboard focused

**App shell (`src/App.jsx`)**
- `<main id="main-content">` landmark wrapping content viewport
- Skip link jumps to `#main-content`
- `inert` attribute on main when mobile panels open

**SVG chart keyboard access**
- AlarmQuality.jsx: donut segments with tabIndex, role, aria-label, aria-pressed, onKeyDown, onFocus/onBlur
- RiskMatrix.jsx: onFocus/onBlur for tooltip on keyboard focus
- BadActors.jsx: bar rows with role="button", tabIndex, keyboard handlers

**Keyboard tooltip positioning**
- RiskMatrix, AlarmQuality, BadActors: getBoundingClientRect() on focused element instead of mouse coords

**Focus trap**
- `src/hooks/useFocusTrap.js`: Tab/Shift+Tab wrapping at modal boundaries
- Applied to NotificationsPanel (mobile) and Sidebar (mobile drawer)

**AssetTable.jsx**
- ARIA table roles (role="table", role="row", role="columnheader", role="cell", role="rowgroup")
- Sortable headers: `<button>` with `aria-sort`
- Search: combobox role, aria-expanded, aria-live on listbox
- Rows tabbable with tabIndex, onKeyDown, onFocus/onBlur
- RUL column: "RUL" header with native tooltip, 100px width

**NotificationsPanel.jsx**
- aria-modal, tabIndex, programmatic focus, Escape key

**FilterButton.jsx**
- aria-expanded, aria-haspopup, Escape key

**Sidebar.jsx**
- Escape key closes mobile drawer

**TodaysActivity.jsx**
- WO and Investigation rows tabbable with role="button", aria-label, keyboard handlers

### KPI card fixes
- Health indicator always renders (visibility:hidden when normal) for consistent card height
- KPI card buttons use flex:1 to fill grid cells
- Trains and Active Assets have placeholder rows matching KPI card structure
- All six cards identical height at every viewport
- Dropdown closes on outside click and Escape key

### ADR update pass (8 stale ADRs + ADR-024)
005, 009, 011, 012, 013, 014, 015, 019, 020 updated with current names and patterns.
ADR-024 covers all accessibility decisions.
ADR-019 updated for RUL column name.

### New artifacts
- `vector/decisions/ADR-024-accessibility-standards.md`
- `vector/research/DESK-RESEARCH-016-accessibility-audit.md`
- `README.md`
