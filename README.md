# Asset Performance Management Dashboard

Unbranded recreation of enterprise APM dashboards I designed at Honeywell (2022-2025). Built for reliability engineers monitoring industrial equipment at scale.

**Live:** https://apm-dashboard-eosin.vercel.app
**Case study:** https://designedbyrob.com/projects/honeywell-apm

## What this is

A working React prototype of the Plant Overview screen: the dashboard reliability engineers see first thing in the morning. Dark theme, real data model (10 assets, 65 sub-assets, 9 events), interactive charts, and a unified filter system.

Honeywell NDA prevents showing the original product. This is my vision of what it should have been, grounded in the research I ran and the design decisions I made during the original engagement.

## Stack

React 19, Tailwind v4, Vite. All data is static (no backend). Charts are pure React and SVG (no Recharts on interactive elements).

## Design artifacts

- **24 ADRs** documenting every design decision (`vector/decisions/`)
- **16 desk research docs** covering WCAG, ISA-101, Carbon Design System, typography, iconography (`vector/research/`)
- **2 user personas**, 2 interviews, 2 stories (`vector/research/`)
- **WCAG 2.1 AA** accessibility: keyboard navigation on all charts, focus management, screen reader support, reduced motion

## Key design decisions

- Five distinct icon systems that never collide (event severity, WO urgency, investigation status, asset criticality, asset status)
- ISA-101 "dark and quiet" philosophy with earned alarm states
- Status never conveyed by color alone (WCAG SC 1.4.1)
- Workflow-centered layout: System Health, What Happened, In Progress, Needs Action, Assets

## Author

Rob Jones -- Product Designer
https://designedbyrob.com
