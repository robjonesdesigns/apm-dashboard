# STORY-002: Asset Narratives and Sub-Asset Data

## Plant Context

Baytown Refinery. Petroleum refinery producing transportation fuels: gasoline, diesel, jet fuel, and petrochemical feedstocks. Two main process units plus utilities.

**Hydrocracker Unit:** R-301 (reactor), K-101 (H2 recycle compressor), V-501 (HP separator), E-105 (feed/effluent exchanger), P-203 (feed pump), C-201 (interstage cooler), P-102 (reflux pump in fractionation)

**FCC Unit:** K-302 (wet gas compressor), T-102 (power recovery turbine)

**Utilities:** T-401 (gas turbine, power generation)

---

## Asset Distribution at 7 AM

| Asset | Type | Crit | Status | Category |
|---|---|---|---|---|
| K-101 | Compressor | A | Tripped | In trouble |
| P-203 | Pump | B | Degraded | In trouble |
| K-302 | Compressor | A | Degraded | In trouble |
| C-201 | Cooler | B | Degraded | Being watched |
| T-102 | Turbine | B | Running | Being watched (early warning) |
| T-401 | Turbine | B | Running | Scheduling decision pending |
| E-105 | Heat Exchanger | C | Running | Under investigation, fine |
| V-501 | Vessel | C | Running | Under investigation, fine |
| R-301 | Reactor | A | Running | Completely healthy |
| P-102 | Pump | C | Running | Completely healthy |

3 in trouble, 2 being watched, 2 under investigation but fine, 1 scheduling question, 2 healthy. Realistic plant distribution.

---

## K-101: Centrifugal Compressor (H2 Recycle Gas, Hydrocracker)

**Criticality:** A (Safety) | **Status:** Tripped | **Story:** Main incident

**Narrative:** Oil filter starts bypassing around day 14. Filter differential pressure alarm set too high, nobody catches it. Contaminated lubricant enters bearing housing. Journal bearing surfaces erode over two weeks. Oil pressure slowly drops as bearing clearances widen. Vibration climbs as shaft runs eccentric.

Day 28, 1:30 AM: oil pressure drops to 1.2 bar, aux pump kicks in. 1:45 AM: oil pressure alarm at 1.0 bar. 2:00 AM: vibration spikes to 7.8 mm/s past 7.1 threshold. 2:03 AM: automatic trip on high vibration.

Morning after: bearing inspection confirms mechanical damage. RUL revised to 5 days. Root cause investigation finds filter bypass, questions why vibration alerts were present for 3 days with no intervention.

**Lesson:** The signals were there. The system generated alerts. Nobody connected the dots in time. That's the problem Plant Overview is designed to solve.

### Sub-Assets

| Sub-Asset | ID | Status | Key Sensors | Current Values | Thresholds |
|---|---|---|---|---|---|
| Drive End Bearing | K-101-DE | Degraded | Vibration, Temperature, Oil Film Thickness | 7.8 mm/s, 108C, 18 microns | Alarm: 7.1 mm/s, 95C, 25 microns |
| Non-Drive End Bearing | K-101-NDE | Running | Vibration, Temperature | 1.2 mm/s, 62C | Alarm: 7.1 mm/s, 95C |
| Lube Oil System | K-101-LOS | Degraded | Oil Pressure, Filter DP, Oil Temperature, Particle Count | 1.0 bar, 0.3 bar (bypassing), 58C, 22/19/16 | Alarm: 1.5 bar, 0.8 bar, 65C |
| Mechanical Seal | K-101-SEAL | Running | Seal Gas DP, Leakage Rate | 3.2 bar, 0.8 Nm3/hr | Alarm: 2.0 bar, 2.5 Nm3/hr |
| Anti-Surge Valve | K-101-ASV | Running | Valve Position, Surge Margin, Cycle Count (24hr) | 42% open, 7%, 14 cycles | Alarm: surge margin <10%, cycles >20/hr |
| Coupling | K-101-CPL | Running | Alignment Offset, Temperature | 0.05 mm, 45C | Alarm: 0.15 mm, 80C |
| Rotor/Impeller | K-101-ROT | Running | Axial Displacement, Balance | 0.12 mm, Grade G2.5 | Alarm: 0.25 mm |

Drive End Bearing: red (vibration past trip, temp past alarm). Lube Oil System: amber (pressure below alarm, filter DP shows bypass). Anti-Surge Valve: elevated activity (42% open, 14 cycles) from fighting instability before trip. Rest: green.

---

## P-203: Centrifugal Pump (Hydrocracker Feed Pump, Hydrocracker)

**Criticality:** B (Production) | **Status:** Degraded | **Story:** Recurring failure

**Narrative:** Third mechanical seal replacement in six months. Each time the maintenance team replaces the seal and the pump runs fine for 6-8 weeks, then starts leaking again. Investigation CS-0894 is trying to figure out why.

Root cause: shaft runout. After the second seal replacement, alignment wasn't checked properly. Shaft is running slightly eccentric, wearing the seal face unevenly. Each replacement addresses the symptom but not the cause. Current discharge pressure drop (8% below normal) is from minor internal leakage through the degraded seal.

**Clue:** Coupling alignment is at 73% of alarm threshold (0.11 mm vs 0.15 mm), trending up. The engineer who connects recurring seal failures to creeping alignment finds the root cause.

### Sub-Assets

| Sub-Asset | ID | Status | Key Sensors | Current Values | Thresholds |
|---|---|---|---|---|---|
| Mechanical Seal (Discharge) | P-203-SEAL | Degraded | Leakage Rate, Seal Chamber Pressure, Seal Face Temperature | 4.2 L/hr, 8.1 bar, 78C | Alarm: 2.0 L/hr, 7.5 bar, 85C |
| Drive End Bearing | P-203-DE | Running | Vibration, Temperature | 2.1 mm/s, 58C | Alarm: 5.0 mm/s, 85C |
| Non-Drive End Bearing | P-203-NDE | Running | Vibration, Temperature | 1.8 mm/s, 55C | Alarm: 5.0 mm/s, 85C |
| Impeller | P-203-IMP | Running | Discharge Pressure, Flow Rate, Efficiency | 32.4 bar, 285 m3/hr, 76% | Alarm: <30.5 bar, <250 m3/hr |
| Coupling | P-203-CPL | Running | Alignment Offset, Axial Play | 0.11 mm, 0.08 mm | Alarm: 0.15 mm, 0.12 mm |
| Motor | P-203-MTR | Running | Current Draw, Winding Temperature, Insulation Resistance | 42A, 68C, 850 MOhm | Alarm: 48A, 95C, <200 MOhm |

---

## K-302: Centrifugal Compressor (Wet Gas Compressor, FCC)

**Criticality:** A (Safety) | **Status:** Degraded | **Story:** Misdiagnosed problem

**Narrative:** Operations noticed discharge temperature swinging by 8-10C every few minutes. Control room initially blamed the anti-surge control valve (hunting). WO-4494 opened to stroke-test the valve. Investigation CS-0893 started as a controls issue.

Root cause: polymer fouling on the first-stage impeller blades. FCC wet gas carries heavy hydrocarbons that polymerize on blade surfaces. Buildup is uneven, so compressor oscillates between restricted flow (fouled) and partial break-off (cleaner). Control valve is responding correctly to the oscillation, not causing it.

**Clue:** Discharge temperature oscillates but suction conditions are stable. If it were a valve issue, suction pressure would fluctuate too. Steady suction with oscillating discharge points to something inside the compressor.

**3 repetitive events** on K-302 are from temperature oscillation: system flags the discharge temp swing each time it exceeds rate-of-change threshold.

### Sub-Assets

| Sub-Asset | ID | Status | Key Sensors | Current Values | Thresholds |
|---|---|---|---|---|---|
| First-Stage Impeller | K-302-IMP1 | Degraded | Discharge Temperature, Polytropic Efficiency, Discharge Pressure | 142C (oscillating +/-8C), 71%, 4.8 bar | Alarm: >148C, <68%, <4.2 bar |
| Second-Stage Impeller | K-302-IMP2 | Running | Discharge Temperature, Polytropic Efficiency | 198C, 74% | Alarm: >210C, <68% |
| Drive End Bearing | K-302-DE | Running | Vibration, Temperature | 2.4 mm/s, 65C | Alarm: 7.1 mm/s, 95C |
| Non-Drive End Bearing | K-302-NDE | Running | Vibration, Temperature | 2.1 mm/s, 62C | Alarm: 7.1 mm/s, 95C |
| Lube Oil System | K-302-LOS | Running | Oil Pressure, Filter DP, Oil Temperature | 2.0 bar, 0.4 bar, 52C | Alarm: 1.5 bar, 0.8 bar, 65C |
| Anti-Surge Valve | K-302-ASV | Running | Valve Position, Surge Margin, Cycle Count (24hr) | 38% open, 14%, 8 cycles | Alarm: surge margin <10%, cycles >20/hr |
| Mechanical Seal | K-302-SEAL | Running | Seal Gas DP, Leakage Rate | 3.5 bar, 0.6 Nm3/hr | Alarm: 2.0 bar, 2.5 Nm3/hr |

Contrast with K-101: lube oil system is healthy here. Different failure mode, different root cause.

---

## C-201: Air Fin Cooler (Compressor Interstage Cooling, Hydrocracker)

**Criticality:** B (Production) | **Status:** Degraded | **Story:** Cascade from K-101

**Narrative:** C-201 cools gas between compression stages on K-101. When K-101 tripped at 2:03 AM, the sudden pressure release sent a transient pulse through interstage piping. The cooler's fan was already running with a belt losing tension over months. The pressure transient shifted the belt on the sheave. Fan now runs with intermittent vibration, 3.2 mm/s spiking to 4.8 during belt slip events.

The cooler itself is fine. Tubes aren't fouled, process side works. Purely a mechanical issue on the air side. Investigation CS-0892 determining whether related to K-101 trip or already developing independently. Answer: both. Belt was already loose, transient made it worse.

**Demonstrates:** How one trip event cascades to adjacent equipment.

### Sub-Assets

| Sub-Asset | ID | Status | Key Sensors | Current Values | Thresholds |
|---|---|---|---|---|---|
| Fan Assembly | C-201-FAN | Degraded | Vibration, Motor Current, Belt Tension | 3.2 mm/s (spikes to 4.8), 12.4A, 82% | Alarm: 4.0 mm/s, 15A, <75% |
| Fan Motor | C-201-MTR | Running | Winding Temperature, Insulation Resistance | 62C, 920 MOhm | Alarm: 95C, <200 MOhm |
| Tube Bundle | C-201-TUB | Running | Process Outlet Temperature, Fouling Factor, Pressure Drop | 48C, 0.0003 m2K/W, 0.4 bar | Alarm: >55C, >0.0006, >0.8 bar |
| Louvers | C-201-LVR | Running | Position, Actuator Response | 65% open, 2.1 sec | Alarm: actuator >5 sec |
| Structure/Frame | C-201-STR | Running | Foundation Vibration | 0.8 mm/s | Alarm: 2.5 mm/s |

---

## T-401: Gas Turbine (Power Generation, Utilities)

**Criticality:** B (Production) | **Status:** Running | **Story:** Scheduling decision

**Narrative:** 12,000-hour combustion inspection was scheduled weeks ago. The maintenance window opened at 6:00 AM but K-101 tripped at 2:03 AM. Now there's a question: should we shut down a healthy power source during a crisis to do preventive maintenance that can wait another week?

The turbine is healthy. Previous inspections at 6,000 and 9,000 hours found minor coating wear within expected limits. The maintenance team, contractors, parts, and scaffolding are standing by. But with K-101 down and the plant under stress, the morning huddle will decide whether to proceed or defer.

**Demonstrates:** Not every decision is reactive. Sometimes the dashboard helps with scheduling trade-offs during a crisis.

### Sub-Assets

| Sub-Asset | ID | Status | Key Sensors | Current Values | Thresholds |
|---|---|---|---|---|---|
| Combustion Section | T-401-CMB | Running | Exhaust Temperature Spread, Flame Detection | 18C spread, all flames detected | Alarm: spread >25C |
| Gas Generator Turbine | T-401-GGT | Running | Inlet Temperature, Exhaust Temperature, Vibration | 945C, 520C, 4.2 mm/s | Alarm: >980C, >560C, >12 mm/s |
| Power Turbine | T-401-PT | Running | Output Speed, Vibration, Bearing Temperature | 3600 RPM, 3.8 mm/s, 72C | Alarm: overspeed >105%, >12 mm/s, >95C |
| Lube Oil System | T-401-LOS | Running | Oil Pressure, Oil Temperature, Filter DP | 2.1 bar, 48C, 0.3 bar | Alarm: <1.5 bar, >65C, >0.8 bar |
| Inlet Air System | T-401-AIR | Running | Filter DP, Ambient Temperature | 0.6 kPa, 24C | Alarm: >1.2 kPa |
| Generator | T-401-GEN | Running | Winding Temperature, Insulation Resistance, Output | 82C, 1200 MOhm, 18.4 MW | Alarm: >105C, <200 MOhm |
| Fuel System | T-401-FUEL | Running | Fuel Gas Pressure, Flow Rate | 22 bar, 4200 Nm3/hr | Alarm: <18 bar |

Note: T-401 status changed from "planned-outage" to "running" because the inspection hasn't started yet. The decision to proceed is pending the morning huddle.

---

## E-105: Shell and Tube Heat Exchanger (Feed/Effluent, Hydrocracker)

**Criticality:** C (Support) | **Status:** Running | **Story:** Slow burn

**Narrative:** E-105 preheats hydrocracker feed using hot reactor effluent. Two months ago the refinery shifted to a heavier crude slate. Heavier feed produces more asphaltene precursors that deposit on tube surfaces faster than the fouling model predicted. Feed outlet temperature is 6C lower than expected. Model predicted this fouling at month 8; happened at month 4. Model trained on previous lighter crude.

Investigation CS-0896 checking whether accelerated fouling is purely from feed change or if there's a tube leak (chlorides in process fluid). Lab results pending. Exchanger still running, fired heater downstream compensates but burns more fuel.

**Demonstrates:** Not all problems have alarms. Some are trends that need explaining. Tests whether dashboard supports slow-burn investigation, not just crisis response.

### Sub-Assets

| Sub-Asset | ID | Status | Key Sensors | Current Values | Thresholds |
|---|---|---|---|---|---|
| Tube Bundle (Process Side) | E-105-TUB-P | Running | Outlet Temperature, Fouling Factor, Pressure Drop | 142C (expected 148C), 0.00045 m2K/W, 0.6 bar | Alarm: fouling >0.0006, DP >0.8 bar |
| Tube Bundle (Shell Side) | E-105-TUB-S | Running | Outlet Temperature, Pressure Drop | 88C, 0.3 bar | Alarm: DP >0.6 bar |
| Channel Head | E-105-CH | Running | UT Thickness (last survey) | 12.2 mm (nominal 14 mm) | Alarm: <10 mm |
| Shell | E-105-SHL | Running | UT Thickness (last survey), Corrosion Rate | 18.4 mm (nominal 20 mm), 0.15 mm/yr | Alarm: <15 mm, >0.25 mm/yr |
| Gaskets | E-105-GSK | Running | External Leak Detection | None detected | Alarm: any leak |
| Relief Valve | E-105-RV | Running | Set Pressure, Last Test Date | 42 bar, tested 6 months ago | Retest: 12 months |

---

## T-102: Power Recovery Turbine (FCC Power Recovery, FCC)

**Criticality:** B (Production) | **Status:** Running | **Story:** Early warning

**Narrative:** T-102 recovers energy from FCC flue gas. Running 14 months since last overhaul. Exhaust temperature spread widening over three weeks: 12C three weeks ago, now 22C. Alarm threshold is 30C.

Root cause: two of eight fuel nozzles developing coke deposits. Coking restricts fuel flow, those nozzles run lean, other six compensate rich. Uneven combustion creates hot spots near clean nozzles, cool spots near coked ones.

Not urgent. Turbine runs fine at 22C spread. But trend is clear: at current rate, spread hits 30C alarm in about two weeks, triggering forced outage. Investigation CS-0895 monitoring to decide whether to schedule cleaning now or wait.

**Parallel to K-101:** K-101 had signals for days before the trip and nobody acted. T-102 has signals now. Will this time be different?

### Sub-Assets

| Sub-Asset | ID | Status | Key Sensors | Current Values | Thresholds |
|---|---|---|---|---|---|
| Combustion Section | T-102-CMB | Running | Exhaust Temp Spread, Individual Nozzle Temps (8), Flame Intensity | 22C spread, nozzles 3 and 7 running 15C cool, even flame | Alarm: spread >30C, flame loss |
| Expander Wheel | T-102-EXP | Running | Vibration, Blade Path Temperature | 3.1 mm/s, 645C | Alarm: >8 mm/s, >680C |
| Drive End Bearing | T-102-DE | Running | Vibration, Temperature | 1.9 mm/s, 58C | Alarm: >8 mm/s, >95C |
| Non-Drive End Bearing | T-102-NDE | Running | Vibration, Temperature | 1.7 mm/s, 55C | Alarm: >8 mm/s, >95C |
| Lube Oil System | T-102-LOS | Running | Oil Pressure, Oil Temperature, Filter DP | 2.2 bar, 46C, 0.3 bar | Alarm: <1.5 bar, >65C, >0.8 bar |
| Generator | T-102-GEN | Running | Output, Winding Temperature, Insulation Resistance | 12.6 MW, 78C, 980 MOhm | Alarm: >105C, <200 MOhm |
| Fuel Nozzles (8) | T-102-FN | Running | Individual Flow Rates, Coking Index | Nozzles 3 and 7 at 82% flow, others 100-103% | Alarm: any nozzle <75% flow |

---

## V-501: Pressure Vessel (High-Pressure Separator, Hydrocracker)

**Criticality:** C (Support) | **Status:** Running | **Story:** Due diligence

**Narrative:** V-501 separates hydrogen-rich gas from liquid product downstream of reactor. When K-101 tripped, sudden loss of recycle gas compression caused pressure transient. V-501 saw brief spike from 152 bar to 161 bar over 90 seconds before control systems stabilized it. Design pressure is 180 bar. Relief valve didn't lift. No damage.

Operations flagged because any unexpected pressure excursion on a high-pressure hydrogen vessel gets documented. Investigation CS-0898 is verification: confirm no damage, review pressure trace, close it out.

**Demonstrates:** Not every investigation means something is broken. Sometimes it's due diligence.

### Sub-Assets

| Sub-Asset | ID | Status | Key Sensors | Current Values | Thresholds |
|---|---|---|---|---|---|
| Vessel Shell | V-501-SHL | Running | Operating Pressure, Operating Temperature, UT Thickness, Corrosion Rate | 152 bar, 285C, 62 mm (nominal 65 mm), 0.12 mm/yr | Design: 180 bar, 320C. Alarm: >165 bar, >310C, <55 mm |
| Level Control | V-501-LVL | Running | Liquid Level, Control Valve Position | 48%, valve 52% open | Alarm: >80%, <15% |
| Pressure Relief Valve | V-501-PRV | Running | Set Pressure, Last Test Date, Lift Count | 176 bar, tested 4 months ago, 0 lifts | Retest: 12 months |
| Inlet Nozzle | V-501-INL | Running | Erosion Rate (last inspection) | 0.08 mm/yr | Alarm: >0.20 mm/yr |
| Outlet Nozzle (Gas) | V-501-OUT-G | Running | Erosion Rate (last inspection) | 0.05 mm/yr | Alarm: >0.20 mm/yr |
| Outlet Nozzle (Liquid) | V-501-OUT-L | Running | Erosion Rate (last inspection) | 0.06 mm/yr | Alarm: >0.20 mm/yr |
| Level Transmitter | V-501-LT | Running | Calibration Drift, Last Calibration | 0.3% drift, calibrated 3 months ago | Alarm: drift >1.0%, recal at 6 months |

Different from rotating equipment: static components with inspection-based monitoring (UT thickness, erosion rates) rather than real-time vibration.

---

## R-301: Fixed-Bed Reactor (Hydrocracker Reactor, Hydrocracker)

**Criticality:** A (Safety) | **Status:** Running | **Story:** Healthy critical asset

**Narrative:** Most critical asset in the plant, most stable. Fixed-bed catalytic reactor, heavy hydrocarbons with hydrogen at high temp and pressure. Catalyst bed loaded 18 months ago, performing within expected parameters. Next reload scheduled for turnaround in 12 months.

No events, no investigations. Only routine preventive WOs: thermocouple calibration (WO-4489), hydrogen analyzer (WO-4497), safety valve scheduling (WO-4504).

K-101 trip didn't affect R-301 operationally. Reactor kept running because standby compressor picked up recycle gas duty (slowly, hence availability drop). If K-101 had no standby, R-301 would have been the real story.

### Sub-Assets

| Sub-Asset | ID | Status | Key Sensors | Current Values | Thresholds |
|---|---|---|---|---|---|
| Catalyst Bed | R-301-CAT | Running | Bed Temperature (12 zones), WABT, Catalyst Activity | Avg 385C, WABT 388C, activity 91% | Alarm: any zone >410C, WABT >400C, activity <80% |
| Reactor Shell | R-301-SHL | Running | Wall Temperature, UT Thickness, Hydrogen Embrittlement Index | 362C, 148 mm (nominal 152 mm), HEI 0.02 | Design: 425C. Alarm: wall >395C, <135 mm, HEI >0.05 |
| Inlet Distribution | R-301-INL | Running | Flow Distribution Variance, Inlet Temperature | 2.1% variance, 378C | Alarm: variance >5%, inlet >395C |
| Quench System | R-301-QCH | Running | Quench Gas Flow, Quench Valve Position, Bed Delta-T | 8400 Nm3/hr, 34% open, 28C | Alarm: delta-T >40C |
| Thermocouples (12) | R-301-TC | Running | Calibration Drift (worst), Last Calibration | 0.4C drift, calibrated 5 months ago | Alarm: drift >1.5C, recal at 12 months |
| Safety Relief System | R-301-SRV | Running | Set Pressure, Last Test, Rupture Disc Integrity | 195 bar, tested 8 months ago, intact | Retest: 12 months |
| Hydrogen Analyzer | R-301-H2 | Running | H2 Purity, Calibration Status | 99.2%, calibrated 4 months ago | Alarm: purity <98.5% |

Reactor-specific monitoring: catalyst performance, hydrogen embrittlement, quench control, thermocouple arrays. Very different from rotating equipment.

---

## P-102: Centrifugal Pump (Reflux Pump, Fractionation)

**Criticality:** C (Support) | **Status:** Running | **Story:** Boring, and that's the point

**Narrative:** Support pump in fractionation unit. Returns condensed liquid from top of fractionation column back into process. Simple, single-stage. Low criticality because spare pump available within minutes. No events, no investigations. Only routine preventive WOs: quarterly vibration baseline (WO-4485), coupling alignment check (WO-4491), motor insulation test (WO-4503).

This pump runs, gets maintained on schedule, doesn't cause problems. Background asset that fills out the table and shows the engineer most of the plant is fine.

### Sub-Assets

| Sub-Asset | ID | Status | Key Sensors | Current Values | Thresholds |
|---|---|---|---|---|---|
| Impeller | P-102-IMP | Running | Discharge Pressure, Flow Rate, Efficiency | 4.8 bar, 120 m3/hr, 79% | Alarm: <4.2 bar, <100 m3/hr |
| Mechanical Seal | P-102-SEAL | Running | Leakage Rate, Seal Chamber Pressure | 0.2 L/hr, 5.1 bar | Alarm: >2.0 L/hr, <4.5 bar |
| Drive End Bearing | P-102-DE | Running | Vibration, Temperature | 1.1 mm/s, 48C | Alarm: >5.0 mm/s, >85C |
| Non-Drive End Bearing | P-102-NDE | Running | Vibration, Temperature | 0.9 mm/s, 45C | Alarm: >5.0 mm/s, >85C |
| Coupling | P-102-CPL | Running | Alignment Offset | 0.04 mm | Alarm: >0.15 mm |
| Motor | P-102-MTR | Running | Current Draw, Winding Temperature, Insulation Resistance | 18A, 52C, 1100 MOhm | Alarm: >22A, >95C, <200 MOhm |
