// lib/useTranslation.ts
'use client'

import { useLanguage } from '@/context/LanguageContext'
import { t, type Language } from './translations'

export function useTranslation() {
  const { lang } = useLanguage()
  
  return {
    lang,
    t: (key: keyof typeof import('./translations').translations.tr, params?: Record<string, string | number>) => 
      t(lang, key, params)
  }
}