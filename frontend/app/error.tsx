'use client'
import { useEffect } from 'react'
import { Scale, RefreshCw } from 'lucide-react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6">
          <Scale size={28} className="text-red-400" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-navy mb-2">Something went wrong</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-navy text-gold border border-gold/40 px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-wide hover:bg-navy-mid transition-all"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      </div>
    </div>
  )
}
