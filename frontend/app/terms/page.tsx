import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-navy mb-8 text-sm">
          <ArrowLeft size={14} /> Back
        </Link>
        <h1 className="font-serif text-4xl font-bold text-navy mb-2">Terms of Use</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: January 2025</p>
        <div className="bg-white rounded-2xl border border-gold/15 p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-semibold text-navy mb-3">1. Acceptance of Terms</h2>
            <p>By using LexAI, you agree to these terms. LexAI provides AI-powered legal document analysis for informational purposes only and does not constitute legal advice.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold text-navy mb-3">2. Not Legal Advice</h2>
            <p>LexAI is an AI tool designed to help you understand legal documents. The analysis provided does not constitute legal advice. Always consult a qualified attorney for legal decisions.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold text-navy mb-3">3. Document Privacy</h2>
            <p>Documents you upload are processed to provide analysis. We do not share your documents with third parties. Documents may be stored temporarily for dashboard history.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold text-navy mb-3">4. Limitation of Liability</h2>
            <p>LexAI is provided as-is. We are not liable for any decisions made based on AI analysis. Use the platform as a starting point for understanding, not as a final legal opinion.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
