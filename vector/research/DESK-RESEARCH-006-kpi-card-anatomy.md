# DESK-RESEARCH-006 -- KPI Card Anatomy and Accessible Status Indicators

**Date:** 2026-03-26
**Status:** Complete
**Scope:** What belongs on a KPI card, how to show health accessibly, and whether sparklines are needed when a click opens a trend modal.

---

## KPI Card Required Elements

From Grafana, Datadog, Carbon, ISA-101, and dashboard design literature:

| Element | Required? | Notes |
|---------|-----------|-------|
| Label (metric name) | Required | 12-13px, dimmed/secondary color |
| Primary value | Required | 28-32px, largest element on the card |
| Delta (vs previous period) | Required | "+2.3% vs yesterday" below the value. Most important context after the value. |
| Health indicator | Required | Icon + text, not color alone (WCAG SC 1.4.1) |
| Sparkline | NOT required | Redundant when clicking the card opens a trend modal. Sparkline previews what's one click away. |
| Time context | Carried by delta | "vs yesterday" provides the time reference. No separate label needed. |
| Info tooltip | Optional | Already implemented. Explains what the metric means. |

## Sparkline Decision

Sparklines are NOT needed when:
- Clicking the KPI card opens a modal showing the full trend chart
- The card already shows a delta that communicates direction (up/down)
- Six cards in a row leaves limited space; sparklines compete with the value

Sparklines ARE useful when:
- The KPI is not clickable (no drill-down available)
- The trend shape matters more than the direction (oscillation, plateau, spike)
- There are only 3-4 cards with more horizontal space

**Decision: No sparkline.** The delta communicates direction. The click opens the full trend. The card stays clean.

## Delta Time Period

From INTERVIEW-002: the engineer's first question is "what changed overnight." They work in shifts.

Options considered:
- "vs last shift" -- most precise but requires shift schedule logic
- "vs last 24h" -- technically accurate but clinical
- "vs yesterday" -- universally understood, matches the engineer's mental model

**Decision: "vs yesterday."** Simplest. An engineer at 7 AM compares to yesterday's 7 AM reading.

## Accessible Health Indicators

### WCAG SC 1.4.1 Requirement
Color must NOT be the sole means of conveying status. Need at least one additional channel: icon shape, text label, or pattern.

### ISA-101 "Dark and Quiet" Principle
Normal operation = subdued display. Color and indicators appear ONLY when something needs attention. A healthy KPI should be visually quiet, not screaming green.

### Recommended Pattern (ISA-101 + Carbon + cognitive distinction)

**Normal/Healthy:** No indicator shown. The absence of an alarm IS the signal. White value, no icon. This follows ISA-101 "dark and quiet."

**Warning:** Amber trending-down arrow icon + "Below target" text. The arrow says "this is moving in the wrong direction" which creates a monitoring response ("I should watch this"). Different cognitive response than an exclamation.

**Critical:** Red exclamation triangle icon + "Critical" text. The exclamation says "act now, this is urgent." Universally understood urgency symbol.

The two icons must trigger DIFFERENT cognitive responses:
- Arrow (warning) = "this is trending, monitor it" -- PER-001's "catch it before it trips"
- Exclamation (critical) = "this has crossed a threshold, act now"

If both were exclamation marks in different colors, the engineer normalizes both (PER-001: "alerts fire but nobody acts"). Different shapes create different responses.

### Icon Shapes (must be distinct at 16px)
- Healthy: no icon (dark and quiet)
- Warning: down-trending arrow (amber)
- Critical: filled triangle with exclamation (red)

### Value Coloring
- Normal: white (text-primary)
- Warning: amber (--color-warning)
- Critical: red (--color-error)
- The icon + text label ensures the color is not the sole channel

### Placement
Below the value on a secondary line:
```
OEE
81.5%
▼ -5.9% vs yesterday
▲ Warning · Below 85% threshold
```

Or inline when space is tight:
```
OEE
81.5% ↘ Below target
▼ -5.9% vs yesterday
```

Critical example:
```
OEE
64.2%
▼ 23.2% vs yesterday
⚠ Critical · Below 75%
```

### aria-label
Each status indicator needs: `aria-label="OEE: warning, below 85% threshold"`

---

## Thresholds for the Baytown Refinery Story

Based on DESK-RESEARCH-002 (engineering data) and the story:

| Metric | Normal | Warning | Critical |
|--------|--------|---------|----------|
| OEE | > 85% | 75-85% | < 75% |
| Availability | > 90% | 80-90% | < 80% |
| Performance | > 92% | 85-92% | < 85% |
| Quality | > 98% | 95-98% | < 95% |

Current values in the story:
- OEE: 81.5% → **Warning** (below 85%)
- Availability: 82.1% → **Warning** (below 90%)
- Performance: 93.8% → Normal
- Quality: 99.1% → Normal

This is correct for the K-101 trip story. OEE and Availability dropped because of the compressor trip. Performance and Quality are unaffected.

---

## Sources
- Grafana stat panel documentation
- Datadog query value widget documentation
- Carbon Design System StatusIcon + Tag components
- ISA-101 High Performance HMI standard
- WCAG 2.1 SC 1.4.1 (Use of Color)
- Stephen Few, "Information Dashboard Design"
- Nielsen Norman Group dashboard research
