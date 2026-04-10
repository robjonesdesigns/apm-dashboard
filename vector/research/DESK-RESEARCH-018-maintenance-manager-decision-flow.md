# DESK-RESEARCH-018: Maintenance Manager Decision Flow

**Date:** 2026-04-03
**Purpose:** Map Diane's (PER-002) daily decision chain through the APM dashboard. Identify what she needs from APM vs CMMS, and what screens/data must serve her workflow.

---

## 1. Diane's Daily Decision Chain

### Morning Sequence (6:00-7:30 AM)

| Step | Question | Source | APM Role |
|---|---|---|---|
| 1 | What broke overnight? | Shift logs, emergency WOs | Condition context on failures |
| 2 | Who's available today? | CMMS, staffing board | None (CMMS) |
| 3 | Can today's schedule absorb the emergencies? | CMMS schedule vs resources | None (CMMS) |
| 4 | Which emergencies get resources NOW? | Safety > production > criticality | Criticality data, health context |
| 5 | Which planned work still goes forward? | CMMS schedule | Health data to validate priority |
| 6 | Which PMs can slip? | Condition data + criticality | **Primary APM value**: condition-backed deferral decisions |
| 7 | Does anything else need attention before it becomes an emergency? | APM alerts, health trends | **Primary APM value**: early warning |

### Coordination Meeting (7:00-7:30 AM)

Attendees: Diane, supervisors, operations rep, planner.

Diane uses APM data here to answer operations questions:
- "Is this pump going to make it to the turnaround in 6 weeks?" (RUL data)
- "Should we be worried about this compressor?" (health trend + threshold proximity)
- "Is this a real problem or another false alarm?" (condition data context)

### Throughout the Day

| Trigger | Action | APM Role |
|---|---|---|
| New alert fires | Assess severity + criticality to decide response speed | Health score, criticality, threshold proximity |
| Supervisor asks for priority guidance | Check asset condition to differentiate "routine" from "urgent" | Condition context on the WO |
| Operations requests maintenance | Validate the request against condition data | Sensor trends, health score |
| PM coming due on a degrading asset | Pull PM forward | Health trend showing degradation |
| PM coming due on a healthy asset | Potentially defer (with reliability engineer agreement) | Condition data confirming health |

### End of Week Review

| Metric | What She's Checking | APM Provides |
|---|---|---|
| PM Compliance | Are we hitting 90%+ on critical assets? | PM compliance by criticality tier |
| Schedule Compliance | Did we execute the plan? | Not primary APM (CMMS), but health context |
| Emergency WO Rate | Is reactive work trending down? | Correlation: alerts caught early = fewer emergencies |
| Backlog Health | 2-4 weeks = healthy | Not primary APM (CMMS) |
| Assets at Risk | What's degrading that we need to plan for next week? | Health trends, threshold proximity, RUL |

---

## 2. What Diane Needs from APM (not CMMS)

### The Core Value Proposition

Diane's CMMS tells her WHAT to do and WHO is doing it. APM tells her WHY it matters and HOW URGENT it really is.

**The condition context that changes scheduling decisions:**

1. **"This isn't just a routine bearing job"** -- This asset has been trending toward failure for 3 weeks and it's criticality A. Move it to the front of the schedule.
2. **"This PM can wait"** -- Condition data shows the asset is healthy. No degradation trend. Defer 2 weeks to handle the emergency instead.
3. **"This is about to become an emergency"** -- Sensor readings crossing from normal to warning band. Schedule proactively before it becomes a breakdown.
4. **"Was this a miss?"** -- Post-incident, check whether APM data showed warning signs that were overlooked.

### When Diane Opens APM

She does NOT live in APM. She opens it for specific questions:

| Question | Frequency | Screen |
|---|---|---|
| "Should I be worried about this asset?" | Multiple times daily | Plant Overview (health indicators) or Asset Inspection (detail) |
| "Can this wait until turnaround?" | Weekly (planning) | Asset Inspection (RUL, degradation trend) |
| "Did we miss warning signs?" | After incidents | Asset Inspection (sensor history, event timeline) |
| "What's degrading that I need to plan for?" | Weekly review | Plant Overview (watch list, health trends) |
| "Are our PMs actually preventing failures?" | Monthly | PM Compliance + MTBF correlation |

---

## 3. How Diane Consumes Dashboards vs Carlos

| Dimension | Diane (Maintenance) | Carlos (Reliability) |
|---|---|---|
| Session length | 2-5 min, multiple times/day | 15-60 min, deep analysis |
| Mode | Scanning for exceptions | Investigating patterns |
| Wants to see | Status, counts, action items | Trends, distributions, correlations |
| Decision output | "Send someone to look at this" | "Change the PM interval on this asset class" |
| Tolerance for complexity | Low -- needs immediate clarity | High -- expects to interpret data |
| Mobile | Yes, walking the plant | Rarely, desk-based |
| Time horizon | Today to next week | 90 days to years |

### The Design Implication

Diane needs the APM dashboard to be an **exception-based alert list with health summaries**. She wants it to say "3 assets need attention" -- not give her the data to figure that out herself.

Carlos wants the same dashboard to be an **investigation workbench**. He wants all the data, because his job is to find patterns the system hasn't been told to look for.

**Progressive disclosure serves both:** Summary layer for Diane (status + next recommended action). Analysis layer for Carlos (trends + failure data + sensor detail).

---

## 4. Plant Overview Gaps for Diane

Current Plant Overview sections and how they serve each persona:

| Section | Carlos (Reliability) | Diane (Maintenance) |
|---|---|---|
| System Health KPIs | Primary scan | Useful but not her KPIs |
| What Happened (Impact Strip) | Primary trigger for investigation | Sees it, but needs WO context |
| In Progress (WOs + Investigations) | Checks investigation status | **Her section** -- but missing schedule context |
| Needs Action (Triage + Alarms + Watch List) | Primary action items | Useful for planning ahead |
| Asset Table | Drill-down to investigation | Scans but rarely drills in |

**Missing for Diane:**
- PM Compliance (plant-wide, by criticality tier)
- Schedule Compliance
- Planned Maintenance Percentage (PMP) -- the single metric that tells you if you're proactive or reactive
- Backlog depth (weeks of work)
- Emergency WO rate (trending -- is reactive work going up or down?)
- Overdue PM count (which assets, what criticality)

**These could live in a "Maintenance Performance" card or section on Plant Overview**, visible to both personas but primarily Diane's.

---

## 5. Asset Inspection: How It Serves Both Personas

### What Diane needs at the asset level (quick scan):
- Current status (running, down, in maintenance)
- Health score and trend direction (improving/stable/degrading)
- Active alerts with severity
- Open work orders against this asset
- Last PM date and next PM due
- Recommended action (if any)

### What Carlos needs at the asset level (deep investigation):
- Full condition monitoring trends (vibration, temperature, pressure)
- Threshold proximity for each sensor
- Failure history and failure mode analysis
- MTBF for this asset vs class average
- RUL estimate with confidence interval
- P-F curve position
- Root cause analysis records
- Sub-asset drill-down to component level

### The narrative flow serves both:

1. **KPIs** (both scan this -- Diane for status, Carlos for starting point)
2. **Who's on it** (Diane's primary section -- WOs and investigations)
3. **Event history** (Carlos investigates, Diane scans for pattern)
4. **Preview cards** (Carlos's doorways to Trends/Fault Tree/Performance; Diane rarely goes here)
5. **Sub-asset data table** (Carlos's investigation surface; Diane may check which component a WO targets)

---

## 6. PM Deferral Decision Framework

This is one of Diane's most consequential uses of APM data:

**Can defer if:**
- Asset is low-criticality (C/D -- non-production, redundant, has standby)
- Condition data shows healthy (sensors in normal range, no degradation trend)
- PM interval has built-in margin (OEM recommendations often conservative)
- Deferral window is short (days, not weeks)

**Cannot defer if:**
- Asset is high-criticality (A -- no redundancy, single point of failure)
- Regulatory/compliance PM (PSM, OSHA, EPA)
- Condition data shows degradation trending toward alarm threshold
- Historical data shows this asset type fails shortly after PM interval

**APM data required:** Health score, sensor trend direction, threshold proximity, criticality grade, PM compliance history for this asset.

---

## Sources
- SMRP Best Practices (5 pillars: Business, Manufacturing Process Reliability, Equipment Reliability, Organization/Leadership, Work Management)
- IDCON (Christer Idhammar) on daily maintenance meetings and planning cycles
- McKinsey "What High-Reliability Organizations Get Right"
- Reliabilityweb on maintenance vs reliability role definitions
- Accendo Reliability literature review on role differences
- Spartakus Technologies on CMMS vs APM differences
- PEMAC on APM/CMMS relationship
- UXmatters "UX for the Industrial Environment" (3-part series)
- Software Advice "Top 3 KPIs for CMMS Dashboard"
- Plant Services on morning meetings in manufacturing
