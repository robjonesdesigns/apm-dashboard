# ARCHITECTURE.md -- APM Dashboard

**Last updated:** 2026-03-26

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Charts | Recharts |
| Font | Inter (Google Fonts CDN) |
| Deployment | GitHub Pages or Vercel (TBD) |

---

## Layer Map

| Layer | Location | Rule |
|-------|----------|------|
| Pages/Screens | `src/components/` | Top-level screen components (AssetHealth, AssetDetails, Trends, FaultTree). Own their data and state. |
| Shell | `src/components/` | App shell (Sidebar, TopBar, NotificationsPanel). Shared across screens. |
| UI Primitives | `src/components/ui/` | Stateless building blocks (Tooltip, Badge, StatusDot). No business logic. No navigation. |
| Data | `src/data/` | Static sample data. No components. No logic beyond data shaping. |
| Styles | `src/styles/` | Tokens (global.css, tokens.js). No component code. |

**Import direction:** Screens import from UI, Data, and Styles. UI imports from Styles only. Data imports nothing. Styles import nothing.

---

## Layout System

### 12-Column Grid

All layouts use a 12-column grid. Clean math: 6x2=12 (KPIs), 3x4=12 (thirds), 2x6=12 (halves).

| Viewport | Min Width | Columns | Gutters | Margins |
|----------|-----------|---------|---------|---------|
| sm | 320px | 4 | 24px | 16px |
| md | 672px | 8 | 24px | 32px |
| lg | 1056px | 12 | 24px | 32px |

Gutters are 24px both horizontally and vertically at all breakpoints.

**Implementation:** CSS class `grid-12` in global.css. Cards use `col-*` span classes.

**Column spans (desktop, 12 columns):**
- KPI cards: 6 cards in `kpi-grid` (dedicated responsive grid, not col spans)
- Analysis cards (Risk Matrix, Event Summary, Bad Actors): `grid-thirds` (equal 1fr)
- Half-width cards (Work Orders, Cases): span 6
- Full width (Asset Summary table, Timeline): span 12
- On tablet (8 columns): half span 4, third span 4
- On mobile (4 columns): all cards full width

**Notifications panel behavior:** Push, not overlay. 320px wide. 12-column grid recalculates within the narrower viewport. Mutually exclusive with expanded sidebar (ADR-009).

### Navigation

| Element | Size | Notes |
|---------|------|-------|
| Header (TopBar) | 48px tall | Fixed, full width, z-index 10000 |
| Sidebar rail | 48px wide | Icons only, default state |
| Sidebar expanded | 256px wide | Icons + labels |
| Nav item height | 48px | Matches header height |
| Notifications panel | 320px wide | Push, slides from right |

### Page Container

```css
.page-padding {
  padding-left: 16px;   /* all breakpoints */
  padding-right: 16px;
}
```

Content area uses margin-left to offset from sidebar (48px rail or 256px expanded).

### Section Spacing

- Between major sections: 32px (`--spacing-32`)
- Between section header and content: 16px (`--spacing-16`)
- Between cards (gutters): 24px (same horizontal and vertical, all breakpoints)
- Inside cards (padding): 24px (`--spacing-24`) on all breakpoints
- Between elements inside a card: 16px (`--spacing-16`)
- Between small metadata items: 8px (`--spacing-8`)

### Alignment Rules

- All card content aligns to a consistent inner padding (24px on all sides)
- Labels, values, and charts inside cards align to the same left edge
- No element should break the card's inner padding boundary
- Charts extend to the card's inner edges (full bleed within the padding)

---

## Typography

All typography uses composition classes from global.css. No inline font styles.

| Class | Size | Weight | Color | Use |
|-------|------|--------|-------|-----|
| `type-heading-01` | 14px | 600 | primary | Inline headings, notification asset names |
| `type-heading-02` | 16px | 600 | card-title (#c6c6c6) | Card titles (dimmed, not competing with data) |
| `type-heading-03` | 20px | 400 | primary | Page section titles |
| `type-heading-04` | 28px | 400 | primary | Large headings |
| `type-body-01` | 14px | 400 | primary | Body text |
| `type-body-compact` | 14px | 400 | primary | Table/data text (tighter line height) |
| `type-body-02` | 16px | 400 | primary | Larger body text |
| `type-label` | 12px | 400 | helper (#a8a8a8) | Labels, axis text, delta text |
| `type-label-semibold` | 12px | 600 | helper | Bold labels |
| `type-helper` | 12px | 400 | helper | Timestamps, metadata |
| `type-kpi` | 28px | 400 | primary (or health color) | KPI values |
| `type-kpi-lg` | 32px | 400 | primary | Hero KPI |
| `type-callout` | 48px | 300 | primary | Large callout numbers |
| `type-link` | 14px | 400 | link (#78a9ff) | Contextual links |
| `section-header` | 12px | 600 | helper, uppercase | Section labels above card groups |

**Rules:**
- All numeric displays use `font-variant-numeric: tabular-nums`
- All fluid sizes use `clamp()` with even number bounds
- No inline `fontSize`, `fontWeight`, or `color` for text. Use the classes.

---

## Styling

### Token System

All visual values come from CSS custom properties defined in `src/styles/global.css` under `@theme`.

**Rules:**
- No hardcoded hex colors in components. Use `var(--color-*)` or Tailwind classes.
- No hardcoded pixel values for spacing. Use `var(--spacing-*)` or Tailwind spacing utilities.
- No hardcoded border-radius. Use `var(--radius-*)`.
- No inline `fontFamily`. The base is set in `html` and inherited.

### Cards

- Background: `--color-layer-01` (#262626) on `--color-bg` (#161616)
- Border: 1px solid `--color-border-subtle` (#393939)
- Border radius: 10px
- Padding: 24px (`--spacing-24`)
- Card titles: `type-heading-02` in `--color-card-title` (#c6c6c6)
- Hover (interactive): all borders transition to `--color-accent`, bg to `--color-hover-01`

### Utility Classes (global.css)

| Class | Purpose |
|-------|---------|
| `card` | Card surface: bg (#262626), border, 10px radius, 24px padding |
| `card-accent-top` | 3px teal top border (KPI cards, interactive affordance) |
| `card-interactive` | Cursor pointer, accent border + bg shift on hover |
| `section-header` | 12px uppercase label above a section (helper color) |
| `status-dot` + `dot-*` | 8px colored dot (dot-error, dot-warning, dot-success, dot-info) |
| `badge` + `badge-*` | Small status badge with bg tint |
| `chip` / `chip-active` | Interactive filter pill |
| `page-padding` | Responsive page gutters (16px mobile, 32px tablet+) |
| `section-gap` | 48px flex column gap between sections |
| `kpi-grid` | 6-column KPI card layout (responsive: 2/3/6 columns) |
| `grid-12` | 12-column responsive grid |
| `grid-thirds` | Equal 3-column grid for analysis cards |

### Tooltips

**Inverted (light on dark)** for visibility against the dark dashboard:
- Background: `--color-tooltip-bg` (#f4f4f4)
- Text: `--color-tooltip-text` (#161616)
- Border radius: 4px
- Padding: 12px 16px
- Shadow: `0 4px 12px rgba(0,0,0,0.4)`
- Caret: 8px rotated square, tracks icon position independently of bubble
- Bubble clamps to viewport edges, caret stays anchored to trigger
- Animation: fadeIn with `--motion-fast` `--ease-productive`

### Status Colors (ADR-010)

| State | Color | Icon | Label |
|-------|-------|------|-------|
| Normal | white (text-primary) | None (dark and quiet) | None |
| Warning | `--color-warning` (#e8914f amber) | ▼ inverted triangle | "Monitor" |
| Critical | `--color-error` (#f47174 coral-red) | ◆ diamond | "Action Required" |

### Recharts Styling

All Recharts components use tokens from `src/styles/tokens.js`:
- Grid lines: `chartStyle.grid` (#393939)
- Axis text: `chartStyle.axisText` (#c6c6c6, 12px)
- Tooltips: inverted white bg (#f4f4f4), dark text (#161616)
- Animation: `isAnimationActive={true}`, `animationDuration={300}`
- Bar radius: `[4, 4, 0, 0]` (rounded top only)
- Line width: 2px

---

## Interactions

All interactive state changes use `transition: all 0.15s ease`.

See `vector/research/INTERACTION-SPEC-001-all-screens.md` for the full specification.

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Screen components | PascalCase | `AssetHealth.jsx` |
| UI primitives | PascalCase | `Tooltip.jsx` |
| Data files | camelCase | `assets.js` |
| Style files | kebab-case | `global.css` |
| CSS classes | kebab-case | `section-header` |
| JS constants | SCREAMING_SNAKE | `WORK_ORDERS` |

---

## What Not to Do

- Do not use inline `fontSize`, `fontWeight`, or text `color`. Use type classes.
- Do not hardcode hex colors in components. All colors from tokens.
- Do not use odd numbers for spacing, padding, font sizes, or radius.
- Do not use shadows on dark backgrounds (they are invisible). Use border or bg elevation.
- Do not use Recharts default styles. Override everything to match the dark theme.
- Do not add a light theme. This is dark only.
- Do not reference Honeywell, Forge, or any branded assets.
- Do not nest interactive elements (button inside a link, clickable div inside a clickable row).
- Do not exceed 400 lines per component file. Extract sub-components if needed.

---

## File Size Limit

400 lines per component file. If a screen component exceeds this, extract card sub-components into `src/components/ui/` or inline sub-components within the file.
