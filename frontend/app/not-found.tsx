import Link from 'next/link'
import { Scale, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center mx-auto mb-6">
          <Scale size={28} className="text-gold" />
        </div>
        <h1 className="font-serif text-7xl font-bold text-navy mb-2">404</h1>
        <h2 className="font-serif text-2xl font-semibold text-navy mb-3">Page Not Found</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-navy text-gold border border-gold/40 px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-wide hover:bg-navy-mid transition-all"
        >
          <ArrowLeft size={15} />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
