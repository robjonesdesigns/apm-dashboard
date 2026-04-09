import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { EVENT_SUMMARY } from '../../data/baytown'
import useIsMobile from '../../hooks/useIsMobile'
import { colors, chartStyle } from '../../styles/tokens'
import Legend from './Legend'

const SEGMENTS = [
  { key: 'confirmed',      label: 'Confirmed',      color: colors.chart1 },
  { key: 'falsePositives',  label: 'False Positives', color: colors.chart4 },
  { key: 'newEvents',       label: 'New Events',      color: colors.chart2 },
]

const chartData = [
  {
    confirmed:      EVENT_SUMMARY.confirmed,
    falsePositives: EVENT_SUMMARY.falsePositives,
    newEvents:      EVENT_SUMMARY.newEvents,
  },
]

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="tooltip-bubble">
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-8 mb-4">
          <div className="status-dot" style={{ background: entry.fill }} />
          <span style={{ color: chartStyle.tooltipText, fontSize: chartStyle.axisFont }}>{entry.name}</span>
          <span style={{ color: chartStyle.tooltipText, fontSize: chartStyle.axisFont, fontWeight: 600 }}>{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function EventSummary() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('events')
  const total = EVENT_SUMMARY.total

  const legendItems = SEGMENTS.map((seg) => {
    const count = EVENT_SUMMARY[seg.key]
    const pct = total > 0 ? Math.round((count / total) * 100) : 0
    return { label: seg.label, color: seg.color, value: `${count} (${pct}%)` }
  })

  return (
    <div className="card flex flex-col gap-16">
      {/* Header row */}
      <div className="flex items-center justify-between gap-8">
        <span className="type-card-title">Event Summary</span>
        <div className="flex gap-8">
          <button
            className={`chip${activeTab === 'events' ? ' chip-active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
          <button
            className={`chip${activeTab === 'cases' ? ' chip-active' : ''}`}
            onClick={() => setActiveTab('cases')}
          >
            Cases
          </button>
        </div>
      </div>

      {/* Large callout */}
      <div className="flex flex-col gap-[var(--gap-stack)]">
        <span className="type-label">Active Events</span>
        <span className="type-kpi-hero">{total}</span>
      </div>

      {/* Stacked bar chart */}
      <div style={{ height: 80 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" hide />
            {!isMobile && <Tooltip content={<CustomTooltip />} cursor={false} />}
            <Bar dataKey="confirmed" name="Confirmed" stackId="a" fill={colors.chart1} radius={[4, 0, 0, 4]} animationDuration={300} />
            <Bar dataKey="falsePositives" name="False Positives" stackId="a" fill={colors.chart4} animationDuration={300} />
            <Bar dataKey="newEvents" name="New Events" stackId="a" fill={colors.chart2} radius={[0, 4, 4, 0]} animationDuration={300} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <Legend items={legendItems} shape="square" />
    </div>
  )
}
