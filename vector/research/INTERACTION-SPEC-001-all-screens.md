# INTERACTION-SPEC-001 -- Interaction Design Across All Screens

**Date:** 2026-03-26
**Status:** Draft
**Scope:** Every hover, click, tooltip, and transition across all dashboard screens.

---

## Global Interaction Patterns

### Transitions
All interactive state changes use `transition: all 0.15s ease`. No exceptions.

### Cursor
- Clickable elements: `cursor: pointer`
- Disabled elements: `cursor: not-allowed`
- Data (non-interactive): `cursor: default`

### Focus
All interactive elements must have visible focus states for keyboard navigation.
Focus ring: 2px solid accent with 2px offset.

---

## Hover States

### KPI Cards
- Background: surface > surface-hover
- Left border: brightens (opacity 1 > full saturation)
- Cursor: pointer
- Sparkline: no change (stays subtle)

### Chart Bars (Bar Charts)
- Hovered bar: full opacity
- All other bars: dim to 40% opacity
- Tooltip appears above/beside the bar
- Transition: opacity 0.15s ease

### Doughnut Segments
- Hovered segment: lifts 2px outward from center (translate along the angle)
- Tooltip appears showing value + percentage + label
- Other segments: slight dim (80% opacity)

### Table Rows
- Background: transparent > surface-hover
- Left border: 2px solid transparent > 2px solid accent
- Asset name: text color shifts to accent (underline optional)
- Cursor: pointer

### Fault Tree Nodes
- Border: border > accent
- Connected path lines: border > accent (glow)
- Child nodes: subtle highlight to show the branch
- Cursor: pointer on leaf nodes only

### Timeline Events
- Event marker: scales up 1.2x
- Tooltip appears with event details (type, asset, timestamp, description)
- Background highlight on the time column

### Notification Cards
- Background: surface > surface-hover
- Left border: 2px solid transparent > 2px solid (matching severity color)

### Sidebar Nav Items
- Background: transparent > surface-hover
- Active: accent-muted background + accent text
- Icon: muted > primary (on hover), accent (on active)

---

## Click Actions

### Asset Health
| Element | Action |
|---------|--------|
| KPI card | Expand inline trend or open trend modal for that metric |
| Risk Matrix cell | Filter Asset Summary table to matching priority/status |
| Bad Actor bar | Navigate to Asset Details for that asset |
| Event Summary toggle | Switch between Event Summary and Case Summary views |
| Asset Summary row | Navigate to Asset Details for that asset |
| Timeline event | Navigate to Asset Details at that timestamp |
| Work order row | Navigate to Asset Details for that asset |
| Case row | Navigate to Asset Details with case context |
| "View all" link | Navigate to Work Order or Case dashboard |

### Asset Details
| Element | Action |
|---------|--------|
| Tab bar item | Switch visible section (Asset Status, Fault Tree, Trends, etc.) |
| Sub-asset in doughnut | Filter related data to that sub-asset |
| Performance attribute row | Navigate to Trends with attribute pre-selected |
| Work order in maintenance | Expand details or navigate to Work Order dashboard |
| Run Status event marker | Show tooltip with event details |
| "Create Case" button | Open contextual case creation modal pre-filled with asset data |

### Fault Tree
| Element | Action |
|---------|--------|
| Intermediate node | Expand/collapse child branches |
| Leaf node | Navigate to Trends with attribute + time range pre-selected |
| Top event node | Collapse entire tree to just top level |

### Trends
| Element | Action |
|---------|--------|
| Attribute toggle | Add/remove attribute from the chart |
| Time range pill | Filter data to selected range |
| Overlay/Separate toggle | Switch chart display mode |
| Brush/zoom | Drag to select time range on the chart |
| Chart point | Show tooltip with value, expected, deviation, timestamp |

---

## Tooltips (Consistent Dark Style)

All tooltips across the dashboard use the same visual treatment:

```
Background:  var(--color-surface-raised)
Border:      1px solid var(--color-border-strong)
Radius:      var(--radius-8)
Padding:     8px 12px
Shadow:      0 4px 12px rgba(0, 0, 0, 0.4)
Max width:   240px
```

### Tooltip Content Structure
- Title: type-h4 (14px, 600 weight, primary)
- Value: type-kpi or bold primary (contextual size)
- Context: type-body-sm (12px, secondary) -- "vs expected: 95%"
- Timestamp: type-body-sm (12px, muted)

### Tooltip Positioning
- Charts: above the data point, centered
- Table rows: not needed (hover state is sufficient)
- Fault tree nodes: right side of the node
- Timeline events: above the event marker

---

## Mobile Considerations

### Navigation
- Sidebar collapses to a bottom tab bar (4 icons: Health, Details, Tree, Trends)
- Top bar: breadcrumb simplified to just current view name
- Notification bell remains in top bar

### Layout
- Cards stack single column
- KPI bar: 2x2 grid
- Charts: full width, maintain aspect ratio
- Tables: switch to card-based layout (each row becomes a mini card)
- Fault tree: horizontal scroll or collapse to indented list

### Interactions
- No hover states (touch only)
- Tooltips triggered by tap (tap again to dismiss)
- Swipe between tabs on Asset Details
- Pull-to-refresh for KPI data

### Case Order Creation (Mobile)
- Full-screen modal
- Pre-filled with asset data, events, timestamps
- Priority selector prominent at top
- Assignment: optional, with algorithm suggestion
- Submit button fixed at bottom of screen
