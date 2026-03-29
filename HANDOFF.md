# APM Dashboard Handoff -- Session 13

## START HERE
Plant Overview is complete and deployed. Portfolio case study is live with videos, before/after, and research images. Next: KPI card modals, then Asset Inspection screen.

## Deployed
- **APM Dashboard**: https://apm-dashboard-eosin.vercel.app
- **Portfolio case study**: https://designedbyrob.com/projects/honeywell-apm

## Completed this session

### Plant Overview (complete)
- Naming: Requires Attention, Event Triage, Watch List, Alarm Quality (no Case Status)
- Data reconciliation: 21 events, newEvents/inProgressEvents per asset
- Asset Table: 9 columns, smart search (autocomplete), pagination (10 rows), sortable headers, shared FilterButton, Event Triage filter integration, fixed height (measured rows)
- Typography: 13 classes consolidated to 9, zero inline font-size overrides
- Color audit: zero inline hex/rgba, all tokenized including shadows
- WO urgency: Emergency/Urgent/Scheduled (WoPriority.jsx, circle icons, neutral gray)
- Five icon systems: events (tally bars), investigations (triangles), WO urgency (circles), criticality (letter pills), asset status (dots)
- Impact Strip: three cards (Trigger/Consequence/Confirmation), grid-thirds
- Watch List: pure React bars (no Recharts), cursor-following tooltip, CriticalityIndicator inverted prop
- Notifications: shared FilterButton (severity multi-select), count badge removed

### Shell
- Sidebar: hover-to-expand (desktop), full-screen drawer with branding (mobile)
- TopBar: "Asset Performance Management", hamburger on mobile
- NotificationsPanel: 320px push (desktop), full-screen overlay (mobile)
- All Feather/Lucide icons, shared feather base object
- Responsive: useIsMobile hook at 671px breakpoint
- Events added to sidebar nav

### Portfolio updates
- APM live URL + "View live site" link
- 3 APM videos on Cloudinary (muted via ac_none)
- Alternating mobile card positions (APM left, Keytrn right)
- Branded card backgrounds: APM soft teal (#95d1c9), Keytrn deep navy (#1b2745)
- Before/after: original Honeywell screenshot + redesign video
- Research images: usability session (screen share), affinity map (Miro, reliability engineer data)
- Five-icon-system design decision added
- Process section: structured paragraphs + bullet points (reusable pattern)
- Orientation note: built in React, sourced from IBM's Carbon Design System

## Next priorities

### 1. KPI card modals
- Click a KPI card to see trend detail (sparkline, threshold context, period comparison)
- Modal or inline expansion? Need to decide pattern.

### 2. Asset Inspection screen
- Three-level IA: Reliability / Maintenance / Performance
- Drill-down from Asset Table and Watch List

### 3. Events screen
- Full timeline with minor events (moved from Impact Strip)
- Event log with filtering, sorting

### 4. Remaining screens (placeholders)
- Root Cause, Trends, Work Orders, Investigations, Settings

### 5. Donut color review
- Desaturated Carbon palette may need adjustment

## Doctrine inventory
- 22 ADRs (001-022)
- 15 desk research docs
- 2 interviews, 2 personas, 1 story

## Shared components
- Badge.jsx -- event severity (tally + fill hierarchy)
- CriticalityIndicator.jsx -- asset criticality (A/B/C/D, inverted prop)
- Legend.jsx -- chart legend (swatch + label + value)
- FilterChip.jsx -- dismissable filter tag
- FilterButton.jsx -- filter button + checkbox dropdown
- WoPriority.jsx -- WO urgency (circle icons + text)
