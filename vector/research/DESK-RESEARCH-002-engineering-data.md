# DESK-RESEARCH-002 -- Engineering Data Reference

**Date:** 2026-03-26
**Status:** Complete
**Scope:** Realistic engineering values for centrifugal compressors, pumps, heat exchangers, and turbines in a refinery setting. Used to build believable sample data for the APM dashboard demo.

---

## Compressor Vibration Thresholds (ISO 10816-3, casing mm/s RMS)

| Zone | mm/s RMS | Condition | Dashboard color |
|------|----------|-----------|----------------|
| A (new/good) | < 2.3 | Normal | healthy |
| B (acceptable) | 2.3-4.5 | Monitoring | info |
| C (warning) | 4.5-7.1 | Warning / restricted | warning |
| D (danger) | > 7.1 | Alarm / trip imminent | critical |

## Bearing Temperature Thresholds (tilting-pad journal, babbitt)

| Condition | Temp (C) | Temp (F) | Dashboard color |
|-----------|----------|----------|----------------|
| Normal | 60-75 | 140-167 | healthy |
| Elevated | 75-90 | 167-194 | info |
| Warning | 90-105 | 194-221 | warning |
| Alarm | 105-115 | 221-239 | critical |
| Trip | 120 | 248 | critical |

## Surge Margin

| Margin | Condition | Dashboard color |
|--------|-----------|----------------|
| > 25% | Normal | healthy |
| 15-25% | Acceptable | healthy |
| 10-15% | Warning (anti-surge active) | warning |
| 5-10% | Alarm (too close) | critical |
| < 5% | Surge imminent | critical |

## Lube Oil Pressure

| Condition | Pressure (bar) | Pressure (psi) |
|-----------|---------------|----------------|
| Normal | 1.5-2.5 | 22-36 |
| Low alarm | 1.0 | 14.5 |
| Low-low trip | 0.7 | 10 |

## OEE / Availability Benchmarks (refinery)

| Metric | World-class | Average | Underperforming |
|--------|------------|---------|-----------------|
| Mechanical availability | > 97% | 93-96% | < 92% |
| OEE | > 85% | 75-84% | < 74% |
| Unplanned downtime | < 1.5% | 2-4% | > 5% |

## MTBF / MTTR

| Asset | MTBF (hours) | MTTR (hours) |
|-------|-------------|-------------|
| Centrifugal compressor | 35,000-50,000 | 72-240 |
| Centrifugal pump | 25,000-45,000 | 8-48 |
| Heat exchanger | 60,000-90,000 | 48-168 |
| Gas turbine | 25,000-35,000 | 120-480 |

## Criticality Matrix (refinery standard)

| Rating | Safety | Production Loss | Repair Cost |
|--------|--------|----------------|-------------|
| Critical (A) | Fatality potential | > $10M / > 30 days | > $1M |
| High (B) | Lost time injury | $1M-$10M / 3-30 days | $250K-$1M |
| Medium (C) | Medical treatment | $100K-$1M / 8-72 hrs | $50K-$250K |
| Low (D) | First aid only | < $100K / < 8 hrs | < $50K |

## Key Finding: The Causal Chain is Textbook Critical

Lubrication degradation > bearing vibration > compressor trip is one of the most realistic and critical failure modes in refinery operations. A centrifugal compressor in a hydrocracker is typically single-train, no installed spare. An unplanned trip shuts down the entire process unit at $2-5M/day lost production. Always rated Severity 5 / Critical.

The degradation is nonlinear and accelerating: oil pressure drops first (root cause), bearing temperature responds next, vibration lags slightly, and surge margin erodes as bearing roughness degrades compressor performance.
