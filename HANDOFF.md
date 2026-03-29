# APM Dashboard Handoff -- Session 15 End

## START HERE
Accessibility sweep complete (WCAG 2.1 AA). ADR update pass done (8 stale ADRs corrected, ADR-024 added). 24 ADRs, 16 desk research docs. Next: Asset Inspection screen.

## Deployed
- **APM Dashboard**: https://apm-dashboard-eosin.vercel.app
- **Portfolio case study**: https://designedbyrob.com/projects/honeywell-apm

## Next session priorities

### 1. Asset Inspection screen
Drill-down view for a single asset. Three-level IA (Reliability, Maintenance, Performance). Sub-asset tree, sensor data, threshold visualization. 65 sub-assets with sensors/thresholds already in data model.

### 2. Deploy accessibility changes
Push session 15 changes to Vercel.

## What was completed this session

### Accessibility sweep (ADR-024, DESK-RESEARCH-016)

**Global CSS (`src/styles/global.css`)**
- `:focus-visible` system: 2px solid teal, 2px offset (8.6:1 contrast on dark)
- `:focus:not(:focus-visible)` suppresses mouse focus rings
- `@media (prefers-reduced-motion: reduce)` zeros all animation/transition durations
- Skip-to-content link (`.skip-link`) hidden until keyboard focused

**App shell (`src/App.jsx`)**
- `<main id="main-content">` landmark wrapping content viewport
- Skip link jumps to `#main-content`

**SVG chart keyboard access**
- AlarmQuality.jsx: donut segments have `tabIndex={0}`, `role="button"`, `aria-label`, `aria-pressed`, `onKeyDown` (Enter/Space), `onFocus`/`onBlur` for hover parity
- RiskMatrix.jsx: cells already `<button>` with `aria-label`/`aria-pressed`; added `onFocus`/`onBlur` for tooltip on keyboard focus
- BadActors.jsx: bar rows have `role="button"`, `tabIndex={0}`, `aria-label`, `aria-pressed`, `onKeyDown`, `onFocus`/`onBlur`

**AssetTable.jsx**
- Sortable headers converted from `<div>` to `<button>` with `aria-sort` (`ascending`/`descending`/`none`)
- Search input: `role="combobox"`, `aria-label`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-autocomplete="list"`
- Suggestion listbox: `aria-live="polite"`, `aria-label` with result count

**NotificationsPanel.jsx**
- `aria-modal="true"` on mobile
- `tabIndex={-1}` + programmatic focus on open
- Escape key closes panel (document-level keydown listener)

**FilterButton.jsx**
- `aria-expanded` and `aria-haspopup="listbox"` on toggle button
- Escape key closes dropdown and returns focus to button

**Sidebar.jsx**
- Escape key closes mobile drawer

### ADR update pass (8 stale ADRs)

| ADR | What changed |
|-----|-------------|
| 005 | Sidebar: hover-to-expand overlay (not toggle button), mobile drawer |
| 009 | Sidebar 48px rail overlay, Event Feed 320px push, updated terminology |
| 011 | Investigation status: triangles (not circles), reference to ADR-022 |
| 012 | Section names: System Health, In Progress, Needs Action. "What Changed" moved to Events screen |
| 013 | "Events screen" (not "Event Log page"). Section names aligned |
| 014 | "Events screen" (not "Event Log page") |
| 015 | Title: "Single View" (not "Two Views"). "Asset Criticality" (not "Asset Priority"). "Event Triage" card name |
| 019 | Unified filter pattern per ADR-023. "INVESTIGATIONS" (not "CASES"). ADR-021 data model reference |
| 020 | Section names: System Health, In Progress, Needs Action. Title updated |

### New artifacts
- `vector/decisions/ADR-024-accessibility-standards.md`
- `vector/research/DESK-RESEARCH-016-accessibility-audit.md`

### CLAUDE.md updates
- Section names: System Health, In Progress, Needs Action
- Screen names: Fault Tree (not Root Cause)
- Event Feed terminology
- INVESTIGATIONS (not CASES)
- ADR index: 001-024
- Desk research index: 001-016

## Key files modified
- `src/styles/global.css` -- focus-visible, reduced motion, skip link
- `src/App.jsx` -- main landmark, skip link
- `src/components/ui/AlarmQuality.jsx` -- keyboard access on donut segments
- `src/components/ui/RiskMatrix.jsx` -- focus/blur on cells
- `src/components/ui/BadActors.jsx` -- keyboard access on bar rows
- `src/components/ui/AssetTable.jsx` -- aria-sort, combobox, live region
- `src/components/NotificationsPanel.jsx` -- focus management, Escape, aria-modal
- `src/components/ui/FilterButton.jsx` -- aria-expanded, Escape key
- `src/components/Sidebar.jsx` -- Escape key for mobile drawer
- `vector/decisions/ADR-024-accessibility-standards.md` (new)
- `vector/research/DESK-RESEARCH-016-accessibility-audit.md` (new)
- 8 ADRs updated (005, 009, 011, 012, 013, 014, 015, 019, 020)
- `CLAUDE.md` -- section names, ADR/desk research counts
