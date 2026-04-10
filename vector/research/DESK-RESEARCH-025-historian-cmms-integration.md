# DESK-RESEARCH-025: Historian and CMMS Integration Architecture

**Purpose:** Reference for how real APM platforms consume data from industrial historians (OSIsoft PI, Honeywell PHD, AspenTech IP.21) and CMMS systems (SAP PM, IBM Maximo). Informs the production-grade path from demo data to connected system, and defines the shapes the data model must be able to produce.

---

## 1. Historian tag structure

### OSIsoft PI naming convention

Hierarchical dot-delimited:
```
[Site].[Unit].[Equipment].[Measurement].[Qualifier]
```

**Baytown K-101 example tags:**
```
BYT.C-101.DE_BRG.VIB.X          # drive end bearing vibration X-axis
BYT.C-101.DE_BRG.TEMP           # drive end bearing temperature
BYT.C-101.DISCH.PRESS           # discharge pressure
BYT.C-101.DISCH.TEMP            # discharge temperature
BYT.C-101.SPEED                 # shaft speed RPM
BYT.C-101.LUBE.OIL_PRESS        # lube oil pressure
BYT.FI-2301.PV                  # flow instrument process variable
BYT.TI-4420.PV                  # temperature instrument process variable
```

No enforced standard -- every plant configures differently. Tag mapping layer is required to map tags to asset hierarchy.

### PI tag metadata (point attributes)

| Attribute | Type | Example | Purpose |
|---|---|---|---|
| `Tag` | string | `BYT.C-101.DE_BRG.VIB.X` | Unique identifier |
| `PointType` | enum | `Float32`, `Int16`, `Digital`, `String` | Data type |
| `EngUnits` | string | `mm/s`, `degC`, `kPa`, `RPM` | Engineering units |
| `Descriptor` | string | `C-101 DE Bearing Vibration X-axis` | Human-readable |
| `ExDesc` | string | `Bently Nevada 3500/42M` | Extended (often sensor model) |
| `PointSource` | string | `OPC`, `L` (lab), `M` (manual) | Data source |
| `Scan` | boolean | `true` | Actively scanned |
| `Scan Rate` | int seconds | `1`, `5`, `60` | Interface poll rate |
| `ExcDev` | float | `0.5` | Exception deviation (compression deadband) |
| `ExcMax` | int seconds | `600` | Forces write even without change |
| `CompDev` | float | `1.0` | Compression deviation |
| `CompMax` | int seconds | `28800` | Max time between stored values |
| `Zero` | float | `0.0` | Range low |
| `Span` | float | `25.4` | Full range = Zero + Span |
| `Typical Value` | float | `3.2` | Expected normal operating value |
| `SourceTag` | string | `AI_04_CH03` | DCS/PLC tag name |
| `InstrumentTag` | string | `VT-2301A` | P&ID instrument tag |
| `Location1-5` | int | varies | User-defined codes |
| `DigitalSet` | string | `Modes` | Digital state set name |
| `CreationDate` | datetime | `2019-03-15T08:00:00Z` | Tag creation |

**Critical distinction:** PI is a historian, not an alarm system. Alarm limits (HH, H, L, LL) are configured in the DCS (Honeywell Experion, Emerson DeltaV), not on the PI tag. PI receives alarm state changes as events. PI AF (Asset Framework) can define limits for analytics, but authoritative alarm config lives in the control system.

---

## 2. PI Web API query patterns

**Recorded values** (actual stored events, compressed):
```
GET /piwebapi/streams/{webId}/recorded
    ?startTime=2026-04-08T00:00:00Z
    &endTime=2026-04-09T00:00:00Z
    &maxCount=10000
```

**Interpolated values** (evenly spaced):
```
GET /piwebapi/streams/{webId}/interpolated
    ?startTime=2026-04-08T00:00:00Z
    &endTime=2026-04-09T00:00:00Z
    &interval=5m
```

**Plot values** (optimized for display, min/max/avg per pixel):
```
GET /piwebapi/streams/{webId}/plot
    ?startTime=*-24h
    &endTime=*
    &intervals=800
```

**Summary** (aggregated stats):
```
GET /piwebapi/streams/{webId}/summary
    ?startTime=*-7d
    &endTime=*
    &summaryType=Average,Minimum,Maximum,StdDev,Count
    &summaryDuration=1h
```

### Response shape

```json
{
  "Items": [
    {
      "Timestamp": "2026-04-08T00:00:05.0000000Z",
      "Value": 3.217,
      "UnitsAbbreviation": "mm/s",
      "Good": true,
      "Questionable": false,
      "Substituted": false,
      "Annotated": false
    }
  ]
}
```

**Quality flags** (map to OPC quality codes):
- **Good** -- normal reading
- **Questionable** -- sensor suspect but value recorded (stale, out of calibration)
- **Substituted** -- manually overridden by operator or calculation
- **Annotated** -- operator note attached

Bad quality system digital states: `Bad Input`, `I/O Timeout`, `No Data`, `Calc Failed`, `Comm Fail`, `Shutdown`, `Configure`, `Pt Created`.

Honeywell PHD (via OPC HDA) and AspenTech IP.21 (via SQLplus against ATCAI) use the same underlying shape: timestamp + value + quality.

---

## 3. Alarm and event data (ISA-18.2)

### Alarm record fields
| Field | Example |
|---|---|
| `TagName` | `BYT.C-101.DE_BRG.VIB.X` |
| `Timestamp` | `2026-04-08T14:23:07.342Z` |
| `EventType` | `Alarm`, `Event`, `SystemEvent` |
| `AlarmType` | `HI`, `HIHI`, `LO`, `LOLO`, `ROC`, `DEV` |
| `Priority` | `1` (Critical), `2` (High), `3` (Medium), `4` (Low) |
| `State` | `UNACK_ALM`, `ACK_ALM`, `RTN_UNACK`, `RTN_ACK` |
| `Value` | `12.8` |
| `Limit` | `10.0` |
| `Units` | `mm/s` |
| `Area` | `Unit 23` |
| `Description` | `C-101 DE Bearing Vibration High` |
| `Operator` | `JSMITH` (who acknowledged) |
| `AckTimestamp` | `2026-04-08T14:25:12Z` |
| `Duration` | `342` seconds |

### Alarm vs event
- **Alarm** -- measured value crossed a limit. Lifecycle: active -> acknowledged -> returned -> cleared. Requires operator action. Has priority. Subject to ISA-18.2 four-state model.
- **Event** -- discrete occurrence with no limit (operator login, setpoint change, mode change, equipment start/stop). Timestamp + description, no alarm state.
- **System event** -- infrastructure (comm failure, historian buffer overflow, interface restart).

### ISA-18.2 priority mapping (industry standard)
| Priority | Label | Response | Consequence |
|---|---|---|---|
| 1 | Critical / Emergency | < 5 min | Safety, environmental, major damage |
| 2 | High | < 10 min | Significant production, equipment damage risk |
| 3 | Medium | < 30 min | Moderate impact |
| 4 | Low | < 60 min (or next shift) | Informational, advisory |

---

## 4. SAP PM work order structure

### Order header (AUFK table)
| Field | Type | Example |
|---|---|---|
| `AUFNR` | string(12) | `000004001234` | Order number |
| `AUART` | string(4) | `PM01` | Order type |
| `KTEXT` | string(40) | `Replace DE bearing C-101` | Short description |
| `PRIOK` | string(1) | `1`-`4` | Priority |
| `STAT` | string | `REL`, `CRTD`, `TECO`, `CLSD` | System status |
| `EQUNR` | string(18) | `000000000010045678` | Equipment number |
| `TPLNR` | string(30) | `BYT-U23-C-101` | Functional location |
| `QMNUM` | string(12) | `000020001234` | Notification (trigger) |
| `ARBPL` | string(8) | `MECH01` | Work center (craft) |
| `GSTRP` | date | `2026-04-10` | Basic start date |
| `GLTRP` | date | `2026-04-12` | Basic finish date (PM due date) |
| `ERDAT` | date | `2026-04-08` | Created on |
| `GETRI` | date | `2026-04-12` | Actual finish (TECO date) |

### Operations (AFVC table)
| Field | Type | Example |
|---|---|---|
| `VORNR` | string(4) | `0010`, `0020` | Operation number |
| `LTXA1` | string(40) | `Isolate and LOTO` | Description |
| `ARBPL` | string(8) | `MECH01` | Work center |
| `ANZZL` | int | `2` | Number of persons |
| `DAURE` | float | `4.0` | Duration (hours) |
| `ISMNW` | float | `8.0` | Planned person-hours |

### Order type taxonomy (configurable, but near-universal)
| Type | Code | Description |
|---|---|---|
| Corrective maintenance | `PM01` | Breakdown or reactive repair |
| Preventive maintenance | `PM02` | Time-based scheduled |
| Condition-based maintenance | `PM03` | Triggered by monitoring/inspection |
| Refurbishment | `PM04` | Major overhaul |
| Calibration | `PM05` | Instrument calibration |
| Project/modification | `PM06` | Engineering change |
| Inspection | `PM07` | Routine inspection rounds |

### Maintenance plan hierarchy
```
Maintenance Plan (IP01/IP02)  [MPLA/MHIS tables]
  -> Maintenance Item (IP04/IP05)
       -> Task List / Maintenance Strategy
            -> Generated Work Order (on schedule trigger)
```

**PM compliance in SAP:**
- Planned date: from maintenance plan scheduling (when WO should execute)
- TECO date (`GETRI`): when work actually finished
- On-time = TECO date <= Planned finish date + tolerance (typically 7 days grace, or 10% of interval)

SAP does not natively compute a single "PM compliance %" KPI. This is done in the reporting layer (SAP BW, custom ABAP report, or the APM platform).

---

## 5. Asset hierarchy in SAP PM

```
Plant (WERKS)
  -> Functional Location (TPLNR) -- represents POSITION
       -> Functional Location (child)
            -> Equipment (EQUNR) -- represents PHYSICAL OBJECT
                 -> Sub-Equipment (parent-child via HEQUI)
```

**Baytown example:**
```
1000 (Baytown Refinery)
  BYT (Site)
    BYT-U23 (Unit 23 - Hydrocracker)
      BYT-U23-C (Compression section)
        BYT-U23-C-101 (Functional location: K-101 position)
          Equipment 10045678: Centrifugal Compressor K-101
            Sub-equipment 10045679: Drive-End Bearing
            Sub-equipment 10045680: Non-Drive-End Bearing
            Sub-equipment 10045681: Lube Oil System
            Sub-equipment 10045682: Mechanical Seal
            Sub-equipment 10045683: Anti-Surge Valve
```

**Key distinction:** Functional locations are positions (don't move). Equipment records are physical objects (can be installed/removed/swapped). This tracks equipment moves, refurbishment, and spare management.

### Mapping SAP PM to APM model
| SAP PM | APM | baytown.js |
|---|---|---|
| Plant (`WERKS`) | Site | top-level PLANT |
| Functional Location (level 1-2) | Unit/Area | `processUnit` |
| Functional Location (leaf) | Asset position | -- |
| Equipment | Asset | asset object (K-101) |
| Sub-Equipment | Sub-asset | subAssets array |
| (none) | Sensor/Tag | sensors array (from historian, not CMMS) |

**The central integration problem:** Equipment is the maintenance target in SAP. Tag is the data source in the historian. An APM platform must join the two. Join key is typically:
1. A mapping table (Equipment Number <-> Tag Name Pattern)
2. PI AF element references that embed the equipment ID
3. A naming convention where the tag name contains the equipment ID (e.g., `BYT.C-101.*`)

This mapping layer is the unsexy hard problem every APM platform solves.

---

## 6. Data integration patterns

### How commercial APM platforms consume data

**GE APM (formerly Meridium):**
- Historian: OPC-HDA adapter or PI SDK. PI AF SDK for asset context.
- CMMS: SAP RFC/BAPI calls or flat file extract. Nightly batch for WO history, near-real-time (15 min) for new WOs.
- Asset hierarchy: imported from SAP PM functional locations + equipment master.
- Own relational DB (Oracle/SQL Server) for joined/enriched data.

**AspenTech Mtell:**
- Historian: Direct IP.21 (native), PI via OPC-HDA, or REST.
- Reads sensor data in batch windows for model training (months of history at 1-min or finer).
- Live monitoring: streaming or 1-5 min polling.
- CMMS via SAP RFC for failure history (needed to label training data).

**Honeywell Forge APM:**
- Historian: Direct PHD (native), PI via PI Web API.
- CMMS via middleware (SAP PI/PO or MuleSoft).
- Dashboards refresh 5-15 min for condition monitoring.
- Daily batch for KPI roll-ups.

### Integration pattern by use case
| Pattern | Use Case | Frequency | Technology |
|---|---|---|---|
| Streaming | Real-time condition monitoring, vibration alerts | Seconds to 1 min | OPC-UA pub/sub, Kafka, MQTT, PI-to-PI |
| API polling | Dashboard refresh, current values | 1-15 min | PI Web API REST, OPC-DA, Modbus |
| Batch ETL | KPI calculation, WO history, PM compliance | Hourly to daily | SAP RFC/BAPI, SQL queries, CSV/XML |
| Event-driven | New alarm, new WO, WO status change | On occurrence | SAP IDoc, webhook, message queue |

### Typical dashboard refresh rates
| Dashboard View | Refresh | Source |
|---|---|---|
| Real-time condition monitoring | 5-60 sec | Historian streaming/polling |
| Asset health overview / fleet view | 5-15 min | Pre-computed health scores |
| Alarm summary | 1-5 min | Alarm historian or DCS |
| Work order backlog | 15-60 min | CMMS API or replicated DB |
| PM compliance KPIs | Daily (batch) | CMMS + calculated |
| Risk matrix / criticality view | Daily or on-demand | Calculated |
| Cost roll-ups | Daily or weekly | CMMS + ERP (SAP CO) |

---

## 7. Production-grade build path

Realistic engineering effort for connecting APM dashboard to a real plant:

**Layer 1: Data ingestion (the hard part)**
1. **PI Web API adapter** -- ~65% of refineries use OSIsoft PI. REST, well-documented, Node/Python clients exist. 2-3 months for a solid adapter.
2. **Tag mapping layer** -- YAML/JSON config per plant, or a UI for site engineers to map PI tags to asset hierarchy. Unsexy hard problem.
3. **SAP PM adapter** -- SAP RFC/BAPI or OData. SAP dominates oil & gas CMMS. 3-4 months (SAP integrations are always harder than expected).

**Layer 2: Calculation engine**
- Python service on cron. Hourly for KPIs, daily for PM compliance, on-sensor-reading for RUL.
- PostgreSQL + TimescaleDB for storage.
- OEE, MTBF, MTTR, PM compliance = SQL queries on time-series DB.
- RUL service = per-failure-mode degradation models. Start with linear/exponential/asymptotic curve fitting (numpy/scipy). Scikit-learn is overkill for v1.

**Layer 3: API layer**
- REST for historical/batch. WebSocket for live sensor updates.
- Your component architecture already handles both patterns (static imports today, `useQuery` tomorrow).

**Total effort (MVP):**
- 2 full-stack engineers + 1 domain/reliability consultant
- 9-12 months to first production deployment
- Months 1-6: PI adapter + SAP adapter + one working plant
- Months 6-12: calculation engine + RUL + second plant

---

## 8. Key takeaways for the baytown-v2.js data model

1. **Tags are the atomic unit.** Each tag = one measurement point. Tags carry metadata (units, description, scan rate, compression settings) but NOT alarm limits (those live in the DCS).

2. **Historical data is `{timestamp, value, quality}`.** Quality flags (Good/Questionable/Substituted/Bad) are essential for any realistic model. Bad data exists and must be handled.

3. **Alarms follow ISA-18.2 four-state model** (UNACK_ALM, ACK_ALM, RTN_UNACK, RTN_ACK). Priority 1-4. Alarms have a lifecycle; events do not.

4. **SAP PM has an order type taxonomy** (PM01 corrective, PM02 preventive, PM03 condition-based). PM compliance is computed from planned vs actual dates on PM02 orders.

5. **Asset hierarchy has two axes:** functional location (where in the plant) and equipment (what physical thing). They are separate concepts joined by installation.

6. **The join between historian tags and CMMS equipment is the central integration problem.** The data model needs explicit mapping between tag names and asset IDs.

7. **Dashboard refresh rates vary by view.** Seconds for condition monitoring, minutes for health overviews, daily for KPI roll-ups. A realistic model should reflect these different temporal grains.

---

## Sources
- OSIsoft/AVEVA PI System documentation
- PI Web API reference
- ISA-18.2 / IEC 62682 Alarm Management standard
- SAP PM documentation (IW31/IW32/IW33, MPLA/MHIS tables)
- IBM Maximo Application Suite architecture docs
- GE APM / Meridium integration guides
- AspenTech Mtell technical documentation
- Honeywell Forge APM architecture whitepapers
- OPC Foundation specifications (OPC-DA, OPC-HDA, OPC-UA)
