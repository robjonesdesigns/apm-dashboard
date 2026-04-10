# DESK-RESEARCH-020: Competitor Information Architecture -- Full Page/Screen Structure

**Date:** 2026-04-03
**Purpose:** Map the complete information architecture of major APM tools -- every screen, module, navigation pattern, and drill-down path from plant overview to sensor reading.

---

## 1. IBM Maximo Application Suite (MAS)

### Suite-Level Architecture
MAS is not a single application. It is a suite of separately licensed apps unified under a single launcher. The suite-level navigation uses a "9-dot" icon (top-right in v8.x, consolidated into left nav in v9.1) to switch between apps:

- **Maximo Manage** (EAM -- the core work/asset management system)
- **Maximo Health** (asset health scoring and condition assessment)
- **Maximo Predict** (predictive failure models, often bundled with Health)
- **Maximo Monitor** (IoT sensor data, dashboards, anomaly detection)
- **Maximo Visual Inspection** (AI-powered visual/image inspection)
- **Maximo Mobile** (offline-capable field worker app)
- **Maximo Assist** (AI-powered remote assistance)

Each app has its own full UI. They share an asset registry but have distinct navigation and page structures.

### Maximo Manage -- Complete Module and Application List
Navigation: collapsible left sidebar ("Go To" menu). Hovering expands it. Modules are icon-grouped; each module expands to show its applications.

**Modules and their key applications:**

| Module | Key Applications |
|---|---|
| **Administration** | Organizations, Calendar, Classifications, Communication Templates, Domains, Escalations, Cron Task Setup, Logging |
| **Assets** | Assets, Locations, Condition Monitoring, Meters, Failure Codes |
| **Work Orders** | Work Order Tracking, Activities and Tasks, Quick Reporting, Labor Reporting |
| **Preventive Maintenance** | Preventive Maintenance, Master PM, Job Plans, Routes, Safety Plans |
| **Planning** | Planning, Scheduling, Assignment Manager, Work Order Forecasting |
| **Inventory** | Inventory, Item Master, Storerooms, Issues and Transfers, Inventory Counts |
| **Purchasing** | Purchase Orders, Purchase Requisitions, Receiving, Companies, Invoices |
| **Service Desk** | Service Requests, Incidents, Problems, Solutions |
| **Self Service** | Create Service Request, View Service Requests |
| **Contracts** | Purchase Contracts, Lease/Rental Contracts, Warranty Contracts, Master Contracts, Labor Rate Contracts |
| **Financial** | Chart of Accounts, Cost Management, GL Component Maintenance |
| **Integration** | Integration Framework, End Points, Object Structures, External Systems |
| **Security Groups** | Security Groups, Users, Roles |
| **System Configuration** | Database Configuration, Migration Manager, Object Structures, Workflow Designer |
| **Analytics** | KPI Manager, BIRT Report Administration |

**Start Center (Landing Page):**
- Role-based dashboard with configurable portlets (widgets)
- Portlet types: Result Sets (filtered record lists), Favorite Applications, Quick Insert (create records fast), Bulletin Board, KPI graphs, Inbox/Assignments
- Typical maintenance planner Start Center: My Assigned WOs, Overdue WOs, Open Service Requests, PM Coming Due, KPI chart of backlog

**Asset Detail Page:**
- Header: asset number, description, status, location, parent asset
- Tabs: General, Specifications, Safety, Meters/Condition Monitoring, Work (linked WOs), Spare Parts, Relationships, Attached Documents, Drilldown (child assets), Classification
- Drilldown tab shows asset hierarchy tree

**Work Order Detail Page:**
- Header: WO number, description, status, priority, asset, location
- Tabs: General, Plans (labor, materials, tools, services), Actuals, Related Records, Failure Reporting, Safety, Attachments, Log
- Workflow actions: Approve, Route, Schedule, Dispatch, Complete

**Navigation Pattern:**
- Start Center -> Go To menu -> module -> application -> List view -> Detail view
- 3 clicks from landing to asset detail (Go To > Assets > Assets app > select record)
- Breadcrumbs not prominent; relies on Go To menu + browser back
- List views support saved queries, column configuration, search, advanced search

### Maximo Health and Predict
Navigation: left sidebar with dedicated sections.

**Main Pages/Views:**

| Page | Description |
|---|---|
| **Assets (Grid View)** | Primary landing -- data table of all managed assets with health/risk/criticality scores as sortable columns. Add/remove columns, filter, sort, save views. Familiar spreadsheet-like grid. |
| **Assets (Map View)** | Geospatial view of assets on a map (for utilities/linear assets) |
| **Work Queues** | Pre-configured filtered lists that surface assets needing attention. Examples: "Failing before PM," "Missing data," "End of life approaching," "High risk." Users check off items as addressed. |
| **Asset Details** | Individual asset deep-dive. Tabs/sections: Health Score card, Risk Score card, Criticality, Predicted Time to Failure, Contributing Factors, Maintenance History, Sensor Readings (from Monitor), Score History over time |
| **Asset Investment Optimizer** | Portfolio-level capital planning. Projects tab, Plan Templates tab. Scenario modeling for replacement/refurbishment investment decisions. |
| **Scoring Configuration** | Admin screens for defining health/risk/criticality formulas, contributor weights, decay curves |

**Drill-Down Path:**
Assets Grid -> click row -> Asset Details (scores, history, predictions) -> link to Maximo Manage for WO creation

**Navigation Pattern:**
- Left nav bar (expandable on hover) with sections for Assets, Work Queues, Asset Investment Optimizer
- Grid view is the primary interaction surface (not cards, not a dashboard with charts)
- Views are saveable/shareable -- reliability engineers create custom views per asset class

---

## 2. SAP Plant Maintenance / SAP Intelligent Asset Management

### Architecture Overview
SAP PM lives inside SAP S/4HANA (or legacy ECC). It is not a standalone app -- it is a set of transaction codes and Fiori apps within the broader ERP. SAP Intelligent Asset Management adds cloud-based predictive and strategy layers on top.

**Access Pattern:**
- SAP GUI: transaction codes (e.g., IW21 to create a notification)
- SAP Fiori Launchpad: tile-based home screen with role-based app groups
- SAP Asset Manager: native mobile app for field execution

### SAP Fiori Launchpad (Modern UI)
The Fiori Launchpad is the landing page. It shows role-based tiles (square icons with live KPI counts) grouped into categories.

**Typical Maintenance Planner Launchpad Tiles:**

| Tile/App | App ID | Purpose |
|---|---|---|
| Monitor Maintenance | F1511 | Overview dashboard of maintenance KPIs |
| Manage Maintenance Orders | -- | List/edit/create maintenance orders |
| Find Maintenance Orders | F2175 | Search/filter orders (supports barcode scan) |
| Manage Work Center Utilization | -- | Capacity planning view |
| Maintenance Scheduling Board | -- | Gantt-style scheduling |
| Screen Maintenance Requests | F4072 | Triage incoming notifications |
| My Maintenance Requests | F4513 | Personal queue of notifications |
| Perform Maintenance Jobs | F5104A | Mobile/field execution of job cards |
| Manage Schedules | -- | Scheduling maintenance activities |
| Manage Maintenance Buckets | F4073 | Resource allocation planning |
| Maintain Equipment | -- | Equipment master data |
| Maintain Functional Location | -- | Functional location master |
| Monitor Equipment | -- | Equipment health overview |
| Manage Maintenance Plans | -- | Preventive maintenance scheduling |

~50 Fiori apps exist for plant maintenance alone.

### Classic SAP GUI Transaction Codes (still widely used)

**Equipment & Locations:**
- IE01/IE02/IE03: Create/Change/Display Equipment
- IE05/IE08: Equipment List Editing
- IH01: Display Functional Location Structure (tree view)
- IL01/IL02/IL03: Create/Change/Display Functional Location

**Notifications (Events/Alerts):**
- IW21/IW22/IW23: Create/Change/Display PM Notification
- IW24: Malfunction Report
- IW25: Activity Report
- IW26: Maintenance Request
- IW28/IW29: Notification List Edit

**Work Orders:**
- IW31/IW32/IW33: Create/Change/Display Maintenance Order
- IW38/IW39: Order List Edit
- IW40: Multi-level Order List
- IW41: Confirmation entry
- IW47: Confirmation list

**Preventive Maintenance:**
- IP01/IP02/IP03: Create/Change/Display Maintenance Plan
- IP10: Schedule Maintenance Plan
- IP30: Deadline monitoring

**Task Lists:**
- IA01-IA07: Equipment and General Maintenance Task Lists

### Hierarchy and Navigation
- Functional Location hierarchy: Plant > Area > System > Equipment > Sub-equipment
- Tree navigation via IH01 (functional location structure display)
- Equipment linked to functional locations with parent-child relationships
- No traditional sidebar -- Fiori uses launchpad tiles; SAP GUI uses transaction code entry
- Breadcrumbs in Fiori apps; menu path in SAP GUI

### SAP Intelligent Asset Management (Cloud Layer)
Adds on top of SAP PM:
- **SAP Predictive Asset Insights**: anomaly detection, failure prediction dashboards
- **SAP Asset Strategy and Performance Management**: RCM/FMEA, strategy optimization
- **SAP Asset Manager Mobile**: offline field app with work order execution
- **SAP Business Network for Asset Management**: inter-company collaboration

**Drill-Down Path (Fiori):**
Launchpad tile -> App list view -> Record detail -> Related records (tabs)
3-4 clicks from launchpad to equipment detail. Equipment detail has tabs for General, Components, Documents, Classification, Measuring Points, Maintenance Plans, History.

---

## 3. GE Vernova APM (Meridium)

### Architecture Overview
GE APM is organized into four product pillars, each containing multiple modules accessible from a shared left navigation panel:

**Product Pillars:**
1. **APM Health** -- condition monitoring, asset health scoring
2. **APM Strategy** -- asset strategy management, RCM/FMEA
3. **APM Reliability** -- root cause analysis, reliability analytics, production loss accounting
4. **APM Integrity** (Mechanical Integrity) -- inspection management, thickness monitoring, RBI, compliance

### Complete Module List

**APM Health:**
- Asset Health Manager (AHM) -- health scoring, condition indicators, policies
- Condition-Based Monitoring -- sensor data collection, route-based inspections
- Asset Health Indicator -- visual health status for assets

**APM Strategy:**
- Asset Strategy Management (ASM) -- risk-based strategy development
- Asset Strategy Optimization (ASO) -- cost/risk optimization
- Reliability-Centered Maintenance (RCM) -- formal RCM analysis
- Failure Modes and Effects Analysis (FMEA)

**APM Reliability:**
- Root Cause Analysis (RCA) -- logic trees, Ishikawa diagrams, 5-Why
- Reliability Analytics -- Weibull analysis, growth curves, system reliability
- Production Loss Accounting (PLA) -- tracking production losses to equipment failures
- Generation Availability Data System (GADS) -- power generation reporting

**APM Integrity (Mechanical Integrity):**
- Inspection Management (IM) -- inspection plans, inspection events, recommendations
- Thickness Monitoring (TM) -- corrosion rate analysis, minimum thickness calculations
- Risk-Based Inspection (RBI) -- risk-ranked inspection prioritization
- Compliance Management -- regulatory compliance tracking
- Calibration Management -- instrument calibration tracking and scheduling

**Cross-Cutting Modules:**
- Policy Designer -- rule engine for automated calculations and workflows
- Recommendation Management -- unified recommendation tracking across all modules
- Asset Criticality Analysis (ACA)
- Hazards Analysis (HAZOP)
- SIS Management (Safety Instrumented Systems)
- Lubrication Management

**Foundation:**
- APM Connect -- data integration platform
- Dashboards and Reports
- Admin console

### Navigation Structure
- **Left navigation panel**: persistent sidebar listing all licensed modules
- **Main menu** organized by the four pillars (Health, Strategy, Reliability, Integrity)
- Each module opens to its own landing page with module-specific navigation
- Breadcrumbs track drill-down path within modules

### Key Screens

**Home Dashboard:**
- Configurable dashboard mapped to APM work processes
- Widgets for: assets needing attention, open recommendations, upcoming inspections, reliability trends
- Five work process dashboards: Foundation, Failure Elimination, Asset Strategy, Mechanical Integrity, Asset Safety

**Asset Health Manager:**
- Health summary view with health indicator scores across asset fleet
- Individual asset health detail with contributing indicators
- Policy execution results
- Trend charts for health scores over time

**Inspection Management:**
- Inspection plan list
- Inspection event records with findings
- Recommendations generated from inspections
- Corrosion loops and circuits

**Root Cause Analysis:**
- Analysis list view
- Logic tree builder (visual drag-and-drop)
- Team tracking
- Recommendations linked to analysis

**Drill-Down Path:**
Dashboard -> Module landing -> Asset/Record list -> Record detail -> Related records/tabs
Typically 3-4 clicks from home to specific inspection finding or health indicator.

---

## 4. Bentley AssetWise (Asset Reliability)

### Architecture Overview
Bentley AssetWise is actually a suite of products that combine digital twin visualization with traditional APM:

- **AssetWise Asset Reliability** (core APM platform -- formerly Ivara)
- **AssetWise ALIM** (Asset Lifecycle Information Management -- document/drawing management)
- **AssetWise Inspections** (mobile inspection app)
- **AssetWise 4D Analytics** (predictive analytics, formerly Amulet)

### AssetWise Asset Reliability -- Modules

| Module | Description |
|---|---|
| **Asset Strategy Development** | RCM, RBI, FMEA, FMECA, RCA, SIS/SIL analysis methods. Risk matrices, degradation rate modeling, economic feasibility of maintenance strategies |
| **Asset Health Monitoring** | Centralized health dashboard consolidating condition data from all sources. Automatic health scoring. Trend analysis |
| **Inspection Management** | Mobile inspection with checksheets, indicator readings, route management. Supports preventive, predictive, and failure-finding tasks |
| **Condition Monitoring** | Sensor integration, vibration analysis, thermography data |
| **Work Management** | EAM connector integration (to SAP, Maximo, etc.) rather than native work orders |
| **Reporting and Analytics** | KPI dashboards, reliability reports, compliance reports |

### Unique Differentiator: Digital Twin Integration
- **Hypermodel Environment**: 3D/2D engineering models (i-models) spatially linked to asset condition indicators
- Users can click on a pipe segment in a 3D model and see its inspection history, thickness readings, health score
- "Immersive APM" -- visual environment where inspection indicator readings are associated with the visual model

### Navigation Structure
- **APM Supervisor Dashboard**: at-a-glance view of asset health KPIs for reliability/maintenance managers
- Web-based portal with module navigation
- Tree view for asset hierarchy navigation
- Mobile app (APM Inspections) for field data collection with checksheets downloaded to device
- Integration with Bentley's iTwin platform for 3D navigation

### Key Screens
- **Dashboard**: KPI summary cards, health score distribution, overdue items
- **Asset Register**: searchable list of assets with health indicators
- **Asset Detail**: health score, inspection history, strategy, condition trends, linked engineering documents
- **Strategy Workspace**: RCM/RBI analysis views with risk matrices
- **Inspection Route**: ordered list of assets with checksheet data entry
- **3D Hypermodel**: immersive visual navigation to assets with overlaid condition data

### Drill-Down Path:
Dashboard -> Asset hierarchy tree or search -> Asset detail -> Inspection/condition tab -> Individual reading
Alternative: 3D model -> click asset -> asset detail overlay
Typically 2-4 clicks depending on whether using hierarchy tree or 3D model entry point.

---

## 5. Honeywell Forge APM

### Architecture Overview
Honeywell Forge APM is organized into four modules, each representing a distinct analytical capability layer:

1. **Health Module** -- real-time asset condition monitoring
2. **Predict Module** -- AI-driven failure prediction
3. **Optimize Module** -- operational performance optimization
4. **Excellence Module** -- continuous improvement and benchmarking

### Navigation Structure
- Left sidebar navigation with module selector
- Asset hierarchy-based drill-down: Plant > Unit > Equipment > Sub-asset
- Uses asset-centric naming convention (e.g., Plant1.FCCU.HeatEx100.InFlow) instead of cryptic tag names

### Key Screens and Views

**Plant Overview Dashboard (Landing Page):**
- Whole-plant health summary
- Risk heatmap showing which areas/units have the most issues
- Asset summary cards showing counts by health status
- Notification drawer for recent events
- KPI tiles for plant-wide metrics

**Asset Health Page:**
- Detailed view of site asset performance
- Risk heatmap visualization
- Asset list sortable by health score, criticality, priority
- Filtering by unit, equipment type, health status
- Quick identification of assets causing the most trouble

**Events Dashboard:**
- List of all active events/alarms
- Event detail drill-down: involved assets, timelines, generated work orders
- Fault tree navigation showing cause-and-effect relationships
- Ability to raise work orders directly from event detail

**Predict Module Views:**
- Plant reliability monitoring dashboard
- Custom KPI monitoring
- Overall Equipment Effectiveness (OEE) display
- Predicted failure timeline
- Contributing variable analysis (what is driving the deviation)

**Optimize Module Views:**
- Asset performance comparison (design vs. actual)
- Identification of design losses vs. operational losses
- Performance goal tracking
- Root cause investigation for underperformance

**Work Order Integration:**
- Work orders raised from events or asset health pages
- Mobile work order monitoring on CT30X/CT60 devices
- Task lists, documentation, SOP access in the field

**Root Cause Analysis:**
- Intuitive RCA workflows embedded in Health module
- Investigate issues, confirm causes
- Next-step recommendations

### Drill-Down Path:
Plant Overview heatmap -> Unit view -> Equipment list -> Asset detail -> Sensor/indicator readings -> Event history
Approximately 4-5 clicks from plant overview to individual sensor reading.

### Design Notes (from Kinshuk Bose portfolio case study):
- 100+ wireframes refined through iterative UAT
- 100+ high-fidelity screens including dashboards, heatmaps, and tables
- Design focused on formatting, filtering, and hierarchy of key asset data
- Mobile-first consideration for field workers

---

## 6. Emerson Plantweb Optics

### Architecture Overview
Plantweb Optics is an asset performance platform focused on persona-based delivery of asset health information. It aggregates data from multiple sources (DCS, historians, vibration monitors, valve diagnostics, etc.) into a unified view.

**Key differentiator:** Persona-based filtering -- the system automatically shows different information to different roles (maintenance technician sees different data than reliability engineer or operations manager).

### Main Views and Screens

**KPI Dashboard (Landing Page):**
- Persona-tailored KPI summary
- KPI tiles include: Unhealthy Assets count, Overdue Calibrations, Overdue Routes, Analytics Deviations
- Enterprise-wide status when connected to multiple Plantweb Optics instances
- Quick filter by location, asset class, responsibility

**Asset Health Overview:**
- List of assets with automatic health scores
- Health score severity indicators
- Personalized asset watch list
- Unread messages/alerts per asset

**Asset Hierarchy View (v1.6+):**
- Hierarchical tree navigation of plant assets
- Automated hierarchy synchronization from multiple source systems
- Drill into organizational structure: Site > Area > Unit > Equipment

**Alert/Message Center:**
- Persona-filtered alert list
- System-generated and user-generated messages
- Read/unread tracking
- Priority-based sorting

**Work Notification Tracker:**
- Work notifications and work orders from open to closed
- Integration with CMMS (SAP, Maximo, etc.) for work order status
- Not a native work order system -- bridges to existing CMMS

**Asset Detail:**
- Health score with contributing factors
- Diagnostic information from connected analytics (Plantweb Insight applications)
- Historical trend data
- Related work notifications
- User-generated notes and messages

**Plantweb Insight Applications (Companion Analytics):**
- Pre-built analytics for specific asset types (steam traps, pressure relief valves, heat exchangers, pumps, etc.)
- Asset View Application: custom plant asset dashboards with up to 10 measurement inputs
- Each Insight app provides its own detailed views for its asset class

### Mobile App (AMS Optics):
- Connect to multiple Plantweb Optics systems
- Dashboard summary of KPIs
- Asset health list
- Alert notifications
- AR (augmented reality) integration for field context

### Navigation Structure
- Web portal with top-level KPI dashboard
- Persona-based filtering applied globally
- Asset hierarchy tree for drill-down navigation
- Search and filter by location, asset class, responsibility
- Mobile app mirrors web structure with simplified views

### Drill-Down Path:
KPI Dashboard -> Asset Health list (filtered by persona) -> Asset detail -> Diagnostic detail (via Insight app) -> Individual measurement
Approximately 3-4 clicks from dashboard to specific asset diagnostic.

---

## Cross-Platform Comparison

### Navigation Patterns

| Tool | Primary Navigation | Secondary Navigation | Hierarchy Display |
|---|---|---|---|
| **Maximo Manage** | Left sidebar "Go To" menu (modules > apps) | Tabs within records | Drilldown tab (tree) |
| **Maximo Health** | Left sidebar sections | Grid columns + saved views | Grid filtering |
| **SAP PM (Fiori)** | Tile-based launchpad | Tabs within apps | IH01 tree view |
| **SAP PM (GUI)** | Transaction code entry | Menu path | Functional location structure |
| **GE APM** | Left sidebar (pillar > module) | Breadcrumbs + tabs | Module-specific hierarchy |
| **Bentley AssetWise** | Web portal + 3D model | Tree view + tabs | 3D hypermodel OR tree |
| **Honeywell Forge** | Left sidebar with modules | Heatmap + hierarchy drill-down | Asset hierarchy naming |
| **Emerson Plantweb** | KPI dashboard + hierarchy tree | Persona-based filtering | Hierarchy tree (v1.6+) |

### Clicks from Overview to Asset Detail

| Tool | Clicks | Path |
|---|---|---|
| Maximo Manage | 3 | Go To > Assets > select asset |
| Maximo Health | 2 | Assets grid > click row |
| SAP Fiori | 3-4 | Launchpad tile > app list > select record |
| GE APM | 3-4 | Dashboard > module > record list > select |
| Bentley AssetWise | 2-4 | Dashboard/3D model > asset (2 via 3D, 4 via tree) |
| Honeywell Forge | 4-5 | Dashboard > unit > equipment > asset > detail |
| Emerson Plantweb | 3-4 | Dashboard > health list > asset detail |

### Where Work Orders Live

| Tool | Work Order Approach |
|---|---|
| **Maximo** | Native -- full WO lifecycle in Manage |
| **SAP PM** | Native -- full WO lifecycle in PM module |
| **GE APM** | Recommendations + EAM integration (not native WOs) |
| **Bentley** | EAM connector integration (not native WOs) |
| **Honeywell Forge** | Native events-to-WO flow + mobile WO tracking |
| **Emerson Plantweb** | CMMS integration bridge (not native WOs) |

### Where Events/Alerts Live

| Tool | Events/Alerts Approach |
|---|---|
| **Maximo** | Service Requests (Manage) + Health work queues (Health) |
| **SAP PM** | Notifications (IW21-IW29) -- separate from work orders |
| **GE APM** | Per-module (inspection findings, RCA events, health alerts) |
| **Bentley** | Health monitoring alerts + inspection findings |
| **Honeywell Forge** | Dedicated Events Dashboard with fault tree |
| **Emerson Plantweb** | Persona-based alert center + messages |

### Analytics/Reporting

| Tool | Analytics Approach |
|---|---|
| **Maximo** | KPI Manager, BIRT reports, Health scoring grid, Investment Optimizer |
| **SAP PM** | Smart Business KPIs, embedded analytics, BW reporting |
| **GE APM** | Deep reliability analytics (Weibull, system reliability, PLA), configurable dashboards |
| **Bentley** | Strategy analysis (RCM/RBI), health trend dashboards, 3D-linked analytics |
| **Honeywell Forge** | Heatmaps, OEE, custom KPIs, predict/optimize modules |
| **Emerson Plantweb** | Persona-based KPIs, Insight app analytics per asset class, health scoring |

---

## Key Patterns for APM Dashboard Design

1. **Every tool uses a grid/table as the primary data surface** for asset lists. Card-based layouts are secondary or absent. The grid is the workhorse.

2. **Health scores are universal** -- every modern APM tool computes and displays some form of health/risk/criticality score per asset. These are the primary sort/filter dimension.

3. **Hierarchy is always plant > area/unit > equipment > sub-equipment**. Navigation follows this hierarchy either via tree view, breadcrumbs, or naming convention.

4. **Work orders are either native or bridged** -- pure APM tools (GE, Bentley, Emerson) push recommendations to an EAM system (SAP, Maximo) for work execution. Full-suite tools (Maximo, SAP) handle WOs natively.

5. **Events/alerts are separate from work orders** everywhere. The flow is: sensor/condition -> event/alert -> triage -> work order.

6. **Left sidebar navigation dominates** (Maximo, GE, Honeywell). SAP is the outlier with its tile-based launchpad. Bentley adds 3D model as navigation.

7. **Persona-based filtering** (Emerson) and **role-based Start Centers** (Maximo) are the two approaches to personalization. Most tools do role-based (show different landing pages per role).

8. **Drill-down typically takes 3-4 clicks** from overview to asset detail across all tools.

9. **Heatmaps are underused** -- only Honeywell prominently features risk heatmaps. Most tools default to sorted tables.

10. **Mobile is field-execution focused** -- mobile apps focus on inspections, work order completion, and basic health checking. Complex analysis stays on desktop.

---

## 7. Trends / Condition Monitoring Pages

### IBM Maximo (Monitor / Health)
- Time-series line charts powered by IoT data. Each sensor parameter gets its own card/widget.
- **Multi-sensor overlay:** Supported. Monitor's anomaly dashboards overlay predicted vs actual values.
- **Time ranges:** Configurable presets (24h, 7d, 30d, custom). Grafana-style dashboarding under the hood.
- **Threshold bands:** Horizontal shaded zones or dashed lines. Health scoring maps to green/yellow/red zones.
- **Scope:** Primarily asset-scoped. Fleet-level health score distribution histograms available.
- **Cross-asset:** Health fleet view compares scores across same type. Direct sensor comparison requires custom Monitor dashboard.

### SAP PM / SAP APM
- SAP Analytics Cloud for visualization. Trend charts are Fiori-style line chart cards.
- **Multi-sensor overlay:** Supported in Analytics Cloud. Predictive Engineering Insights can overlay simulation with actuals.
- **Threshold bands:** Measurement point limits render as colored zones in Fiori. Classic GUI shows tabular.
- **Scope:** Asset-scoped in PM. Fleet analytics in the cloud APM suite.
- **Cross-asset:** Weak in classic SAP PM. Better in cloud APM with fleet degradation curve comparison.

### GE Vernova APM
- Dedicated Condition Monitoring module with "Analysis" workspace. Multi-panel time-series views.
- **Multi-sensor overlay:** Strong. Ad Hoc Analysis tool lets you drag multiple tags onto one chart or stacked panels. One of GE APM's best features.
- **Time ranges:** Full presets (1h, 8h, 24h, 7d, 30d, 90d, 1y, custom). Zoom and pan. Time context persists across panels.
- **Threshold bands:** Configurable alarm limits as colored horizontal bands. Multiple levels (warning, alarm, danger).
- **Scope:** Both. Asset-scoped primary. Policy engine evaluates across multiple assets. Analysis view pulls tags from different assets.
- **Cross-asset:** Well-supported through ad-hoc analysis. Benchmark capability for turbine fleets.

### Bentley AssetWise
- More document/inspection-oriented than real-time sensor. Trend displays basic compared to GE or IBM.
- **Multi-sensor overlay:** Limited native capability. Relies on integrations with OSIsoft PI.
- **Notable weakness:** Condition monitoring is Bentley's weakest area. Fundamentally document/engineering data management.

### Honeywell Forge APM
- Health Trend view with health scores over time. Sensor data from PHD historian or Uniformance.
- **Multi-sensor overlay:** Supported. Asset Comparison feature for side-by-side parameters.
- **Threshold bands:** Green/yellow/red health score banding. ML model confidence bands (Bollinger-style).
- **Scope:** Both. "Worst first" plant-wide ranking. Asset groups for fleet monitoring.
- **Cross-asset:** Fleet comparison and ML-driven comparison of current vs historical baseline and vs peers.

### Emerson Plantweb Optics
- Persona-based UI. Sparklines in asset list, full time-series in detail. Trends appear in context of alerts rather than standalone exploration.
- **Multi-sensor overlay:** Supported but secondary to alert-driven workflow. "Expert Analysis" panel for multi-tag trending.
- **Threshold bands:** NAMUR NE107 status indicators (failure, check function, out of spec, maintenance required) mapped to colors.
- **Scope:** Plant-wide hierarchical roll-up by default. Instrument to loop to unit to area.
- **Cross-asset:** Moderate. Hierarchical roll-up inherently compares within a unit.

---

## 8. Fault Tree / Root Cause Analysis Pages

### IBM Maximo
- Logic tree diagram (top-down tree, failure event at root, branching cause hypotheses). Node-and-connector mind-map style.
- Nodes expandable/collapsible. Click to view details, attach evidence, mark verified/ruled-out.
- RCA initiated from failure event or WO. Verified root causes generate follow-up WOs.
- **Location:** Standalone module. Accessible from asset detail but lives as its own workspace.

### SAP PM
- Classic: structured text-based (damage codes, cause codes, object parts). No visual tree.
- FMEA in newer modules: tabular/spreadsheet format (failure mode -> effect -> cause -> controls -> actions -> RPN).
- **Notable weakness:** Rigorous but not visual. Excellent for structured data, poor for intuitive exploration.

### GE Vernova APM (standout)
- Dedicated RCA module with interactive graphical logic tree. Drag-and-drop nodes. Three cause categories: Physical, Human, Latent/System (Apollo methodology).
- Right-click menus: add child hypotheses, attach evidence, change state (true/not true/unverified). Auto-layout with manual override. Zoom and pan.
- RCA Events link to failure records, work history, asset records. Tracks financial impact (production loss, repair cost).
- Verified root causes generate "RCA Recommendations" with description, target date, assigned responsibility, priority, implementation status. Promotable to WOs.
- Team assembly and defined workflow: Define Event -> Build Logic Tree -> Verify Causes -> Create Recommendations -> Track Implementation.
- Also has Reliability Analytics module (Weibull, growth curves) to complement qualitative tree with quantitative data.
- **Location:** Standalone module + linked from asset detail.

### Bentley AssetWise
- Limited native RCA. Manages engineering documentation (P&IDs, inspection records) that inform RCA. Fault tree requires third-party tools (Isograph, ReliaSoft).

### Honeywell Forge APM
- ML-driven diagnostics instead of traditional fault tree. "Contributing Factors" view: ranked bar chart of parameter contributions to anomaly.
- Click contributing factors to see underlying trend data.
- "Prescriptive Maintenance" recommendations from models. Less structured than GE's formal RCA.
- **Location:** Embedded in asset health detail view when anomalies detected.
- **Notable distinction:** Replaces manual fault tree with automated ML diagnostics. Stronger for known patterns, weaker for novel failures.

### Emerson Plantweb Optics
- No dedicated fault tree. Workflow-driven: alert triggers guided "decision tree" of diagnostic steps (configured by SMEs).
- Step-by-step troubleshooting wizard, not an analysis tool.
- **Location:** Embedded in alert detail view.

---

## 9. Performance / Analytics Pages

### IBM Maximo
- Health score (0-100), RUL, failure probability, MTBF, MTTR. OEE not native (maintenance-centric, not production-centric).
- Fleet-level health score distributions. Asset-level degradation curves.
- Peer comparison within asset class. Health score percentile ranking.

### SAP PM
- MTBF, MTTR, availability (MCBR/MCIW reports). OEE through Manufacturing Integration/Digital Manufacturing Cloud.
- **OEE is SAP's strength:** Full Availability x Performance x Quality decomposition with drill-down to individual losses. Mature and production-integrated.
- SAP Asset Intelligence Network enables cross-company anonymized benchmarking.

### GE Vernova APM
- Reliability metrics (MTBF, failure rate, growth), Production Loss Analysis (LPO tracking), cost analysis.
- Weibull distributions, reliability growth curves. System Reliability module models system-level from component data.
- Turbine fleet benchmarking. Less useful for non-GE equipment.
- **No native OEE.** Focuses on production loss rather than OEE decomposition.

### Bentley AssetWise
- Inspection-based scoring and corrosion rate tracking primarily. Limited operational performance metrics.
- Pipeline-level and system-level views for linear assets (niche strength).

### Honeywell Forge APM
- Health score, RUL, maintenance cost avoidance (ROI), availability. Emphasizes "dollars at risk."
- Enterprise-level dashboard across multiple sites. ML model accuracy tracking (predicted vs actual).
- OEE through Forge Manufacturing Excellence suite, not core APM module.

### Emerson Plantweb Optics
- "Pervasive Sensing" metrics: % assets monitored, alert response time, MTTA, MTTR.
- Dashboard trends for alert volumes and response times.
- Plant-wide hierarchical. No native OEE.

---

## 10. Events / Alerts / Alarms Pages

### IBM Maximo
- Table-based alerts in Monitor. Columns: severity, asset, timestamp, description, status, assigned to.
- Severity: colored icons (critical=red, high=orange, medium=yellow, low=blue). Status as text badges.
- Detail panel: full description, sensor data at time of event, asset context, historical similar events, recommended actions.
- Create WO directly from event. RCA initiable from significant events.
- ML-based anomaly scoring reduces false positives. Alert suppression rules. Alert grouping by asset.

### SAP PM
- "Notifications" (IW28 or Fiori list). Dense table: number, type, description, location, equipment, priority, status.
- Priority: numeric 1-4 with Fiori color coding. Extensive damage/cause/action code catalogs.
- Notification -> maintenance order -> confirmation -> technical completion (core workflow).
- **Notable weakness:** Transactional, not streaming. Designed for planned maintenance workflow, not real-time alarm management.

### GE Vernova APM
- Alerts table: name, asset, timestamp, severity, state, source (policy/threshold/manual).
- States: active, acknowledged, shelved, cleared. Filter by all dimensions.
- Detail: trigger conditions, current vs threshold values, duration, related cascade alerts, recommended actions.
- **Policy engine:** Sophisticated alert logic (persistence windows, multi-condition requirements). Alert shelving. Alert rationalization.
- **Standout feature:** Policy engine flexibility for defining alert logic.

### Bentley AssetWise
- Inspection-based events only. Not designed for real-time alert management.

### Honeywell Forge APM
- Alert cards in list, sorted by severity then recency. Shows asset, type, severity, timestamp, health score impact, **"dollars at risk."**
- Detail panel: contributing sensor trends, ML model explanation, similar past alerts, recommended actions, create WO link.
- **"Dollars at risk"** alongside severity for economic prioritization.
- ML-based anomaly detection inherently reduces false positives. Alert consolidation. Alert accuracy tracking.

### Emerson Plantweb Optics
- **Card-based alert list, persona-filtered.** Operator view vs maintenance vs reliability engineer -- each sees only their relevant alerts.
- **NAMUR NE107 standardized symbols:** failure (red X), check function (orange triangle), out of spec (yellow diamond), maintenance required (blue wrench). Only platform strictly following this standard.
- "Action card" format: what happened, why it matters, what to do, supporting data.
- Bad actor analysis identifies instruments generating excessive alerts.
- **Standout feature:** Persona-based routing + NAMUR NE107 = most operator-friendly alert management.

---

## 11. Work Orders Pages

### IBM Maximo (industry standard)
- Table/grid primary. Full WO lifecycle: WAPPR -> APPR -> INPRG -> COMP -> CLOSE.
- Maximo Scheduler add-on: drag-and-drop Gantt, resource availability, craft/labor planning.
- Parent/child WO hierarchies for complex jobs. Plans include labor, materials, tools, services, costs.
- **Mobile:** Maximo Mobile (offline PWA). Modern UI. Photo capture, time recording, task completion.
- **Strongest WO model in the industry.**

### SAP PM
- Dense table (IW38 or Fiori). Full lifecycle: CRTD -> REL -> PCNF -> CNF -> TECO -> CLSD.
- MRS Gantt view. Graphical scheduling board. MRP integration for parts.
- **Strength:** Integration with procurement, inventory, finance is unmatched. Planning depth.
- **Weakness:** UI complexity. Massive data, many tabs/screens, steep learning curve.

### GE Vernova APM
- Lighter WO module. Primarily generates "Recommendations" that push to external CMMS.
- **GE APM is the "brains" (what to do). Maximo/SAP are the "hands" (how to execute).**

### Honeywell Forge APM
- "Recommendations" list rather than full WOs. Shows asset, action, urgency, predicted failure date, cost/benefit.
- "Maintenance window optimization" suggests timing based on degradation curves and production schedules.
- Execution in connected CMMS.

### Emerson / Bentley
- Not CMMS tools. Route alerts to responsible parties. WO execution in connected systems.

---

## 12. Inspections Pages

### IBM Maximo
- PM records drive scheduling (time/meter/condition-based). Configurable questionnaire-style forms with conditional logic.
- Fields: text, numeric (with validation), date, checkbox, dropdown. Attachments per question.
- Inspection readings feed into Health scoring models directly. Poor results decrease health scores.
- **Mobile:** Full inspection execution (route, form, readings, photos, GPS, offline).
- **Best-in-class** configurable forms + mobile + health score integration.

### SAP PM
- Maintenance plans drive scheduling. "Task lists" with operations and measurement points.
- Structured/engineering-rigorous but rigid. Less flexible than Maximo for freeform capture.
- Measurement documents feed trend analysis. Deviation triggers notifications.
- **Mobile:** SAP Asset Manager with barcode/NFC scanning. Offline capable.
- **Strength:** Integration with full maintenance planning process (inspection -> order -> procurement -> finance).

### GE Vernova APM (standout for RBI)
- **Risk-Based Inspection** module calculates optimal inspection intervals from risk (probability x consequence).
- NDE-specific templates (ultrasonic thickness, radiography, visual).
- Findings update corrosion rates and remaining life. Feeds Thickness Monitoring module.
- Feedback loop: inspect -> update risk -> reschedule next inspection.
- **Industry standard for risk-based inspection in refineries/chemical plants.**

### Bentley AssetWise
- Infrastructure inspection (bridges, pipelines, buildings). Image annotation, condition rating scales.
- Condition indices (bridge condition index, pipeline grade) from inspection data.
- **Best for infrastructure/linear assets**, not process equipment.

### Honeywell Forge APM
- ML-driven inspection scheduling (predicted degradation, not fixed intervals).
- Digital forms with photo capture. Less mature than Maximo or SAP.
- Inspection results feed health scoring alongside sensor data.

### Emerson Plantweb Optics
- Operator rounds with simple checklists. Instrument-focused, not mechanical equipment.
- Round readings feed asset health indicators.
- **Mobile-first** for quick pass/fail checks during plant walk-throughs.

---

## 13. Comparative Strengths by View

| View | Leader | Runner-up | Notable Weakness |
|------|--------|-----------|-----------------|
| **Trends/Condition Monitoring** | GE Vernova (ad-hoc, multi-tag) | Honeywell Forge (ML confidence bands) | Bentley (not real-time) |
| **Fault Tree/RCA** | GE Vernova (interactive logic tree) | IBM Maximo (solid visual tree) | SAP (tabular only), Bentley (none) |
| **Performance Analytics** | SAP (OEE + ERP integration) | IBM Maximo (health scoring fleet) | Bentley (limited) |
| **Events/Alerts** | Emerson Optics (persona-based, NAMUR) | Honeywell Forge (ML + financial impact) | SAP (transactional, not streaming) |
| **Work Orders** | IBM Maximo (industry standard) | SAP PM (ERP integration depth) | GE/Honeywell/Emerson (overlays) |
| **Inspections** | GE Vernova (RBI methodology) | IBM Maximo (forms + mobile) | Forge (immature), Emerson (instrument-only) |

---

## 14. Market Architecture Split

The market divides into two categories:

1. **Full CMMS/EAM platforms** (Maximo, SAP PM): Own work execution. Strong WO management, planning, scheduling. Analytics bolted on.
2. **Analytics overlays** (GE APM, Honeywell Forge, Emerson Optics): Own the intelligence layer. Strong condition monitoring, predictive analytics, alert management. Push recommendations to CMMS.

Bentley occupies a niche: engineering data management and infrastructure inspection.

**Implication for our demo:** We're building a hybrid -- a single coherent product that shows the full condition-to-action pipeline (analytics overlay intelligence) with enough work order and event context to tell the complete story (CMMS awareness). This is the gap no tool fills well: the unified narrative from "sensor is trending bad" to "someone is fixing it" in one product, designed for both personas.

---

## 15. Where Our Demo Differentiates

| Dimension | Industry Standard | Our Approach |
|---|---|---|
| **Asset Inspection** | Data-type tabs (sensors, WOs, inspections) | Narrative flow (how bad, why, who's on it, history, go deeper) |
| **Events in context** | Separate events page/module | Events contextual in sub-asset data table rows |
| **Both personas** | Role-based landing pages (different dashboards) | Progressive disclosure on same screens (summary for Diane, analysis for Carlos) |
| **Dark and quiet** | Most tools ignore ISA-101 for dashboards | Full ISA-101 compliance (gray base, color = deviation) |
| **Condition-to-action** | Fragmented across 3-5 modules/tabs | Full pipeline on one page (sensor -> threshold -> alert -> recommendation -> WO) |
| **Design quality** | "Looks like 1990s" (SAP). Engineer-built UIs | Modern dark theme, proper typography, spacing system |
| **Maintenance persona** | Separate CMMS or minimal APM support | Diane's KPIs on Plant Overview + condition context on WOs |
| **Navigation depth** | 3-5 clicks to asset detail | 2 clicks (Overview -> Asset Table -> Asset Inspection) |

---

## Sources

### IBM Maximo

- [IBM Maximo Manage Modules (Maximo Secrets)](https://maximosecrets.com/2024/04/16/maximo-manage-modules/)
- [IBM Maximo Manage Overview (Maximo Secrets)](https://maximosecrets.com/ibm-maximo-manage-overview/)
- [Maximo User Interface 9.1 (Maximo Secrets)](https://maximosecrets.com/2025/08/15/maximo-user-interface-9-1/)
- [Maximo Health and Predict Demo Script (IBM Labs)](https://ibm.github.io/maximo-labs/apm_9.0/demo_script/)
- [Maximo Health and Predict Setup Demo (IBM Labs)](https://ibm.github.io/maximo-labs/apm_9.0/build_demo/)
- [IBM Maximo Health Asset Dashboard Docs](https://www.ibm.com/docs/en/mhmpmh-and-p-u/cd?topic=using-asset-dashboard)
- [SAP PM Transaction Codes (s4-experts)](https://s4-experts.com/sap-pm-transaction-codes/)
- [SAP PM Transaction Codes (erpdetails)](https://erpdetails.com/sap-pm-plant-maintenance-t-codes-list-of-transaction-codes/)
- [SAP Fiori Apps for Maintenance Planning](https://blog.sap-press.com/sap-fiori-apps-for-maintenance-planning-with-sap-s/4hana)
- [SAP S/4HANA Plant Maintenance Business User Guide (sample)](https://s3-eu-west-1.amazonaws.com/gxmedia.galileo-press.de/leseproben/5180/reading_sample_sappess_plant_maintenance_with_sap_s4hana_business_user_guide.pdf)
- [GE Vernova APM Product Page](https://www.gevernova.com/software/products/asset-performance-management)
- [GE Meridium APM Software](https://www.ge.com/digital/meridium-apm-software)
- [GE APM Modules and Features Deployment (PDF)](https://www.ge.com/digital/documentation/meridium/Help/V4200/Installation/Meridium_Enterprise_APM_ModulesAndFeaturesDeployment.pdf)
- [GE APM Mechanical Integrity Suite (AOC)](https://www.aoccorp.com/training/the-ge-apm-mi-suite)
- [Bentley AssetWise Reliability](https://www.bentley.com/software/assetwise-reliability/)
- [Bentley AssetWise APM V7.2 (Reliabilityweb)](https://reliabilityweb.com/news/article/bentleys_enhanced_assetwise_apm_v7.2_features_immersive_environment)
- [Bentley AssetWise Suite (LNS Research)](https://blog.lnsresearch.com/bentley-systems-and-its-assetwise-suite-of-apm-applications)
- [Bentley AssetWise Asset Reliability Features (Bentley Communities)](https://bentleysystems.service-now.com/community?id=kb_article&sysparm_article=KB0088855)
- [Honeywell Forge APM Product Information Note 2025](https://process.honeywell.com/content/dam/process/en/products/hce/honeywell-forge-performance-plus-for-industrials-asset-performance/documents/hon-ia-hps-honeywell-asset-performance-management-product-information-note-2025-r550.pdf)
- [Honeywell Forge APM Brochure](https://process.honeywell.com/content/dam/process/en/documents/document-lists/BrochureHoneywellForgeAPM-v1.pdf)
- [Honeywell Forge APM PIN R1](https://process.honeywell.com/content/dam/process/en/documents/document-lists/PINForgeAPMR1-v1.pdf)
- [Honeywell Forge Case Study (Kinshuk Bose)](https://kinshukbose.com/work/honeywell_forge)
- [Emerson Plantweb Optics Platform](https://www.emerson.com/en-us/automation/operations-management-software/plantweboptics-platform)
- [Emerson AMS Optics](https://www.emerson.com/en-us/automation/asset-management/asset-monitoring/health-monitoring/plantweboptics)
- [Emerson Plantweb Optics (Scallon Controls)](https://www.scalloncontrols.com/digital-transformation/data-analytics/remote-asset-monitoring/plantweb-optics/)
- [Emerson Plantweb Insight Asset View](https://www.emerson.com/en-us/catalog/plantweb-sku-insight-asset-view-application)
