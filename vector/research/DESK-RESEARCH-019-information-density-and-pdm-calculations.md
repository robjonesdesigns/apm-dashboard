# DESK-RESEARCH-019: Information Density by Role/Scope + PdM/PM Compliance Calculations

**Date:** 2026-04-03
**Purpose:** Define information density expectations for reliability vs maintenance personas at plant and asset levels. Document formulas and data model for predictive maintenance and PM compliance calculations.

---

## Part 1: Information Density Framework

### Density by Role and Scope Level

| Dimension | Plant Level | Asset Level |
|---|---|---|
| **Primary widgets in viewport** | 4-5 cards/sections | 3-4 sections visible |
| **KPIs visible at once** | 3-5 leading indicators | 6-10 asset-specific metrics |
| **Hierarchy depth** | 1-2 levels (plant > area) | 2-3 levels (equipment > component > sensor) |
| **Table rows before scroll** | 8-12 (asset list) | 15-20 (WO history, sensor readings) |
| **Color strategy** | Gray baseline, color = deviation only | More color acceptable (focused context) |
| **Scan time target** | 3-5 seconds for overall story | 15-30 seconds per section |

### Reliability Manager at Plant Level
- Scans for: aggregate health indicators, OEE, MTBF trends, anomaly detection, risk prioritization
- Start with 3 leading KPIs aligned to current improvement initiatives (IDCON recommendation)
- Never display more than 3 leading KPIs simultaneously at overview level
- Time horizon context: 90-day, 6-month, annual windows

### Maintenance Manager at Plant Level
- Scans for: schedule compliance, PM compliance, PMP ratio, open WO counts, backlog depth, overdue PMs
- Software Advice recommends starting with 3 KPIs: PMP, PM Compliance Rate, Equipment Availability
- Must be scannable in a 2-minute morning check
- Exception-based: show what changed, what's at risk, what crossed a threshold

### Reliability Manager at Asset Level
- 4-6 concurrent trend lines per critical rotating asset (vibration, temperature, pressure, flow)
- Sub-asset hierarchy: 2-3 levels practical max, stops at "maintainable or repairable item"
- Expects to interpret data directly (spectra, degradation curves, correlations)
- Session: 15-60 minutes of deep analysis

### Maintenance Manager at Asset Level
- Needs: status, open WOs, last PM, next PM, active alerts, recommended action
- Does NOT need: vibration spectra, failure mode statistics, Weibull distributions
- 30 seconds to understand the implication, then moves on
- Key question: "What do I need to do about this asset?"

### Cognitive Load Principles

- **Miller's Law:** 7 +/- 2 chunks in working memory. A well-designed card with 3 related metrics = 1 chunk.
- **F-pattern scanning:** Users read horizontally across top, drop down, read across again, scan vertically down left side. Place critical KPIs in top-left quadrant.
- **120 bits/second:** Hard ceiling on conscious information processing.
- **Progressive disclosure:** Overview first, zoom and filter, then details on demand (Shneiderman's mantra).
- **Dark and quiet enables density:** When most elements are visually suppressed in gray, you can show more data without increasing cognitive load. Only abnormal elements demand attention.
- **Actionability test:** "What will this person do differently when they see this number?" If no action, remove it.

### Endsley's Situational Awareness Mapped to Our Drill-Down

| SA Level | Description | Dashboard Layer |
|---|---|---|
| Level 1 -- Perception | What is the current state? | Plant Overview (KPIs, status, alarm counts) |
| Level 2 -- Comprehension | What does this mean? | Asset Inspection (trends, thresholds, root cause) |
| Level 3 -- Projection | What will happen next? | Trends/Fault Tree/Performance (RUL, degradation curves, predictions) |

---

## Part 2: PM Compliance Calculation

### Formula (SMRP Standard)

```
PM Compliance (%) = (Completed PMs within compliance window / Scheduled PMs in period) x 100
```

### The 10% Rule (Compliance Window)

A PM is "compliant" only if completed within 10% of its interval after the due date:
- Monthly PM (30-day interval): 3-day grace window
- Quarterly PM (90 days): 9-day grace window
- Semi-annual PM (180 days): 18-day grace window

### Benchmarks

| Level | PM Compliance |
|---|---|
| World-class | >= 90% |
| Critical (A-class) assets | >= 95% |
| Good | 80-90% |
| Needs improvement | < 80% |

### Tracking Dimensions
- **Plant-wide:** Single percentage for executive dashboards
- **Per-asset:** Reveals which assets are neglected
- **By criticality tier:** A >= 95%, B >= 90%, C >= 85%
- **By craft type:** Electrical, mechanical, instrumentation (identifies resource gaps)
- **Period:** Weekly for action, monthly for reporting (SMRP recommendation)

### Overdue PM Handling
- Overdue PMs count as non-compliant in the period they were due
- If completed later, counts as completed in that period but still non-compliant for original period
- Prevents gaming by just doing them late

---

## Part 3: Predictive Maintenance (PdM) Metrics

### RUL Calculation -- Degradation Model (our approach)

For the demo, we use **degradation-based RUL**: fit a curve to sensor trend data, extrapolate to threshold crossing. Time between now and projected crossing = RUL.

```
1. Collect sensor time-series (e.g., vibration RMS over months)
2. Fit degradation curve (linear, exponential, or polynomial)
3. Extrapolate to alarm threshold
4. RUL = projected threshold crossing date - today
5. Confidence interval from curve fit uncertainty
```

### P-F Curve and P-F Interval

Typical P-F intervals by detection method (bearing failure example):
- Vibration analysis: ~6 months before failure
- Ultrasound: ~3 months
- Oil analysis (particle count): ~2-3 months
- Thermal imaging: ~1 month
- Audible noise: ~1-2 weeks (too late for planning)

**Rule:** Inspection interval must be less than half the P-F interval.

### Condition-Based vs Time-Based Triggers

| Aspect | Time-Based (PM) | Condition-Based (PdM) |
|---|---|---|
| Trigger | Calendar interval or run hours | Sensor reading crosses threshold |
| Data field | `nextDueDate`, `intervalDays` | `sensorType`, `currentValue`, `alarmThreshold` |
| Strength | Simple to schedule | Avoids unnecessary maintenance |
| Weakness | May service healthy equipment | Requires sensor infrastructure |

---

## Part 4: Related Maintenance KPIs (Formulas)

### MTBF (Mean Time Between Failures)
```
MTBF = Total Operating Time / Number of Failures
```
Only unplanned failures count (not planned shutdowns).

### MTTR (Mean Time To Repair)
```
MTTR = Total Repair Time / Number of Repairs
```
Target for critical rotating equipment: < 4 hours.

### Availability
```
Availability = MTBF / (MTBF + MTTR)
```
World-class refinery: 95-97%.

### OEE (Overall Equipment Effectiveness)
```
OEE = Availability x Performance x Quality
```
- Availability = Run Time / Planned Production Time
- Performance = (Ideal Cycle Time x Total Output) / Run Time
- Quality = Good Output / Total Output

World-class: 85%. Average manufacturing: 60%. For refineries, availability dominates (quality and performance typically high in continuous process).

### Planned Maintenance Percentage (PMP)
```
PMP = Planned WOs / Total WOs x 100
```
World-class: >= 80-85%. Average: 50-60%. Below 50%: reactive-dominant.

Reactive maintenance costs 3-9x more than planned maintenance.

### Maintenance Backlog
```
Backlog (weeks) = Total Backlog Hours / Weekly Labor Capacity
```
- Healthy: 2-4 weeks
- Process industry: 4-6 weeks (includes turnaround work)
- Above 6 weeks: growing out of control
- Below 2 weeks: potentially overstaffed or under-identifying work

### Schedule Compliance
```
Schedule Compliance = Scheduled Jobs Completed on Schedule / Total Scheduled Jobs x 100
```
Includes ALL work types (PM, corrective, projects). Benchmark: >= 90%.

---

## Part 5: Data Model for Calculated KPIs

### Work Order Record (supports both PdM and PM compliance)

```
WorkOrder:
  woId, woNumber
  assetId
  woType: "PM" | "PdM" | "CM" | "EM"
  status: "planned" | "scheduled" | "in-progress" | "completed" | "cancelled"
  priority: 1-5 (1 = emergency)
  
  // Scheduling
  createdDate, scheduledDate, dueDate, startDate, completionDate
  
  // Labor
  craftType: "mechanical" | "electrical" | "instrumentation" | "operations"
  estimatedHours, actualHours, assignedTo
  
  // PM-specific
  pmScheduleId, intervalDays
  isCompliant  // computed: completionDate <= dueDate + (intervalDays * 0.1)
  
  // PdM-specific
  triggerSensorId, triggerValue, triggerThreshold, failureMode
  
  // Completion
  findingsNotes, actionTaken, failureCauseCode
  downtimeHours, partsUsed
```

### Sensor Record (supports RUL and degradation tracking)

```
Sensor:
  sensorId, assetId, subAssetId
  sensorType: "vibration" | "temperature" | "pressure" | "flow" | "current"
  unit: "mm/s" | "C" | "bar" | "m3/h" | "A"
  currentValue
  normalRange: { min, max }
  alarmThreshold, tripThreshold
  trend: [{ timestamp, value }]
  
PdM Prediction (per asset):
  predictedRUL_days
  confidenceLow, confidenceHigh
  failureMode
  riskLevel: "low" | "medium" | "high" | "critical"
  pfInterval_days
  lastInspectionDate, nextRecommendedInspection
```

### Demo Data Distribution (realistic scenario)

| State | Count | Description |
|---|---|---|
| Healthy (green) | 2-3 assets | No alerts, sensors in normal range |
| Watch (yellow) | 3-4 assets | One or more sensors trending up |
| Active alert | 2-3 assets | Open PdM work orders at various stages |
| Critical (red) | 1 asset | Approaching trip threshold, high-priority WO |

Plant-wide targets for the demo:
- PM Compliance: 87% (below world-class, shows improvement opportunity)
- PMP: 70% planned / 30% reactive (room to improve)
- Backlog: 3.2 weeks (healthy range)
- MTBF trend: slightly improving over 6 months
- OEE: ~82%

---

## Sources
- SMRP Best Practices (6th Edition) on PM compliance and KPI definitions
- IDCON on leading KPIs and daily meeting cadence
- Fiix (Rockwell Automation) on RUL, PM compliance, P-F curves
- MathWorks on three ways to estimate RUL
- eMaint (Fluke) on maintenance KPIs
- Tractian on MTBF, MTTR, and maintenance management KPIs
- OEE.com on OEE calculation methodology
- IDCON on backlog calculation
- MaintainX on planned maintenance percentage
- Honeywell Forge, GE Vernova, IBM Maximo product documentation
- ISA-101 standards on information density and human factors
- Endsley's Situational Awareness model
- NNGroup on cognitive load and scanning patterns
- Software Advice on CMMS dashboard KPIs
