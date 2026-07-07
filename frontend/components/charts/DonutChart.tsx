'use client'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DonutChartProps {
  riskCount: number
  benefitCount: number
  opportunityCount: number
  neutralCount: number
}

const COLORS = ['#E74C3C', '#27AE60', '#2980B9', '#C9A84C']
const LABELS = ['Risks', 'Benefits', 'Opportunities', 'Neutral']

export default function DonutChart({
  riskCount,
  benefitCount,
  opportunityCount,
  neutralCount,
}: DonutChartProps) {
  const data = [
    { name: 'Risks', value: riskCount },
    { name: 'Benefits', value: benefitCount },
    { name: 'Opportunities', value: opportunityCount },
    { name: 'Neutral', value: neutralCount },
  ].filter((d) => d.value > 0)

  if (data.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-gray-400 text-sm">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[LABELS.indexOf(entry.name)] || '#ccc'}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#0D1B2A',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '8px',
            color: '#F8F4ED',
            fontSize: '13px',
          }}
        />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: 13, color: '#4B5563' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
