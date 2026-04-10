# DESK-RESEARCH-017: APM Asset Detail / Inspection Page Patterns

**Date:** 2026-04-03
**Purpose:** Competitive analysis of how major APM tools structure their asset detail and inspection views. Informs the Asset Inspection design for the portfolio case study.

---

## 1. IBM Maximo (Manage + Health + Predict)

IBM Maximo has two distinct asset detail experiences: the traditional **Maximo Manage** asset record (EAM/CMMS) and the modern **Maximo Health/Predict** asset dashboard (APM layer).

### Maximo Manage -- Asset Record (EAM)

The classic asset application uses a **tabbed layout** across the top. Key tabs:

| Tab | Contents |
|---|---|
| **Asset (main)** | Asset number, description, status, location, parent asset, classification, "Maintain Hierarchy" toggle. Subassemblies table showing child assets in parent-child tree. |
| **Specifications** | Classification attributes copied from the asset classification. Manufacturer, model, serial number. Custom key-value pairs. |
| **Spare Parts** | Two table windows: subassemblies (child assets) and associated spare parts (item master records). Links planners to the right replacement part. |
| **Meters** | Gauge and continuous meters attached to the asset. Meter groups. Supports automatic work order generation when readings cross thresholds. |
| **Work** | Full work order history against this asset: WOs, routes, inspections, PM records. Filterable by date range and status. |
| **Safety** | Lock-out/tag-out procedures, hazards, precautions associated with the asset. |

**Equipment hierarchy:** Displayed as a nested tree in the Subassemblies section of the Spare Parts tab. Assets can be standalone or in a parent-child hierarchy. The "Maintain Hierarchy" field on the main tab controls whether child assets follow the parent's location.

**Condition monitoring integration:** Meter readings can be entered directly in the Assets app, against a work order, or in the dedicated Condition Monitoring application. Action limits on meters trigger automatic work order generation when measurements exceed upper or lower bounds.

**Sources:**
- [Maximo Manage -- Asset (Maximo Secrets)](https://maximosecrets.com/2017/03/15/maximo-application-maps-1-of-9-asset-management/)
- [Asset Subassemblies and Spare Parts (Maximo Secrets)](https://maximosecrets.com/2022/08/19/asset-subasssemblies-and-spare-parts/)
- [Location and Asset Meters (Maximo Secrets)](https://maximosecrets.com/2022/07/22/location-and-asset-meters-2/)
- [Condition Monitoring in Maximo (IBM Support)](https://www.ibm.com/support/pages/condition-monitoring-maximo)
- [Generating Work Orders from Condition Monitoring (IBM Support)](https://www.ibm.com/support/pages/generating-work-order-condition-monitoring)

### Maximo Health + Predict -- Asset Dashboard (APM)

The modern APM layer presents a **single-page dashboard** with stacked widget cards rather than traditional tabs.

**Top section -- Score cards (horizontal row):**
- Health Score (0-100, color-coded)
- Criticality Score
- Risk Score
- End of Life (date projection)
- Effective Age (calculated from actual age + health score)
- Next PM Date
- MRR (Maintenance-to-Replacement Ratio)

**Health Score Contributors widget:**
- Expandable chevron reveals the factors driving the health score
- Top 10 contributors tracked historically
- Historical health score trend chart (line graph over time)

**Health History widget:**
- Line chart showing health score over time
- Work orders with problem codes appear as "failure" markers on the reported failure date
- Inspections appear after inspection start date
- PM records appear on WO generation date

**Predict section (if Predict module active):**
- Days to failure (soonest failure mode shown)
- Failure probability curve
- Failure mode selector (dropdown to see projection per mode)
- Anomaly detection indicators
- Asset life curve

**Work Queues:**
- Groups of assets with data quality issues (missing install dates, incomplete replacement costs)
- Replacement planning view: assets flagged for refurbishment or end-of-life within 2 years
- Expected Life view and Plan Costs view for 5-year projections

**Investment Planning:**
- Compare costs, schedules, and risk scores across investment scenarios
- Supports creation of investment projects

**Sources:**
- [Maximo v9.0 APM Hands On Lab -- Demo Script](https://ibm.github.io/maximo-labs/apm_9.0/demo_script/)
- [IBM Docs -- Asset Dashboard](https://www.ibm.com/docs/en/mhmpmh-and-p-u/cd?topic=locations-asset-dashboard)
- [Maximo Health (Naviam)](https://www.naviam.io/products/ibm-maximo-application-suite/health)
- [IBM Maximo Health (Pragma Edge)](https://pragmaedge.com/maximo-health/)
- [Maximo Health (Interloc Solutions)](https://www.interlocsolutions.com/blog/maximo-health-a-powerful-tool-for-smarter-decision-making)

---

## 2. SAP PM / SAP Intelligent Asset Management

SAP's APM offering spans the traditional **SAP PM** (Plant Maintenance) equipment master and the modern **SAP Asset Performance Management** cloud application.

### SAP PM -- Equipment Master (S/4HANA)

Traditional tabbed record view for equipment:
- **General** tab: category, object type, manufacturer, model, serial number, construction year
- **Location** tab: functional location assignment, installation position
- **Organization** tab: plant, planning group, cost center, WBS element
- **Structure** tab: equipment hierarchy (parent/child), functional location hierarchy
- **Classification** tab: characteristics/specifications
- **Measuring Points / Counters** tab: linked measuring points, counter readings

### SAP APM -- Technical Object Viewer (Cloud)

The modern cloud APM application uses a **Technical Object Viewer** with these sections:

| Tab/Section | Contents |
|---|---|
| **Information** | Equipment master data: category, object type, manufacturer, structure info. |
| **Indicators** | Time-series data tab. Individual indicator cards with source info. This is the primary condition monitoring view. Can be populated via measurement documents, IoT connection, or manual entry. |
| **Indicator Monitoring** | 2D visualization chart for time-series history. Overlays alerts, thresholds, and indicator forecasting on the chart. |
| **Analytics** | Failure curve analytics charts (Weibull, etc.) created for the asset. |
| **Alerts** (planned) | As of 2024, alerts are only visible from the home screen alerts tile. Roadmap includes embedding them in the Technical Object Viewer. |

**Health Scoring:**
- Real-time health scores calculated from indicator data
- Rules engine on indicators: compare values against thresholds, generate Alerts or Notifications (e.g., temperature above X, differential pressure below Y)
- Visual Asset Health Monitoring integrates visual inspection indicators into the same monitoring framework

**Asset Hierarchy:**
- Equipment hierarchy within functional locations
- Bill of materials linked to equipment records
- Measuring points/counters associated per equipment level

**Work Order Connection:**
- Alerts and notifications can trigger maintenance orders in S/4HANA
- Maintenance history flows from ECC/S/4HANA into APM via Asset Central (data foundation layer)

**Sources:**
- [SAP APM Features](https://www.sap.com/products/scm/apm/features.html)
- [SAP Community -- What is SAP APM](https://community.sap.com/t5/supply-chain-management-blog-posts-by-sap/what-is-sap-asset-performance-management-apm/ba-p/13974730)
- [SAP Community -- Visual Asset Health Monitoring Part 1](https://community.sap.com/t5/technology-blog-posts-by-members/sap-asset-performance-management-visual-asset-health-monitoring-part-1/ba-p/14143934)
- [SAP Learning -- Condition Monitoring in APM](https://learning.sap.com/learning-journeys/managing-sap-asset-performance-management/implementing-condition-monitoring-in-sap-asset-performance-management)
- [SAP Community -- What's New in SAP APM 2402](https://community.sap.com/t5/supply-chain-management-blog-posts-by-sap/what-s-new-in-sap-asset-performance-management-2402/ba-p/13602117)

---

## 3. GE APM (formerly Meridium, now GE Vernova)

GE Vernova APM is the category leader for power generation and heavy industry. The **Asset Health Manager** module is the primary asset detail view.

### Asset Health Manager -- Health Summary Page

The Health Summary page is the central asset detail view. Layout:

**Left pane -- Asset Hierarchy:**
- Tree view of the asset hierarchy
- Selecting an asset loads its health data in the main content area
- Numbers in the Indicators tab show total health indicators for the selected asset AND its subsidiary assets

**Main content -- Tabbed workspace:**

| Section | Contents |
|---|---|
| **Indicators (This Asset)** | Health indicators for the selected asset only. Each indicator shows: name, description, last update timestamp, current status (Normal / Warning / Alert / No Status). Status boxes summarize indicator counts by status category. |
| **Indicators (Subsidiary Assets)** | Roll-up of health indicators from child assets in the hierarchy. |
| **Events** | Work history, inspections, calibrations, plus events generated by M2M data sources. |
| **Recommendations** | Performance recommendations related to the asset. Can be auto-generated from warning/alert health indicator status, auto-populated with health indicator and asset info. Can also create General Recommendations manually. |
| **Policy Instances** | Execution history of policies (automated rules) that affect this asset. |

### Health Indicator Detail Page

Drilling into a single health indicator shows:

- **Trend Chart workspace:** Line graph plotting numeric readings over time. Shaded areas show limit values with corresponding status colors (green for normal range, amber for warning, red for alert). Max 500 data points displayed. Character (non-numeric) readings shown as circle markers along x-axis.
- **Reading History tab:** Table with status, timestamp, and value for each reading.
- **Health Indicator Source:** Configuration details for where the indicator data comes from.

**Health Indicator Sources:**
- Policy execution results
- Measurement Locations
- OPC Tags
- KPIs
- Custom configured health indicator source records

### Additional APM Modules (asset record sections)

| Module | What it adds to the asset record |
|---|---|
| **Asset Strategy Management** | Criticality analysis, risk matrix, strategy optimization. Prioritizes O&M spend. |
| **Risk-Based Inspection (RBI)** | RBI-580 (qualitative) and RBI-581 (quantitative) risk engines per API 580/581. Inspection intervals, degradation mechanisms. |
| **Thickness Monitoring** | Thickness readings, corrosion rate analysis, minimum required thickness calculations, next inspection and retirement dates. |
| **Inspection Management** | Inspection plans per asset class, condition documentation, inspection task tracking, recommendation tracking to closure. |
| **Asset Criticality Analysis** | Criticality values derived from organizational definitions. Used to prioritize maintenance strategies. |

**Sources:**
- [GE Digital -- Asset Health Manager Overview](https://www.ge.com/digital/documentation/meridium/Help/V43020/Default/Subsystems/AssetHealthManager/Content/AssetHealthManagerOverview.htm)
- [GE Digital -- Health Indicator Details (APM Classic v45)](https://www.ge.com/digital/documentation/apm-classic/v45/help/ahm-health-indicator.html)
- [GE Digital -- Health Indicator Statuses (APM Classic v462)](https://www.ge.com/digital/documentation/apm-classic/v462/help/ahm-health-summary-statuses.html)
- [GE Digital -- Assess Asset Health (APM Classic v45)](https://www.ge.com/digital/documentation/apm-classic/v45/help/ahm-access-asset-health.html)
- [GE Vernova -- APM Strategy](https://www.gevernova.com/software/products/asset-performance-management/asset-strategy-management)
- [GE Vernova -- Asset Integrity (Mechanical Integrity)](https://www.gevernova.com/software/products/asset-performance-management/asset-integrity)
- [GE Vernova -- APM Explained](https://www.gevernova.com/software/blog/asset-performance-management-explained)

---

## 4. Bentley AssetWise

Bentley splits their APM offering into **AssetWise Reliability** (strategy and analysis) and **AssetWise Inspections** (field inspection workflow).

### AssetWise Inspections -- Module Structure

Four modules:

| Module | Purpose |
|---|---|
| **Collector** | Management and completion of inspection reports. Schedule, create, edit, review reports. Create/review maintenance items during inspection. View inspection schedule. |
| **Manager** | Executive dashboards, management reports, ad hoc queries, interactive mapping tools. |
| **Analysis** | (Reliability analysis tools) |
| **Administration** | Configuration and setup |

### Key Differentiator: Immersive 3D/2D Integration

AssetWise APM V7.2+ uses **hypermodeling** -- spatially enabled operations and maintenance through 2D/3D representations:
- View infrastructure assets in context of engineering information via Bentley i-models
- Initiate actions (inspections, work orders) directly from 2D or 3D asset representations
- Condition indicators linked directly to visual model elements
- Inspection indicator readings associated with the spatial visual model

### Asset Data Structure
- Links asset information to: models, IoT data, geospatial information, design information
- Digital twin context for all assets
- Condition indicators viewable in the context of the 3D model

**Sources:**
- [Bentley -- AssetWise Inspections](https://www.bentley.com/software/assetwise-inspections/)
- [Bentley -- AssetWise Reliability](https://www.bentley.com/software/assetwise-reliability/)
- [Reliabilityweb -- Bentley AssetWise APM V7.2](https://reliabilityweb.com/news/article/bentleys_enhanced_assetwise_apm_v7.2_features_immersive_environment)
- [Bentley -- AssetWise Inspections Product Data Sheet (PDF)](https://www.bentley.com/wp-content/uploads/pds-assetwise-inspections-ltr-en-lr.pdf)

---

## 5. Honeywell Forge APM

### Asset Detail and Monitoring Interface

Honeywell Forge APM uses a **unified dashboard** approach with multiple drill-down paths.

**Top-level navigation:**
- Tree Maps and Heat Maps for rapid drill-down to problem areas
- Asset hierarchy naming convention: `Plant1.FCCU.HeatEx100.InFlow`
- This hierarchical naming is visible in the UI for intuitive attribute selection during trending

**Event Monitor:**
- Monitor and review all new events
- From the event list, access: detailed event view, event trends, action options (accept/reject/close)

**Fault Logic Displays:**
- Troubleshooting displays showing underlying fault logic
- Rapid access to fault history from the tree/heat map views
- Predefined fault models, fault trees, KPIs, causes, consequences, corrective actions built into asset models

**Monitoring Approach:**
- Predictive analytics monitoring both health AND performance (not just condition)
- Multiple modeling methods: first-principle efficiency models, ML anomaly detection, mechanical fault monitoring
- Early detection focus (leading indicators vs. lagging condition data)
- Unified view combining: performance metrics, asset alerts, identified performance opportunities, recommendations

**Key UI Patterns:**
- Configurable tree and heat-maps as primary navigation
- Drill-down from fleet view to individual asset to specific fault
- Trend displays accessible from any level
- Graphic displays configurable per asset type

**Sources:**
- [Honeywell Forge APM Product Page](https://process.honeywell.com/us/en/products/industrial-software/asset-reliability/honeywell-forge-performance-plus-for-industrials-asset-performance)
- [Honeywell Forge APM Product Information Note (PDF)](https://process.honeywell.com/content/dam/process/en/documents/document-lists/PINForgeAPMR1-v1.pdf)
- [Honeywell APM Brochure (PDF)](https://process.honeywell.com/content/dam/forge/en/documents/brochures/hon-asset-performance-management-brochure.pdf)
- [Honeywell Turbomachinery Advisor](https://process.honeywell.com/us/en/products/industrial-software/asset-reliability/honeywell-forge-performance-plus-for-industrials-asset-performance/honeywell-turbomachinery-advisor)

---

## 6. Uptake APM

Uptake focuses on **fleet-level predictive maintenance** with AI-driven insights.

### Dashboard Structure
- Fleet overview: at-a-glance view of entire portfolio to identify high-risk assets
- Filter alerts by: time, severity, location, affected systems
- 90-day insight window: how many assets produced insights, total insights generated
- Customizable reports highlighting KPIs, trends, opportunities

### Predictive Capabilities
- Three core modules: **Prevent** (optimize maintenance strategies), **Monitor** (monitor for decisions), **Predict** (proactive decisions from predictions)
- Analyzes 30-90 day data windows: faults, signals, insights, repairs
- Failure insights for predicting/preventing breakdowns
- Asset-centric and fleet-wide visualization modes

**Sources:**
- [Uptake -- Fleet Health Dashboard](https://uptake.com/blog/the-new-dashboard-in-fleet-health/)
- [Uptake -- Fleet Management Analytics](https://uptake.com/topics/fleet-management-analytics/)
- [Uptake -- Next Gen APM Solution (PR Newswire)](https://www.prnewswire.com/news-releases/uptake-unveils-next-generation-ai-enabled-asset-performance-management-solution-300729343.html)

---

## 7. Samsara (Industrial IoT / Connected Operations)

Samsara is lighter-weight than traditional APM -- focused on connected physical operations (fleet, equipment, facilities).

### Asset Detail Page
- **Location section:** Last known location (updated hourly), live view for real-time tracking
- **Sensors section:** Sensors appear on vehicle/asset details page. Visualize source location of sensor readings from dashboard.
- **Meter readings:** Mileage and engine hours updated automatically for synced equipment. Triggers PM schedules.
- **Alerts:** Geofence alerts, door/humidity/temperature condition alerts
- **Bluetooth tracking** for unpowered assets, real-time diagnostics for powered equipment

**Sources:**
- [Samsara -- Asset Tracking](https://www.samsara.com/products/equipment-tracking/asset-tracking)
- [Samsara -- Equipment Tracking](https://www.samsara.com/products/equipment-tracking)
- [Samsara Help Center -- Sensor Management](https://kb.samsara.com/hc/en-us/articles/360051759232-Sensor-Management)

---

## 8. Industry Standards and Best Practices

### ISO 55000 (Asset Management)

ISO 55000 is the international framework for asset management. Key principles relevant to asset detail UI:

- **Risk-based prioritization:** Inspections should be prioritized by criticality. UI should surface criticality prominently.
- **Data collection:** Encourages comprehensive data capture during inspections. Mobile data collection tools and real-time sensors.
- **Condition monitoring integration:** Inspections assess current state, identifying wear, degradation, or damage before failure escalation.
- **Decision support:** Asset data should enable better decision-making about maintenance strategies, replacement timing, investment allocation.

**Sources:**
- [ISO 55000 and Asset Inspection (Fracttal)](https://www.fracttal.com/en/blog/iso-55000)
- [ISO 55000 Best Practices (Unvired)](https://unvired.com/blog/iso-55000-asset-management-best-practices/)
- [ISO 55000 Standard Overview (Reliabilityweb)](https://reliabilityweb.com/articles/entry/iso-55000_asset_management_standard_what_to_expect)

### ISA-101 (Human Machine Interfaces for Process Automation)

ISA-101 is the lifecycle standard for HMI design. Directly applicable to APM displays:

**Core principles:**
- **Situational awareness:** Perception of elements, comprehension of meaning, projection of future status
- **Minimalism:** Gray-scale base. Color reserved exclusively for live data, alarms, and abnormal conditions
- **Medium gray background** (RGB 192,192,192) recommended -- colors stand out clearly, minimizes eye fatigue, comfortable in varied lighting
- **Alarm color reservation:** Alarm colors (red, amber, etc.) should NEVER be used for static/decorative elements. Critical alarms must look and behave differently from advisory notifications.
- **Redundant coding:** Alarm conditions coded by shape + color + text (never color alone)
- **Alarm management:** Target fewer than 1 alarm per 10 minutes during normal operation. Every alarm should include: what happened, where it happened, what the operator should do.

**Display hierarchy (4 levels):**

| Level | Purpose | Content |
|---|---|---|
| **L1 -- Overview** | Process area overview | High-level status, alarms/alerts in cogent display |
| **L2 -- Area** | Functional area detail | Group of related assets or process units |
| **L3 -- Unit/Equipment** | Individual asset detail | Detailed readings, trends, controls |
| **L4 -- Diagnostics** | Support and troubleshooting | Detailed sensor data, fault trees, historical analysis |

**Navigation:** Consistent menu hierarchies, screen navigation conventions, graphics and color conventions, dynamic element behavior, alarming conventions, security methods.

**Human factors:** Considers sensory and cognitive limits of operators. Situation awareness without distractions. Fewer errors, more efficient workflows.

**Sources:**
- [ISA-101 Standards (ISA.org)](https://www.isa.org/standards-and-publications/isa-standards/isa-101-standards)
- [ISA-101 How-to Guide (Tatsoft)](https://docs.tatsoft.com/display/FX/ISA-101+HMI+Compliance+How-to+Guide)
- [ISA-101 Lifecycle Standard (ARC Advisory)](https://www.arcweb.com/industry-best-practices/how-isa-101-lifecycle-standard-improves-operator-effectiveness-display)
- [ISA 101 High Performance HMI (Adroit Technologies)](https://adroit-europe.com/hphmi)
- [Rockwell Automation HMI Style Guide (PDF)](https://literature.rockwellautomation.com/idc/groups/literature/documents/wp/proces-wp023_-en-p.pdf)
- [HMI Design Best Practices (NFM Consulting)](https://nfmconsulting.com/knowledge/hmi-design-best-practices/)
- [HMI Best Practices (AMD Machines)](https://amdmachines.com/blog/hmi-design-best-practices-for-operators/)

---

## 9. Cross-Platform Patterns (Synthesis)

### Common Sections on Asset Detail Pages

Almost every APM tool includes these sections (in roughly this priority order):

1. **Identity header:** Asset name/ID, description, status, location, criticality badge
2. **Health/condition score:** Numeric score (0-100) or traffic-light status. Always above the fold.
3. **KPI cards row:** Small cards showing key metrics (health, criticality, risk, end of life, next PM, failure probability, MRR)
4. **Health/condition trend:** Line chart of health score or condition indicator over time, with threshold bands
5. **Active alerts/alarms:** Current warnings and alerts with severity, timestamp, and recommended action
6. **Work order history:** Table or timeline of WOs, inspections, PMs associated with the asset
7. **Equipment hierarchy / sub-assets:** Tree view (usually in a sidebar or collapsible panel) showing parent-child relationships
8. **Sensor/indicator readings:** Time-series data with trend charts, threshold overlays, and reading history tables
9. **Recommendations:** Action items generated from condition data, with links back to the triggering indicator
10. **Specifications/attributes:** Static asset metadata (manufacturer, model, serial, install date, rated capacity)
11. **Spare parts / BOM:** Associated items for maintenance planning
12. **Documents/attachments:** Manuals, P&IDs, inspection reports, photos

### How Sub-Assets / Equipment Hierarchy is Displayed

| Pattern | Used By |
|---|---|
| **Left sidebar tree** | GE APM (Asset Hierarchy pane), SAP PM (structure tab) |
| **Subassemblies table within a tab** | IBM Maximo Manage (Spare Parts tab) |
| **Hierarchical path breadcrumb** | Honeywell Forge (Plant1.FCCU.HeatEx100.InFlow) |
| **3D/2D model with clickable components** | Bentley AssetWise (hypermodeling) |
| **Roll-up indicators from children** | GE APM (subsidiary asset indicators) |

### How Work Orders Connect to Condition Data

| Pattern | Used By |
|---|---|
| **Auto-generate WO from threshold breach** | IBM Maximo (meter action limits), SAP APM (rules engine on indicators) |
| **Recommendation-to-WO pipeline** | GE APM (recommendations from alert/warning status) |
| **Failure markers on health trend** | IBM Maximo Health (WOs with problem codes plotted on health history) |
| **Event association** | GE APM (events include WO history, inspections, calibrations) |
| **Alert-to-notification-to-order** | SAP APM (alerts trigger maintenance orders in S/4HANA) |

### How Sensor/Threshold Data is Shown

| Pattern | Used By |
|---|---|
| **Line chart with colored threshold bands** | GE APM (shaded limit areas with status colors), SAP APM (overlay thresholds on 2D chart) |
| **Reading history table** | GE APM (status + timestamp + value per reading), IBM Maximo (meter reading log) |
| **Indicator cards** | SAP APM (individual indicator cards with source info) |
| **Heat maps for fleet-level anomaly spotting** | Honeywell Forge, Uptake |
| **Forecast overlay** | SAP APM (indicator forecasting on monitoring chart), IBM Predict (failure probability curve) |

### Common KPIs at Asset Level

- Health Score (0-100 or traffic light)
- Criticality (letter grade or numeric)
- Risk Score (health x criticality matrix)
- Mean Time Between Failures (MTBF)
- Mean Time To Repair (MTTR)
- Maintenance-to-Replacement Ratio (MRR)
- Remaining Useful Life (RUL) / End of Life date
- Effective Age (adjusted for condition)
- Failure Probability (days to predicted failure)
- Availability / Uptime percentage
- Next PM date
- Last inspection date
- Corrosion rate (for thickness monitoring)

---

## 10. UX Pain Points (What Reliability Engineers Complain About)

Based on G2 reviews, industry forums, and competitive analysis:

### Across all platforms:
1. **Outdated UIs:** SAP PM specifically called out as looking "like it belonged on a computer from 1990." Small text, no clear icons. Many APM tools are engineer-built, not designer-built.
2. **Slow performance:** Enterprise Asset Management systems noted for slowness, especially when saving data. Large datasets in time-series views cause lag.
3. **Too many clicks to reach critical info:** GE Vernova explicitly designed UX enhancements to "minimize the number of clicks and reduce navigation effort for RBI analysts." This implies the previous state was painful.
4. **Poor mobile experience:** Mobile apps described as "clunky" across multiple platforms. Field inspectors need mobile-first interfaces but get desktop ports.
5. **Integration complexity:** Connecting APM to ERP, SCADA, IoT platforms described as difficult or requiring significant technical expertise.
6. **Lack of dashboarding:** Some platforms lack built-in dashboarding, requiring third-party BI tools.
7. **Limited customization:** Workflows and forms often rigid. Reliability engineers want to configure their own views.
8. **Alert fatigue:** Too many alerts with insufficient context. Relates directly to ISA-101's guidance on alarm management.
9. **Alerts not visible in context:** SAP APM (as of 2024) only shows alerts from a global alerts tile, not in the asset detail view. This is on their roadmap to fix.
10. **Data quality gaps:** IBM Maximo Health specifically has "work queues" to surface assets with missing installation dates, incomplete replacement costs, etc. -- acknowledging that bad data is endemic.

### Implication for the portfolio demo:
The bar for APM UI quality is remarkably low. A well-designed asset detail page that follows ISA-101 principles, uses proper hierarchy, shows condition-to-action flow clearly, and works on modern screen sizes would stand out sharply against the competition.

---

## 11. Design Implications for APM Dashboard Portfolio Project

Based on this research, the Asset Inspection/Detail view should:

1. **Lead with health score and KPI cards** -- every major tool puts this above the fold
2. **Show the condition-to-action pipeline** clearly: sensor reading -> threshold breach -> alert -> recommendation -> work order. This is the core workflow reliability engineers care about, and most tools fragment it across tabs.
3. **Use ISA-101 "dark and quiet" principles** -- already established in the project. Gray base, color reserved for abnormal states. This aligns with industry best practice and differentiates from the garish UIs most APM tools ship.
4. **Equipment hierarchy in a sidebar or breadcrumb**, not buried in a tab. GE APM's left-pane tree is the strongest pattern.
5. **Trend chart with threshold bands** is table stakes. Every tool has this. The differentiation is in clarity of the visualization and connection to resulting actions.
6. **Recommendations should live alongside the data that generated them**, not in a separate module. GE APM does this well.
7. **Timeline of work history with failure markers overlaid on health trend** -- IBM Maximo Health does this. Very powerful for pattern recognition.
8. **Avoid the "tab graveyard"** pattern from Maximo Manage and SAP PM. Modern APM tools (Maximo Health, GE APM) trend toward single-page dashboards with expandable sections.
9. **Mobile inspection is a massive gap** in the industry. Even a responsive detail view would be notable.
10. **Data freshness indicator** -- timestamp of last reading. This was already flagged in the heuristic audit (H1-01). Every competitor shows this; it's not optional.
