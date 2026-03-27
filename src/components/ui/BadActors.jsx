import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList, ResponsiveContainer } from 'recharts'
import { BAD_ACTORS } from '../../data/assets'
import { colors, chartStyle } from '../../styles/tokens'

function barColor(criticality) {
  if (criticality === 'A') return colors.error
  if (criticality === 'B') return colors.warning
  return colors.success
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div
      style={{
        background: chartStyle.tooltipBg,
        border: `1px solid ${chartStyle.tooltipBorder}`,
        borderRadius: 'var(--radius-8)',
        padding: 'var(--spacing-8) var(--spacing-12)',
      }}
    >
      <div style={{ color: chartStyle.tooltipText, fontSize: chartStyle.axisFont, fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>
        {d.payload.name}
      </div>
      <div style={{ display: 'flex', gap: 'var(--spacing-8)', alignItems: 'center' }}>
        <span style={{ color: chartStyle.tooltipLabel, fontSize: chartStyle.axisFont }}>Events</span>
        <span style={{ color: chartStyle.tooltipText, fontSize: chartStyle.axisFont, fontWeight: 600 }}>
          {d.value}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 'var(--spacing-8)', alignItems: 'center', marginTop: 'var(--spacing-4)' }}>
        <span style={{ color: chartStyle.tooltipLabel, fontSize: chartStyle.axisFont }}>Criticality</span>
        <span
          style={{
            color: barColor(d.payload.criticality),
            fontSize: chartStyle.axisFont,
            fontWeight: 600,
          }}
        >
          {d.payload.criticality}
        </span>
      </div>
    </div>
  )
}

// Recharts needs a numeric yAxis for layout="vertical" with category data.
// We use the asset name as the dataKey for yAxis so names render on the left.
const chartData = BAD_ACTORS.map((a) => ({
  name: a.name,
  assetId: a.assetId,
  events: a.events,
  criticality: a.criticality,
}))

export default function BadActors({ onAssetClick }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const handleClick = (data) => {
    if (onAssetClick && data?.assetId) onAssetClick(data.assetId)
  }

  // Chart height scales with number of bars (40px per bar + margins)
  const chartHeight = BAD_ACTORS.length * 40 + 16

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
      {/* Header */}
      <span className="type-heading-02" style={{ color: 'var(--color-card-title)' }}>Bad Actors</span>

      {/* Horizontal bar chart */}
      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
            onClick={(e) => {
              if (e?.activePayload?.[0]) handleClick(e.activePayload[0].payload)
            }}
            style={{ cursor: 'pointer' }}
          >
            <XAxis
              type="number"
              tick={{ fill: chartStyle.axisText, fontSize: chartStyle.axisFont }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={130}
              tick={{ fill: chartStyle.axisText, fontSize: chartStyle.axisFont }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar
              dataKey="events"
              radius={chartStyle.barRadius}
              isAnimationActive
              animationDuration={300}
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.assetId}
                  fill={barColor(entry.criticality)}
                  opacity={hoveredIndex !== null && hoveredIndex !== index ? 0.4 : 1}
                  style={{ transition: `opacity var(--motion-fast) var(--ease-productive)` }}
                />
              ))}
              <LabelList
                dataKey="events"
                position="right"
                style={{
                  fill: chartStyle.axisText,
                  fontSize: chartStyle.axisFont,
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Priority gradient bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div
          style={{
            display: 'flex',
            height: '4px',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}
        >
          <div style={{ flex: 1, background: 'var(--color-error)' }} />
          <div style={{ flex: 1, background: 'var(--color-warning)' }} />
          <div style={{ flex: 1, background: 'var(--color-success)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="type-helper">High</span>
          <span className="type-helper">Medium</span>
          <span className="type-helper">Low</span>
        </div>
      </div>
    </div>
  )
}
