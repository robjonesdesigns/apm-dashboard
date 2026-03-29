# APM Dashboard Handoff -- Session 14 End

## START HERE
Session 14 was a massive data enrichment session. All 10 assets have sub-assets in code (65 total). Event model completely restructured with provenance, relationships, incidents, and bidirectional linkages. Event data still needs a careful audit -- we were finding issues with naming, redundancy, and event typing right up to the end of the session. Start next session by reviewing the 9 events and their data for consistency.

## Deployed
- **APM Dashboard**: https://apm-dashboard-eosin.vercel.app
- **Portfolio case study**: https://designedbyrob.com/projects/honeywell-apm

## What was completed this session

### Sub-asset data (COMPLETE)
All 10 assets in ASSETS array now have `subAssets` arrays with full sensor data, thresholds, statuses, narratives, and lessons. 65 sub-assets total, sourced from STORY-002. T-401 status fixed from `planned-outage` to `running`.

### Event model restructure (COMPLETE but NEEDS AUDIT)

#### 9 events in TIMELINE (trimmed from original 12)
Removed 3 non-events:
- WO/case system actions (removed session 13)
- EVT-008 Shutdown Complete (status, not event) -- folded into EVT-005 consequence
- EVT-010 Maintenance Window Opened (scheduling, not event) -- moved to WO-4484 note

| ID | Time | Asset | Event Name | Severity | Event Type |
|---|---|---|---|---|---|
| EVT-001 | 11:00 PM (prev) | K-302 | Discharge Temperature Oscillation | Medium | anomaly |
| EVT-002 | 1:30 AM | K-101 | Oil Pressure Drop | High | alert |
| EVT-003 | 1:45 AM | K-101 | Oil Pressure Alarm | Critical | alarm |
| EVT-004 | 2:00 AM | K-101 | Vibration Exceedance | Critical | alarm |
| EVT-005 | 2:03 AM | K-101 | High Vibration Trip | Critical | trip |
| EVT-006 | 2:04 AM | V-501 | Pressure Transient | Medium | anomaly |
| EVT-007 | 2:05 AM | C-201 | Fan Vibration Anomaly | Medium | anomaly |
| EVT-009 | 4:30 AM | P-203 | Discharge Pressure Low | High | alert |
| EVT-011 | 6:45 AM | K-101 | Bearing Damage Detected | Critical | inspection |

#### 5 event types
- `alert` -- system detected threshold crossing
- `alarm` -- escalated alert, higher severity threshold
- `trip` -- protection system automatically acted
- `anomaly` -- pattern detected outside normal behavior
- `inspection` -- human observation during physical inspection

#### Provenance on metadata fields
cause/consequence/recommendation are now objects with:
```
{ text, source, confidence, updatedBy, updatedAt, status }
```
- source: 'system' | 'model' | 'human'
- status: 'auto-generated' | 'under-review' | 'confirmed'
- ProvenanceLine component renders subtle italic annotation in drill-in

#### Relationships
Each event has `relationships` array:
```
[{ type: 'caused_by' | 'cascaded_to' | 'related_to', eventId }]
```

#### Incidents
New `INCIDENTS` export. INC-001 groups the K-101 cascade:
EVT-002, 003, 004, 005, 006, 007, 011 with cross-references to WOs and investigations.

#### Bidirectional linkages
- WORK_ORDERS: added `eventId` and `linkedInvestigations`
- CASES: added `linkedEvents` and `incidentId`
- Every entity can reach every other entity

### NotificationsPanel updates
- `getEventDetails()` reads `.text` from provenance objects
- ProvenanceLine component shows source under each metadata section
- Incident membership badge (teal link)
- Related Events section with relationship labels
- Linked WOs and Investigations as vertical teal link lists
- Notification cards restructured: badge + time, event name, asset (teal), description
- Detail panel summary matches card hierarchy
- Section spacing increased to 24px for readability

## NEEDS AUDIT NEXT SESSION

### Event data consistency
We were finding issues right up to the end:
- EVT-005 had wrong sub-asset (Drive End Bearing instead of null) -- FIXED
- EVT-005 name was "Compressor Trip" (redundant with asset) -- FIXED to "High Vibration Trip"
- Some event description text may still reference old event names or removed events (EVT-008, EVT-010)
- Need to check all cause/consequence/recommendation prose for references to removed events
- Need to verify each event's sub-asset assignment makes sense
- Need to verify each event name reads well on the notification card (no redundancy with asset name)
- eventType field is not yet rendered in the UI -- could show as a subtle tag on cards

### Naming updates (end of session)
All pushed and deployed:
- Section headers: System Health, What Happened?, In Progress, Needs Action, Assets
- Sidebar/TopBar: Root Cause -> Fault Tree
- Notification panel header: Notifications -> Event Feed
- Quick Access links: Asset Details -> Asset Inspection, Event Trend -> Trends

### Needs Action cards: consistent filter-to-table interaction
All three cards (Risk Matrix, Alarm Quality, Bad Actors) should filter the Asset Table on click with the same affordance:
- Hover: teal border around the card + transparent teal overlay on the data viz area
- Click: filter Asset Table + smooth scroll to it + filter chip in toolbar
- Risk Matrix: filter by criticality/event combination
- Alarm Quality: filter by event validation status (confirmed, false positive, new)
- Bad Actors: filter to specific asset
Currently only Risk Matrix filters. Alarm Quality and Bad Actors need wiring.

### WO-4484 (T-401)
Now has `status: 'pending-decision'` and a `note` field with the maintenance scheduling context that was on EVT-010. TodaysActivity may need to handle this new status and note field.

### Broader UI touchpoints for incident/provenance
Currently only visible in notification drill-in. Discussion identified two more places it should surface:
- WhatChanged timeline: group K-101 events under incident
- TodaysActivity: show incident tag on linked investigations

## After audit: Asset Inspection screen

## Game/training concept
Saved to memory (`project_apm_game_concept.md`). Turn the dashboard into an interactive training game where events arrive as raw signals and the user enriches them in real-time. Separate opportunity from the portfolio demo.

## Key files modified this session
- `src/data/assets.js` -- sub-assets, event model, provenance, relationships, incidents, bidirectional WO/case linkages
- `src/components/NotificationsPanel.jsx` -- ProvenanceLine, incident badge, relationships, card restructure
