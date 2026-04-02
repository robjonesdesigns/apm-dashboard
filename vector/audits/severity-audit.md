# Severity Audit -- TIMELINE Events
**Date:** 2026-03-31
**File audited:** `src/data/baytown.js`
**Events audited:** 36

---

## Derivation Matrix Reference

```
                    A (Safety)    B (Production)    C (Support)
Trip (trip)         Critical      High              Medium
Threshold (alarm)   High          Medium            Low
Advisory (alert)    Medium        Low               Low
```

Notes on eventType mapping:
- `anomaly` and `inspection` are not in `IMPACT_MAP`. The function falls back to `?? 0` (advisory level). So both map as advisory.
- Matrix comment in the file uses "Advisory/Info" as the row label for `alert` (impact=0).
- Escalation overrides are documented with inline comments on the event object in the data file.

---

## Asset Criticality Reference

| Asset ID | Asset Name              | Criticality |
|----------|-------------------------|-------------|
| K-101    | Compressor K-101        | A           |
| P-203    | Pump P-203              | B           |
| C-201    | Cooler C-201            | B           |
| T-401    | Turbine T-401           | B           |
| E-105    | Heat Exchanger E-105    | C           |
| R-301    | Reactor R-301           | A           |
| V-501    | Vessel V-501            | C           |
| P-102    | Pump P-102              | C           |
| K-302    | Compressor K-302        | A           |
| T-102    | Turbine T-102           | B           |

---

## Event Severity Audit Table

| Event ID        | Asset ID | Criticality | Event Type  | Expected Severity | Actual Severity | Match?                  |
|-----------------|----------|-------------|-------------|-------------------|-----------------|-------------------------|
| EVT-P203-H1     | P-203    | B           | alert       | Low               | High            | Escalated with comment  |
| EVT-R301-H1     | R-301    | A           | alarm       | High              | High            | Yes                     |
| EVT-P102-H1     | P-102    | C           | alert       | Low               | Low             | Yes                     |
| EVT-T102-H2     | T-102    | B           | alert       | Low               | Low             | Yes                     |
| EVT-R301-H2     | R-301    | A           | alert       | Medium            | Medium          | Yes                     |
| EVT-P203-H2     | P-203    | B           | alert       | Low               | High            | Escalated with comment  |
| EVT-K101-H4     | K-101    | A           | inspection  | Medium*           | Medium          | Yes*                    |
| EVT-K101-H8     | K-101    | A           | alert       | Medium            | Medium          | Yes                     |
| EVT-K101-H7     | K-101    | A           | alert       | Medium            | Medium          | Yes                     |
| EVT-T401-H2     | T-401    | B           | alert       | Low               | Low             | Yes                     |
| EVT-K101-H5     | K-101    | A           | inspection  | Medium*           | Medium          | Yes*                    |
| EVT-C201-H1     | C-201    | B           | alert       | Low               | Low             | Yes                     |
| EVT-P203-H3     | P-203    | B           | anomaly     | Low*              | Low             | Yes*                    |
| EVT-E105-H2     | E-105    | C           | alert       | Low               | High            | Escalated with comment  |
| EVT-K101-H6     | K-101    | A           | alert       | Medium            | Medium          | Yes                     |
| EVT-P203-H4     | P-203    | B           | alert       | Low               | Low             | Yes                     |
| EVT-K302-H3     | K-302    | A           | alert       | Medium            | Medium          | Yes                     |
| EVT-E105-H1     | E-105    | C           | anomaly     | Low*              | Low             | Yes*                    |
| EVT-T102-H1     | T-102    | B           | anomaly     | Low*              | Low             | Yes*                    |
| EVT-C201-H2     | C-201    | B           | anomaly     | Low*              | Low             | Yes*                    |
| EVT-P203-H5     | P-203    | B           | anomaly     | Low*              | Low             | Yes*                    |
| EVT-K302-H1     | K-302    | A           | anomaly     | Medium*           | Medium          | Yes*                    |
| EVT-K101-H1     | K-101    | A           | alert       | Medium            | High            | Escalated with comment  |
| EVT-K101-H2     | K-101    | A           | alert       | Medium            | High            | Escalated with comment  |
| EVT-K101-H3     | K-101    | A           | alert       | Medium            | High            | Escalated with comment  |
| EVT-K302-H4     | K-302    | A           | anomaly     | Medium*           | Medium          | Yes*                    |
| EVT-T401-H1     | T-401    | B           | alert       | Low               | Low             | Yes                     |
| EVT-001         | K-302    | A           | anomaly     | Medium*           | Medium          | Yes*                    |
| EVT-002         | K-101    | A           | alert       | Medium            | High            | Escalated with comment  |
| EVT-003         | K-101    | A           | alarm       | High              | Critical        | Escalated with comment  |
| EVT-004         | K-101    | A           | alarm       | High              | Critical        | Escalated with comment  |
| EVT-005         | K-101    | A           | trip        | Critical          | Critical        | Yes                     |
| EVT-006         | V-501    | C           | anomaly     | Low*              | Medium          | Escalated with comment  |
| EVT-007         | C-201    | B           | anomaly     | Low*              | Low             | Yes*                    |
| EVT-009         | P-203    | B           | alert       | Low               | High            | Escalated with comment  |
| EVT-011         | K-101    | A           | inspection  | Medium*           | Critical        | Escalated with comment  |

*`anomaly` and `inspection` are not in `IMPACT_MAP`. The `deriveEventSeverity()` function falls back to `0` (advisory row), same as `alert`. Expected severity for these uses that fallback logic.

---

## Escalation Detail

Events where actual severity exceeds matrix-derived value, with the documented rationale:

| Event ID    | Matrix Yield | Actual   | Rationale (from inline comment)                                                                                    |
|-------------|--------------|----------|--------------------------------------------------------------------------------------------------------------------|
| EVT-P203-H1 | Low          | High     | First occurrence of a failure mode that becomes a recurring pattern                                                |
| EVT-P203-H2 | Low          | High     | Second identical failure in 2 months -- recurring failure pattern confirmed                                        |
| EVT-E105-H2 | Low          | High     | Potential tube leak on HX is a safety concern requiring immediate response                                         |
| EVT-K101-H1 | Medium       | High     | First of three consecutive alerts in cascading bearing failure, no intervention taken                              |
| EVT-K101-H2 | Medium       | High     | Second consecutive alert, bearing in rapid degradation phase                                                       |
| EVT-K101-H3 | Medium       | High     | Third consecutive alert, trip imminent within hours                                                                |
| EVT-002     | Medium       | High     | Oil pressure at critical level with aux pump auto-start, immediate precursor to trip                               |
| EVT-003     | High         | Critical | Cascading failure with imminent trip, oil pressure below critical threshold                                        |
| EVT-004     | High         | Critical | Vibration exceeded trip threshold in cascading failure sequence                                                    |
| EVT-006     | Low          | Medium   | Pressure transient on high-pressure hydrogen vessel requires safety protocol response                              |
| EVT-009     | Low          | High     | Active seal failure above alarm threshold, third recurrence in 6 months                                           |
| EVT-011     | Medium       | Critical | Post-trip bearing damage confirmed, compressor restart blocked, RUL revised to 5 days                             |

All 12 escalations have a documenting comment directly above the event object in `baytown.js`. No unexplained mismatches found.

---

## Additional Checks

### `type` vs `severity` field usage
- No event in TIMELINE uses `type` where `severity` should appear.
- All 36 events have a `severity` field with a valid value (critical/high/medium/low).
- PASS.

### `deriveEventSeverity()` function
- Exists at line 2175 in `baytown.js`. Exported correctly.
- `IMPACT_MAP: { trip: 2, alarm: 1, alert: 0 }` -- maps to correct matrix rows.
- `CRITICALITY_MAP: { A: 2, B: 1, C: 0 }` -- maps to correct matrix columns.
- `SEVERITY_MATRIX` encodes the 3x3 grid correctly:
  - Row 0 (advisory): `['low', 'low', 'medium']` = C:low, B:low, A:medium. Correct.
  - Row 1 (threshold): `['low', 'medium', 'high']` = C:low, B:medium, A:high. Correct.
  - Row 2 (trip): `['medium', 'high', 'critical']` = C:medium, B:high, A:critical. Correct.
- `anomaly` and `inspection` are not in `IMPACT_MAP`. Both fall back to `0` (advisory). This is a deliberate design choice -- these event types exist in data but are not first-class matrix rows. The fallback behavior is valid; however the matrix comment at line 2162 only documents trip/alarm/alert and does not mention the fallback. See recommendation below.
- PASS (with note).

### NOTIFICATIONS derivation uses `.severity`
- Line 2336: `severity: evt.severity` -- correct. Does not reference `.type`.
- PASS.

### No remaining `Badge` (non-`SeverityBadge`) imports or usages
- All badge references in src/ use `SeverityBadge`. No bare `Badge` component found.
- PASS.

---

## Findings Summary

| Check | Result |
|-------|--------|
| All 36 events have `severity` field | Pass |
| No `type` used in place of `severity` | Pass |
| `deriveEventSeverity()` exists and matrix is correct | Pass |
| All mismatches have documented escalation comments | Pass |
| NOTIFICATIONS uses `.severity` not `.type` | Pass |
| No bare `Badge` references remain | Pass |
| Unexplained severity mismatches | None |

**One recommendation:** Add `anomaly` and `inspection` to the matrix comment at line 2162 (or to `IMPACT_MAP` with explicit values) to document the fallback behavior. Currently `anomaly` and `inspection` silently resolve to advisory level (0). 8 events use `anomaly`, 3 use `inspection`. If a future `anomaly` on a Criticality A asset should yield higher than Medium, the function must be updated to handle it explicitly.
