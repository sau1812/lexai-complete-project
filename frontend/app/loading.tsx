import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <Loader2 size={36} className="animate-spin text-gold mx-auto mb-3" />
        <p className="text-gray-400 text-sm font-medium">Loading LexAI...</p>
      </div>
    </div>
  )
}
