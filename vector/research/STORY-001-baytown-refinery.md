# STORY-001 -- Baytown Refinery: The Holistic Data Story

**Date:** 2026-03-26
**Status:** Draft
**Purpose:** Every data point in the dashboard tells one consistent story. This document defines that story. All sample data in assets.js must align with this narrative.

---

## Setting

**Baytown Refinery, Baytown TX.** Hydrocracker unit. Tuesday morning, 7:00 AM.
The night shift had an incident. You are a reliability engineer starting your day.

---

## The Headline: Compressor K-101 Trip

Centrifugal compressor K-101 (H2 recycle gas service, API 617, Elliott Group, installed 2018) tripped at **2:03 AM** on high bearing vibration.

**Root cause chain (textbook critical):**
1. Lube oil filter began bypassing 3 weeks ago (contamination buildup)
2. Oil quality degraded gradually (particulate contamination)
3. Hydrodynamic bearing film thinned over 10 days
4. Bearing temperature began climbing (Day 18: 82C, above the 75C monitoring threshold)
5. Vibration followed (Day 22: 4.2 mm/s, crossed the 4.5 warning threshold on Day 24)
6. Oil pressure dropped below alarm at 1:45 AM (1.0 bar, auxiliary pump auto-started at 1.2 bar)
7. Vibration spiked to 7.8 mm/s at 2:00 AM
8. Trip on high vibration at 2:03 AM (threshold: 7.1 mm/s)
9. Availability dropped from 94.2% to 82.1% instantly
10. OEE followed: 87.4% down to 81.5%

**Why it matters:** K-101 is single-train, no installed spare. Criticality: A (Safety). The hydrocracker is offline until K-101 is back. Lost production: ~$3M/day.

---

## The 10 Assets

Every asset has a consistent set of attributes, events, work orders, and cases that connect to the main story.

### 1. Compressor K-101 (CRITICAL)
- **Service:** H2 Recycle Gas
- **Process Unit:** Hydrocracker
- **Criticality:** A (Safety)
- **Status:** TRIPPED (down since 2:03 AM)
- **OEE:** 64.2% (was 91.8% before trip)
- **Priority:** High
- **Active Events:** 8
- **Repetitive Events:** 3 (vibration alerts over the past week -- this was the early warning nobody acted on)
- **Downtime:** 5h (and counting)
- **RUL:** 0 days (needs repair before restart)
- **MTBF:** 312 hrs (declining -- was 420 hrs 6 months ago)
- **MTTR:** 4.2 hrs (for the last minor repair; this one will be 72-96 hrs)
- **Work Orders:** 2 active (bearing inspection, lube system flush)
- **Cases:** 1 open (root cause analysis: recurring bearing degradation)
- **Key attributes at trip:** Vibration 7.8 mm/s, Bearing temp 112C, Oil pressure 0.9 bar, Surge margin 6%, Discharge pressure 71 bar (normal: 85), Polytropic efficiency 72.4% (normal: 82%)

### 2. Pump P-203 (WARNING)
- **Service:** Hydrocracker feed pump
- **Process Unit:** Hydrocracker
- **Criticality:** B (High) -- installed spare P-204 available
- **Status:** RUNNING (degraded)
- **OEE:** 78.4%
- **Priority:** High
- **Active Events:** 4
- **Repetitive Events:** 2 (discharge pressure low alerts)
- **Downtime:** 0h (still running but underperforming)
- **RUL:** 45 days
- **Work Orders:** 1 active (seal inspection on discharge side, assigned to Fred Martinez, started 4h ago)
- **Cases:** 0
- **Story:** Discharge pressure has been trending 8% below normal for a week. Likely mechanical seal wear allowing internal recirculation. Not urgent because spare pump P-204 can take over, but if P-203 fails during the K-101 outage, the hydrocracker restart gets delayed further.

### 3. Cooler C-201 (WARNING)
- **Service:** Compressor interstage cooling
- **Process Unit:** Hydrocracker
- **Criticality:** B (High) -- no spare, but can run at reduced capacity
- **Status:** RUNNING (anomaly detected)
- **OEE:** 82.1%
- **Priority:** Medium
- **Active Events:** 3
- **Repetitive Events:** 1 (vibration anomaly on intake valve, flagged 3 times in 2 weeks)
- **Downtime:** 0h
- **RUL:** 110 days
- **Work Orders:** 0
- **Cases:** 1 open (vibration anomaly investigation, opened 8h ago, unassigned)
- **Story:** The intake valve vibration might be related to the K-101 trip. When K-101 tripped, the sudden flow change could have caused transient vibration in C-201. Or it could be an independent issue. The case was opened to figure out which. This is a "is it connected or coincidence?" investigation.

### 4. Turbine T-401 (HEALTHY -- scheduled maintenance)
- **Service:** Power generation turbine
- **Process Unit:** Utilities
- **Criticality:** B (High) -- redundant power sources available
- **Status:** PLANNED OUTAGE
- **OEE:** 88.1%
- **Priority:** Low (planned)
- **Active Events:** 1 (scheduled maintenance notification)
- **Repetitive Events:** 0
- **Downtime:** 8h (planned, started at 6:00 AM)
- **RUL:** 180 days (after maintenance completion)
- **Work Orders:** 1 active (combustion inspection, assigned to Mike Torres, scheduled for today)
- **Cases:** 0
- **Story:** Routine combustion inspection at 12,000 hour interval. Expected 5-7 day outage. This was planned months ago and has no relation to the K-101 event. But the timing is unfortunate -- having T-401 down during the K-101 crisis means reduced power generation capacity.

### 5. Heat Exchanger E-105 (HEALTHY)
- **Service:** Feed/effluent heat exchange
- **Process Unit:** Hydrocracker
- **Criticality:** C (Medium)
- **Status:** RUNNING (normal)
- **OEE:** 93.7%
- **Priority:** Low
- **Active Events:** 1 (performance restored notification)
- **Repetitive Events:** 0
- **Downtime:** 0h
- **RUL:** 240 days
- **Work Orders:** 0
- **Cases:** 0
- **Story:** Was recalibrated overnight (completed 6:45 AM). Performance is back to normal. This is the good news in the morning report. Heat duty was trending down 3% last week from mild fouling; the recalibration fixed it.

### 6. Reactor R-301 (HEALTHY)
- **Service:** Hydrocracker reactor
- **Process Unit:** Hydrocracker
- **Criticality:** A (Safety) -- but currently running fine
- **Status:** RUNNING (normal)
- **OEE:** 95.2%
- **Priority:** Low
- **Active Events:** 0
- **Repetitive Events:** 0
- **Downtime:** 0h
- **RUL:** 365 days (next catalyst change)
- **Work Orders:** 0
- **Cases:** 0
- **Story:** The reactor itself is fine. Its operation depends on K-101 providing recycle gas. With K-101 down, the reactor is running on stored gas inventory which lasts approximately 8 hours. If K-101 is not restarted by 10 AM, the reactor will need to be shut down orderly.

### 7. Vessel V-501 (HEALTHY)
- **Service:** High-pressure separator
- **Process Unit:** Hydrocracker
- **Criticality:** C (Medium)
- **Status:** RUNNING (normal)
- **OEE:** 94.8%
- **Priority:** Low
- **Active Events:** 0
- **Repetitive Events:** 0
- **Downtime:** 0h
- **RUL:** 300 days
- **Work Orders:** 0
- **Cases:** 0
- **Story:** Static equipment. No moving parts. Running fine. Pressure holding. Part of the process but not a concern today.

### 8. Pump P-102 (HEALTHY)
- **Service:** Reflux pump
- **Process Unit:** Fractionation
- **Criticality:** C (Medium) -- installed spare P-103
- **Status:** RUNNING (normal)
- **OEE:** 96.1%
- **Priority:** Low
- **Active Events:** 0
- **Repetitive Events:** 0
- **Downtime:** 0h
- **RUL:** 280 days
- **Work Orders:** 0
- **Cases:** 0
- **Story:** Running perfectly. Spare P-103 is standby ready. No concerns.

### 9. Compressor K-302 (WARNING)
- **Service:** Wet gas compressor
- **Process Unit:** FCC (Fluid Catalytic Cracking)
- **Criticality:** A (Safety) -- single train
- **Status:** RUNNING (monitoring)
- **OEE:** 79.3%
- **Priority:** Medium
- **Active Events:** 3
- **Repetitive Events:** 3 (chattering -- discharge temperature oscillation, flagged 6 times in 3 weeks)
- **Downtime:** 0h
- **RUL:** 95 days
- **Work Orders:** 0
- **Cases:** 0
- **Story:** THIS IS THE CHATTERING EXAMPLE. The discharge temperature oscillates +/- 2C around setpoint every 45 minutes. It looks like an event every time it crosses the threshold, but it might just be a control valve hunting. The engineer needs to decide: is this real degradation or is the alarm threshold set too tight? This parallels the K-101 situation where the vibration threshold was arguably set too high (didn't alarm early enough). Here the threshold might be set too low (alarming on noise). Two sides of the same coin.

### 10. Turbine T-102 (HEALTHY)
- **Service:** FCC power recovery turbine
- **Process Unit:** FCC
- **Criticality:** B (High)
- **Status:** RUNNING (normal)
- **OEE:** 91.4%
- **Priority:** Low
- **Active Events:** 1 (minor -- upcoming borescope inspection in 2 weeks)
- **Repetitive Events:** 0
- **Downtime:** 0h
- **RUL:** 200 days
- **Work Orders:** 0
- **Cases:** 0
- **Story:** Healthy. Borescope inspection due at 8,000 hours, currently at 7,850. This is routine and gives the engineer one forward-looking item for planning.

---

## Plant-Level KPIs (at 7:00 AM Tuesday)

| Metric | Current | Before K-101 trip | Change |
|--------|---------|-------------------|--------|
| OEE | 81.5% | 87.4% | -5.9% |
| Availability | 82.1% | 94.2% | -12.1% |
| Performance | 93.8% | 94.8% | -1.0% |
| Quality | 99.1% | 99.2% | -0.1% |
| Trains | 4 | 4 | -- |
| Active Assets | 138/168 | 142/168 | -4 |

---

## Timeline of Events (Last 24 hours)

| Time | Type | Asset | Event | KPI Impact |
|------|------|-------|-------|------------|
| 1:30 AM | warning | K-101 | Oil pressure dropped to 1.2 bar, aux pump auto-started | -- |
| 1:45 AM | critical | K-101 | Oil pressure alarm: 1.0 bar | -- |
| 2:00 AM | critical | K-101 | Vibration spike: 7.8 mm/s (threshold 7.1) | -- |
| 2:03 AM | critical | K-101 | COMPRESSOR TRIP on high vibration | Availability -12.1% |
| 2:10 AM | info | K-101 | Emergency shutdown sequence completed | OEE -5.9% |
| 2:15 AM | info | K-101 | Work order opened: bearing inspection | -- |
| 2:30 AM | info | K-101 | Work order opened: lube system flush | -- |
| 3:00 AM | info | K-101 | Case opened: root cause analysis | -- |
| 4:30 AM | warning | P-203 | Discharge pressure 8% below normal | -- |
| 5:00 AM | info | P-203 | Work order opened: seal inspection | -- |
| 6:00 AM | info | T-401 | Planned maintenance window started | -- |
| 6:45 AM | critical | K-101 | Manual inspection confirmed bearing damage | RUL revised to 5 days |

---

## Active Work Orders (at 7:00 AM)

| ID | Asset | Task | Priority | Assignee | Status | Created |
|----|-------|------|----------|----------|--------|---------|
| WO-4481 | K-101 | Bearing inspection and assessment | Critical | Sarah Chen | In Progress | 2:15 AM |
| WO-4482 | K-101 | Lube oil system flush and filter replacement | Critical | -- (unassigned) | Open | 2:30 AM |
| WO-4483 | P-203 | Mechanical seal inspection, discharge side | High | Fred Martinez | In Progress | 5:00 AM |
| WO-4484 | T-401 | Combustion inspection (12,000 hr interval) | Medium | Mike Torres | In Progress | 6:00 AM |

## Active Cases (at 7:00 AM)

| ID | Asset | Description | Status | Linked WOs | Opened |
|----|-------|-------------|--------|-----------|--------|
| CS-0891 | K-101 | Root cause analysis: recurring bearing degradation. Vibration alerts ignored for 3 days. Oil filter bypass suspected. Threshold review needed. | Investigating | WO-4481, WO-4482 | 3:00 AM |
| CS-0892 | C-201 | Vibration anomaly on intake valve. Determine if related to K-101 trip transient or independent issue. | Opened (unassigned) | -- | 11:00 PM (previous day) |

---

## K-101 Degradation Timeline (30 days)

For the Trends screen. Shows the slow buildup that preceded the trip.

| Day | Vibration (mm/s) | Bearing Temp (C) | Oil Pressure (bar) | Surge Margin (%) | Status |
|-----|-----------------|------------------|--------------------|--------------------|--------|
| 1 | 1.8 | 68 | 2.1 | 22 | Normal |
| 4 | 1.9 | 69 | 2.1 | 22 | Normal |
| 7 | 2.1 | 71 | 2.0 | 21 | Normal |
| 10 | 2.4 | 73 | 1.9 | 20 | Normal |
| 14 | 2.8 | 76 | 1.8 | 19 | Monitoring |
| 18 | 3.5 | 82 | 1.6 | 17 | Watch |
| 20 | 3.8 | 85 | 1.5 | 16 | Watch |
| 22 | 4.2 | 89 | 1.4 | 15 | Warning |
| 24 | 4.8 | 93 | 1.3 | 13 | Warning |
| 25 | 5.1 | 96 | 1.2 | 12 | Alarm |
| 26 | 5.8 | 100 | 1.1 | 10 | High Alarm |
| 27 | 6.3 | 104 | 1.1 | 9 | High Alarm |
| 28 (1:30 AM) | 6.9 | 108 | 1.0 | 7 | Alarm (oil pressure) |
| 28 (2:00 AM) | 7.8 | 112 | 0.9 | 6 | Trip Imminent |
| 28 (2:03 AM) | 9.2 | 118 | 0.7 | 3 | TRIP |

Note: oil pressure degrades first (root cause). Bearing temp responds next. Vibration lags slightly. Surge margin erodes as bearing roughness degrades compressor performance. The degradation is nonlinear and accelerating.

---

## K-101 Fault Tree

```
                    COMPRESSOR TRIP
                    K-101 · 2:03 AM
                    Vibration 9.2 mm/s
                         |
            +------------+------------+
            |            |            |
      BEARING        SURGE         OIL SYSTEM
      FAILURE        APPROACH       FAILURE
      ● Critical     ● Warning     ● Critical
            |            |            |
      +-----+----+      |      +-----+-----+
      |          |       |      |           |
  VIBRATION  TEMP     MARGIN   PRESSURE   FILTER
  INCREASE   RISE     DROP     DROP       BYPASS
  7.8 mm/s   112C     6%       0.9 bar   Confirmed
  ● Critical ● Crit   ● Warn   ● Critical ● ROOT CAUSE
```

The filter bypass is the root cause. Oil contamination from bypassed filter degraded the lube oil quality, which thinned the bearing film, which caused temperature rise and vibration, which approached surge due to degraded compressor efficiency, which triggered the trip.

---

## The Story the Engineer Tells Their Manager

"K-101 tripped at 2 AM on high vibration. The root cause is the lube oil filter -- it was bypassing, contaminating the oil, and the bearing film degraded over about 10 days. We had vibration alerts starting last Wednesday but the alarm threshold was set at 7.1 mm/s, which is basically waiting for the trip. If we had an alert at 4.5 mm/s we would have caught it 4 days earlier and done a planned shutdown instead of an emergency trip. Sarah is doing the bearing inspection now, we need someone on the lube system flush, and I am recommending we review alarm thresholds for all critical compressors. The reactor has about 3 hours of gas inventory left before we need to start an orderly shutdown if K-101 is not back up."

---

## What This Story Demonstrates in the Portfolio

1. **The dashboard catches what humans miss.** Three days of vibration alerts were ignored. The dashboard should have made this pattern impossible to ignore.
2. **Root cause matters more than symptoms.** Fixing the bearing without fixing the oil filter means it happens again.
3. **Alarm thresholds are a design decision.** Too high (K-101) means you miss the warning. Too low (K-302 chattering) means you cry wolf. The dashboard should help engineers calibrate both.
4. **Connected events.** Is C-201's vibration related to K-101's trip? The dashboard should help the engineer answer that.
5. **Time pressure.** The reactor runs out of gas at 10 AM. This is not a "check it tomorrow" situation.
