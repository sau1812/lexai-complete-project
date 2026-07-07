import { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-cream-dark flex items-center justify-center mb-4 text-3xl">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-xl font-semibold text-navy mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-6">{description}</p>
      )}
      {action}
    </div>
  )
}
