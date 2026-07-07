'use client'
import { getClauseBadge } from '@/lib/utils'
import { Shield, TrendingUp, Lightbulb, Minus } from 'lucide-react'

interface Clause {
  title: string
  type: 'risk' | 'benefit' | 'opportunity' | 'neutral'
  severity: number
  text: string
}

const typeIcons = {
  risk: Shield,
  benefit: TrendingUp,
  opportunity: Lightbulb,
  neutral: Minus,
}

const borderColors = {
  risk: 'border-l-red-400',
  benefit: 'border-l-green-500',
  opportunity: 'border-l-blue-400',
  neutral: 'border-l-gold',
}

export default function ClauseCard({ clause }: { clause: Clause }) {
  const badge = getClauseBadge(clause.type)
  const Icon = typeIcons[clause.type] || Minus

  return (
    <div
      className={`bg-white rounded-xl border border-gold/15 border-l-4 ${borderColors[clause.type]} p-5 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: badge.bg }}
          >
            <Icon size={14} style={{ color: badge.text }} />
          </div>
          <span className="font-semibold text-navy text-[15px]">{clause.title}</span>
        </div>
        <span
          className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ background: badge.bg, color: badge.text }}
        >
          {clause.type}
        </span>
      </div>

      <p className="text-gray-500 text-sm leading-relaxed ml-10">{clause.text}</p>

      {/* Severity dots */}
      <div className="flex items-center gap-2 mt-3 ml-10">
        <span className="text-xs text-gray-400">Severity:</span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: i < clause.severity ? badge.text : '#E5E7EB',
              }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400">{clause.severity}/5</span>
      </div>
    </div>
  )
}
