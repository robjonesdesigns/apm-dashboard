# ADR-009: Sidebar and Notifications Panel Mutual Exclusion

**Date:** 2026-03-26
**Status:** accepted
**Deciders:** Rob Jones

## Context
The dashboard has two slide-out panels: the navigation sidebar (left) and the notifications panel (right). Both push the content viewport when open. If both open simultaneously, the content area becomes too narrow and the grid breaks.

## Decision
Only one panel can be open at a time. When the sidebar opens, the notifications panel closes. When notifications open, the sidebar closes. Both panels are 320px wide and push the content (not overlay).

The sidebar has two states:
- Collapsed: 64px, icon only (default)
- Expanded: 320px, icon + label text

The sidebar expand/collapse is triggered by a toggle button or hamburger menu. The notification panel is triggered by the bell icon in the top bar.

## Consequences
- Content grid always has a predictable width: full, minus 64px sidebar, or minus 320px (one panel expanded)
- No double-compression scenario
- Clear mental model: left panel = navigation, right panel = alerts
- The 12-column grid recalculates within whatever width remains

## Alternatives Considered
- Allow both open: content becomes too narrow, especially on smaller screens
- Overlay instead of push: content is hidden behind the panel, losing context
- No sidebar (top nav only): loses the persistent navigation affordance
