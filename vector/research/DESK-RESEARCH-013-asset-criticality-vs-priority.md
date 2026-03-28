# DESK-RESEARCH-013: Asset Criticality vs Asset Priority

**Date:** 2026-03-28
**Status:** Complete
**Scope:** How industrial APM differentiates asset criticality (static engineering classification) from asset/event priority (dynamic operational ranking). Supports badge system redesign and Risk Matrix axis labeling.

---

## Key Finding

**Asset criticality and asset priority are not the same thing.**

- **Criticality** = static engineering classification based on consequence of failure. Set during FMEA/RCM. Rarely changes. Drives maintenance strategy. Scales: A/B/C/D (NORSOK Z-008), numeric 1-5 (Maximo), or High/Medium/Low.
- **Priority** = dynamic operational ranking derived from criticality + current condition + active events. Changes constantly. Drives triage ("what do I deal with first?"). Formula: Priority = Criticality x Condition x Urgency.

The Risk Matrix should use criticality (the static input) on the asset axis, not priority (the derived output). Putting priority on the axis is circular -- the matrix is supposed to *produce* priority.

## Industry Precedent

| Platform | Asset Axis | Event Axis |
|----------|-----------|------------|
| Honeywell Forge | Asset Criticality | Fault Severity |
| GE Vernova APM | Asset Criticality (ACA) | Health Index |
| SAP PM | ABC Indicator | Work Order Priority |
| Maximo | Asset Priority (input) | Criticality Score (output) |

Honeywell Forge specifically uses "asset criticality" x "fault severity" on its risk matrix.

## Badge Implications

Asset criticality (A/B/C) and event severity (Critical/High/Medium/Low) should use **different visual components** to avoid confusion:
- Asset criticality: letter grade (A/B/C/D) -- stable, engineering classification
- Event severity: colored badge with tallies -- urgent, changing state

ISA-101 and EEMUA 201 both recommend that the same visual encoding should not be used for different semantic meanings within the same interface.

## Sources

Reliabilityweb, ISO 14224, NORSOK Z-008, API 580/581, Honeywell Forge APM brochure, GE Vernova APM documentation, IBM Maximo Health docs, SAP PM criticality ranking.
