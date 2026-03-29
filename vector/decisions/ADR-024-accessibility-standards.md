# ADR-024: Accessibility Standards (WCAG 2.1 AA)

**Status:** Accepted
**Date:** 2026-03-29
**Research:** DESK-RESEARCH-016

## Context

The dashboard had no systematic accessibility support. Interactive SVG charts were mouse-only, no focus indicators existed for keyboard users on dark theme, and no reduced motion support was present. This ADR codifies the WCAG 2.1 AA patterns adopted in the accessibility sweep.

## Decisions

### Focus ring system

All interactive elements use `:focus-visible` with a 2px solid teal outline at 2px offset. Teal on dark background = 8.6:1 contrast ratio (well above 3:1 SC 1.4.11 minimum). Mouse clicks do not trigger focus rings (`:focus:not(:focus-visible)` suppresses them). No component-level outline overrides needed.

### Reduced motion

`@media (prefers-reduced-motion: reduce)` applied globally via `global.css`. All animation durations and transition durations set to 0.01ms. Scroll behavior set to auto. This covers all components without per-component logic.

### SVG chart keyboard access

Interactive SVG elements (donut segments, bar rows) receive:
- `tabIndex={0}` for keyboard reachability
- `role="button"` for screen reader identification
- `aria-label` with segment name, value, and action hint
- `aria-pressed` for toggle state
- `onKeyDown` handler for Enter/Space activation
- `onFocus`/`onBlur` to trigger the same hover state as mouse

### Semantic landmarks

- `<main id="main-content">` wraps the content viewport
- Skip-to-content link (`.skip-link`) appears on keyboard focus, jumps to main
- Sidebar uses `<aside role="navigation" aria-label="Main navigation">`
- TopBar uses `<header role="banner">`
- NotificationsPanel uses `role="dialog" aria-label="Event Feed"`

### Table headers

Sortable column headers are `<button>` elements with `aria-sort` (`ascending`/`descending`/`none`). Screen readers announce current sort state when the header receives focus.

### Search autocomplete

The asset search input uses `role="combobox"` with `aria-expanded`, `aria-haspopup="listbox"`, and `aria-autocomplete="list"`. The suggestion dropdown uses `aria-live="polite"` to announce result count changes.

### Panel focus management

NotificationsPanel receives focus on open via `tabIndex={-1}` and programmatic focus. Escape key closes the panel. Mobile variant uses `aria-modal="true"`.

### Navigable rows

All clickable rows (Asset Table, Work Orders, Investigations) are keyboard-accessible:
- `tabIndex={0}` for keyboard reachability
- `role="button"` on WO/Investigation rows (Asset Table rows use `role="row"` within ARIA table)
- `aria-label` with key row data (name, status, criticality)
- `onKeyDown` for Enter/Space activation
- `onFocus`/`onBlur` parity with hover states

### ARIA table structure

The div-based Asset Table uses ARIA roles instead of semantic `<table>` elements (converting would break horizontal scroll and flex column sizing):
- `role="table"` + `aria-label` on scroll container
- `role="row"` on header and data rows
- `role="columnheader"` on sortable header buttons
- `role="cell"` on data cells
- `role="rowgroup"` on the rows container

### Focus trap

`useFocusTrap` hook wraps Tab/Shift+Tab at modal boundaries. Applied to NotificationsPanel (mobile) and Sidebar (mobile drawer). Background `<main>` receives `inert` attribute when mobile panels are open.

### Keyboard tooltip positioning

Cursor-following tooltips (RiskMatrix, AlarmQuality, BadActors) use `getBoundingClientRect()` of the focused element when triggered by keyboard, falling back to mouse coordinates for hover.

### Windows High Contrast Mode

`@media (forced-colors: active)` block in global.css: focus rings use `Highlight`, card borders use `CanvasText`, status dots and badges use `forced-color-adjust: none` to preserve semantic colors.

### Escape key convention

All overlay/dropdown elements close on Escape: NotificationsPanel, FilterButton dropdown, mobile sidebar drawer, KPI sparkline dropdown.

## Rationale

- ISA-101 "dark and quiet" philosophy naturally aligns with WCAG: subdued defaults, salient alerts, multiple coding methods
- The existing teal accent serves as both brand color and focus indicator, maintaining visual consistency
- Global CSS approach avoids per-component accessibility boilerplate
- `aria-pressed` on filter-like interactions (donut segments, matrix cells, bar rows) maps naturally to the toggle filter pattern (ADR-023)
