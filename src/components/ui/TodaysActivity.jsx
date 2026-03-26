import { WORK_ORDERS, CASES } from '../../data/assets'

// ── Priority → status dot mapping ────────────────────────────────────────────

const PRIORITY_DOT = {
  critical: 'status-dot-critical',
  high: 'status-dot-warning',
  medium: 'status-dot-info',
  low: 'status-dot-info',
}

// ── Case status → dot mapping ─────────────────────────────────────────────────

const CASE_STATUS_DOT = {
  investigating: 'status-dot-critical',
  open: 'status-dot-warning',
  closed: 'status-dot-healthy',
}

// ── Summary counts ────────────────────────────────────────────────────────────

function buildWoSummary(orders) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 }
  orders.forEach((wo) => { counts[wo.priority] = (counts[wo.priority] || 0) + 1 })
  return counts
}

function buildCaseSummary(cases) {
  const counts = {}
  cases.forEach((c) => { counts[c.status] = (counts[c.status] || 0) + 1 })
  return counts
}

// ── Row styles ────────────────────────────────────────────────────────────────

const rowStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 'var(--spacing-8)',
  padding: 'var(--spacing-12) 0',
  borderBottom: '1px solid var(--color-border)',
  transition: 'background 0.15s ease, border-left 0.15s ease',
}

// ── Inline dot helper ─────────────────────────────────────────────────────────

function Dot({ variant }) {
  return (
    <span
      className={`status-dot ${variant}`}
      style={{ marginTop: 4, flexShrink: 0 }}
    />
  )
}

// ── Work Orders card ──────────────────────────────────────────────────────────

function WorkOrdersCard({ onAssetClick }) {
  const summary = buildWoSummary(WORK_ORDERS)

  return (
    <div className="card col-half">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-4)',
        }}
      >
        <span className="type-h4">Work Orders</span>
        <span className="badge badge-critical">{WORK_ORDERS.length}</span>
      </div>

      {/* Summary line */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-12)',
          marginBottom: 'var(--spacing-16)',
        }}
      >
        {summary.critical > 0 && (
          <span
            className="type-body-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}
          >
            <Dot variant="status-dot-critical" />
            {summary.critical} Critical
          </span>
        )}
        {summary.high > 0 && (
          <span
            className="type-body-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}
          >
            <Dot variant="status-dot-warning" />
            {summary.high} High
          </span>
        )}
        {summary.medium > 0 && (
          <span
            className="type-body-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}
          >
            <Dot variant="status-dot-info" />
            {summary.medium} Medium
          </span>
        )}
      </div>

      {/* Rows */}
      <div>
        {WORK_ORDERS.map((wo) => (
          <div key={wo.id} style={rowStyle}>
            <Dot variant={PRIORITY_DOT[wo.priority]} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-8)',
                }}
              >
                <span
                  className="type-body"
                  style={{ color: 'var(--color-accent)', cursor: 'pointer' }}
                  onClick={() => onAssetClick(wo.assetId)}
                >
                  {wo.asset}
                </span>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {wo.assignee ? (
                    <span className="type-body-sm">{wo.assignee}</span>
                  ) : (
                    <span className="type-body-sm" style={{ color: 'var(--color-warning)' }}>
                      Unassigned
                    </span>
                  )}
                  <div>
                    <span className="type-meta">{wo.created}</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 'var(--spacing-4)' }}>
                <span className="type-body-secondary">{wo.task}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div style={{ marginTop: 'var(--spacing-16)' }}>
        <span className="type-link">View all work orders &rarr;</span>
      </div>
    </div>
  )
}

// ── Cases card ────────────────────────────────────────────────────────────────

function CasesCard({ onAssetClick }) {
  const summary = buildCaseSummary(CASES)

  return (
    <div className="card col-half">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-4)',
        }}
      >
        <span className="type-h4">Investigations</span>
        <span className="badge badge-warning">{CASES.length}</span>
      </div>

      {/* Summary line */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-12)',
          marginBottom: 'var(--spacing-16)',
        }}
      >
        {summary.investigating > 0 && (
          <span
            className="type-body-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}
          >
            <Dot variant="status-dot-critical" />
            {summary.investigating} Investigating
          </span>
        )}
        {summary.open > 0 && (
          <span
            className="type-body-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}
          >
            <Dot variant="status-dot-warning" />
            {summary.open} Open
          </span>
        )}
      </div>

      {/* Rows */}
      <div>
        {CASES.map((c) => (
          <div key={c.id} style={rowStyle}>
            <Dot variant={CASE_STATUS_DOT[c.status] || 'status-dot-info'} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-8)',
                }}
              >
                <span
                  className="type-body"
                  style={{ color: 'var(--color-accent)', cursor: 'pointer' }}
                  onClick={() => onAssetClick(c.assetId)}
                >
                  {c.asset}
                </span>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span
                    className="type-body-sm"
                    style={{ textTransform: 'capitalize' }}
                  >
                    {c.status}
                  </span>
                  <div>
                    <span className="type-meta">{c.opened}</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 'var(--spacing-4)' }}>
                <span className="type-body-secondary">{c.description}</span>
              </div>
              {c.linkedWorkOrders.length > 0 && (
                <div style={{ marginTop: 'var(--spacing-4)' }}>
                  <span className="type-meta">
                    {c.linkedWorkOrders.length} linked work order{c.linkedWorkOrders.length !== 1 ? 's' : ''}
                    {' '}({c.linkedWorkOrders.join(', ')})
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div style={{ marginTop: 'var(--spacing-16)' }}>
        <span className="type-link">View all investigations &rarr;</span>
      </div>
    </div>
  )
}

// ── TodaysActivity ────────────────────────────────────────────────────────────

export default function TodaysActivity({ onAssetClick }) {
  return (
    <div>
      <div className="section-header">Today's Activity</div>
      <div className="grid-12">
        <WorkOrdersCard onAssetClick={onAssetClick} />
        <CasesCard onAssetClick={onAssetClick} />
      </div>
    </div>
  )
}
