import { WORK_ORDERS, CASES } from '../../data/assets'

// ── Priority → status dot mapping ────────────────────────────────────────────

const PRIORITY_DOT = {
  critical: 'status-dot dot-error',
  high: 'status-dot dot-warning',
  medium: 'status-dot dot-info',
  low: 'status-dot dot-info',
}

// ── Case status → dot mapping ─────────────────────────────────────────────────

const CASE_STATUS_DOT = {
  investigating: 'status-dot dot-error',
  open: 'status-dot dot-warning',
  closed: 'status-dot dot-success',
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
  borderBottom: '1px solid var(--color-border-subtle)',
  transition: 'background var(--motion-fast) var(--ease-productive)',
}

// ── Inline dot helper ─────────────────────────────────────────────────────────

function Dot({ variant }) {
  return (
    <span
      className={variant}
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
        <span className="type-heading-02" style={{ color: 'var(--color-card-title)' }}>Work Orders</span>
        <span className="badge badge-error">{WORK_ORDERS.length}</span>
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
            className="type-label"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}
          >
            <Dot variant="status-dot dot-error" />
            {summary.critical} Critical
          </span>
        )}
        {summary.high > 0 && (
          <span
            className="type-label"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}
          >
            <Dot variant="status-dot dot-warning" />
            {summary.high} High
          </span>
        )}
        {summary.medium > 0 && (
          <span
            className="type-label"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}
          >
            <Dot variant="status-dot dot-info" />
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
                  className="type-body-01"
                  style={{ color: 'var(--color-accent)', cursor: 'pointer' }}
                  onClick={() => onAssetClick(wo.assetId)}
                >
                  {wo.asset}
                </span>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {wo.assignee ? (
                    <span className="type-label">{wo.assignee}</span>
                  ) : (
                    <span className="type-label" style={{ color: 'var(--color-warning)' }}>
                      Unassigned
                    </span>
                  )}
                  <div>
                    <span className="type-helper">{wo.created}</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 'var(--spacing-4)' }}>
                <span className="type-body-01" style={{ color: 'var(--color-text-secondary)' }}>{wo.task}</span>
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
        <span className="type-heading-02" style={{ color: 'var(--color-card-title)' }}>Investigations</span>
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
            className="type-label"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}
          >
            <Dot variant="status-dot dot-error" />
            {summary.investigating} Investigating
          </span>
        )}
        {summary.open > 0 && (
          <span
            className="type-label"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}
          >
            <Dot variant="status-dot dot-warning" />
            {summary.open} Open
          </span>
        )}
      </div>

      {/* Rows */}
      <div>
        {CASES.map((c) => (
          <div key={c.id} style={rowStyle}>
            <Dot variant={CASE_STATUS_DOT[c.status] || 'status-dot dot-info'} />
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
                  className="type-body-01"
                  style={{ color: 'var(--color-accent)', cursor: 'pointer' }}
                  onClick={() => onAssetClick(c.assetId)}
                >
                  {c.asset}
                </span>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span
                    className="type-label"
                    style={{ textTransform: 'capitalize' }}
                  >
                    {c.status}
                  </span>
                  <div>
                    <span className="type-helper">{c.opened}</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 'var(--spacing-4)' }}>
                <span className="type-body-01" style={{ color: 'var(--color-text-secondary)' }}>{c.description}</span>
              </div>
              {c.linkedWorkOrders.length > 0 && (
                <div style={{ marginTop: 'var(--spacing-4)' }}>
                  <span className="type-helper">
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
    <div className="grid-12">
      <WorkOrdersCard onAssetClick={onAssetClick} />
      <CasesCard onAssetClick={onAssetClick} />
    </div>
  )
}
