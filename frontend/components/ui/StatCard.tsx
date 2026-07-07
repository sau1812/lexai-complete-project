import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  color?: string
  trend?: number   // positive = up, negative = down
  subtitle?: string
}

export default function StatCard({ label, value, icon: Icon, color = '#0D1B2A', trend, subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gold/15 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}12` }}
        >
          <Icon size={17} style={{ color }} />
        </div>
        {trend !== undefined && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
            }`}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="font-serif text-3xl font-bold mb-0.5" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{label}</div>
      {subtitle && <div className="text-xs text-gray-300 mt-0.5">{subtitle}</div>}
    </div>
  )
}
