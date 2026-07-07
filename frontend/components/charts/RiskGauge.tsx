'use client'

interface RiskGaugeProps {
  score: number   // 0–100
  size?: number
}

export default function RiskGauge({ score, size = 140 }: RiskGaugeProps) {
  const radius = 54
  const stroke = 10
  const circumference = Math.PI * radius   // half circle
  const progress = ((100 - score) / 100) * circumference

  const color =
    score >= 70 ? '#E74C3C' :
    score >= 40 ? '#F39C12' :
    '#27AE60'

  const label =
    score >= 70 ? 'High Risk' :
    score >= 40 ? 'Medium Risk' :
    'Low Risk'

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Track */}
        <path
          d={`M ${stroke} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - stroke} ${size / 2}`}
          fill="none"
          stroke="#EDE7DA"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Progress */}
        <path
          d={`M ${stroke} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - stroke} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        {/* Score text */}
        <text
          x={size / 2}
          y={size / 2 - 2}
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fontFamily="'Playfair Display', serif"
          fill={color}
        >
          {score}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 16}
          textAnchor="middle"
          fontSize="10"
          fill="#9CA3AF"
          fontFamily="DM Sans, sans-serif"
        >
          / 100
        </text>
      </svg>
      <span className="text-sm font-semibold mt-1" style={{ color }}>
        {label}
      </span>
    </div>
  )
}
