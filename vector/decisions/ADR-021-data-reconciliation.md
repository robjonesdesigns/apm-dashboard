# ADR-021: Data Reconciliation (21 Events)

**Status:** Accepted
**Date:** 2026-03-28

## Context

Asset-level `activeEvents` (summing to 21) and RISK_MATRIX/EVENT_SUMMARY (totaling 17) were inconsistent. The per-asset numbers told a better story (K-101 at 8 events as the clear problem child), so we scaled the aggregates up to match.

## Decision

### Per-asset event breakdown

Every asset now has `newEvents` + `inProgressEvents` = `activeEvents`:

| Asset | Crit | New | In Prog | Total | Notes |
|-------|------|-----|---------|-------|-------|
| K-101 | A | 2 | 6 | 8 | Main incident, heavily investigated |
| K-302 | A | 1 | 2 | 3 | Some attention, no WOs yet |
| R-301 | A | 0 | 0 | 0 | Healthy |
| P-203 | B | 1 | 3 | 4 | 1 WO open, mostly being worked |
| C-201 | B | 2 | 1 | 3 | No WOs, mostly unassigned |
| T-401 | B | 0 | 1 | 1 | Known, planned outage event |
| T-102 | B | 1 | 0 | 1 | Minor new event |
| E-105 | C | 1 | 0 | 1 | Low-priority new event |
| V-501 | C | 0 | 0 | 0 | Healthy |
| P-102 | C | 0 | 0 | 0 | Healthy |

### RISK_MATRIX (derived from above)

| Crit | New | In Progress | Total |
|------|-----|-------------|-------|
| A | 3 | 8 | 11 |
| B | 4 | 5 | 9 |
| C | 1 | 0 | 1 |
| Total | 8 | 13 | 21 |

### EVENT_SUMMARY (Alarm Quality donut, adjusted to 21)

| Category | Count |
|----------|-------|
| Confirmed | 13 |
| False Positives | 3 |
| New (unvalidated) | 5 |
| Total | 21 |

### Two dimensions of "New"

- EVENT_SUMMARY "New" = unvalidated signal (not yet confirmed real or false)
- RISK_MATRIX "New" = unassigned investigation (nobody picked it up yet)

These are different dimensions. An event can be confirmed-real but still unassigned.

### CASE_SUMMARY removed

Was duplicate of Investigations card data. Investigation status (open/investigating) is tracked in CASES array.

### Derived counts in Asset Table

Work Orders and Investigations columns derive from `WORK_ORDERS` and `CASES` by `assetId` at render time, ensuring numbers always match the card summaries.
