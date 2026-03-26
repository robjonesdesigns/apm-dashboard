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

### 16-Column Grid (Carbon standard)

Based on IBM Carbon 2x Grid. All layouts use a 16-column grid at desktop.

| Viewport | Min Width | Columns | Gutters | Margins |
|----------|-----------|---------|---------|---------|
| sm | 320px | 4 | 24px | 16px |
| md | 672px | 8 | 24px | 16px |
| lg | 1056px | 16 | 24px | 16px |

Gutters are 24px both horizontally and vertically at all breakpoints.

**Implementation:** CSS class `grid-16` in global.css. Cards use `col-*` span classes.

**Column spans (desktop, 16 columns):**
- KPI cards: span 3 (4 KPI cards + 1 trains card = ~16 columns)
- Analysis cards (Risk Matrix, Event Summary, Bad Actors): span 5 (three cards + gutter)
- Half-width cards (Work Orders, Cases): span 8
- Full width (Asset Summary table, Timeline): span 16
- On tablet (8 columns): KPI span 2, analysis span 4, half span 4
- On mobile (4 columns): all cards span 4 (full width)

**Notifications panel behavior:** Push, not overlay. 320px wide. 16-column grid recalculates within the narrower viewport. Mutually exclusive with expanded sidebar (ADR-009).

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
| `type-h1` | 22-28px (fluid) | 700 | primary | Page titles |
| `type-h2` | 18-22px (fluid) | 600 | primary | Section headings |
| `type-h3` | 16-18px (fluid) | 600 | primary | Card group titles |
| `type-h4` | 14px | 600 | primary | Card titles |
| `type-body` | 13-14px (fluid) | 400 | primary | Body text |
| `type-body-secondary` | 13-14px (fluid) | 400 | secondary | Supporting text |
| `type-body-sm` | 12px | 400 | secondary | Small body, timestamps |
| `type-label` | 10-12px (fluid) | 600 | muted | Uppercase section labels |
| `type-meta` | 10px | 400 | muted | Tiny metadata |
| `type-kpi` | 24-28px (fluid) | 700 | primary | KPI values |
| `type-kpi-lg` | 30-36px (fluid) | 700 | primary | Hero KPI |
| `type-callout` | 26-32px (fluid) | 700 | primary | Large callout numbers |
| `type-link` | 12px | 500 | accent | Contextual links |

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

### Utility Classes (global.css @layer components)

| Class | Purpose |
|-------|---------|
| `card` | Card surface: bg, border, radius, padding, hover border |
| `card-interactive` | Adds cursor pointer, accent border on hover, bg shift |
| `section-header` | Uppercase label above a section |
| `status-dot` + variant | 8px colored dot with glow shadow |
| `badge` + variant | Small status badge with bg tint |
| `chip` / `chip-active` | Interactive filter pill |
| `badge-group` | Flex wrap with 6px gap for badge rows |
| `page-padding` | Responsive page gutters |
| `section-gap` | 24px flex column gap between sections |
| `grid-kpi` / `grid-2col` / `grid-3col` | Responsive grid patterns |

### Recharts Styling

All Recharts components use tokens from `src/styles/tokens.js`:
- Grid lines: `chartStyle.grid` (very subtle, rgba white at 0.04)
- Axis text: `chartStyle.axisText` (muted color, 12px)
- Tooltips: dark surface-raised bg, border-strong, 8px radius, 8px 12px padding
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
