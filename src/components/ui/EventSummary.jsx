import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { EVENT_SUMMARY } from '../../data/assets'
import { colors, chartStyle } from '../../styles/tokens'

const SEGMENTS = [
  { key: 'confirmed',      label: 'Confirmed',       color: colors.chart1 },
  { key: 'falsePositives', label: 'False Positives',  color: colors.chart4 },
  { key: 'newEvents',      label: 'New Events',       color: colors.chart2 },
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
    <div
      style={{
        background: chartStyle.tooltipBg,
        border: `1px solid ${chartStyle.tooltipBorder}`,
        borderRadius: 'var(--radius-8)',
        padding: 'var(--spacing-8) var(--spacing-12)',
      }}
    >
      {payload.map((entry) => (
        <div
          key={entry.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-8)',
            marginBottom: 'var(--spacing-4)',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: entry.fill,
              flexShrink: 0,
            }}
          />
          <span style={{ color: chartStyle.tooltipLabel, fontSize: chartStyle.axisFont }}>
            {entry.name}
          </span>
          <span style={{ color: chartStyle.tooltipText, fontSize: chartStyle.axisFont, fontWeight: 600 }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function LegendItem({ label, color, count, pct }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
        }}
      />
      <span className="type-label">{label}</span>
      <span
        className="type-label"
        style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}
      >
        {count}
      </span>
      <span className="type-helper">
        {pct}%
      </span>
    </div>
  )
}

export default function EventSummary() {
  const [activeTab, setActiveTab] = useState('events')
  const total = EVENT_SUMMARY.total

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-8)' }}>
        <span className="type-heading-02">Event Summary</span>
        <div style={{ display: 'flex', gap: 'var(--spacing-8)' }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <span className="type-label">Active Events</span>
        <span className="type-callout">{total}</span>
      </div>

      {/* Stacked bar chart */}
      <div style={{ height: 80 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis type="category" hide />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar
              dataKey="confirmed"
              name="Confirmed"
              stackId="a"
              fill={colors.chart1}
              radius={[4, 0, 0, 4]}
              isAnimationActive
              animationDuration={300}
            />
            <Bar
              dataKey="falsePositives"
              name="False Positives"
              stackId="a"
              fill={colors.chart4}
              radius={[0, 0, 0, 0]}
              isAnimationActive
              animationDuration={300}
            />
            <Bar
              dataKey="newEvents"
              name="New Events"
              stackId="a"
              fill={colors.chart2}
              radius={[0, 4, 4, 0]}
              isAnimationActive
              animationDuration={300}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--spacing-8)' }}
      >
        {SEGMENTS.map((seg) => {
          const count = EVENT_SUMMARY[seg.key]
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <LegendItem
              key={seg.key}
              label={seg.label}
              color={seg.color}
              count={count}
              pct={pct}
            />
          )
        })}
      </div>
    </div>
  )
}
