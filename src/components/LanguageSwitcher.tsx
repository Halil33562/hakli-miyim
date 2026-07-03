// components/LanguageSwitcher.tsx
'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function LanguageSwitcher() {
  const { lang, toggleLang } = useLanguage()

  return (
    <button
      onClick={toggleLang}
      style={{
        background: 'none',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-full)',
        padding: '4px 12px',
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        fontFamily: 'var(--font-plex-mono), monospace',
      }}
    >
      {lang === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
    </button>
  )
}