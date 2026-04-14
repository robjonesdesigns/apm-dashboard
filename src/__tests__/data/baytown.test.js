import { describe, it, expect } from 'vitest'
import {
  PLANT,
  OEE_TREND,
  KPI_24H,
  ASSETS,
  TIMELINE,
  INCIDENTS,
  WORK_ORDERS,
  INVESTIGATIONS,
  NOTIFICATIONS,
  K101_DEGRADATION,
  K101_FAULT_TREE,
  RELIABILITY_METRICS,
  DOWNTIME_BY_SUBASSET,
  MAINTENANCE_WORK_ORDERS,
  MAINTENANCE_KPIS,
  PERFORMANCE_ATTRIBUTES,
  BAD_ACTORS,
  RISK_MATRIX,
  EVENT_SUMMARY,
  deriveEventSeverity,
  deriveMTBF,
  deriveMTTR,
  deriveRUL,
  deriveAvailability,
  deriveAssetOEE,
  derivePlantOEE,
  getActiveIncident,
} from '../../data/baytown'

// ── PLANT data integrity ────────────────────────────────────────────────────

describe('PLANT', () => {
  it('has all required KPI fields', () => {
    expect(PLANT.name).toBeTruthy()
    expect(typeof PLANT.oee).toBe('number')
    expect(typeof PLANT.availability).toBe('number')
    expect(typeof PLANT.performance).toBe('number')
    expect(typeof PLANT.quality).toBe('number')
  })

  it('has previous KPI values for delta calculation', () => {
    expect(typeof PLANT.previousOee).toBe('number')
    expect(typeof PLANT.previousAvailability).toBe('number')
    expect(typeof PLANT.previousPerformance).toBe('number')
    expect(typeof PLANT.previousQuality).toBe('number')
  })

  it('has health thresholds for oee, availability, performance, quality', () => {
    const keys = ['oee', 'availability', 'performance', 'quality']
    keys.forEach(key => {
      expect(PLANT.thresholds[key]).toBeDefined()
      expect(typeof PLANT.thresholds[key].warning).toBe('number')
      expect(typeof PLANT.thresholds[key].critical).toBe('number')
      expect(PLANT.thresholds[key].warning).toBeGreaterThan(PLANT.thresholds[key].critical)
    })
  })

  it('activeAssets does not exceed totalAssets', () => {
    expect(PLANT.activeAssets).toBeLessThanOrEqual(PLANT.totalAssets)
  })
})

// ── OEE_TREND data integrity ────────────────────────────────────────────────

describe('OEE_TREND', () => {
  it('has 12 months of data', () => {
    expect(OEE_TREND).toHaveLength(12)
  })

  it('every entry has month, oee, availability, performance, quality', () => {
    OEE_TREND.forEach(entry => {
      expect(entry.month).toBeTruthy()
      expect(typeof entry.oee).toBe('number')
      expect(typeof entry.availability).toBe('number')
      expect(typeof entry.performance).toBe('number')
      expect(typeof entry.quality).toBe('number')
    })
  })

  it('all KPI values are between 0 and 100', () => {
    OEE_TREND.forEach(entry => {
      ;['oee', 'availability', 'performance', 'quality'].forEach(key => {
        expect(entry[key]).toBeGreaterThanOrEqual(0)
        expect(entry[key]).toBeLessThanOrEqual(100)
      })
    })
  })
})

// ── KPI_24H data integrity ──────────────────────────────────────────────────

describe('KPI_24H', () => {
  it('has 13 hourly snapshots', () => {
    expect(KPI_24H).toHaveLength(13)
  })

  it('every entry has time and all four KPI fields', () => {
    KPI_24H.forEach(entry => {
      expect(entry.time).toBeTruthy()
      expect(typeof entry.oee).toBe('number')
      expect(typeof entry.availability).toBe('number')
      expect(typeof entry.performance).toBe('number')
      expect(typeof entry.quality).toBe('number')
    })
  })

  it('shows the K-101 trip drop (OEE drops after 2 AM)', () => {
    const before = KPI_24H.find(e => e.time === '2 AM')
    const after = KPI_24H.find(e => e.time === '3 AM')
    expect(after.oee).toBeLessThan(before.oee)
    expect(after.availability).toBeLessThan(before.availability)
  })
})

// ── ASSETS data integrity ───────────────────────────────────────────────────

describe('ASSETS', () => {
  it('has 10 assets', () => {
    expect(ASSETS).toHaveLength(10)
  })

  it('every asset has required fields', () => {
    ASSETS.forEach(asset => {
      expect(asset.id).toBeTruthy()
      expect(asset.name).toBeTruthy()
      expect(asset.type).toBeTruthy()
      expect(['A', 'B', 'C', 'D']).toContain(asset.criticality)
      expect(['running', 'tripped', 'degraded', 'planned-outage']).toContain(asset.status)
      expect(typeof asset.oee).toBe('number')
    })
  })

  it('every asset has unique id', () => {
    const ids = ASSETS.map(a => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every asset has oeeTrend, rulTrend, downtimeTrend arrays', () => {
    ASSETS.forEach(asset => {
      expect(Array.isArray(asset.oeeTrend)).toBe(true)
      expect(Array.isArray(asset.rulTrend)).toBe(true)
      expect(Array.isArray(asset.downtimeTrend)).toBe(true)
    })
  })

  it('derived event counts are non-negative integers', () => {
    ASSETS.forEach(asset => {
      expect(asset.totalEvents).toBeGreaterThanOrEqual(0)
      expect(asset.newEvents).toBeGreaterThanOrEqual(0)
      expect(asset.inProgressEvents).toBeGreaterThanOrEqual(0)
      expect(asset.closedEvents).toBeGreaterThanOrEqual(0)
      expect(Number.isInteger(asset.totalEvents)).toBe(true)
    })
  })

  it('production weights sum to approximately 1.0', () => {
    const totalWeight = ASSETS.reduce((sum, a) => sum + (a.productionWeight || 0), 0)
    expect(totalWeight).toBeCloseTo(1.0, 1)
  })

  it('K-101 is tripped with criticality A', () => {
    const k101 = ASSETS.find(a => a.id === 'K-101')
    expect(k101).toBeDefined()
    expect(k101.status).toBe('tripped')
    expect(k101.criticality).toBe('A')
  })
})

// ── TIMELINE data integrity ─────────────────────────────────────────────────

describe('TIMELINE', () => {
  it('is a non-empty array', () => {
    expect(TIMELINE.length).toBeGreaterThan(0)
  })

  it('every event has id, assetId, severity, status', () => {
    TIMELINE.forEach(evt => {
      expect(evt.id).toBeTruthy()
      expect(evt.assetId).toBeTruthy()
      expect(['critical', 'high', 'medium', 'low']).toContain(evt.severity)
      expect(['new', 'in-progress', 'closed', 'false-positive']).toContain(evt.status)
    })
  })

  it('every event references a valid asset', () => {
    const assetIds = new Set(ASSETS.map(a => a.id))
    TIMELINE.forEach(evt => {
      expect(assetIds.has(evt.assetId)).toBe(true)
    })
  })
})

// ── WORK_ORDERS data integrity ──────────────────────────────────────────────

describe('WORK_ORDERS', () => {
  it('is a non-empty array', () => {
    expect(WORK_ORDERS.length).toBeGreaterThan(0)
  })

  it('every WO has id, assetId, task, urgency', () => {
    WORK_ORDERS.forEach(wo => {
      expect(wo.id).toBeTruthy()
      expect(wo.assetId).toBeTruthy()
      expect(wo.task).toBeTruthy()
      expect(['emergency', 'urgent', 'scheduled']).toContain(wo.urgency)
    })
  })
})

// ── INVESTIGATIONS data integrity ───────────────────────────────────────────

describe('INVESTIGATIONS', () => {
  it('is a non-empty array', () => {
    expect(INVESTIGATIONS.length).toBeGreaterThan(0)
  })

  it('every investigation has id and assetId', () => {
    INVESTIGATIONS.forEach(inv => {
      expect(inv.id).toBeTruthy()
      expect(inv.assetId).toBeTruthy()
    })
  })
})

// ── INCIDENTS data integrity ────────────────────────────────────────────────

describe('INCIDENTS', () => {
  it('has at least one incident', () => {
    expect(INCIDENTS.length).toBeGreaterThan(0)
  })

  it('each incident references valid event IDs from TIMELINE', () => {
    const eventIds = new Set(TIMELINE.map(e => e.id))
    INCIDENTS.forEach(inc => {
      inc.eventIds.forEach(eid => {
        expect(eventIds.has(eid)).toBe(true)
      })
    })
  })
})

// ── NOTIFICATIONS ───────────────────────────────────────────────────────────

describe('NOTIFICATIONS', () => {
  it('is derived from TIMELINE events with time field', () => {
    expect(NOTIFICATIONS.length).toBeGreaterThan(0)
    NOTIFICATIONS.forEach(n => {
      expect(n.time).toBeTruthy()
      expect(n.severity).toBeTruthy()
      expect(n.asset).toBeTruthy()
    })
  })
})

// ── Derived data arrays ─────────────────────────────────────────────────────

describe('BAD_ACTORS', () => {
  it('has at most 5 entries sorted by events descending', () => {
    expect(BAD_ACTORS.length).toBeLessThanOrEqual(5)
    for (let i = 1; i < BAD_ACTORS.length; i++) {
      expect(BAD_ACTORS[i].events).toBeLessThanOrEqual(BAD_ACTORS[i - 1].events)
    }
  })
})

describe('RISK_MATRIX', () => {
  it('has entries for criticality A, B, C', () => {
    const crits = RISK_MATRIX.map(r => r.criticality)
    expect(crits).toContain('A')
    expect(crits).toContain('B')
    expect(crits).toContain('C')
  })

  it('each row has non-negative newEvents and inProgress', () => {
    RISK_MATRIX.forEach(row => {
      expect(row.newEvents).toBeGreaterThanOrEqual(0)
      expect(row.inProgress).toBeGreaterThanOrEqual(0)
    })
  })
})

describe('EVENT_SUMMARY', () => {
  it('has confirmed, falsePositives, newEvents, and total', () => {
    expect(typeof EVENT_SUMMARY.confirmed).toBe('number')
    expect(typeof EVENT_SUMMARY.falsePositives).toBe('number')
    expect(typeof EVENT_SUMMARY.newEvents).toBe('number')
    expect(EVENT_SUMMARY.total).toBe(
      EVENT_SUMMARY.confirmed + EVENT_SUMMARY.falsePositives + EVENT_SUMMARY.newEvents
    )
  })
})

describe('K101_DEGRADATION', () => {
  it('has multiple data points with expected sensor fields', () => {
    expect(K101_DEGRADATION.length).toBeGreaterThan(10)
    K101_DEGRADATION.forEach(point => {
      expect(typeof point.day).toBe('number')
      expect(typeof point.vibration).toBe('number')
      expect(typeof point.bearingTemp).toBe('number')
      expect(typeof point.oilPressure).toBe('number')
      expect(typeof point.surgeMargin).toBe('number')
    })
  })

  it('ends in a trip status', () => {
    const last = K101_DEGRADATION[K101_DEGRADATION.length - 1]
    expect(last.status).toBe('trip')
  })
})

describe('K101_FAULT_TREE', () => {
  it('has a top-level event with children', () => {
    expect(K101_FAULT_TREE.event).toBeTruthy()
    expect(K101_FAULT_TREE.children.length).toBeGreaterThan(0)
  })

  it('contains the root cause (Filter Bypass)', () => {
    function findRootCause(node) {
      if (node.rootCause) return node
      if (node.children) {
        for (const child of node.children) {
          const found = findRootCause(child)
          if (found) return found
        }
      }
      return null
    }
    const root = findRootCause(K101_FAULT_TREE)
    expect(root).not.toBeNull()
    expect(root.event).toBe('Filter Bypass')
  })
})

describe('PERFORMANCE_ATTRIBUTES', () => {
  it('has entries with attribute, value, expected, unit, deviation', () => {
    expect(PERFORMANCE_ATTRIBUTES.length).toBeGreaterThan(0)
    PERFORMANCE_ATTRIBUTES.forEach(attr => {
      expect(attr.attribute).toBeTruthy()
      expect(typeof attr.value).toBe('number')
      expect(typeof attr.expected).toBe('number')
      expect(attr.unit).toBeTruthy()
      expect(typeof attr.deviation).toBe('number')
    })
  })
})

// ── Utility functions ───────────────────────────────────────────────────────

describe('deriveEventSeverity', () => {
  it('returns a valid severity level', () => {
    const result = deriveEventSeverity('trip', 'A')
    expect(['critical', 'high', 'medium', 'low']).toContain(result)
  })

  it('trip on criticality A asset returns critical', () => {
    expect(deriveEventSeverity('trip', 'A')).toBe('critical')
  })

  it('handles unknown event type gracefully', () => {
    const result = deriveEventSeverity('unknown', 'A')
    expect(['critical', 'high', 'medium', 'low']).toContain(result)
  })
})

describe('deriveMTBF', () => {
  it('returns null when no failures in timeline', () => {
    const events = [{ eventType: 'alarm' }, { eventType: 'inspection' }]
    expect(deriveMTBF('K-101', events)).toBeNull()
  })

  it('calculates MTBF from trip events', () => {
    const events = [{ eventType: 'trip' }, { eventType: 'trip' }]
    const result = deriveMTBF('K-101', events)
    expect(typeof result).toBe('number')
    expect(result).toBeGreaterThan(0)
  })
})

describe('deriveMTTR', () => {
  it('returns null when no completed WOs exist', () => {
    const wos = [{ assetId: 'K-101', completedAt: null }]
    expect(deriveMTTR('K-101', wos)).toBeNull()
  })

  it('returns null for an asset with no matching WOs', () => {
    expect(deriveMTTR('NONEXISTENT', WORK_ORDERS)).toBeNull()
  })
})

describe('deriveRUL', () => {
  it('returns null for empty or short trend', () => {
    expect(deriveRUL(null)).toBeNull()
    expect(deriveRUL([])).toBeNull()
    expect(deriveRUL([5])).toBeNull()
  })

  it('returns last value as stable when trend is flat or rising', () => {
    expect(deriveRUL([10, 10])).toBe('10 days')
    expect(deriveRUL([8, 10])).toBe('10 days')
  })

  it('projects days to zero for declining trend', () => {
    const result = deriveRUL([20, 15, 10])
    expect(result).toMatch(/\d+ days/)
    const days = parseInt(result)
    expect(days).toBeGreaterThan(0)
  })
})

describe('deriveAvailability', () => {
  it('returns a value between 0 and 1', () => {
    const result = deriveAvailability('K-101')
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(1)
  })
})

describe('deriveAssetOEE', () => {
  it('returns a percentage between 0 and 100', () => {
    const k101 = ASSETS.find(a => a.id === 'K-101')
    const oee = deriveAssetOEE(k101)
    expect(oee).toBeGreaterThanOrEqual(0)
    expect(oee).toBeLessThanOrEqual(100)
  })
})

describe('derivePlantOEE', () => {
  it('returns a number derived from asset weights', () => {
    const result = derivePlantOEE(ASSETS)
    expect(typeof result).toBe('number')
    expect(result).toBeGreaterThan(0)
    expect(result).toBeLessThanOrEqual(100)
  })
})

describe('getActiveIncident', () => {
  it('returns the highest-priority investigating/open incident', () => {
    const active = getActiveIncident(INCIDENTS)
    expect(active).not.toBeNull()
    expect(['investigating', 'open']).toContain(active.status)
  })

  it('returns null when no active incidents', () => {
    const closed = [{ ...INCIDENTS[0], status: 'resolved' }]
    expect(getActiveIncident(closed)).toBeNull()
  })
})
