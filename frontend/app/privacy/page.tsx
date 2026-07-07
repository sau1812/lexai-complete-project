import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-navy mb-8 text-sm">
          <ArrowLeft size={14} /> Back
        </Link>
        <h1 className="font-serif text-4xl font-bold text-navy mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: January 2025</p>
        <div className="bg-white rounded-2xl border border-gold/15 p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-semibold text-navy mb-3">Data We Collect</h2>
            <p>We collect your name, email, and documents you upload for analysis. Document text is sent to our AI provider (Groq) for processing and is not stored permanently on their servers.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold text-navy mb-3">How We Use Your Data</h2>
            <p>Your data is used solely to provide the document analysis service. We do not sell, share, or use your documents for training AI models without explicit consent.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold text-navy mb-3">Data Security</h2>
            <p>Passwords are hashed using bcrypt. JWT tokens expire after 7 days. Uploaded files are stored securely on our servers and can be deleted at any time from your dashboard.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold text-navy mb-3">Your Rights</h2>
            <p>You can delete your documents at any time from the dashboard. To request complete account deletion, contact us at privacy@lexai.com.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
