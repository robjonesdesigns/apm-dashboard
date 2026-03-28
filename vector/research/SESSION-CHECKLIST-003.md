# SESSION CHECKLIST -- Next Session

**Date:** 2026-03-27 (created end of session)
**Status:** Ready for next session

---

## START HERE

### 1. Risk Matrix redesign (highest priority)

Three views from Figma reference (screenshots on Desktop, 2026-03-27 2:42-2:43 PM):
- **View 1: Asset Priority** -- single row, 3 blocks (High/Medium/Low) with asset counts
- **View 2: Event Status** -- 2x3 grid (New/In Progress x High/Medium/Low), click-to-filter
- **View 3: Event Summary** -- 4x5 grid (Criticality x Severity), most detailed

Decisions needed:
- Which views to support? All 3 or just 2? View 3 may be too sparse with only 10 assets.
- View switcher: dropdown (Figma) vs chip toggle (simpler, all options visible, Nielsen H6)
- Click-to-filter interaction: purple/teal border on selected cell → filters Asset Table below
- Data: `RISK_MATRIX` in assets.js needs to support all selected views
- Desk research needed: risk matrix interaction patterns, click-to-filter UX, view switching

Figma reference: https://www.figma.com/design/5CBDKKR3S9zTmCNWqJzSYK/Asset-Health?node-id=1-60687

### 2. Event Summary card refinement

Research (DESK-RESEARCH-010) recommends renaming to "Alarm Quality" and reframing:
- Confirmed vs false positive ratio (donut or stacked bar -- current stacked bar works)
- Alarm rate trend (sparkline, last 7 days)
- Standing alarm count
- Decision: keep current stacked bar approach or switch to donut?
- The chip tabs (Events/Cases) are a good pattern -- keep or rethink?

### 3. Bad Actors card refinement

Research recommends replacing with "Repeat Offenders" (30-day window, not today):
- Show assets with highest repetitive event count over 30 days
- Each row: asset name, repetitive count, trend direction, last occurrence
- Data: needs new `REPEAT_OFFENDERS` export in assets.js
- Decision: keep horizontal bar chart or switch to ranked list?

### 4. Asset Table column review

Research recommends trimming from 9 to 7 columns:
- Keep: Status, Asset, Priority, OEE, Active Events, RUL
- Add: Last Event (time + one-line description)
- Drop: Repetitive Events (covered by Repeat Offenders), Downtime (Asset Inspection detail), Work Orders count (Today's Activity)

### 5. Notifications Panel polish

Rebuilt this session with:
- Two-panel drill-in (list → event details with Description/Cause/Consequence/Recommendations)
- Filter chips (All/Critical/Warning/Info)
- Unread indicator (teal dot) + new state (teal tint bg)
- Quick Access links (Asset Details, Event Trend, Fault Tree)
- "Go to Event Log →" footer

Needs testing and visual review in browser.

### 6. Run full architecture audit

Major changes this session -- need to verify token compliance, import direction, layer separation.

### 7. Remaining screens (lower priority)

- Asset Inspection screen (stubbed)
- Root Cause Analysis (fault tree -- ADR-007)
- Trends screen with K-101 degradation data
- KPI Trend Modal (ADR-013 Layer 2)
- Event Log Page (ADR-013 Layer 3)
- Work Orders page
- Investigations page

### 8. Deploy to Vercel for portfolio

---

## COMPLETED THIS SESSION

### Key Events / Impact Strip ✅ (fully refined)
- 3 ADRs (012, 013, 014 revised), 2 desk research docs (008, 009)
- Three-act narrative: trigger → consequence → confirmation
- Track at 82% width, dashed continuation line to card edge
- All labels left-aligned under dots (supersedes L/C/R)
- Major dots: white neutral markers (not semantic colors)
- Minor dots: gray at rest, brighten on hover, 30px hit area
- Impact text color follows event severity type (not string parsing)
- E-105 removed, replaced with K-101 bearing damage at 6:45 AM
- "See full timeline →" right-aligned under dashed line
- Mobile: vertical stack with white dots
- STORY-001 updated to match

### Notifications Panel ✅ (rebuilt)
- Two-panel architecture (list → event details)
- Severity badges, filter chips, unread states
- Event details: Description, Cause, Consequence, Recommendations (story-accurate)
- Quick Access links to Asset Details, Event Trend, Fault Tree
- Dark theme adaptation of Forge Right Rail documentation

### Data consistency ✅
- K-101 RUL updated: 0 days → 5 days (matches timeline)
- NOTIFICATIONS[0] updated: E-105 → K-101 bearing damage
- STORY-001 timeline table updated
- All data cross-referenced: PLANT, ASSETS, TIMELINE, WORK_ORDERS, CASES, NOTIFICATIONS

### Legend component ✅
- Shared Legend.jsx: swatch + text label + optional value
- Configurable shape (square/circle/line)
- Interactive mode with click-to-isolate dimming
- WCAG SC 1.4.1 compliant (color never sole encoding)
- Centered, pinned above card bottom padding
- Applied to RiskMatrix, EventSummary, BadActors (replaced gradient bars)
- DESK-RESEARCH-011 documented

---

## DOCTRINE INVENTORY

| Type | Count |
|------|-------|
| ADRs | 14 |
| Desk research | 11 |
| Interviews | 2 |
| Personas | 2 |
| Story | 1 |
| Interaction spec | 1 |
| Figma review | 1 |
| Architecture audit | 1 (needs re-run) |
