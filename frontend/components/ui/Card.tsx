import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  accentColor?: string
}

export default function Card({ children, className = '', hover = false, accentColor }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-gold/15 p-5
        ${hover ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}
        ${className}
      `}
      style={accentColor ? { borderLeftWidth: 4, borderLeftColor: accentColor } : {}}
    >
      {children}
    </div>
  )
}
