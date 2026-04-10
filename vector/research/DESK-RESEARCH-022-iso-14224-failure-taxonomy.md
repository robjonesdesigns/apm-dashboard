# DESK-RESEARCH-022: ISO 14224 Failure Taxonomy

**Purpose:** Standardize the failure data model in baytown-v2.js against ISO 14224:2016, the petroleum/petrochemical industry standard for reliability and maintenance data collection. Ensures the demo reads as authentic to any reliability engineer reviewing the work.

**Standard:** ISO 14224:2016 -- "Petroleum, petrochemical and natural gas industries -- Collection and exchange of reliability and maintenance data for equipment." Derived from the OREDA project (Offshore Reliability Data, 1980s onward).

---

## Equipment taxonomy (9-level hierarchy)

| Level | Name | Example |
|---|---|---|
| 1 | Industry | Petroleum |
| 2 | Business category | Downstream |
| 3 | Installation | Refinery |
| 4 | Plant/unit | Baytown Refinery / Hydrocracker |
| 5 | Section/system | Compression section |
| 6 | **Equipment unit** | **Compressor K-101** (the asset) |
| 7 | Subunit | Lube oil system, power turbine |
| 8 | Component/maintainable item | Thrust bearing, coupling, seal |
| 9 | Part | Bearing race, O-ring |

**Rule:** Severity class attaches to the equipment unit (level 6). Failure mode attaches to the equipment unit. Failure cause attaches to the lowest applicable level (8 or 9).

Baytown mapping:
- Level 4 = Baytown Refinery / processUnit
- Level 6 = asset (K-101, P-203, etc.)
- Level 7-8 = sub-assets (K-101-DE, K-101-LOS)
- Level 8-9 = sensors/maintainable items

---

## The three-part failure record

ISO 14224 separates failure into three distinct concepts. Collapsing them into a single string ("bearing-degradation") loses fidelity.

### Failure mode (what was observed)
Three-letter uppercase codes from a fixed vocabulary of ~22. These are what an operator or CMMS record captures.

| Code | Description |
|---|---|
| AIR | Abnormal instrument reading (false alarm, faulty indication) |
| BRD | Breakdown (serious damage -- seizure, breakage) |
| ELP | External leakage, process medium |
| ELU | External leakage, utility medium |
| ERO | Erratic output (oscillating/unstable) |
| FTS | Fail to start on demand |
| FTF | Fail to function on demand |
| HIO | High output (above spec) |
| INL | Internal leakage |
| LOO | Low output (below spec) |
| NOI | Noise |
| OHE | Overheating |
| PDE | Parameter deviation |
| PLU | Plugged / choked |
| SER | Minor in-service problems |
| STD | Structural deficiency (cracks, wear) |
| STP | Fail to stop on demand |
| UST | Spurious stop |
| VIB | Vibration (abnormal) |
| LCP | Leakage in closed position (valves) |
| LOA | Load drop |
| OTH | Other |
| UNK | Unknown |

### Failure mechanism (the physical process)
Six categories, ~38 codes. The "how it physically broke."

- **Mechanical:** LBP (leakage), VIB (vibration), CLB (clearance/alignment), DFL (deformation), LOO (looseness), STD (sticking)
- **Material:** CAV (cavitation), COR (corrosion), ERO (erosion), WEA (wear), BRD (breakage), FAT (fatigue), OHE (overheating), BUR (burst)
- **Instrument:** CTF (control failure), NOI (no signal), FAF (faulty signal), OOA (out of adjustment), SOF (software failure)
- **Electrical:** SHC (short circuit), OHT (open circuit), NOP (no power), EFL (earth fault), OHE (overheating)
- **External:** BLO (blockage), CON (contamination), FRZ (freezing)
- **Miscellaneous:** OTH, UNK, NOF (no cause found), CBF (combined)

### Failure cause (the circumstance)
Five categories, ~20 codes. The "why it got there."

- **Design:** improper capacity, improper material, design error
- **Fabrication/installation:** fabrication error, installation error
- **Operation/maintenance:** off-design service, operating error, inadequate maintenance, inadequate PM, expected wear and tear
- **Management:** documentation error, management error
- **Misc:** no cause found, combined, common cause, other, unknown

### Severity class (on the equipment unit, not the failure record)
- **Critical** -- immediate cessation of required function
- **Degraded** -- reduced function, not immediate
- **Incipient** -- no immediate effect, would lead to critical if not corrected
- **Unknown**

Note: This is distinct from alarm priority (ISA-18.2 1-4). Both exist in APM systems. Failure severity is reliability-facing; alarm priority is operator-facing.

### Detection method codes (~10)
Periodic maintenance, functional testing, inspection, continuous condition monitoring, periodic condition monitoring, production interference, casual observation, corrective maintenance (found during other work), on demand, other.

---

## Concrete examples by Baytown asset type

### Centrifugal compressor (K-101, K-302)
| Mechanism | Mode | Cause |
|---|---|---|
| Bearing wear (WEA) on thrust bearing | VIB | Inadequate lubrication / off-design operation |
| Dry gas seal degradation (LBP) | ELP | Contamination -- particulates in seal gas |
| Impeller fouling (CON) | LOO | Off-design service -- wet gas ingress |
| Surge instability (VIB) | ERO | Operating error / anti-surge control failure |
| Coupling fatigue (FAT) | BRD | Misalignment -- installation error |

### Centrifugal pump (P-203, P-102)
| Mechanism | Mode | Cause |
|---|---|---|
| Mechanical seal wear (WEA) | ELP | Dry running -- operator error |
| Cavitation (CAV) | LOO / NOI | Insufficient NPSH -- design error |
| Impeller erosion (ERO) | LOO | Abrasive service -- off-design |
| Bearing overheating (OHE) | VIB | Inadequate lubrication |
| Shaft fatigue cracking (FAT) | BRD | Cyclic off-design operation |

### Gas turbine (T-401, T-102)
| Mechanism | Mode | Cause |
|---|---|---|
| Combustion liner thermal fatigue (FAT) | OHE | Expected wear and tear |
| Turbine blade coating loss (ERO) | PDE | Particulate ingestion -- off-design |
| Fuel nozzle coking (CON) | ERO | Fuel quality -- off-design service |
| Compressor section fouling (CON) | LOO | Inadequate air filtration -- design |

### Heat exchanger (C-201, E-105)
| Mechanism | Mode | Cause |
|---|---|---|
| Tube-side fouling (CON) | PDE | Process contamination |
| Tube wall corrosion (COR) | INL | Corrosive service -- material selection |
| Gasket degradation (WEA) | ELP | Thermal cycling |
| Stress corrosion cracking (FAT) | INL | Chloride contamination |

### Pressure vessel (V-501)
| Mechanism | Mode | Cause |
|---|---|---|
| General corrosion (COR) | STD | Inadequate corrosion allowance -- design |
| Stress corrosion cracking (FAT) | ELP | Improper material |
| PSV stuck closed (STD) | FTF | Inadequate PM |
| Nozzle weld fatigue (FAT) | ELP | Cyclic operation |

### Fixed-bed reactor (R-301)
| Mechanism | Mode | Cause |
|---|---|---|
| Catalyst deactivation (CON) | PDE | Expected wear (coking, poisoning) |
| Hot spot formation (OHE) | PDE | Off-design -- channeling |
| Thermocouple drift (FAF) | AIR | Instrument degradation |
| Distributor plugging (BLO) | PDE | Contamination upstream |

---

## Data model shape for baytown-v2.js

### Equipment record (on each asset)
```js
{
  tag: 'K-101',
  equipmentClass: 'centrifugal-compressor',
  equipmentCategory: 'rotating',
  taxonomyPath: 'Baytown / Hydrocracker / Compression / K-101',
  // Design attributes
  manufacturer: 'Siemens',
  model: 'STC-GV',
  ratedPower_kW: 2650,
  stages: 2,
  driverType: 'electric-motor',
  sealType: 'dry-gas',
  // Application
  service: 'H2 Recycle Gas',
  operatingMode: 'continuous',
  criticality: 'A',
  redundancy: '1x100%',
}
```

### Failure record (new entity)
```js
{
  id: 'FR-2026-00412',
  equipmentTag: 'K-101',
  date: '2026-03-14',
  failureMode: 'VIB',
  failureMechanism: 'WEA',
  failureCause: 'INADEQUATE_LUB',
  severity: 'degraded',
  detectionMethod: 'continuous_condition_monitoring',
  subunit: 'drive_end_bearing',
  maintainableItem: 'thrust_bearing',
  operatingCondition: 'running',
  descriptor: 'Axial vibration trended up from 2.1 to 4.8 mm/s over 72h',
  downtimeHours: 0,
  manHoursByDiscipline: { mechanical: 8, instrument: 2 },
  workOrderId: 'WO-4481',
  investigationId: 'IN-0891',
}
```

### Maintenance record (on completed work orders)
Fields per ISO 14224 Table 3: maintenance category (corrective/preventive/modification), activity (replace/repair/adjust/refit/check/service/test/inspect/overhaul), items maintained, spare parts, man-hours by discipline, active maintenance time, downtime, logistic delay time.

---

## Notes and caveats

- The 3-letter codes above are consistent with OREDA handbook usage and multiple secondary sources. ISO 14224:2016 Annex B tables B.6-B.15 contain the authoritative per-equipment failure mode tables but are behind the ISO paywall.
- Edition drift: 1999 used a smaller failure mode set; 2006 expanded; 2016 added the "incipient" severity class. Use 2016 terminology.
- **OREDA Handbook** is the companion reference that real reliability engineers cite -- it publishes actual failure rates per equipment class per mode. Mentioning OREDA in the case study lends credibility.
- For the demo, using the codes verbatim (VIB, WEA, ELP, etc.) makes the data instantly recognizable to any reliability engineer.

## Sources
- ISO 14224:2016 standard page, iso.org/standard/64076.html
- OREDA Handbook (SINTEF)
- Ecesis: ISO 14224 Failure Codes Guide
- Power-MI: Asset Hierarchy Taxonomy, Maintenance Categories
- SwainSmith: Free Reliability Event Codes based on ISO 14224:2016
- Maintenance & Engineering: RM Data Improvement Based on ISO 14224
