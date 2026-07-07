'use client'
import UploadZone from '@/components/analysis/UploadZone'
import { useLang } from '@/lib/LanguageContext'
import { Scale, Shield, BarChart3, FileSearch } from 'lucide-react'

export default function HomeFeatures() {
  const { t } = useLang()

  const features = [
    { icon: Scale,       title: 'Contract Analysis',    desc: 'AI extracts risks, benefits & key terms from any legal document.' },
    { icon: Shield,      title: 'Fraud Detection',      desc: 'Pattern-based verification of government IDs and document structure.' },
    { icon: BarChart3,   title: 'Visual Insights',      desc: 'Pie charts and severity breakdowns make complex data clear.' },
    { icon: FileSearch,  title: 'OCR Support',          desc: 'Scanned PDFs and images processed using Tesseract OCR.' },
  ]

  return (
    <>
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-navy text-gold border border-gold/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          <Scale size={12} /> Powered by Groq AI + Llama 3
        </div>
        <h1 className="font-serif text-5xl font-bold text-navy leading-tight mb-4">
          {t('uploadTitle').split(' ').slice(0, -1).join(' ')}{' '}
          <span className="text-gold-dark">{t('uploadTitle').split(' ').slice(-1)}</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed mb-12">
          {t('uploadSubtitle')}
        </p>
        <UploadZone />
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl border border-gold/15 p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center mb-3">
                <Icon size={18} className="text-navy" />
              </div>
              <h3 className="font-semibold text-navy text-sm mb-1">{title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}