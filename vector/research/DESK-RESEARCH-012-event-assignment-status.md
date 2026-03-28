# DESK-RESEARCH-012: Event/Alarm Assignment Status and View Switching Patterns

**Date:** 2026-03-27
**Status:** Complete
**Scope:** How industrial monitoring dashboards present event/alarm assignment status, triage patterns, risk matrix interactions, and view switching. Directly supports Risk Matrix redesign (SESSION-CHECKLIST-003 item 1).

---

## 1. Event Lifecycle Terminology

### ISA-18.2 / IEC 62682 Alarm States

ISA-18.2 defines alarm states as a combination of **process condition** and **operator response**. The standard's state transition diagram uses these core states:

| State | Process | Operator |
|-------|---------|----------|
| Normal | Normal | -- |
| Unacknowledged (Active) | Abnormal | Not yet acknowledged |
| Acknowledged (Active) | Abnormal | Acknowledged |
| Return-to-Normal Unacknowledged | Normal | Not yet acknowledged |
| Latched | Returned to normal but held active until operator clears |

Additional suppression states: **Shelved** (operator-initiated temporary suppression), **Suppressed by Design** (logic-based, e.g., during startup), **Out of Service** (disabled for maintenance).

IEC 62682 is the international version of ISA-18.2, functionally equivalent. OPC UA Part 9 maps both standards' states into a software-implementable model.

**Key insight:** ISA-18.2 does NOT use "New/In Progress" or "Assigned/Unassigned." Its model is about **alarm condition** (active vs. cleared) and **operator acknowledgment** (acknowledged vs. unacknowledged). There is no concept of "assignment to a person" in the alarm management standard. Assignment is a CMMS/ITSM concern, not an alarm management concern.

### CMMS Work Order Status Terminology

**IBM Maximo** uses these statuses (abbreviations are system-standard):

| Status | Abbreviation | Meaning |
|--------|-------------|---------|
| Waiting for Approval | WAPPR | Created, not yet approved |
| Approved | APPR | Approved to start, materials reserved |
| In Progress | INPRG | Work underway, actual start date set |
| Completed | COMP | Work done, actual finish date set |
| Closed | CLOSE | Reviewed and closed |

Additional statuses: WMATL (Waiting on Material), WSCH (Waiting to be Scheduled), CAN (Cancelled). Maximo allows skipping statuses (e.g., WAPPR directly to CLOSE).

**SAP PM** uses a similar flow with configurable user status profiles: Unplanned, Under Review, Planned, Released, Completed.

**Pattern:** CMMS systems use a **planning lifecycle** (waiting, approved, in progress, complete, closed). "New" maps to WAPPR. "In Progress" maps to INPRG. "Assigned" is not a standard CMMS status -- it is an attribute (the "Assigned To" field) that exists at every status.

### APM Platform Event States

**GE Digital APM (Predix/Vernova):** Alerts use acknowledgment states similar to ISA-18.2. Operators can acknowledge alerts with "Valid," "Sensor Issue," or "Reset State." Acknowledgment can be one-time (clears on next reading) or time-based (until a specified date). No "Assigned/Unassigned" concept at the alert level -- assignment happens when a recommendation (the GE term for a work request) is created from the alert.

**Splunk ITSI:** Uses **New / In Progress / Resolved / Closed** for notable event episodes. When an analyst acknowledges an episode, it moves from New to In Progress. This is the closest match to the "New/In Progress" model in the Figma design.

**PagerDuty:** Uses **Triggered / Acknowledged / Resolved**. "Triggered" means the incident exists and is notifying. "Acknowledged" means someone claimed ownership (escalation pauses). "Resolved" means fixed. Incidents must be assigned to a user. Unassigned is not a status -- it is the absence of assignment.

### Summary: "New/In Progress" vs. "Assigned/Unassigned"

| System | Model | States |
|--------|-------|--------|
| ISA-18.2 | Condition + Acknowledgment | Active/Cleared x Ack/Unack |
| Maximo | Planning lifecycle | WAPPR / APPR / INPRG / COMP / CLOSE |
| SAP PM | Planning lifecycle | Unplanned / Planned / Released / Completed |
| GE APM | Acknowledgment | Valid / Sensor Issue / Reset |
| Splunk ITSI | Triage lifecycle | New / In Progress / Resolved / Closed |
| PagerDuty | Incident lifecycle | Triggered / Acknowledged / Resolved |
| ServiceNow | Incident lifecycle | New / In Progress / On Hold / Resolved / Closed |
| Grafana | Alert state | Firing / Pending / Normal (Inactive) |

**Verdict:** "New/In Progress" is standard incident/triage terminology (Splunk, ServiceNow, PagerDuty-equivalent). "Assigned/Unassigned" is NOT a standard lifecycle state in any system reviewed. It is an orthogonal attribute. The Figma View 2 (Event Status) using "New/In Progress" on one axis is well-grounded in industry convention.

---

## 2. Triage Dashboard Patterns

### How platforms present "what needs attention" vs. "what's being handled"

**PagerDuty:**
- Primary view is a **filterable list** of incidents.
- Top-level tabs: "Assigned to me" vs. "All" -- this is the closest thing to an assigned/unassigned split.
- Filter bar with status pills: Open, Triggered, Acknowledged, Resolved, Any Status.
- Each incident row shows: title, service, assignee, priority, duration.
- No matrix view. Pure list with filters.

**ServiceNow:**
- Incident queue is a **sortable table** (list view is default).
- Left nav groups: "Active," "Active P1," "Assigned to Me," "My Groups Work," "My Groups Unassigned Work."
- "My Groups Unassigned Work" is a saved filter, not a separate view -- it shows the same table filtered to assignment_group = my group AND assigned_to = empty.
- Triage is: classify into the right assignment group, then assign to a person.
- Self-assignment via "Assign to me" button.

**Grafana:**
- Alert list panel shows alerts in a **vertical list** with state badges (Firing, Pending, Normal).
- Alert states: Firing (active problem), Inactive (resolved), Pending (threshold not yet breached).
- Suppression states: Silenced, Muted (configured but not alerting).
- Alerting Insights dashboard provides pre-built views breaking down firing alerts by status: active, suppressed, unprocessed.
- No assignment concept -- Grafana alerts are stateless regarding ownership. They fire and resolve.

**Splunk ITSI:**
- Episode Review dashboard is the triage view.
- Episodes are grouped notable events.
- Status flow: New (just detected) -> In Progress (analyst claimed it) -> Resolved -> Closed.
- Each episode has: severity, status, owner, title, notable event count, duration.
- View is a **filterable list/table** with lane-based grouping options.

### Pattern Summary

Every triage system uses a **filterable list or table** as the primary view. None use a matrix for triage. The matrix pattern appears only in risk assessment contexts (HAZOP, bow-tie analysis), not operational triage.

The universal pattern is:
1. **List of items** (incidents, alerts, episodes) as rows
2. **Status filter** at the top (pills, chips, or dropdown)
3. **Assignment filter** as a separate dimension ("Assigned to me" / "My group" / "Unassigned")
4. **Priority/severity** shown inline on each row (badge, color, icon)

This aligns with the Risk Matrix redesign direction: the matrix serves as a **visual summary and filter control**, not as the triage list itself. The Asset Table below is the actual triage list. The matrix filters the table.

---

## 3. Risk Matrix Interaction Patterns

### Axis Labels in Industrial Software

| Tool | X-Axis | Y-Axis | Grid Size |
|------|--------|--------|-----------|
| ISO 31000 / generic | Likelihood / Probability | Impact / Consequence | 5x5 typical |
| SAP EHS | Likelihood | Severity | Configurable (optional 3rd: Exposure Frequency) |
| Enablon BowTie | Probability | Consequence | Configurable |
| Sphera | Probability | Severity | Configurable |
| HAZOP standard | Frequency | Consequence | 4x4 or 5x5 |

The most common axis pair is **Likelihood x Severity** (or Probability x Impact). In APM context, using **Criticality x Severity** (as in Figma View 3) maps to the asset criticality ranking (how important the asset is) crossed with event severity (how bad the event is). This is non-standard for risk assessment but standard for APM prioritization. Honeywell used this framing.

### Click-to-Filter Interaction

**Power BI risk heatmaps:** Click a cell in the heatmap to cross-filter all other visuals on the dashboard. This is Power BI's native cross-filter behavior. The selected cell highlights; everything else dims. Click again to deselect.

**SAP EHS Risk Heatmap:** Dashboard allows drilling into organization and risk category hierarchies. Known limitation: no organization filter on the heatmap itself (SAP Note 2204987). Filtering is through external slicer controls, not cell clicks.

**Essential ERM (TrackerNetworks):** Interactive risk matrix where clicking a cell "pins" its details to a detail panel. Scatter chart points are also clickable to filter.

**Excel/Dashboard pattern:** Best practice is to use the heatmap as a filter control linked to a detail table via slicer connections. "Top-left for critical KPIs, center for the heatmap, right for drill-down lists."

**Pattern consensus:** Click-to-filter on risk matrix cells is an established pattern in BI tools (Power BI, Tableau) and some ERM platforms. The interaction is:
1. Click a cell -> cell gets a selection border (highlight state)
2. Connected table filters to show only items in that cell
3. Click again (or click elsewhere) to deselect
4. Multi-select is uncommon -- most tools support single-cell selection only

This matches the Figma design's purple/teal border on selected cell -> filters Asset Table below. The pattern is well-established.

---

## 4. "Assigned vs. Unassigned" as a Mental Model

### Does this framing exist in operational dashboards?

**ServiceNow** comes closest: "My Groups Unassigned Work" is a first-class menu item. But it is a filter on the incident list, not a view dimension on a matrix.

**PagerDuty** has "Assigned to me" vs. "All" tabs. Unassigned incidents are implicitly those in "All" but not in "Assigned to me."

**No system reviewed uses "Assigned/Unassigned" as an axis on a matrix or grid.** It is always a filter on a list.

### Does it map to ISA-18.2 or IEC 62682?

No. ISA-18.2 tracks alarm condition (active/cleared) and operator acknowledgment (ack/unack). There is no assignment concept. The alarm is either acknowledged or not. Once a maintenance action is needed, the alarm generates a work request that enters the CMMS domain, where assignment happens.

The closest ISA-18.2 mapping:
- "Unassigned" ~ Unacknowledged (no one has claimed responsibility)
- "Assigned" ~ Acknowledged (someone has claimed it)

But this is a loose analogy. Acknowledgment in ISA-18.2 means "I see it," not "I own the fix."

### Would a reliability engineer understand "Assigned/Unassigned" immediately?

Yes, but with a caveat. A reliability engineer thinks in terms of:
- **Events/alarms** (ISA-18.2 domain): active or cleared, acknowledged or not
- **Work orders** (CMMS domain): who is assigned, what status

The Figma View 2 (Event Status) crosses "New/In Progress" (event lifecycle) with "High/Medium/Low" (priority). This is coherent: it answers "of my events, which are being worked and which are not, broken down by priority."

If the axis said "Unassigned/Assigned" instead of "New/In Progress," a reliability engineer would understand it but might find it odd -- assignment is a work order attribute, and events in APM are not typically "assigned" until they generate a work order. "New/In Progress" is more natural because it describes the event's triage state without implying a CMMS-style assignment.

**Recommendation:** Keep "New/In Progress" as in the Figma design. It aligns with Splunk ITSI, ServiceNow, and PagerDuty conventions. Avoid "Assigned/Unassigned" as a matrix axis -- it conflates the alarm domain with the work management domain.

---

## 5. View Switching Patterns

### How platforms handle multiple views of the same data

**Grafana (v12+):** Dashboard-level tabs. Each tab contains a different set of panels. Used to segment by context, user group, or use case. Tabs are persistent (URL updates), support nested layouts, and appear as horizontal tabs at the top of the dashboard area.

**Datadog:** Dashboard-level tabs to organize widgets. Widgets can be moved between tabs. Each tab shows a different slice of the dashboard.

**Power BI:** Report-level tabs (pages) at the bottom. Within a page, bookmarks + buttons act as view switchers for different states of the same visual. Segmented buttons linked to bookmarks are a common pattern.

**Splunk ITSI:** Dropdown selectors on Episode Review to switch grouping mode (by service, by severity, by status).

### Tabs vs. Segmented Controls vs. Dropdowns

**Nielsen Norman Group guidance:**

| Control | Use When | Behavior |
|---------|----------|----------|
| **Tabs** | Content sections are distinct/independent. User navigates between different content areas. | Reveals entirely different content per tab. |
| **Segmented control** | Same underlying data, different view/format/sort. 2-5 options. All options visible. | Transforms how the same content appears. |
| **Dropdown** | Many options (6+), limited space, or infrequent switching. | Hides options until clicked. Only shows current selection. |
| **Toggle switch** | Binary on/off. Immediate effect, no save button. | Two states only. |

**Key distinction (from NNG):** Tabs show **different content**. Segmented controls show **different views of the same content**. A dropdown hides options, which is appropriate when there are many options or when switching is infrequent.

### Application to the Risk Matrix View Switcher

The three Figma views (Asset Priority, Event Status, Event Summary) show **different views of the same underlying asset/event data**. This is a segmented control use case, not a tabs use case. The data is the same; the grouping and axes change.

| Pattern | Pros | Cons |
|---------|------|------|
| Dropdown (current Figma) | Compact, works if views grow | Hides options, extra click, breaks Nielsen H6 (recognition over recall) |
| Chip toggle / segmented control | All options visible, single click, matches NNG guidance for same-data views | Takes horizontal space (manageable with 3 options) |
| Tabs | Familiar | Semantically wrong -- these are not different content sections |
| Radio buttons | Explicit, accessible | Looks like a form element, not a dashboard control |

**Recommendation:** Use a **segmented control** (chip toggle). Three options fit comfortably in the card header. All options visible at a glance. Matches NNG guidance for "different views of the same content." This was already noted in SESSION-CHECKLIST-003 as the preferred direction.

If the view count grows beyond 5, switch to a dropdown. At 3, a segmented control is optimal.

---

## Design Implications for the Risk Matrix Redesign

1. **View 2 axis labels:** "New/In Progress" is well-grounded in industry convention (Splunk ITSI, ServiceNow, PagerDuty-equivalent). Keep it. Do not use "Assigned/Unassigned."

2. **Click-to-filter interaction:** Established pattern in Power BI, Essential ERM, and dashboard best practice. Selected cell gets a highlight border (teal, per the design system). Filters Asset Table below. Single-cell selection only.

3. **View switcher:** Segmented control (chip toggle), not dropdown. Three options (Asset Priority, Event Status, Event Summary) fit in the card header. All visible, one click, NNG-compliant.

4. **Axis terminology for View 3 (Event Summary):** "Criticality x Severity" is non-standard for risk assessment (which uses Likelihood x Impact) but standard for APM prioritization. A reliability engineer reading "Criticality" thinks "how important is this asset" and reading "Severity" thinks "how bad is this event." Both are immediately understood in industrial context.

5. **The matrix is a filter control, not a triage list.** The Asset Table below is the triage list. This matches every operational dashboard reviewed: matrix/heatmap summarizes, table provides detail.

---

## Sources

- [ISA 18.2 Alarm State Transition Diagram (ICONICS)](https://documentation.iconics.com/v10.97.3/Content/Alarming/Alarm%20Server/Alarm%20References/alarm-state-transition-diagram.htm)
- [Understanding and Applying ANSI/ISA 18.2 (ISA/PAS)](https://www.isa.org/getmedia/55b4210e-6cb2-4de4-89f8-2b5b6b46d954/PAS-Understanding-ISA-18-2.pdf)
- [ISA 18.2 Alarm Management in Process Plants (InstrumentationTools)](https://instrumentationtools.com/isa-18-2-alarm-management-in-process-plants/)
- [Siemens Alarm Management ISA 18.2 White Paper](https://support.industry.siemens.com/cs/attachments/109772836/WP_Alarm_Management_ISA_18.pdf)
- [IEC 62682 Wikipedia](https://en.wikipedia.org/wiki/IEC_62682)
- [OPC UA Part 9 Annex E: IEC 62682 Mapping](https://reference.opcfoundation.org/Core/Part9/v105/docs/E)
- [Maximo Work Order Statuses (IBM Docs)](https://www.ibm.com/docs/en/maximo-eam-saas?topic=orders-work-order-statuses)
- [Maximo Work Order Status Flow (Inside-Out Blog)](https://maximoinsideout.blogspot.com/2015/09/work-order-status-flow.html)
- [UC Berkeley Maximo Status Reference](https://facilities.berkeley.edu/faq/maximo/what-do-different-statuses-work-order-mean)
- [PagerDuty Incidents Documentation](https://support.pagerduty.com/main/docs/incidents)
- [PagerDuty Navigate the Incidents Page](https://support.pagerduty.com/docs/navigating-the-incidents-page)
- [ServiceNow Incident Self-Assignment (UC Berkeley)](https://berkeley.service-now.com/kb_view.do?sysparm_article=KB0010353)
- [ServiceNow Incident Triage (LinkedIn)](https://www.linkedin.com/pulse/servicenow-incident-queue-pavan-poul)
- [Grafana Alert List Panel Documentation](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/alert-list/)
- [Grafana Alerting Insights](https://grafana.com/docs/grafana-cloud/alerting-and-irm/alerting/monitor-status/view-insights/)
- [Splunk ITSI Episode Triage](https://help.splunk.com/en/splunk-it-service-intelligence/splunk-it-service-intelligence/detect-and-act-on-notable-events/4.21/episode-review/triage-episodes-in-itsi)
- [Splunk ITSI Episode Review Overview](https://help.splunk.com/en/splunk-it-service-intelligence/splunk-it-service-intelligence/detect-and-act-on-notable-events/4.19/episode-review/overview-of-episode-review-in-itsi)
- [GE Digital APM Event Management](https://www.ge.com/digital/documentation/onpremises-apm/v51/help/gaa-workflows-event-management.html)
- [GE Digital Alert Severity and Status](https://www.ge.com/digital/documentation/predix-apm/latest/c_apm_alert_severity_and_status.html)
- [SAP EHS Risk Matrix Documentation](https://help.sap.com/docs/EHSM/cfce61ea9ac64c53a591bfcd66d98f56/cb7d38b7189c437e99d83562fe26df85.html)
- [Enablon Risk Matrix (Wolters Kluwer)](https://www.wolterskluwer.com/en/solutions/enablon/bowtie/expert-insights/barrier-based-risk-management-knowledge-base/risk-matrices)
- [Interactive Risk Matrix Tool (Essential ERM)](https://www.trackernetworks.com/resources/risk-matrix)
- [NNG: Tabs Used Right](https://www.nngroup.com/articles/tabs-used-right/)
- [NNG: Toggle Switch Guidelines](https://www.nngroup.com/articles/toggle-switch-guidelines/)
- [NNG: Dropdown Design Guidelines](https://www.nngroup.com/articles/drop-down-menus/)
- [Tabs vs Segmented Controls (Errum, Medium)](https://medium.com/@errumaisha/when-ui-looks-alike-understanding-confusion-between-tabs-and-segmented-controls-fbdfa651f9d9)
- [Segmented Control Best Practices (Mobbin)](https://mobbin.com/glossary/segmented-control)
- [Grafana 12 Dynamic Dashboards (Tabs)](https://grafana.com/blog/dynamic-dashboards-grafana-12/)
- [Datadog Dashboard Documentation](https://docs.datadoghq.com/dashboards/)
