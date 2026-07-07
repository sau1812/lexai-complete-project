import { Scale } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-gold/15 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
              <Scale size={13} className="text-navy" />
            </div>
            <span className="font-serif text-gold font-bold">LexAI</span>
            <span className="text-cream/20 text-sm">—</span>
            <span className="text-cream/30 text-xs">Legal Document Analyzer</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-cream/30">
            <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms of Use</Link>
            <span>© {new Date().getFullYear()} LexAI. All rights reserved.</span>
          </div>

          <div className="text-xs text-cream/20 text-center md:text-right">
            ⚠ For informational purposes only.<br />
            Not a substitute for legal advice.
          </div>
        </div>
      </div>
    </footer>
  )
}
