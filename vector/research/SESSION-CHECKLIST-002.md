# SESSION CHECKLIST -- Next Session

**Date:** 2026-03-27 (created end of session)
**Status:** Ready for next session

---

## START HERE

### 1. Fix minor event dot touch targets
- Current: 6px dot with 6px hit area. Nearly impossible to hover.
- WCAG 2.5.5: minimum 44x44px touch target recommended.
- Fix: keep visual dot at 6px but expand the invisible hit area to a 30px circle (15px radius around the dot).
- Ensure ALL 9 minor events have tooltips (some may be missing).
- Major dots: no hover circle needed (text info is already visible below).
- Major dots: no click interaction (just informational).

### 2. Desk research needed (catch up Key Events + Today's Activity)

**Key Events timeline research:**
- How do Grafana, Datadog, Splunk visualize horizontal event timelines?
- What are the touch target standards for interactive timeline markers?
- How do timelines show causal relationships between events (not just sequence)?
- Rob wants to "connect the dots" -- see if one event caused a chain of others
- Should the timeline show connecting lines between related events (e.g., K-101 trip → WO opened → case opened)?

**Today's Activity research:**
- Rob is unsure about the right information density per WO row
- Research: what metrics matter most on a WO card at 7 AM?
- Research: should the triggering event be shown inline (DESK-RESEARCH-008 said yes)?

### 3. Rethink the three analysis cards

**Risk Matrix:**
- Current: colored grid with numbers. Is this the right triage pattern?
- Research: how do engineers actually triage assets by priority?
- The filter interaction (click cell → filter Asset Table) is important for the portfolio demo
- Need more research and detail

**Event Summary:**
- Current: stacked bar + large callout number
- Is this useful or redundant with the Asset Table and Impact Strip?
- Research to determine if it stays, changes, or gets removed

**Bad Actors:**
- Current: horizontal bar chart of top assets by event count
- Potentially redundant with Asset Table (which shows the same data sortable)
- Research to determine its unique value

### 4. Asset Table
- Which metrics should be surfaced?
- Should it show triggering event per asset?
- How does the story data inform the column choices?
- More desk research needed

### 5. Update doctrine to match
- After research, update DESK-RESEARCH docs
- Write any new ADRs for decisions made
- Run architecture audit
- Ensure Key Events and Today's Activity doctrine depth matches KPI Bar

---

## COMPLETED SECTIONS (refined through design cycle)

### KPI Bar ✅
- 7 ADRs, 6 desk research docs
- All decisions documented: colors, icons, labels, tooltips, delta, health indicators
- Audit: CLEAN

### Impact Strip / Key Events ✅ (visual done, needs research depth)
- 3 ADRs, 1 desk research doc
- Timeline visual working: major dots + minor dots + card + left/center/right alignment
- NEEDS: touch target fix, research on timeline patterns, causal relationship display

### Today's Activity ✅ (functional, needs research depth)
- 3 ADRs, 3 desk research docs
- Cards working: WO + Investigations, priority badges, hover, truncation, footer links
- NEEDS: research on optimal WO row content, triggering event inline

---

## DOCTRINE INVENTORY

| Type | Count |
|------|-------|
| ADRs | 14 |
| Desk research | 8 |
| Interviews | 2 |
| Personas | 2 |
| Story | 1 |
| Interaction spec | 1 |
| Figma review | 1 |
| Architecture audit | 1 (needs re-run after all fixes) |
