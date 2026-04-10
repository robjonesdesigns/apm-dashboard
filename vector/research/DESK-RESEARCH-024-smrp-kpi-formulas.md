# DESK-RESEARCH-024: SMRP Standard KPI Formulas and Benchmarks

**Purpose:** Exact formulas and industry benchmarks from SMRP (Society for Maintenance and Reliability Professionals) Body of Knowledge, 5th Edition. Used to calibrate the baytown-v2.js plant and asset KPIs so they read as realistic to a reliability engineer.

---

## 1. PM Compliance (SMRP 5.5.6)

```
PM Compliance (%) = (PMs Completed On Time / PMs Scheduled in Period) x 100
```

**"On time" convention:** Completion within +/- 10% of the scheduled interval. For a 30-day PM, that's a 3-day grace. For a 90-day PM, a 9-day grace.

**Critical rule:** A PM that was never created or never started counts as **missed** -- it goes in the denominator but NOT the numerator. The denominator is all PMs that SHOULD have been scheduled based on the PM program master schedule (not just WOs that happen to exist in the CMMS).

**Implication for baytown-v2.js:** You need a `MAINTENANCE_PLANS` entity that generates scheduled PM dates. Without it, PM compliance is un-computable because the denominator is incomplete.

**Benchmarks:**
| Tier | PM Compliance |
|---|---|
| World-class | > 95% |
| Good | 85-95% |
| Average | 70-85% |
| Poor | < 70% |

**Typical breakdowns:** by criticality tier (A assets target 98%+), by craft, by unit/area, by PM type.

---

## 2. Schedule Compliance (SMRP 5.5.5)

```
Schedule Compliance (%) = (Scheduled WOs Completed in Period / WOs Scheduled for Period) x 100
```

Covers ALL scheduled work (PMs, planned corrective, project work, PdM), not just PMs. A WO carried over to the next week is a miss even if eventually completed.

**Benchmarks:**
| Tier | Schedule Compliance |
|---|---|
| World-class | > 90% |
| Good | 80-90% |
| Average | 60-80% |
| Poor | < 60% |

---

## 3. Planned Maintenance Percentage (SMRP 5.5.2)

```
PMP (%) = (Planned WO Hours / Total WO Hours) x 100
```

**Planned** = PM + PdM + planned corrective (work identified proactively, scoped, parts staged, scheduled in advance)

**Unplanned** = CM (reactive, fix-on-fail) + EM (emergency response)

**Benchmarks:**
| Tier | PMP |
|---|---|
| World-class | > 85% planned |
| Good | 70-85% |
| Average | 50-70% |
| Poor (reactive) | < 50% |

Most plants starting a reliability journey are at 40-55%. Refineries targeting top-quartile aim for 80%+.

---

## 4. Maintenance Backlog (SMRP 5.5.3)

```
Backlog (weeks) = Total Ready Backlog Hours / Weekly Available Labor Hours
```

**"Ready backlog"** = WOs that are fully planned, parts available, ready to schedule. Some organizations track both ready backlog and total backlog (all open WOs regardless of status).

**Weekly labor capacity:**
```
Weekly Available Hours = Headcount x 40 x 0.80 = Headcount x 32 hours
```

The 0.80 factor accounts for breaks, meetings, travel, admin (20% non-productive time).

**Benchmarks:**
| Tier | Backlog |
|---|---|
| Optimal (SMRP target) | 2-4 weeks |
| Understaffed / reactive culture | < 2 weeks |
| Falling behind | > 6 weeks |
| Critical | > 8 weeks |

Below 2 weeks is a signal the planning process isn't identifying work proactively -- not a sign of efficiency.

---

## 5. Emergency WO Rate (SMRP 5.5.4)

```
Emergency WO Rate (%) = (Emergency WOs / Total WOs) x 100
```

Can also be measured in labor hours instead of count.

**5-tier priority classification:**
| Priority | Label | Response | Definition |
|---|---|---|---|
| 1 | Emergency | Immediate (< 4 hrs) | Safety, environmental, imminent catastrophic loss |
| 2 | Urgent | 24-48 hours | Significant production impact, escalating damage |
| 3 | Routine/Scheduled | Next schedule window (1-2 weeks) | Normal planned/corrective |
| 4 | Planned | Next outage/turnaround | Can wait for planned window |
| 5 | Low/Wish list | As resources permit | Improvements, cosmetic |

Emergency = drop everything. Urgent = brief plan then execute. Every emergency WO that bumps scheduled work damages schedule compliance.

**Benchmarks:**
| Tier | Emergency Rate |
|---|---|
| World-class | < 2% of total WOs |
| Good | 2-5% |
| Average | 5-10% |
| Poor / reactive | > 10% |

---

## 6. OEE (Overall Equipment Effectiveness)

```
OEE = Availability x Performance x Quality
```

### Availability (continuous process formula)
```
Availability = (Calendar Time - Planned Downtime - Unplanned Downtime) / (Calendar Time - Planned Downtime)
```

Calendar time = 8,760 hrs/year. Planned downtime (turnarounds, planned shutdowns) is excluded from the denominator -- you're measuring reliability when the asset is expected to run.

### Mechanical Availability (for individual rotating equipment)
```
Mechanical Availability = (Period Hours - Forced Outage Hours) / Period Hours x 100
```

Solomon Associates uses Mechanical Availability as the standard refinery benchmark, targeting 96%+.

### Performance
```
Performance = Actual Throughput / Theoretical Maximum Throughput
```

### Quality
```
Quality = Good Units / Total Units Produced
```

**Benchmarks (continuous process, refinery):**
| Tier | Refinery OEE | Mechanical Availability |
|---|---|---|
| World-class | 85-93% | > 96% |
| Typical | 60-75% | 93-96% |
| Below target | < 60% | < 93% |

**Individual rotating equipment availability:**
- World-class: > 98% (critical pumps, compressors)
- Typical: 92-96%
- Large turbomachinery: > 97% target

The "85% OEE is world-class" number comes from discrete manufacturing (Nakajima/TPM). In continuous process, availability is typically 95%+, performance varies more, quality is high.

---

## 7. MTBF (Mean Time Between Failures) -- SMRP 5.1.1

```
MTBF = Total Operating Time / Number of Failures
```

**What counts as a failure:** The single most debated definition in reliability. SMRP defines failure as "the inability of an asset to perform its required function." In practice:

- **Counts:** Equipment trips, forced shutdowns, inability to meet process demand, any unplanned corrective/emergency WO that resulted in loss of function or forced derating
- **Does not count:** Degraded performance that still meets demand (track as "defects" or "findings"), planned shutdowns, turnarounds

**For baytown-v2.js:** The cleanest definition is "unplanned corrective/emergency WO resulting in loss of function." Current `deriveMTBF` counts only `eventType === 'trip'`, which is narrower but defensible. Document the decision either way.

**Benchmarks by equipment type (process industry):**
| Equipment | MTBF Target | MTTR Target |
|---|---|---|
| Centrifugal pumps (critical) | > 36 months | < 8 hours |
| Centrifugal pumps (general) | > 24 months | < 12 hours |
| Reciprocating compressors | > 18 months | < 24 hours |
| Centrifugal compressors | > 36 months | < 24 hours |
| Heat exchangers | > 48 months | < 48 hours (tube work) |
| Control valves | > 24 months | < 4 hours |
| Electric motors (large) | > 60 months | < 24 hours |
| Instrument loops | > 24 months | < 2 hours |
| Cooling towers | > 36 months | < 8 hours |
| Fired heaters/furnaces | > 24 months | < 48 hours |

---

## 8. MTTR (Mean Time To Repair/Restore) -- SMRP 5.1.2

```
MTTR = Total Repair Time / Number of Repairs
```

**Two definitions, both valid:**
1. **Maintainability MTTR** = start-of-repair to return-to-service (wrench time only). Pure maintenance metric.
2. **Total downtime MTTR / Mean Time to Restore** = failure occurrence to return-to-service. Includes diagnosis, parts, logistics, repair, testing, startup. Operations/production metric.

For an APM dashboard, definition 2 is more useful because it captures full impact. Label it **Mean Time to Restore** to distinguish from pure repair time. The current `deriveMTTR` in baytown.js measures WO created to completed -- that's closer to definition 2. Consider renaming to `mttRestoreHours`.

---

## 9. Bad Actor Analysis

**Common scoring methods:**

1. **Simple event count** -- fast, misleading (cheap pump failing 4x ranks above compressor failing once with $500K loss)
2. **Cost-weighted (most common in refineries)** -- `maintenance cost + production loss cost`, rank by total cost of unreliability descending. Solomon Associates and most reliability consultants prefer this.
3. **Composite scoring (most rigorous):**
   ```
   Normalize factors to 0-100 scale, apply weights:
   - Safety: 30%
   - Production loss: 30%
   - Maintenance cost: 20%
   - Failure frequency: 20%
   ```

**Top N conventions:**
- Top 10 at plant level
- Top 5 at unit level or monthly review
- Rolling 12-month window (avoids seasonality and single-event skew)
- Refresh monthly or quarterly

**For baytown-v2.js:** Current `BAD_ACTORS` uses pure event count. Upgrade to cost of unreliability (maintenance hours x labor rate + downtime hours x production weight) so the story is richer. Show failure count and downtime as secondary columns.

---

## Baytown calibration targets (good-but-not-world-class)

A plant on a reliability journey with some units performing well and others lagging. More believable than a "perfect plant" demo:

| KPI | Baytown Target | World-Class | Rationale |
|---|---|---|---|
| PM Compliance (plant) | 84% | > 95% | Room to improve, story element |
| PM Compliance (Criticality A) | 92% | > 98% | A-assets protected |
| PM Compliance (Criticality C) | 75% | > 90% | C-assets neglected |
| PMP | 70% | > 85% | Still fighting reactive work |
| Emergency WO Rate | 7% | < 2% | K-101 trip is one of several recent |
| Backlog | 4.2 weeks | 2-4 weeks | Slightly overloaded |
| Schedule Compliance | 72% | > 90% | Planning gaps |
| Mechanical Availability | 94.5% | > 96% | Below target |

### Per-asset MTBF/MTTR reality check

Current baytown.js values and recommended adjustments:

| Asset | Current MTBF | Target | Notes |
|---|---|---|---|
| K-101 | 312 hrs | Keep | Catastrophic -- correct for the story |
| P-203 | 1820 hrs | Keep | Recurring seal failures |
| C-201 | 3200 hrs | Keep | Healthy-ish |
| T-401 | 2800 hrs | Keep | Scheduled maintenance |
| E-105 | 4800 hrs | Keep | Below world-class |
| R-301 | 8760 hrs | Keep | Most reliable asset |
| V-501 | 6500 hrs | Keep | Good |
| P-102 | 2400 hrs | **Bump to 4000+** | Should show "good" to contrast with K-101 |
| K-302 | 980 hrs | Keep | Bad actor |
| T-102 | 2200 hrs | Keep | Showing early warning signs |

---

## Sources
- SMRP Body of Knowledge, 5th Edition (SMRP Best Practice metrics 5.1.1, 5.1.2, 5.5.2-5.5.6)
- Solomon Associates refinery benchmarking (Mechanical Availability)
- Ron Moore, "Making Common Sense Common Practice"
- Terry Wireman, "Benchmarking Best Practices in Maintenance Management"
- Idcon.com benchmarking references
- LNS Research, Industrial Transformation benchmarks
- Nakajima, "Introduction to TPM" (original OEE definition)
