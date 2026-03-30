# APM Dashboard Handoff -- Session 16 End

## START HERE
Massive mobile responsive pass + data surfacing improvements. Mobile layout fully reworked: KPI cards simplified, Asset Table as stacked list with filter/sort drawer, Needs Action as swipeable carousel, tooltips suppressed, dead links cleaned up. Dense mode toggle added for desktop power users. Cross-card alignment in In Progress. Criticality badge surfaced on Event Feed and WO/Investigation rows. Compact severity badge on Asset Table events column. Component renames: TodaysActivity -> InProgress, BadActors -> WatchList. 26 ADRs, 16 desk research docs.

## Deployed
- **APM Dashboard**: https://apm-dashboard-eosin.vercel.app
- **Portfolio case study**: https://designedbyrob.com/projects/honeywell-apm

## Next session priorities

### 1. In Progress cards -- mobile layout
WO and Investigation card rows are squished on mobile. Content overlaps. Need to decide what to surface per row on small screens -- likely simplify to: WO ID + task (line 1), asset + criticality (line 2), urgency indicator. Same for Investigations. May need a mobile-specific row like the Asset Table approach.

### 2. Asset Inspection screen
All the rules are in place. Biggest build, needs the other fixes shipped first. Drill-down view for a single asset. Three-level IA:
- **Reliability**: failure risk, remaining useful life, event history
- **Maintenance**: alerts, work orders, case management
- **Performance**: OEE, operational metrics, trend data

65 sub-assets with sensors, thresholds, statuses, narratives, and lessons already in the data model (`src/data/assets.js`). Sub-asset tree lets engineers isolate which components are affected without leaving the page.

Re-enable asset row navigation: swap `onAssetClick={null}` back to `onAssetClick={(asset) => onNavigate('details', { asset })}` in PlantOverview.jsx.

### 3. Portfolio updates
- Replace "coming soon" APM case study assets with Asset Inspection screen videos/images
- `/design-system` route (differentiator for hiring managers)

### Backlog

**Full event timeline reconciliation** -- Currently RISK_MATRIX counts (newEvents/inProgressEvents) are hardcoded per asset and don't derive from TIMELINE. TIMELINE only covers the last 24 hours (9 events), but asset counts represent all active events across a longer window. To reconcile: expand TIMELINE with the full set of events that back the asset-level counts, then derive RISK_MATRIX and EVENT_SUMMARY from TIMELINE instead of hardcoded numbers. This gives investigations a complete drill-down timeline and makes the Risk Matrix cells clickable through to actual event records, not just a filtered asset list.

## What was completed this session

### Mobile responsive pass (ADR-025)
- Card padding: 16px mobile, 24px desktop
- KPI cards: 24px values, hidden info icons + delta rows, health indicator retained
- Asset Table: stacked mobile rows (status+name, type, criticality+severity+events), full-screen filter/sort drawer with sort pills + filter checkboxes + Clear All/Done
- Needs Action: CSS scroll-snap carousel with dot indicators, equal-height cards
- Tooltips: suppressed on mobile (RiskMatrix, AlarmQuality, WatchList, EventSummary)
- Dead links: all placeholder navigation stripped (Event Feed, In Progress, Impact Strip, KPI bar, Asset Table rows)
- FilterChip: nowrap + flexShrink fix for long labels
- Search input: responsive width (fills container on mobile)
- `useIsMobile` hook extracted to shared module
- `slideUp` keyframe animation for drawer
- `.hide-mobile`, `.hide-scrollbar`, `.carousel-slide` utility classes

### Dense mode + cross-card alignment (ADR-026)
- Segmented control in TopBar (grid/list icons, teal active state)
- Dense mode: card padding 12px, section gaps 24px, grid gaps 12px, page padding 16px
- localStorage persistence (`apm-dense` key)
- Visible on both desktop and mobile
- In Progress: fixed 100px right column for urgency/status, assignee, timestamp across WO and Investigation cards

### Data surfacing improvements
- Event Feed: CriticalityIndicator badge on notification cards and event detail drill-in
- Asset Table: compact severity Badge (tally marks only, no text) next to event count
- Badge.jsx: new `compact` prop for tally-only rendering
- Mobile Asset Table rows: severity badge + event count on criticality line
- In Progress: CriticalityIndicator on WO and Investigation rows (next to asset name)

### Component renames
- `TodaysActivity.jsx` -> `InProgress.jsx` (matches "In Progress" section name)
- `BadActors.jsx` -> `WatchList.jsx` (matches "Watch List" card title)
- All imports updated, old files removed

### Accessibility
- Event Feed: tabIndex + role + onKeyDown on all type-link spans (then removed when links made static)
- Watch List tooltip: viewport clamping to prevent right-edge overflow
