# DESK-RESEARCH-015: Work Order Urgency Iconography

## Question
What icon shapes should represent work order urgency levels (Emergency/Urgent/Scheduled) without colliding with event severity badges or investigation status indicators?

## Research Sources
- NATO Joint Military Symbology (MIL-STD-2525)
- US DoD Message Precedence (FLASH/IMMEDIATE/PRIORITY/ROUTINE)
- IBM Carbon Design System status indicator patterns
- PatternFly status and severity guidelines
- ISA-101 HMI alarm/priority guidance
- EEMUA Publication 191 alarm management
- IBM Maximo, SAP PM, ServiceNow CMMS priority implementations
- WCAG 2 contrast and icon requirements (SC 1.4.1, SC 1.4.11)

## Key Findings

### Chevrons rejected
Initial proposal was double/single chevrons for Emergency/Urgent. Research found:
- Military: chevrons indicate movement direction or unit rank, not urgency
- Enterprise UI: chevrons mean expand/collapse/navigate (Carbon, PatternFly)
- No CMMS system uses chevrons for WO priority
- At 12px, >> vs > is hard to distinguish without color

### Military urgency is text-based
DoD message precedence (FLASH/IMMEDIATE/PRIORITY/ROUTINE) uses text designators, not icons. There is no standard military icon vocabulary for urgency levels.

### CMMS standard: text labels + color stripes
Maximo, SAP PM, and ServiceNow all use text labels with optional left-edge color stripes. Priority is treated as a data attribute, not a shape-encoded signal.

### ISA-101 guidance
- Distinct geometric shapes for distinct categories
- Never rely on color alone
- Fill hierarchy (solid > outline > absent) communicates importance
- "Dark and quiet" -- normal states should have low visual weight

### Fill hierarchy validated
Carbon, Material, and Ant Design all use filled vs outlined shapes to communicate importance levels. This is the strongest pattern for urgency without color: solid shape = most urgent, outline = moderate, modified shape (clock) = lowest.

## Recommendation: Circle family with fill hierarchy

| Urgency | Icon | Shape | Rationale |
|---------|------|-------|-----------|
| Emergency | ● | Filled circle (12px) | Highest visual weight = highest urgency |
| Urgent | ○ | Hollow circle (12px, 1.5px stroke) | Medium weight = needs attention |
| Scheduled | ◷ | Circle with clock hands (12px, 1.5px stroke) | Clock = has a time window, queued |

All rendered in neutral `--color-text-secondary`. No color coding. Text labels always present.

### Why circles work (now that investigations use triangles)
- Circles are the simplest geometric shape -- fast to scan
- Fill hierarchy (solid > hollow > modified) creates clear visual weight progression
- Clock icon is universally understood as "scheduled/timed"
- No collision with triangles (investigations), tally bars (events), letter pills (criticality), or dots (asset status)

## Icon collision map (final)

| System | Shape family | Fill pattern | Color | Context |
|--------|-------------|-------------|-------|---------|
| Event severity | Tally bars in pill | Solid/outline fill | Red/amber/blue | Everywhere |
| Investigation status | Right-pointing triangles | Filled/hollow | Neutral gray | Investigations card |
| WO urgency | Circles | Filled/hollow/clock | Neutral gray | Work Orders card |
| Asset criticality | Letter grade pills | Solid fill | Status colors | Asset Table, Inspection |
| Asset status | Small dots | Solid | Status colors | Asset Table |

Five shape families. Zero collisions.
