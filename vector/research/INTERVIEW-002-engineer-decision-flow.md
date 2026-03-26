# INTERVIEW-002 -- Engineer Decision Flow

**Date:** 2026-03-26
**Status:** In progress
**Interviewee:** Rob Jones (UX Designer, Honeywell APM 2022-2025)
**Purpose:** Map the engineer's actual decision chain to redesign the dashboard layout around storytelling, not stakeholder metric requests.

---

## The Morning Routine

### Question 1: What do you look at first?

Three questions in order:

1. **"How's the plant right now?"** -- OEE, Availability, Performance, Quality at a glance. Quick health check. A few sips of coffee before diving in.

2. **"What's on my plate today?"** -- Work orders, cases, what's scheduled, what's priority. This is the to-do list. Who is moving around to fix what. What is priority and what is not.

3. **"What changed overnight?"** -- Assets that went down, new events, things that shifted since last shift. The work orders, cases, and asset downtime help tell this story alongside the top KPIs.

**Key insight:** The current dashboard has no "what's on my schedule" section. Work orders are buried in Asset Details. The engineer's second most important question has no home on the plant overview.

---

### Question 2: When a KPI drops, what happens next?

Scenario: OEE is at 84%, Availability at 82%. Average is 95%.

**The engineer's chain:**

1. Interest is piqued. Not necessarily alarmed, but the drop from average gets attention.

2. First instinct: **"When did this happen?"** Check the trend graph. Preferably with OEE and Availability overlaid since both are down.

3. But also: **check the other KPIs** (Performance, Quality, Utilization) to see how they were affected by the Availability change. The relationships between KPIs tell the story.

4. Hypothesis forming: **"OEE probably dropped because an asset or a few assets went into downtime."** Could be emergency, planned, or unplanned maintenance.

5. Next question: **"Which assets went into downtime?"** And critically: **"Does the timing match up with when OEE and Availability shifted?"** The engineer is correlating the KPI trend with specific asset events.

6. Then: **"What events occurred for those assets to go down?"** Was it unplanned or emergency (needs investigation) or planned maintenance (expected, check it off)?

7. Cross-reference with **work orders** (what's being worked on today) and **cases** (what's currently being investigated for root cause). But these may not show the full picture.

**Key insight:** The engineer is doing temporal correlation in their head: KPI drops at time X, asset goes down at time X, event logged at time X. The dashboard should make this correlation visible, not force the engineer to hold it in memory.

---


### Question 3: What happens when you drill into a critical asset?

Scenario: Compressor K-101 went down at 2AM. Marked critical.

**The engineer's chain:**

1. **"Why is it down?"** Not just that it's down, but the root cause. The status badge says Critical but that's the symptom, not the answer.

2. **"What happened at 2AM?"** Pinpoint the exact moment. Then **look backward** from that moment to see what led up to the trip. The events before the failure are more important than the failure itself.

3. **Root cause thinking:** "Maybe I just fix the creaking door. But maybe the problem is the frame. Fixing the door doesn't fix the frame, and the door will creak again." The engineer is thinking about whether to treat the symptom or investigate the underlying cause.

4. **Sub-asset investigation:** Which specific component failed? Coils, bearings, seals? Are there related issues across other sub-assets that suggest a systemic problem rather than an isolated failure?

5. **Decision point -- how deep to go right now:**
   - Quick: put in a case order for a reliability expert to investigate root cause later
   - Medium: review the sub-asset attributes and recent trends personally
   - Deep: dig into attribute trends (temperature, pressure) going back hours or days before the trip to find the leading indicators

6. **Work order context:** If someone is already working on it, the engineer doesn't just want to know "they're fixing it." They want to know "they are doing X because of Y and Z." The reason behind the work matters, not just the work itself.

7. **Chattering assessment:** Is this a real event or just noise? Repetitive events that don't lead to failure might be ignorable. But the engineer needs to be sure because ignoring a real signal "could mean it goes kaboom 5 minutes later." This is a high-stakes judgment call that requires confidence in the data.

8. **Trends deep dive:** When sub-asset attributes look suspicious, the engineer goes to Trends to look at temperature, pressure, vibration over a longer window (maybe 12PM to 2AM, or days/weeks back). They're looking for the slow degradation that preceded the acute failure.

**Key insights:**

- The engineer reads the dashboard BACKWARD in time. They start at the failure and work backward to find the cause. The dashboard should support this temporal investigation flow.
- Root cause vs symptom is the core tension. The dashboard should help distinguish "fix this now" from "investigate why this keeps happening."
- Chattering (repetitive non-critical events) is a real UX problem. The engineer needs confidence to ignore noise, which means the dashboard must clearly differentiate real signals from chatter.
- The drill-down from Asset Details to Trends is driven by specific attributes on specific sub-assets. It's not a general "show me trends." It's "show me what bearing vibration was doing in the 12 hours before the trip."

---


### Question 4: Work orders vs cases, and what belongs on the plant overview?

**Work Orders:**
- An order to do work. A task. Straightforward.
- Priority is critical. "Fred is free, he can get to that asset in 5 minutes."
- Contains: which asset, what task (informed by the platform's event data)
- Someone takes it, goes to the asset, begins the hands-on work
- Completed when the task is done

**Cases:**
- Deeper investigation. More weight than a work order.
- "We need to dive into this and figure out the underlying problems."
- Opened by a reliability engineer when something needs root cause analysis
- Contains: the event, the asset, key metrics (e.g., "temperature increased by X at the time the event occurred"), sub-asset data
- A case stays open until all resulting work orders are complete AND the asset is running without anomalies or deviance
- A case may result in zero work orders if the finding is "this is noise, no action needed." Not every investigation leads to action.
- Or it may result in multiple work orders if the investigation reveals several components need attention.
- Flow: Case opened > investigation > findings > work orders created (or not) > work orders completed > case closed

**What belongs on the plant overview:**
- Number of open cases
- A glimpse into where each case stands: has it been opened? Has someone begun investigation? Are there active work orders tied to it?
- General context, enough to pique interest alongside the other overview data (KPIs, events, bad actors)
- Not the full case detail. Just enough to decide "I need to dig into this one" vs "that's being handled"

**Fault Tree:**
- Engineers also use fault tree analysis to trace events through the asset hierarchy
- Shows which sub-assets, which attributes (temperature, volume, vibration) deviated
- A normal fault tree structure: event at top, branches down through possible causes
- Another entry point for investigation alongside Trends

**Key insights:**

- Cases are the investigation layer. Work orders are the action layer. Cases may or may not create work orders depending on findings.
- On the plant overview, the engineer wants a STATUS view of cases ("how many, where are they at") not a detail view. Just enough context to decide whether to dive in.
- The fault tree is a third investigation path alongside Asset Details and Trends. The engineer may enter investigation through any of these depending on what they're looking for.

---


### Question 5: Where does investigation end and action begin?

**Work order and case creation:**
- Both are created from within the platform, not a separate system
- Work Order Dashboard exists (was completed). Case Order Dashboard was still in backlog when Rob left.
- Orders can potentially be created from multiple contexts: Asset Details, Trends, Fault Tree, maybe even the plant overview if enough information is available at that point

**Assignment model:**
- Work orders can be assigned to someone but don't need to be
- It's a team. Assignment is based on: availability, skillset match, criticality/severity/priority
- Could be an algorithm that suggests the right person based on those factors
- Or it can go into a backlog so when someone with the right skillset is available they pick it up
- Priority determines urgency: critical means ASAP, lower priority waits in the queue

**Contextual creation (UX question Rob identified):**
- If created from a context other than the dedicated dashboard (e.g., from Asset Details), it should be contextual: a button opens a modal pre-filled with the asset information, relevant events, and timestamps
- But this raises a UX question: is the modal the right pattern, or would the natural flow bring the engineer to the dedicated dashboard anyway?
- If a modal opens, should there be a link to the full dashboard from within it? Rob notes "that doesn't sound like good UX"
- Rob's instinct: let UX principles and heuristics guide this rather than forcing a pattern

**Consolidation question:**
- Work Orders and Case Orders are currently separate dashboards. Could they be consolidated? Rob flagged this as an open question worth exploring.

**Key insights:**

- The platform is the system of record. Engineers don't leave it to take action.
- Assignment is flexible, not rigid. Skillset + availability + priority drive who gets the work.
- The best UX would pre-fill context (asset, events, timestamps) when creating an order from within an investigation flow
- The Case Order Dashboard was never built. This is an opportunity in the portfolio recreation to show what it could have looked like.

---

## Summary: The Engineer's Decision Chain

```
1. ORIENT     "How's my plant?" → KPIs at a glance
2. PLAN       "What's on my plate?" → Work orders, cases, schedule
3. DETECT     "What changed?" → Events, assets down, KPI shifts
4. CORRELATE  "When did this happen?" → KPI trends overlaid with asset events
5. IDENTIFY   "Which asset?" → Asset Summary filtered/sorted by severity
6. INVESTIGATE "Why?" → Asset Details, sub-assets, read backward in time
7. DEEP DIVE  "What led to this?" → Trends (specific attributes, specific time range)
8. DECIDE     "Fix the door or fix the frame?" → Root cause vs symptom
9. ACT        "Create a case or work order" → Contextual, pre-filled, flexible assignment
10. VERIFY    "Is it fixed?" → Asset running without anomalies, case closed
```

This 10-step chain should drive the dashboard layout. Each section of the dashboard
answers one or two steps. The engineer flows through them naturally without having
to hunt for information or hold temporal correlations in their head.

