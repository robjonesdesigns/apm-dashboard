import { ASSETS, WORK_ORDERS, INVESTIGATIONS, TIMELINE, INCIDENTS } from '../../data/baytown'
import WoPriority from './WoPriority'
import CriticalityIndicator from './CriticalityIndicator'
import useIsMobile from '../../hooks/useIsMobile'

// Lookup asset criticality by assetId
const critByAsset = {}
ASSETS.forEach(a => { critByAsset[a.id] = a.criticality })

function getEventName(eventId) {
  if (!eventId) return null
  const evt = TIMELINE.find(e => e.id === eventId)
  return evt ? evt.name : null
}

function getIncidentForEvent(eventId) {
  if (!eventId) return null
  const inc = INCIDENTS.find(i => i.eventIds.includes(eventId))
  return inc ? inc.name : null
}

// ── Summary builders ────────────────────────────────────────────────────────

function buildWoSummary(orders) {
  const counts = { emergency: 0, urgent: 0, scheduled: 0 }
  orders.forEach((wo) => { counts[wo.urgency] = (counts[wo.urgency] || 0) + 1 })
  return counts
}

function buildCaseSummary(cases) {
  const counts = {}
  cases.forEach((c) => { counts[c.status] = (counts[c.status] || 0) + 1 })
  return counts
}

// ── Investigation status icons (right-pointing triangles = progress) ─────────

function InvestigatingIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 1.5L10 6 3 10.5z" fill="currentColor" />
    </svg>
  )
}

function OpenIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 1.5L10 6 3 10.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function InvestigationStatus({ status }) {
  const isInvestigating = status === 'investigating'
  const Icon = isInvestigating ? InvestigatingIcon : OpenIcon
  const label = isInvestigating ? 'Investigating' : 'Open'

  return (
    <span className="inline-flex items-center gap-4 text-[var(--color-text-secondary)]">
      <Icon />
      <span className="type-label">{label}</span>
    </span>
  )
}

// ── Summary lines ──────────────────────────────────────────────────────────

function SummaryLine({ parts, renderItem }) {
  return (
    <div className="flex items-center gap-8 mb-16 flex-wrap">
      {parts.map((p, i) => (
        <span key={p.key} className="inline-flex items-center gap-4">
          <span className="type-body font-semibold tabular-nums">{p.count}</span>
          {renderItem(p)}
          {i < parts.length - 1 && <span className="type-label ml-4">&middot;</span>}
        </span>
      ))}
    </div>
  )
}

function WoSummaryLine({ summary }) {
  const parts = []
  if (summary.emergency > 0) parts.push({ key: 'emergency', count: summary.emergency, urgency: 'emergency' })
  if (summary.urgent > 0)    parts.push({ key: 'urgent',    count: summary.urgent,    urgency: 'urgent' })
  if (summary.scheduled > 0) parts.push({ key: 'scheduled', count: summary.scheduled, urgency: 'scheduled' })
  return <SummaryLine parts={parts} renderItem={(p) => <WoPriority urgency={p.urgency} />} />
}

function CaseSummaryLine({ summary }) {
  const parts = []
  if (summary.investigating > 0) parts.push({ key: 'investigating', count: summary.investigating, status: 'investigating' })
  if (summary.open > 0)          parts.push({ key: 'open',          count: summary.open,          status: 'open' })
  return <SummaryLine parts={parts} renderItem={(p) => <InvestigationStatus status={p.status} />} />
}

// ── Row sub-components ─────────────────────────────────────────────────────

function RowIdTitle({ id, title }) {
  return (
    <div className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--color-accent)]">
      <span className="type-meta text-[var(--color-text-helper)]">{id}</span>
      <span className="type-meta text-[var(--color-text-helper)]"> &middot; </span>
      <span className="type-body text-inherit">{title}</span>
    </div>
  )
}

function RowAssetCriticality({ asset, assetId }) {
  return (
    <div className="flex items-center gap-8 min-w-0">
      <span className="type-body text-[var(--color-text-secondary)]">{asset}</span>
      {critByAsset[assetId] && (
        <>
          <span className="divider-v" />
          <CriticalityIndicator level={critByAsset[assetId]} />
        </>
      )}
    </div>
  )
}

function MobileRowIdTitle({ id, title }) {
  return (
    <div className="flex items-center gap-4 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
      <span className="type-meta text-[var(--color-text-helper)] shrink-0">{id}</span>
      <span className="type-meta text-[var(--color-text-helper)] shrink-0">&middot;</span>
      <span className="type-body text-[var(--color-accent)] overflow-hidden text-ellipsis whitespace-nowrap">{title}</span>
    </div>
  )
}

function MobileRowAssetCriticality({ asset, assetId }) {
  return (
    <div className="flex items-center gap-8 min-w-0">
      <span className="type-meta text-[var(--color-text-secondary)]">{asset}</span>
      {critByAsset[assetId] && (
        <>
          <span className="divider-v" />
          <CriticalityIndicator level={critByAsset[assetId]} />
        </>
      )}
    </div>
  )
}

// ── Work Orders card ────────────────────────────────────────────────────────

function WorkOrdersCard() {
  const isMobile = useIsMobile()
  const summary = buildWoSummary(WORK_ORDERS)

  const urgencyOrder = { emergency: 0, urgent: 1, scheduled: 2 }
  const visible = [...WORK_ORDERS]
    .sort((a, b) => (urgencyOrder[a.urgency] ?? 9) - (urgencyOrder[b.urgency] ?? 9))
    .slice(0, 5)

  return (
    <div className="card col-half flex flex-col">
      <div className="flex items-center justify-between mb-[var(--gap-stack)]">
        <span className="type-card-title">Work Orders</span>
        <span className="type-label">{WORK_ORDERS.length} Total</span>
      </div>

      <WoSummaryLine summary={summary} />

      <div className="flex-1">
        {visible.map((wo) => (
          <div
            key={wo.id}
            className="row-hover flex flex-col gap-[var(--gap-stack)] border-b border-[var(--color-border-subtle)]"
            style={{ padding: 'var(--spacing-12) var(--spacing-12) var(--spacing-12) var(--spacing-8)', margin: '0 calc(-1 * var(--spacing-4))' }}
            aria-label={`${wo.id}: ${wo.task}, ${wo.asset}, ${wo.urgency}`}
          >
            {isMobile ? (
              <>
                <MobileRowIdTitle id={wo.id} title={wo.task} />
                <MobileRowAssetCriticality asset={wo.asset} assetId={wo.assetId} />
                <WoPriority urgency={wo.urgency} />
              </>
            ) : (
              <>
                <div className="flex justify-between items-center gap-8">
                  <RowIdTitle id={wo.id} title={wo.task} />
                  <div className="col-right-100"><WoPriority urgency={wo.urgency} /></div>
                </div>
                <div className="flex justify-between items-center gap-8">
                  <RowAssetCriticality asset={wo.asset} assetId={wo.assetId} />
                  <span className="type-label col-right-100" style={{ color: wo.assignee ? 'var(--color-text-secondary)' : 'var(--color-text-helper)' }}>
                    {wo.assignee || 'Unassigned'}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-8">
                  <span className="type-meta text-[var(--color-text-helper)]">
                    {wo.eventId && getEventName(wo.eventId) ? (
                      <>
                        {getEventName(wo.eventId)}
                        {getIncidentForEvent(wo.eventId) && ` · ${getIncidentForEvent(wo.eventId)}`}
                      </>
                    ) : (
                      'Routine maintenance'
                    )}
                  </span>
                  <span className="type-meta col-right-100 text-[var(--color-text-helper)]">{wo.created}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-16 text-right">
        <span className="type-link">Go to Work Orders &rarr;</span>
      </div>
    </div>
  )
}

// ── Investigations card ─────────────────────────────────────────────────────

function InvestigationsCard() {
  const isMobile = useIsMobile()
  const summary = buildCaseSummary(INVESTIGATIONS)
  const visible = INVESTIGATIONS.slice(0, 5)

  return (
    <div className="card col-half flex flex-col">
      <div className="flex items-center justify-between mb-[var(--gap-stack)]">
        <span className="type-card-title">Investigations</span>
        <span className="type-label">{INVESTIGATIONS.length} Total</span>
      </div>

      <CaseSummaryLine summary={summary} />

      <div className="flex-1">
        {visible.map((c) => (
          <div
            key={c.id}
            className="row-hover flex flex-col gap-[var(--gap-stack)] border-b border-[var(--color-border-subtle)]"
            style={{ padding: 'var(--spacing-12) var(--spacing-12) var(--spacing-12) var(--spacing-8)', margin: '0 calc(-1 * var(--spacing-4))' }}
            aria-label={`${c.id}: ${c.description}, ${c.asset}, ${c.status}`}
          >
            {isMobile ? (
              <>
                <MobileRowIdTitle id={c.id} title={c.description} />
                <MobileRowAssetCriticality asset={c.asset} assetId={c.assetId} />
                <InvestigationStatus status={c.status} />
              </>
            ) : (
              <>
                <div className="flex justify-between items-center gap-8">
                  <RowIdTitle id={c.id} title={c.description} />
                  <div className="col-right-100"><InvestigationStatus status={c.status} /></div>
                </div>
                <div className="flex justify-between items-center gap-8">
                  <RowAssetCriticality asset={c.asset} assetId={c.assetId} />
                  <span className="type-label col-right-100" style={{ color: c.assignee ? 'var(--color-text-secondary)' : 'var(--color-text-helper)' }}>
                    {c.assignee || 'Unassigned'}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-8">
                  <span className="type-meta text-[var(--color-text-helper)]">
                    {[
                      `${c.eventIds.length} event${c.eventIds.length !== 1 ? 's' : ''}`,
                      `${c.workOrderIds.length} WO${c.workOrderIds.length !== 1 ? 's' : ''}`,
                    ].join(' · ')}
                  </span>
                  <span className="type-meta col-right-100 text-[var(--color-text-helper)]">{c.opened}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-16 text-right">
        <span className="type-link">Go to Investigations &rarr;</span>
      </div>
    </div>
  )
}

// ── InProgress ──────────────────────────────────────────────────────────────

export default function InProgress() {
  return (
    <div className="grid-12">
      <WorkOrdersCard />
      <InvestigationsCard />
    </div>
  )
}
