# DESK-RESEARCH-003 -- APM User Roles: Reliability vs Maintenance

**Date:** 2026-03-26
**Status:** Complete
**Scope:** Who uses APM software in a refinery and how their needs differ. Informs persona development and dashboard design decisions.

---

## Key Finding: Two Managers, Two Dashboards, One System

The reliability manager and maintenance manager are both engineers but use the APM platform for fundamentally different purposes.

| Dimension | Reliability Manager | Maintenance Manager |
|-----------|-------------------|---------------------|
| Time horizon | 90 days to years | Today to next week |
| Core question | "Why does this keep failing?" | "Who is fixing it and when?" |
| Primary module | APM (analytics, RCA, asset strategy) | CMMS (work orders, scheduling, backlog) |
| Key metric | MTBF, availability, bad actor cost | Schedule compliance, backlog, PM completion |
| Output | Asset strategies, RCA reports | Completed schedules, resource plans |

## How They Interact

The reliability manager creates the "what needs to happen" (investigations, asset strategy changes, PM optimization). The maintenance manager executes it (scheduling work orders, assigning people, tracking completion).

**The feedback loop:** Technicians close work orders with failure codes and repair notes. The reliability manager consumes that data for MTBF analysis and bad actor tracking. Poor work order closeout data is the biggest friction point between these roles.

**Morning routine overlap:** Both check Plant Overview first thing. The reliability manager looks for degradation trends and overnight alerts. The maintenance manager looks for emergency work orders and schedule disruptions.

## Design Implications

1. **Plant Overview serves both personas** but they look at different sections. The reliability manager scans KPIs and trends. The maintenance manager scans work orders and resource allocation.

2. **"Today's Activity" (work orders + cases) on the Plant Overview** serves both: the maintenance manager sees her schedule, the reliability manager sees case status.

3. **Asset Inspection is primarily reliability's screen.** The maintenance manager would only go here if specifically investigating a work order context.

4. **Work Orders dashboard is primarily maintenance's screen.** The reliability manager reads it for context but doesn't manage assignments.

5. **Investigations is primarily reliability's screen.** The maintenance manager reads it to anticipate incoming work orders.

6. **Technicians do not use APM.** They use CMMS mobile for work orders only. They are data producers, not consumers.

## Sources
- Reliabilityweb, Accendo Reliability, McKinsey, IDCON, Becht Engineering
- Rob Jones interviews (INTERVIEW-001, INTERVIEW-002)
