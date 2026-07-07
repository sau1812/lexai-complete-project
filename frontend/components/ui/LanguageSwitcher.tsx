'use client'
import { useState, useRef, useEffect } from 'react'
import { LANGUAGES, type Language } from '@/lib/i18n'
import { ChevronDown, Globe } from 'lucide-react'

interface Props {
  lang: Language
  setLang: (l: Language) => void
}

export default function LanguageSwitcher({ lang, setLang }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-gold/20 text-cream/80 hover:text-gold px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
      >
        <Globe size={14} />
        <span>{current.flag} {current.nativeLabel}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-navy border border-gold/20 rounded-xl shadow-2xl overflow-hidden z-50">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all hover:bg-gold/10
                ${lang === l.code ? 'text-gold bg-gold/10 font-semibold' : 'text-cream/70'}`}
            >
              <span className="text-base">{l.flag}</span>
              <div className="text-left">
                <div className="leading-tight">{l.nativeLabel}</div>
                <div className="text-xs opacity-50">{l.label}</div>
              </div>
              {lang === l.code && <span className="ml-auto text-gold text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}