---
project:
  name: APM Dashboard
  description: >
    Unbranded recreation of Honeywell's Asset Performance Management dashboards
    for Rob Jones' design portfolio. Dark-themed enterprise monitoring UI built
    with React, Recharts, and Tailwind. Three screens: Asset Health (plant overview),
    Asset Details (single asset deep dive), and Trends (attribute analysis).
  stage: development
  started: 2026-03-25
  repo: https://github.com/robjonesdesigns/apm-dashboard
owner:
  name: Rob Jones
knowledge:
  research: ./vector/research/
  decisions: ./vector/decisions/
---

# VECTOR -- APM Dashboard

> This is a portfolio demonstration project, not a production application.
> It recreates dashboards Rob designed at Honeywell (2022-2025) in an unbranded
> form that can be shown to hiring managers, recorded for case study videos,
> and published on GitHub as a code artifact.

---

## Core Relationship

Rob Jones is the operator. Claude is the contractor.
Rob designed the original dashboards at Honeywell. Claude implements
the unbranded recreation based on Rob's descriptions and design decisions.

---

## What This Project Is

An unbranded, dark-themed recreation of Honeywell's APM platform dashboards.
Built in React with Recharts for data visualization and Tailwind for layout.
Uses realistic industrial data (compressors, pumps, turbines, heat exchangers)
but no Honeywell branding, client names, or proprietary data.

The project serves three purposes:
1. Portfolio case study screenshots and video recordings
2. GitHub repository demonstrating Rob's technical and design capability
3. Interview artifact showing how Rob thinks about enterprise data visualization

---

## What This Is Not

- Not a production monitoring tool
- Not Honeywell's actual product (unbranded recreation from memory)
- Not a design system (uses tokens but is a single-purpose demo)
- Not attempting to replicate the exact Honeywell Forge design system

---

## Original Product Context

Rob spent three years (2022-2025) on Honeywell's APM platform as a UX Designer.
The platform is built for reliability and maintenance engineers at industrial
operators (oil and gas, chemical manufacturing, power generation). Companies
like Shell were target customers.

### What Rob owned
- Redesign of Asset Health dashboard (SUS scores from low 70s to high 80s)
- Ground-up design of Asset Details dashboard (three-level IA)
- Design of a compressor performance dashboard for the Performance Suite
- Research: wrote screeners, ran ~16 moderated usability sessions
- Heuristic evaluation of the separate Warehouse Operations platform

### The engineer's workflow
1. Log in, select a plant (e.g., Baytown Refinery)
2. Land on Asset Health: plant-wide overview of OEE, availability, performance, quality
3. Scan Risk Matrix, Event Summary, Bad Actors to identify problems
4. Filter the Asset Summary table or click a specific asset
5. Drill down to Asset Details: three-level deep dive (Reliability, Maintenance, Performance)
6. Navigate to Trends for attribute-level analysis (discharge pressure, vibration, surge margin)
7. Notifications panel available throughout for real-time alerts

### Key design decisions from the original product
- Research supported tabs for Asset Details (cognitive load reduction). PM and SMEs
  pushed for single page. Compromise: three-level modular IA using existing Forge
  design system cards on a single page.
- Rob designed and tested affordances on KPI cards (hover state with outline + background
  change). Tested against no-affordance variant.
- Run Status timeline uses position (top=running, bottom=off), color, AND shape for
  different event types. Accessibility-driven: not relying on color alone.
- Stakeholders wanted maximum data density. Rob pushed for visual hierarchy and
  breathing room. The tension between density and clarity shaped every layout decision.
- Navigation was last-minute tabs across the top instead of left panel. Created a
  double-tab problem on Asset Details that was never fully resolved.

### What stakeholders compromised
- Too much data in too little space. Cards could have told a clearer story with
  fewer KPIs per view and progressive disclosure.
- Every stakeholder wanted different metrics prioritized. Research findings did not
  consistently change their minds. Tunnel vision on individual requirements.
- The navigation decision (tabs vs left panel) was made late and created downstream
  problems rather than being designed holistically from the start.

---

## Design Principles (for this recreation)

1. **Show the vision, not just the compromise.** This is a portfolio piece. Where
   stakeholders forced suboptimal decisions, this recreation shows what the design
   could have been with more room to breathe.

2. **Dark theme, teal accent.** Enterprise monitoring dashboards benefit from dark
   themes (reduced eye strain for shift workers, better chart contrast). Teal/cyan
   is the primary accent. Blue is reserved for informational semantic states.

3. **Data density with hierarchy.** Engineers need density, but every number needs
   context. KPI cards show value + sparkline + period-over-period change. No bare
   numbers without "compared to what."

4. **Accessibility is encoded in the design.** The Run Status timeline uses position,
   color, AND shape to differentiate event types. Status is never communicated by
   color alone.

5. **Tokenized and consistent.** Every color, spacing value, radius, and font size
   comes from the token system. No hardcoded values.

---

## Design Tokens

### Color Palette (Dark Theme)
| Token | Value | Use |
|-------|-------|-----|
| bg | #0f1117 | Page background |
| surface | #1a1d27 | Card backgrounds |
| surface-raised | #252830 | Elevated elements (tooltips, dropdowns) |
| surface-hover | #2e313b | Hover states |
| accent | #2dd4bf | Primary interactive (teal/cyan) |
| critical | #ef4444 (desaturated for dark) | Critical status |
| warning | #f59e0b (desaturated for dark) | Warning status |
| healthy | #22c55e (desaturated for dark) | Healthy status |
| info | #3b82f6 | Informational (blue, semantic only) |

### Chart Palette (desaturated for dark backgrounds)
Charts use desaturated versions of accent colors to prevent "bleeding"
on dark surfaces. Raw Tailwind colors are too saturated for dark mode.

### Typography (Inter)
| Size | Weight | Use |
|------|--------|-----|
| 11px | 500 | Labels, captions, uppercase section headers |
| 13px | 400 | Body text, table data |
| 14px | 600 | Card titles |
| 20-24px | 700 | KPI values |
| 32px | 700 | Page-level hero metrics |

### Spacing (4px grid)
4, 8, 16, 20, 24, 32, 48, 64px

---

## Constraints

- **NDA:** Cannot use Honeywell branding, Forge design system components, or real
  client data. Everything is recreated from memory with realistic sample data.
- **Recharts:** Limited to what Recharts can render. Custom visualizations (Run
  Status timeline) built as plain React components.
- **Portfolio context:** Must look polished enough for case study screenshots and
  video recordings on the portfolio homepage.
- **No backend:** All data is static sample data in JavaScript files.

---

## Quality Gates

- All colors from tokens, no hardcoded hex values
- Chart colors desaturated for dark mode readability
- All interactive elements have visible hover/focus states
- Status indicators use multiple visual channels (color + shape + position)
- Consistent 4px grid spacing throughout
- No em dashes in any user-facing copy
- All pixel values must be even numbers
- 12-column grid layout system enforced (ARCHITECTURE.md)
- Components must not exceed 400 lines

---

## Target Users

**Primary:** Reliability Manager (PER-001) -- strategic, prevents failures, analyzes trends, runs RCA investigations, manages bad actor programs. Time horizon: 90 days to years.

**Secondary:** Maintenance Manager (PER-002) -- tactical, executes repairs, manages schedules and resources, tracks work order completion. Time horizon: today to next week.

**Not a user:** Technicians/craftspeople (use CMMS mobile for work orders only, not APM analytics).

Both personas use Plant Overview as their morning entry point but look at different sections. See DESK-RESEARCH-003 for the full role comparison.

---

## Research Status

| Type | Location | Status |
|------|----------|--------|
| Personas | `vector/research/personas/` | PER-001 (reliability manager), PER-002 (maintenance manager) -- confirmed |
| Interviews | `vector/research/` | INTERVIEW-001 (product walkthrough), INTERVIEW-002 (engineer decision flow) -- complete |
| Desk research | `vector/research/` | DESK-RESEARCH-001 (dashboard design), DESK-RESEARCH-002 (engineering data), DESK-RESEARCH-003 (user roles) -- complete |
| Figma review | `vector/research/` | FIGMA-REVIEW-001 (gap analysis) -- complete |
| Interaction spec | `vector/research/` | INTERACTION-SPEC-001 -- complete |
| Story/data | `vector/research/` | STORY-001 (Baytown Refinery, 10 assets) -- complete |
| Implementation | `vector/research/` | IMPLEMENTATION-PLAN-001 -- in progress |
| Decisions | `vector/decisions/` | ADR-001 through ADR-009 -- accepted |
| Architecture audit | `vector/audits/` | invest-architecture.md -- health POOR, rebuild needed |
