import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  color?: string
  bg?: string
  className?: string
}

export default function Badge({ children, color, bg, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${className}`}
      style={{ color, background: bg }}
    >
      {children}
    </span>
  )
}
