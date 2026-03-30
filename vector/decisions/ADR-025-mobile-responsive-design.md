# ADR-025: Mobile Responsive Design

**Status:** Accepted
**Date:** 2026-03-29

## Context

The dashboard was built desktop-first for reliability engineers at workstations. A recruiter reviewing the portfolio or a field engineer checking their phone needs a usable mobile experience. The mobile breakpoint is 671px (matching the CSS 672px tablet breakpoint via `useIsMobile` hook).

## Decisions

### Card padding and grid gaps

Cards use 16px padding on mobile (24px on desktop). Grid gaps (`kpi-grid`, `grid-thirds`, `grid-12`) tighten from 24px to 16px on mobile. Applied via responsive `.card` rule in `global.css` -- no component-level overrides.

### KPI cards (mobile)

KPI values scale from 28px to 24px (`--text-24` token added). Info icons and delta rows ("vs yesterday") hidden on mobile via `.hide-mobile` utility class. Each card shows: label, value, health indicator (icon + "Monitor" / "Action Required"). Trains and Active Assets hide their placeholder height rows.

### Asset Table (mobile)

Full table replaced with a stacked list. Each row renders vertically: status dot + name, asset type, criticality badge + compact severity badge + event count. No horizontal scroll.

Toolbar: full-width search input + single filter/sort icon button. Tapping the icon opens a full-screen bottom drawer (`slideUp` animation, max-height 80vh) with sort pill buttons (Status, Name, Criticality) and filter checkboxes (Criticality, Status, Process Unit). "Clear All" and "Done" buttons in the drawer footer.

Desktop 9-column table is completely unchanged.

### Needs Action carousel

The three Needs Action cards (Event Triage, Alarm Quality, Watch List) render as a horizontal CSS scroll-snap carousel on mobile. One card visible at a time with dot indicators below. Active dot is a 20px teal pill, inactive dots are 8px circles. Cards stretch to equal height via `.carousel-slide` flex container. Desktop three-column grid unchanged.

### Tooltip suppression

All custom tooltips suppressed on mobile (RiskMatrix, AlarmQuality, WatchList, EventSummary). No hover state on touch devices, so tooltips would only appear on tap and obscure content. Information is already available in legends and labels. KPI info icons already hidden via `.hide-mobile`.

### Dead link cleanup

All placeholder navigation links (`console.log('Navigate to...')`) stripped of onClick, onKeyDown, role, tabIndex, and cursor:pointer. Links remain as static teal `type-link` text indicating future navigation targets. Asset Table rows conditionally show pointer cursor and click handlers only when `onAssetClick` is provided (currently null until Asset Inspection ships).

### FilterChip overflow fix

`whiteSpace: nowrap` and `flexShrink: 0` added to FilterChip to prevent text wrapping on long labels ("B (Production)" + "In Progress"). RiskMatrix header uses `flexWrap: wrap` so chips drop below the title when space is tight.

### Shared hook

`useIsMobile` extracted from App.jsx to `src/hooks/useIsMobile.js` for use across components (AssetTable, RiskMatrix, AlarmQuality, WatchList, EventSummary).

## Rationale

Mobile design follows the same ISA-101 "dark and quiet" principle as desktop: show what matters, hide what doesn't. Field engineers on the plant floor need status, asset identity, and criticality. Analytical metrics (OEE, downtime, delta trends) belong on the desktop where they have space and context. The carousel preserves all three Needs Action charts at full fidelity rather than simplifying them -- the data matters, it just needs to be paged instead of stacked.
