# DESK-RESEARCH-009: Timeline Label Alignment Patterns

**Date:** 2026-03-27
**Scope:** How enterprise dashboards, monitoring tools, charting libraries, and design systems handle text label alignment below horizontal timeline markers.
**Context:** ImpactStrip component (Key Events) on Plant Overview. Currently uses position-aware alignment (first=left, middle=center, last=right).

---

## 1. Enterprise Monitoring Tools

### Grafana

**State Timeline panel** offers explicit label alignment: Left, Center, or Right for text rendered *inside* colored state regions. A "Show values: Auto" mode hides labels when space is insufficient. Labels are not placed below markers -- they are embedded in region bands.

**Annotations** on time-series panels render as vertical lines with small arrow icons at the bottom of the chart. Label text appears only on hover in a tooltip. There is no persistent below-marker label system. The x-axis uses auto-spaced tick labels with no exposed first/last alignment override.

Source: [Grafana State Timeline docs](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/state-timeline/)

### Datadog

**Graph markers** (horizontal threshold lines) support a label that "displays on the bottom left of the timeseries widget." This is fixed left-alignment, not position-aware.

**Event overlays** render as red vertical bars on graphs. Event text appears on hover only, not as persistent labels.

Source: [Datadog Timeseries Widget docs](https://docs.datadoghq.com/dashboards/widgets/timeseries/)

### Splunk

Splunk's timeline visualizations use a similar hover-to-reveal pattern. Persistent labels on horizontal timelines are uncommon in monitoring tools -- they favor tooltip-on-hover to keep the baseline clean.

**Pattern:** Enterprise APM tools overwhelmingly use hover tooltips rather than persistent below-marker labels. When persistent labels exist, they default to left-alignment.

---

## 2. Charting Libraries (D3, Recharts, ECharts)

### Recharts (what this project uses)

Open issue [#2543](https://github.com/recharts/recharts/issues/2543) requests a `tickAlign` property with values `"start"`, `"middle"`, `"end"`. A community member proposed the pattern directly relevant to this project:

> "The first can be 'start' aligned, the last 'end' aligned, and everything else 'middle' aligned."

This is exactly the position-aware pattern already implemented in ImpactStrip. The issue has 12 upvotes and remains open, indicating demand but no built-in solution yet.

### ECharts

ECharts 5.3 added `alignTicks: true` for synchronizing tick positions across multiple y-axes. It also provides `axisLabel.showMinLabel` and `axisLabel.showMaxLabel` to control visibility of edge labels. No built-in position-aware text-anchor switching.

### D3

D3's axis module renders tick labels as SVG `<text>` elements with a default `text-anchor: middle`. Edge overflow is the developer's problem -- D3 provides no automatic edge-clamping. The standard workaround is manual text-anchor adjustment on first/last ticks:
- First tick: `text-anchor: start`
- Last tick: `text-anchor: end`
- All others: `text-anchor: middle`

This is the canonical D3 pattern and matches the ImpactStrip implementation.

---

## 3. Design System Guidelines

### Material Design (Stepper Component)

Material Design's horizontal stepper places labels **center-aligned below step icons** by default. The `alternativeLabel` prop (MUI) / `labelPosition="bottom"` (Angular Material) enables this layout.

Labels are always center-aligned. There is no position-aware edge handling. Material avoids the overflow problem by recommending: "Avoid using long step names in horizontal steppers."

Source: [Material Design Steppers](https://m1.material.io/components/steppers.html), [MUI Stepper](https://mui.com/material-ui/react-stepper/)

### Carbon Design System

Carbon has **no timeline component**. A 2020 GitHub issue ([#7258](https://github.com/carbon-design-system/carbon/issues/7258)) requesting one remains in the icebox. The closest component is the Progress Indicator (vertical stepper), which uses left-aligned labels beside markers.

Carbon's general typography guidance: left-align body text, right-align numeric data in tables.

### Atlassian Design System

Atlassian has no dedicated timeline component with label alignment specifications.

**Conclusion:** No major design system provides an opinionated guideline for horizontal timeline label alignment below markers. The problem is either avoided (short labels, center-all) or left to implementers.

---

## 4. UX Research on Text Alignment

### Left-aligned text is the default for readability

Research by Ling and van Schaik found left-aligned text improves task performance over justified or centered text. The human eye returns to a fixed left margin between lines, creating a consistent scan anchor.

Source: [Cieden Typography/Text Alignment](https://cieden.com/book/sub-atomic/typography/text-alignment)

### Center-aligned text works only for short runs

Center alignment "breaks the usual reading flow, which helps highlight important information" but should be limited to approximately three lines or fewer. Beyond that, the ragged edges on both sides make scanning difficult.

### Right-aligned text: numbers only

Right-alignment is appropriate for numeric columns (decimal alignment) and right-to-left languages. For labels and descriptive text, it forces an unnatural reading pattern. However, in constrained layout contexts (like the last item on a horizontal bar), right-alignment prevents overflow -- a functional justification that outweighs the readability cost for very short text blocks.

### Dashboard-specific guidance

Steve Wexler (Data Revelations) recommends: "Left-align text on dashboards. Upper-left-most justification of graph titles and axis labels ensures users see how to read the data before they get to the data." Right-align numbers for comparison; left-align everything else.

Source: [Data Revelations](https://www.datarevelations.com/dont-center-right-align-or-justify-text-on-a-dashboard/)

### Baymard Institute

Baymard's research focuses on line length (50-60 characters optimal) rather than alignment. Their findings reinforce that readability degrades with visual inconsistency, supporting the argument for consistent alignment where possible.

---

## 5. Edge Overflow Handling

### The core problem

On a horizontal timeline, center-aligned labels at the first and last positions overflow the container. The first label's left half extends past the left edge; the last label's right half extends past the right edge.

### Cushion App's approach (most detailed public write-up)

Jonnie Hallman documented three techniques for timeline label overflow:

1. **Crop with gradient feather:** Clip text to container width, apply a linear gradient fade on the clipped edge. Even single-day items (24px) hint at their label.
2. **Hover reveal:** Full label appears on hover. Overlap detection compares bounding rects; only conflicting labels fade.
3. **Sticky labels on scroll:** For items that scroll off-screen, clamp label position between screen edge and item boundary using `Math.max(canvasLeft, Math.min(itemRight, x))`.

Source: [Cushion Journal - Handling Timeline Labels](https://cushionapp.com/journal/handling-timeline-labels)

### Common patterns across implementations

| Strategy | Used by | Trade-off |
|----------|---------|-----------|
| Center-all, clip at edges | Material Stepper | Clean but loses edge content |
| Position-aware (L/C/R) | D3 convention, Recharts proposal | Readable at edges, slight visual asymmetry |
| All left-aligned | Datadog markers | Simple, no overflow, but misaligns from dots |
| Tooltip only (no persistent labels) | Grafana, Splunk, Datadog events | Cleanest, but requires interaction |

---

## 6. ISA-101 and Industrial HMI

ISA-101 (ANSI/ISA-101.01-2015) covers HMI design for process automation. Its relevant guidance:

- Numeric data meant for comparison should be decimal-aligned (effectively right-aligned)
- Text labels should be horizontal (never vertical or diagonal)
- Minimize visual clutter: "dark and quiet" baseline

ISA-101 does not address horizontal timeline label alignment specifically. Industrial HMI alarm timelines (like those in Honeywell Experion or Yokogawa CENTUM) typically use scrolling event lists (vertical), not horizontal dot timelines.

---

## 7. Findings Summary

### Which alignment pattern is most common?

1. **Tooltip-only (no persistent labels):** Most common in enterprise monitoring (Grafana, Datadog, Splunk). Keeps the timeline clean.
2. **Center-all:** Most common in design system components (Material Stepper). Works when labels are short.
3. **Position-aware (L/C/R):** The D3/charting convention for axis ticks. The canonical solution to edge overflow.
4. **All left-aligned:** Rare for timeline labels. Common for standalone annotations.

### Is position-aware alignment the right call for ImpactStrip?

**Yes.** The ImpactStrip's current approach (first=left, middle=center, last=right) is the correct pattern for this context because:

1. **It solves edge overflow** without clipping or requiring interaction.
2. **It matches the D3/charting convention** that engineers and data-literate users expect on axis-like components.
3. **The text blocks are short** (time + asset name + one-line event + KPI delta), so the readability cost of right-alignment on the last item is minimal.
4. **Each label sits directly below its dot** via `flex: 1 1 0` with matching `textAlign`, maintaining the visual connection between marker and description.
5. **Enterprise APM users scan left-to-right**, so the leftmost event anchored at the left edge is the natural starting point.

### One refinement to consider

The current implementation uses `flex: 1 1 0` with `justifyContent: space-between`, which distributes labels evenly. This works well for 3 events. If the event count changes (2 or 4+), verify that the label columns still align with their corresponding dots above. The dot positions use percentage math (`i / (length - 1) * 100`), which should stay in sync with equal-flex columns, but test at different widths.

---

## 8. Decisions for ImpactStrip

| Question | Answer | Rationale |
|----------|--------|-----------|
| Keep position-aware (L/C/R)? | **No (superseded)** | Track now stops at ~82% with dashed continuation, so overflow is solved by layout, not alignment |
| Switch to all-center? | No | Would clip at edges without `overflow: visible` hacks |
| Switch to all-left? | **Yes (adopted)** | Track stops short of card edge, so no disconnect. Left-alignment is more readable per Ling/van Schaik and Wexler |
| Add tooltip-only mode? | Consider for mobile | Minor dots already use this pattern; major events need persistent labels for glanceability |

**Note (2026-03-27):** The original recommendation (L/C/R) was superseded by ADR-014 revision. The layout changed: the track now spans ~82% of the card with a dashed continuation line to the right edge. This eliminates the right-edge overflow problem that L/C/R was solving, making all-left-aligned the better choice for readability.
