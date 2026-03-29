# ADR-009: Sidebar and Notifications Panel Mutual Exclusion

**Date:** 2026-03-26
**Status:** accepted
**Deciders:** Rob Jones

## Context
The dashboard has two panels: the navigation sidebar (left) and the Event Feed panel (right). If both expanded simultaneously, the content area becomes too narrow and the grid breaks.

## Decision
Only one panel can be fully expanded at a time. The sidebar is a 48px rail that expands to 256px as an overlay on hover (no content push). The Event Feed is a 320px push panel triggered by the bell icon. When the Event Feed opens, the sidebar hover-expand is suppressed.

The sidebar rail (48px) is always visible on desktop. The Event Feed panel pushes the content when open.

On mobile: sidebar becomes a full-screen drawer, Event Feed becomes a full-screen overlay. Mutual exclusion still applies.

## Consequences
- Content grid always has a predictable width: full minus 48px sidebar rail, optionally minus 320px Event Feed
- No double-compression scenario
- Clear mental model: left = navigation, right = events
- The 12-column grid recalculates within whatever width remains

## Alternatives Considered
- Allow both open: content becomes too narrow, especially on smaller screens
- Overlay instead of push: content is hidden behind the panel, losing context
- No sidebar (top nav only): loses the persistent navigation affordance
