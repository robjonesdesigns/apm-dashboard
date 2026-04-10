# DESK-RESEARCH-023: P-F Intervals, Degradation Models, and RUL

**Purpose:** Quantitative reference for condition monitoring intervals, degradation curve shapes, and RUL confidence band widths. Calibrates the sensor data model and bearing failure narrative in baytown-v2.js so it matches real physics.

---

## P-F intervals by detection method

The P-F interval is measured from the point a technique first detects potential failure (P) to functional failure (F). Inspection interval should be no more than half the P-F interval.

### Vibration analysis
| Equipment / Failure Mode | P-F Interval | Inspection Interval |
|---|---|---|
| Rolling element bearing (outer race, BPFO) | 1-9 months (typically 3-6) | Monthly |
| Rolling element bearing (inner race, BPFI) | 1-6 months | Bi-weekly to monthly |
| Journal bearing (oil whirl, shaft eccentricity) | 2-6 months | Monthly |
| Centrifugal compressor imbalance | 3-9 months | Monthly |
| Pump cavitation | 1-3 months | Bi-weekly |
| Misalignment (any rotating) | 3-12 months | Monthly |
| Mechanical looseness | 1-6 months | Monthly |

### Oil analysis
| Failure Mode | P-F Interval | Inspection Interval |
|---|---|---|
| Bearing wear (particles, wear metals) | **6-18 months (earliest detection)** | Monthly for critical, quarterly for non-critical |
| Gear wear (Fe, Cr particles) | 6-12 months | Monthly |
| Contamination (water, process fluid) | 3-9 months | Monthly |
| Lubricant degradation (viscosity, TAN/TBN) | 3-12 months | Monthly to quarterly |
| Filter bypass (particle count spike) | 1-3 months | Monthly |

### Thermography
| Failure Mode | P-F Interval | Inspection Interval |
|---|---|---|
| Bearing overheating (mechanical) | **1-4 weeks (late on the curve)** | Weekly |
| Electrical connections (loose, corroded) | 1-6 months | Monthly |
| Motor winding hot spots | 2-8 weeks | Bi-weekly |
| Steam trap failure | 1-3 months | Monthly |
| Refractory degradation | 3-12 months | Quarterly |

### Ultrasonic testing
| Failure Mode | P-F Interval | Inspection Interval |
|---|---|---|
| Pressure vessel wall thinning (general corrosion) | 6-24 months | Quarterly to semi-annual |
| Heat exchanger tube wall thinning | 6-18 months | Semi-annual |
| Pitting corrosion (localized) | 3-12 months | Quarterly |
| Valve internal leakage | 1-6 months | Monthly |
| Bearing early-stage defect (acoustic emission) | 6-12 months (earliest) | Monthly |

### Performance monitoring (calculated from process data)
| Failure Mode | P-F Interval | Inspection Interval |
|---|---|---|
| Compressor efficiency drop (fouling) | 3-12 months | Weekly (auto-calculated) |
| Heat exchanger fouling (U-value decline) | 2-12 months | Weekly |
| Pump efficiency decline | 2-6 months | Weekly |
| Turbine blade degradation | 6-18 months | Weekly |
| Filter differential pressure rise | 2-8 weeks | Daily |

**Key insight:** Same component, different detection methods, different intervals. A drive-end bearing has a 6-18 month P-F via oil analysis but only 1-4 weeks via thermography. The correct model is a matrix: sub-asset x failure-mode x detection-method -> pfInterval.

---

## Degradation model types

| Model | Shape | When to Use | Examples |
|---|---|---|---|
| **Linear** | Straight line, constant rate | Steady wear under constant conditions | General corrosion, abrasive wear, erosion, filter loading |
| **Exponential** | Slow start, accelerating | Self-reinforcing damage -- damage begets more damage | Bearing spalling, fatigue crack propagation, insulation breakdown |
| **Asymptotic** | Fast rise, plateau | Deposition/removal equilibrium | Particulate fouling, biological fouling, wax deposition |
| **Weibull** | Flexible (bathtub, wear-out, early failure) | Population-level failure probability | Bearing population life, seal population life |
| **S-curve (logistic)** | Slow-fast-slow | Biological/chemical fouling with saturation | Biofouling in cooling water, catalyst deactivation |
| **Power law** | Concave or convex | Crack growth, creep | High-temperature creep, Paris law fatigue, pitting corrosion |

### Bearing degradation detail (critical for K-101)

Bearings follow a four-stage pattern. The curve is NOT linear -- it is exponential/hockey-stick shaped:

1. **Stage 1 (Initiation):** Subsurface micro-cracks. Detectable only by ultrasonic/acoustic emission (250 kHz+). Duration: **60-80% of total bearing life**. Vibration trend appears flat.
2. **Stage 2 (Early spalling):** Surface defects. Envelope spectrum shows BPFO/BPFI with 1-2 harmonics. Duration: 10-20% of remaining life. Slow, roughly linear increase.
3. **Stage 3 (Spall progression):** Multiple harmonics + sidebands in FFT. Noise floor rises. Duration: 5-15% of remaining life. **Accelerating degradation -- this is the exponential knee.**
4. **Stage 4 (Terminal):** Broadband vibration, elevated temperature, audible noise. Duration: **1-5% of remaining life (days to weeks).** Rapid exponential rise to failure.

**Implication for K-101 data:** The current `K101_DEGRADATION` array shows gradual climb from day 1. This is physically wrong. Real data would be essentially flat from day 1-20, then sharp acceleration from day 22 onward. The narrative ("signals were there for 3 days") matches the physics -- the data should match the narrative.

### Fouling detail
- **Particulate (heat exchangers, coolers):** Asymptotic. Fast initial buildup, then deposition/removal equilibrium at 60-80% of original effectiveness. Weeks to months to plateau.
- **Chemical/polymerization (K-302 impeller):** Linear or slightly accelerating until cleaning or chunk break-off. No natural equilibrium. Sawtooth pattern if chunks break off.
- **Biological:** S-curve (logistic growth). Lag, exponential growth, plateau.
- **Scaling (mineral):** Initially linear, can become asymptotic as deposit insulates itself. CaCO3 in cooling water: 0.1-0.5 mm/year.

### Corrosion detail
- **General/uniform:** Linear. Carbon steel in refinery service: 1-5 mpy (0.025-0.127 mm/year) in clean hydrocarbon. 5-25 mpy in corrosive service.
- **Pitting:** Power law. Pit depth proportional to time^0.3-0.5. Pits can penetrate 3-10x faster than general corrosion rate. Stainless in chloride environments is the classic case.

---

## Baytown asset degradation model assignments

| Asset / Failure Mode | Model | Rationale |
|---|---|---|
| K-101 DE bearing spalling | `exponential` | Flat-then-accelerating, classic bearing failure |
| P-203 seal wear | `linear` | Steady abrasive wear at seal face |
| K-302 impeller polymer fouling | `linear` (sawtooth) | No equilibrium, buildup then break-off |
| C-201 particulate fouling | `asymptotic` | Equilibrium with air-side cleaning |
| E-105 tube fouling | `asymptotic` | Process-side deposition/removal balance |
| V-501 shell general corrosion | `linear` | Constant rate, predictable |
| E-105 shell pitting corrosion | `power_law` | Pit depth = k * t^0.33 |
| T-102 fuel nozzle coking | `linear` | Steady carbon buildup |
| T-401 blade erosion | `linear` | Steady material removal from particle impact |
| R-301 catalyst deactivation | `asymptotic` | Fast initial loss, then plateau |
| P-102 (healthy) bearing | `exponential` (early stage 1) | Flat for now, no acceleration yet |

---

## P-F intervals for the 10 Baytown assets

| Asset | Primary Detection | pfIntervalDays | inspectionIntervalDays |
|---|---|---|---|
| K-101 (compressor, bearings) | Vibration + oil analysis | 180 | 90 |
| P-203 (pump, seal/bearing) | Vibration | 120 | 60 |
| K-302 (compressor, fouling) | Performance monitoring | 180 | 30 |
| C-201 (cooler, fouling) | Performance (U-value) | 120 | 30 |
| T-102 (turbine, blades) | Vibration + performance | 270 | 90 |
| T-401 (gas turbine) | Vibration + performance | 270 | 90 |
| E-105 (heat exchanger) | UT + performance | 360 | 90 |
| V-501 (pressure vessel) | UT wall thickness | 540 | 180 |
| R-301 (reactor) | Performance + UT | 540 | 180 |
| P-102 (healthy pump) | Vibration | 180 | 90 |

---

## RUL confidence intervals

### Format conventions in commercial APM systems
Most platforms use one of:
- Point estimate + confidence band: "RUL: 47 days (35-62 days at 90% confidence)"
- Probability distribution curve (cumulative P(failure) over time)
- Traffic light with range
- Percentile bounds (P10/P50/P90)

For baytown-v2.js, use **point + bounds**:
```js
rul: { days: 47, lower: 35, upper: 62, confidence: 0.90 }
```

### Confidence band widths by detection method

| Detection Method | Band (90% CI) | Notes |
|---|---|---|
| Vibration-based bearing RUL | +/- 25-40% | Narrower in Stage 3, wider in Stage 2 |
| Oil analysis-based RUL | +/- 30-50% | Longer sample intervals = more uncertainty |
| Corrosion-based RUL (UT) | +/- 15-25% | Most predictable -- linear + good measurement precision |
| Performance-based RUL (fouling) | +/- 20-35% | Depends on process stability |
| Thermography-based RUL | +/- 30-50% | Short P-F interval, less data |

### How bands widen with projection distance
Roughly proportional to square root of projection distance.

| Projection | Band (90% CI) | Example |
|---|---|---|
| 30 days out | +/- 25% | 23-38 days |
| 90 days out | +/- 35% | 59-122 days |
| 180 days out | +/- 45-50% | 99-261 days |
| > 180 days | Switch format | Use "> 6 months" or planned maintenance date |

For sensor trend arrays, model the band as two additional arrays (upper and lower) that fan out from the last measured point.

---

## Sensor sampling rates for the demo

| Measurement | Raw Rate | Trending Resolution |
|---|---|---|
| Vibration (overall RMS) | Continuous 25.6 kHz burst every 2-30 min | **Daily summary** (max/avg/min per day) |
| Vibration (spectrum/FFT) | Per measurement | Diagnostic, not trended |
| Bearing temperature | Every 1-5 sec | **Hourly average** |
| Process temp/pressure (DCS) | Every 1-10 sec | **Hourly** |
| Oil pressure (lube) | Every 1-5 sec | **Hourly** + event capture on threshold |
| Oil analysis (lab sample) | Monthly critical, quarterly non-critical | Each sample = 1 data point |
| Filter DP | Every 1-10 sec | **Daily** |
| Flow rate | Every 1-10 sec | **Hourly** |
| Efficiency (calculated) | Derived | **Daily** or weekly |
| UT wall thickness | During inspection only | **Per inspection** (semi-annual) |

**For baytown-v2.js:** Daily x 28 days = 28 points per sensor. Matches condition monitoring reality, keeps file size manageable. Only sensors in alarm or trending get trends -- roughly 30-40 of ~180 sensors, the rest are `trend: null`.

---

## Sources
- Reliable Plant, P-F Intervals Map Failures
- ISA, Improving Maintenance by Adopting a P-F Curve Methodology
- Machinery Lubrication, Oil vs Vibration Analysis + Sampling Frequencies
- Ludeca, 4 Stages of Bearing Failure
- CBM Connect, Bearing Damage Progression to Failure Mode
- PMC, Vibration Sensors for Condition Monitoring (NCBI)
- PMC, LSTM RUL Prediction with Uncertainty (NCBI)
- IntechOpen, Fouling in Heat Exchangers
- Heat Exchanger World, Models of Fouling in Heat Exchangers
- ScienceDirect, Corrosion Rate Models
- MathWorks, predictRUL Degradation Models (MATLAB)
- Honeywell, Introduction to Vibration-Based Condition Monitoring (whitepaper)
- Neurospace, P-F Interval and Predictive Maintenance
- Precision Lubrication, Oil Analysis Sampling Intervals
