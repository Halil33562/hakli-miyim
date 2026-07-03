// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useSidebar } from '@/context/SidebarContext'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { useTranslation } from '@/lib/useTranslation'

export default function Navbar() {
  const { user, loading, signOut } = useAuth()
  const { toggle } = useSidebar()
  const { toggleLang } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()

  return (
    <nav style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '16px 28px', 
      borderBottom: '1px solid var(--border)', 
      background: 'var(--surface)' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button onClick={toggle} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px', color: 'var(--text-secondary)' }}>
          ☰
        </button>
        <Link href="/" style={{ fontFamily: 'var(--font-fraunces), sans-serif', fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)' }}>
          {t('app.title')}
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
        <button onClick={toggleTheme} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '6px 10px', fontSize: '15px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button onClick={toggleLang} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '6px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-plex-mono), monospace' }}>
          🇬🇧 EN
        </button>
        {loading ? null : user ? (
          <button onClick={signOut} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '7px 16px', color: 'var(--text-primary)', fontWeight: 500, background: 'transparent', cursor: 'pointer', fontSize: '13px' }}>
            {t('nav.logout')}
          </button>
        ) : (
          <>
            <Link href="/giris" style={{ color: 'var(--text-secondary)', fontWeight: 500, padding: '7px 10px' }}>{t('nav.login')}</Link>
            <Link href="/kayit" style={{ background: 'var(--brand)', color: '#fff', borderRadius: 'var(--radius-full)', padding: '8px 16px', fontWeight: 600 }}>{t('nav.register')}</Link>
          </>
        )}
      </div>
    </nav>
  )
}