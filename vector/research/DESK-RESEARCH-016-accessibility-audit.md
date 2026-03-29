# DESK-RESEARCH-016: WCAG 2.1 AA Accessibility Audit

**Date:** 2026-03-29
**Author:** Rob Jones
**Status:** Complete

## Purpose

Systematic WCAG 2.1 AA audit of the APM Dashboard. This document identifies the relevant success criteria for an enterprise dark-themed monitoring dashboard with interactive data visualizations.

## Relevant WCAG 2.1 AA Success Criteria

### Perceivable

**SC 1.4.1 -- Use of Color**
Information must not be conveyed by color alone. Status indicators need icon + text alongside color. The existing badge tally system (ADR-016) and status dot + label pattern satisfy this. Risk Matrix cells and donut segments need non-color differentiation when selected (border weight, not just color change).

**SC 1.4.3 -- Contrast (Minimum)**
Text contrast 4.5:1 (normal), 3:1 (large). Current token system passes: primary text #f4f4f4 on #161616 = 14.5:1, secondary #c6c6c6 = 10.3:1, helper #a8a8a8 = 7:1. Disabled text at rgba(244,244,244,0.25) = ~2:1 -- acceptable for disabled per WCAG exception (SC 1.4.3 exception for inactive UI).

**SC 1.4.11 -- Non-text Contrast**
UI components and graphical objects need 3:1 against adjacent colors. Status dots (8px) are small but always paired with text labels. Chart segments need 3:1 against background. Focus indicators need 3:1 against background.

### Operable

**SC 2.1.1 -- Keyboard**
All interactive elements must be operable via keyboard. SVG chart segments, filter cards, and bar rows currently lack keyboard handlers. Native HTML buttons get keyboard for free; div-based click handlers do not.

**SC 2.4.1 -- Bypass Blocks**
Skip navigation link to jump past sidebar/header to main content. Standard pattern: visually hidden link that appears on focus.

**SC 2.4.7 -- Focus Visible**
Keyboard focus must be visible. Dark themes need a high-contrast focus ring. Teal (#2dd4bf) on dark (#161616) = 8.6:1, well above 3:1 minimum. 2px solid outline with 2px offset provides clear visibility without clipping.

**SC 2.3.1 -- Three Flashes / Motion**
No content flashes more than three times per second. Dashboard animations are subtle transitions, not flashes. `prefers-reduced-motion` media query should disable transitions for users who request it.

### Understandable

**SC 4.1.2 -- Name, Role, Value**
Interactive elements need programmatic name, role, and state. SVG chart segments acting as buttons need `role="button"`, `aria-label`, and state attributes. Sortable table headers need `aria-sort`. Expandable panels need `aria-expanded`. Modal dialogs need `aria-modal`.

## ISA-101 Alignment

ISA-101 "dark and quiet" philosophy aligns well with WCAG. The standard recommends:
- Subdued default state (dark backgrounds, muted colors)
- Salient alarm/alert states (bright, high-contrast)
- Multiple coding methods (color + shape + position)

The dashboard already follows this for event severity (tally bars + fill + color) and asset status (dots + text labels). The accessibility sweep extends this philosophy to keyboard and screen reader users.

## Implementation Decisions

See ADR-024 for the specific patterns chosen:
- Focus ring: 2px solid teal, 2px offset
- Reduced motion: zero-duration override at OS level
- SVG keyboard: tabIndex + role="button" + onKeyDown
- Landmarks: main, nav, banner, dialog
- Live regions: aria-live="polite" for dynamic updates
