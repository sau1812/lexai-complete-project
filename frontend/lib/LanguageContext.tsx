'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Language } from '@/lib/i18n'
import { t } from '@/lib/i18n'

interface LangContextType {
  lang: Language
  setLang: (l: Language) => void
  t: (key: string) => string
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('lexai_lang') as Language
    if (saved) setLangState(saved)
  }, [])

  const setLang = (l: Language) => {
    setLangState(l)
    localStorage.setItem('lexai_lang', l)
  }

  const translate = (key: string) => t(lang, key)

  return (
    <LangContext.Provider value={{ lang, setLang, t: translate }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}