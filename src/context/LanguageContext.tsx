// context/LanguageContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Language = 'tr' | 'en'

type LanguageContextType = {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('hmy_lang') as Language | null
    if (stored === 'tr' || stored === 'en') {
      setLang(stored)
    } else {
      setLang('en') // varsayılan İngilizce
    }
  }, [])

  const setLangAndStore = (newLang: Language) => {
    setLang(newLang)
    if (mounted) {
      localStorage.setItem('hmy_lang', newLang)
    }
  }

  const toggleLang = () => {
    const next = lang === 'tr' ? 'en' : 'tr'
    setLangAndStore(next)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangAndStore, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}