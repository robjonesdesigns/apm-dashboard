# DESK-RESEARCH-020b: Competitor Page Deep Dive -- Exhaustive Screen-by-Screen Analysis

**Date:** 2026-04-03
**Purpose:** Companion to DESK-RESEARCH-020. Exhaustive layout, interaction, and content documentation for 8 page types across 6 major APM tools. Written so a designer can reference this months later and understand exactly how each competitor handles each page without needing to access the actual product.

---

## How to Read This Document

For each page type, every tool is documented with:
- Layout description (header, body, sidebar)
- Table columns and data shown
- Card/widget structure
- Filtering and sorting options
- Drill-down behavior
- Available actions
- Mobile experience
- Visual description
- Strengths and weaknesses
- Unique patterns

Tools covered: IBM Maximo (Manage, Health, Predict, Monitor), SAP PM (Fiori + classic GUI), GE Vernova APM (Meridium), Bentley AssetWise, Honeywell Forge APM, Emerson Plantweb Optics.

---

# 1. PLANT OVERVIEW / LANDING DASHBOARD

## 1.1 IBM Maximo

### Maximo Manage -- Operational Dashboard (MAS 9.0+)

**Layout:**
- Full-width page replacing the legacy Start Center
- Top bar: suite-level navigation (9-dot launcher for switching between Manage, Health, Monitor, etc.)
- No sidebar on the dashboard itself; left nav (hamburger icon) collapses to access other Manage modules
- Body: configurable grid of cards and widgets arranged in a responsive column layout

**Card/Widget Types Available:**
1. **KPI Trend Card** -- displays one primary KPI with up to 8 comparison KPIs overlaid. Supports value-type and percentage-type KPIs (must be same y-axis type). Configurable time period selector.
2. **KPI Comparison Card** -- compares up to 20 KPIs. Chart type selector: bar (default), line, pie, or donut. Export as CSV, PNG, or JPG. Toggle between chart and tabular view of KPI values.
3. **Work Queue Card** -- filtered table of records (e.g., overdue WOs, my assigned WOs, PMs coming due). Columns are configurable via "Manage Columns" button. Above-table toolbar: search, download, manage columns, filter, reset. Clicking a row opens the record detail.
4. **External Content Card** (new in MAS 9.0) -- embeds external URLs or iframes for third-party dashboards or documentation.

**Typical Maintenance Planner Dashboard Configuration:**
- My Assigned Work Orders (Work Queue)
- Overdue Work Orders (Work Queue with red count badge)
- Open Service Requests (Work Queue)
- PM Coming Due This Week (Work Queue)
- KPI Trend: WO Backlog Over Time (line chart, 30-day window)
- KPI Comparison: WO Completion Rate by Priority (bar chart)

**Filtering and Sorting:**
- Each Work Queue card has its own search, column filter, and sort controls
- KPI cards have time period selectors (7d, 30d, 90d, 1y, custom)
- Dashboard-level: no global filter; each card is independently configured
- Saved configurations per role; administrators define which cards appear for which security groups

**Drill-Down:**
- Click any row in a Work Queue to open the full record detail page (WO, SR, PM, etc.)
- Click any KPI data point to see the underlying record list
- No intermediate "overview" step; drill-down goes directly to the record

**Actions Available:**
- Quick Insert portlet (legacy): create WO, SR, PM directly from dashboard
- Work Queue rows: right-click context menu for Route, Approve, Change Status
- KPI cards: export data

**Mobile Experience:**
- Maximo Mobile (separate PWA app) does NOT replicate the Operational Dashboard
- Mobile landing: "My Work" list (assigned WOs sorted by priority), "Inspections" list, navigator menu
- No dashboard widgets or KPI charts on mobile; mobile is execution-focused, not overview-focused

**Visual Description:**
- Light theme (white background, IBM Carbon design tokens). MAS 9.0 uses Carbon v11.
- Cards have subtle gray borders, white backgrounds, 8px border-radius
- KPI values in large bold type (24-32px). Chart colors follow Carbon palette (blue, teal, purple, magenta)
- Work Queue tables are dense: 12-14px font, minimal row padding, alternating row shading optional
- Top bar: dark blue (#0f62fe IBM blue), white text, 48px height

**Strengths:**
- Extremely configurable per role. Administrators can build distinct dashboards for planners, supervisors, technicians, managers.
- Work Queue pattern is powerful: saved queries surfaced as live-updating tables. Users see exactly their work.
- KPI trend/comparison cards are genuinely useful for tracking operational metrics over time.

**Weaknesses:**
- Configuration complexity. Requires admin involvement to set up meaningful dashboards; out-of-box experience is generic.
- No spatial/visual summary of plant health on the landing page. Pure data tables and charts.
- No heatmap, no plant-level health score, no "worst-first" prioritization on the landing page itself.
- Cards are independent islands; no cross-card filtering or linked brushing.

**Unique Patterns:**
- The Work Queue is Maximo's signature pattern: a saved query rendered as a live table widget. Every role can have custom queues. This is the primary mechanism for task management.

### Maximo Health -- Asset Grid (Landing Page)

**Layout:**
- Left sidebar: collapsible, icon-based navigation (Assets, Work Queues, Asset Investment Optimizer, Scoring Settings, Predict Settings)
- Main area: full-width data grid with toolbar above
- View switcher in toolbar: Grid | Map | Charts | Matrix

**Grid View (Default Landing):**
- Standard data table occupying full width
- Default columns: Asset ID, Description, Type, Health Score, Criticality, Risk Score, End of Life %, Days to Failure, Location
- Columns are addable/removable/reorderable via column picker
- Health Score renders as a numeric value (0-100) with color-coded background cell: green (>70), yellow (40-70), red (<40)
- Criticality renders as numeric score
- Risk Score renders as numeric score
- Days to Failure shows integer with red highlight when <30 days

**Map View:**
- Geospatial view with color-coded pins per health status
- Container overlays (polygons) for grouping assets by area/unit
- Click pin opens summary card overlay (health, criticality, risk, last inspection date)
- Actions dropdown on card: Create Plan, Add Flag, Submit WO

**Charts View:**
Four pre-configured charts:
1. Health Wheel -- donut chart categorizing assets by health band (good/fair/poor/critical)
2. Unplanned Downtime -- bar chart showing hours by month
3. Failure Rate by Manufacturer -- horizontal bar chart
4. MTBF -- line chart with configurable threshold line

Click any chart segment to drill into the underlying asset list.

**Matrix View:**
- Bubble chart / scatter plot with configurable X and Y axes
- Default matrices: Criticality vs Health, Criticality vs Risk, Criticality vs End of Life
- Color coding by health band
- Click quadrant to see asset list for that risk category

**Filtering and Sorting:**
- Funnel icon opens filter panel: filter by container (plant area), saved query, asset type, classification
- Column header click sorts ascending/descending
- Saved views (public and private) store column configuration, filters, sort order
- Search bar for asset name/ID text search

**Drill-Down:**
- Click any row in grid to open Asset Detail page
- 1 click from grid to asset detail (total 2 clicks from suite launcher)

**Actions:**
- Bulk actions on selected rows: Add Flag, Create Plan, Recalculate Scores
- Individual row: Create WO, Create Service Request, Edit Source Record

**Mobile:**
- No dedicated Health mobile app; accessible via mobile browser but not optimized
- Grid view is responsive but dense on small screens
- Map view works on tablets

**Visual Description:**
- Light theme, IBM Carbon design system
- Grid uses zebra striping. Health scores in colored pills (green/yellow/red)
- Matrix view uses colored circles sized by a third dimension (configurable)
- Charts view uses Carbon chart components (D3-based)
- Clean, minimal chrome. Data-dense.

**Strengths:**
- Grid-first approach is familiar to reliability engineers who think in spreadsheets
- Four view types (grid, map, charts, matrix) give multiple ways to see the same data
- Work Queues are pre-configured smart lists that surface the most important assets
- Saved views are shareable, creating institutional knowledge

**Weaknesses:**
- No narrative or contextual summary. Landing page is raw data, not a story.
- No KPI summary bar or health score roll-up at the plant level
- No "what happened today" or incident-driven context
- Map view requires geospatial data that many plants do not have

**Unique Patterns:**
- Work Queues as "smart inboxes" (e.g., "Failing Before PM," "Missing Data," "High Risk") -- a prioritized to-do list derived from health/predict models. Unique to Maximo Health among competitors.

---

## 1.2 SAP Plant Maintenance

### SAP Fiori Launchpad (Landing Page)

**Layout:**
- Full-width tile-based homepage
- Top bar: SAP Fiori shell bar with search, notifications bell, user menu
- No sidebar; tiles are the navigation
- Tiles organized into Groups (role-based app groups assigned by admin)
- Each group has a heading and a grid of tiles beneath it

**Tile Types:**
1. **Static Tile** -- icon + label, fixed. Opens the app on click.
2. **Dynamic Tile** -- icon + label + live count (e.g., "12 Overdue Orders"). Count auto-refreshes. Color-coded if threshold breached (red/yellow).
3. **KPI Tile** -- numeric value + trend arrow (up/down) + time comparison. Mini sparkline possible.
4. **News Tile** -- scrolling text for announcements.

**Typical Maintenance Planner Tile Groups:**

*Group: "My Work"*
- My Maintenance Requests (dynamic, count of open notifications)
- Screen Maintenance Requests (F4072)
- Manage Maintenance Orders (dynamic, count of orders in planning)
- Find Maintenance Orders (F2175)

*Group: "Planning"*
- Maintenance Scheduling Board (Gantt)
- Manage Work Center Utilization
- Maintenance Backlog Overview
- Manage Maintenance Buckets (F4073)

*Group: "Execution"*
- Perform Maintenance Jobs (F5104A)
- Confirm Maintenance Operations
- Mobile Work Order Execution

*Group: "Master Data"*
- Maintain Equipment
- Maintain Functional Location
- Manage Maintenance Plans

*Group: "Analytics"*
- Monitor Maintenance (F1511) -- overview dashboard
- Breakdown Analysis (F2812)
- Maintenance Cost Analysis

**Monitor Maintenance App (F1511) -- The Closest Thing to a Dashboard:**
- Opens from launchpad tile
- Header: filter bar (plant, planning group, work center, date range)
- Body: grid of KPI cards, each showing a metric with trend
- KPI cards include: Open Orders count, Overdue Orders count, Orders by Priority (bar chart), Orders by Status (donut), PM Compliance %, Breakdown Rate, MTBF, MTTR
- Each KPI card is clickable to drill into the underlying order list
- No heatmap, no asset health summary, no spatial view

**Filtering and Sorting:**
- Launchpad: search bar at top searches across all tile labels and app content
- Within apps: filter bar pattern (top of page, horizontal row of dropdown/input fields)
- Smart Filter Bar: auto-suggest, variant management (saved filter sets)
- Sort within list apps by any column header

**Drill-Down:**
- Tile click opens app (list view or overview)
- Within app: click row opens record detail
- 2-3 clicks from launchpad to specific order or equipment record
- Breadcrumb navigation at top of each app

**Actions:**
- Create Notification (from launchpad quick action)
- Create Maintenance Order (from launchpad or within any list app)
- Release/Complete/Technically Complete (status actions within order detail)

**Mobile:**
- SAP Fiori responsive design: tiles reflow on tablet/phone
- SAP Service and Asset Manager (native app): dedicated mobile WO execution
- Mobile launchpad shows subset of tiles relevant to field role
- Native app: offline-capable, barcode/NFC scanning, photo capture, GPS

**Visual Description:**
- Light theme (SAP Quartz, white/light gray background)
- Tiles: square with colored left border by category (blue for transactional, green for analytical, orange for fact sheets)
- Dynamic tiles show large count number (28-32px bold) with smaller subtitle
- Within apps: Fiori Object Page pattern (header with key fields, icon tab bar for sections, scrollable body)
- Dense typography (13-14px body, SAP 72 font family)

**Strengths:**
- Tile-based launchpad is instantly scannable. Dynamic tiles surface urgent counts without opening apps.
- ~50 Fiori apps for plant maintenance alone means deep functional coverage
- Variant management (saved filter sets) is powerful for repetitive tasks
- SAP ecosystem integration: same launchpad for PM, procurement, inventory, finance

**Weaknesses:**
- No unified plant health dashboard. Each app is a silo. No single screen shows "how is my plant doing?"
- Tile overload: 20-50 tiles on a planner's launchpad becomes overwhelming
- No heatmap, no risk visualization, no health scoring on the landing page
- Classic SAP GUI still required for many advanced transactions (tree views, complex reports)
- Learning curve: users must know which tile/transaction to use for each task

**Unique Patterns:**
- Transaction code culture: even Fiori users often navigate by typing transaction codes (IW31, IW38) in the search bar rather than finding tiles. This is unique to SAP.
- Dual UI: organizations typically run both Fiori and SAP GUI simultaneously, with different users preferring different interfaces for the same data.

---

## 1.3 GE Vernova APM (Meridium)

### Home Dashboard

**Layout:**
- Left navigation panel: persistent sidebar listing licensed modules grouped by pillar (Health, Strategy, Reliability, Integrity)
- Top bar: breadcrumb path, user menu, search, notifications
- Main area: configurable dashboard canvas with drag-and-drop widget grid

**Dashboard Architecture:**
- Dashboards are Catalog items (stored in a file-system-like catalog structure)
- Each module ships with baseline dashboards; users can create custom ones
- Five Work Process Dashboards out-of-box: Foundation, Failure Elimination, Asset Strategy, Mechanical Integrity, Asset Safety
- Each dashboard is a grid of widgets; widgets are resizable and repositionable

**Widget Types (6 types):**
1. **Hyperlink Widget** -- list of clickable links (internal APM pages or external URLs). Useful for quick navigation to frequently used modules.
2. **Query Widget** -- renders query results as a data table. Configurable query source from Catalog. Filter parameters configurable. Text wrapping toggle. Click row to navigate to record.
3. **Graph Widget** -- graphical rendering of query results (bar, line, pie, scatter). Same query-driven approach. Opens in Graph Editor for customization.
4. **KPI Widget** -- displays KPIs in dial gauge or bullet chart format. Supports up to multiple KPIs per widget. KPIs selected from global KPI library.
5. **Image Widget** -- displays a custom image via URL. Used for plant diagrams, P&IDs, or branding.
6. **Calendar Widget** -- shows events on month/week/day calendar view. Query-driven. Events map to title, start/end date, category, color columns from query results.

**Typical APM Dashboard Configuration:**
- Assets Requiring Attention (Query Widget: assets with health score below threshold)
- Open Recommendations by Module (Graph Widget: stacked bar by RCA/RBI/IM/ASM)
- Upcoming Inspections (Calendar Widget: next 30 days of scheduled inspections)
- Reliability Trend (Graph Widget: MTBF over 12 months)
- Health Score Distribution (Graph Widget: histogram of asset health scores)
- Quick Links (Hyperlink Widget: RCA, Inspection Management, Thickness Monitoring, etc.)
- Risk Matrix (special widget in MI module: 5x5 probability vs consequence grid with asset counts per cell)

**Filtering and Sorting:**
- Dashboard-level: no global filter; each widget has independent filter parameters
- Query/Graph widgets: "Enter Filter Parameters" dialog on widget load or refresh
- KPI widgets: fixed to KPI definition (filter built into KPI query)
- No cross-widget filtering or linked brushing

**Drill-Down:**
- Click any row in a Query Widget to open the record detail page
- Click any bar/segment in a Graph Widget to see underlying records
- Click module in left nav to enter module landing page (list view)
- 2-3 clicks from dashboard to specific record

**Actions:**
- Widgets are read-only views; actions happen within module pages
- Quick Links widget provides direct navigation to creation pages (Create RCA, Create Inspection, etc.)
- Refresh button per widget to update data

**Mobile:**
- GE APM has a separate mobile app for field inspections (Inspection Management mobile)
- Dashboard is not mobile-optimized; designed for desktop/widescreen
- Mobile app focuses on inspection data collection, not dashboard viewing

**Visual Description:**
- Light theme (white/light gray background, blue accent color)
- Widgets have card-like borders with title bars. Title bar includes widget name and action icons (refresh, maximize, configure)
- Query widgets render as standard data grids with sortable column headers
- Graph widgets use charting library (bar, line, pie) with blue/teal/green palette
- KPI dials: circular gauge with green/yellow/red zones and needle indicator
- Overall aesthetic: functional/enterprise, not modern. Utilitarian. Reminiscent of early 2010s BI tools.

**Strengths:**
- Query-driven architecture means any data in the system can appear on a dashboard without code changes
- Module organization (Health, Strategy, Reliability, Integrity) provides clear mental model
- Five baseline work-process dashboards give immediate structure
- KPI dial widgets are good for at-a-glance health/risk communication

**Weaknesses:**
- Visual design is dated. Widgets look like 2010-era BI portlets.
- No heatmap, no spatial view, no asset hierarchy visualization on dashboard
- Configuration requires knowledge of the Catalog query system (not drag-and-drop friendly)
- No cross-widget interaction or filtering
- Dashboard is a "portal page" not a designed experience

**Unique Patterns:**
- Catalog-based architecture: every dashboard, query, graph, and report is a Catalog item stored in a folder tree. Power users navigate the Catalog like a file system.
- Module pillar structure (Health/Strategy/Reliability/Integrity) maps to organizational roles: Health for condition monitoring engineers, Strategy for RCM analysts, Reliability for reliability engineers, Integrity for inspection engineers.

---

## 1.4 Bentley AssetWise

### APM Supervisor Dashboard (Landing Page)

**Layout:**
- Top bar: Bentley branding, user menu, notifications, search
- Left panel: asset hierarchy tree (collapsible). Shows: Site > Area > Unit > Equipment. Expand/collapse with +/- icons.
- Main area: dashboard canvas with KPI cards and summary visualizations
- Optional 3D model panel (when iTwin integration is configured)

**Widget/Card Types:**
1. **Health Score Distribution** -- bar chart or pie chart showing count of assets by health band (healthy/warning/critical/unknown)
2. **Overdue Items** -- count cards for overdue inspections, overdue maintenance, overdue calibrations
3. **Asset Health Trend** -- line chart of aggregate health score over time for selected scope (plant, area, unit)
4. **Active Alarms** -- count card with severity breakdown
5. **Inspection Compliance** -- percentage bar showing inspected vs due
6. **3D Model Viewer** (when available) -- embedded iTwin/iModel viewer with health-colored asset overlays

**Filtering and Sorting:**
- Asset hierarchy tree acts as scope filter: selecting a node filters all dashboard cards to that scope
- Date range selector for trend charts
- No saved views or custom dashboard configurations documented

**Drill-Down:**
- Click any asset in hierarchy tree to see its health detail
- Click health distribution bar segment to see asset list for that health band
- Click overdue count to see list of overdue items
- From 3D model: click asset geometry to open asset detail overlay
- 2-4 clicks from dashboard to asset detail (2 via 3D click, 4 via hierarchy tree navigation)

**Actions:**
- Dashboard is primarily read-only / navigational
- Work approvals possible from Supervisor Dashboard (approve/reject work requests)
- Alarm acknowledgment from active alarms widget

**Mobile:**
- APM Supervisor Dashboard available on Windows tablets
- APM Inspections mobile app (separate): field inspection data collection
- No iOS/Android dashboard app; tablet-focused

**Visual Description:**
- Light theme, Bentley blue accent (#007DBA)
- Cards have white backgrounds with subtle shadows, rounded corners
- Hierarchy tree uses standard expand/collapse tree control with asset type icons
- 3D model view: photorealistic engineering model with colored overlays (green/yellow/red per health)
- When 3D is present, it dominates the viewport (60-70% of screen width)
- KPI cards are compact: large number, small label below

**Strengths:**
- 3D digital twin integration is unique in the APM market. Clicking a pipe in a 3D model to see its inspection history is powerful.
- Hierarchy tree as global scope filter is intuitive for plant engineers who think hierarchically
- Simple, focused dashboard without overwhelming number of widgets

**Weaknesses:**
- Limited dashboard customization compared to Maximo or GE APM
- Heavily dependent on having 3D models (without them, the differentiator disappears)
- No heatmap, no risk matrix, no predictive analytics on dashboard
- Mobile story is weak (Windows tablet only for dashboard)
- Not designed for real-time alarm management or streaming data

**Unique Patterns:**
- 3D-first navigation: Bentley is the only APM tool where the primary entry point can be a 3D engineering model. This appeals to engineering-heavy organizations (oil & gas, power, water) that already have 3D models from design/construction phases.
- "Immersive APM" terminology: Bentley markets the ability to walk through a virtual plant and see condition data overlaid on physical geometry.

---

## 1.5 Honeywell Forge APM

### Plant Overview Dashboard (Landing Page)

**Layout:**
- Left sidebar: module navigation (Health, Predict, Optimize, Excellence) + asset hierarchy tree
- Top bar: plant selector (for multi-site), user menu, notifications bell, search
- Main area: three primary zones stacked vertically:
  1. KPI summary strip (top)
  2. Risk heatmap (center, dominant visual)
  3. Asset summary table (bottom)
- Right panel: notification drawer (expandable/collapsible)

**KPI Summary Strip:**
- Horizontal row of 4-6 KPI tiles at page top
- Typical KPIs: Total Assets Monitored, Assets at Risk (count), Predicted Failures (next 30 days), Active Events, Open Work Orders, Plant Health Score (aggregate 0-100)
- Each tile: large number (32px+), label below, trend indicator (up/down arrow with percentage change)

**Risk Heatmap (Center Section):**
- Grid-based heatmap where rows = plant units/areas, columns = equipment types or risk categories
- Cell color: green (healthy) to red (critical) based on worst-asset health score in that intersection
- Cell size may vary by asset count (larger = more assets)
- Click cell to filter the asset table below to that unit/type combination
- Heatmap represents the "hot spots" at a glance. Honeywell's signature visualization.

**Asset Summary Table:**
- Data table below heatmap showing filtered asset list
- Columns: Asset Name, Unit, Type, Health Score, Criticality, Priority, Predicted Failure Date, "Dollars at Risk," Active Events, Last Inspection
- "Dollars at Risk" is a financial impact column (unique to Honeywell) estimating cost of failure
- Sortable by any column. Default sort: worst health score first ("worst first" philosophy)
- Row click opens asset detail page

**Notification Drawer (Right Panel):**
- Collapsible panel showing recent events, alerts, ML model alerts
- Each notification: severity icon, asset name, timestamp, brief description
- Click notification to navigate to event detail
- Badge count on the notification bell icon in top bar

**Filtering and Sorting:**
- Hierarchy tree in left sidebar acts as scope filter (Plant > Unit > Equipment type)
- Heatmap cells act as filters for the table below
- Table has column-level sort and search
- No saved views documented; filtering is session-based

**Drill-Down:**
- Heatmap cell click filters table. Table row click opens asset detail.
- Alternative: hierarchy tree click narrows scope, then select asset from filtered table.
- Notification click goes directly to event detail.
- 2-3 clicks from overview to asset detail (heatmap cell + row click, or hierarchy + row click)

**Actions:**
- Create Work Order from asset table row context menu
- Acknowledge event from notification drawer
- No bulk actions documented on dashboard

**Mobile:**
- Honeywell Forge mobile app (CT30X, CT60 rugged devices)
- Mobile landing: simplified event list and WO list (no heatmap, no dashboard KPIs)
- Mobile focus: event monitoring, WO progress tracking, task execution
- Scan barcode to identify asset, view health status, access SOPs

**Visual Description:**
- Dark theme option available (unusual for enterprise APM). Also supports light theme.
- Heatmap uses green-yellow-orange-red gradient cells on a dark or white background
- KPI tiles: clean, modern cards with generous padding
- Asset table: standard data grid, alternating row color optional
- Overall aesthetic: more modern than GE/SAP, less modern than consumer SaaS
- Honeywell blue (#0071CE) as primary accent. Forge branding.
- 100+ high-fidelity screens were designed through iterative UAT (per Kinshuk Bose case study)

**Strengths:**
- Risk heatmap is the most effective plant-level visualization in the market. Instantly shows where problems cluster.
- "Dollars at risk" brings financial context to health data. Speaks management's language.
- "Worst first" default sort ensures the most critical assets surface immediately
- Notification drawer keeps events visible without leaving the dashboard
- ML-driven predictions surface on the dashboard, not buried in a separate module

**Weaknesses:**
- Heatmap requires good asset hierarchy and health scoring setup; garbage in = useless heatmap
- Less configurable than Maximo or GE APM dashboards. What you see is largely what you get.
- No grid/table-only landing option for users who prefer spreadsheet-style views
- Mobile experience is basic compared to Maximo Mobile
- Multi-site comparison not prominent on single-plant dashboard

**Unique Patterns:**
- Heatmap-first design philosophy. While other tools lead with tables or tiles, Honeywell leads with a visual that encodes two dimensions of data (unit x type) with color encoding health. This is the pattern closest to what an operations manager wants to see at 7 AM.
- "Dollars at risk" as a first-class column. No other APM tool promotes financial impact to the asset table on the landing page. This bridges the gap between engineering health data and business decision-making.

---

## 1.6 Emerson Plantweb Optics

### KPI Dashboard (Landing Page)

**Layout:**
- Top bar: Emerson branding, persona selector (Operator / Maintenance / Reliability / Manager), site selector, notifications, user menu
- No traditional sidebar; primary navigation is through dashboard tiles and asset health list
- Main area: KPI tiles (top) + asset health list (bottom)
- Persona filter applies globally: changing persona changes which KPIs and assets are visible

**KPI Tiles (Top Section):**
- 4-6 KPI tiles in a horizontal row
- Typical KPIs vary by persona:
  - *Operator:* Unhealthy Assets, Active Alarms, Devices in Failure, Out of Spec count
  - *Maintenance:* Overdue Calibrations, Overdue Routes, Maintenance Required count, Open Work Notifications
  - *Reliability:* Analytics Deviations, Bad Actors, MTTA (Mean Time to Acknowledge), MTTR
  - *Manager:* % Assets Monitored, Alert Response Time, Plant Availability, Cost Avoidance
- Each tile: large number, trend sparkline, label
- Click tile to filter asset list below to matching assets

**Asset Health List (Main Section):**
- Not a traditional table; card-based list
- Each card shows: asset name, location, NAMUR NE107 status icon, health score (red/yellow/green indicator), unread message count badge, last alert timestamp
- NAMUR NE107 status icons (industry standard):
  - Red X = Failure
  - Orange triangle = Check Function
  - Yellow diamond = Out of Specification
  - Blue wrench = Maintenance Required
  - Green checkmark = Good
- Personalized watch list: user-pinned assets appear at top
- Sort options: health score, last alert time, asset name, location

**Filtering and Sorting:**
- Persona selector is the primary filter (changes entire view)
- Location filter: drill by Site > Area > Unit
- Asset class filter: valve, transmitter, pump, analyzer, etc.
- Responsibility filter: show only assets assigned to you
- Search bar for asset name/tag number
- Sort by health score, alert recency, or alphabetical

**Drill-Down:**
- Click KPI tile to filter asset list
- Click asset card to open asset detail view
- 2 clicks from dashboard to asset detail (KPI filter optional)
- Within asset detail: diagnostic information from linked Plantweb Insight applications

**Actions:**
- Mark alert as read/acknowledged from dashboard
- Create work notification from asset card context menu
- Send message to team member about an asset
- No work order creation (bridges to external CMMS)

**Mobile (AMS Optics App):**
- Available on iOS and Android
- Connects to multiple Plantweb Optics instances (multi-site)
- Mobile dashboard: same KPI tiles + asset health list, simplified layout
- Push notifications for new alerts
- AR (augmented reality) mode: point camera at equipment, see health overlay and diagnostic data
- AR includes live remote assistance (expert can draw on technician's screen)
- Knowledge Database: searchable library of annotated repair videos and guides

**Visual Description:**
- Light theme (white background, Emerson teal #00A99D accent)
- KPI tiles: clean, card-based, generous white space
- Asset health list: card-based with left border color indicating health status
- NAMUR NE107 icons are standard, recognizable by any instrument engineer
- Persona selector is prominent (top of page, dropdown or tab bar)
- Overall aesthetic: clean, modern, less data-dense than Maximo or SAP. Designed for usability over power.

**Strengths:**
- Persona-based filtering is the most sophisticated role-based approach in the market. Not just different landing pages -- the same data is filtered and prioritized differently per persona.
- NAMUR NE107 compliance means operators immediately understand status icons without training (industry standard they already know from field devices)
- AR integration is unique. No other APM tool offers "point your phone at equipment to see its health."
- Mobile experience is the strongest among pure APM overlays (not counting Maximo/SAP which are full CMMS)

**Weaknesses:**
- No dashboard-level charts or visualizations. Just KPI tiles + list. No heatmap, no trend charts, no matrix.
- Limited to instrumentation-centric assets. Not designed for rotating equipment, structural assets, or electrical systems.
- No native work order management. Relies entirely on CMMS integration.
- Dashboard is shallow: quick KPI glance, then you must drill into asset detail for any real analysis.
- No configurable dashboards or custom widget placement.

**Unique Patterns:**
- Persona as a first-class navigation concept. The persona selector at the top of the page is not a "view" toggle -- it fundamentally changes what the system shows. An operator sees NAMUR device health; a reliability engineer sees analytics deviations and bad actors. This is the most role-sensitive APM product.
- NAMUR NE107 as the status language. While other tools invent their own severity/status systems, Emerson uses an existing ISA/NAMUR standard that field instrument engineers already know. Zero learning curve for status interpretation.

---

# 2. ASSET DETAIL / ASSET INSPECTION

## 2.1 IBM Maximo

### Maximo Manage -- Asset Detail Page

**Layout:**
- Header bar: Asset Number, Description, Status badge, Location, Parent Asset link
- Tab navigation below header (horizontal tab bar)
- Each tab is a full-page form with fields, tables, and embedded widgets

**Tabs (in order):**
1. **General** -- Asset description, type, manufacturer, model, serial number, installation date, vendor, asset template, rotating flag, total downtime, total cost
2. **Specifications** -- Classification attributes (key-value pairs from classification tree). E.g., Pump Type: Centrifugal, Capacity: 500 GPM
3. **Safety** -- Hazards, tag-out/lock-out procedures, safety plans linked to asset
4. **Meters/Condition Monitoring** -- Meter groups, individual meters, reading history (tabular), condition monitoring points. Graph button for trend visualization.
5. **Work** -- Linked work orders table (columns: WO#, Description, Status, Priority, Reported Date, Target Start/Finish). Click to open WO detail.
6. **Spare Parts** -- Bill of materials. Parts list with item number, description, quantity, storeroom, availability status.
7. **Relationships** -- Related assets (not parent-child; e.g., "supported by," "backup for")
8. **Attached Documents** -- Document list (PDFs, images, manuals, drawings). Preview in browser.
9. **Drilldown** -- Hierarchical tree view of child/sub-assets. Expand/collapse. Click child to open its asset detail.
10. **Classification** -- Classification tree position and attributes
11. **Log** -- Communication log entries (timestamped notes)

**Drill-Down to Sub-Assets:**
- Drilldown tab shows tree view with parent-child hierarchy
- Each child asset is clickable, opening a new asset detail page
- Breadcrumbs or browser back to return to parent
- Hierarchy depth: unlimited (equipment > sub-equipment > components)

**Health Score Display (Manage only):**
- Manage does NOT display health scores. Health scores live in Maximo Health.
- Manage shows: operational status, meter readings, work history, cost data
- Link to Health from Manage: "View in Health" button (cross-app navigation)

**Actions:**
- Change Status (Operating, Not Ready, Decommissioned, etc.)
- Create Work Order (from asset context)
- Create Service Request
- Move Asset (change location)
- Add/Replace Meter
- Attach Document

**Mobile (Maximo Mobile):**
- Asset lookup by barcode scan, NFC, or search
- Simplified asset detail: name, description, location, status, meters, attachments
- No tabs; scrollable single page
- Take photo and attach to asset
- View linked WOs
- Record meter reading

### Maximo Health -- Asset Detail Page

**Layout:**
- Header: Asset name/ID, Description
- Score Summary Card (top): horizontal strip showing Health Score, Criticality Score, Risk Score, End of Life %, Effective Age, Probability of Failure %
- Below header: scrollable sections of detail cards/widgets

**Sections (scrollable, top to bottom):**

1. **Score Summary Card** -- Top of page. Shows 6 scores in a horizontal row of metric cards:
   - Health Score (0-100, color-coded green/yellow/red)
   - Criticality Score
   - Risk Score
   - End of Life %
   - Effective Age
   - Probability of Failure %
   - Next PM date
   - MRR (Maintenance Repair Rate)
   - Custom scores (configurable, e.g., Substation Efficiency)

2. **Score Details Widget** -- Expandable section showing health score contributors. Each contributor: name, weight (percentage), current value, historical trend sparkline. Sorted by weight (highest impact first). Top 10 contributors shown; expand to see all. Contributors include things like: open work orders count, meter health, last inspection age, failure history.

3. **Dissolved Gas Analysis / Condition Data Tile** (asset-type-specific) -- For transformers: interactive dot visualization showing gas concentrations. Table view toggle. Combustible gas history chart with trend rating. For other asset types: relevant condition data specific to asset class.

4. **Predictions Tile** (requires Maximo Predict) -- Prediction cards showing:
   - Days to failure (per failure mode)
   - Probability of failure by failure mode and time period
   - Failure probability history chart (line graph)
   - Contributing factors ranked by importance
   - Anomaly detection results with threshold markers
   - End of life curve with effective age overlay
   - Probability percentages for specific failure types (e.g., "78% chance of winding failure within 180 days")

5. **Asset Timeline Card** -- Horizontal timeline showing:
   - Predicted failure date (future, right side, red marker)
   - Next PM date (future, orange marker)
   - Historical work orders (past, blue dots)
   - Historical inspections (past, green dots)
   - Hover shows details for each event
   - Time axis: configurable range

6. **Operational Status** -- Recent meter readings in tabular form. Up to 6 meters selectable for comparison. Toggle between table and line chart view. Shows current value, last reading date, trend direction.

7. **Maintenance History** -- Work order history table. Columns: WO#, Type, Description, Status, Completion Date, Cost.

8. **Replacement Planning** -- Investment plans, refurbishment details, replacement cost estimates. Links to Asset Investment Optimizer.

**Filtering and Sorting:**
- No filter controls on asset detail page; it shows all data for the selected asset
- Score contributors sortable by weight
- Maintenance history sortable by date, status, type

**Actions (from Actions button):**
- Add Flag (mark for replacement/review)
- Create a Plan (replacement or repair plan)
- Recalculate Scores
- Edit Source Asset Record (opens in Manage)
- Create Service Request
- Create Work Order

**Mobile:**
- Not optimized for mobile; functional in mobile browser at reduced fidelity
- No dedicated mobile Health asset detail experience

**Visual Description:**
- Light theme. Score cards: large bold numbers with colored backgrounds (green/yellow/red)
- Contributors list: horizontal bar chart per contributor showing weight
- Predictions section: line charts with confidence bands (gray shading)
- Timeline: horizontal rail with colored dots and markers
- Cards have white backgrounds, subtle borders, generous padding
- IBM Carbon component library throughout

**Strengths:**
- Most comprehensive asset detail page in the market. Health score with contributors, predictions, timeline, operational data, maintenance history, replacement planning -- all on one page.
- Score contributors with weights let engineers understand WHY the score is what it is
- Prediction section with multiple failure modes and probabilities is unmatched
- Asset timeline showing past WOs, inspections, and predicted failure on one axis is brilliant

**Weaknesses:**
- Information overload. Scrolling through all sections is long.
- Requires both Health AND Predict licenses for full experience; Health alone is limited
- No sub-asset tree on the Health detail page (must go to Manage for hierarchy)
- Visual design is functional but not beautiful

**Unique Patterns:**
- Score contributor decomposition. No other tool shows "your health score is 45 because: 30% from open WOs (bad), 25% from meter health (degrading), 20% from last inspection (overdue)..." This transparency is invaluable for reliability engineers.
- Multi-failure-mode predictions. Rather than one "days to failure" number, Maximo Predict shows probability per failure mode (winding failure, bushing failure, oil degradation) with separate timelines.

---

## 2.2 SAP Plant Maintenance

### Equipment Detail Page (Fiori Object Page)

**Layout:**
- Fiori Object Page pattern:
  - Header: Equipment number, description, status badge, location, cost center
  - Icon Tab Bar below header: tabs with icons and count badges
  - Scrollable body content per selected tab
- No sidebar; full-width content area

**Tabs (standard configuration):**
1. **General** -- Description, manufacturer, model, serial number, construction year, acquisition date, acquisition value, weight, size dimensions. ABC indicator (criticality). Asset number (finance link).
2. **Location** -- Functional location assignment, installation details (installed date, planned removal date), room/plant section, GPS coordinates (if configured)
3. **Organization** -- Planning plant, planning group, maintenance plant, work center assignment, cost center, company code, business area
4. **Structure** -- Sub-equipment list (table showing child equipment). Equipment BOM (bill of materials with parts). Functional location hierarchy position.
5. **Measuring Points** -- List of measuring points with: Point ID, Description, Characteristic, Unit, Upper/Lower limits, Last Reading Value, Last Reading Date. Click point to see measurement document history.
6. **Classification** -- Class assignment and characteristic values (key-value pairs). Multiple classes possible.
7. **Documents** -- Linked documents (DMS integration): drawings, manuals, photos. Document type, version, status.
8. **Partners** -- Business partners linked to equipment: manufacturer, vendor, service provider, responsible person
9. **Maintenance Plans** -- Linked preventive maintenance plans showing: Plan ID, Description, Cycle, Unit, Last Call Date, Next Planned Date
10. **History** -- Maintenance order history table: Order#, Type, Description, Priority, Status, Dates, Costs. Notification history. Usage history.

**Sub-Asset Display:**
- Structure tab shows child equipment in a flat table (not tree)
- For tree view: must use IH01 (classic GUI) or Maintain Functional Location to see full hierarchy
- Fiori does not natively show a deep tree; relies on flat list with parent references

**Health Score Display:**
- Classic SAP PM: NO health scores. SAP PM is maintenance-centric, not condition-centric.
- SAP Predictive Asset Insights (cloud add-on): adds anomaly scores and failure predictions, displayed as separate Fiori tiles/apps, not integrated into Equipment Object Page
- SAP Asset Strategy & Performance Management: adds FMEA, RCM, strategy optimization but in separate application

**KPIs on Equipment Detail:**
- No KPI strip or summary cards on equipment detail in standard SAP PM
- Cost data available on History tab
- MTBF/MTTR can be derived from history but not displayed as a KPI widget

**Filtering and Sorting:**
- Measuring points list: sortable by any column
- History tab: filter by date range, order type, status. Sort by date.
- No saved views on equipment detail

**Actions:**
- Create Notification (from equipment context)
- Create Maintenance Order (from equipment context)
- Change Equipment (edit master data)
- Display/Change Measuring Point
- Assign/Remove from Functional Location

**Mobile (SAP Service and Asset Manager):**
- Equipment lookup by barcode scan, NFC tag, or search
- Simplified equipment detail: key fields, measuring points, documents
- Record measurements with validation against limits
- View linked orders and notifications
- Photograph equipment and attach to record
- Offline capable: downloads assigned equipment data for field use

**Visual Description:**
- Light theme (SAP Quartz). Object Page header: gray background with key fields.
- Icon Tab Bar: horizontal tabs with SAP icon set, count badges on relevant tabs
- Body content: form layouts with label-value pairs in 2-3 column grid
- Tables: standard Fiori responsive table with row selection, column sorting
- Typography: SAP 72 font, 13-14px body, tight spacing
- Status badges: colored text badges (green=active, gray=inactive, red=deleted)

**Strengths:**
- Comprehensive master data. Every field an engineer could need is here.
- Integration depth: from equipment you can navigate to procurement, costs, BOM, financial postings
- Measuring points with limit validation is well-implemented
- Structure tab shows equipment BOM (parts) alongside sub-equipment
- History tab gives complete maintenance audit trail

**Weaknesses:**
- No health score, no condition summary, no predictive data on the detail page (in standard PM)
- Tab-heavy: 8-10 tabs means many clicks to find information
- No visual summary or "at a glance" section. Pure form-based data display.
- Sub-asset display is flat, not hierarchical (must use classic GUI for tree)
- Equipment detail feels like a database record form, not a designed experience

**Unique Patterns:**
- Measuring point limits as the primary "condition" indicator. SAP PM's approach to condition monitoring is through measurement documents against defined limits -- not health scores. An engineer knows a bearing is bad because the vibration measuring point exceeded its upper limit, not because a health score dropped.
- Equipment BOM (bill of materials) on the detail page. No other APM tool shows spare parts inventory alongside asset health data. This is useful for maintenance planners.

---

## 2.3 GE Vernova APM (Meridium)

### Asset Detail (Health Manager View)

**Layout:**
- Left nav: persistent module sidebar
- Breadcrumb: Home > Health > Asset Health Manager > [Asset Name]
- Header: Asset ID, Description, Asset Type, Location, Criticality
- Body: tabbed workspace or scrollable card sections (varies by module context)

**Sections/Tabs:**

1. **Overview Section** -- Summary card with:
   - Health Indicator score (0-100, dial gauge visualization)
   - Risk score (probability x consequence matrix position)
   - Criticality rating
   - Last assessment date
   - Policy execution status (automated health calculation rules)

2. **Health Indicators Tab** -- Table of all condition indicators feeding the health score:
   - Columns: Indicator Name, Source (sensor/manual/calculated), Current Value, Limit, Status (normal/warning/alert), Weight, Last Updated
   - Click indicator row to see trend chart of that indicator over time
   - Indicators sourced from: condition monitoring readings, inspection results, policy calculations

3. **Score History Tab** -- Line chart of health score over time (12 months default)
   - Multiple score lines possible if asset has sub-scores
   - Event markers overlaid (inspections, WOs, incidents)
   - Zoom and pan controls
   - Export data button

4. **Recommendations Tab** -- Table of open recommendations from all modules:
   - Columns: Recommendation ID, Source Module (RCA/RBI/IM/ASM), Description, Priority, Target Date, Assigned To, Status
   - Click to open recommendation detail
   - Create new recommendation button

5. **Related Records Tab** -- Links to:
   - Inspection Events (linked inspections)
   - Thickness Monitoring data (corrosion data)
   - RCA Analyses (root cause analyses involving this asset)
   - Work Orders (from connected CMMS)
   - Risk Assessments

6. **Condition Monitoring Data** -- Time series plots for sensor data:
   - Multiple tags plotable on same chart
   - Threshold bands (warning/alarm/danger as colored horizontal zones)
   - SmartSignal residual plots (actual vs predicted)
   - Time range selector with presets (1h, 8h, 24h, 7d, 30d, 90d, 1y, custom)

**Sub-Asset Display:**
- Asset hierarchy available through "Asset Hierarchy" navigation in Strategy modules
- Not prominently displayed on Health detail page
- In RBI module: assets organized by corrosion loops and circuits rather than parent-child

**Health Score Display:**
- Dial gauge (circular, needle-based) in the overview section
- Numeric value (0-100) in large font
- Color zones on dial: green (75-100), yellow (50-74), orange (25-49), red (0-24)
- Health indicators table shows what contributes to the score

**Filtering and Sorting:**
- Health indicators table: sort by weight, status, last updated
- Recommendations table: filter by source module, status, priority
- Score history chart: time range selector
- No global asset-detail-level filter

**Actions:**
- Create Recommendation
- Create Inspection Event
- Create RCA Analysis
- Edit Asset Record
- Recalculate Health Score (re-run policies)
- Generate Report

**Mobile (Inspection Management Mobile):**
- Field app for inspection data collection only
- Asset detail in mobile: simplified read-only view (health score, key indicators, recent inspections)
- No trend charts or analytics on mobile
- Focus is on recording findings, not analyzing asset condition

**Visual Description:**
- Light theme with blue accent
- Dial gauge is prominent at top of page (circular, 100-120px diameter)
- Health indicators table: standard data grid, status column uses colored dots or icons
- Score history chart: line chart with gray grid lines, blue data line, event markers as vertical dashed lines
- Recommendations table: standard grid with priority color coding
- Overall: functional, enterprise-grade, not visually refined

**Strengths:**
- Health indicators decomposition (what feeds the score) is transparent
- Score history with event overlays (inspections, WOs) gives causal context
- Cross-module recommendations surface actions from RCA, RBI, Inspection, and Strategy all in one place
- Condition monitoring data with SmartSignal residuals enables sophisticated analysis

**Weaknesses:**
- No KPI strip or quick summary. Dial gauge alone is not sufficient for a quick read.
- Sub-asset hierarchy is not visible on the health detail page
- Requires navigating between modules (Health, Integrity, Strategy) to get complete picture of one asset
- Visual design is dated. Dial gauge looks like early 2000s dashboard widget.

**Unique Patterns:**
- Policy-driven health scoring. GE APM uses a "Policy Designer" (rule engine) to define health score calculations. Policies can include complex conditional logic, multi-variable formulas, and automated actions. The asset detail page shows "Policy execution status" -- whether the automated calculation ran successfully.
- Cross-module recommendations. One asset's detail page surfaces recommendations from RCA (root cause findings), RBI (risk-based inspection intervals), IM (inspection findings), and ASM (asset strategy changes). This unified recommendation view is unique.

---

## 2.4 Bentley AssetWise

### Asset Detail Page

**Layout:**
- Left panel: hierarchy tree (persistent, highlighting current asset in tree context)
- Main area: asset detail with tab-based sections
- Optional right panel: 3D model view (when iTwin linked) showing the physical asset highlighted in context

**Tabs/Sections:**

1. **Overview** -- Asset name, ID, type, location, installation date, criticality, current health score, last inspection date, days since last inspection
2. **Health** -- Health score (numeric 0-100 with color band), contributing condition indicators table (indicator name, value, weight, status, source, date). Health trend chart (line graph over time).
3. **Inspections** -- Inspection history table: Date, Type, Inspector, Findings Summary, Condition Rating, Next Due Date. Click row to see full inspection event with findings, photos, and checksheet data.
4. **Strategy** -- Linked RCM/RBI analysis summary: failure modes, risk matrix position, recommended actions, current strategy. Risk matrix visualization (5x5 grid showing asset position).
5. **Condition Trends** -- Time series charts for condition indicators. Corrosion rate trends. Thickness monitoring data (wall thickness over time with minimum thickness line). Limited compared to GE or IBM.
6. **Documents** -- Linked engineering drawings (P&IDs, isometrics), manuals, inspection reports. Direct link to AssetWise ALIM for document management.
7. **3D View** (when available) -- Embedded iModel viewer showing the asset in 3D context. Color overlays for condition. Click adjacent equipment to navigate.

**Sub-Asset Display:**
- Hierarchy tree in left panel shows full parent-child tree with current asset highlighted
- Clicking child in tree loads its detail page
- 3D view shows sub-components spatially

**Health Score:**
- Numeric value with color band indicator
- Contributing indicators table with weights
- Corrosion-focused for static equipment (wall thickness, corrosion rates)
- Vibration-focused for rotating equipment (when configured)

**Filtering and Sorting:**
- Inspection history: filter by type, date range
- Condition trends: time range selector
- No advanced filtering on asset detail

**Actions:**
- Create Inspection Event
- Create Work Request (pushed to connected EAM)
- Update Condition Indicator (manual reading entry)
- Link Document
- Navigate to Strategy Analysis

**Mobile (AssetWise Inspections):**
- Download checksheets for assigned inspection route
- Asset lookup by search or QR code
- Record indicator readings with pass/fail against limits
- Capture photos, annotate images
- Record findings with condition rating (1-5 scale or custom)
- Sync data when online

**Strengths:**
- 3D context for asset detail is powerful. Seeing the asset in physical context aids understanding.
- Strong document integration (ALIM). Engineering drawings accessible from asset detail.
- Inspection history with full checksheet data is well-structured
- Strategy tab showing RCM/RBI analysis directly on asset detail is useful

**Weaknesses:**
- Condition monitoring is limited compared to GE or IBM. No real-time sensor streaming.
- Health score is inspection-driven, not sensor-driven. Lag between inspections means stale health scores.
- No predictive analytics or ML-based failure prediction
- No financial impact or "dollars at risk" data
- 3D view requires iTwin setup (significant infrastructure investment)

---

## 2.5 Honeywell Forge APM

### Asset Detail Page

**Layout:**
- Left sidebar: asset hierarchy tree with current asset highlighted
- Top: Asset header strip (name, type, unit, criticality badge, overall health score)
- Main area: vertically stacked sections

**Sections (top to bottom):**

1. **Health Summary Strip** -- Horizontal row of KPI cards:
   - Health Score (0-100, large number, color-coded)
   - Remaining Useful Life (days/months)
   - Predicted Failure Date
   - Dollars at Risk (estimated cost of failure)
   - Active Events count
   - Open Work Orders count

2. **Contributing Factors** -- ML-driven ranked bar chart:
   - Horizontal bars showing which parameters contribute most to current health deviation
   - Each bar: parameter name, contribution percentage, current value vs baseline
   - Click any bar to see the underlying sensor trend for that parameter
   - Color coded: red bars = top contributors to degradation
   - Updated in near-real-time as ML model recalculates

3. **Health Trend** -- Line chart showing health score over time:
   - Green/yellow/red zones as background bands
   - Event markers overlaid (maintenance, incidents, model retraining)
   - Configurable time range (7d, 30d, 90d, 1y, all)
   - ML confidence bands (gray shading around predicted trajectory)

4. **Sensor Data / Performance** -- Multi-panel trend view:
   - Key operating parameters displayed as individual small multiples or overlaid on single chart
   - Actual vs expected (ML model baseline) with residual highlighting
   - Bollinger-style confidence bands
   - Threshold lines (warning, alarm)

5. **Event History** -- Table of events related to this asset:
   - Columns: Event Name, Type, Severity, Date, Status, Duration, Dollars at Risk
   - Sorted by recency
   - Click to open event detail with fault tree

6. **Work Orders** -- Table of linked WOs:
   - Columns: WO#, Description, Status, Priority, Created Date, Assigned To
   - Link to create new WO from current asset context

7. **Maintenance Recommendations** -- ML-generated suggestions:
   - "Inspect bearing on [date]" with confidence level
   - "Maintenance window optimal between [date] and [date]" based on degradation curve and production schedule
   - Accept/reject/defer actions per recommendation

**Sub-Asset Display:**
- Hierarchy tree in left sidebar shows parent > current > children
- Asset naming convention: Plant1.FCCU.HeatEx100.InFlow (dot-separated hierarchy)
- Click child in tree to load its detail

**Health Score:**
- Prominent large number (48px+) at top of page
- Color-coded background: green (>75), yellow (50-75), orange (25-50), red (<25)
- ML-driven: based on learned normal patterns, not rule-based formulas
- Contributing factors show WHY the score is what it is (similar to Maximo Health but ML-derived)

**Actions:**
- Create Work Order
- Create Event
- Investigate (launch RCA workflow)
- Acknowledge recommendations
- Export asset report

**Mobile:**
- Asset lookup by barcode scan on CT30X/CT60
- Simplified health summary: score, active events, open WOs
- No trend charts or contributing factors on mobile
- Access SOPs and documentation for the asset
- Photo capture and attach

**Strengths:**
- Contributing factors (ML-driven) provide actionable insight into degradation causes
- "Dollars at risk" on asset detail connects health to business impact
- ML confidence bands on health trend give sense of prediction reliability
- Maintenance window optimization is unique: suggests WHEN to maintain based on production schedule
- Prescriptive recommendations with confidence levels

**Weaknesses:**
- ML models require training period (weeks to months) before useful predictions
- "Black box" concern: contributors come from ML, not transparent formulas
- Less structured than GE's policy-based approach for regulatory/compliance-driven industries
- No inspection management or RBI methodology
- Mobile is basic

**Unique Patterns:**
- ML confidence bands on health trend. Only Honeywell shows the uncertainty range around predictions, giving engineers a sense of how reliable the prediction is.
- Maintenance window optimization. Rather than just predicting failure, Forge suggests the optimal maintenance window considering degradation trajectory AND production schedule. No other tool does this.
- Asset naming convention (dot-separated hierarchy): Plant1.FCCU.HeatEx100.InFlow. This replaces cryptic tag names with human-readable asset paths.

---

## 2.6 Emerson Plantweb Optics

### Asset Detail Page

**Layout:**
- Top bar: breadcrumb (Dashboard > [Area] > [Unit] > [Asset])
- Header: Asset name, tag number, type, location, NAMUR NE107 status icon, health score
- Main area: vertically stacked sections, persona-filtered

**Sections:**

1. **Health Summary** -- NAMUR status icon (large), health score, device type, manufacturer, model
2. **Diagnostic Information** -- From connected Plantweb Insight application:
   - Specific to asset type (e.g., steam trap app shows steam loss, valve app shows travel deviation)
   - Current diagnostic status with recommended corrective action
   - "What happened / Why it matters / What to do" format (action card pattern)
3. **Historical Trend** -- Time series of key parameters:
   - Simple line chart with time axis
   - Limited to parameters available from the connected analytics app
   - Basic time range selector
4. **Messages / Notes** -- User-generated and system-generated messages:
   - Read/unread tracking
   - Timestamped
   - Threaded discussion per asset
   - System messages include diagnostic alerts with NAMUR category
5. **Work Notifications** -- Linked work notifications and WO status from connected CMMS:
   - Status tracking: open, in progress, completed
   - Not native WOs; pulled from SAP/Maximo via integration

**Sub-Asset Display:**
- Hierarchy tree navigation (from v1.6+): Site > Area > Unit > Equipment
- Click parent/child in tree to navigate
- No sub-component level (instrument-focused, not equipment-focused)

**Health Score:**
- NAMUR NE107 status icon is primary indicator (not a 0-100 score in classic sense)
- Additional health score from Plantweb Insight analytics where available
- Health is binary/categorical (good/check function/out of spec/maintenance required/failure) rather than continuous

**Actions:**
- Send message/note to team
- Create work notification (bridges to CMMS)
- Mark alert as acknowledged
- Add to personal watch list

**Mobile (AMS Optics):**
- Same sections as web but simplified layout
- AR mode: point camera at device, see health overlay
- Live remote assistance: expert can annotate technician's camera view
- Knowledge Database: searchable repair guides

**Strengths:**
- "What happened / Why it matters / What to do" action card format is the most user-friendly alert-to-action pattern
- NAMUR status is immediately interpretable by instrument engineers
- AR mode for field context is unique
- Messages/notes enable team collaboration directly on the asset

**Weaknesses:**
- Shallow condition data. Limited to what Plantweb Insight apps provide.
- No ML-based prediction, no RUL, no failure probability
- Health is categorical, not scored. Lose the nuance of a 0-100 scale.
- Limited to instrumentation assets (transmitters, valves, analyzers, steam traps). Not for pumps, compressors, heat exchangers.
- No condition monitoring for mechanical equipment

---

# 3. TRENDS / CONDITION MONITORING

## 3.1 IBM Maximo (Monitor)

**Layout:**
- Dashboard canvas with configurable card grid
- Each asset type can have a custom dashboard template
- Cards arranged in responsive grid (typically 2-3 columns)

**Card Types for Trending:**
- **Line Graph Card** -- Time series line chart for one or more sensor parameters. Multi-line overlay supported. Configurable time range. Threshold lines as horizontal dashed lines.
- **Value Card** -- Single current value display (large number) with unit and timestamp
- **Alert Card** -- List of recent alerts for the asset/group
- **Table Card** -- Tabular raw data display for sensor readings
- **Bar Chart Card** -- Aggregated data (daily averages, event counts)
- **Image Card** -- Static reference image (P&ID, equipment photo)

**Multi-Sensor Overlay:**
- Multiple sensor tags plotable on same line graph card
- Each tag gets a distinct color in the legend
- Y-axis auto-scales or manual configuration
- Up to 6 tags typically comfortable on one chart

**Time Range Options:**
- Presets: Last 1 hour, 4 hours, 8 hours, 24 hours, 7 days, 30 days
- Custom date range picker
- Real-time streaming mode (auto-refresh at configurable interval)
- Zoom and pan on chart

**Threshold Visualization:**
- Horizontal dashed lines at warning/alarm thresholds
- Colored zone shading (green zone = normal operating range, yellow = warning, red = alarm)
- Thresholds configured per meter/sensor in Manage or Monitor setup

**Anomaly Detection Overlay:**
- Supervised anomaly detectors mark outliers on time series with colored dots
- Anomaly score line overlayable alongside actual data
- Predicted vs actual overlay (from ML models): two lines on same chart, residual highlighted
- Anomaly severity mapped to color (minor = yellow, major = orange, critical = red)

**Navigation to Trends:**
- From Monitor app: select asset or asset group, view dashboard with trend cards
- From Health: click meter reading in Operational Status section, opens in Monitor context
- From Manage: Meters tab has "Graph" button that opens simple trend chart

**Cross-Asset Comparison:**
- Monitor entity dashboards can show multiple assets of same type
- Health fleet view: health score distribution histogram across asset class
- Direct sensor comparison: requires custom Monitor dashboard with tags from multiple assets on same card

**Mobile:**
- Monitor mobile (responsive web): trend cards render on mobile browser, simplified
- No offline trending capability
- Scroll-based navigation through cards on small screens

**Strengths:**
- Anomaly detection overlay (actual vs predicted with residual) is sophisticated
- Dashboard-as-a-service model (each asset type gets its own dashboard template) scales well
- Real-time streaming mode for active monitoring
- Integration with Watson IoT for advanced analytics pipelines

**Weaknesses:**
- Dashboard configuration requires technical setup (JSON-based card definitions historically)
- Cross-asset comparison requires custom dashboard creation
- Not as interactive as GE's ad-hoc analysis (cannot drag-and-drop tags onto charts)
- Dependent on IoT data pipeline setup; not useful without connected sensors

---

## 3.2 SAP PM

**Fiori Trend Visualization:**
- Measuring point trend: line chart within Process Measuring Point app
- Simple chart: value over time for single measuring point
- Upper/lower limits rendered as horizontal lines on chart
- Traffic light coloring when value exceeds limits

**SAP Analytics Cloud (Advanced):**
- Multi-metric dashboards for fleet or asset analysis
- Line charts, bar charts, scatter plots
- Configurable time aggregation (hourly, daily, weekly, monthly)
- Cross-asset comparison in analytics stories
- Drill-down by hierarchy level

**SAP Predictive Engineering Insights:**
- Simulation overlay: predicted (FEA model) vs actual measurements
- Digital twin deviation analysis
- Stress/strain trending for structural assets

**Time Range:**
- Fiori: date range picker (from/to)
- Analytics Cloud: configurable periods, comparison periods
- No real-time streaming in classic PM (batch measurement documents)

**Threshold Visualization:**
- Measuring point limits (upper warning, upper limit, lower warning, lower limit) as colored horizontal zones
- Classic GUI: tabular only (no chart visualization in old IK transactions)
- Fiori: colored zones on line chart

**Cross-Asset:**
- Weak in classic PM. Must open each equipment separately.
- Better in Analytics Cloud with fleet-level stories
- SAP Predictive Asset Insights: fleet degradation curve comparison

**Mobile:**
- SAP Service and Asset Manager: record measurements in field
- No trend visualization on mobile; recording only
- Trend charts desktop-only

**Strengths:**
- Measuring point limits are rigorously defined with engineering precision
- SAP Analytics Cloud provides powerful BI-grade visualization when configured
- Predictive Engineering Insights (digital twin simulation) is unique

**Weaknesses:**
- Trend visualization in base PM is primitive (single-metric line charts)
- No real-time sensor streaming in standard PM
- Cross-asset comparison requires separate analytics tools
- Measuring points are discrete readings, not continuous data streams

---

## 3.3 GE Vernova APM (Standout for Ad-Hoc Analysis)

**Layout:**
- Analysis workspace: full-screen charting environment
- Left panel: tag browser (asset hierarchy > asset > tag list)
- Main area: chart canvas with multiple panels (stacked or overlaid)
- Top toolbar: time range, chart type, add card, add chart, layout, save template

**Chart Types Available:**
- Line chart (default for time series)
- Scatter plot (for correlation analysis between two tags)
- Bar chart (for aggregated/binned data)
- XY plot (for parametric comparison)
- Histogram (for value distribution)
- Polar plot (for rotating equipment phase analysis)

**Multi-Tag Overlay (GE's best feature in this category):**
- Drag tags from left panel onto chart canvas
- Multiple tags on single chart with independent Y-axes (dual-axis support)
- Up to 100 tags trackable per asset
- Stacked panel layout: each tag in its own chart panel, time-synced horizontally
- Overlaid layout: all tags on same chart with shared time axis
- Tag mute/unmute: temporarily hide tags without removing them
- Tag expressions: calculated tags (e.g., Tag_A - Tag_B, or Running Average)

**SmartSignal Integration:**
- SmartSignal cards addable alongside standard analysis charts
- Show: actual value, predicted (model) value, residual (actual - predicted)
- Residual plot highlights deviations from normal behavior
- Alert threshold on residual (not on absolute value)
- Distinct from threshold-based monitoring: detects subtle pattern changes

**Time Range Options:**
- Presets: 1h, 8h, 24h, 7d, 30d, 90d, 1y, custom
- Zoom: click-drag on chart to zoom into time window
- Pan: shift-drag or scroll
- Time context persists across all panels/cards on same page
- "Link Time Ranges" toggle: sync or unsync time ranges across cards

**Threshold Visualization:**
- Configurable alarm limits as colored horizontal bands on chart
- Multiple levels: warning (yellow zone), alarm (orange zone), danger (red zone)
- Threshold lines individually toggleable
- Dynamic thresholds from SmartSignal models (adaptive, not static)

**Save and Reuse:**
- Save Analysis View as template (reusable for similar assets)
- Templates can be linked to Alert Templates (auto-trigger alerts when conditions met)
- Share saved views with other users via Catalog

**Cross-Asset Comparison:**
- Add tags from different assets to same analysis view
- Fleet benchmarking: compare same parameter across multiple assets of same type
- Overlay historical periods for same asset (this month vs last month)

**Mobile:**
- Not available on mobile; desktop-only analysis environment
- Mobile Inspection app is separate (data collection only)

**Visual Description:**
- Dark-on-white chart canvas. Blue as primary data color, orange/red for alerts.
- Tag browser: hierarchical tree with checkbox selection
- Charts: clean line rendering, subtle grid, time axis at bottom
- SmartSignal residual: gray confidence band with colored deviation markers
- Toolbar: icon-based buttons for common actions (zoom, pan, threshold, export)

**Strengths:**
- Most powerful ad-hoc analysis tool in any APM product. Drag tags, overlay, compare, correlate.
- SmartSignal residual analysis (actual vs ML-predicted) is industry-leading for early fault detection
- Tag expression support enables calculated parameters without leaving the analysis view
- Fleet benchmarking (compare same tag across asset fleet) is invaluable for OEMs
- Save-as-template and link-to-alert creates reusable analysis patterns

**Weaknesses:**
- Desktop-only. No mobile or tablet access.
- Steep learning curve for full capability (tag expressions, SmartSignal configuration)
- Requires SmartSignal license (additional cost) for ML-based analysis
- Chart aesthetics are functional but not beautiful

**Unique Patterns:**
- Tag browser with drag-to-chart interaction. No other APM tool offers this level of ad-hoc sensor data exploration. This is the feature reliability engineers cite most when comparing GE APM to competitors.
- SmartSignal residual-based detection. Instead of "is the temperature above 400F?" (threshold), SmartSignal asks "is the temperature higher than it should be given the current load, ambient conditions, and operating mode?" This catches subtle degradation that threshold monitoring misses.

---

## 3.4 Bentley AssetWise

**Condition Trending:**
- Basic line charts for inspection-derived condition indicators
- Corrosion rate trends (wall thickness over time with fitted degradation curve)
- Limited to indicators collected during inspections, not real-time sensors
- Relies on integration with OSIsoft PI or similar historian for real-time data

**Unique to Bentley:**
- Thickness Monitoring Location (TML) visualization: 2D or 3D view of equipment with TML points color-coded by remaining life
- Corrosion rate extrapolation: fitted curve projecting when minimum thickness will be reached

**Strengths:**
- Corrosion-focused trending is best-in-class for static equipment (piping, vessels, tanks)
- 3D TML visualization with color-coded remaining life is unique
- Good for planned inspection data (not real-time, but inspection-cycle data)

**Weaknesses:**
- Not designed for real-time sensor streaming. No ad-hoc analysis.
- No multi-tag overlay or drag-and-drop chart interaction
- No ML-based anomaly detection
- Fundamentally an inspection/document management tool, not a condition monitoring tool

---

## 3.5 Honeywell Forge APM

**Layout:**
- Embedded in asset detail page (not a standalone analysis workspace)
- Contributing Factors view drives initial trend exploration
- Click contributing factor to open sensor trend chart
- Asset Comparison feature for side-by-side

**Chart Capabilities:**
- Time series line charts for sensor parameters
- Actual vs ML-predicted baseline (two lines, shaded deviation)
- Bollinger-style confidence bands around predicted values
- Multiple parameters on same chart or stacked panels

**Time Range:** 7d, 30d, 90d, 1y, custom

**Threshold Visualization:**
- Green/yellow/red health zones as background shading
- ML model confidence bands as gray shaded area
- Static thresholds as horizontal lines
- Dynamic thresholds from ML model (adapt to operating conditions)

**Cross-Asset (Asset Comparison):**
- Side-by-side parameter comparison for assets of same type
- "Worst first" ranking filters to assets deviating most from baseline
- Fleet monitoring: aggregate view across asset class
- Historical self-comparison (current behavior vs past baseline)

**Mobile:**
- No trend visualization on mobile
- Mobile shows health score and alerts only

**Strengths:**
- ML confidence bands give sense of prediction quality
- Contributing Factors as entry point to trends is intuitive (explore what matters most first)
- Dynamic thresholds adapt to operating conditions (better than static limits)

**Weaknesses:**
- Not a standalone analysis tool. Must start from asset detail page.
- No drag-and-drop tag exploration like GE APM
- Limited to assets with trained ML models
- Less flexible than GE for ad-hoc investigation

---

## 3.6 Emerson Plantweb Optics

**Condition Monitoring Approach:**
- Alert-driven, not exploration-driven. Trends appear in context of alerts.
- Sparklines in asset health list give quick visual trend
- Full trend chart in asset detail for diagnosed parameters
- "Expert Analysis" panel for multi-tag trending (accessible to reliability engineers)

**Chart Capabilities:**
- Basic line charts for instrument parameters
- NAMUR NE107 status history (categorical timeline: good > check > out of spec > failure)
- Plantweb Insight applications provide deeper analytics per asset type

**Cross-Asset:**
- Hierarchical roll-up: unit-level aggregation comparing instruments within a unit
- "Bad actor" analysis: identifies instruments generating excessive alerts (trend of alert frequency)

**Strengths:**
- Alert-driven trending is efficient for reactive maintenance (go to what needs attention)
- NAMUR status history provides clear categorical timeline
- Bad actor analysis unique to Emerson

**Weaknesses:**
- Limited ad-hoc exploration capability
- Instrument-focused only (transmitters, valves, analyzers)
- No ML-based trending or predictive overlay
- No fleet comparison for mechanical equipment

---

# 4. FAULT TREE / ROOT CAUSE ANALYSIS

## 4.1 IBM Maximo

**Access:**
- Standalone RCA module within Manage or accessible from Health/Predict context
- Initiated from failure event, significant work order, or asset context

**Logic Tree Interface:**
- Top-down tree diagram (mind-map style)
- Root node: Failure Event (at top)
- Branching: cause hypotheses connected by lines
- Node types: Failure Event, Cause, Hypothesis
- Node states: Proposed, Verified True, Verified Not True
- Nodes expandable/collapsible
- Click node to view detail panel (description, evidence, attachments)

**Workflow:**
1. Create RCA from failure event
2. Define team (team members, roles)
3. Build logic tree (add hypotheses, categorize by cause type)
4. Attach evidence (documents, photos, data)
5. Verify/disprove hypotheses (mark each as true/not true)
6. Confirmed root causes generate follow-up WOs or preventive actions

**Interactivity:**
- Drag to reposition nodes (manual layout)
- Right-click context menu on nodes: add child, change state, attach document
- Zoom and pan on tree canvas
- Export tree as image

**Visual Description:**
- Nodes as rounded rectangles with icons indicating type/state
- Color coding: green (verified true), red (verified not true), gray (unverified)
- Lines connecting parent to child nodes
- Clean, readable layout with auto-arrange option

**Strengths:**
- Solid visual tree builder integrated with Maximo's WO and asset data
- Verified causes automatically generate actionable follow-up items
- Good for structured, repeatable RCA processes

**Weaknesses:**
- Less sophisticated than GE's implementation (no Apollo methodology, no logic gates)
- No formal cause categorization (Physical/Human/Latent) built into the tree structure
- Limited reporting compared to GE's comprehensive analysis report
- No financial tracking on RCA outcomes

---

## 4.2 SAP PM

**Approach:**
- Classic SAP PM: NO visual fault tree. Uses structured code catalogs instead.
- Damage codes, cause codes, object part codes form a coded taxonomy
- FMEA in SAP Asset Strategy & Performance Management: tabular spreadsheet format

**Damage/Cause Code Structure:**
- Equipment failure recorded in Notification with: Object Part (what failed), Damage (how it failed), Cause (why it failed)
- Codes selected from pre-defined catalogs (hierarchical dropdown selection)
- Activity codes define corrective action taken
- Example: Object Part = Bearing, Damage = Overheated, Cause = Lubrication Failure, Activity = Replaced

**FMEA (Cloud Module):**
- Tabular format: Failure Mode > Effect > Cause > Current Controls > Detection Rating > Severity Rating > Occurrence Rating > RPN (Risk Priority Number)
- Spreadsheet-like grid interface
- Sort/filter by RPN to prioritize
- No graphical tree visualization

**Strengths:**
- Extremely structured. Coded catalogs enable statistical analysis of failure patterns across fleet.
- Integrates with maintenance planning: cause codes drive PM strategy refinement.
- FMEA with RPN scoring is rigorous and well-suited for regulatory environments.

**Weaknesses:**
- No visual tree. Engineers cannot see cause-and-effect relationships graphically.
- Code selection can be tedious (deep dropdown hierarchies)
- Not intuitive for investigation/exploration. Designed for documentation, not discovery.
- No team collaboration features in the RCA process

---

## 4.3 GE Vernova APM (Standout)

**Access:**
- Dedicated RCA module in left navigation (under Reliability pillar)
- Also accessible from asset detail or failure event context
- Standalone RCA workspace with full-featured visual interface

**Logic Tree Interface (PROACT Methodology):**

**Node Types:**
1. **Failure Event** (root node) -- describes the failure incident
2. **Failure Mode** (second level) -- possible causes connected to the failure event
3. **Hypothesis** (third+ levels) -- theoretical explanations for failure modes
4. **Logic Gate** -- Boolean AND/OR gates connecting multiple hypotheses

**Node States (Hypothesis nodes):**
- Hypothesis (default/unverified) -- gray icon
- Hypothesis True -- green checkmark
- Hypothesis Not True -- red X
- Cause - Physical -- blue wrench icon (equipment failure root cause)
- Cause - Human -- orange person icon (human error root cause)
- Cause - Latent/System -- purple gear icon (procedural/systemic root cause)

**Three Cause Categories (Apollo RCA methodology):**
- Physical Cause: equipment or material failure
- Human Cause: human error, training gap, procedural violation
- Latent/System Cause: organizational, management, or systemic failure

**Adding Nodes:**
1. Double-click Failure Event > Failure Mode tab > enter name > Add
2. Double-click Failure Mode > Hypothesis tab > enter name > Add
3. Continue adding hypotheses at any level
4. Logic Gates auto-inserted between sibling hypotheses (OR gate by default)

**Toolbar Controls:**
- Copy/Paste nodes within same tree
- Import from: existing RCA analyses, FMEA/RCM modules, ASM risk records
- Export tree as image file
- Auto Arrange toggle (automatic or manual node positioning)
- Show/Hide Logic Gates toggle
- Delete node (except Failure Event root)
- Full Screen mode

**Evidence and Documentation:**
- Double-click any node > Reference Documents tab > link documents
- Verification tab on hypotheses: record verification method, results, date
- Verification log tracks all hypothesis testing activities

**Logic Gates:**
- OR Gate: any single child hypothesis can independently cause the parent condition
- AND Gate: all child conditions must be simultaneously true
- Default: OR Gate between sibling hypotheses. User can change to AND.

**Visual Characteristics:**
- Hierarchical top-down layout (root at top, causes branching down)
- Nodes as labeled icons (distinct shapes/colors per type and state)
- Red highlighting on paths leading to confirmed root causes
- Connector lines between nodes (straight or angled)
- Canvas supports zoom, pan, drag-and-drop repositioning

**RCA Workflow (5 Stages -- PROACT):**
1. **Preserve** -- Capture failure event data, timeline, initial observations
2. **Order** -- Assemble team, assign roles (Principal Analyst, team members), set charter
3. **Analyze** -- Build logic tree, propose hypotheses, design and execute verifications
4. **Communicate** -- Generate comprehensive analysis report (23 sections, includes team, charter, critical success factors, event diagrams, verification logs, tracking summaries)
5. **Track** -- Create recommendations from verified root causes, monitor implementation, track financial outcomes

**Team Management:**
- Human Resource records for team members (name, facility, email, phone)
- Principal Analyst designation
- Team charter definition
- Meeting scheduling

**Recommendations from RCA:**
- Verified root causes generate "RCA Recommendations" with:
  - Description of recommended action
  - Target completion date
  - Assigned responsible person
  - Priority level
  - Implementation status (proposed, approved, in progress, completed, rejected)
  - Cause Type classification (Physical/Human/Latent)
- Recommendations promotable to work orders in connected CMMS

**Financial Tracking:**
- Tracking Item Summary: cost data for related equipment/functional locations
- Start dates and occurrence counts for RCA Tracking Items
- Track Results by Recommendation Implementation Year: yearly sum of maintenance costs and production costs from work history associated with implemented recommendations
- Cause Summary graph: count of hypotheses by cause type (Physical, Human, Latent)

**Comprehensive Analysis Report (23 sections):**
- Cover page, team members, charter, critical success factors, event narrative, mechanism description, event diagrams, 5 Whys analysis, logic trees, verification logs, recommendations, tracking summaries, acknowledgments
- SSRS (SQL Server Reporting Services) based, exportable to PDF

**Strengths:**
- Most sophisticated RCA tool in any APM product
- Three-category cause classification (Physical/Human/Latent) follows best practice (Apollo methodology)
- Logic gates enable complex conditional cause relationships
- Financial tracking closes the loop from analysis to business impact
- Import from FMEA/RCM enables reuse of existing analysis work
- Comprehensive report generation (23 sections) for regulatory and audit purposes

**Weaknesses:**
- Complexity: steep learning curve for full PROACT methodology
- Requires dedicated reliability engineering expertise
- Node editing via double-click datasheets (form-based, not inline editing)
- Visual design of tree is functional but aesthetically dated
- Desktop-only; no mobile RCA capability

**Unique Patterns:**
- PROACT methodology embedded in software. The 5-stage workflow is not just a process suggestion; it is enforced by the UI (stages are tracked, completion is monitored).
- Logic Gate visualization. GE is the only APM tool that supports AND/OR logic gates in the cause tree, enabling engineers to model complex multi-factor failures.
- Financial outcome tracking. Post-implementation: did the recommendation reduce costs? The Track stage closes the loop with actual financial data.

---

## 4.4 Bentley AssetWise

- No native fault tree or RCA module
- Manages engineering documentation (P&IDs, inspection records) that inform RCA conducted in other tools
- Third-party integration required (Isograph, ReliaSoft) for fault tree analysis
- Strategy analysis module supports RCM/FMEA but not visual RCA trees

---

## 4.5 Honeywell Forge APM

**Approach:**
- ML-driven diagnostics replace traditional fault tree
- No visual tree builder; instead, "Contributing Factors" view

**Contributing Factors Interface:**
- Ranked horizontal bar chart on asset detail page
- Each bar: parameter name, contribution percentage to anomaly
- Color: red gradient (most contributing = darkest red)
- Click any bar to see underlying sensor trend with ML baseline
- Updated automatically as ML model recalculates

**Prescriptive Maintenance Recommendations:**
- Auto-generated from ML models
- "Inspect [component] due to [parameter] deviation"
- Confidence level per recommendation
- Less structured than GE's formal RCA process

**Strengths:**
- Automated: no manual tree building required. ML does the investigation.
- Fast: results available immediately when anomaly detected
- Good for known failure patterns where ML has training data

**Weaknesses:**
- Cannot handle novel failure modes (ML needs historical examples)
- No team collaboration, no structured investigation workflow
- No logic gates, no hypothesis verification process
- "Black box" -- engineers cannot see the reasoning path, only the result
- Not suitable for regulatory-required formal RCA (OSHA, API)

---

## 4.6 Emerson Plantweb Optics

**Approach:**
- No fault tree. Workflow-driven "decision tree" for troubleshooting.
- Configured by SMEs (subject matter experts) as step-by-step diagnostic procedures

**Decision Tree Wizard:**
- Triggered from alert detail
- Step-by-step: "Is the output high?" > Yes/No > "Check calibration" > "Is zero correct?" > etc.
- Guides technician through structured troubleshooting without requiring analysis expertise
- Final step: recommended action (recalibrate, replace, escalate)

**Strengths:**
- Accessible to non-expert technicians (guided workflow, not analysis tool)
- Consistent troubleshooting process across team
- Captures SME knowledge in reusable decision trees

**Weaknesses:**
- Not an analysis tool. Cannot discover new causes.
- Decision trees must be pre-configured by SMEs (significant setup effort)
- Only useful for known, pre-mapped failure scenarios
- No financial tracking, no team management, no formal reporting

---

# 5. EVENTS / ALERTS / ALARMS

## 5.1 IBM Maximo

### Monitor -- Alerts Dashboard

**Layout:**
- Table-based alert list as primary view
- Top toolbar: search, severity filter (multi-select), status filter, asset filter, time range
- Main area: data table
- Right panel (optional): alert detail panel (expandable)

**Table Columns:**
- Severity (icon + color: Critical=red circle, High=orange triangle, Medium=yellow diamond, Low=blue info)
- Asset Name
- Alert Name/Description
- Timestamp (created)
- Duration (how long alert has been active)
- Status (Active, Acknowledged, Resolved)
- Assigned To
- Source (threshold/anomaly/ML model)

**Detail Panel (click row to expand):**
- Full alert description
- Sensor data at time of event (sparkline or snapshot values)
- Asset context (asset name, location, criticality, health score)
- Historical similar events (list of past alerts with same signature)
- Recommended actions (from ML model or pre-configured rules)
- Create WO button
- Initiate RCA button
- Acknowledge button
- Add Note button

**Filtering and Sorting:**
- Severity multi-select dropdown (Critical, High, Medium, Low)
- Status filter (Active, Acknowledged, Resolved, All)
- Asset filter (search or hierarchy selector)
- Time range (Last 1h, 4h, 8h, 24h, 7d, 30d, custom)
- Sort by any column header (default: severity desc, then timestamp desc)
- Saved filter views

**Acknowledgment Workflow:**
- Alert created automatically (threshold breach or anomaly detection)
- Status: Active > Acknowledged (user clicks Acknowledge) > Resolved (condition clears or user closes)
- Acknowledgment records: who, when, notes
- No formal escalation workflow in Monitor (escalation handled in Manage via Escalations module)

**Escalation:**
- Configured in Manage: Escalation records define time-based rules
- E.g., "If critical alert not acknowledged in 30 min, notify supervisor"
- Escalation actions: email, create WO, change priority, reassign

**Connection to Assets and WOs:**
- Alert linked to asset (click asset name to navigate to asset detail)
- "Create WO" button on alert detail creates linked Maintenance Order in Manage
- Alert history visible on asset's Monitor dashboard

**ML-Based Alert Management:**
- Anomaly scoring reduces false positives (only alert when anomaly score exceeds threshold)
- Alert suppression rules: time-based, condition-based, or model-confidence-based
- Alert grouping: multiple related alerts consolidated under parent alert per asset

**Mobile:**
- Alert list viewable in mobile browser
- Push notifications for critical alerts
- Acknowledge from mobile
- No detailed analysis or trend viewing on mobile

**Strengths:**
- ML-based anomaly scoring significantly reduces false positive alerts
- Alert suppression and grouping manage alert fatigue
- Direct path from alert to WO creation
- Historical similar events help engineers recognize patterns

**Weaknesses:**
- Basic acknowledgment workflow (no multi-step escalation in Monitor itself)
- Alert-to-RCA path requires navigating to separate module
- No "dollars at risk" or financial impact on alerts
- Alert list is table-only; no card-based or spatial view

---

## 5.2 SAP PM -- Notifications

**Layout (Fiori -- Screen Maintenance Requests F4072):**
- Filter bar at top: Notification Type, Priority, Status, Planning Plant, Date Range
- Main area: responsive table
- Row click opens Notification Object Page (detail view)

**Table Columns:**
- Notification Number
- Type (M1=Maintenance Request, M2=Malfunction Report, M3=Activity Report)
- Description
- Priority (1=Very High, 2=High, 3=Medium, 4=Low) with Fiori color coding
- Status (Outstanding, In Process, Completed)
- Equipment Number
- Functional Location
- Reported By
- Reported Date
- Required Start/End Date

**Notification Detail Page (Object Page):**
- Header: Number, Description, Status badge, Priority badge, Equipment link, Location
- Tabs:
  1. **General** -- Full description, long text, functional failure description
  2. **Items** -- Damage items: Object Part + Damage Code + Cause Code per item. Multiple items per notification.
  3. **Activities** -- Activities performed or to be performed. Activity text, responsible person, completion date.
  4. **Tasks** -- Individual tasks with responsible persons, dates, completion status
  5. **Partners** -- Responsible persons, coordinator, notified by
  6. **Documents** -- Linked attachments
  7. **Dates/History** -- Timeline of status changes, planned dates, actual dates
  8. **Related Orders** -- Linked maintenance orders created from this notification

**Acknowledgment Workflow:**
- Notification Status: Outstanding > In Process > Order Created > Completed
- No "Acknowledge" concept in SAP PM; instead, notification is "put in process" or an order is created from it
- Escalation: not built into notification. SAP Workflow can be configured for time-based escalation rules.

**Priority System:**
- Numeric 1-4 (Very High to Low)
- Fiori color: 1=Red, 2=Orange, 3=Yellow, 4=None (or green)
- Priority drives response time requirements (configurable per organization)

**Connection to Assets and WOs:**
- Notification linked to Equipment and Functional Location (click to navigate)
- "Create Order" button on notification creates linked Maintenance Order
- Notification becomes reference document on the Order
- Core workflow: Notification > Order > Confirmation > Technical Completion

**Mobile (SAP Service and Asset Manager):**
- Create notification from field (scan equipment barcode, describe issue, select priority)
- View assigned notifications
- Attach photos to notification
- Update status from field

**Strengths:**
- Structured damage/cause/action coding enables fleet-wide failure pattern analysis
- Notification > Order > Confirmation workflow is rigorous and complete
- Catalog-driven: consistent data quality across organization
- Deep integration with procurement (parts), finance (costs), and HR (labor)

**Weaknesses:**
- Not designed for real-time alarm management. Notification is a manual/batch record.
- No streaming alerts from sensors. Must be manually created or via interface.
- Priority is simple (1-4); no severity/impact matrix
- No ML-based alert management, no anomaly scoring
- Dense, form-heavy interface

---

## 5.3 GE Vernova APM

**Layout:**
- Alerts page accessible from module navigation
- Top toolbar: search, severity filter, state filter, source filter, asset filter, time range
- Main area: data table (primary) or card view (configurable)

**Table Columns:**
- Alert Name
- Asset Name
- Severity (Information, Warning, Alarm, Danger) with colored indicators
- State (Active, Acknowledged, Shelved, Cleared)
- Source (Policy Engine / Threshold / SmartSignal / Manual)
- Triggered Timestamp
- Duration
- Current Value vs Threshold Value

**Detail View (click row):**
- Full alert description and trigger conditions
- Current parameter values vs threshold values (numeric comparison)
- Duration of alert condition
- Related/cascade alerts (other alerts triggered by same root condition)
- Recommended actions (from policy engine or manual configuration)
- Alert history (past occurrences of same alert)
- Create Recommendation button
- Acknowledge button
- Shelve button (with reason and duration)

**Alert States and Transitions:**
- **Active** -- condition is occurring, not yet acknowledged
- **Acknowledged** -- user has seen and accepted the alert, condition still occurring
- **Shelved** -- temporarily suppressed (with reason and expiry time). Auto-returns to Active when shelf expires or condition recurs.
- **Cleared** -- condition no longer occurring. Auto-cleared when values return to normal.

**Severity Levels:**
- Information (blue) -- informational, no action required
- Warning (yellow) -- approaching limit, monitor closely
- Alarm (orange) -- limit exceeded, action needed
- Danger (red) -- critical condition, immediate action required

**Policy Engine (Alert Logic):**
- Sophisticated rule engine for defining alert conditions
- Persistence windows: condition must persist for X minutes before alert fires (reduces transients)
- Multi-condition requirements: Alert fires only when BOTH temperature > 400 AND vibration > 2.5
- Deadband: condition must clear by Y amount before alert resets (prevents chattering)
- Alert rationalization: review and optimize alert configurations for alarm management best practices

**Shelving Feature:**
- Temporarily suppress nuisance alerts during maintenance, startup, or known conditions
- Requires reason text and expiry time
- Audit trail of all shelving actions
- Auto-unshelve after expiry

**Filtering and Sorting:**
- Severity multi-select
- State filter (Active, Acknowledged, Shelved, Cleared)
- Source filter (Policy/Threshold/SmartSignal/Manual)
- Asset filter (search or hierarchy)
- Time range
- Sort by severity, timestamp, duration, asset

**Connection to Assets and WOs:**
- Alert linked to asset (click to navigate to asset detail)
- "Create Recommendation" from alert (recommendation routes to CMMS as WO)
- Alert history visible on asset health detail page

**Mobile:**
- GE APM mobile (Inspection Management app) does not include alert management
- Alerts are desktop-only
- No push notifications to mobile documented

**Strengths:**
- Policy engine is the most sophisticated alert logic system in APM. Persistence windows, multi-condition, deadband.
- Shelving feature for suppressing known/accepted alerts during maintenance
- Four-state model (Active/Acknowledged/Shelved/Cleared) is more nuanced than two-state (Active/Resolved)
- Alert rationalization tools support ISA-18.2 alarm management best practices

**Weaknesses:**
- No financial impact or "dollars at risk" on alerts
- Desktop-only (no mobile alert management)
- Policy engine configuration requires technical expertise
- No persona-based alert filtering (all users see all alerts, filtered manually)
- No card-based alert view out of box

---

## 5.4 Bentley AssetWise

- Inspection-based events only. Not designed for real-time alert management.
- Inspection findings serve as "events" but are created manually during inspections.
- Health monitoring can generate threshold-based alerts but this is limited.
- No dedicated alert management interface comparable to other tools.
- Alert management is a gap in Bentley's offering.

---

## 5.5 Honeywell Forge APM

**Layout:**
- Events Dashboard accessible from left nav
- Top bar: filters for severity, status, unit, equipment type
- Main area: card-based list (not table) sorted by severity then recency
- Right panel: event detail (expandable)

**Card Structure (Each Event Card):**
- Left border: severity color (red/orange/yellow/blue)
- Asset name and unit
- Event type (ML anomaly / threshold breach / manual)
- Severity label (Critical / High / Medium / Low)
- Timestamp
- Health score impact (arrow showing how much health dropped)
- **"Dollars at Risk"** value (estimated financial impact of the condition)
- Brief description

**Detail Panel (click card to expand):**
- Full event description
- Contributing sensor trends (small multiples of key parameters at time of event)
- ML model explanation: which parameters deviated and by how much
- Similar past events (list with outcomes)
- Recommended actions (ML-generated with confidence)
- Fault tree navigation (cause-and-effect from event to contributing factors)
- Create WO button
- Acknowledge button

**Acknowledgment Workflow:**
- Event Status: Open > Acknowledged > In Progress > Resolved
- Acknowledge records who and when
- Events auto-created by ML model or threshold. Cannot be manually created in Events dashboard.

**Connection to Assets and WOs:**
- Click asset name to navigate to asset detail
- "Create WO" opens work order form pre-populated with event context
- Events visible on asset detail Event History section

**"Dollars at Risk" (Unique Feature):**
- Displayed alongside severity on every event card
- Calculated from: asset criticality, production impact, predicted repair cost, downtime cost
- Enables financial prioritization: a Medium severity event on a high-value asset may have higher dollars at risk than a Critical event on a low-value asset
- Speaks management language (dollars, not severity codes)

**Mobile:**
- Event list on CT30X/CT60 mobile devices
- Simplified card view (severity, asset, timestamp, status)
- Acknowledge from mobile
- View linked WO status
- No trend charts or ML explanation on mobile

**Strengths:**
- Card-based layout is more scannable than dense tables
- "Dollars at risk" brings financial context to every event
- ML model explanation shows WHY the alert was generated
- Similar past events with outcomes helps engineers predict resolution path

**Weaknesses:**
- No manual event creation from dashboard
- No alert policy configuration (ML models are configured separately, not in events UI)
- No shelving or suppression feature
- ML-only events mean: if the model is not trained for a failure mode, no event is generated
- Card-based list does not scale well for hundreds of events (no pagination/virtual scroll documented)

---

## 5.6 Emerson Plantweb Optics

**Layout:**
- Alert/Message Center accessible from top navigation
- Persona filter applied globally (operator sees different alerts than maintenance or reliability)
- Main area: card-based alert list
- Filter bar: location, asset class, severity, read/unread, responsibility

**Card Structure (Each Alert Card -- "Action Card" Format):**
- NAMUR NE107 status icon (red X / orange triangle / yellow diamond / blue wrench)
- Asset name and tag number
- Location (area > unit)
- **"What happened"** -- description of the condition
- **"Why it matters"** -- impact assessment
- **"What to do"** -- recommended corrective action
- Supporting data link (click to see diagnostic details)
- Timestamp
- Read/Unread indicator
- Priority badge

**NAMUR NE107 Status Icons:**
- Failure (red X): device is in failure mode, output unreliable
- Check Function (orange triangle): device needs checking, output temporarily non-valid
- Out of Specification (yellow diamond): device operates outside specified conditions
- Maintenance Required (blue wrench): device needs maintenance but still operating
- Good (green checkmark): normal operation

**Persona-Based Filtering:**
- **Operator persona:** Sees device failures and out-of-spec conditions. Focus on "does this affect my process?"
- **Maintenance persona:** Sees maintenance required and check function alerts. Focus on "what do I need to fix?"
- **Reliability persona:** Sees all alerts plus analytics deviations and bad actor reports. Focus on "what patterns indicate systemic problems?"
- **Manager persona:** Sees summary KPIs (alert counts, response times, compliance rates). Focus on "how is my team performing?"

**Acknowledgment Workflow:**
- Alert: New > Read > Work Notification Created > Resolved
- Mark as Read (tracks who/when)
- Create Work Notification (bridges to CMMS -- not a native WO)
- No formal escalation within Optics; escalation in connected CMMS

**Bad Actor Analysis:**
- Identifies instruments generating excessive alerts
- Trend chart of alert frequency per asset
- Flags devices that may need replacement rather than repeated repair
- Unique to Emerson among APM tools

**Connection to Assets and WOs:**
- Click asset name to navigate to asset detail
- "Create Work Notification" bridges alert to CMMS work order
- Alert history visible on asset detail Messages section

**Mobile (AMS Optics):**
- Alert list on mobile (card-based, same as web but simplified)
- Push notifications for new alerts matching persona
- Mark as read from mobile
- AR mode: point camera at device to see its alerts and status overlay
- Create work notification from mobile

**Strengths:**
- NAMUR NE107 compliance: operators already know these status icons from field devices. Zero learning curve.
- "What happened / Why it matters / What to do" format is the most user-friendly alert presentation in any APM tool
- Persona-based filtering eliminates alert fatigue by showing only role-relevant alerts
- Bad actor analysis identifies systemic problems, not just individual events
- AR-integrated field alert management (unique)

**Weaknesses:**
- Limited to instrumentation alerts (not rotating equipment, not structural)
- No ML-based anomaly scoring
- No alert policy engine or alarm rationalization tools
- No shelving or suppression features
- Simple alert lifecycle (no multi-step acknowledgment/escalation)
- Not a real-time alarm management system (latency from data collection through Insight apps)

---

# 6. WORK ORDERS

## 6.1 IBM Maximo (Industry Standard)

### Work Order List View

**Layout:**
- Left nav: Work Orders module in Go To menu
- Top toolbar: search, saved queries dropdown, filter, column configuration
- Main area: data table (full width)

**Table Columns (default):**
- WO Number
- Description
- Status (badge: WAPPR/APPR/INPRG/COMP/CLOSE/CAN)
- Priority (1-5 numeric, no color coding in standard)
- Asset Number (linked)
- Location (linked)
- Reported Date
- Target Start Date
- Target Finish Date
- Assigned To (lead craft/person)
- Work Type (PM/CM/EM)

**Filtering and Sorting:**
- Saved queries (reusable named filters): "My Open WOs," "Overdue WOs," "Emergency WOs"
- Advanced search: any field combination with operators (=, like, >, <, between)
- Column header sort (asc/desc)
- Quick filter: type in column header area to filter

### Work Order Detail Page

**Layout:**
- Header: WO Number, Description, Status, Priority, Asset (linked), Location (linked)
- Horizontal tab bar below header
- Full-width tab content

**Tabs:**
1. **General** -- Description, long description, work type, failure class, reported by/date, target start/end, actual start/end, owner, crew
2. **Plans** -- 
   - Labor: planned labor by craft, hours, rate
   - Materials: parts list with item number, description, quantity, storeroom, reservation status
   - Tools: required tools list
   - Services: external service requirements
   - Estimated costs summary
3. **Actuals** -- 
   - Labor reported: person, hours, date, start/end time
   - Materials used: actual items and quantities
   - Tools used
   - Services received
   - Actual costs vs planned costs
4. **Related Records** -- Parent WO, child WOs (task WOs), follow-up WOs, related SRs, related incidents
5. **Failure Reporting** -- Failure Class > Problem > Cause > Remedy (code selection from hierarchical catalogs)
6. **Safety** -- Hazards, precautions, lock-out/tag-out procedures, required permits
7. **Attachments** -- Documents, photos, drawings, SOPs linked to the WO
8. **Log** -- Communication log entries (timestamped notes from all involved parties)

**Status Lifecycle:**
WAPPR (Waiting Approval) > APPR (Approved) > INPRG (In Progress) > COMP (Complete) > CLOSE (Closed)
Alternative paths: WAPPR > CAN (Cancelled), APPR > WMATL (Waiting Material), INPRG > WSCH (Waiting Schedule)

**Planning/Scheduling:**
- Maximo Scheduler add-on: drag-and-drop Gantt chart
- Resource availability view: labor/craft availability by day
- Auto-scheduling: algorithm assigns WOs to available resources based on priority, craft, and location
- Constraint-based scheduling: honors dependencies between parent and child WOs

**Priority Display:**
- Numeric 1-5 in standard Maximo
- Customizable priority descriptions
- Calculated priority available: asset criticality x failure impact = recommended priority
- No color coding in standard (can be configured)

**Connection to Assets and Events:**
- Asset field links to asset detail (click to navigate)
- Originating alert/event referenced in Related Records
- Failure reporting codes linked to asset failure history

**Mobile (Maximo Mobile):**
- Work order list: assigned WOs sorted by priority/due date
- WO detail: simplified single-page scroll (description, asset, location, plans, tasks)
- Offline capable: download assigned WOs before entering field, sync completions later
- Task completion: checkbox-based task list
- Material reporting: scan barcode to log parts used
- Labor reporting: start/stop timer or manual hour entry
- Photo capture and attach to WO
- Inspection forms accessible from WO context
- GPS location recording
- Follow-up WO creation from field

**Visual Description:**
- Light theme (Carbon design)
- Status badges: colored text on light background (blue=APPR, green=INPRG, gray=COMP)
- Plans tab: nested tables for labor, materials, tools
- Gantt (Scheduler): horizontal timeline bars, blue=scheduled, green=in progress, red=overdue
- Mobile: clean card-based list, large touch targets, swipe gestures for common actions

**Strengths:**
- Most complete work order model in the market. Full lifecycle from request to close.
- Plans tab with labor, materials, tools, services is unmatched for planning depth
- Failure reporting (Problem > Cause > Remedy codes) enables fleet-wide failure analysis
- Parent/child WO hierarchy for complex multi-task jobs
- Maximo Mobile is the best-in-class field WO execution app
- Saved queries as "smart inboxes" for task management

**Weaknesses:**
- Configuration complexity. Out-of-box WO screen has 50+ fields; requires customization to simplify.
- Status lifecycle can be over-engineered (some orgs have 10+ statuses)
- No predictive scheduling (doesn't consider asset degradation curves for optimal timing)
- Desktop UI feels dated compared to modern SaaS apps

---

## 6.2 SAP PM

### Maintenance Order List (Fiori -- Manage Maintenance Orders)

**Table Columns:**
- Order Number
- Type (PM01=Maintenance, PM02=Corrective, PM03=Emergency, PM04=Refurbishment)
- Description
- Status (System Status: CRTD/REL/PCNF/CNF/TECO/CLSD + User Status)
- Priority (1-4, color-coded)
- Equipment Number
- Functional Location
- Planning Plant
- Work Center
- Basic Start/Finish Date
- Scheduled Start/Finish Date

**Order Detail Page (Fiori Object Page):**
- Header: Order Number, Description, Type, System Status, User Status, Priority, Equipment, Location
- Tabs:
  1. **Operations** -- Task list: Operation number, description, work center, duration, labor requirements
  2. **Components** -- Material list: item number, description, quantity, reservation number, availability check
  3. **Costs** -- Planned costs (labor, material, external), actual costs, variance
  4. **Dates** -- Basic dates, scheduled dates, actual dates, scheduling parameters
  5. **Settlement** -- Cost settlement rules (which cost center/asset receives the cost)
  6. **Confirmations** -- Labor confirmations: person, hours, start/end time, operation
  7. **Documents** -- Attachments, linked documents
  8. **Long Text** -- Detailed work instructions
  9. **Partners** -- Persons responsible, coordinator, planner group

**Status Lifecycle:**
CRTD (Created) > REL (Released) > PCNF (Partially Confirmed) > CNF (Confirmed) > TECO (Technically Complete) > CLSD (Closed)
Alternative: CRTD > REL > DLFL (Deletion Flag)

**Planning/Scheduling (Maintenance Scheduling Board):**
- Gantt chart view with three sections: table (order/operation list), graphic (timeline bars), side panel (details)
- Drag-and-drop operations on timeline
- Color coding: by priority, by status, by work center
- Capacity utilization bars showing work center loading
- Filter by work center, priority, date range, order type
- Dispatch: assign specific person/date to operation

**Priority Display:**
- 1=Very High (red), 2=High (orange), 3=Medium (yellow), 4=Low (no color)
- Priority drives scheduling priority in MRS (Maintenance Resource Scheduling)

**Mobile (SAP Service and Asset Manager):**
- Receive assigned orders on mobile
- View operation details, material list, work instructions
- Record time confirmations
- Report material consumption
- Record measurements (measuring point readings)
- Complete operations and orders
- Scan barcode for equipment identification
- Attach photos
- Offline capable with sync

**Strengths:**
- Integration with procurement: material availability check, automatic purchase requisition for missing parts
- Integration with finance: settlement rules, cost accounting, budget monitoring
- Operations-level planning (not just WO-level): each operation has work center, duration, labor requirements
- MRS Gantt is powerful for capacity planning across work centers
- Most rigorous cost tracking in the market

**Weaknesses:**
- Extremely complex. Many fields, many statuses, many tabs.
- SAP-specific terminology (TECO, settlement, controlling) requires SAP training
- Dual UI: some features only in SAP GUI, some only in Fiori
- User interface is dense and not intuitive for casual users
- No predictive maintenance integration in base PM (requires cloud add-ons)

---

## 6.3 GE Vernova APM

- **No native work order management.** GE APM generates "Recommendations" that push to external CMMS (Maximo, SAP, etc.)
- Recommendation fields: Description, Priority, Target Date, Assigned To, Status, Source Module, Linked Asset, Linked Analysis
- Recommendation statuses: Proposed > Approved > In Progress > Completed > Rejected
- Recommendation tracking dashboard shows open/closed counts by module and priority
- GE APM is "the brains" (analytics/recommendations); CMMS is "the hands" (execution)

---

## 6.4 Honeywell Forge APM

- "Recommendations" list rather than full WOs
- Recommendation includes: asset, action, urgency, predicted failure date, cost/benefit estimate
- "Maintenance window optimization": suggests timing based on degradation curves and production schedules
- Mobile: monitor event and WO progress from CT30X/CT60, access task lists and SOPs
- Execution in connected CMMS (not native)

---

## 6.5 Emerson Plantweb Optics / Bentley AssetWise

- Not CMMS tools. Route alerts/recommendations to responsible parties.
- "Work Notification" concept in Emerson bridges to CMMS.
- Bentley "Work Request" pushed to connected EAM.
- WO execution happens entirely in the connected CMMS (Maximo, SAP, etc.)
- Optics tracks work notification status (open/in progress/completed) pulled from CMMS integration.

---

# 7. INSPECTIONS

## 7.1 IBM Maximo

### Inspection Forms and Scheduling

**Scheduling:**
- Driven by Preventive Maintenance (PM) records
- PM defines: cycle (time, meter, or condition-based), asset/location, job plan, lead time
- PM generates WO with inspection form attached when due
- Calendar view shows upcoming inspections on Gantt or list

**Inspection Form Builder:**
- Configurable questionnaire-style forms
- Question types: text input, numeric (with min/max validation), date, checkbox, dropdown/picklist, signature, barcode scan
- Conditional logic: show/hide questions based on previous answers (e.g., "If condition is Poor, show additional questions")
- Sections and grouping for organizing questions
- Mandatory vs optional questions
- Photo/attachment per question (not just per form)
- Multiple forms per inspection type

**Form Data Capture:**
- Each question captures: response value, timestamp, inspector, location (GPS), notes
- Numeric responses validated against configured limits (pass/fail/warning)
- Pass/fail status per question and per section

**Connection to Health Scoring:**
- Inspection readings directly feed Maximo Health scoring models
- Poor inspection results decrease asset health score
- Inspection-derived condition indicators weighted in health formula
- Feedback loop: inspect > score degrades > trigger attention/PM > re-inspect

**Connection to Condition Monitoring:**
- Meter readings collected during inspection update asset meter history
- Condition monitoring points read during inspection route
- Values feed into Monitor dashboards and Health calculations

**RBI Methodology:**
- Not native in base Maximo (GE APM is the RBI leader)
- Third-party RBI add-ons available
- Risk-based scheduling possible through custom PM frequency rules

**Mobile (Maximo Mobile -- Inspections):**
- Full inspection execution on iOS/Android
- Route-based: download assigned inspection route, navigate asset-by-asset
- Form rendering: clean mobile-optimized layout, large touch targets
- Photo capture inline with questions
- Barcode/QR scan for asset identification
- GPS coordinates recorded per inspection
- Offline capable: download forms and routes before field work, sync on return
- Batch inspections: same form for multiple assets on a route
- Signature capture for formal sign-off

**Visual Description:**
- Mobile: clean white card-based forms, one question per card or section groups
- Desktop: form rendered in WO context, tabular layout
- Status indicators: green check (pass), red X (fail), yellow warning (approaching limit)

**Strengths:**
- Most configurable inspection form builder in the market
- Conditional logic enables smart forms that adapt to conditions found
- Direct integration with health scoring closes the inspect-to-score feedback loop
- Best-in-class mobile inspection execution
- Offline capable with full form fidelity

**Weaknesses:**
- No native RBI methodology (must add on)
- Form builder requires admin/config expertise
- No NDE-specific templates (ultrasonic, radiography, etc.) out of box
- Complex PM setup for inspection scheduling

---

## 7.2 SAP PM

### Inspection Approach

**Scheduling:**
- Maintenance Plans drive scheduling (time-based, counter-based, multiple-counter, condition-based)
- Maintenance Plan > Maintenance Item > Maintenance Call > Maintenance Order with Task List
- IP10 transaction: schedule maintenance plans and generate call objects
- IP30: deadline monitoring (preview upcoming inspections)

**Task Lists (Inspection Checklists):**
- Structured operation lists with measurement points
- Each operation: description, work center, time estimate, measurement point readings required
- Measurement points: characteristic (what to measure), unit, upper/lower limits, target value
- Measurement documents: recorded readings against measurement points

**Field Data Capture:**
- Measurement reading with validation against configured limits
- Deviation triggers notification (automatic or manual)
- Measurement document created per reading with timestamp, person, value
- Structured but rigid: less flexible than Maximo for freeform text/checkbox forms

**Connection to Condition Monitoring:**
- Measurement documents feed trend analysis (IK17: display measurement documents)
- Deviation from limits can auto-create Notification
- Measuring point history viewable as table or simple chart

**Connection to Health Scoring:**
- Not native in SAP PM. Measuring points track values but do not compute health scores.
- SAP Predictive Asset Insights (cloud) can consume measurement data for scoring.

**RBI Methodology:**
- SAP Asset Strategy & Performance Management supports RCM/FMEA methodology
- Risk-based inspection scheduling possible through strategy optimization
- Not as specialized as GE APM's dedicated RBI module (API 580/581)

**Mobile (SAP Service and Asset Manager):**
- Inspection rounds with measurement point data capture
- Equipment barcode/NFC scan
- Record readings with limit validation
- General digital forms (surveys and inspections) -- newer feature
- Offline with sync
- Field Operation Work Extension Component for complex inspection routes

**Strengths:**
- Measurement point system is engineering-rigorous (characteristic, unit, limits, decimal places all configured)
- Integration with full maintenance lifecycle: inspection > notification > order > procurement > finance
- Counter-based scheduling (e.g., every 5000 running hours) integrated with equipment counters
- Multiple maintenance strategies (time, counter, condition, performance) in single framework

**Weaknesses:**
- Rigid form structure. Cannot easily add ad-hoc questions or conditional logic.
- No photo-per-question capability in standard (must attach to order level)
- Form design requires deep SAP configuration knowledge
- No dedicated inspection analytics or compliance dashboard in base PM

---

## 7.3 GE Vernova APM (Standout for RBI)

### Risk-Based Inspection (RBI -- Industry Leader)

**RBI Methodology:**
- Full API 580/581 compliant RBI analysis
- Calculates optimal inspection intervals from risk: Probability of Failure x Consequence of Failure
- Damage Factor calculations for each applicable degradation mechanism
- Components represent subdivisions of equipment (cylindrical shell, exchanger bundle/header/tube, piping, pump casing, tank bottom, PRD)

**RBI Workflow:**
1. Define Asset > Assign to Corrosion Loop
2. Create RBI Component (inherits Potential Degradation Mechanisms from Corrosion Loop)
3. Calculate Damage Factors per degradation mechanism
4. Assess Consequence of Failure
5. Calculate Risk (probability x consequence) > plot on Risk Matrix (5x5)
6. Determine Inspection Plan (type, scope, interval) based on risk level
7. Execute Inspection > Record Findings > Update Risk > Recalculate
8. Feedback loop: inspect > update corrosion rate > recalculate risk > adjust next inspection interval

**Risk Matrix:**
- 5x5 grid: Probability (rows, 1-5) x Consequence (columns, A-E)
- Color coding: green (low risk), yellow (medium), orange (medium-high), red (high)
- Assets/components plotted as dots on matrix
- Click cell to see list of assets in that risk category
- Matrix updates dynamically as inspections update damage factors

**RBI Component Types:**
- Cylindrical Shell
- Exchanger Bundle, Header, and Tube
- Piping
- Pump Compressor Casing
- Tank Bottom
- PRD (Pressure Relief Device): Relief Valves and Rupture Disks

**Degradation Mechanism Management:**
- Components inherit applicable PDMs (Potential Degradation Mechanisms) from Corrosion Loop
- PDMs from API 571 (damage mechanisms for the refining industry)
- Manual override: add/remove PDMs per component
- Screening criteria automate PDM assignment based on material, environment, operating conditions

**Thickness Monitoring Integration:**
- TML (Thickness Monitoring Location) Groups linked to RBI Components
- Corrosion rate data from thickness measurements feeds damage factor calculations
- Remaining life calculation: (current thickness - minimum required thickness) / corrosion rate
- TML visualization: 2D drawing with mapped TML points, color-coded by remaining life
- 3D visualization through Visionaize partnership: TMLs and CMLs (Corrosion Monitoring Locations) mapped on 3D model

### Inspection Management (Non-RBI)

**Inspection Plans:**
- Define: asset, inspection type (General, Checklist, Bundle, PRD), interval, scope, NDE methods
- Task scheduling: next date, last date, interval, deferral tracking

**Inspection Events:**
- Two types: Full Inspection Events (General Findings) and Checklist Events (Checklist Findings)
- General Findings: free-form narrative, condition assessment, photos
- Checklist Findings: structured pass/fail against predefined criteria

**Inspection Tasks:**
- Columns in task grid: Task ID, Asset, Type, Next Date, Last Date, Interval, Status (Active/Completed/Rejected)
- Organized within Work Packs for budgeting and prioritization
- Generate Inspection from Work Pack (batch creation)
- Deferral workflow: inspector requests deferral > supervisor approves/rejects > dates updated

**Findings and Recommendations:**
- Findings recorded per inspection event
- Recommendations generated from findings: description, priority, target date, responsible person, status
- Recommendations link back to the originating inspection and forward to corrective actions
- Recommendation statuses: Proposed > Approved > In Progress > Completed > Rejected

**NDE Templates:**
- Ultrasonic thickness measurement templates
- Radiography inspection templates
- Visual inspection templates
- Magnetic particle inspection templates
- Liquid penetrant inspection templates

**Mobile (Inspection Management Mobile App):**
- Download inspection tasks for field execution
- Offline data collection
- Record findings (general and checklist)
- Thickness readings capture
- Photo capture
- Sync back to APM when online
- Simplified UI for field inspectors

**Strengths:**
- RBI is the gold standard. API 580/581 compliance is unmatched.
- Feedback loop (inspect > update risk > recalculate > adjust interval) is fully automated
- Thickness monitoring with remaining life calculation and 2D/3D visualization
- NDE-specific templates for specialized inspection methods
- Recommendation tracking from inspection finding through to corrective action completion
- Deferral workflow with audit trail for regulatory compliance

**Weaknesses:**
- Complex setup. Requires corrosion engineering expertise to configure.
- RBI module is expensive (separate license from base APM)
- Inspection forms less flexible than Maximo (structured checklists, not configurable questionnaires)
- Mobile app is functional but basic compared to Maximo Mobile
- Heavy focus on static equipment; less suited for rotating/electrical equipment inspections

---

## 7.4 Bentley AssetWise

### Infrastructure Inspection Focus

**Scheduling:**
- Route-based: ordered list of assets with defined inspection frequency
- Time-based scheduling with configurable intervals per asset type
- Calendar view of upcoming inspections

**Checksheets:**
- Structured forms with condition indicators (readings)
- Indicator types: numeric, pass/fail, condition rating (1-5 or custom scale)
- Bridge condition index, pipeline grade, structure condition rating
- Condition indicators linked to health scoring

**Field Data Capture (AssetWise Inspections Mobile):**
- Download routes and checksheets to tablet/mobile
- Record indicator readings with pass/fail against thresholds
- Photo capture and image annotation (draw on photos to highlight issues)
- Condition rating selection
- Text notes per indicator
- GPS coordinates
- Offline with sync

**Connection to Health Scoring:**
- Indicator readings directly update asset health scores
- Weighted scoring: critical indicators have higher impact on overall health
- Trend analysis: indicator values over multiple inspection cycles

**Connection to Digital Twin:**
- Inspection data linked to 3D model locations
- Visualize inspection results on 3D model (color-coded by condition rating)
- Navigate from 3D model point to inspection history

**Strengths:**
- Best for infrastructure assets (bridges, pipelines, buildings, rail)
- Image annotation is powerful for documenting visual defects
- Condition indices (bridge condition index, etc.) are industry-standard for infrastructure
- Digital twin integration: see inspection results on 3D model

**Weaknesses:**
- Not designed for process equipment inspection (no RBI, no NDE templates)
- Limited to inspection-cycle data (not real-time monitoring)
- Checksheet format is less flexible than Maximo's configurable forms
- No conditional logic in checksheets

---

## 7.5 Honeywell Forge APM

**Scheduling:**
- ML-driven inspection scheduling based on predicted degradation
- Not fixed intervals; model predicts when inspection is needed based on health trajectory
- "Maintenance window optimization" includes inspection timing

**Forms:**
- Digital forms with photo capture
- Structured checklists (less configurable than Maximo)
- Pass/fail criteria with threshold values

**Connection to Health Scoring:**
- Inspection results feed health scoring alongside sensor data
- ML model retrains on new inspection data
- Hybrid scoring: ML-driven (sensor) + inspection-derived (manual readings)

**Mobile:**
- Digital form execution on CT30X/CT60
- Photo capture
- Basic offline capability

**Strengths:**
- ML-driven scheduling is innovative (inspect when predicted degradation warrants it, not on fixed schedule)
- Hybrid scoring (ML + inspection) provides more complete health picture

**Weaknesses:**
- Inspection module is less mature than Maximo, SAP, or GE APM
- No RBI methodology
- Limited form configurability
- No NDE templates
- ML scheduling requires trained model (not available for new/unknown asset types)

---

## 7.6 Emerson Plantweb Optics

**Inspection Approach:**
- Operator rounds with simple checklists
- Instrument-focused: calibration checks, device health checks, round readings
- Not designed for mechanical equipment inspection

**Round Data Capture:**
- Pass/fail per instrument
- Reading value vs expected range
- Quick notes
- Route-based: walk assigned route, check each instrument

**Connection to Health:**
- Round readings feed asset health indicators
- Out-of-range readings generate alerts
- Historical round data available in asset detail

**Mobile:**
- Mobile-first design for quick checks during plant walk-throughs
- AMS Optics app: scan QR code on instrument, see health, record reading
- AR overlay during rounds

**Strengths:**
- Fastest "round" experience for instrument checks
- AR integration for field context
- Mobile-first design

**Weaknesses:**
- Instrument-only (not pumps, compressors, vessels)
- No complex inspection forms
- No RBI or NDE methodology
- No inspection scheduling or compliance tracking

---

# 8. PERFORMANCE / ANALYTICS

## 8.1 IBM Maximo

**Metrics Available:**
- Health Score (0-100, per asset and fleet aggregate)
- Remaining Useful Life (RUL, days/months)
- Probability of Failure (%, per failure mode)
- MTBF (Mean Time Between Failures)
- MTTR (Mean Time to Repair)
- Effective Age vs Actual Age
- Maintenance Cost (per asset, per asset class, plant-wide)

**OEE:**
- Not native to Maximo (maintenance-centric, not production-centric)
- OEE can be computed in Monitor using custom calculations if production data is available
- No out-of-box OEE dashboard

**Fleet vs Asset Views:**
- Fleet: Health asset grid with all assets, sortable/filterable by scores
- Fleet: Charts view with health distribution, failure rate by manufacturer, MTBF
- Fleet: Matrix view (criticality vs health scatter plot)
- Asset: Individual asset dashboard with scores, predictions, timeline, history

**Benchmarking:**
- Peer comparison within asset class (same-type assets compared by health score)
- Percentile ranking: "This asset is in the bottom 10% of health scores for its class"
- No cross-company/cross-site anonymized benchmarking

**Reporting:**
- KPI Manager: define, track, and visualize KPIs over time
- BIRT Report Administration: configurable reports (tabular, chart)
- Export to CSV, PDF
- Operational Dashboard KPI Trend and Comparison cards for executive reporting

**Asset Investment Optimizer (AIO):**
- Portfolio-level capital planning
- Multiple strategy scenarios: "Maintain risk," "Reduce risk," "Stay within budget"
- Projects tab: replacement/refurbishment projects with cost estimates
- Compare up to 3 strategies side-by-side
- Cost vs risk optimization curves
- Export scenario analysis results

**Strengths:**
- Health scoring + fleet views + AIO form a complete analytical story from individual asset to portfolio investment
- Prediction with multiple failure modes and probabilities is sophisticated
- AIO for capital planning is unique (no other APM tool does investment optimization)

**Weaknesses:**
- No OEE dashboard
- No production analytics
- Benchmarking limited to within-organization (no industry benchmarks)
- Reporting requires BIRT configuration (not self-service)

---

## 8.2 SAP PM

**Metrics Available:**
- MTBF (Mean Time Between Failures) -- from maintenance history
- MTTR (Mean Time to Repair) -- from order confirmations
- Availability -- from uptime/downtime tracking
- Breakdown Rate -- from breakdown orders
- PM Compliance -- scheduled vs executed PMs
- Maintenance Cost (per equipment, work center, cost center, plant) -- from order settlements

**OEE (SAP's Strength):**
- Full OEE decomposition: Availability x Performance x Quality
- Available through SAP Digital Manufacturing Cloud or SAP Manufacturing Execution
- Drill-down from OEE to individual loss categories:
  - Availability losses: breakdowns, changeovers, setup
  - Performance losses: minor stops, reduced speed
  - Quality losses: defects, rework, startup losses
- OEE trending over time (daily, weekly, monthly)
- OEE by production line, shift, product
- Integration with shop floor systems for real-time data

**Fiori Analytical Apps:**
- Monitor Maintenance (F1511): KPI overview dashboard
- Breakdown Analysis (F2812): breakdown frequency, duration, causes
- Maintenance Cost Analysis: cost by equipment, work center, order type
- Work Center Utilization: capacity planning analytics
- PM Compliance: scheduled vs completed maintenance percentage

**Benchmarking:**
- SAP Asset Intelligence Network (AIN): inter-company anonymized benchmarking
- Compare equipment performance against industry peers
- OEM-provided benchmark data for specific equipment models
- Unique to SAP among APM tools

**Reporting:**
- SAP Analytics Cloud: self-service BI with drag-and-drop story builder
- Embedded analytics: Smart Business KPIs in Fiori launchpad
- Classic: MCBR/MCIW maintenance reports, InfoSystem reports
- BW (Business Warehouse) for historical trend analysis

**Strengths:**
- OEE is SAP's crown jewel. Most complete OEE implementation in any ERP/APM system.
- Cross-company benchmarking via Asset Intelligence Network is unique
- Deep cost analytics (integration with finance/controlling is unmatched)
- Fiori analytical apps provide modern visualization of maintenance KPIs

**Weaknesses:**
- OEE requires additional modules (Digital Manufacturing Cloud). Not in base PM.
- Analytics are ERP-oriented (cost, compliance), not condition-oriented (health, prediction)
- No health scoring or predictive analytics in base PM
- Configuration and licensing complexity for full analytics suite

---

## 8.3 GE Vernova APM

**Metrics Available:**
- MTBF (from Reliability Analytics module)
- Failure Rate (instantaneous and cumulative)
- Reliability Growth curves (Crow-AMSAA)
- Weibull distributions (failure probability over time)
- System Reliability (system-level from component data)
- Production Loss Accounting (LPO -- Lost Production Opportunity tracking)
- Maintenance cost per asset

**Reliability Analytics Module (Deep Specialization):**
- Weibull Analysis: fit failure data to Weibull distribution, estimate shape and scale parameters, predict future failures
- Reliability Growth: track reliability improvement over time (Crow-AMSAA model), project when target reliability will be achieved
- System Reliability: model series/parallel/standby system configurations, calculate system MTBF from component data
- MTBF/MTTR: calculated from failure and repair event data, trended over time

**Production Loss Accounting (PLA):**
- Track production losses to specific equipment failures
- LPO events: what equipment, what failure, how much production lost (units), financial impact
- Categorize losses: planned outage, unplanned outage, reduced rate, quality loss
- Trend analysis: losses over time by category, equipment, unit

**OEE:**
- No native OEE. Focuses on production loss rather than OEE decomposition.
- PLA captures the "Availability" component of OEE but not Performance or Quality.

**Fleet Benchmarking:**
- Cross-asset comparison within fleet (same equipment type)
- Strong for GE equipment (turbine fleet benchmarking with OEM data)
- Less useful for non-GE equipment (no OEM baseline data)

**Reporting:**
- SSRS (SQL Server Reporting Services) for formatted reports
- Configurable dashboards with Graph and Query widgets
- Comprehensive RCA Report (23 sections)
- Export capabilities (PDF, CSV, image)

**Strengths:**
- Deepest reliability analytics in any APM tool. Weibull, growth curves, system reliability.
- Production Loss Accounting directly ties failures to business impact
- Reliability Analytics + RCA + ASM form a complete failure elimination toolkit
- Fleet benchmarking for OEM customers

**Weaknesses:**
- No OEE dashboard
- Reliability analytics require statistical knowledge to interpret
- Reporting tools (SSRS) feel dated compared to modern BI tools
- Fleet benchmarking limited to assets with sufficient failure data

---

## 8.4 Bentley AssetWise

**Metrics Available:**
- Inspection compliance rate
- Condition indices (bridge condition index, pipeline condition grade)
- Corrosion rates and remaining life projections
- Overdue inspection counts

**OEE:** Not available. Bentley is inspection/document-focused, not production-focused.

**Fleet Views:**
- Asset register with health indicators sortable/filterable by score
- 3D visualization with health overlays for spatial analysis
- Dashboard KPI cards for aggregate inspection metrics

**Reporting:**
- KPI dashboards (configurable)
- Compliance reports for regulatory bodies
- Inspection history reports per asset/asset class

**Strengths:**
- Inspection compliance tracking is well-suited for regulated infrastructure
- Corrosion rate analytics and remaining life projections for static equipment
- Pipeline-level and system-level views for linear assets

**Weaknesses:**
- No reliability analytics (Weibull, MTBF, growth curves)
- No production analytics or OEE
- No predictive analytics or ML-based insights
- Limited to infrastructure inspection metrics

---

## 8.5 Honeywell Forge APM

**Metrics Available:**
- Health Score (0-100, ML-driven)
- Remaining Useful Life (RUL)
- Predicted Failure Date
- Dollars at Risk (financial impact estimate)
- Maintenance Cost Avoidance (ROI of predictive maintenance)
- Availability (asset uptime)
- ML Model Accuracy (predicted vs actual failures)

**OEE:**
- OEE available through Honeywell Forge Manufacturing Excellence suite (separate from APM)
- Not in core APM module
- When integrated: OEE visible alongside asset health

**Enterprise Dashboard:**
- Multi-site view across multiple plants
- Aggregate health scores per site
- Worst-performing sites/assets surfaced first
- Financial impact (dollars at risk) aggregated across enterprise

**ML Model Performance Tracking:**
- Dashboard showing model accuracy over time
- Predicted failures vs actual failures comparison
- Model retraining triggers and history
- Confidence level tracking per asset model

**Reporting:**
- Executive dashboards with KPIs and trends
- ROI reports: cost avoidance from predictive maintenance
- Asset performance reports exportable

**Strengths:**
- "Dollars at risk" and maintenance cost avoidance provide clear business case
- Enterprise-level multi-site view is good for corporate reliability teams
- ML model accuracy tracking builds trust in predictive analytics
- Financial framing (ROI, cost avoidance) speaks to management

**Weaknesses:**
- No deep reliability analytics (no Weibull, no growth curves)
- OEE requires separate Manufacturing Excellence module
- Less structured analytics than GE APM or SAP
- ML-dependent: no manual analytics tools for engineers who want to explore data

---

## 8.6 Emerson Plantweb Optics

**Metrics Available:**
- % Assets Monitored (pervasive sensing coverage)
- Alert Response Time (MTTA -- Mean Time to Acknowledge)
- MTTR (Mean Time to Respond/Repair -- from work notification tracking)
- Alert Volume trends (total alerts per period)
- Bad Actor count (instruments generating excessive alerts)
- Calibration Compliance %

**OEE:** Not available. Emerson is instrument-focused, not production-focused.

**Dashboard Analytics:**
- KPI tiles with trend sparklines
- Alert volume trending: are alerts increasing or decreasing over time?
- Response time trending: is the team getting faster?
- Bad actor analysis: which instruments need replacement?

**Fleet Views:**
- Hierarchical roll-up: plant > area > unit health summaries
- Instrument-class comparison: valve health vs transmitter health
- Persona-based analytics: each role sees different metrics

**Reporting:**
- Dashboard export
- Alert history reports
- Calibration compliance reports
- Limited compared to Maximo/SAP/GE reporting depth

**Strengths:**
- "Pervasive sensing" metrics (% monitored) track digital transformation progress
- Alert response time trending is operationally relevant for maintenance managers
- Bad actor analysis uniquely identifies root cause of alert fatigue
- Persona-based analytics ensure each role sees relevant metrics

**Weaknesses:**
- No reliability analytics (Weibull, MTBF, growth curves)
- No production analytics or OEE
- Instrument-only metrics; not for rotating/structural equipment
- Shallow analytics compared to dedicated APM or BI tools

---

# COMPARATIVE SUMMARY

## Best-in-Class by Page Type

| Page Type | Leader | Runner-Up | Why |
|-----------|--------|-----------|-----|
| **Plant Overview** | Honeywell Forge (heatmap + dollars at risk) | IBM Maximo Health (grid + work queues) | Forge's heatmap is the most effective at-a-glance plant summary |
| **Asset Detail** | IBM Maximo Health+Predict (score decomposition + multi-failure prediction) | Honeywell Forge (ML contributing factors + dollars at risk) | Maximo's transparency (why the score is what it is) + prediction depth |
| **Trends/Condition Monitoring** | GE Vernova APM (ad-hoc + SmartSignal) | IBM Maximo Monitor (anomaly detection + dashboards) | GE's drag-and-drop tag analysis is unmatched |
| **Fault Tree/RCA** | GE Vernova APM (PROACT + logic gates + financial tracking) | IBM Maximo (solid visual tree) | GE's implementation is the most complete RCA tool in any software product |
| **Events/Alerts** | Emerson Plantweb Optics (NAMUR + persona + action cards) | GE Vernova APM (policy engine + shelving) | Emerson's "what/why/what to do" format + NAMUR compliance |
| **Work Orders** | IBM Maximo (full lifecycle + mobile) | SAP PM (ERP integration depth) | Maximo is the industry standard for WO management |
| **Inspections** | GE Vernova APM (RBI + thickness monitoring) | IBM Maximo (configurable forms + mobile) | GE's API 580/581 RBI is the gold standard for process industries |
| **Performance/Analytics** | SAP PM (OEE + cost + benchmarking) | GE Vernova APM (reliability statistics) | SAP's OEE decomposition + cross-company benchmarking |

---

## Sources

### IBM Maximo
- [Maximo Operational Dashboard Overview (IBM Docs)](https://www.ibm.com/docs/en/SSLPL8_cd/com.ibm.mbs.doc/operational_dashboard/opdash_overview.html)
- [Operational Dashboard MAS 9.0 (Maximo Secrets)](https://maximosecrets.com/2024/09/23/operational-dashboard-mas-9-0/)
- [Operational Dashboard and Work Queues (Maximo Secrets)](https://maximosecrets.com/2024/09/25/operational-dashboard-and-work-queues/)
- [Maximo Health and Predict Demo Script v9.0 (IBM Labs)](https://ibm.github.io/maximo-labs/apm_9.0/demo_script/)
- [Maximo Health and Predict Build Demo (IBM Labs)](https://ibm.github.io/maximo-labs/apm_9.0/build_demo/)
- [Asset Dashboard -- Maximo Health (IBM Docs)](https://www.ibm.com/docs/en/mhmpmh-and-p-u/cd?topic=locations-asset-dashboard)
- [Maximo Health Overview (IBM Docs)](https://www.ibm.com/docs/en/mhmpmh-and-p-u/cd?topic=overview-maximo-health)
- [Maximo Monitor Product Overview (IBM Docs)](https://www.ibm.com/docs/en/maximo-monitor/8.4.0?topic=product-overview-features)
- [Monitor Anomaly Detection (IBM Docs)](https://www.ibm.com/docs/en/maximo-monitor/continuous-delivery?topic=data-detecting-anomalies)
- [Maximo Mobile -- How to Use Inspections (IBM Support)](https://www.ibm.com/support/pages/maximo-mobile-how-use-inspection-application)
- [Maximo Manage Mobile (Maximo Secrets)](https://maximosecrets.com/2024/05/17/maximo-manage-mobile/)
- [Condition Monitoring in Maximo (IBM Support)](https://www.ibm.com/support/pages/condition-monitoring-maximo)
- [Maximo Health MAS 8.3 Labs](https://christophelucasibm.github.io/apmlabs/health/health-mas/)
- [Maximo Health and Predict Utilities (IBM MediaCenter)](https://mediacenter.ibm.com/media/IBM+Maximo+Health+and+Predict+Utilities/1_6xd4euqd)
- [Interloc Operational Dashboards](https://www.interlocsolutions.com/blog/operational-dashboards)

### SAP PM
- [SAP PM Transaction Codes (s4-experts)](https://s4-experts.com/sap-pm-transaction-codes/)
- [SAP Fiori Apps for Maintenance Planning (SAP Press)](https://blog.sap-press.com/sap-fiori-apps-for-maintenance-planning-with-sap-s/4hana)
- [SAP PM Business User Guide (SAP Press Sample)](https://s3-eu-west-1.amazonaws.com/gxmedia.galileo-press.de/leseproben/5180/reading_sample_sappess_plant_maintenance_with_sap_s4hana_business_user_guide.pdf)
- [EAM Fiori Applications (SAP Community)](https://community.sap.com/t5/technology-blog-posts-by-members/eam-fiori-applications/ba-p/13459984)
- [Breakdown Analysis F2812 (SAP Community)](https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-members/fiori-app-for-breakdown-analysis-f2812-eam-kpi-app-overview/ba-p/13523037)
- [SAP Fiori KPI Tiles (SAP Blog)](https://blogs.sap.com/2020/03/05/sap-fiori-kpi-tiles/)
- [SAP Fiori Apps Reference Library](https://fioriappslibrary.hana.ondemand.com/)
- [SAP Service and Asset Manager (SAP)](https://www.sap.com/products/scm/asset-manager.html)
- [SAP Service and Asset Manager Features](https://www.sap.com/products/scm/asset-manager/features.html)
- [SAP Asset Manager Overview (OneSpire)](https://onespire.net/sap-asset-manager-mobile-app-overview/)
- [Equipment Master in SAP PM (VaibhavERP)](https://vaibhaverp.com/equipment-master-in-sap-pm/)
- [Measuring Points in SAP PM (VaibhavERP)](https://vaibhaverp.com/measuring-points-in-sap-pm/)
- [Perform Maintenance Jobs Fiori App (SAP Community)](https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-sap/perform-maintenance-jobs-fiori-application/ba-p/13555743)
- [Advanced Scheduling Board F5460 (SAP Blog)](https://blogs.sap.com/2022/09/14/advanced-scheduling-board-f5460/)

### GE Vernova APM
- [GE Vernova APM Product Page](https://www.gevernova.com/software/products/asset-performance-management)
- [Meridium APM Software](https://www.gevernova.com/software/products/asset-performance-management/meridium)
- [Dashboard Widgets (Cloud APM)](https://www.gevernova.com/software/documentation/cloud-apm/usw/general-dashboard-widgets.html)
- [Dashboard Widgets (On-Premises APM)](https://www.gevernova.com/software/documentation/onpremises-apm/v522/help/general-dashboard-widgets.html)
- [Dashboards Overview (Cloud APM)](https://www.gevernova.com/software/documentation/cloud-apm/euc/general-dashboards.html)
- [RCA Overview (On-Premises APM)](https://www.gevernova.com/software/documentation/onpremises-apm/v507/help/rca-overview.html)
- [RCA Logic Tree (Cloud APM)](https://www.gevernova.com/software/documentation/cloud-apm/latest/rca-logic-tree.html)
- [RCA Comprehensive Analysis Report (Cloud APM)](https://www.ge.com/digital/documentation/cloud-apm/latest/rca-reports-comprehensive-analysis-report.html)
- [RCA Brochure (GE Vernova)](https://www.gevernova.com/software/resources/brochure/root-cause-analysis-asset-reliability)
- [Condition-Based Monitoring Brochure (GE Vernova)](https://www.gevernova.com/software/resources/brochure/condition-based-monitoring-apm-health)
- [SmartSignal Cards (Essentials)](https://www.gevernova.com/software/documentation/essentials/usw/analysis-smartsignal-cards.html)
- [Analysis Charts (Predix APM)](https://www.ge.com/digital/documentation/predix-apm/latest/analysis-analysis-charts.html)
- [Asset Integrity Management (GE Vernova)](https://www.gevernova.com/software/products/asset-performance-management/asset-integrity)
- [Thickness Monitoring (GE Vernova Blog)](https://www.gevernova.com/software/blog/how-thickness-monitoring-programs-help-safely-operate-static-equipment)
- [RBI Components (Cloud APM)](https://www.gevernova.com/software/documentation/cloud-apm/euc/rbi580-about-components.html)
- [APM MI Suite (AOC)](https://www.aoccorp.com/training/the-ge-apm-mi-suite)
- [Inspection Tasks (On-Premises APM)](https://www.gevernova.com/software/documentation/onpremises-apm/v522/help/inspection-management-inspection-tasks.html)
- [Inspection Assessment Workflow (Predix APM)](https://www.ge.com/digital/documentation/predix-apm/latest/im-inspection-assessment-workflow.html)
- [Event Types (Cloud APM)](https://www.gevernova.com/software/documentation/cloud-apm/euc/gaa-admin-event-types.html)
- [Alert Severity and Status (Predix Essentials)](https://www.ge.com/digital/documentation/predix-essentials/latest/c_apm_alert_severity_and_status.html)
- [SmartSignal Predictive Analytics (GE Vernova)](https://www.gevernova.com/software/products/asset-performance-management/equipment-downtime-predictive-analytics)
- [Asset Reliability Software (GE Vernova)](https://www.gevernova.com/software/products/asset-performance-management/asset-reliability)
- [APM Mechanical Integrity Demo (GE Vernova)](https://www.gevernova.com/software/product-demos/apm-integrity-demo/index.html)
- [APM Health Demo (GE Vernova)](https://www.gevernova.com/software/product-demos/apm-health-demo/index.html)
- [Configuration Templates (GE Vernova)](https://www.gevernova.com/software/products/asset-performance-management/configuration-templates)

### Bentley AssetWise
- [AssetWise Reliability (Bentley)](https://www.bentley.com/software/assetwise-reliability/)
- [AssetWise Health Monitoring (Bentley PDF)](https://www.bentley.com/wp-content/uploads/PDS-AssetWise-Health-Monitoring-LTR-EN-LR.pdf)
- [AssetWise ALIM (Bentley)](https://www.bentley.com/software/assetwise-alim/)
- [AssetWise Inspections (Bentley)](https://www.bentley.com/software/assetwise-inspections/)
- [AssetWise 4D Analytics (Bentley)](https://www.bentley.com/software/assetwise-4d-analytics/)
- [AssetWise APM V7.2 (Reliabilityweb)](https://reliabilityweb.com/news/article/bentleys_enhanced_assetwise_apm_v7.2_features_immersive_environment)
- [Bentley AssetWise Suite (LNS Research)](https://blog.lnsresearch.com/bentley-systems-and-its-assetwise-suite-of-apm-applications)
- [iTwin Platform (Bentley)](https://www.bentley.com/software/itwin/)
- [Asset Performance Software (Bentley)](https://www.bentley.com/software/asset-performance/)

### Honeywell Forge APM
- [Honeywell Forge APM Product Information Note 2025 R550](https://process.honeywell.com/content/dam/process/en/products/hce/honeywell-forge-performance-plus-for-industrials-asset-performance/documents/hon-ia-hps-honeywell-asset-performance-management-product-information-note-2025-r550.pdf)
- [Honeywell Forge APM Brochure](https://process.honeywell.com/content/dam/process/en/documents/document-lists/BrochureHoneywellForgeAPM-v1.pdf)
- [Honeywell Forge APM PIN R1](https://process.honeywell.com/content/dam/process/en/documents/document-lists/PINForgeAPMR1-v1.pdf)
- [Honeywell Forge APM Product Page](https://process.honeywell.com/us/en/products/industrial-software/asset-reliability/honeywell-forge-performance-plus-for-industrials-asset-performance)
- [Honeywell Forge Case Study (Kinshuk Bose)](https://kinshukbose.com/work/honeywell_forge)
- [Honeywell Forge APM Brochure (Older)](https://process.honeywell.com/content/dam/forge/en/documents/brochures/hon-asset-performance-management-brochure.pdf)
- [Honeywell Forge APM New Approach (ARC Advisory)](https://www.arcweb.com/blog/honeywell-forge-apm-takes-new-approach)
- [Honeywell Forge APM (PMIntegrators)](https://pmintegrators.com/Product/s/PGeMYZ/Honeywell-Forge-Asset-Performance-Management)

### Emerson Plantweb Optics
- [Plantweb Optics Platform (Emerson US)](https://www.emerson.com/en-us/automation/operations-management-software/plantweboptics-platform)
- [Plantweb Optics Platform (Emerson AU)](https://www.emerson.com/en-au/automation/asset-performance-management/asset-monitoring/health-monitoring/plantweboptics)
- [AMS Optics (Emerson US)](https://www.emerson.com/en-us/automation/operations-management-software/amsoptics)
- [Plantweb Optics (Scallon Controls)](https://www.scalloncontrols.com/digital-transformation/data-analytics/remote-asset-monitoring/plantweb-optics/)
- [Plantweb Insight Asset View (Emerson)](https://www.emerson.com/en-us/catalog/plantweb-sku-insight-asset-view-application)
- [AMS Optics AR (Google Play)](https://play.google.com/store/apps/details?id=com.emerson.ex.arv)
- [AMS Optics AR Product Data Sheet (Emerson PDF)](https://www.emerson.com/documents/automation/product-data-sheet-ams-optics-augmented-reality-ams-en-6800838.pdf)
- [Plantweb Optics AR (Automation World)](https://www.automationworld.com/process/iiot/video/21138159/plantweb-optics-augmented-reality)
- [Emerson Plantweb Optics Adds AR (ARC Advisory)](https://www.arcweb.com/blog/emerson-plantweb-optics-adds-ar)
- [Plantweb Optics Analytics (Emerson)](https://go.emersonautomation.com/plantwebopticsanalytics_rfi)
- [NAMUR NE107 Standard (Inst Tools)](https://instrumentationtools.com/namur-ne107-standard/)
- [Plantweb Optics (Microsoft Marketplace)](https://marketplace.microsoft.com/en-us/marketplace/apps/emersonelectricco1588872531967.sol-60864-khy)

### Cross-Platform
- [Best APM Software 2026 (ReliaMag)](https://reliamag.com/guides/best-apm-software-2026/)
- [GE Vernova APM Reviews (G2)](https://www.g2.com/products/ge-vernova-asset-performance-management/reviews)
